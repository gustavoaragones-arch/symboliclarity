#!/usr/bin/env python3
"""
Rebuild SC-SNIPPET region: strong definition-style openings, snippet-list from Core Themes,
optional FAQ yes/no lead for pages that include that FAQ pair.

Run from project root: python3 scripts/upgrade_snippet_dominance.py
"""

from __future__ import annotations

import os
import re

BASE_DIR = "tarot/meanings"
MARKER = "<!-- SC-SNIPPET -->"

# Slugs where a “caution / pause” yes-no voice fits better than a blanket “yes”.
CAUTION_SLUGS = frozenset(
    {
        "the-tower",
        "the-devil",
        "death",
        "the-moon",
        "the-hanged-man",
        "ten-of-swords",
        "nine-of-swords",
        "eight-of-swords",
        "seven-of-swords",
        "five-of-swords",
        "three-of-swords",
        "five-of-cups",
        "eight-of-cups",
        "seven-of-cups",
        "five-of-pentacles",
    }
)

SNIPPET_REGION = re.compile(
    r"<!-- SC-SNIPPET -->[\s\S]*?(?=<p class=\"article__intro\">)",
    re.MULTILINE,
)

DIRECT_ANSWER_P = re.compile(
    r'<section class="direct-answer"[^>]*>.*?<h2[^>]*>.*?</h2>\s*<p>\s*([\s\S]*?)\s*</p>',
    re.DOTALL,
)

CORE_THEMES_UL = re.compile(
    r'<h2 id="core-themes-heading">.*?</h2>\s*<ul>([\s\S]*?)</ul>',
    re.DOTALL,
)

H1_TITLE = re.compile(r'<h1 class="article__title">([^<]+)</h1>')


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


def card_display_name(html: str) -> str:
    m = H1_TITLE.search(html)
    if not m:
        return ""
    return m.group(1).split("—")[0].strip()


def slug_from_path(path: str) -> str:
    rel = path.replace("\\", "/")
    parent = os.path.basename(os.path.dirname(rel))
    grand = os.path.basename(os.path.dirname(os.path.dirname(rel)))
    if grand in ("wands", "cups", "swords", "pentacles"):
        return f"{grand}/{parent}"
    return parent


def suit_zone(path: str) -> str:
    p = path.replace("\\", "/")
    if "/cups/" in p:
        return "cups"
    if "/wands/" in p:
        return "wands"
    if "/swords/" in p:
        return "swords"
    if "/pentacles/" in p:
        return "pentacles"
    return "major"


def extract_mean_line(html: str, card: str) -> str:
    m = DIRECT_ANSWER_P.search(html)
    if not m:
        return f"{card} tarot card means focused symbolic reflection that depends on your question and context."
    raw = m.group(1)
    raw = raw.split("This interpretation reflects")[0].strip()
    raw = raw.replace("\n", " ")
    raw = re.sub(r"\s+", " ", raw)
    # First sentence only
    parts = re.split(r"(?<=[\.\!])\s+", raw)
    first = parts[0].strip() if parts else raw
    low = first.lower()
    c_low = card.lower()
    if low.startswith(c_low + " represents "):
        rest = first[len(card) + len(" represents ") :]
        return f"{card} tarot card means {rest}".strip()
    if " represents " in first and c_low in low[: len(c_low) + 6]:
        rest = first.split(" represents ", 1)[1]
        return f"{card} tarot card means {rest}".strip()
    return f"{card} tarot card means {first}".strip()


def extract_keywords(html: str, card: str) -> list[str]:
    m = CORE_THEMES_UL.search(html)
    if not m:
        return [
            "Symbolic reflection",
            "Context in readings",
            "Inner patterns",
            "Choice and pacing",
        ]
    items = re.findall(r"<li>([^<]+)</li>", m.group(1))
    cleaned = [re.sub(r"\s+", " ", x.strip()) for x in items if x.strip()]
    out = cleaned[:4]
    while len(out) < 4:
        out.append("Reflective interpretation")
    return out[:4]


