/* VITALIS — sections 02–05: habits matrix, a day in sample data,
   signal vs noise, and the cohort demo form. */
import { LEVERS, METRICS, rng } from './data.js';
import { glucoseAt } from './charts.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const SYS = ['Heart', 'Lungs', 'Brain', 'Muscles', 'Sleep', 'Metabolism'];
const easeIO = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

export function initSections({ reduced, mqMobile }) {
  initMatrix(reduced);
  initDay(reduced, mqMobile);
  initSignal(reduced);
  initForm();
}

/* ---------------- 02 · habits × systems ---------------- */
function initMatrix(reduced) {
  const table = $('#matrix');
  if (!table) return;
  const card = $('#lever-card'), heads = $$('thead th', table).slice(1);
  const rows = $$('tbody tr', table), btns = $$('.lever', table);
  let active = -1;
  function select(i) {
    active = active === i ? -1 : i;
    btns.forEach((b, k) => b.setAttribute('aria-pressed', String(k === active)));
    rows.forEach((r, k) => r.classList.toggle('is-on', k === active));
    table.classList.toggle('has-on', active >= 0);
    heads.forEach((h, j) => h.classList.toggle('is-hot', active >= 0 && LEVERS[active].v[j] === 2));
    const fill = () => {
      if (active < 0) {
        $('#lc-k').textContent = 'Legend';
        $('#lc-t').textContent = 'Select a habit';
        $('#lc-p').textContent = 'Each row is an everyday habit. Filled marks show a strong, commonly reported link; rings show some link.';
        card.querySelector('.lever-hits')?.remove();
      } else {
        const l = LEVERS[active];
        $('#lc-k').textContent = `Habit ${String(active + 1).padStart(2, '0')}`;
        $('#lc-t').textContent = l.name;
        $('#lc-p').textContent = l.text;
        let hits = card.querySelector('.lever-hits');
        if (!hits) { hits = document.createElement('p'); hits.className = 'lever-hits'; $('#lc-p').after(hits); }
        hits.innerHTML = l.v.map((v, j) => (v ? `<span class="${v === 1 ? 'is-some' : ''}">${SYS[j]}</span>` : '')).join('');
      }
      card.classList.remove('is-swapping');
    };
    if (reduced) fill(); else { card.classList.add('is-swapping'); setTimeout(fill, 200); }
  }
  btns.forEach((b, i) => b.addEventListener('click', () => select(i)));
}

/* ---------------- 03 · a day in sample data ---------------- */
const STEPS = [0, 0, 0, 0, 0, 0, 300, 900, 1600, 500, 400, 600, 1200, 2800, 500, 400, 700, 900, 1400, 600, 500, 200, 100, 0];
const asleep = (t) => t < 6.5 || t >= 23.25;
function hrAt(t) {
  const g = (c, w, a) => a * Math.exp(-((t - c) ** 2) / (2 * w * w));
  if (asleep(t)) return 55 + 2.5 * Math.sin(t * 2.3) + g(4.6, 0.25, 6) + g(2.6, 0.2, 4) - (t < 3 ? 2 : 0);
  return 66 + 3 * Math.sin(t * 0.9) + g(6.8, 0.4, 8) + g(8.6, 0.15, 20) + g(12.95, 0.2, 40) + g(18.1, 0.25, 16) - g(15, 0.8, 4) + g(19.8, 0.6, 5) - (t > 21 ? (t - 21) * 3 : 0);
}

