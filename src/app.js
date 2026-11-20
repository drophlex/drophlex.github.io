(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = { get(k, d) { try { const v = localStorage.getItem('psl-' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
                set(k, v) { try { localStorage.setItem('psl-' + k, JSON.stringify(v)); } catch {} } };
const PAPER = '#ecebe5', INK = '#0d0d0f', RED = '#ff3b22';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────────── content ───────────── */
// YouTube: paste video IDs (the 11 characters after "watch?v=") to feature them. Empty = channel cards.
const VIDEOS = [
  // { id: 'XXXXXXXXXXX', es: 'Título', en: 'Title' },
];
const GH = 'https://github.com/drophlex/';
const SOFT = [
  { n: 'ÓRBITA', sub: ['Sintetizador generativo', 'Generative synthesizer'], p: ['Planetas que tocan notas al orbitar. La radio de esta página es su versión mini.', 'Planets that play notes as they orbit. This page’s radio is its mini version.'],
    tags: [['Open source'], ['Web · VST3 · FM-1', 'w']], links: [['Web', 'https://drophlex.github.io/ORBITA/'], ['GitHub', GH + 'ORBITA']] },
  { n: 'ANDRÓMEDA', sub: ['Texturas y espacios', 'Textures & spaces'], p: ['Instrumento ambient con eco de cinta Space Tape y visuales de arte matemático.', 'Ambient instrument with Space Tape echo and mathematical-art visuals.'],
    tags: [['Open source'], ['Web · VST · FM-1', 'w']], links: [['Web', 'https://drophlex.github.io/ANDROMEDA/'], ['GitHub', GH + 'ANDROMEDA'], ['FM-1', GH + 'ANDROMEDAFM1']] },
  { n: 'PULSAR', sub: ['Ritmo / secuencia / FX', 'Rhythm / sequence / FX'], p: ['Caja de ritmos de breaks e IDM.', 'Breaks and IDM drum machine.'],
    tags: [['Open source'], ['Web · VST · FM-1', 'w']], links: [['GitHub', GH + 'PULSAR']] },
  { n: 'DFD ACID', sub: ['Sintetizador acid', 'Acid synthesizer'], p: ['Sinte y secuenciador acid con slides y acentos.', 'Acid synth and sequencer with slides and accents.'],
    tags: [['Lab'], ['Web · VST3 · AU · FM-1', 'w']], links: [['GitHub', GH + 'DFD-ACID-ENGINE']] },
  { n: 'OMEGA', sub: ['Master / mix bus', 'Master / mix bus'], p: ['Procesador de mastering con loudness BS.1770, pico real y A/B honesto al mismo volumen.', 'Mastering processor with BS.1770 loudness, true peak and honest level-matched A/B.'],
    tags: [['US$49', 'c'], [['Prueba 15 días', '15-day trial'], 'w']], links: [['GitHub', GH + 'OMEGA'], [['Descargar', 'Download'], GH + 'OMEGA/releases/latest']] },
  { n: 'CONSTELLATION', sub: ['Mezclador 3D / surround', '3D mixer / surround'], p: ['Mezcla moviendo estrellas: desenmascarado espectral, binaural y surround hasta 7.1.4.', 'Mix by moving stars: spectral unmasking, binaural and surround up to 7.1.4.'],
    tags: [['US$39', 'c'], [['Prueba 30 días', '30-day trial'], 'w']], links: [['GitHub', GH + 'CONSTELLATION'], [['Descargar', 'Download'], GH + 'CONSTELLATION/releases/latest']] },
  { n: 'DARK FUNK DURCAL', sub: ['Groovebox FM-1', 'FM-1 groovebox'], p: ['Firmware groovebox para el M-VAVE FM-1.', 'Groovebox firmware for the M-VAVE FM-1.'],
    tags: [['Open source'], ['FM-1', 'w']], links: [['GitHub', GH + 'dark-funk-durcal-synt-fm1']] },
  { n: 'DFD SYNTH', sub: ['Plug-in de síntesis', 'Synth plug-in'], p: ['El sinte de Dark Funk Durcal como plug-in.', 'The Dark Funk Durcal synth as a plug-in.'],
    tags: [['Open source'], ['VST3', 'w']], links: [['GitHub', GH + 'dfd-synth-plugin']] },
  { n: 'POLARIS ACÚSTICA', sub: ['Medición y análisis', 'Measurement & analysis'], p: ['App de medición acústica de salas: la herramienta de nuestra asesoría.', 'Room acoustic measurement app: the tool behind our consulting.'],
    tags: [['Open source'], ['App', 'w']], links: [['GitHub', GH + 'polaris-acustica']] },
];

/* ───────────── i18n ───────────── */
let lang = store.get('lang', (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en');
const L = (pair) => Array.isArray(pair) ? (lang === 'es' ? pair[0] : pair[1]) : pair;
function applyLang() {
  document.documentElement.lang = lang;
  $$('[data-en]').forEach(el => {
    if (el.dataset.es === undefined) el.dataset.es = el.innerHTML;
    el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.es;
  });
  $$('[data-ph-en]').forEach(el => { if (!el.dataset.phEs) el.dataset.phEs = el.placeholder; el.placeholder = lang === 'en' ? el.dataset.phEn : el.dataset.phEs; });
  $('#lang').textContent = lang === 'es' ? 'EN' : 'ES';
  renderSoft(); renderVids(); renderStations(); knobs.forEach(k => k.label());
  updateButtons();
}
$('#lang').addEventListener('click', () => { lang = lang === 'es' ? 'en' : 'es'; store.set('lang', lang); applyLang(); });

function renderSoft() {
  const box = $('#soft'); $$('.app', box).forEach(e => e.remove());
  SOFT.forEach((s, i) => {
    const a = document.createElement('article'); a.className = 'app';
    a.innerHTML = `<span class="idx">/${String(i + 1).padStart(2, '0')}</span><h3>${s.n}</h3><span class="sub mono">${L(s.sub)}</span>
      <div class="tags">${s.tags.map(t => `<span class="tag ${t[1] || ''}">${L(t[0])}</span>`).join('')}</div><p>${L(s.p)}</p>
      <div class="links">${s.links.map(l => `<a href="${l[1]}" target="_blank" rel="noopener">${L(l[0])} ↗</a>`).join('')}</div>`;
    box.appendChild(a);
  });
}

/* ───────────── audio engine: ÓRBITA mini ───────────── */
const STATIONS = [
  { id: 'orbita', n: 'ÓRBITA', d: ['Campanas en órbita', 'Orbiting bells'], scale: [0, 2, 4, 6, 7, 9, 11], voice: 'bell', bpm: 84, pad: 1, rev: .42, dly: .32, root: 2 },
  { id: 'andromeda', n: 'ANDRÓMEDA', d: ['Texturas y espacios', 'Textures & spaces'], scale: [0, 2, 3, 5, 7, 9, 10], voice: 'glass', bpm: 62, pad: 1.5, rev: .68, dly: .48, root: 9 },
  { id: 'pulsar', n: 'PULSAR', d: ['Ritmo / secuencia', 'Rhythm / sequence'], scale: [0, 3, 5, 7, 10], voice: 'pluck', bpm: 112, pad: .55, rev: .3, dly: .3, root: 9, drums: 'breaks' },
  { id: 'acid', n: 'DFD ACID', d: ['Sintetizador acid', 'Acid synthesizer'], scale: [0, 1, 3, 5, 7, 8, 10], voice: 'pluck', bpm: 122, pad: .3, rev: .22, dly: .38, root: 4, drums: 'four', acid: true },
];
const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const PERIODS = [4, 3, 6, 8, 5];           // planet orbit periods in beats
const PLANET_OCT = [-1, 0, 1, 1, 2];
const P = { drift: store.get('drift', .35), tone: store.get('tone', .55), speed: store.get('speed', .5), volume: store.get('vol', .3) };
let station = STATIONS.find(s => s.id === store.get('station', 'orbita')) || STATIONS[0];
let keyOff = store.get('key', -1);         // -1 = station default
const planets = PERIODS.map((p, i) => ({ period: p, phase: (i * .37) % 1, pat: [0, 2, 4, 1, 3, 5].map(x => (x + i * 2) % 7), n: 0, pan: [-.6, .5, -.2, .7, 0][i] }));
const ripples = [];
let ctx = null, nodes = null, running = false, wantOn = false;
let nextStep = 0, stepCount = 0, chordDeg = 0, acidPrev = 0, levelSmooth = 0;
const perfNow = () => performance.now() / 1000;
const clock = () => (running && ctx) ? ctx.currentTime : perfNow();
const tempo = () => station.bpm * (0.55 + P.speed * 0.9 + (P.speed > .5 ? (P.speed - .5) * .5 : 0));
const stepDur = () => 60 / tempo() / 4;
const rootMidi = () => 48 + (keyOff >= 0 ? keyOff : station.root);
const degToMidi = (deg, oct = 0) => { const sc = station.scale, n = sc.length; const o = Math.floor(deg / n); return rootMidi() + sc[((deg % n) + n) % n] + 12 * (o + oct); };
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

function buildGraph() {
  const AC = window.AudioContext || window.webkitAudioContext;
  try { ctx = new AC({ latencyHint: 'playback' }); } catch { ctx = new AC(); }
  const g = (v = 1) => { const n = ctx.createGain(); n.gain.value = v; return n; };
  const master = g(0), comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16; comp.ratio.value = 3; comp.attack.value = .01; comp.release.value = .25;
  const analyser = ctx.createAnalyser(); analyser.fftSize = 1024;
  const lim = ctx.createDynamicsCompressor(); lim.threshold.value = -2; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = .002; lim.release.value = .1;
  const out = g(.85);
  master.connect(comp); comp.connect(lim); lim.connect(out); out.connect(analyser); analyser.connect(ctx.destination);
  const tone = ctx.createBiquadFilter(); tone.type = 'lowpass'; tone.Q.value = .5;
  const bus = g(1); bus.connect(tone); tone.connect(master);
  // reverb
  const rev = ctx.createConvolver(), len = ctx.sampleRate * 3.4, ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
  rev.buffer = ir; const revOut = g(.0); tone.connect(rev); rev.connect(revOut); revOut.connect(master);
  // Space Tape delay
  const dly = ctx.createDelay(2), fb = g(.42), dlp = ctx.createBiquadFilter(), dOut = g(.0);
  dlp.type = 'lowpass'; dlp.frequency.value = 2600;
  tone.connect(dly); dly.connect(dlp); dlp.connect(fb); fb.connect(dly); dlp.connect(dOut); dOut.connect(master); dOut.connect(rev);
  const wow = ctx.createOscillator(), wowG = g(.0025); wow.frequency.value = .35; wow.connect(wowG); wowG.connect(dly.delayTime); wow.start();
  // drums bypass tone filter
  const drums = g(.9); drums.connect(master); const drumRev = g(.12); drums.connect(drumRev); drumRev.connect(rev);
  // pad
  const padF = ctx.createBiquadFilter(); padF.type = 'lowpass'; padF.frequency.value = 900; padF.Q.value = 2;
  const padG = g(0); padF.connect(padG); padG.connect(bus);
  const padLfo = ctx.createOscillator(), padLfoG = g(300); padLfo.frequency.value = .07; padLfo.connect(padLfoG); padLfoG.connect(padF.frequency); padLfo.start();
  const pad = [0, 4, 8].map(() => { const oscs = [-1, 1].map(s => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.detune.value = s * 7; o.connect(padF); o.start(); return o; }); return oscs; });
  const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); { const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  window.__pslAnalyser = analyser; nodes = { master, tone, bus, rev, revOut, dly, dOut, fb, wowG, drums, padF, padG, pad, noise, analyser, buf: new Float32Array(analyser.fftSize) };
  applyParams(true);
}

function applyParams(instant) {
  if (!nodes) return;
  const t = ctx.currentTime, tc = instant ? .01 : .15;
  nodes.tone.frequency.setTargetAtTime(260 * Math.pow(2, P.tone * 5.2), t, tc);
  nodes.revOut.gain.setTargetAtTime(station.rev, t, .3);
  nodes.dOut.gain.setTargetAtTime(station.dly * (.6 + P.drift * .6), t, .3);
  nodes.dly.delayTime.setTargetAtTime(Math.min(1.9, stepDur() * 3), t, .8);
  nodes.wowG.gain.setTargetAtTime(.0008 + P.drift * .006, t, .3);
  nodes.padG.gain.setTargetAtTime(.022 * station.pad, t, .8);
  nodes.padF.frequency.setTargetAtTime(380 + P.tone * 1500, t, .5);
  if (running) nodes.master.gain.setTargetAtTime(P.volume * .9, t, .08);
  setPadChord(t);
}
function setPadChord(t) {
  if (!nodes) return;
  const degs = [chordDeg, chordDeg + 2, chordDeg + 4];
  nodes.pad.forEach((pair, i) => pair.forEach((o, k) => o.frequency.setTargetAtTime(mtof(degToMidi(degs[i], -1 + (i === 0 ? 0 : 0))), t, .9)));
}

let activeVoices = 0;
function track(node, end) { activeVoices++; node.onended = () => { activeVoices--; }; }
function voice(midi, t, vel, pan) {
  if (activeVoices > 16) return;
  const c = ctx, f = mtof(midi), out = c.createGain(), p = c.createStereoPanner(); p.pan.value = pan;
  out.connect(p); p.connect(nodes.bus); out.gain.value = 0;
  const type = station.voice, drift = P.drift;
  if (type === 'bell' || type === 'glass') {
    const car = c.createOscillator(), mod = c.createOscillator(), mg = c.createGain();
    car.frequency.value = f; mod.frequency.value = f * (type === 'bell' ? 3.5 : 2.0); car.detune.value = (Math.random() - .5) * 14 * drift;
    const dec = type === 'bell' ? 2.4 : 4.2;
    mg.gain.setValueAtTime(f * (type === 'bell' ? 2.2 : 1.1), t); mg.gain.exponentialRampToValueAtTime(f * .02, t + dec * .6);
    mod.connect(mg); mg.connect(car.frequency); car.connect(out);
    out.gain.setValueAtTime(0, t); out.gain.linearRampToValueAtTime(.16 * vel, t + (type === 'glass' ? .06 : .004)); out.gain.exponentialRampToValueAtTime(.0005, t + dec);
    car.start(t); mod.start(t); car.stop(t + dec + .1); mod.stop(t + dec + .1); track(car);
  } else {
    const o = c.createOscillator(), fl = c.createBiquadFilter(); o.type = 'triangle'; o.frequency.value = f;
    fl.type = 'lowpass'; fl.Q.value = 3; fl.frequency.setValueAtTime(400 + 4000 * P.tone, t); fl.frequency.exponentialRampToValueAtTime(260, t + .35);
    o.connect(fl); fl.connect(out); out.gain.setValueAtTime(0, t); out.gain.linearRampToValueAtTime(.2 * vel, t + .005); out.gain.exponentialRampToValueAtTime(.0005, t + .7);
    o.start(t); o.stop(t + .8); track(o);
  }
}
function acidNote(midi, t, accent, slide) {
  const c = ctx, o = c.createOscillator(), fl = c.createBiquadFilter(), a = c.createGain(), sd = stepDur();
  o.type = 'sawtooth'; fl.type = 'lowpass'; fl.Q.value = 11 + P.drift * 8;
  const f = mtof(midi);
  if (slide && acidPrev) { o.frequency.setValueAtTime(acidPrev, t); o.frequency.exponentialRampToValueAtTime(f, t + sd * .7); } else o.frequency.setValueAtTime(f, t);
  acidPrev = f;
  const base = 180 + P.tone * 700, peak = base + (900 + P.tone * 3800) * (accent ? 1.6 : 1);
  fl.frequency.setValueAtTime(peak, t); fl.frequency.exponentialRampToValueAtTime(base, t + sd * (accent ? 2.2 : 1.4));
  a.gain.setValueAtTime(0, t); a.gain.linearRampToValueAtTime(accent ? .2 : .13, t + .003); a.gain.setTargetAtTime(0, t + sd * (slide ? 1.05 : .7), .03);
  o.connect(fl); fl.connect(a); a.connect(nodes.bus); o.start(t); o.stop(t + sd * 2 + .2);
}
function kick(t, v = 1) {
  const o = ctx.createOscillator(), a = ctx.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(44, t + .11);
  a.gain.setValueAtTime(0, t); a.gain.linearRampToValueAtTime(.85 * v, t + .002); a.gain.exponentialRampToValueAtTime(.001, t + .42); o.connect(a); a.connect(nodes.drums); o.start(t); o.stop(t + .45);
}
function noiseHit(t, hp, bp, dec, v) {
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), a = ctx.createGain();
  s.buffer = nodes.noise; f.type = bp ? 'bandpass' : 'highpass'; f.frequency.value = bp || hp; if (bp) f.Q.value = .9;
  a.gain.setValueAtTime(0, t); a.gain.linearRampToValueAtTime(v, t + .001); a.gain.exponentialRampToValueAtTime(.001, t + dec);
  s.connect(f); f.connect(a); a.connect(nodes.drums); s.start(t, Math.random() * .5); s.stop(t + dec + .02);
}
const BREAKS = { k: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], s: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1], h: [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0] };
const FOUR = { k: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], s: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], h: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1] };
let acidSeq = null;
function newAcid() { acidSeq = Array.from({ length: 16 }, (_, i) => ({ on: Math.random() < .72 || i % 4 === 0, deg: [0, 0, 0, 2, 3, 4, 7, -1, 5][Math.floor(Math.random() * 9)], oct: Math.random() < .25 ? 1 : 0, acc: Math.random() < .3, sl: Math.random() < .22 })); }
newAcid();