def build_yes_no(card: str, slug: str) -> str:
    if slug in CAUTION_SLUGS:
        return (
            f"{card} is usually read as a caution-first signal, not a simple yes, naming tension, "
            f"delay, or cleanup you acknowledge before you choose a direction. "
            f"It still rewards context: position, reversal, and surrounding cards shape how far a yes or no reading should go."
        )
    return (
        f"{card} is generally a yes tarot card, representing capability, initiative, and aligned action "
        f"when the situation rewards honesty and follow-through. "
        f"Readers still weigh reversal, spread position, and neighboring cards before treating any draw as final."
    )


def build_love(card: str, zone: str, slug: str) -> str:
    if slug in CAUTION_SLUGS:
        return (
            f"{card} in love represents the stretch point where honesty reshapes a bond—clarity, rupture, or a needed reset—"
            f"and what becomes possible when pretense drops. It frames how intimacy responds to truth rather than fantasy."
        )
    z = {
        "cups": "emotional openness, repair, and the conversations that change what can be felt safely",
        "wands": "attraction, momentum, and the courage to pursue desire with honesty",
        "swords": "truth, boundaries, and the language you use when feelings meet friction",
        "pentacles": "stability, loyalty, and practical care that keeps partnership grounded",
        "major": "choice, pacing, and how two people translate attraction into accountable connection",
    }[zone]
    return (
        f"{card} in love represents {z}. "
        f"It frames how connection moves when needs stay visible and actions match words."
    )


def build_spiritual(card: str, zone: str, slug: str) -> str:
    if slug in CAUTION_SLUGS:
        return (
            f"{card} spiritually represents shadow work, release, and the integrity of naming what is true "
            f"even when the ego wants delay. It ties inner clarity to how you meet difficulty without self-deception."
        )
    if zone == "cups":
        tail = "emotional truth, receptivity, and the inner work of letting feeling inform values without drowning them."
    elif zone == "wands":
        tail = "creative will, courage, and the sense of purpose that turns desire into disciplined motion."
    elif zone == "swords":
        tail = "mental clarity, integrity of thought, and the practice of naming what is true without cruelty."
    elif zone == "pentacles":
        tail = "embodied values, stewardship, and the quiet discipline of building a life that matches what you claim to want."
    else:
        tail = "awareness of purpose, attention as practice, and the link between inner conviction and daily behavior."
    return f"{card} spiritually represents {tail}"


def mean_second_sentence(card: str, mean_first: str) -> str:
    # One tight follow line; avoid repeating the first sentence opener.
    if "Magician" in card and "action" in mean_first:
        return "It reflects focused intention, resourcefulness, and conscious creation rather than passive outcomes."
    return (
        "It keeps interpretation tied to situation, spread position, and the story the surrounding cards tell."
    )


def magician_override_blocks() -> str:
    return f"""{MARKER}
<section class="snippet-block">
  <h2>What does The Magician tarot card mean?</h2>
  <p>
    The Magician tarot card means action, skill, and the ability to turn ideas into reality. It reflects focused intention, resourcefulness, and conscious creation rather than passive outcomes.
  </p>
</section>

<section class="snippet-block">
  <h2>Is The Magician a yes or no card?</h2>
  <p>
    The Magician is generally a yes tarot card, representing capability, initiative, and aligned action when you approach the question with clarity and follow-through.
  </p>
</section>

<section class="snippet-block">
  <h2>What does The Magician mean in love?</h2>
  <p>
    The Magician in love represents attraction, communication, and the active creation of connection when intention and behavior stay aligned.
  </p>
</section>

<section class="snippet-block">
  <h2>What does The Magician represent spiritually?</h2>
  <p>
    The Magician spiritually represents awareness of personal power and the connection between thought and action.
  </p>
</section>
"""


