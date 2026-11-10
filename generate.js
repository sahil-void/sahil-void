// Generates animated SVG cards for a GitHub profile README.
// Usage: node generate.js            (sample heatmap data, no network)
//        GITHUB_TOKEN=... node generate.js   (live contribution data)
const fs = require("fs");
const path = require("path");

const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf8"));
const OUT = path.join(__dirname, "cards");
fs.mkdirSync(OUT, { recursive: true });

const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const SANS = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const BLUE = "#2f5bff";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const write = (name, svg) => fs.writeFileSync(path.join(OUT, name), svg);

// ---------- HERO ----------
function hero() {
  const roles = cfg.roles;
  const n = roles.length;
  const per = 3; // seconds each role is on screen
  const dur = per * n;
  const win = 100 / n;
  const kf = `@keyframes role{0%{opacity:0;transform:translateY(8px)}${(win * 0.12).toFixed(1)}%{opacity:1;transform:translateY(0)}${(win * 0.85).toFixed(1)}%{opacity:1}${win.toFixed(1)}%{opacity:0}100%{opacity:0}}`;
  const roleTexts = roles
    .map((r, i) => `<text class="role" x="40" y="288" style="animation-delay:${i * per}s">${esc(r)}</text>`)
    .join("\n  ");
  // dot grid on the right
  let dots = "";
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 12; c++) {
      const d = ((r * 7 + c * 3) % 10) * 0.25;
      dots += `<circle class="dot" cx="${520 + c * 24}" cy="${50 + r * 24}" r="2.4" style="animation-delay:${d}s"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="830" height="320" viewBox="0 0 830 320" role="img" aria-label="${esc(cfg.nameLine1)} ${esc(cfg.nameLine2)}">
<style>
  .bg{fill:#0d1017}
  .tag{font:600 12px ${MONO};letter-spacing:2px;fill:#8a93a6}
  .n1{font:400 92px ${SERIF};fill:#f2efe8;letter-spacing:-3px}
  .n2{font:italic 400 92px ${SERIF};fill:${BLUE};letter-spacing:-3px}
  .role{font:400 18px ${MONO};fill:#b4bccd;opacity:0;animation:role ${dur}s infinite}
  .dot{fill:#3a4668;animation:pulse 3s ease-in-out infinite}
  .sq{fill:${BLUE};animation:blink 1.6s steps(2,start) infinite}
  .rise{opacity:0;animation:rise .9s ease-out forwards}
  @keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:.25}50%{opacity:1;fill:${BLUE}}}
  @keyframes blink{50%{opacity:.2}}
  ${kf}
</style>
<rect class="bg" width="830" height="320" rx="18"/>
${dots}
<rect class="sq" x="40" y="40" width="10" height="10" rx="2"/>
<text class="tag" x="60" y="49">${esc(cfg.label)}  ·  @${esc(cfg.username)}</text>
<text class="n1 rise" x="38" y="150" style="animation-delay:.1s">${esc(cfg.nameLine1)}</text>
<text class="n2 rise" x="38" y="238" style="animation-delay:.35s">${esc(cfg.nameLine2)}</text>
  ${roleTexts}
</svg>`;
}

// ---------- TILES ----------
function tile(t, i) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="270" height="170" viewBox="0 0 270 170">
<style>
  .l{font:600 11px ${MONO};letter-spacing:2px;fill:${t.text};opacity:.85}
  .b{font:italic 400 34px ${SERIF};fill:${t.text}}
  .s{font:400 12.5px ${SANS};fill:${t.text};opacity:.9}
  .a{font:400 16px ${SANS};fill:${t.text}}
  .in{opacity:0;animation:in .8s ease-out forwards}
  @keyframes in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  @keyframes sheen{0%{transform:translateX(-300px)}100%{transform:translateX(300px)}}
  .sh{animation:sheen 5s ease-in-out infinite;animation-delay:${i}s}
