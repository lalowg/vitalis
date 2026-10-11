/* VITALIS — panel charts (SVG, 360 × 190). All data is sample data. */
import { rng } from './data.js';

const L = 36, R = 350, T = 12, B = 160;
const f = (n) => (Math.round(n * 10) / 10).toString();
const sx = (i, n) => L + ((R - L) * i) / Math.max(1, n - 1);
const sy = (v, a, b) => B - ((v - a) / (b - a)) * (B - T);
const DEFS = '<defs><linearGradient id="area-cyan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FD1C5" stop-opacity=".28"/><stop offset="1" stop-color="#4FD1C5" stop-opacity="0"/></linearGradient></defs>';

function yGrid(a, b, ticks, unit) {
  return ticks.map((v) => `<path class="ax ax--grid" d="M${L} ${f(sy(v, a, b))} H${R}"/><text class="ax-t" x="${L - 6}" y="${f(sy(v, a, b) + 3)}" text-anchor="end">${v}</text>`).join('')
    + (unit ? `<text class="ax-t" x="${L - 6}" y="${T - 2}" text-anchor="end">${unit}</text>` : '');
}
function xLabels(labels) {
  return labels.map((t, k) => `<text class="ax-t" x="${f(L + ((R - L) * k) / (labels.length - 1))}" y="178" text-anchor="${k === 0 ? 'start' : k === labels.length - 1 ? 'end' : 'middle'}">${t}</text>`).join('');
}
function regress(vals) {
  const n = vals.length; let sxv = 0, syv = 0, sxx = 0, sxy = 0;
  vals.forEach((v, i) => { sxv += i; syv += v; sxx += i * i; sxy += i * v; });
  const m = (n * sxy - sxv * syv) / (n * sxx - sxv * sxv), c = (syv - m * sxv) / n;
  return [c, c + m * (n - 1)];
}

