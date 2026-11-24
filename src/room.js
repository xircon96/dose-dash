import { DurableObject } from "cloudflare:workers";
import { makeQFor, grade, parseFull, TOPICS, LEVELS, FIELDS, fa, rd } from "./gen.js";

const ROOM_TTL = 8 * 3600 * 1000;      // a game room lives for at most 8 hours
const ENDED_TTL = 2 * 3600 * 1000;     // results stay available for 2 hours after the end
const MAX_PLAYERS = 150;
const ALL_FIELDS = ["adult", "child", "mh", "ld"];
const CONFUSE = { tablets: ["mg", "mL"], mL: ["mg", "L"], cm: ["mm", "m"], "mL/h": ["mL/min", "drops/min"], "drops/min": ["mL/h", "drops/h"], "kg/m²": ["kg", "kg/m"], kg: ["g", "kg/m²"], g: ["mg", "kg"], mg: ["g", "micrograms"], micrograms: ["mg", "g"], L: ["mL", "kg"], hours: ["minutes"], minutes: ["hours", "seconds"], "mL/kg/h": ["mL/h", "mL/kg"] };

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const cleanName = (s) => String(s || "").replace(/[\u0000-\u001f<>&"]/g, "").replace(/\s+/g, " ").trim().slice(0, 20);

function sanitizeSettings(x = {}) {
  const topicsAll = Object.keys(TOPICS);
  const topics = Array.isArray(x.topics) ? x.topics.filter((t) => topicsAll.includes(t)) : [];
  const num = (v, allowed, d) => (allowed.includes(+v) ? +v : d);
  return {
    field: ["mixed", ...ALL_FIELDS].includes(x.field) ? x.field : "mixed",
    topics: topics.length ? topics : topicsAll,
    level: ["1", "2", "3", "4", "climb"].includes(String(x.level)) ? String(x.level) : "1",
    count: num(x.count, [5, 10, 15, 20, 25, 30], 10),
    timer: num(x.timer, [20, 30, 45, 60, 90, 120], 60),
    style: x.style === "mc" ? "mc" : "type",
    units: x.units !== false,
    speed: x.speed !== false,
    finalDouble: x.finalDouble !== false,
  };
}

function makeOptions(q, unitsOn) {
  const fx = (v) => (q.dp != null ? rd(v, q.dp) : rd(v, q.unit === "tablets" ? 2 : 4));
  const a = fx(q.answer), out = [{ v: a, u: q.unit }], seen = new Set([a + "|" + q.unit]);
  if (unitsOn) { const wu = pick(CONFUSE[q.unit] || ["mg"]); out.push({ v: a, u: wu }); seen.add(a + "|" + wu); }
  const s = Math.abs(a) < 2 ? 0.5 : Math.abs(a) < 10 ? 1 : Math.abs(a) < 50 ? 5 : Math.abs(a) < 500 ? 25 : 100;
  const pool = [...(q.alts || []), q.signed ? -a : null, ...shuffle([a * 10, a / 10, a * 2, a / 2, a + s, a - s, a + 2 * s, a - 2 * s, a + 3 * s, a * 1000, a / 1000])];
  for (const v of pool) {
    if (out.length >= 4) break;
    if (v == null || !isFinite(v)) continue;
    const fv = fx(v), k = fv + "|" + q.unit;
    if (seen.has(k) || fv === 0) continue;
    if (!q.signed && fv < 0) continue;
    out.push({ v: fv, u: q.unit }); seen.add(k);
  }
  return shuffle(out);
}

export class GameRoom extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.s = null;
    // Keep-alive pings are answered without waking the object.
    try { ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('{"t":"ping"}', '{"t":"pong"}')); } catch {}
    ctx.blockConcurrencyWhile(async () => { this.s = (await ctx.storage.get("s")) || null; });
  }

  async save() { await this.ctx.storage.put("s", this.s); }

  /* ---------- RPC from the Worker ---------- */
  async create(settings) {
    const now = Date.now();
    if (this.s && this.s.phase !== "ended" && now - this.s.created < ROOM_TTL) return { busy: true };
    await this.ctx.storage.deleteAll();
    this.s = {
      created: now, hostKey: crypto.randomUUID(), settings: sanitizeSettings(settings),
      phase: "lobby", qi: -1, q: null, qStart: 0, qEnd: 0, players: {}, answers: {}, history: [], kicked: {}, stats: null, endedAt: 0,
    };
    await this.save();
    await this.ctx.storage.setAlarm(now + ROOM_TTL);
    return { hostKey: this.s.hostKey };
  }

  async info() {
    return this.s ? { exists: true, phase: this.s.phase } : { exists: false };
  }

  async fetch(request) {
    if (!this.s) return new Response("Game not found", { status: 404 });
    if (request.headers.get("Upgrade") !== "websocket") return new Response("Expected a WebSocket", { status: 426 });
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ role: null });
    return new Response(null, { status: 101, webSocket: client });
  }

  /* ---------- WebSocket handlers ---------- */
  async webSocketMessage(ws, msg) {
    if (typeof msg !== "string" || msg.length > 2000) return;
    let m; try { m = JSON.parse(msg); } catch { return; }
    if (!this.s) { this.send(ws, { t: "gone" }); return; }
    const a = ws.deserializeAttachment() || {};
    switch (m.t) {
      case "host":
        if (m.key === this.s.hostKey) { ws.serializeAttachment({ role: "host" }); this.send(ws, this.hostView()); }
        else this.send(ws, { t: "error", msg: "This browser is not the host of this game." });
        return;
      case "join": return this.join(ws, m);
      case "answer": if (a.role === "player") return this.answer(a.pid, m, ws); return;
      case "ping": this.send(ws, { t: "pong" }); return;
      default: if (a.role === "host") return this.hostCommand(m);
    }
  }

  async webSocketClose(ws) {
    try { ws.close(); } catch {}
    const a = ws.deserializeAttachment() || {};
    if (a.role === "player" && this.s) this.toHosts(this.s.phase === "lobby" ? this.hostView() : this.countMsg());
  }

  async webSocketError(ws) { try { ws.close(1011, "error"); } catch {} }

  async alarm() {
    if (!this.s) return;
    const now = Date.now();
    if (this.s.phase === "question" && now >= this.s.qEnd - 100) { await this.reveal(); return; }
    const expiry = this.s.phase === "ended" ? this.s.endedAt + ENDED_TTL : this.s.created + ROOM_TTL;
    if (now >= expiry) {
      for (const w of this.ctx.getWebSockets()) { try { this.send(w, { t: "gone" }); w.close(4000, "Game expired"); } catch {} }
      await this.ctx.storage.deleteAll();
      this.s = null;
      return;
    }
    await this.ctx.storage.setAlarm(expiry);
  }

  /* ---------- players ---------- */
  async join(ws, m) {
    const s = this.s;
    let pid = typeof m.pid === "string" && s.players[m.pid] ? m.pid : null;
    if (typeof m.pid === "string" && s.kicked[m.pid]) { this.send(ws, { t: "kicked" }); try { ws.close(4001, "removed"); } catch {} return; }
    if (!pid) {
      const name = cleanName(m.name);
      if (!name) { this.send(ws, { t: "error", msg: "Please type your name." }); return; }
      if (Object.keys(s.players).length >= MAX_PLAYERS) { this.send(ws, { t: "error", msg: `This game is full (${MAX_PLAYERS} players).` }); return; }
      if (s.phase === "ended") { this.send(ws, { t: "error", msg: "This game has already finished." }); return; }
      const taken = new Set(Object.values(s.players).map((p) => p.name.toLowerCase()));
      let n = name, i = 2;
      while (taken.has(n.toLowerCase())) n = `${name.slice(0, 17)} ${i++}`;
      pid = crypto.randomUUID();
      s.players[pid] = { name: n, score: 0, streak: 0, correct: 0, answered: 0, joinedQi: s.qi, log: [], rank: 0, prevRank: 0, lastPts: 0 };
      this.rank();
      await this.save();
    }
    ws.serializeAttachment({ role: "player", pid });
    this.send(ws, { t: "joined", pid, name: s.players[pid].name });
    this.send(ws, this.playerView(pid));
    this.toHosts(s.phase === "lobby" ? this.hostView() : this.countMsg());
  }

  async answer(pid, m, ws) {
    const s = this.s, p = s.players[pid];
    if (!p) return;
    const now = Date.now();
    if (s.phase !== "question" || now > s.qEnd + 1500) { this.send(ws, { t: "late" }); return; }
    if (s.answers[pid]) { this.send(ws, { t: "locked", raw: s.answers[pid].raw }); return; }
    let parsed, raw, opt = null;
    if (s.q.opts) {
      opt = Number.isInteger(m.opt) ? m.opt : -1;
      const o = s.q.opts[opt]; if (!o) return;
      parsed = { v: o.v, unit: { kind: "ok", canon: o.u, raw: o.u } };
      raw = `${fa(s.q, o.v)} ${o.u}`;
    } else {
      raw = String(m.raw || "").slice(0, 60);
      parsed = parseFull(raw);
      if (!parsed) { this.send(ws, { t: "invalid" }); return; }
    }
    const res = grade(s.q, parsed, s.settings.units);
    const frac = Math.min(1, Math.max(0, (now - s.qStart) / (s.qEnd - s.qStart)));
    s.answers[pid] = { raw, ok: res.ok, kinds: res.kinds, frac, opt };
    await this.save();
    this.send(ws, { t: "locked", raw });
    this.toHosts(this.countMsg());
    if (Object.keys(s.answers).length >= this.onlinePlayers().size) await this.reveal();
  }

  /* ---------- host ---------- */
  async hostCommand(m) {
    const s = this.s;
    switch (m.t) {
      case "start": if (s.phase === "lobby") await this.nextQuestion(); break;
      case "reveal": if (s.phase === "question") await this.reveal(); break;
      case "board": if (s.phase === "reveal") { s.phase = "board"; await this.save(); this.broadcast(); } break;
      case "next": if (s.phase === "reveal" || s.phase === "board") await this.nextQuestion(); break;
      case "extend":
        if (s.phase === "question") { s.qEnd += 15000; await this.save(); await this.ctx.storage.setAlarm(s.qEnd); this.broadcast(); }
        break;
      case "end": if (s.phase !== "ended") await this.endGame(); break;
      case "kick": {
        const pid = m.pid;
        if (s.players[pid]) {
          s.kicked[pid] = 1; delete s.players[pid]; delete s.answers[pid];
          this.rank(); await this.save();
          for (const w of this.ctx.getWebSockets()) {
            const a = w.deserializeAttachment() || {};
            if (a.pid === pid) { this.send(w, { t: "kicked" }); try { w.close(4001, "removed"); } catch {} }
          }
          this.toHosts(this.hostView());
        }
        break;
      }
    }
  }

  async nextQuestion() {
    const s = this.s, st = s.settings;
    s.qi++;
    if (s.qi >= st.count) return this.endGame();
    const L = st.level === "climb" ? Math.min(4, 1 + Math.floor((4 * s.qi) / st.count)) : +st.level;
    const field = st.field === "mixed" ? pick(ALL_FIELDS) : st.field;
    const q = makeQFor(L, field, pick(st.topics));
    q.opts = st.style === "mc" ? makeOptions(q, st.units) : null;
    q.double = st.finalDouble && s.qi === st.count - 1;
    s.q = q; s.answers = {}; s.stats = null; s.phase = "question";
    s.qStart = Date.now(); s.qEnd = s.qStart + st.timer * 1000;
    await this.save();
    await this.ctx.storage.setAlarm(s.qEnd);
    this.broadcast();
  }

  async reveal() {
    const s = this.s, st = s.settings, q = s.q;
    if (s.phase !== "question") return;
    const mult = q.double ? 2 : 1;
    const kinds = {}; let correct = 0, answered = 0;
    const optCounts = q.opts ? q.opts.map(() => 0) : null;
    for (const [pid, p] of Object.entries(s.players)) {
      p.lastPts = 0;
      const a = s.answers[pid];
      if (!a) {
        if (p.joinedQi < s.qi) { p.streak = 0; p.log.push({ qi: s.qi, ok: false, kinds: ["noanswer"] }); }
        continue;
      }
      answered++; p.answered++;
      if (optCounts && a.opt != null) optCounts[a.opt]++;
      if (a.ok) {
        correct++; p.correct++; p.streak++;
        const base = st.speed ? Math.round(1000 * (1 - 0.5 * a.frac)) : 1000;
        a.pts = (base + Math.min(p.streak - 1, 5) * 100) * mult;
        p.score += a.pts; p.lastPts = a.pts;
      } else {
        p.streak = 0; a.pts = 0;
        for (const k of new Set(a.kinds)) kinds[k] = (kinds[k] || 0) + 1;
      }
      p.log.push({ qi: s.qi, ok: a.ok, kinds: a.kinds });
    }
    this.rank(true);
    s.stats = { correct, answered, present: this.onlinePlayers().size, kinds, optCounts };
    s.history.push({ qi: s.qi, topic: q.topic, field: q.field, level: q.level, ask: q.ask, answer: `${fa(q, q.answer)} ${q.unit}`, correct, answered, kinds });
    s.phase = "reveal";
    await this.save();
    await this.ctx.storage.setAlarm(s.created + ROOM_TTL);
    this.broadcast();
  }

  async endGame() {
    const s = this.s;
    s.phase = "ended"; s.endedAt = Date.now(); s.qi = Math.min(s.qi, s.settings.count);
    this.rank();
    await this.save();
    await this.ctx.storage.setAlarm(s.endedAt + ENDED_TTL);
    this.broadcast();
  }

  /* ---------- helpers ---------- */
  rank(update = false) {
    const list = Object.entries(this.s.players).sort(([, a], [, b]) => b.score - a.score || b.correct - a.correct || a.name.localeCompare(b.name));
    list.forEach(([, p], i) => { if (update || !p.prevRank) p.prevRank = p.rank || i + 1; p.rank = i + 1; });
    return list;
  }
  onlinePlayers() {
    const set = new Set();
    for (const w of this.ctx.getWebSockets()) { const a = w.deserializeAttachment() || {}; if (a.role === "player" && this.s.players[a.pid]) set.add(a.pid); }
    return set;
  }
  send(ws, obj) { try { ws.send(JSON.stringify(obj)); } catch {} }
  toHosts(obj) { const j = JSON.stringify(obj); for (const w of this.ctx.getWebSockets()) { const a = w.deserializeAttachment() || {}; if (a.role === "host") try { w.send(j); } catch {} } }
  countMsg() { return { t: "count", answered: Object.keys(this.s.answers || {}).length, online: this.onlinePlayers().size, total: Object.keys(this.s.players).length }; }
  broadcast() {
    const host = JSON.stringify(this.hostView());
    for (const w of this.ctx.getWebSockets()) {
      const a = w.deserializeAttachment() || {};
      try {
        if (a.role === "host") w.send(host);
        else if (a.role === "player" && this.s.players[a.pid]) w.send(JSON.stringify(this.playerView(a.pid)));
      } catch {}
    }
  }

  qPublic() {
    const s = this.s, q = s.q; if (!q) return null;
    const t = TOPICS[q.topic], l = LEVELS[q.level];
    return {
      qi: s.qi, total: s.settings.count, topic: { key: q.topic, label: t.label, color: t.color }, field: FIELDS[q.field].label,
      level: { n: q.level, label: l.label, color: l.color }, text: q.text, ask: q.ask, double: !!q.double,
      opts: q.opts ? q.opts.map((o) => `${fa(q, o.v)} ${o.u}`) : null,
      remainingMs: Math.max(0, s.qEnd - Date.now()), duration: s.qEnd - s.qStart,
    };
  }
  qSolution() {
    const q = this.s.q; if (!q) return null;
    const correctOpt = q.opts ? q.opts.findIndex((o) => Math.abs(o.v - q.answer) <= q.tol && o.u === q.unit) : null;
    return { answer: `${fa(q, q.answer)} ${q.unit}`, steps: q.steps, note: q.note || "", fk: q.fk, hint: q.hint, correctOpt };
  }
  board(n) {
    return this.rank().slice(0, n).map(([pid, p]) => ({ pid, name: p.name, score: p.score, rank: p.rank, prevRank: p.prevRank, lastPts: p.lastPts, correct: p.correct, answered: p.answered }));
  }

  hostView() {
    const s = this.s, v = { t: "state", role: "host", phase: s.phase, settings: s.settings, qi: s.qi, total: s.settings.count };
    const online = this.onlinePlayers();
    v.players = Object.entries(s.players).map(([pid, p]) => ({ pid, name: p.name, score: p.score, online: online.has(pid) }));
    v.online = online.size;
    v.answered = Object.keys(s.answers || {}).length;
    if (s.phase === "question" || s.phase === "reveal" || s.phase === "board") { v.q = this.qPublic(); v.fk = s.q.fk; v.hint = s.q.hint; }
    if (s.phase === "reveal" || s.phase === "board") { v.sol = this.qSolution(); v.stats = s.stats; }
    if (s.phase === "board") v.board = this.board(10);
    if (s.phase === "ended") {
      v.board = this.board(MAX_PLAYERS);
      v.history = s.history.map((h) => ({ ...h, topicLabel: TOPICS[h.topic].label, topicColor: TOPICS[h.topic].color }));
      v.logs = Object.fromEntries(Object.entries(s.players).map(([pid, p]) => [pid, p.log]));
    }
    return v;
  }

  playerView(pid) {
    const s = this.s, p = s.players[pid];
    const v = { t: "state", role: "player", phase: s.phase, name: p.name, score: p.score, rank: p.rank, of: Object.keys(s.players).length, streak: p.streak, qi: s.qi, total: s.settings.count, units: s.settings.units };
    if (s.phase === "question") {
      v.q = this.qPublic();
      const a = s.answers[pid];
      v.locked = a ? a.raw : null;
    }
    if (s.phase === "reveal" || s.phase === "board") {
      v.q = this.qPublic();
      const a = s.answers[pid], sol = this.qSolution();
      v.result = a ? { ok: a.ok, pts: a.pts || 0, kinds: a.kinds, raw: a.raw, opt: a.opt } : { none: true };
      v.sol = sol;
      v.prevRank = p.prevRank;
    }
    if (s.phase === "board" || s.phase === "ended") {
      const list = this.rank();
      v.top = list.slice(0, s.phase === "ended" ? 3 : 5).map(([, x]) => ({ name: x.name, score: x.score }));
      const idx = list.findIndex(([id]) => id === pid);
      if (idx > 0) v.ahead = { name: list[idx - 1][1].name, gap: list[idx - 1][1].score - p.score };
    }
    if (s.phase === "ended") {
      v.correct = p.correct; v.answered = p.answered;
      const kinds = {}; p.log.forEach((l) => (l.kinds || []).forEach((k) => (kinds[k] = (kinds[k] || 0) + 1)));
      v.kinds = kinds;
    }
    return v;
  }
}
