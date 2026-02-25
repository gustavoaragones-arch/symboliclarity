# Phase 6.3 — Crawl Depth & Link Distribution Audit

**Audit date:** 2026-02-12  
**Scope:** `/tarot/meanings/` (83 HTML files: 1 main hub, 4 suit hubs, 22 Major, 56 Minor)

---

## Step 1 — Internal Link Density Scan

### Internal inlinks (how many pages link TO this page)

| Metric | Result |
|--------|--------|
| **Ideal** | 15+ inlinks per card |
| **Flag if** | <10 inlinks |
| **Check if** | 35+ inlinks (imbalance) |

**Hub inlinks (structural gravity):**

| URL | Inlinks | Status |
|-----|---------|--------|
| `/tarot/meanings/` | **241** | ✅ Very high — primary hub |
| `/tarot/meanings/wands/` | 59 | ✅ Strong |
| `/tarot/meanings/cups/` | 61 | ✅ Strong |
| `/tarot/meanings/swords/` | 60 | ✅ Strong |
| `/tarot/meanings/pentacles/` | 57 | ✅ Strong |

**Pages with <10 inlinks (under-linked — FLAG):**

| Page | Inlinks | Note |
|------|---------|------|
| Wheel of Fortune | **3** | Severe under-link |
| King of Cups | 5 | Under-linked |
| The Hierophant | 6 | Under-linked |
| King of Wands | 6 | Under-linked |
| Temperance | 7 | Under-linked |
| Judgement | 7 | Under-linked |

**No page has 35+ inlinks** — no over-link clustering to correct.

### Internal outlinks (links FROM each page)

| Metric | Result |
|--------|--------|
| **Target range** | 12–20 outlinks per card page |
| **Actual** | Most card pages: 17–20; a few 18–21; The Sun: 11 |

**Outlink summary:**

- **Major Arcana:** 11 (The Sun) to 17; Wheel 22 (incl. Temperance link). Most = 17.
- **Minor Arcana (Cups/Swords/Wands):** 18–19 per page.
- **Minor Arcana (Pentacles):** 18–21 per page.
- **Suit hubs:** 18 each (nav + 14 card links + Tarot/Meanings/Three-Card).
- **Main meanings index:** 30 internal links (22 Major + 4 suit hubs + others).

**Low outlink:** The Sun has 11 internal outlinks — slightly below 12–20 band; consider one or two more contextual links if content allows.

---

## Step 2 — Hub Strength Check

**Result: PASS**

The five hubs have very high internal inlink counts (57–241). Every Minor card page and every Major page links to the Tarot Meaning Library (`/tarot/meanings/`), and every Minor page links to its suit hub. Hubs are strong structural gravity centers.

---

## Step 3 — Overused Major Arcana Check

**Inlink spread (Major Arcana only):**

| Card | Inlinks | Ratio vs lowest (3) |
|------|---------|---------------------|
| The Fool | 29 | 9.7× |
| The Hermit | 25 | 8.3× |
| The Star | 23 | 7.7× |
| The World | 21 | 7× |
| The Emperor | 20 | 6.7× |
| High Priestess | 19 | 6.3× |
| The Chariot | 19 | 6.3× |
| The Tower | 17 | 5.7× |
| The Magician | 17 | 5.7× |
| The Lovers | 17 | 5.7× |
| Death | 17 | 5.7× |
| The Sun | 16 | 5.3× |
| The Empress | 15 | 5× |
| The Moon | 14 | 4.7× |
| Strength | 13 | 4.3× |
| The Devil | 11 | 3.7× |
| The Hanged Man | 9 | 3× |
| Temperance | 7 | 2.3× |
| Judgement | 7 | 2.3× |
| The Hierophant | 6 | 2× |
| Wheel of Fortune | 3 | 1× (lowest) |

**Assessment:** No single Major has 2× the median, but **distribution is uneven**:

- **High:** The Fool (29), The Hermit (25), The Star (23) — used often in Phase 6.2 as “beginning,” “inner light,” “hope.”
- **Low:** Wheel of Fortune (3), The Hierophant (6), Judgement (7), Temperance (7).

**Recommendation:** Optional rebalance: add 1–2 contextual links *to* Wheel of Fortune, Judgement, Temperance, and The Hierophant from other Major or Minor pages where thematically natural (e.g. change/cycles → Wheel; balance → Temperance; reckoning → Judgement; tradition → Hierophant). No need to remove links from The Fool/Hermit/Star.

---

## Step 4 — Navigation Loop Validation

**Major Arcana loop:** ✅ **Works**

- The Fool: “← Previous: The World” and “Next: The Magician →”.
- Sequential prev/next is present across Major pages (Fool ↔ Magician ↔ … ↔ World ↔ Fool).

**Suit loops:** ✅ **Work**

- Each suit hub lists all 14 cards (Ace through King).
- Each card page includes in-content links to other cards in the same suit and prev/next in sequence (e.g. Ace ← King → Two, Ten → Page).
- No broken cycles observed.

---

## Step 5 — Crawl Depth Validation

**Target:** All 78 cards reachable in **≤3 clicks** from homepage (Home → Tarot → Meanings → Card).

**Current paths:**

| Path | Clicks | Status |
|------|--------|--------|
| Home → Tarot → Meanings → **[Major card]** | 3 | ✅ |
| Home → Tarot → Meanings → **[Suit hub]** → **[Minor card]** | 4 | ⚠️ |

- **Major Arcana (22):** Depth = 3. Main meanings hub links to all 22.
- **Minor Arcana (56):** Depth = 4. Main meanings hub links only to the four suit hubs; each suit hub links to its 14 cards.

**Gap:** To meet “all 78 cards in ≤3 clicks,” the main `/tarot/meanings/` page would need to expose direct links to all 56 Minor cards (e.g. a second grid or “All 78 cards” section). Alternatively, the requirement can be interpreted as “≤3 clicks to the Meanings section, then one more to any card,” in which case depth-4 for Minor is acceptable.

**Recommendation:**

1. **Strict (≤3 to every card):** Add a section on `/tarot/meanings/index.html` such as “All 78 cards” with 56 links to Minor cards (grouped by suit), so every card is reachable in 3 clicks.
2. **Relaxed (depth 4 for Minor):** Keep current structure; document that Minor cards are at depth 4 by design (suit hubs as intermediary).

---

## Summary

| Check | Status | Action |
|-------|--------|--------|
| Hub strength | ✅ Pass | None |
| Over-linked targets (35+) | ✅ None | None |
| Under-linked (<10 inlinks) | ⚠️ 6 pages | Optional: add 1–2 inlinks to Wheel, Judgement, Temperance, Hierophant, King of Cups, King of Wands |
| Major Arcana balance | ⚠️ Uneven | Optional: add links to low-inlink Majors where thematic |
| Navigation loops | ✅ Pass | None |
| Crawl depth (78 at ≤3) | ⚠️ Minor at 4 | Add “All 78” links on main hub, or accept depth 4 for Minor |
| Outlink range 12–20 | ✅ Mostly | The Sun has 11; consider 1–2 more links |

**Conclusion:** Link density is broadly balanced, hubs are strong, and there are no orphan risks. Optional improvements: (1) add direct links to all 56 Minor cards from the main meanings page if strict ≤3-click depth is required; (2) lightly increase inlinks to the six under-linked pages and to low-inlink Majors; (3) add 1–2 internal links on The Sun to bring outlinks into the 12–20 band.