function line(c, seed) {
  const r = rng(seed);
  const vals = Array.from({ length: c.n }, (_, i) => c.from + ((c.to - c.from) * i) / (c.n - 1) + (r() - 0.5) * 2 * c.noise);
  const pts = vals.map((v, i) => [sx(i, c.n), sy(v, c.yMin, c.yMax)]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join(' ');
  const [a, b] = regress(vals);
  const mid = (c.yMin + c.yMax) / 2;
  const last = pts[pts.length - 1];
  return DEFS + yGrid(c.yMin, c.yMax, [c.yMin, mid, c.yMax].map((v) => Math.round(v)), c.unit)
    + `<path class="ar fade" d="${d} L${R} ${B} L${L} ${B} Z"/>`
    + `<path class="ln--trend fade" d="M${L} ${f(sy(a, c.yMin, c.yMax))} L${R} ${f(sy(b, c.yMin, c.yMax))}"/>`
    + `<path class="ln draw" pathLength="1" d="${d}"/>`
    + (c.n <= 12 ? pts.map((p, i) => `<circle class="dot pop" cx="${f(p[0])}" cy="${f(p[1])}" r="2.6" style="--d:${(0.3 + i * 0.05).toFixed(2)}s"/>`).join('') : '')
    + `<circle class="dot--hollow pop" cx="${f(last[0])}" cy="${f(last[1])}" r="4.5" style="--d:1s"/>`
    + `<text class="ax-t ax-t--c fade" x="${R}" y="${f(last[1] - 10)}" text-anchor="end">${vals[vals.length - 1].toFixed(0)} ${c.unit}</text>`
    + `<text class="ax-t fade" x="${R}" y="${T + 6}" text-anchor="end" style="fill:#F2B84B">- - trend</text>`
    + xLabels(c.xl);
}

function scatter(seed) {
  const r = rng(seed);
  const xa = 5.5, xb = 8.5, ya = 260, yb = 380;
  const pts = Array.from({ length: 24 }, () => {
    const x = xa + 0.2 + r() * 2.6;
    const y = 372 - 26 * (x - 5.5) + (r() - 0.5) * 34;
    return [x, y];
  });
  const X = (x) => L + ((x - xa) / (xb - xa)) * (R - L);
  const Y = (y) => sy(y, ya, yb);
  const [a, b] = (() => { const n = pts.length; let s1 = 0, s2 = 0, s3 = 0, s4 = 0; pts.forEach(([x, y]) => { s1 += x; s2 += y; s3 += x * x; s4 += x * y; }); const m = (n * s4 - s1 * s2) / (n * s3 - s1 * s1); const c0 = (s2 - m * s1) / n; return [c0 + m * xa, c0 + m * xb]; })();
  return yGrid(ya, yb, [280, 320, 360], 'ms')
    + `<path class="ln--trend draw" pathLength="1" d="M${L} ${f(Y(a))} L${R} ${f(Y(b))}"/>`
    + pts.map(([x, y], i) => `<circle class="dot pop" cx="${f(X(x))}" cy="${f(Y(y))}" r="3.2" style="--d:${(i * 0.03).toFixed(2)}s;opacity:.85"/>`).join('')
    + [6, 7, 8].map((h) => `<text class="ax-t" x="${f(X(h))}" y="178" text-anchor="middle">${h} h</text>`).join('')
    + `<text class="ax-t" x="${R}" y="${T + 6}" text-anchor="end" style="fill:#F2B84B">more sleep, quicker reactions (sample)</text>`;
}

function bars(c) {
  const max = 14, x0 = 82, w = R - x0 - 26, h = 16, gap = (B - T - c.rows.length * h) / (c.rows.length - 1);
  return c.rows.map(([name, v], i) => {
    const y = T + i * (h + gap);
    return `<text class="ax-t" x="0" y="${f(y + 11.5)}">${name.toUpperCase()}</text>`
      + `<rect class="bar--bg" x="${x0}" y="${f(y)}" width="${w}" height="${h}" rx="2"/>`
      + `<rect class="bar grow" x="${x0}" y="${f(y)}" width="${f((v / max) * w)}" height="${h}" rx="2" style="--d:${(i * 0.07).toFixed(2)}s"/>`
      + `<text class="ax-t ax-t--c fade" x="${f(x0 + (v / max) * w + 6)}" y="${f(y + 11.5)}">${v}</text>`;
  }).join('') + `<text class="ax-t" x="${R}" y="178" text-anchor="end">sets per week</text>`;
}

function hypno() {
  const seq = [[12, 2], [25, 3], [20, 2], [10, 1], [5, 0], [20, 2], [30, 3], [25, 2], [18, 1], [30, 2], [15, 3], [20, 2], [28, 1], [3, 0], [35, 2], [8, 3], [25, 2], [32, 1], [10, 2], [4, 0]];
  const total = seq.reduce((s, [d]) => s + d, 0);
  const x0 = 62, rows = ['AWAKE', 'REM', 'LIGHT', 'DEEP'];
  const Y = (s) => T + 10 + s * 40;
  let t = 0, d = '', deep = '';
  seq.forEach(([dur, s], i) => {
    const xa = x0 + ((R - x0) * t) / total, xb = x0 + ((R - x0) * (t + dur)) / total;
    d += `${i ? 'L' : 'M'}${f(xa)} ${Y(s)} L${f(xb)} ${Y(s)} `;
    if (s === 3) deep += `<rect class="dc-sleep--deep fade" x="${f(xa)}" y="${Y(3) - 7}" width="${f(xb - xa)}" height="14" rx="2"/>`;
    if (s === 1) deep += `<rect class="fade" x="${f(xa)}" y="${Y(1) - 5}" width="${f(xb - xa)}" height="10" rx="2" fill="rgba(242,184,75,.35)"/>`;
    t += dur;
  });
  return rows.map((n, i) => `<rect class="hy-band" x="${x0}" y="${Y(i) - 14}" width="${R - x0}" height="28"/><text class="ax-t" x="0" y="${Y(i) + 3}">${n}</text>`).join('')
    + deep + `<path class="ln draw" pathLength="1" d="${d}"/>`
    + `<text class="ax-t" x="${x0}" y="178">23:15</text><text class="ax-t" x="${(x0 + R) / 2}" y="178" text-anchor="middle">03:00</text><text class="ax-t" x="${R}" y="178" text-anchor="end">06:39</text>`;
}

export function glucoseAt(t) {
  const meal = (t0, amp, k = 0.75) => { const x = t - t0; return x > 0 ? amp * (x / k) * Math.exp(1 - x / k) : 0; };
  return 4.95 + 0.3 * Math.exp(-((t - 5.5) ** 2) / 2) + meal(8, 2.3) + meal(12.6, 1.4) + meal(19.6, 2.6) + 0.06 * Math.sin(t * 3.1);
}

function glucose() {
  const a = 3.5, b = 9;
  let d = '';
  for (let i = 0; i <= 96; i++) { const t = (i / 96) * 24; d += `${i ? 'L' : 'M'}${f(L + ((R - L) * t) / 24)} ${f(sy(glucoseAt(t), a, b))} `; }
  const meals = [[8, 'Breakfast'], [12.6, 'Lunch'], [19.6, 'Dinner']];
  return DEFS + yGrid(a, b, [4, 6, 8], 'mmol/L')
    + `<path class="ar fade" d="${d} L${R} ${B} L${L} ${B} Z"/>`
    + `<path class="ln draw" pathLength="1" d="${d}"/>`
    + meals.map(([t, n], i) => { const x = L + ((R - L) * t) / 24; return `<g class="pop" style="--d:${(0.6 + i * 0.15).toFixed(2)}s"><circle class="meal" cx="${f(x)}" cy="${B - 4}" r="3.5"/><text class="ax-t" x="${f(x)}" y="${B - 12}" text-anchor="middle" style="fill:#F2B84B">${n}</text></g>`; }).join('')
    + xLabels(['00:00', '06:00', '12:00', '18:00', '24:00']);
}

function radar() {
  const cx = 180, cy = 95, rr = 72;
  const names = ['HEART', 'LUNGS', 'BRAIN', 'MUSCLES', 'SLEEP', 'METABOLISM'];
  const vals = [78, 64, 70, 58, 82, 66];
  const P = (k, s) => { const a = -Math.PI / 2 + (k / 6) * Math.PI * 2; return [cx + Math.cos(a) * rr * s, cy + Math.sin(a) * rr * s]; };
  let rings = '';
  [0.25, 0.5, 0.75, 1].forEach((s) => { rings += `<path class="radar-ring" d="${names.map((_, k) => `${k ? 'L' : 'M'}${P(k, s).map(f).join(' ')}`).join(' ')} Z"/>`; });
  const spokes = names.map((_, k) => `<path class="ax ax--grid" d="M${cx} ${cy} L${P(k, 1).map(f).join(' ')}"/>`).join('');
  const area = vals.map((v, k) => `${k ? 'L' : 'M'}${P(k, v / 100).map(f).join(' ')}`).join(' ') + ' Z';
  const labels = names.map((n, k) => { const [x, y] = P(k, 1.2); return `<text class="ax-t" x="${f(x)}" y="${f(y + 3)}" text-anchor="${Math.abs(x - cx) < 4 ? 'middle' : x > cx ? 'start' : 'end'}">${n} ${vals[k]}</text>`; }).join('');
  return rings + spokes + `<path class="radar-area grow-r" d="${area}"/>` + labels;
}

export function chartMarkup(key, cfg) {
  switch (cfg.type) {
    case 'line': return line(cfg, key === 'heart' ? 11 : 23);
    case 'scatter': return scatter(37);
    case 'bars': return bars(cfg);
    case 'hypno': return hypno();
    case 'glucose': return glucose();
    default: return radar();
  }
}

export function drawChart(svg, key, cfg, reduced, desc) {
  const apply = () => {
    svg.innerHTML = `<desc id="chart-desc">${desc}</desc>` + chartMarkup(key, cfg);
    svg.classList.remove('out');
    if (reduced) return;
    svg.classList.add('pre');
    void svg.getBoundingClientRect();
    requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.remove('pre')));
  };
  if (reduced || !svg.childElementCount) { apply(); return; }
  svg.classList.add('out');
  setTimeout(apply, 200);
}
