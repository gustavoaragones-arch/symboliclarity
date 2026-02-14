export default {
    async fetch(request) {
      const url = new URL(request.url);
  
      if (url.pathname === "/api/yes-no") {
        const responses = [
          "Yes.",
          "No.",
          "Not yet.",
          "Pause and reflect first.",
          "The answer depends on your next move."
        ];
  
        const result = responses[Math.floor(Math.random() * responses.length)];
  
        return new Response(JSON.stringify({ answer: result }), {
          headers: { "Content-Type": "application/json" }
        });
      }
  
      return new Response("Not Found", { status: 404 });
    }
  };
  