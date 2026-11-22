/* Shared helpers for the live host and student screens */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const ordinal = (n) => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
const fmtCode = (c) => String(c).replace(/(\d{3})(\d{3})/, "$1 $2");

const ERR = {
  unitMissing: ["Leaving off the unit", "A number on its own is not an answer on the ward. Finish with the unit, for example 7.5 mL or 125 mL/h."],
  unitWrong: ["Using the wrong unit", "Read the question again: it tells you what is being measured. mL/h is for pumps, drops/min for gravity drips, kg/m² for BMI."],
  unitAsked: ["Right amount, different unit", "The amount was right, but not in the unit the question asked for. Convert it before you write it down."],
  mcg: ["Abbreviating micrograms", 'Write "micrograms" in full. "mcg" and "µg" can be misread as mg, which is a 1000-fold error.'],
  cc: ['Writing "cc"', 'Use mL, not cc. "cc" can be misread, so it is best avoided.'],
  x1000: ["A conversion slip (1000 times out)", "Use the ladder: g to mg to micrograms is × 1000 each step. Ask whether the number should get bigger or smaller."],
  wrongway: ["Converting the wrong way", "Bigger unit to smaller unit: multiply. Smaller unit to bigger unit: divide."],
  x10: ["A decimal point slip (10 times out)", "Estimate first. If the answer is 10 times the estimate, check the decimal point."],
  rounding: ["Rounding", "Keep the full number until the very end, then round as the question asks. 5 or more rounds up."],
  sign: ["Plus and minus in fluid balance", "Always do in minus out. More out than in gives a minus number."],
  inverted: ["Dividing the wrong way round", "Check what goes on top. WIG: Want ÷ Got. Time: volume ÷ rate. BMI: weight ÷ height²."],
  noconv: ["Not matching the units first", "Put both numbers into the same unit (both mg, or both g) before calculating."],
  nosquare: ["Not squaring the height", "Height² means height × height (1.6 × 1.6 = 2.56), not height × 2."],
  minutes: ["Mixing up hours and minutes", "Pump rates are per hour. Drip rates are per minute. Change the time into the right unit first."],
  dropfactor: ["Using the wrong drop factor", "Standard giving set: 20 drops/mL. Blood giving set: 15 drops/mL."],
  notdivided: ["Not splitting the daily dose", '"In 2 divided doses" means divide the daily total by 2 before working out each dose.'],
  missedstep: ["Missing a step", "For multi-step questions, write each step on its own line and tick off every number in the question."],
  calc: ["A calculation slip", "The method may be fine but a sum slipped. Check each step against an estimate."],
  timeout: ["Running out of time", "Speed comes with practice. Learn the formulas by heart so you can start straight away."],
  noanswer: ["No answer given", "Have a go even if unsure. Writing the formula down first often unlocks the rest."],
};

const fr = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
const FORMULAS = {
  wig: ["WIG formula", `Dose = ${fr("Want", "Got")} × In`], mgkg: ["Dose by weight, then WIG", `Dose = mg/kg × weight (kg)<br>Volume = ${fr("Want", "Got")} × In`],
  course: ["Tablets for a course", `Per dose = ${fr("dose", "tablet strength")}<br>Total = per dose × doses a day × days`], divided: ["Divided doses", `Each dose = ${fr("daily dose", "number of doses")}<br>Then ${fr("Want", "Got")} × In`],
  conv: ["Conversion ladder", "g ⇄ mg ⇄ micrograms: × 1000 down, ÷ 1000 up<br>L ⇄ mL: × 1000 down, ÷ 1000 up"], time: ["Time conversions", "hours × 60 = minutes<br>minutes ÷ 60 = hours"],
  cups: ["Adding up drinks", `Total mL = drinks × size<br>Litres = ${fr("mL", "1000")}`], pct: ["Percentage strength (% w/v)", "x% = x g in 100 mL<br>1% = 10 mg in 1 mL"],
  bmi: ["BMI", `BMI = ${fr("weight (kg)", "height (m)²")}`], bmiTarget: ["BMI rearranged", "Target weight = BMI × height²<br>To lose = current minus target"], bmiRev: ["BMI rearranged", "weight = BMI × height (m)²"],
  rate: ["Pump rate", `mL/h = ${fr("volume (mL)", "time (hours)")}`], rateMin: ["Pump rate, time in minutes", `mL/h = ${fr("volume (mL)", "time (minutes)")} × 60`],
  drops: ["Gravity drip rate", `drops/min = ${fr("volume × drop factor", "time (minutes)")}`], hs: ["Holliday-Segar (children)", `100 mL/kg for the first 10 kg, 50 mL/kg for the next 10 kg, 20 mL/kg above 20 kg<br>Rate = ${fr("daily total", "24")}`],
  duration: ["Time to finish", `hours = ${fr("volume (mL)", "rate (mL/h)")}`], remain: ["Left in the bag", "Given = rate × time<br>Left = bag minus given"], total: ["Totals", "Add every entry together"],
  nappy: ["Weighing nappies", "Urine (mL) = wet weight minus dry weight"], balance: ["Fluid balance", "Balance = total in minus total out"], urine: ["Urine output", `mL/kg/h = ${fr("urine (mL)", "weight (kg) × hours")}`],
  volume: ["Volume given", "Volume = rate × time"], missingEntry: ["Missing entry", "Missing = total minus the entries you know"], intake: ["Fluid balance rearranged", "In = out + balance"],
  doseFromVol: ["Dose in a volume", `mg per mL = ${fr("strength", "volume")}<br>Dose = mL × mg per mL`], weightFromDose: ["Weight from a dose", `weight = ${fr("dose (mg)", "dose per kg")}`],
  newrate: ["New rate", `Left = bag minus given<br>New rate = ${fr("volume left", "hours left")}`], maxdose: ["Maximum dose check", `Room left = maximum minus already given<br>If asked: ${fr("room left", "strength")} × In`],
};