def fool_override_blocks() -> str:
    return f"""{MARKER}
<section class="snippet-block">
  <h2>What does The Fool tarot card mean?</h2>
  <p>
    The Fool tarot card means beginnings, curiosity, and the willingness to step forward before the path is fully mapped. It reflects openness and potential in motion rather than a promise of risk-free outcomes.
  </p>
</section>

<section class="snippet-block">
  <h2>Is The Fool a yes or no card?</h2>
  <p>
    The Fool is generally a yes tarot card, representing a green light to start, experiment, and trust the next step when your question is about movement and honest risk.
  </p>
</section>

<section class="snippet-block">
  <h2>What does The Fool mean in love?</h2>
  <p>
    The Fool in love represents fresh energy, playful curiosity, and the willingness to explore connection without rushing to define the outcome.
  </p>
</section>

<section class="snippet-block">
  <h2>What does The Fool represent spiritually?</h2>
  <p>
    The Fool spiritually represents trust in becoming—meeting life as a learner and letting experience deepen meaning without demanding total control first.
  </p>
</section>
"""


def build_snippet_blob(html: str, path: str) -> str | None:
    if MARKER not in html:
        return None
    slug = slug_from_path(path)
    card = card_display_name(html)
    if not card:
        return None

    if slug == "the-magician":
        body = magician_override_blocks()
    elif slug == "the-fool":
        body = fool_override_blocks()
    else:
        mean_first = extract_mean_line(html, card)
        mean_para = mean_first + " " + mean_second_sentence(card, mean_first)
        zone = suit_zone(path)
        body = f"""{MARKER}
<section class="snippet-block">
  <h2>What does {card} tarot card mean?</h2>
  <p>
    {mean_para}
  </p>
</section>

<section class="snippet-block">
  <h2>Is {card} a yes or no card?</h2>
  <p>
    {build_yes_no(card, slug)}
  </p>
</section>

<section class="snippet-block">
  <h2>What does {card} mean in love?</h2>
  <p>
    {build_love(card, zone, slug)}
  </p>
</section>

<section class="snippet-block">
  <h2>What does {card} represent spiritually?</h2>
  <p>
    {build_spiritual(card, zone, slug)}
  </p>
</section>
"""

    kws = extract_keywords(html, card)
    lis = "\n".join(f"    <li>{html_escape_li(k)}</li>" for k in kws)
    snippet_list = f"""
<section class="snippet-list">
  <h2>{html_escape_li(card)} keywords</h2>
  <ul>
{lis}
  </ul>
</section>

"""
    return body + snippet_list


def html_escape_li(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;")


def patch_faq_yes_no(html: str, card: str) -> str:
    """If the page has the yes/no FAQ pair, strengthen the opening sentence."""
    dt_pat = rf"<dt>Is {re.escape(card)} a yes or no card\?</dt>\s*<dd>"
    m = re.search(dt_pat, html)
    if not m:
        return html
    if card == "The Magician":
        new_dd = (
            "Yes, The Magician is generally considered a yes tarot card. "
            "It reflects readiness, clarity, and the ability to move forward with intention, "
            "particularly when the question involves action or initiative."
        )
    else:
        new_dd = (
            f"Yes, {card} is generally considered a yes tarot card. "
            "Use surrounding cards and position to refine tone, timing, and what action would actually look like."
        )
    return re.sub(
        rf"(<dt>Is {re.escape(card)} a yes or no card\?</dt>\s*<dd>)([\s\S]*?)(</dd>)",
        r"\1" + new_dd + r"\3",
        html,
        count=1,
    )


def process_file(path: str) -> bool:
    if not is_card_page(path):
        return False
    with open(path, encoding="utf-8") as f:
        html = f.read()
    blob = build_snippet_blob(html, path)
    if not blob:
        print("Skip (no snippet marker):", path)
        return False
    html2 = SNIPPET_REGION.sub(blob, html, count=1)
    if html2 == html:
        print("Skip (pattern mismatch):", path)
        return False
    html2 = patch_faq_yes_no(html2, card_display_name(html))
    with open(path, "w", encoding="utf-8") as f:
        f.write(html2)
    print("Updated:", path)
    return True


def main() -> None:
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root_dir)
    n = 0
    for dirpath, _dirs, files in os.walk(BASE_DIR):
        if "index.html" not in files:
            continue
        path = os.path.join(dirpath, "index.html")
        if process_file(path):
            n += 1
    print("Done.", n, "files.")


if __name__ == "__main__":
    main()
