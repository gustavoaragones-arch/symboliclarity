const polarity = [
  "Yes.",
  "No.",
  "Not yet.",
  "Unclear.",
  "Leaning yes.",
  "Leaning no.",
  "Pause first.",
  "Conditional.",
  "The timing isn't aligned yet."
];

const contextLayer = [
  "Trust your inner sense here.",
  "Something needs more clarity.",
  "External factors are influencing this.",
  "You may already sense the answer.",
  "Timing plays a significant role.",
  "This depends on your next move.",
  "Your energy matters more than circumstance.",
  "There is more beneath the surface."
];

const guidanceLayer = [
  "Take one small intentional step.",
  "Give it space before deciding.",
  "Ask one deeper question.",
  "Observe before acting.",
  "Reduce pressure around the outcome.",
  "Sleep on it tonight.",
  "Clarify what you truly want.",
  "Move gently."
];

let lastOracleResponse = null;

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function wordCount(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

function generateResponse(lastFull = null) {
  const maxTries = 5;
  for (let i = 0; i < maxTries; i++) {
    const p = pick(polarity);
    const c = pick(contextLayer);
    const g = pick(guidanceLayer);
    const full = `${p}\n\n${c}\n\n${g}`;
    const words = wordCount(p) + wordCount(c) + wordCount(g);
    if ((!lastFull || full !== lastFull) && words <= 40) {
      return full;
    }
  }
  const p = pick(polarity);
  const c = pick(contextLayer);
  const g = pick(guidanceLayer);
  return `${p}\n\n${c}\n\n${g}`;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/yes-no") {
      const lastFromClient = url.searchParams.get("last")
        ? decodeURIComponent(url.searchParams.get("last"))
        : null;
      const lastFull = lastFromClient || lastOracleResponse;
      const answer = generateResponse(lastFull);
      lastOracleResponse = answer;

      return new Response(
        JSON.stringify({ answer }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response("Not Found", { status: 404 });
  }
};