function qHeadHTML(q) {
  return `<span class="cell"><i class="sw" style="--c:${q.topic.color}"></i>${esc(q.topic.label)}</span><span class="cell"><small>Field</small>${esc(q.field)}</span><span class="cell"><i class="lv" style="--c:${q.level.color}"></i>${esc(q.level.label)}</span>${q.double ? '<span class="cell dbl">Double points</span>' : ""}`;
}
function stepsHTML(sol) {
  return `<ol class="steps">${sol.steps.map((s) => `<li>${s}</li>`).join("")}</ol>${sol.note ? `<p class="note">${sol.note}</p>` : ""}`;
}
function tipsHTML(kinds) {
  const li = [...new Set(kinds || [])].filter((k) => ERR[k]).map((k) => `<li><b>${ERR[k][0]}</b>${ERR[k][1]}</li>`).join("");
  return li ? `<ul class="coach">${li}</ul>` : "";
}

/* Countdown that tracks the server's remaining time */
function Countdown(onTick) {
  let end = 0, total = 1, raf = 0;
  function loop() {
    const left = Math.max(0, end - performance.now());
    onTick(left, total);
    if (left > 0) raf = requestAnimationFrame(loop);
  }
  return {
    set(remainingMs, durationMs) { cancelAnimationFrame(raf); end = performance.now() + remainingMs; total = durationMs || remainingMs || 1; loop(); },
    stop() { cancelAnimationFrame(raf); },
  };
}

/* WebSocket connection with automatic reconnection */
function Live(code, { onOpen, onMessage, onStatus }) {
  let ws, tries = 0, stopped = false, timer = 0;
  const url = (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/ws/" + code;
  function open() {
    ws = new WebSocket(url);
    ws.onopen = () => { tries = 0; onStatus && onStatus("online"); onOpen && onOpen(); };
    ws.onmessage = (e) => { let m; try { m = JSON.parse(e.data); } catch { return; } if (m.t === "pong") return; onMessage(m); };
    ws.onclose = (e) => {
      if (stopped || e.code === 4000 || e.code === 4001) { onStatus && onStatus("closed", e.code); return; }
      onStatus && onStatus("reconnecting");
      clearTimeout(timer); timer = setTimeout(open, Math.min(8000, 500 * 2 ** tries++));
    };
  }
  open();
  setInterval(() => { if (ws && ws.readyState === 1) ws.send('{"t":"ping"}'); }, 25000);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && ws && ws.readyState > 1 && !stopped) { clearTimeout(timer); tries = 0; open(); } });
  return {
    send(o) { if (ws && ws.readyState === 1) { ws.send(JSON.stringify(o)); return true; } return false; },
    stop() { stopped = true; try { ws.close(); } catch {} },
  };
}

function statusBar(state) {
  const b = $("#netbar"); if (!b) return;
  b.textContent = state === "reconnecting" ? "Connection lost. Reconnecting..." : state === "closed" ? "Disconnected." : "";
  b.classList.toggle("show", state === "reconnecting" || state === "closed");
}

const TICK = '<svg class="tk" viewBox="0 0 36 32" aria-hidden="true"><path d="M3 17 L12 27 L33 4"/></svg>';
const BRAND = '<svg viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="#1B2A72" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M33 4l11 11"/><path d="M38.5 9.5l-5.5 5.5"/><path d="M14 23l11 11"/><rect x="11" y="15" width="30" height="13" rx="2" transform="rotate(-45 26 21.5)" fill="#fff"/><path d="M18.5 27.5l-6 6"/><path d="M10 31l7 7"/><path d="M8 40l-4 4"/></g><path d="M22 27.5l9.5-9.5 3.6 3.6-9.5 9.5z" fill="#FFE45C"/></svg>';
document.querySelectorAll("[data-brand]").forEach((el) => (el.innerHTML = BRAND + "<span>Dose Dash</span>"));