function step(t, audible) {
  const s16 = stepCount % 16, sd = stepDur();
  // planets
  planets.forEach((pl, i) => {
    pl.phase += .25 / pl.period;
    if (pl.phase >= 1) {
      pl.phase -= 1;
      if (station.acid && i === 0) return; // acid line takes the bass
      let deg = pl.pat[pl.n % pl.pat.length] + chordDeg; pl.n++;
      if (Math.random() < P.drift * .35) pl.pat[Math.floor(Math.random() * pl.pat.length)] = Math.floor(Math.random() * 8);
      ripples.push({ i, t, life: 1.6 + station.rev * 2 });
      if (audible && Math.random() > (station.drums ? .35 : .05)) voice(degToMidi(deg, PLANET_OCT[i] + (station.drums ? 0 : 0)), t, .55 + Math.random() * .45, pl.pan);
    }
  });
  if (audible) {
    const pat = station.drums === 'breaks' ? BREAKS : station.drums === 'four' ? FOUR : null;
    if (pat) {
      const sw = (s16 % 2) ? sd * .12 * P.drift : 0;
      if (pat.k[s16] || (station.drums === 'breaks' && s16 === 7 && Math.random() < P.drift)) kick(t + sw, pat.k[s16] ? 1 : .6);
      if (pat.s[s16]) { noiseHit(t + sw, 0, 1800, .19, .38); }
      if (pat.h[s16] && Math.random() > .12) noiseHit(t + sw, 7500, 0, s16 === 15 ? .16 : .045, .12 + Math.random() * .06);
    }
    if (station.acid) { const a = acidSeq[s16]; if (a.on) acidNote(degToMidi(a.deg + chordDeg, -1 + a.oct), t, a.acc, a.sl); }
  }
  if (s16 === 15 && station.acid && Math.random() < P.drift * .5) { const k = Math.floor(Math.random() * 16); acidSeq[k].deg = Math.floor(Math.random() * 8) - 1; acidSeq[k].acc = Math.random() < .35; }
  if (stepCount % 64 === 63) { chordDeg = [0, 5, 3, 4, 0, 2, 5, 4][(stepCount >> 6) % 8] % 7; if (station.acid) chordDeg = [0, 0, 5, 3][(stepCount >> 6) % 4]; if (audible) setPadChord(t + sd); }
  stepCount++;
}
function scheduler() {
  const now = clock(), ahead = now + (running ? (document.hidden ? 1.2 : .2) : .02);
  if (nextStep < now - .5) nextStep = now;
  while (nextStep < ahead) { step(nextStep, running); nextStep += stepDur(); }
}
setInterval(scheduler, 25);