</style>
<clipPath id="c"><rect width="270" height="170" rx="14"/></clipPath>
<rect width="270" height="170" rx="14" fill="${t.color}"/>
<g clip-path="url(#c)"><rect class="sh" x="0" y="-20" width="60" height="220" fill="#ffffff" opacity=".12" transform="skewX(-20)"/></g>
<text class="l in" x="22" y="34">${esc(t.label)}</text>
<text class="a in" x="236" y="36">→</text>
<text class="b in" x="22" y="92" style="animation-delay:.15s">${esc(t.big)}</text>
<text class="s in" x="22" y="124" style="animation-delay:.3s">${esc(t.line1)}</text>
<text class="s in" x="22" y="142" style="animation-delay:.4s">${esc(t.line2)}</text>
</svg>`;
}

// ---------- REPO CARDS ----------
function repoCard(p, i) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="270" height="150" viewBox="0 0 270 150">
<style>
  .t{font:700 16px ${SANS};fill:#14161c}
  .d{font:400 12.5px ${SANS};fill:#4a5060}
  .g{font:500 11px ${MONO};fill:#6a7185}
  .in{opacity:0;animation:in .7s ease-out forwards}
  .pd{animation:pd 2.4s ease-in-out infinite;animation-delay:${i * 0.4}s}
  @keyframes in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes pd{0%,100%{opacity:1}50%{opacity:.3}}
</style>
<rect width="270" height="150" rx="14" fill="#f2efe8" stroke="#dcd7cb"/>
<circle class="pd" cx="26" cy="32" r="5" fill="${p.color}"/>
<text class="t in" x="40" y="37" style="animation-delay:${0.1 * i}s">${esc(p.repo)}</text>
<text class="d in" x="22" y="68" style="animation-delay:${0.1 * i + 0.1}s">${esc(p.line1)}</text>
<text class="d in" x="22" y="86" style="animation-delay:${0.1 * i + 0.2}s">${esc(p.line2)}</text>
<text class="g in" x="22" y="128">${esc(p.lang)}</text>
</svg>`;
}

// ---------- CONTRIBUTION DATA ----------
async function getDays() {
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{weeks{contributionDays{date contributionCount}}}}}}`;
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "profile-cards" },
      body: JSON.stringify({ query, variables: { login: cfg.username } }),
    });
    const json = await res.json();
    if (json.errors || !json.data || !json.data.user) throw new Error("GraphQL error: " + JSON.stringify(json.errors || json));
    const weeks = json.data.user.contributionsCollection.contributionCalendar.weeks;
    return { sample: false, days: weeks.flatMap((w) => w.contributionDays.map((d) => ({ date: d.date, n: d.contributionCount }))) };
  }
  // sample data (deterministic), clearly flagged on the cards
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const days = [];
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - 371);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  for (let i = 0; i < 53 * 7; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    days.push({ date: d.toISOString().slice(0, 10), n: 0 }); // empty placeholder until the Action fetches real data
  }
  return { sample: true, days };
}

function level(n, max) {
  if (n === 0) return 0;
  const q = n / max;
  return q > 0.66 ? 4 : q > 0.4 ? 3 : q > 0.18 ? 2 : 1;
}
const SCALE = ["#1c2233", "#2b3d7a", "#2f5bff", "#5a82ff", "#9db6ff"];

function heatmap({ days, sample }) {
  const max = Math.max(1, ...days.map((d) => d.n));
  const pitch = 14;
  const weeks = Math.ceil(days.length / 7);
  let cells = "";
  days.forEach((d, i) => {
    const col = Math.floor(i / 7), row = i % 7;
    cells += `<rect class="c" x="${44 + col * pitch}" y="${64 + row * pitch}" width="11" height="11" rx="2.5" fill="${SCALE[level(d.n, max)]}" style="animation-delay:${(col * 0.025).toFixed(2)}s"><title>${esc(d.date)}: ${d.n}</title></rect>`;
  });
  // month labels
  let months = "";
  let last = -1;
  days.forEach((d, i) => {
    if (i % 7 !== 0) return;
    const m = Number(d.date.slice(5, 7));
    if (m !== last) {
      last = m;
      const name = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m - 1];
      months += `<text class="m" x="${44 + (i / 7) * pitch}" y="${64 + 7 * pitch + 16}">${name}</text>`;
    }
  });
  const note = sample ? "FILLS IN AFTER THE FIRST ACTION RUN" : "REFRESHED DAILY";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="830" height="215" viewBox="0 0 830 215">
<style>
  .h{font:400 30px ${SERIF};fill:#f2efe8}
  .hi{font:italic 400 30px ${SERIF};fill:${BLUE}}
  .nt{font:500 11px ${MONO};letter-spacing:1.5px;fill:#7b849a}
  .m{font:500 10px ${MONO};fill:#7b849a}
  .c{opacity:0;animation:pop .5s ease-out forwards}
  @keyframes pop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}
</style>
<rect width="830" height="215" rx="18" fill="#0d1017"/>
<text class="h" x="40" y="42">${esc(cfg.heatmapTitle || "Every day,")} <tspan class="hi">${esc(cfg.heatmapAccent || "in blue")}</tspan></text>
<text class="nt" x="790" y="40" text-anchor="end">${note}</text>
${cells}
${months}
</svg>`.replace(/\n\s*\n/g, "\n");
}

