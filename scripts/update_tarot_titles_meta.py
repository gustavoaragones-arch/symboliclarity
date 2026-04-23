#!/usr/bin/env python3
"""
Update <title> + meta description on tarot card pages with idempotent marker.
Run from project root: python3 scripts/update_tarot_titles_meta.py
"""

import os
import re

BASE_DIR = "tarot/meanings"

MARKER = "<!-- SC-SEO-TITLE -->"


def is_card_page(filepath: str) -> bool:
    """Only real card URLs (78), not meanings hub or suit hubs."""
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


def title_from_slug(slug):
    words = slug.split("-")
    return " ".join([w.capitalize() if w != "of" else "of" for w in words])


def build_title(card_name):
    return f"{card_name} Tarot Meaning — Love, Feelings, Yes or No"


def build_description(card_name):
    return (
        f"{card_name} tarot meaning explained. Explore love, feelings, yes or no "
        f"interpretations, and symbolic insights for reflection."
    )


def process_file(path):
    if not is_card_page(path):
        return

    with open(path, "r", encoding="utf-8") as f:
        html = f.read()

    # Skip if already processed
    if MARKER in html:
        print("Skipped:", path)
        return

    slug = path.replace("\\", "/").split("/")[-2]
    card_name = title_from_slug(slug)

    new_title = build_title(card_name)
    new_desc = build_description(card_name)

    # --- Update <title> ---
    html = re.sub(
        r"<title>.*?</title>",
        f"<title>{new_title}</title>\n{MARKER}",
        html,
        count=1,
        flags=re.DOTALL,
    )

    # --- Update or insert meta description ---
    if 'name="description"' in html:
        html = re.sub(
            r'<meta name="description"[^>]*>',
            f'<meta name="description" content="{new_desc}">',
            html,
            count=1,
        )
    else:
        # Insert after <title>
        html = html.replace(
            "</title>",
            f"</title>\n<meta name=\"description\" content=\"{new_desc}\">",
            1,
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(html)

    print("Updated:", path)


def main():
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(project_root)

    for root, _dirs, files in os.walk(BASE_DIR):
        if "index.html" in files:
            process_file(os.path.join(root, "index.html"))


if __name__ == "__main__":
    main()