async function startAudio() {
  wantOn = true; store.set('audio', 'on');
  if (!ctx) buildGraph();
  if (ctx.state !== 'running') { try { await Promise.race([ctx.resume(), new Promise(r => setTimeout(r, 300))]); } catch {} }
  if (ctx.state !== 'running') { updateButtons(); return; }
  running = true; ripples.length = 0; nextStep = ctx.currentTime + .06;
  nodes.master.gain.cancelScheduledValues(ctx.currentTime);
  nodes.master.gain.setValueAtTime(nodes.master.gain.value, ctx.currentTime);
  nodes.master.gain.linearRampToValueAtTime(P.volume * .9, ctx.currentTime + 1.6);
  applyParams(); updateButtons();
}
function stopAudio(remember = true) {
  wantOn = false; if (remember) store.set('audio', 'off');
  if (ctx && running) {
    const t = ctx.currentTime; nodes.master.gain.cancelScheduledValues(t); nodes.master.gain.setValueAtTime(nodes.master.gain.value, t); nodes.master.gain.linearRampToValueAtTime(0, t + .25);
    setTimeout(() => { if (!wantOn && ctx) ctx.suspend(); }, 320);
  }
  running = false; ripples.length = 0; nextStep = perfNow(); updateButtons();
}
function updateButtons() {
  $('#player').classList.toggle('live', running);
  $('#player').classList.toggle('waiting', !running && wantOn);
}
['#start', '#start2'].forEach(s => $(s).addEventListener('click', startAudio));
['#stop', '#stop2'].forEach(s => $(s).addEventListener('click', () => stopAudio()));
// start with the first interaction anywhere (browsers forbid sound before it), unless the visitor turned it off
const firstGesture = e => {
  ['pointerdown', 'keydown'].forEach(n => document.removeEventListener(n, firstGesture, true));
  if (store.get('audio', 'on') === 'off' || running) return;
  if (e.target.closest && e.target.closest('#stop,#stop2,.vid')) return;
  startAudio();
};
['pointerdown', 'keydown'].forEach(n => document.addEventListener(n, firstGesture, true));
// try to start right away (allowed when the browser trusts the site); otherwise it waits for the first touch
if (store.get('audio', 'on') !== 'off') { wantOn = true; startAudio().catch(() => {}); setTimeout(() => { if (ctx && ctx.state !== 'running') { running = false; updateButtons(); } }, 400); }
document.addEventListener('keydown', e => { if (e.key === 'Escape' && running) stopAudio(); });

