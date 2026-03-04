/**
 * Symboliclarity — App JavaScript
 * Minimal vanilla JS only when necessary.
 */

document.addEventListener("DOMContentLoaded", function () {

  /* Daily Reflection Generator — deterministic by day of year */
  const dailyContainer = document.getElementById("dailyReflectionContent");
  const dailySaveBlock = document.querySelector(".reflection-save[data-reflection-id=\"daily-reflection\"]");

  if (dailyContainer) {

    function dayOfYear(d) {
      var start = new Date(d.getFullYear(), 0, 0);
      var diff = d - start;
      return Math.floor(diff / 86400000);
    }

    var majorNames = ["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"];
    var majorSlugs = ["the-fool", "the-magician", "the-high-priestess", "the-empress", "the-emperor", "the-hierophant", "the-lovers", "the-chariot", "strength", "the-hermit", "wheel-of-fortune", "justice", "the-hanged-man", "death", "temperance", "the-devil", "the-tower", "the-star", "the-moon", "the-sun", "judgement", "the-world"];
    var suits = ["wands", "cups", "swords", "pentacles"];
    var ranks = ["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "page", "knight", "queen", "king"];
    var rankLabels = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
    var suitLabels = ["Wands", "Cups", "Swords", "Pentacles"];

    var tarot78 = [];
    for (var i = 0; i < 22; i++) {
      tarot78.push({ name: majorNames[i], url: "/tarot/meanings/" + majorSlugs[i] + "/" });
    }
    for (var s = 0; s < 4; s++) {
      for (var r = 0; r < 14; r++) {
        var label = rankLabels[r] + " of " + suitLabels[s];
        var slug = suits[s] + "/" + rankLabels[r].toLowerCase().replace(/ /g, "-") + "-of-" + suits[s];
        tarot78.push({ name: label, url: "/tarot/meanings/" + slug + "/" });
      }
    }

    var numerologyThemes = [
      { tone: "Life Path 1 themes: initiative and new beginnings.", lifePath: 1 },
      { tone: "Life Path 2 themes: balance, partnership, and receptivity.", lifePath: 2 },
      { tone: "Life Path 3 themes: expression, creativity, and communication.", lifePath: 3 },
      { tone: "Life Path 4 themes: structure, stability, and foundation.", lifePath: 4 },
      { tone: "Life Path 5 themes: change, freedom, and movement.", lifePath: 5 },
      { tone: "Life Path 6 themes: care, responsibility, and harmony.", lifePath: 6 },
      { tone: "Life Path 7 themes: introspection and insight.", lifePath: 7 },
      { tone: "Life Path 8 themes: authority, abundance, and impact.", lifePath: 8 },
      { tone: "Life Path 9 themes: completion, compassion, and release.", lifePath: 9 }
    ];

    var reflectionPrompts = [
      "What one step could you take today that aligns with a new beginning?",
      "Where might balance or partnership support you today?",
      "What wants to be expressed or created today?",
      "What small structure or habit would steady you today?",
      "What change are you ready to acknowledge or lean into?",
      "Where can you offer care — or receive it — today?",
      "What truth might become clearer if you paused before acting today?",
      "Where can you use your influence or energy with intention today?",
      "What might you be ready to complete or release today?"
    ];

    var today = new Date();
    var doy = dayOfYear(today);
    var tarotIndex = doy % 78;
    var numIndex = doy % 9;
    var card = tarot78[tarotIndex];
    var theme = numerologyThemes[numIndex];
    var prompt = reflectionPrompts[numIndex];

    var dateStr = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
    if (dailySaveBlock) { dailySaveBlock.dataset.date = dateStr; }

    dailyContainer.innerHTML =
      "<section class=\"daily-reflect__section\" aria-labelledby=\"daily-tarot-heading\"><h2 id=\"daily-tarot-heading\">Today's Tarot Focus</h2><p class=\"daily-reflect__card\"><strong>" + card.name + "</strong></p><p><a href=\"" + card.url + "\">Explore " + card.name + " meaning</a></p></section>" +
      "<section class=\"daily-reflect__section\" aria-labelledby=\"daily-num-heading\"><h2 id=\"daily-num-heading\">Today's Numerology Tone</h2><p>" + theme.tone + "</p><p><a href=\"/numerology/life-path/" + theme.lifePath + "/\">Explore Life Path " + theme.lifePath + "</a></p></section>" +
      "<section class=\"daily-reflect__section\" aria-labelledby=\"daily-prompt-heading\"><h2 id=\"daily-prompt-heading\">Reflection Prompt</h2><p class=\"daily-reflect__prompt\">" + prompt + "</p></section>" +
      "<section class=\"daily-reflect__section\" aria-labelledby=\"daily-journal-heading\"><h2 id=\"daily-journal-heading\">Journal Prompt</h2><p>Write your thoughts below.</p></section>" +
      "<section class=\"daily-reflect__section\" aria-labelledby=\"daily-explore-heading\"><h2 id=\"daily-explore-heading\">Explore further</h2><p class=\"daily-reflect__explore\"><a href=\"" + card.url + "\">Explore " + card.name + " meaning</a> · <a href=\"/numerology/life-path/" + theme.lifePath + "/\">Explore Life Path " + theme.lifePath + "</a> · <a href=\"/tarot/three-card-reading.html\">Try a three-card reflection</a></p></section>";
  }

  const relatedMaps = {

    lifePath: {
      "1": [
        { label: "Life Path 2", url: "/numerology/life-path/2/" },
        { label: "Life Path 8", url: "/numerology/life-path/8/" },
        { label: "The Magician (Tarot)", url: "/tarot/meanings/the-magician/" }
      ],
      "2": [
        { label: "Life Path 11", url: "/numerology/life-path/11/" },
        { label: "Life Path 6", url: "/numerology/life-path/6/" },
        { label: "The High Priestess (Tarot)", url: "/tarot/meanings/the-high-priestess/" }
      ],
      "3": [
        { label: "Life Path 6", url: "/numerology/life-path/6/" },
        { label: "Life Path 9", url: "/numerology/life-path/9/" },
        { label: "The Empress (Tarot)", url: "/tarot/meanings/the-empress/" }
      ],
      "4": [
        { label: "Life Path 22", url: "/numerology/life-path/22/" },
        { label: "Life Path 5", url: "/numerology/life-path/5/" },
        { label: "The Emperor (Tarot)", url: "/tarot/meanings/the-emperor/" }
      ],
      "5": [
        { label: "Life Path 4", url: "/numerology/life-path/4/" },
        { label: "Life Path 7", url: "/numerology/life-path/7/" },
        { label: "Five of Wands (Tarot)", url: "/tarot/meanings/wands/five-of-wands/" }
      ],
      "6": [
        { label: "Life Path 9", url: "/numerology/life-path/9/" },
        { label: "Life Path 2", url: "/numerology/life-path/2/" },
        { label: "The Lovers (Tarot)", url: "/tarot/meanings/the-lovers/" }
      ],
      "7": [
        { label: "Life Path 8", url: "/numerology/life-path/8/" },
        { label: "Life Path 11", url: "/numerology/life-path/11/" },
        { label: "The Hermit (Tarot)", url: "/tarot/meanings/the-hermit/" }
      ],
      "8": [
        { label: "Life Path 4", url: "/numerology/life-path/4/" },
        { label: "Life Path 22", url: "/numerology/life-path/22/" },
        { label: "Strength (Tarot)", url: "/tarot/meanings/strength/" }
      ],
      "9": [
        { label: "Life Path 6", url: "/numerology/life-path/6/" },
        { label: "Life Path 11", url: "/numerology/life-path/11/" },
        { label: "Nine of Cups (Tarot)", url: "/tarot/meanings/cups/nine-of-cups/" }
      ],
      "11": [
        { label: "Life Path 2", url: "/numerology/life-path/2/" },
        { label: "Life Path 7", url: "/numerology/life-path/7/" },
        { label: "The Star (Tarot)", url: "/tarot/meanings/the-star/" }
      ],
      "22": [
        { label: "Life Path 4", url: "/numerology/life-path/4/" },
        { label: "Life Path 8", url: "/numerology/life-path/8/" },
        { label: "The World (Tarot)", url: "/tarot/meanings/the-world/" }
      ]
    },

    compatibility: {
      "1-2": [
        { label: "Life Path 1", url: "/numerology/life-path/1/" },
        { label: "Life Path 2", url: "/numerology/life-path/2/" },
        { label: "The Magician (Tarot)", url: "/tarot/meanings/the-magician/" }
      ],
      "4-5": [
        { label: "Life Path 4", url: "/numerology/life-path/4/" },
        { label: "Life Path 5", url: "/numerology/life-path/5/" },
        { label: "The Emperor (Tarot)", url: "/tarot/meanings/the-emperor/" }
      ],
      "6-9": [
        { label: "Life Path 6", url: "/numerology/life-path/6/" },
        { label: "Life Path 9", url: "/numerology/life-path/9/" },
        { label: "The Hermit (Tarot)", url: "/tarot/meanings/the-hermit/" }
      ],
      "7-8": [
        { label: "Life Path 7", url: "/numerology/life-path/7/" },
        { label: "Life Path 8", url: "/numerology/life-path/8/" },
        { label: "Strength (Tarot)", url: "/tarot/meanings/strength/" }
      ],
      "11-2": [
        { label: "Life Path 11", url: "/numerology/life-path/11/" },
        { label: "Life Path 2", url: "/numerology/life-path/2/" },
        { label: "The High Priestess (Tarot)", url: "/tarot/meanings/the-high-priestess/" }
      ],
      "22-4": [
        { label: "Life Path 22", url: "/numerology/life-path/22/" },
        { label: "Life Path 4", url: "/numerology/life-path/4/" },
        { label: "The World (Tarot)", url: "/tarot/meanings/the-world/" }
      ]
    }

  };

  const blocks = document.querySelectorAll(".related-explore");

  blocks.forEach(function (block) {

    const context = block.dataset.context;
    const id = block.dataset.id;

    if (!relatedMaps[context] || !relatedMaps[context][id]) return;

    const items = relatedMaps[context][id];

    const container = document.createElement("section");
    container.className = "related-section";

    const heading = document.createElement("h2");
    heading.textContent = "You Might Also Explore";

    const list = document.createElement("ul");

    items.forEach(function (item) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = item.url;
      a.textContent = item.label;
      li.appendChild(a);
      list.appendChild(li);
    });

    container.appendChild(heading);
    container.appendChild(list);

    block.appendChild(container);

    requestAnimationFrame(function () {
      container.classList.add("is-visible");
    });

  });

  /* Phase 9.2 — Reflection Save (local only) */
  const reflectionBlocks = document.querySelectorAll(".reflection-save");

  reflectionBlocks.forEach(function (block) {

    const toggleBtn = block.querySelector(".reflection-toggle");
    const area = block.querySelector(".reflection-area");
    const textarea = block.querySelector("textarea");
    const rid = block.dataset.reflectionId;
    const storageKey = (rid === "daily-reflection" && block.dataset.date) ? ("sc_reflection_daily_" + block.dataset.date) : ("sc_reflection_" + rid);

    if (!toggleBtn || !area || !textarea) return;

    const savedText = localStorage.getItem(storageKey);
    if (savedText) {
      area.classList.remove("hidden");
      textarea.value = savedText;
      toggleBtn.textContent = "Hide Reflection";
      toggleBtn.setAttribute("aria-expanded", "true");
    } else {
      toggleBtn.setAttribute("aria-expanded", "false");
    }

    toggleBtn.addEventListener("click", function () {
      area.classList.toggle("hidden");

      if (!area.classList.contains("hidden")) {
        toggleBtn.textContent = "Hide Reflection";
      } else {
        toggleBtn.textContent = "Save Reflection";
      }
      toggleBtn.setAttribute("aria-expanded", String(!area.classList.contains("hidden")));
    });

    textarea.addEventListener("input", function () {
      localStorage.setItem(storageKey, textarea.value);
    });

  });

  /* Tarot Combination Explorer */
  const cards = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
    "Judgement", "The World"
  ];

  function slugFromCard(name) {
    return name.toLowerCase().replace(/ /g, "-");
  }

  const slugToCard = {};
  cards.forEach(function (card) {
    slugToCard[slugFromCard(card)] = card;
  });

  const cardA = document.getElementById("cardA");
  const cardB = document.getElementById("cardB");
  const result = document.getElementById("comboResult");

  if (cardA && cardB && result) {

    cards.forEach(function (card) {
      const optionA = document.createElement("option");
      optionA.value = card;
      optionA.textContent = card;
      const optionB = optionA.cloneNode(true);
      cardA.appendChild(optionA);
      cardB.appendChild(optionB);
    });

    function renderCombo(A, B) {
      result.innerHTML =
        "<h2>" + A + " + " + B + "</h2>" +
        "<p>When <strong>" + A + "</strong> appears alongside <strong>" + B + "</strong>, their themes often intersect in meaningful ways.</p>" +
        "<p>" + A + " may highlight a certain perspective or pattern, while " + B + " can bring a complementary or contrasting influence. Together, they may reflect a moment where these symbolic energies meet.</p>" +
        "<p>Rather than predicting outcomes, this combination invites reflection on how initiative, perspective, or transformation might be interacting within the situation you are considering.</p>" +
        "<p>Explore each card individually for deeper context:</p>" +
        "<ul>" +
        "<li><a href=\"/tarot/meanings/" + slugFromCard(A) + "/\">" + A + " meaning</a></li>" +
        "<li><a href=\"/tarot/meanings/" + slugFromCard(B) + "/\">" + B + " meaning</a></li>" +
        "</ul>";
    }

    /* URL params: ?a=the-fool&b=the-magician — pre-select and show result */
    const params = new URLSearchParams(window.location.search);
    const paramA = params.get("a");
    const paramB = params.get("b");
    if (paramA && paramB && slugToCard[paramA] && slugToCard[paramB] && paramA !== paramB) {
      cardA.value = slugToCard[paramA];
      cardB.value = slugToCard[paramB];
      renderCombo(slugToCard[paramA], slugToCard[paramB]);
    }

    const comboBtn = document.getElementById("comboButton");
    if (comboBtn) {
      comboBtn.addEventListener("click", function () {
        const A = cardA.value;
        const B = cardB.value;
        if (!A || !B) return;
        if (A === B) {
          result.innerHTML = "<p>Please select two different cards to explore a combination.</p>";
          return;
        }
        renderCombo(A, B);
        const base = window.location.pathname;
        const query = "?a=" + encodeURIComponent(slugFromCard(A)) + "&b=" + encodeURIComponent(slugFromCard(B));
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", base + query);
        }
      });
    }

  }

  /* Angel Number Lookup */
  const angelData = {
    "111": { themes: "awareness, intention, alignment", reflection: "Seeing repeating ones often invites attention to thoughts and direction. It can be a prompt to notice where your focus is and what you want to align with.", lifePath: 1, tarotMajor: "the-magician", tarotMinor: "wands/ace-of-wands" },
    "222": { themes: "balance, partnership, patience", reflection: "Repeating twos often point toward harmony, duality, and timing. They may invite reflection on where you are seeking balance or where patience is needed.", lifePath: 2, tarotMajor: "the-high-priestess", tarotMinor: "cups/two-of-cups" },
    "333": { themes: "creativity, expression, communication", reflection: "Threes can suggest a nudge toward self-expression and creativity. Consider what wants to be communicated or brought into form.", lifePath: 3, tarotMajor: "the-empress", tarotMinor: "wands/three-of-wands" },
    "444": { themes: "stability, support, foundation", reflection: "Fours often relate to structure and steadiness. When 444 appears, it may invite you to notice what feels solid or what you are building.", lifePath: 4, tarotMajor: "the-emperor", tarotMinor: "pentacles/four-of-pentacles" },
    "555": { themes: "change, movement, freedom", reflection: "Repeating fives often signal transition and movement. Useful when change is on your mind — a prompt to reflect on what is shifting.", lifePath: 5, tarotMajor: "the-hierophant", tarotMinor: "wands/five-of-wands" },
    "666": { themes: "responsibility, care, balance", reflection: "Sixes are commonly linked to responsibility and care. 666 can invite reflection on where you are overgiving or where balance between giving and receiving might be needed.", lifePath: 6, tarotMajor: "the-lovers", tarotMinor: "cups/six-of-cups" },
    "777": { themes: "trust, wisdom, reflection", reflection: "Sevens often point toward inner wisdom and trust in the process. When 777 appears, it may be a prompt to reflect on what you already know.", lifePath: 7, tarotMajor: "the-hermit", tarotMinor: "cups/seven-of-cups" },
    "888": { themes: "abundance, cycles, flow", reflection: "Eights are linked to cycles and abundance. 888 can invite you to notice what is flowing, what is completing, or what is in full bloom.", lifePath: 8, tarotMajor: "strength", tarotMinor: "wands/eight-of-wands" },
    "999": { themes: "completion, compassion, release", reflection: "Nines often relate to endings and release. 999 may invite reflection on what is ready to complete and what you might be ready to let go of.", lifePath: 9, tarotMajor: "the-world", tarotMinor: "cups/nine-of-cups" },
    "1111": { themes: "new cycles, alignment, gateway", reflection: "1111 is often interpreted as a threshold or alignment moment. It can invite attention to new beginnings and where your focus is being drawn.", lifePath: 4, tarotMajor: "the-emperor", tarotMinor: "pentacles/four-of-pentacles" }
  };

  const angelInput = document.getElementById("angelInput");
  const angelBtn = document.getElementById("angelLookupBtn");
  const angelResult = document.getElementById("angelResult");

  if (angelInput && angelBtn && angelResult) {

    function renderAngel(num, data) {
      const lp = data.lifePath;
      const major = data.tarotMajor;
      const minor = data.tarotMinor;
      const majorLabel = major.split("-").map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
      const minorParts = minor.split("/").pop().split("-");
      const minorLabel = minorParts.map(function (w) { return (w === "of" || w === "the") ? w : w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
      angelResult.innerHTML =
        "<h2>Angel Number " + num + "</h2>" +
        "<p class=\"themes\"><strong>Themes:</strong> " + data.themes + "</p>" +
        "<p><strong>Reflection:</strong> " + data.reflection + "</p>" +
        "<p>Explore related symbolism:</p>" +
        "<ul class=\"explore-links\">" +
        "<li><a href=\"/numerology/life-path/" + lp + "/\">Life Path " + lp + "</a></li>" +
        "<li><a href=\"/tarot/meanings/" + major + "/\">" + majorLabel + " (Tarot)</a></li>" +
        "<li><a href=\"/tarot/meanings/" + minor + "/\">" + minorLabel + " (Tarot)</a></li>" +
        "</ul>";
    }

    function doLookup() {
      const raw = (angelInput.value || "").trim();
      const num = raw.replace(/\s/g, "");
      const data = angelData[num];
      if (data) {
        renderAngel(num, data);
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", window.location.pathname + "?n=" + encodeURIComponent(num));
        }
      } else {
        angelResult.innerHTML = "<p>We don't have a lookup for that number yet. Try 111, 222, 333, 444, 555, 666, 777, 888, 999, or 1111.</p>";
      }
    }

    angelBtn.addEventListener("click", doLookup);
    angelInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        doLookup();
      }
    });

    /* URL param ?n=111 — pre-fill and show result */
    const angelParams = new URLSearchParams(window.location.search);
    const paramN = angelParams.get("n");
    if (paramN && angelData[paramN]) {
      angelInput.value = paramN;
      renderAngel(paramN, angelData[paramN]);
    }

  }

});