function activity({ days, sample }) {
  const total = days.reduce((a, d) => a + d.n, 0);
  const active = days.filter((d) => d.n > 0).length;
  const busiest = Math.max(0, ...days.map((d) => d.n));
  let longest = 0, run = 0;
  days.forEach((d) => { run = d.n > 0 ? run + 1 : 0; longest = Math.max(longest, run); });
  let cur = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].n > 0) cur++;
    else if (i === days.length - 1) continue; // today may still be empty
    else break;
  }
  // monthly buckets (last 12 months in data order)
  const buckets = new Map();
  days.forEach((d) => buckets.set(d.date.slice(0, 7), (buckets.get(d.date.slice(0, 7)) || 0) + d.n));
  const entries = [...buckets.entries()].slice(-12);
  const maxM = Math.max(1, ...entries.map((e) => e[1]));
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let bars = "";
  entries.forEach(([k, v], i) => {
    const h = Math.max(4, Math.round((v / maxM) * 88));
    const hot = v === maxM;
    bars += `<rect class="bar" x="${44 + i * 46}" y="${210 - h}" width="34" height="${h}" rx="3" fill="${hot ? BLUE : "#14161c"}" style="animation-delay:${i * 0.06}s"/>` +
      `<text class="m" x="${61 + i * 46}" y="232" text-anchor="middle">${names[Number(k.slice(5)) - 1]}</text>`;
    if (hot) bars += `<text class="pk" x="${61 + i * 46}" y="${203 - h}" text-anchor="middle">${v.toLocaleString("en-US")}</text>`;
  });
  const stat = (big, small, y, d) => `<text class="sb" x="620" y="${y}" style="animation-delay:${d}s">${big}</text><text class="ss" x="620" y="${y + 20}">${small}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="830" height="260" viewBox="0 0 830 260">
<style>
  .lb{font:600 11px ${MONO};letter-spacing:2px;fill:#6a7185}
  .big{font:italic 400 60px ${SERIF};fill:#14161c;opacity:0;animation:rise .9s ease-out forwards}
  .m{font:500 10px ${MONO};fill:#6a7185}
  .pk{font:600 11px ${MONO};fill:${BLUE}}
  .sb{font:italic 400 38px ${SERIF};fill:#14161c;opacity:0;animation:rise .8s ease-out forwards}
  .ss{font:400 12.5px ${SANS};fill:#4a5060}
  .bar{transform-box:fill-box;transform-origin:bottom;animation:grow .7s ease-out both}
  @keyframes grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
  @keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
</style>
<rect width="830" height="260" rx="18" fill="#f2efe8" stroke="#dcd7cb"/>
<text class="lb" x="40" y="38">THE LAST 12 MONTHS ON GITHUB${sample ? "  ·  UPDATES AFTER FIRST ACTION RUN" : ""}</text>
<text class="big" x="40" y="96">${total.toLocaleString("en-US")} <tspan style="font-style:italic">contributions</tspan></text>
${bars}
<line x1="600" y1="28" x2="600" y2="232" stroke="#dcd7cb"/>
${stat(`${cur} <tspan style="font-size:20px">${cur === 1 ? "day" : "days"}</tspan>`, "current streak", 70, 0.1)}
${stat(`${longest} <tspan style="font-size:20px">${longest === 1 ? "day" : "days"}</tspan>`, "longest streak", 136, 0.25)}
${stat(`${active} <tspan style="font-size:20px">/ ${days.length}</tspan>`, "days with a commit", 202, 0.4).replace("</text><text", `</text><text`)}
</svg>`;
}

(async () => {
  write("hero.svg", hero());
  cfg.tiles.forEach((t, i) => write(`tile-${i + 1}.svg`, tile(t, i)));
  cfg.projects.forEach((p, i) => write(`repo-${i + 1}.svg`, repoCard(p, i)));
  let data;
  try {
    data = await getDays();
  } catch (e) {
    console.error("Could not load live data, using sample:", e.message);
    data = await (async () => { delete process.env.GITHUB_TOKEN; return getDays(); })();
  }
  write("heatmap.svg", heatmap(data));
  write("activity.svg", activity(data));
  console.log(`Wrote cards to ${OUT} (${data.sample ? "sample" : "live"} data)`);
})();