function setStation(s) {
  station = s; store.set('station', s.id); acidPrev = 0; newAcid();
  planets.forEach((pl, i) => pl.pat = [0, 2, 4, 1, 3, 5].map(x => (x + i * 2) % 7));
  applyParams(); renderStations(); renderKeys();
}
function renderStations() {
  const box = $('#station'); box.innerHTML = '';
  STATIONS.forEach(s => { const b = document.createElement('button'); b.className = s === station ? 'on' : ''; b.innerHTML = `<b>${s.n}</b><span>${L(s.d)}</span>`;
    b.setAttribute('aria-pressed', s === station); b.onclick = () => { setStation(s); if (!running) startAudio(); }; box.appendChild(b); });
}
function renderKeys() {
  const sel = $('#key'); sel.innerHTML = '';
  KEYS.forEach((k, i) => { const o = document.createElement('option'); o.value = i; o.textContent = k + (i === station.root ? ' ★' : ''); sel.appendChild(o); });
  sel.value = keyOff >= 0 ? keyOff : station.root;
}
$('#key').addEventListener('change', e => { keyOff = +e.target.value; store.set('key', keyOff); setPadChord(ctx ? ctx.currentTime : 0); });

/* ───────────── knobs ───────────── */
const KDEF = [['drift', 'DRIFT', 'DERIVA', .35], ['tone', 'TONE', 'TONO', .55], ['speed', 'SPEED', 'VELOC.', .5], ['volume', 'VOLUME', 'VOLUMEN', .3]];
const knobs = KDEF.map(([key, en, es, def]) => {
  const w = document.createElement('div'); w.className = 'knob'; w.tabIndex = 0; w.setAttribute('role', 'slider'); w.setAttribute('aria-valuemin', 0); w.setAttribute('aria-valuemax', 100);
  w.innerHTML = `<label></label><svg viewBox="0 0 64 64"><circle class="rim" cx="32" cy="32" r="28" fill="none" stroke="${PAPER}" stroke-width="2.5"/><path class="arc" fill="none" stroke="${RED}" stroke-width="3"/><line x1="32" y1="32" x2="32" y2="10" stroke="${PAPER}" stroke-width="4" stroke-linecap="square"/></svg><span class="val"></span>`;
  $('#knobs').appendChild(w);
  const line = $('line', w), arc = $('.arc', w), val = $('.val', w);
  const k = {
    draw() { const v = P[key], a = -135 + v * 270, r = a * Math.PI / 180; line.setAttribute('x2', 32 + Math.sin(r) * 22); line.setAttribute('y2', 32 - Math.cos(r) * 22);
      const a0 = -135 * Math.PI / 180, large = v * 270 > 180 ? 1 : 0;
      arc.setAttribute('d', v < .01 ? '' : `M${32 + Math.sin(a0) * 28} ${32 - Math.cos(a0) * 28} A28 28 0 ${large} 1 ${32 + Math.sin(r) * 28} ${32 - Math.cos(r) * 28}`);
      val.textContent = String(Math.round(v * 100)).padStart(3, '0'); w.setAttribute('aria-valuenow', Math.round(v * 100)); },
    label() { $('label', w).textContent = lang === 'es' ? es : en; w.setAttribute('aria-label', lang === 'es' ? es : en); },
    set(v) { P[key] = Math.min(1, Math.max(0, v)); store.set(key === 'volume' ? 'vol' : key, P[key]); k.draw(); applyParams(); },
  };
  let y0 = 0, v0 = 0;
  w.addEventListener('pointerdown', e => { w.setPointerCapture(e.pointerId); y0 = e.clientY; v0 = P[key]; e.preventDefault(); w.focus(); });
  w.addEventListener('pointermove', e => { if (w.hasPointerCapture(e.pointerId)) k.set(v0 + (y0 - e.clientY) / 180); });
  w.addEventListener('wheel', e => { e.preventDefault(); k.set(P[key] - Math.sign(e.deltaY) * .03); }, { passive: false });
  w.addEventListener('keydown', e => { const d = { ArrowUp: .05, ArrowRight: .05, ArrowDown: -.05, ArrowLeft: -.05 }[e.key]; if (d) { e.preventDefault(); k.set(P[key] + d); } });
  w.addEventListener('dblclick', () => k.set(def));
  k.draw(); k.label(); return k;
});

