/* VITALIS — header, body atlas & system panel, reveals. */
import { SYSTEMS, SYSTEM_ORDER } from './data.js';
import { drawChart } from './charts.js';
import { initSections } from './sections.js';

window.vtReady = true;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mqMobile = window.matchMedia('(max-width: 1020px)');
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

/* ---------------- header ---------------- */
const header = $('#site-header'), menuBtn = $('.menu-btn'), nav = $('#site-nav');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
function setMenu(open) {
  menuBtn.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
  header.classList.toggle('is-menu', open);
  if (open) nav.querySelector('a')?.focus();
}
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', (e) => { if (e.target.closest('a') && mqMobile.matches) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); } });
mqMobile.addEventListener('change', () => setMenu(false));
const navLinks = $$('#site-nav a');
const secObs = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    navLinks.forEach((a) => { if (a.getAttribute('href') === `#${en.target.id}`) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach((a) => { const s = document.querySelector(a.getAttribute('href')); if (s) secObs.observe(s); });

/* ---------------- body atlas ---------------- */
const view = $('#body-view');
const atlas = $('#atlas');
const btns = $$('.sysbtn');
const groups = $$('.sys', atlas);
const callouts = $$('.callouts__set', atlas);
const panel = $('#panel');
const chartSvg = $('#chart');
const scanSys = $('#scan-sys');
let current = 'all';

const numRe = /^-?[\d,]*\.?\d+$/;
function countTo(el, text) {
  if (reduced || !numRe.test(text)) { el.textContent = text; return; }
  const target = parseFloat(text.replace(/,/g, ''));
  const dec = (text.split('.')[1] || '').length;
  const comma = text.includes(',');
  const from = parseFloat((el.textContent || '0').replace(/,/g, '')) || 0;
  const t0 = performance.now(), dur = 700;
  const step = () => {
    const u = Math.min(1, (performance.now() - t0) / dur);
    const e = 1 - Math.pow(1 - u, 3);
    const v = from + (target - from) * e;
    el.textContent = comma ? Math.round(v).toLocaleString('en-GB') : v.toFixed(dec);
    if (u < 1) requestAnimationFrame(step); else el.textContent = text;
  };
  requestAnimationFrame(step);
}

function fillPanel(key) {
  const s = SYSTEMS[key];
  $('#panel-sys').textContent = s.sys;
  $('#panel-title').textContent = s.title;
  $('#panel-tag').textContent = s.tag;
  s.kpis.forEach(([label, v, unit, tag], i) => {
    $(`#kpi-l-${i}`).textContent = label;
    countTo($(`#kpi-v-${i}`), v);
    $(`#kpi-u-${i}`).textContent = unit;
    $(`#kpi-t-${i}`).textContent = tag;
  });
  $('#chart-cap').textContent = s.chart.cap;
  $('#panel-research').textContent = s.research;
  $('#panel-levers').innerHTML = s.levers.map((l) => `<li>${l}</li>`).join('');
}

function select(key, opts = {}) {
  if (!SYSTEMS[key]) return;
  if (key === current && !opts.force) return;
  current = key;
  view.dataset.sys = key;
  btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sys === key)));
  groups.forEach((g) => g.classList.toggle('is-on', g.dataset.sys === key));
  callouts.forEach((c) => c.classList.toggle('is-on', c.dataset.sys === key));
  scanSys.textContent = key === 'all' ? 'Layer · all systems' : `Layer · ${SYSTEMS[key].title.toLowerCase()}`;
  const desc = `${SYSTEMS[key].chart.cap}. Sample data, illustrative only.`;
  drawChart(chartSvg, key, SYSTEMS[key].chart, reduced, desc);
  if (opts.initial || reduced) { fillPanel(key); return; }
  panel.classList.add('is-swapping');
  setTimeout(() => { fillPanel(key); panel.classList.remove('is-swapping'); }, 220);
}

btns.forEach((b, i) => {
  b.addEventListener('click', () => select(b.dataset.sys));
  b.addEventListener('keydown', (e) => {
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const n = btns[(i + d + btns.length) % btns.length];
    n.focus();
    select(n.dataset.sys);
  });
});
groups.forEach((g) => g.addEventListener('click', () => select(current === g.dataset.sys ? 'all' : g.dataset.sys)));

// circadian "now" marker + local clock
const nowMarker = $('#now-marker'), clock = $('#scan-clock');
function tick() {
  const d = new Date();
  const h = d.getHours() + d.getMinutes() / 60;
  nowMarker.style.transform = `rotate(${(h / 24) * 360}deg)`;
  clock.textContent = `Local time · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
tick();
setInterval(tick, 30000);

select('all', { initial: true, force: true });

// gentle invitation: cycle once through the systems the first time the atlas is idle (motion allowed only)
if (!reduced) {
  let touched = false, idx = 0, timer = 0;
  const stop = () => { touched = true; clearTimeout(timer); };
  [...btns, ...groups].forEach((el) => { el.addEventListener('pointerdown', stop); el.addEventListener('click', stop, true); });
  btns.forEach((el) => el.addEventListener('keydown', stop));
  const tour = () => {
    if (touched || document.hidden) return;
    if (view.getBoundingClientRect().bottom < 0) { touched = true; select('all'); return; }
    if (idx >= SYSTEM_ORDER.length) { select('all'); return; }
    select(SYSTEM_ORDER[idx++]);
    timer = setTimeout(tour, 2600);
  };
  timer = setTimeout(tour, 2200);
}

/* ---------------- reveals ---------------- */
const rev = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); rev.unobserve(en.target); } });
}, { rootMargin: '0px 0px -10% 0px' });
$$('.scan-in').forEach((el) => rev.observe(el));

initSections({ reduced, mqMobile });
