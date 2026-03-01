/**
 * Symboliclarity — App JavaScript
 * Minimal vanilla JS only when necessary.
 */

document.addEventListener("DOMContentLoaded", function () {

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

  });

});