/* ───────────── visuals ───────────── */
const DPR = Math.min(1.5, window.devicePixelRatio || 1);
function fit(cv, scale = DPR) { const r = cv.getBoundingClientRect(); const w = Math.max(1, Math.round(r.width * scale)), h = Math.max(1, Math.round(r.height * scale)); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; } return [w, h]; }
const visible = new Map();
const io = new IntersectionObserver(es => es.forEach(e => visible.set(e.target, e.isIntersecting)), { rootMargin: '80px' });
['#orbit', '#wave', '#groove', '#stars'].forEach(s => io.observe($(s)));
const isVis = s => visible.get($(s)) !== false;

function level() {
  if (!running || !nodes) { levelSmooth *= .92; return levelSmooth; }
  nodes.analyser.getFloatTimeDomainData(nodes.buf); let s = 0; for (let i = 0; i < nodes.buf.length; i += 4) s += nodes.buf[i] * nodes.buf[i];
  const rms = Math.sqrt(s / (nodes.buf.length / 4)); levelSmooth += (Math.min(1, rms * 4) - levelSmooth) * .2; return levelSmooth;
}
function visPhase(pl) { // phase as heard now (scheduler runs slightly ahead)
  const ahead = Math.max(0, (nextStep - clock()) / stepDur());
  return ((pl.phase - ahead * .25 / pl.period) % 1 + 1) % 1;
}