function initDay(reduced, mqMobile) {
  const svg = $('#daychart');
  if (!svg) return;
  const X0 = 44, X1 = 648;
  const X = (t) => X0 + ((X1 - X0) * t) / 24;
  const HR = (v) => 126 - ((v - 45) / (130 - 45)) * 100;
  const GL = (v) => 246 - ((v - 4) / (9 - 4)) * 86;
  const f = (n) => n.toFixed(1);
  let hr = '', gl = '';
  for (let i = 0; i <= 144; i++) {
    const t = (i / 144) * 24;
    hr += `${i ? 'L' : 'M'}${f(X(t))} ${f(HR(hrAt(t)))} `;
    gl += `${i ? 'L' : 'M'}${f(X(t))} ${f(GL(glucoseAt(t)))} `;
  }
  const grid = [0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => `<path class="ax ax--grid" d="M${f(X(h))} 18 V370"/><text class="ax-t" x="${f(X(h))}" y="390" text-anchor="middle">${String(h).padStart(2, '0')}:00</text>`).join('');
  const steps = STEPS.map((s, h) => `<rect class="dc-steps" data-h="${h}" x="${f(X(h) + 2)}" y="${f(330 - (s / 3000) * 52)}" width="${f((X1 - X0) / 24 - 4)}" height="${f((s / 3000) * 52 + 0.01)}" rx="1.5"/>`).join('');
  const sleep = `<rect class="dc-sleep" x="${X(0)}" y="350" width="${f(X(6.5) - X(0))}" height="16" rx="2"/><rect class="dc-sleep" x="${f(X(23.25))}" y="350" width="${f(X(24) - X(23.25))}" height="16" rx="2"/>`
    + `<rect class="dc-sleep--deep" x="${f(X(0.3))}" y="350" width="${f(X(1.4) - X(0.3))}" height="16" rx="2"/><rect class="dc-sleep--deep" x="${f(X(2))}" y="350" width="${f(X(2.6) - X(2))}" height="16" rx="2"/>`;
  svg.innerHTML = `<defs><linearGradient id="area-amber" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2B84B" stop-opacity=".22"/><stop offset="1" stop-color="#F2B84B" stop-opacity="0"/></linearGradient></defs>
    ${grid}
    <text class="dc-track" x="0" y="22">Heart rate</text><text class="dc-track" x="0" y="156">Glucose</text><text class="dc-track" x="0" y="272">Steps</text><text class="dc-track" x="0" y="346">Sleep</text>
    ${[60, 90, 120].map((v) => `<text class="ax-t" x="${X0 - 6}" y="${f(HR(v) + 3)}" text-anchor="end">${v}</text>`).join('')}
    ${[5, 7, 9].map((v) => `<text class="ax-t" x="${X0 - 6}" y="${f(GL(v) + 3)}" text-anchor="end">${v}</text>`).join('')}
    <path d="${gl} L${X1} 246 L${X0} 246 Z" fill="url(#area-amber)"/>
    <path class="ln" d="${hr}"/>
    <path class="ln ln--amber" d="${gl}"/>
    ${steps}${sleep}
    <g class="dc-cursor-g" id="dc-cursor">
      <path class="dc-cursor" d="M0 14 V372"/>
      <circle class="dc-cursor-dot dc-cursor-dot--hr" id="dc-hr" cx="0" cy="0" r="5"/>
      <circle class="dc-cursor-dot dc-cursor-dot--glu" id="dc-glu" cx="0" cy="0" r="5"/>
      <text class="dc-time" id="dc-time" x="6" y="12">06:30</text>
    </g>`;
  const cursor = $('#dc-cursor'), dHr = $('#dc-hr'), dGl = $('#dc-glu'), dTime = $('#dc-time');
  const rTime = $('#dr-time'), rHr = $('#dr-hr'), rGl = $('#dr-glu'), rSteps = $('#dr-steps');
  const bars = $$('.dc-steps', svg);
  cursor.style.transition = 'none';
  let tNow = 6.5, anim = 0;
  const hhmm = (t) => { const h = Math.floor(t) % 24, m = Math.round((t - Math.floor(t)) * 60); return `${String(m === 60 ? h + 1 : h).padStart(2, '0')}:${String(m === 60 ? 0 : m).padStart(2, '0')}`; };
  function place(t) {
    const x = X(t);
    cursor.setAttribute('transform', `translate(${f(x)} 0)`);
    dHr.setAttribute('cy', f(HR(hrAt(t))));
    dGl.setAttribute('cy', f(GL(glucoseAt(t))));
    dTime.textContent = hhmm(t);
    dTime.setAttribute('x', x > X1 - 50 ? '-40' : '6');
    rTime.textContent = hhmm(t);
    rHr.textContent = Math.round(hrAt(t));
    rGl.textContent = glucoseAt(t).toFixed(1);
    const h = Math.min(23, Math.floor(t));
    rSteps.textContent = STEPS[h].toLocaleString('en-GB');
    bars.forEach((b) => b.classList.toggle('is-hot', +b.dataset.h === h));
  }
  function goTo(t) {
    cancelAnimationFrame(anim);
    if (reduced) { tNow = t; place(t); return; }
    const from = tNow, t0 = performance.now(), dur = 900;
    const step = () => {
      const u = Math.min(1, (performance.now() - t0) / dur);
      tNow = from + (t - from) * easeIO(u);
      place(tNow);
      if (u < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }
  place(tNow);
  const moments = $$('#moments .moment');
  let obs;
  const build = () => {
    obs?.disconnect();
    obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        moments.forEach((m) => m.classList.toggle('is-on', m === en.target));
        goTo(+en.target.dataset.t);
      });
    }, { rootMargin: mqMobile.matches ? '-66% 0px -22% 0px' : '-45% 0px -45% 0px' });
    moments.forEach((m) => obs.observe(m));
  };
  build();
  mqMobile.addEventListener('change', build);
}

