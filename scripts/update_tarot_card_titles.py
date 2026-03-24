#!/usr/bin/env python3
"""
Update <title>, meta description, and og:title on all 78 tarot card pages.
Run: python3 scripts/update_tarot_card_titles.py
"""

from __future__ import annotations

import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(BASE)


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
    parts = slug.split("-")
    out = []
    for i, w in enumerate(parts):
        if w == "of":
            out.append("of")
        elif i == 0 and w == "the":
            out.append("The")
        else:
            out.append(w.capitalize())
    return " ".join(out)


def meta_description(card_name: str) -> str:
    return (
        f"{card_name} tarot meaning explained. Explore love, feelings, yes or no interpretations, "
        f"and symbolic insights for reflection."
    )


def page_title(card_name: str) -> str:
    return f"{card_name} Tarot Meaning (Love, Feelings, Yes or No)"


def process_file(path: str, dry: bool) -> bool:
    rel = path.replace("\\", "/")
    slug = rel.split("/")[-2]
    card_name = title_from_slug(slug)
    new_title = page_title(card_name)
    new_desc = meta_description(card_name)

    with open(path, encoding="utf-8") as f:
        html = f.read()

    html2 = html
    html2 = re.sub(
        r"<title>[^<]*</title>",
        f"<title>{new_title}</title>",
        html2,
        count=1,
    )
    html2 = re.sub(
        r'<meta name="description" content="[^"]*"\s*/?>',
        f'<meta name="description" content="{new_desc}">',
        html2,
        count=1,
    )
    html2 = re.sub(
        r'<meta property="og:title" content="[^"]*"\s*/?>',
        f'<meta property="og:title" content="{new_title}">',
        html2,
        count=1,
    )
    # Align Article JSON-LD headline with page title when present
    html2 = re.sub(
        r'"headline":\s*"[^"]*"',
        f'"headline": "{new_title}"',
        html2,
        count=1,
    )

    if html2 == html:
        print(f"No change: {path}")
        return False

    if not dry:
        with open(path, "w", encoding="utf-8") as f:
            f.write(html2)
    print(f"{'Would update' if dry else 'Updated'}: {path}")
    return True


def main() -> None:
    dry = "--dry-run" in sys.argv
    n = 0
    for root, _, files in os.walk("tarot/meanings"):
        if "index.html" not in files:
            continue
        path = os.path.join(root, "index.html")
        if not is_card_page(path):
            continue
        if process_file(path, dry):
            n += 1
    print(f"Done. {n} files {'would be ' if dry else ''}updated.")


if __name__ == "__main__":
    main()