function drawOrbit(t) {
  const cv = $('#orbit'), [w, h] = fit(cv), g = cv.getContext('2d'); g.clearRect(0, 0, w, h);
  const cx = w * .52, cy = h * .46, R = Math.min(w * .48, h * .9), tilt = -.2, now = clock();
  g.lineWidth = 1.4 * DPR; g.strokeStyle = INK;
  const radii = [.36, .52, .68, .84, 1.0];
  const pos = (i, ph) => { const rx = R * radii[i], ry = rx * .38, a = -Math.PI / 2 + ph * Math.PI * 2; const x = Math.cos(a) * rx, y = Math.sin(a) * ry; return [cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)]; };
  radii.forEach((r, i) => { g.globalAlpha = i % 2 ? .55 : 1; g.beginPath(); g.ellipse(cx, cy, R * r, R * r * .38, tilt, 0, Math.PI * 2); g.stroke(); });
  g.globalAlpha = 1;
  g.beginPath(); g.moveTo(cx - R * .62, cy + R * .62 * Math.tan(tilt) * .2); g.lineTo(cx + R * 1.05, cy); g.moveTo(cx, cy - R * .5); g.lineTo(cx, cy + R * .52); g.stroke();
  g.beginPath(); g.arc(cx, cy, R * .09, 0, Math.PI * 2); g.stroke();
  // zenith ticks
  radii.forEach((_, i) => { const [x, y] = pos(i, 0); g.beginPath(); g.moveTo(x, y - 6 * DPR); g.lineTo(x, y + 6 * DPR); g.stroke(); });
  // ripples
  for (let k = ripples.length - 1; k >= 0; k--) { const r = ripples[k], age = now - r.t; if (age > r.life || age < -1) { if (age > r.life) ripples.splice(k, 1); continue; } if (age < 0) continue;
    const [x, y] = pos(r.i, 0), f = age / r.life; g.strokeStyle = r.i === 0 ? RED : INK; g.globalAlpha = (1 - f) * .8; g.beginPath(); g.arc(x, y, (8 + f * 70) * DPR, 0, Math.PI * 2); g.stroke(); }
  g.globalAlpha = 1;
  planets.forEach((pl, i) => { const ph = visPhase(pl); // trail
    g.strokeStyle = i === 0 ? RED : INK; g.lineWidth = 2.5 * DPR; g.beginPath(); for (let s = 0; s <= 14; s++) { const [x, y] = pos(i, ph - s * .006); s ? g.lineTo(x, y) : g.moveTo(x, y); } g.globalAlpha = .5; g.stroke(); g.globalAlpha = 1;
    const [x, y] = pos(i, ph); g.fillStyle = i === 0 ? RED : INK; g.beginPath(); g.arc(x, y, (i === 0 ? 13 : i === 3 ? 7 : 4.5) * DPR, 0, Math.PI * 2); g.fill(); });
  g.lineWidth = 1.4 * DPR;
}

