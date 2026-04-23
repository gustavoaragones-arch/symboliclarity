#!/usr/bin/env python3
"""
Append four additional snippet Q&A blocks after .snippet-list (SCEL layer).
Run from project root: python3 scripts/expand_snippet_coverage.py
"""

from __future__ import annotations

import os
import re

BASE_DIR = "tarot/meanings"
MARKER = "<!-- SC-SNIPPET-EXPANDED -->"

# Insert after snippet-list closes, before article intro.
SNIPPET_LIST_TO_INTRO = re.compile(
    r"(<section class=\"snippet-list\">[\s\S]*?</section>)(\s*)(<p class=\"article__intro\">)",
    re.MULTILINE,
)

H1_CARD = re.compile(r'<h1 class="article__title">([^<]+)</h1>')


def is_card_page(filepath: str) -> bool:
    filepath = filepath.replace("\\", "/")
    if "tarot/meanings/" not in filepath:
        return False
    dir_of_file = os.path.dirname(filepath)
    parts = dir_of_file.split("/")
    if len(parts) <= 2:
        return False
    if len(parts) == 3 and parts[-1] in ("wands", "cups", "swords", "pentacles"):
        return False
    return True


def title_from_slug(slug: str) -> str:
    words = slug.split("-")
    return " ".join(w.capitalize() if w != "of" else "of" for w in words)


def card_display_name(html: str, slug: str) -> str:
    m = H1_CARD.search(html)
    if m:
        return m.group(1).split("—")[0].strip()
    return title_from_slug(slug)


def build_extra(card: str) -> str:
    # STEP 1 copy from user prompt (definition-style, no links in snippets)
    return f"""{MARKER}
<section class="snippet-block">
  <h2>What does {card} mean in a reading?</h2>
  <p>
    {card} in a reading reflects a pattern of interpretation rather than a fixed outcome. It highlights how current actions, perception, and context shape meaning.
  </p>
</section>

<section class="snippet-block">
  <h2>What does {card} mean reversed?</h2>
  <p>
    {card} reversed suggests a shift in perspective, delay, or internalization of its core themes rather than a complete opposite meaning.
  </p>
</section>

<section class="snippet-block">
  <h2>Is {card} a positive or negative card?</h2>
  <p>
    {card} is not inherently positive or negative, but reflects a spectrum of interpretation depending on context, surrounding cards, and the question being asked.
  </p>
</section>

<section class="snippet-block">
  <h2>What does {card} represent emotionally?</h2>
  <p>
    {card} emotionally represents internal responses, perception, and how experiences are processed rather than fixed emotional outcomes.
  </p>
</section>
"""


def process_file(path: str) -> bool:
    if not is_card_page(path):
        return False

    with open(path, encoding="utf-8") as f:
        html = f.read()

    if MARKER in html:
        print("Skipped:", path)
        return False

    if not re.search(r'<section class="snippet-list">', html):
        print("No snippet-list:", path)
        return False

    slug = path.replace("\\", "/").split("/")[-2]
    card = card_display_name(html, slug)
    block = build_extra(card)

    html2, n = SNIPPET_LIST_TO_INTRO.subn(r"\1\2" + block + r"\2\3", html, count=1)
    if n != 1:
        print("Anchor mismatch:", path)
        return False

    with open(path, "w", encoding="utf-8") as f:
        f.write(html2)
    print("Updated:", path)
    return True


def main() -> None:
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root)
    n = 0
    for dirpath, _dirs, files in os.walk(BASE_DIR):
        if "index.html" not in files:
            continue
        path = os.path.join(dirpath, "index.html")
        if process_file(path):
            n += 1
    print("Done.", n, "files updated.")


if __name__ == "__main__":
    main()
