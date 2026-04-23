#!/usr/bin/env python3
"""
Insert featured-snippet-oriented blocks after the AEO direct-answer section.
Run from project root: python3 scripts/add_snippet_blocks.py
"""

from __future__ import annotations

import os
import re

BASE_DIR = "tarot/meanings"
MARKER = "<!-- SC-SNIPPET -->"

# Insert after direct-answer closes, before article intro (unique on card pages).
INSERT_RE = re.compile(
    r"(<!-- SC-AEO-GRAPH -->\s*\n\s*</section>\s*\n)(<p class=\"article__intro\">)",
    re.MULTILINE,
)


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


def build_blocks_default(card: str) -> str:
    """Four Q&A blocks; first sentence answers the H2 directly."""
    return f"""{MARKER}
<section class="snippet-block">
  <h2>What does {card} tarot card mean?</h2>
  <p>
    {card} names a symbolic pattern: a way of describing what you are noticing, choosing, or responding to in a situation. Readers use it to reflect on context and inner dynamics rather than to assert one fixed outcome. Meaning depends on the question, surrounding cards, and how you apply the card as a lens.
  </p>
</section>

<section class="snippet-block">
  <h2>Is {card} a yes or no card?</h2>
  <p>
    {card} is not a mechanical yes-or-no label. It can lean toward yes or no depending on context, tone, and what the spread emphasizes. Its primary job is to highlight leverage points, emotional posture, and what deserves attention before you simplify the reading into a single direction.
  </p>
</section>

<section class="snippet-block">
  <h2>What does {card} mean in love?</h2>
  <p>
    In love readings, {card} highlights emotional subtext, communication habits, and the roles people are rehearsing in intimacy. It clarifies patterns in how connection forms, cools, or repairs rather than promising a predetermined romantic result.
  </p>
</section>

<section class="snippet-block">
  <h2>What does {card} represent spiritually?</h2>
  <p>
    Spiritually, {card} points to inner alignment: how meaning is carried through attention, values, and practice. It frames growth as relationship to self and mystery rather than as a checklist of certainty or external proof.
  </p>
</section>
"""


def build_blocks_the_magician() -> str:
    return f"""{MARKER}
<section class="snippet-block">
  <h2>What does The Magician tarot card mean?</h2>
  <p>
    The Magician represents action, skill, and the ability to turn ideas into reality. It reflects focused intention, resourcefulness, and conscious creation rather than passive outcomes.
  </p>
</section>

<section class="snippet-block">
  <h2>Is The Magician a yes or no card?</h2>
  <p>
    The Magician is generally interpreted as a yes, indicating capability, initiative, and alignment between intention and action when approached with clarity.
  </p>
</section>

<section class="snippet-block">
  <h2>What does The Magician mean in love?</h2>
  <p>
    In love readings, The Magician reflects attraction, communication, and the active shaping of a relationship through intention and effort.
  </p>
</section>

<section class="snippet-block">
  <h2>What does The Magician represent spiritually?</h2>
  <p>
    Spiritually, The Magician symbolizes awareness of personal power and the connection between thought, action, and manifestation.
  </p>
</section>
"""


def build_blocks_the_fool() -> str:
    return f"""{MARKER}
<section class="snippet-block">
  <h2>What does The Fool tarot card mean?</h2>
  <p>
    The Fool represents beginnings, openness, and the willingness to step into the unknown with curiosity. It reflects potential in motion rather than a promise that the path is risk-free or already mapped.
  </p>
</section>

<section class="snippet-block">
  <h2>Is The Fool a yes or no card?</h2>
  <p>
    The Fool is often interpreted as leaning yes for questions about a new start, honest risk, or moving forward without perfect certainty. It still invites pairing enthusiasm with awareness of context and consequences.
  </p>
</section>

<section class="snippet-block">
  <h2>What does The Fool mean in love?</h2>
  <p>
    In love readings, The Fool reflects fresh energy, playful curiosity, and the willingness to explore connection without rushing to define the outcome.
  </p>
</section>

<section class="snippet-block">
  <h2>What does The Fool represent spiritually?</h2>
  <p>
    Spiritually, The Fool symbolizes trust in unfolding experience and the courage to meet life as a learner rather than as someone who must control every variable first.
  </p>
</section>
"""


SNIPPET_BY_SLUG: dict[str, str] = {
    "the-magician": build_blocks_the_magician(),
    "the-fool": build_blocks_the_fool(),
}


def build_blocks(slug: str, card: str) -> str:
    if slug in SNIPPET_BY_SLUG:
        return SNIPPET_BY_SLUG[slug]
    return build_blocks_default(card)


def process_file(path: str) -> bool:
    if not is_card_page(path):
        return False

    with open(path, encoding="utf-8") as f:
        html = f.read()

    if MARKER in html:
        print("Skipped:", path)
        return False

    m = INSERT_RE.search(html)
    if not m:
        print("No insert anchor (SC-AEO-GRAPH / article__intro):", path)
        return False

    slug = path.replace("\\", "/").split("/")[-2]
    card = title_from_slug(slug)
    block = build_blocks(slug, card)
    html = INSERT_RE.sub(r"\1" + block + "\n" + r"\2", html, count=1)

    with open(path, "w", encoding="utf-8") as f:
        f.write(html)

    print("Updated:", path)
    return True


def main() -> None:
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(project_root)

    n = 0
    for root, _dirs, files in os.walk(BASE_DIR):
        if "index.html" not in files:
            continue
        path = os.path.join(root, "index.html")
        if process_file(path):
            n += 1
    print(f"Done. {n} files updated.")


if __name__ == "__main__":
    main()