function drawWave(cv, t, lv, n, color, compact) {
  const [w, h] = fit(cv), g = cv.getContext('2d'); g.clearRect(0, 0, w, h);
  const data = running && nodes ? nodes.buf : null; const mid = h / 2;
  g.strokeStyle = color; g.lineWidth = (compact ? .8 : 1) * DPR;
  for (let k = 0; k < n; k++) {
    g.globalAlpha = .35 + .65 * (1 - k / n); g.beginPath();
    for (let x = 0; x <= w; x += 3 * DPR) {
      const u = x / w, env = Math.pow(Math.sin(Math.PI * u), 1.6);
      let v;
      if (data) { const idx = Math.floor((u * .5 + k * .012) * data.length) % data.length; v = data[idx] * 7 + Math.sin(u * 14 + t * 1.3 + k * .3) * .12; }
      else v = Math.sin(u * 12.5 + t * .9 + k * .22) * .38 * Math.sin(u * 3.2 - t * .4) + Math.sin(u * 30 + t * 2 + k) * .03;
      const y = mid + v * env * h * .42 * (1 - k / n * .55) + (k - n / 2) * h * .006;
      x ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
  }
  g.globalAlpha = 1;
  if (!compact) { g.strokeStyle = PAPER; g.lineWidth = 1.5 * DPR; const px = w * .06; g.beginPath(); g.moveTo(px - 10 * DPR, mid); g.lineTo(px + 10 * DPR, mid); g.moveTo(px, mid - 10 * DPR); g.lineTo(px, mid + 10 * DPR); g.stroke(); }
}

// groove / fingerprint / digital — rendered at low resolution and scaled up pixelated
const gLow = document.createElement('canvas');
function drawGroove(t, lv) {
  const cv = $('#groove'), [w, h] = fit(cv, 1), s = Math.max(120, Math.round(Math.min(w, h) / 3.2));
  gLow.width = Math.round(s * w / Math.min(w, h)); gLow.height = Math.round(s * h / Math.min(w, h));
  const g = gLow.getContext('2d'), W = gLow.width, H = gLow.height, cx = W / 2, cy = H / 2, now = clock();
  g.fillStyle = INK; g.fillRect(0, 0, W, H);
  const rot = t * .35, Rm = Math.min(W, H) * .47;
  let hit = 0; ripples.forEach(r => { const a = now - r.t; if (a >= 0 && a < .4) hit = Math.max(hit, 1 - a / .4); });
  g.lineWidth = 1;
  for (let r = Rm * .2, k = 0; r < Rm; r += 2.6, k++) {
    g.strokeStyle = (k % 9 === 4 && hit > .2) ? RED : PAPER; g.globalAlpha = .55 + .45 * (k % 2);
    g.beginPath();
    for (let a = 0; a <= Math.PI * 2 + .01; a += .05) {
      const wob = Math.sin(a * 5 + rot * 2 + r * .09) * (1.2 + lv * 7) + Math.sin(a * 11 - t + k * .4) * (.5 + P.drift * 2.4) + Math.sin(a * 2 + r * .05 + t * .2) * 2.2;
      const rr = r + wob, x = cx + Math.cos(a + rot) * rr, y = cy + Math.sin(a + rot) * rr * .98;
      a ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
  }
  g.globalAlpha = 1; g.fillStyle = RED; g.beginPath(); g.arc(cx, cy, Rm * .18, 0, Math.PI * 2); g.fill();
  g.fillStyle = PAPER; g.font = `900 ${Math.round(Rm * .12)}px Archivo`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PSL', cx, cy);
  if (hit > .3 || Math.random() < .01) { // digital slip
    const y0 = Math.floor(Math.random() * H * .8), hh = 2 + Math.floor(Math.random() * 8), dx = Math.round((Math.random() - .5) * 18 * (hit + .3));
    g.drawImage(gLow, 0, y0, W, hh, dx, y0, W, hh);
  }
  const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; c.drawImage(gLow, 0, 0, w, h);
}
const starField = Array.from({ length: 220 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() < .08 ? 2 : 1, p: Math.random() * 6 }));
function drawStars(t) {
  const cv = $('#stars'), [w, h] = fit(cv), g = cv.getContext('2d'); g.clearRect(0, 0, w, h);
  starField.forEach(s => { g.globalAlpha = .25 + .75 * Math.abs(Math.sin(t * .6 + s.p)); g.fillStyle = s.r > 1 ? RED : PAPER;
    const x = s.x * w, y = s.y * h; if (s.r > 1) { g.fillRect(x - 4 * DPR, y - .5 * DPR, 8 * DPR, DPR); g.fillRect(x - .5 * DPR, y - 4 * DPR, DPR, 8 * DPR); } else g.fillRect(x, y, DPR, DPR); });
  g.globalAlpha = 1;
}

const turb2 = $('#turb2'), disp2 = $('#disp2'), logoG = $('#logoG'), turb = $('#turb');
let tPrev = 0, frameN = 0, logoHover = false;
$('#logo').addEventListener('pointerenter', () => logoHover = true); $('#logo').addEventListener('pointerleave', () => logoHover = false);
function frame(ms) {
  frameN++;
  const t = ms / 1000, lv = level();
  if (!reduced || running) {
    if (isVis('#orbit')) drawOrbit(t);
    if (isVis('#wave')) drawWave($('#wave'), t, lv, 18, PAPER, false);
    if (isVis('#groove') && (frameN % 2 === 0)) drawGroove(t, lv);
    if (isVis('#stars') && ms - tPrev > 60) { drawStars(t); tPrev = ms; }
    // logo breathes with the sound
    const sc = running ? 1 + lv * 14 : 0;
    if (frameN % 4 !== 0 || !isVis('#orbit')) {} else if (sc < .3) logoG.removeAttribute('filter'); else { logoG.setAttribute('filter', 'url(#breath)'); disp2.setAttribute('scale', sc.toFixed(2)); turb2.setAttribute('baseFrequency', (0.006 + Math.sin(t * .3) * .002).toFixed(4)); }
    if (logoHover && frameN % 3 === 0) turb.setAttribute('seed', Math.floor(t * 12) % 50);
    $$('#lv i').forEach((b, i) => b.classList.toggle('on', lv * 7 > 5 - i));
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
if (reduced) { drawOrbit(0); drawWave($('#wave'), 0, 0, 18, PAPER, false); drawGroove(0, 0); drawStars(0); }


/* generative tiles (Instagram grid, video placeholders) */
function tile(cv, seed, dark) {
  const s = 240; cv.width = s; cv.height = s; const g = cv.getContext('2d'); let r = seed * 9301 + 49297; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  g.fillStyle = dark ? INK : PAPER; g.fillRect(0, 0, s, s); const fg = dark ? PAPER : INK; g.strokeStyle = fg; g.lineWidth = 1.6;
  const kind = seed % 4, cx = s * (.3 + rnd() * .4), cy = s * (.3 + rnd() * .4);
  if (kind === 0) for (let k = 6; k < 140; k += 6) { g.beginPath(); for (let a = 0; a <= 6.3; a += .08) { const rr = k + Math.sin(a * 4 + k * .2) * 3; a ? g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : g.moveTo(cx + rr, cy); } g.stroke(); }
  if (kind === 1) for (let y = 10; y < s; y += 7) { g.beginPath(); for (let x = 0; x <= s; x += 4) { const v = Math.sin(x * .05 + y * .03) * 6 * Math.sin(y * .02 + seed); x ? g.lineTo(x, y + v) : g.moveTo(x, y + v); } g.stroke(); }
  if (kind === 2) { for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(s / 2, s / 2, 30 + k * 22, (30 + k * 22) * .4, -.3, 0, 6.3); g.stroke(); } g.fillStyle = RED; g.beginPath(); g.arc(s * .25, s * .4, 12, 0, 6.3); g.fill(); }
  if (kind === 3) { g.fillStyle = fg; for (let i = 0; i < 26; i++) { const w = 2 + rnd() * 9; g.fillRect(20 + i * 7.6, 40, w * .6, s - 80); } g.fillStyle = RED; g.fillRect(0, s - 34, s * .6, 14); }
  if (seed % 3 === 0) { g.fillStyle = RED; g.fillRect(s - 46, 14, 32, 32); }
}
for (let i = 0; i < 6; i++) { const c = document.createElement('canvas'); $('#igGrid').appendChild(c); tile(c, i * 7 + 3, i % 2 === 0); }

function renderVids() {
  const box = $('#vids'); box.innerHTML = '';
  const list = VIDEOS.length ? VIDEOS.slice(0, 3) : [
    { es: 'Sesiones en el estudio', en: 'Studio sessions' }, { es: 'Vinilo: lavado y aplanado', en: 'Vinyl: wash & flatten' }, { es: 'Software PSL en acción', en: 'PSL software in action' }];
  list.forEach((v, i) => {
    const d = document.createElement('div'); d.className = 'vid';
    if (v.id) {
      d.innerHTML = `<button class="frame" aria-label="Play ${v[lang] || ''}"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg"><span class="play"></span></button><div class="cap">${v[lang] || v.es}<small>YouTube // PSL</small></div>`;
      $('.frame', d).onclick = () => { if (running) stopAudio(false); $('.frame', d).outerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0" title="${v[lang] || ''}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`; };
    } else {
      d.innerHTML = `<a class="frame" href="https://www.youtube.com/PolarisSoundLab" target="_blank" rel="noopener" aria-label="YouTube"><canvas></canvas><span class="play"></span></a><div class="cap">${v[lang]}<small>${lang === 'es' ? 'Ver en el canal' : 'Watch on the channel'} // ${String(i + 1).padStart(2, '0')}</small></div>`;
      const c = $('canvas', d); tile(c, i * 5 + 1, true); c.width = 480; c.height = 270; tile2(c, i);
    }
    box.appendChild(d);
  });
}
function tile2(c, i) { const g = c.getContext('2d'), w = c.width, h = c.height; g.fillStyle = INK; g.fillRect(0, 0, w, h); g.strokeStyle = PAPER; g.lineWidth = 1.2;
  for (let k = 0; k < 16; k++) { g.globalAlpha = .3 + k / 24; g.beginPath(); for (let x = 0; x <= w; x += 4) { const u = x / w, y = h / 2 + Math.sin(u * (9 + i * 3) + k * .25) * Math.pow(Math.sin(Math.PI * u), 1.5) * h * .3 * (1 - k / 30) + (k - 8) * 1.4; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
  g.globalAlpha = 1; g.fillStyle = RED; g.font = '700 14px Mono, monospace'; g.fillText('PSL/' + String(i + 1).padStart(3, '0'), 16, 26); }

/* ───────────── page behaviour ───────────── */
const navLinks = $$('nav a');
const secIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
$$('main > section').forEach(s => secIO.observe(s));
const rvIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rvIO.unobserve(e.target); } }), { threshold: .12 });
$$('.rv').forEach(el => rvIO.observe(el));
$$('a.ask').forEach(a => a.addEventListener('click', () => { $('#svcSel').value = a.dataset.svc; setTimeout(() => $('#form [name=name]').focus({ preventScroll: true }), 600); }));
$('#yr').textContent = new Date().getFullYear();

function composed() {
  const f = $('#form'), name = f.name.value.trim(), msg = f.msg.value.trim(), svc = f.svc.options[f.svc.selectedIndex].textContent;
  return { name, msg, svc, ok: name && msg, text: `${lang === 'es' ? 'Hola, soy' : 'Hi, I’m'} ${name}.\n${lang === 'es' ? 'Servicio' : 'Service'}: ${svc}\n\n${msg}` };
}
function warn(txt) { const n = $('#formNote'); n.textContent = txt; n.style.color = RED; }
$('#form').addEventListener('submit', e => { e.preventDefault(); const c = composed();
  if (!c.ok) return warn(lang === 'es' ? 'Escribe tu nombre y tu mensaje.' : 'Please write your name and message.');
  location.href = `mailto:PolarisSoundLab@gmail.com?subject=${encodeURIComponent('[PSL] ' + c.svc + ' — ' + c.name)}&body=${encodeURIComponent(c.text)}`; });
$('#igSend').addEventListener('click', async () => { const c = composed();
  if (!c.ok) return warn(lang === 'es' ? 'Escribe tu nombre y tu mensaje.' : 'Please write your name and message.');
  try { await navigator.clipboard.writeText(c.text); } catch {}
  const n = $('#formNote'); n.style.color = ''; n.textContent = lang === 'es' ? 'Mensaje copiado: pégalo en el chat de Instagram.' : 'Message copied: paste it in the Instagram chat.';
  window.open('https://ig.me/m/polaris.sound.lab', '_blank', 'noopener'); });

renderKeys();
applyLang();
nextStep = perfNow();
})();
