import { GameRoom } from "./room.js";
export { GameRoom };

function newCode() {
  const b = new Uint32Array(1);
  crypto.getRandomValues(b);
  return String(100000 + (b[0] % 900000));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Create a new live game. Returns the join code and a secret host key.
    if (url.pathname === "/api/rooms") {
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
      let settings = {};
      try { settings = await request.json(); } catch {}
      for (let i = 0; i < 8; i++) {
        const code = newCode();
        const result = await env.ROOMS.getByName(code).create(settings);
        if (!result.busy) return Response.json({ code, hostKey: result.hostKey });
      }
      return Response.json({ error: "Could not create a game. Please try again." }, { status: 503 });
    }

    // Check that a game exists before a student tries to join it.
    const info = url.pathname.match(/^\/api\/rooms\/(\d{6})$/);
    if (info) return Response.json(await env.ROOMS.getByName(info[1]).info());

    // WebSocket connection to a game room, for the host screen and for students.
    const m = url.pathname.match(/^\/ws\/(\d{6})$/);
    if (m) {
      if (request.headers.get("Upgrade") !== "websocket") return new Response("Expected a WebSocket", { status: 426 });
      return env.ROOMS.getByName(m[1]).fetch(request);
    }

    return new Response("Not found", { status: 404 });
  },
};