/* ---------------- 04 · signal vs noise ---------------- */
function series(key) {
  const m = METRICS[key];
  const r = rng(key === 'rhr' ? 101 : key === 'hrv' ? 202 : 303);
  const gauss = () => { const u = Math.max(1e-6, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  return Array.from({ length: 90 }, (_, i) => {
    let v = m.base + (m.drift * i) / 89 + gauss() * m.noise * 0.6;
    if (i >= 50 && i <= 55) v += m.event * Math.sin(((i - 49) / 7) * Math.PI);
    if (key === 'sleep' && (i % 7 === 5 || i % 7 === 6)) v += 0.4;
    return v;
  });
}
const rolling = (a) => a.map((_, i) => { const s = a.slice(Math.max(0, i - 6), i + 1); return s.reduce((x, y) => x + y, 0) / s.length; });

function initSignal(reduced) {
  const svg = $('#signal-chart');
  if (!svg) return;
  const X0 = 52, X1 = 704, Y0 = 26, Y1 = 306;
  const X = (i) => X0 + ((X1 - X0) * i) / 89;
  const f = (n) => n.toFixed(1);
  let metric = 'rhr';
  let curY = null, curAvg = null, curBand = null, anim = 0;
  const layers = { daily: true, avg: false, band: false };

  svg.innerHTML = `<g id="sg-axis"></g>
    <g class="sg-layer is-off" data-layer="band"><rect class="sg-band" id="sg-band" x="${X0}" y="0" width="${X1 - X0}" height="0"/></g>
    <rect x="${f(X(50))}" y="${Y0}" width="${f(X(55) - X(50))}" height="${Y1 - Y0}" fill="rgba(242,184,75,.06)"/>
    <text class="sg-event-t" x="${f(X(52.5))}" y="${Y0 - 8}" text-anchor="middle">A cold · days 51–56</text>
    <g class="sg-layer" data-layer="daily"><path class="sg-line" id="sg-line"/><g id="sg-dots">${Array.from({ length: 90 }, (_, i) => `<circle class="sg-dot${i >= 50 && i <= 55 ? ' is-event' : ''}" r="2.6" cx="${f(X(i))}" cy="${Y1}"/>`).join('')}</g></g>
    <g class="sg-layer is-off" data-layer="avg"><path class="sg-avg" id="sg-avg"/></g>
    ${[[0, '90 days ago'], [30, '60'], [60, '30'], [89, 'Today']].map(([i, t]) => `<text class="ax-t" x="${f(X(i))}" y="${Y1 + 22}" text-anchor="${i === 0 ? 'start' : i === 89 ? 'end' : 'middle'}">${t}</text>`).join('')}`;
  const axis = $('#sg-axis'), band = $('#sg-band'), line = $('#sg-line'), avgP = $('#sg-avg'), dots = $$('#sg-dots circle');

  function targets(key) {
    const m = METRICS[key], s = series(key), a = rolling(s);
    const Y = (v) => Y1 - ((v - m.yMin) / (m.yMax - m.yMin)) * (Y1 - Y0);
    return { y: s.map(Y), avg: a.map(Y), band: [Y(m.band[1]), Y(m.band[0])], raw: s, rawAvg: a, m, Y };
  }
  function drawAxis(tg) {
    const { m, Y } = tg;
    const ticks = [m.yMin, (m.yMin + m.yMax) / 2, m.yMax];
    axis.innerHTML = ticks.map((v) => `<path class="ax ax--grid" d="M${X0} ${f(Y(v))} H${X1}"/><text class="ax-t" x="${X0 - 8}" y="${f(Y(v) + 3)}" text-anchor="end">${m.dec ? v.toFixed(1) : Math.round(v)}</text>`).join('')
      + `<text class="ax-t" x="${X0 - 8}" y="${Y0 - 8}" text-anchor="end">${m.unit}</text>`;
  }
  function paint(y, avg, bd) {
    line.setAttribute('d', y.map((v, i) => `${i ? 'L' : 'M'}${f(X(i))} ${f(v)}`).join(' '));
    dots.forEach((d, i) => d.setAttribute('cy', f(y[i])));
    avgP.setAttribute('d', avg.map((v, i) => `${i ? 'L' : 'M'}${f(X(i))} ${f(v)}`).join(' '));
    band.setAttribute('y', f(bd[0]));
    band.setAttribute('height', f(Math.max(0, bd[1] - bd[0])));
  }
  function stats(tg) {
    const { raw, rawAvg, m } = tg;
    const fmt = (v) => `${m.dec ? v.toFixed(1) : Math.round(v)} ${m.unit}`;
    $('#ss-last').textContent = fmt(raw[89]);
    $('#ss-avg').textContent = fmt(rawAvg[89]);
    $('#ss-range').textContent = `${m.dec ? Math.min(...raw).toFixed(1) : Math.round(Math.min(...raw))}–${fmt(Math.max(...raw))}`;
  }
  function show(key, first = false) {
    metric = key;
    const tg = targets(key);
    drawAxis(tg);
    stats(tg);
    const note = $('.signal__note');
    const fill = () => { $('#sn-title').textContent = tg.m.label; $('#sn-text').textContent = tg.m.text; note.classList.remove('is-swapping'); };
    if (first || reduced) fill(); else { note.classList.add('is-swapping'); setTimeout(fill, 220); }
    cancelAnimationFrame(anim);
    if (first || reduced || !curY) { curY = tg.y; curAvg = tg.avg; curBand = tg.band; paint(curY, curAvg, curBand); return; }
    const fy = curY.slice(), fa = curAvg.slice(), fb = curBand.slice(), t0 = performance.now(), dur = 750;
    const step = () => {
      const u = easeIO(Math.min(1, (performance.now() - t0) / dur));
      curY = fy.map((v, i) => v + (tg.y[i] - v) * u);
      curAvg = fa.map((v, i) => v + (tg.avg[i] - v) * u);
      curBand = fb.map((v, i) => v + (tg.band[i] - v) * u);
      paint(curY, curAvg, curBand);
      if (u < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }
  $$('.seg__btn').forEach((b) => b.addEventListener('click', () => {
    $$('.seg__btn').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    if (b.dataset.metric !== metric) show(b.dataset.metric);
  }));
  $$('.tog').forEach((t) => t.addEventListener('click', () => {
    const k = t.dataset.layer;
    layers[k] = !layers[k];
    t.setAttribute('aria-checked', String(layers[k]));
    svg.querySelector(`.sg-layer[data-layer="${k}"]`).classList.toggle('is-off', !layers[k]);
  }));
  show('rhr', true);
}

/* ---------------- 05 · cohort form ---------------- */
function initForm() {
  const form = $('#cohort-form');
  if (!form) return;
  const sel = $('#c-cohort');
  const now = new Date();
  for (let k = 1; k <= 3; k++) {
    const d = new Date(now.getFullYear(), now.getMonth() + k, 1);
    while (d.getDay() !== 2) d.setDate(d.getDate() + 1); // first Tuesday
    const label = `Tuesday evenings from ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    sel.add(new Option(label, label));
  }
  const F = {
    name: { el: $('#c-name'), err: $('#e-cname'), check: (v) => (v.trim().length < 2 ? 'Please enter your name.' : '') },
    email: { el: $('#c-email'), err: $('#e-cemail'), check: (v) => (!v.trim() ? 'Please enter your email address.' : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? 'That email address looks incomplete.' : '') },
    cohort: { el: sel, err: $('#e-cohort'), check: (v) => (v ? '' : 'Please choose a start date.') },
  };
  const boxes = $$('input[name="focus"]', form), focusErr = $('#e-focus');
  const check = (f) => { const m = f.check(f.el.value); f.err.textContent = m; f.el.setAttribute('aria-invalid', m ? 'true' : 'false'); return !m; };
  Object.values(F).forEach((f) => {
    f.el.addEventListener('blur', () => { if (f.el.value) check(f); });
    f.el.addEventListener('input', () => { if (f.el.getAttribute('aria-invalid') === 'true') check(f); });
    f.el.addEventListener('change', () => { if (f.el.getAttribute('aria-invalid') === 'true') check(f); });
  });
  boxes.forEach((b) => b.addEventListener('change', () => { if (boxes.some((x) => x.checked)) focusErr.textContent = ''; }));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const okN = check(F.name), okE = check(F.email);
    const chosen = boxes.filter((b) => b.checked).map((b) => b.value);
    focusErr.textContent = chosen.length ? '' : 'Please choose at least one system.';
    const okC = check(F.cohort);
    const bad = !okN ? F.name.el : !okE ? F.email.el : !chosen.length ? boxes[0] : !okC ? F.cohort.el : null;
    if (bad) { bad.focus(); return; }
    $('#cohort-done-t').textContent = `Request logged, ${F.name.el.value.trim().split(/\s+/)[0]}.`;
    $('#cohort-done-p').textContent = `This is a portfolio demo: nothing was sent and no place was reserved. Your focus (${chosen.join(', ')}) would shape the questions we prepare for ${F.cohort.el.value.toLowerCase()}.`;
    const done = $('#cohort-done');
    done.hidden = false;
    done.focus();
  });
  $('#cohort-again').addEventListener('click', () => {
    form.reset();
    Object.values(F).forEach((f) => { f.err.textContent = ''; f.el.removeAttribute('aria-invalid'); });
    focusErr.textContent = '';
    $('#cohort-done').hidden = true;
    F.name.el.focus();
  });
}
