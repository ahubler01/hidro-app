/* The phone app. You pay as you always do: nothing to tick, nothing to type. */
(function () {
  const H = window.HIDRO, D = window.DATA, $ = (q, el = document) => el.querySelector(q), $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const params = new URLSearchParams(location.search);
  if (params.has('embed')) document.body.classList.add('embed');

  /* ---------- state ---------- */
  const S = { name: 'Hidro', pts: 1395, shine: 64, head: 'crown', glasses: 'none', extra: 'none', hide: {}, tab: 'atoms', eur: 38.40, kg: 61.2, basket: ['charge', 'cup', 'coffee'] };
  const level = () => D.LEVELS.reduce((l, L, i) => (S.pts >= L.min ? i + 1 : l), 1);
  const me = (o = {}) => ({ shine: S.shine, level: level(), atoms: H.atomsFor(level()).filter(k => !S.hide[k]), head: S.head === 'crown' && level() < 5 ? '' : S.head, glasses: S.glasses, extra: S.extra, ...o });
  const num = n => Math.round(n).toLocaleString('en-GB');
  const eur = (n, d = 2) => '€' + n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
  const kgTxt = n => (n === 0 ? '0' : n < 1 ? n.toFixed(2) : n.toFixed(1));
  const moves = () => S.basket.map(k => D.MOVES.find(m => m.k === k));

  /* ---------- home ---------- */
  function renderMe() {
    const lv = level();
    $('#homeHidro').innerHTML = H.svg(me());
    $('#custHidro').innerHTML = H.svg(me());
    $('#qrPeek').innerHTML = H.svg(me({ mood: 'happy', stars: false }));
    $$('.js-name').forEach(e => { e.textContent = S.name; });
    $$('.js-pts').forEach(e => { e.textContent = num(S.pts); });
    $('.js-lvl').textContent = `Level ${lv} · ${D.LEVELS[lv - 1].n}`;
    $('.js-shine').style.left = Math.min(96, Math.max(4, S.shine)) + '%';
    const st = H.stageOf(S.shine);
    $('.js-shinetxt').textContent = st === 'green' ? 'Green' : st === 'blue' ? 'Blue · one green move to go' : 'Grey · wake me up';
    $('.js-eur').textContent = eur(S.eur);
    $('.js-kg').innerHTML = `${S.kg.toFixed(1)} <small>kg</small>`;
  }

  /* ---------- earn: total, rows and the 3-second spin, timed to the sound ---------- */
  let earnTimers = [];
  const later = (ms, f) => earnTimers.push(setTimeout(f, ms));
  function count(el, from, to, ms, f) {
    const t0 = performance.now();
    const step = () => { const u = Math.min(1, (performance.now() - t0) / ms), e = 1 - Math.pow(1 - u, 2.2); el.innerHTML = f(from + (to - from) * e); if (u < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function earn(list = moves(), { sound = true } = {}) {
    earnTimers.forEach(clearTimeout); earnTimers = [];
    const g = D.sum(list), before = { eur: S.eur, kg: S.kg, pts: S.pts, shine: S.shine, level: level() };
    $('#earnRows').innerHTML = list.map(m => `<div class="erow"><i>${D.icon(m.icon)}</i><b>${m.n}</b><span class="v">${m.green ? `<span class="x2">×2</span>` : ''}+${D.pts(m)}</span></div>`).join('');
    $('#earnTot').textContent = '+0'; $('#earnDuo').classList.remove('in'); $('#earnLock').classList.remove('in'); $('#rays').classList.remove('on');
    const body = me({ stars: true });                       // same body while he spins
    $('#earnHidro').innerHTML = H.svg({ ...body, shine: before.shine, mood: 'effort' });
    show('earn');
    if (sound) H.sound();
    const root = $('#earnHidro');
    S.pts += g.pts; S.shine = Math.min(100, S.shine + g.shine); S.eur += g.eur; S.kg += g.kg;
    H.spin(root, { dur: 3, turns: 3, after: 'joy', cfg: body, from: before.shine, to: S.shine });
    list.forEach((m, i) => later(260 + i * 430, () => $$('.erow')[i].classList.add('in')));
    later(260, () => count($('#earnTot'), 0, g.pts, 2000, v => '+' + Math.round(v)));
    later(650, () => $('#rays').classList.add('on'));
    later(2500, () => {
      burst();
      $('#earnDuo').classList.add('in'); $('#earnLock').classList.add('in');
      $('#earnEur').textContent = eur(g.eur); $('#earnKg').innerHTML = `${kgTxt(g.kg)} <small>kg</small>`;
    });
    later(3080, () => {
      if (level() > before.level) {                         // level up: new atoms pop out
        root.innerHTML = H.svg(me({ mood: 'joy' }));
        const fresh = H.atomsFor(level()).filter(k => !H.atomsFor(before.level).includes(k));
        fresh.forEach(k => { const e = $(`.h-atom[data-a="${k}"]`, root); if (e) { e.style.transformOrigin = '180px 170px'; e.animate([{ transform: 'scale(0)' }, { transform: 'scale(1.12)', offset: .7 }, { transform: 'scale(1)' }], { duration: 520, easing: 'ease-out' }); } });
        const acc = $('.h-acc', root); if (acc) { acc.style.transformOrigin = '180px 100px'; acc.animate([{ transform: 'translateY(-60px) scale(.3)', opacity: 0 }, { transform: 'translateY(6px) scale(1.06)', opacity: 1, offset: .75 }, { transform: 'none', opacity: 1 }], { duration: 560, easing: 'ease-out' }); }
      } else { H.setMood(root, 'happy'); H.wave(root); }
    });
    renderMe();
    return { ...g, before };
  }
  function burst() { const w = $('#earn .wrap'); window.PLAZA.burst(w, 195, 230, 190, 24); }

  /* ---------- scan and pay ---------- */
  function scan() {
    const l = $('#scanline'); l.animate([{ top: '22px', opacity: 0 }, { top: '40px', opacity: 1, offset: .12 }, { top: '268px', opacity: 1, offset: .88 }, { top: '286px', opacity: 0 }], { duration: 900, easing: 'ease-in-out' });
    return new Promise(r => setTimeout(() => { const o = $('#okmark'); o.animate([{ opacity: 0, transform: 'scale(.9)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 220, fill: 'forwards', easing: 'ease-out' }); r(); }, 820));
  }
  function payOpen() { $('#paySheet').classList.remove('done'); $('#paySt').textContent = 'Hold near reader'; $('#veil').classList.add('show'); $('#paySheet').classList.add('show'); }
  function payDone() { $('#paySheet').classList.add('done'); $('#paySt').textContent = 'Done'; }
  function payClose() { $('#veil').classList.remove('show'); $('#paySheet').classList.remove('show'); $('#okmark').getAnimations().forEach(a => a.cancel()); }
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function demo() {
    payClose(); show('qr'); await wait(700); await scan(); await wait(500); payOpen(); await wait(1300); payDone(); await wait(1000); payClose(); await wait(250); earn();
  }

  /* ---------- plaza, cup ---------- */
  let plaza;
  function openPlaza(enter) {
    if (!plaza) plaza = window.PLAZA.build($('#pscene'), 'phone');
    if (enter) plaza.enter(me({ stars: false })); else plaza.place(me({ stars: false }));
  }
  $('#cupRows').innerHTML = D.CUP.slice(0, 5).map((c, i) => `<div class="crow ${c.me ? 'me' : ''}"><span class="n">${i + 1}</span>${c.r}<span class="mb"><i style="width:${c.s * 2.4}%"></i></span><span class="p">${c.s}%</span></div>`).join('');
  $('#pNorm').textContent = window.PRIVACY.PUBLIC.stationGreenShare + '%';

  /* ---------- moves ---------- */
  $('#moveGrid').innerHTML = D.MOVES.filter(m => m.k !== 'vuelve').map(m => `<div class="mv"><i>${D.icon(m.icon)}</i><span class="${m.green ? 'x2' : 'x1'}">${m.green ? '×2' : '×1'}</span><b>${m.n}</b><p>${m.d}</p></div>`).join('');
  $('#vGrid').innerHTML = D.VUELVE.map(v => `<div><i>${D.icon(v.icon)}</i>${v.n}</div>`).join('');
  $('#howTable').innerHTML = D.MOVES.map(m => `<tr><td><b>${m.n}</b><br>${m.why}</td><td>${m.kg ? kgTxt(m.kg) + ' kg' : '0'}</td></tr>`).join('');

  /* ---------- customise ---------- */
  function renderOpts() {
    const lv = level(); let h = '';
    if (S.tab === 'atoms') {
      for (const [k, a] of Object.entries(H.ATOMS)) {
        const has = a.lv <= lv, on = has && !S.hide[k];
        h += `<button class="opt ${on ? 'on' : ''} ${has ? '' : 'locked'}" data-k="atoms" data-v="${k}" ${has ? '' : 'data-lock'}><span class="ico"><svg viewBox="0 0 64 64">${H.ball(32, 32, 27, a.f, a.s, 4.5)}<g transform="translate(32 33) scale(.5)">${H.ICONS[k]}</g></svg></span><div><b>${a.t}</b><span>${has ? a.d : 'Level ' + a.lv}</span></div></button>`;
      }
    } else {
      const map = { head: D.HEAD, glasses: D.GLASSES, extra: D.EXTRA }[S.tab];
      for (const [k, v] of Object.entries(map)) {
        const has = v.lv ? lv >= v.lv : v.got;
        h += `<button class="opt ${S[S.tab] === k ? 'on' : ''} ${has ? '' : 'locked'}" data-k="${S.tab}" data-v="${k}" ${has ? '' : 'data-lock'}>${H.svg({ ...me(), [S.tab]: k, atoms: [], ring: false, stars: false })}<div><b>${v.n}</b><span>${v.u}</span></div></button>`;
      }
    }
    $('#opts').innerHTML = h;
  }
  $('#opts').addEventListener('click', e => {
    const b = e.target.closest('.opt'); if (!b || b.hasAttribute('data-lock')) return;
    if (b.dataset.k === 'atoms') S.hide[b.dataset.v] = !S.hide[b.dataset.v]; else S[b.dataset.k] = b.dataset.v;
    renderOpts(); renderMe(); H.hop($('#custHidro'), { h: 24 });
  });
  $('#seg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.tab = b.dataset.t; $$('#seg button').forEach(x => x.classList.toggle('on', x === b)); renderOpts(); });

  /* ---------- launcher (phone home screen) ---------- */
  const mark = c => `<svg viewBox="0 0 121 95" fill="${c}">${window.PLAZA.MARK}</svg>`;
  const gl = d => `<svg viewBox="0 0 24 24" style="width:32px" fill="none" stroke="#24464F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".72">${d}</svg>`;
  const APPS = [['Maps', '#CDE8D6', '<path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 0 0-13 0c0 5 6.5 11 6.5 11z"/><circle cx="12" cy="10" r="2.4"/>'], ['Photos', '#F4DCE6', '<rect x="3.5" y="5" width="17" height="14" rx="3"/><path d="M4 16l5-5 4 4 2.5-2.5L20 17"/>'], ['Weather', '#CFE5F5', '<circle cx="9" cy="9" r="3.4"/><path d="M9 2.6v1.6M2.6 9h1.6M4.4 4.4l1.2 1.2M8.5 19h8.8a3.3 3.3 0 0 0 0-6.6 5 5 0 0 0-9.2 1.6A2.6 2.6 0 0 0 8.5 19z"/>'], ['Notes', '#F6EBC6', '<path d="M5 6h14M5 11h14M5 16h9"/>'], ['Camera', '#D9DEE1', '<rect x="3" y="7" width="18" height="12" rx="3"/><circle cx="12" cy="13" r="3.4"/><path d="M8.5 7l1.4-2.2h4.2L15.5 7"/>'], ['Calendar', '#FFFFFF', '<path d="M4 9h16"/><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8.5 3v4M15.5 3v4"/>'], ['Music', '#F7D2D6', '<path d="M9 18V6l10-2v12"/><circle cx="6.8" cy="18" r="2.3"/><circle cx="16.8" cy="16" r="2.3"/>'], ['gow', '', '']];
  $('#icons').innerHTML = APPS.map(([n, c, d]) => `<div class="ic" ${n === 'gow' ? 'id="gowIcon"' : ''}><i class="${n === 'gow' ? 'gowicon' : ''}" style="background:${c}">${n === 'gow' ? mark('#fff') : gl(d)}</i>${n === 'gow' ? 'Moeve gow' : n}</div>`).join('');
  $('#dock').innerHTML = [['#BFE6C8', '<path d="M6 4h3l1.6 4.4-2 1.5a11 11 0 0 0 5.4 5.4l1.5-2L20 15v3a2 2 0 0 1-2 2A14.5 14.5 0 0 1 4 6a2 2 0 0 1 2-2z"/>'], ['#CFE5F5', '<circle cx="12" cy="12" r="8.4"/><path d="M15.8 8.2l-2.4 5.2-5.2 2.4 2.4-5.2z"/>'], ['#E4E0F3', '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5z"/>'], ['#F1E3D3', '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4 7.5l8 6 8-6"/>']].map(([c, d]) => `<div class="ic"><i style="background:${c}">${gl(d)}</i></div>`).join('');
  $('#zoomcard').innerHTML = mark('#fff');
  async function launchApp(to = 'qr') {
    const p = $('#phone').getBoundingClientRect(), r = $('#gowIcon i').getBoundingClientRect(), z = $('#zoomcard');
    const x = r.left - p.left, y = r.top - p.top;
    z.style.cssText = `left:0;top:0;width:390px;height:844px;`;
    const a = z.animate([
      { transform: `translate(${x}px,${y}px) scale(${r.width / 390},${r.height / 844})`, borderRadius: '90px', opacity: 1 },
      { transform: 'translate(0,0) scale(1,1)', borderRadius: '0px', opacity: 1 }], { duration: 430, easing: 'cubic-bezier(.3,.9,.25,1)', fill: 'forwards' });
    await a.finished; show(to, true); await wait(380);
    await z.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' }).finished;
    a.cancel(); z.getAnimations().forEach(q => q.cancel());
  }

  /* ---------- navigation ---------- */
  function show(id, instant) {
    const el = $('#' + id);
    $$('.screen').forEach(s => { if (instant) s.style.transition = 'none'; s.classList.toggle('active', s === el); });
    if (instant) requestAnimationFrame(() => requestAnimationFrame(() => $$('.screen').forEach(s => { s.style.transition = ''; })));
    $('#tabs').classList.toggle('hidden', ['launcher', 'earn'].includes(id));
    $$('.tab').forEach(t => t.classList.toggle('on', t.dataset.go === id));
    const sc = $('.scroll', el); if (sc) sc.scrollTop = 0;
    if (id === 'plaza') openPlaza(false);
    if (id === 'mine') renderOpts();
  }
  function sheet(id) { $('#veil').classList.add('show'); $('#' + id + 'Sheet').classList.add('show'); }
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'), s = e.target.closest('[data-sheet]');
    if (g) show(g.dataset.go);
    if (s) sheet(s.dataset.sheet);
    if (e.target.closest('[data-close]') || e.target.id === 'veil') { $('#veil').classList.remove('show'); $$('.sheet').forEach(x => x.classList.remove('show')); }
  });
  $('#toPlaza').addEventListener('click', () => { show('plaza'); openPlaza(true); });
  $('#qr .card').addEventListener('click', demo);

  /* ---------- presenter panel ---------- */
  function pickers() { $('#pickers').innerHTML = D.MOVES.map(m => `<button class="pick ${S.basket.includes(m.k) ? 'on' : ''}" data-m="${m.k}"><i>${D.icon(m.icon)}</i>${m.n}</button>`).join(''); }
  $('#pickers').addEventListener('click', e => { const b = e.target.closest('.pick'); if (!b) return; const k = b.dataset.m; S.basket = S.basket.includes(k) ? S.basket.filter(x => x !== k) : [...S.basket, k]; pickers(); });
  $('#demoGo').addEventListener('click', () => { if (S.basket.length) demo(); });

  /* totals count up on the home screen (end of the film) */
  function totals(b) {
    show('home', true);
    const pts = $('.js-pts'); pts.textContent = num(b.pts); $('.js-eur').textContent = eur(b.eur); $('.js-kg').innerHTML = `${b.kg.toFixed(1)} <small>kg</small>`; $('.js-shine').style.transition = 'none'; $('.js-shine').style.left = b.shine + '%';
    setTimeout(() => { $('.js-shine').style.transition = ''; $('.js-shine').style.left = Math.min(96, S.shine) + '%'; }, 500);
    setTimeout(() => { count($('.js-eur'), b.eur, S.eur, 1500, v => eur(v)); count($('.js-kg'), b.kg, S.kg, 1500, v => `${v.toFixed(1)} <small>kg</small>`); count(pts, b.pts, S.pts, 1500, v => num(v)); }, 450);
  }

  $('#rays').innerHTML = Array.from({ length: 14 }, (_, i) => `<path d="M0 0 L${100 * Math.cos((i - .22) * Math.PI / 7)} ${100 * Math.sin((i - .22) * Math.PI / 7)} L${100 * Math.cos((i + .22) * Math.PI / 7)} ${100 * Math.sin((i + .22) * Math.PI / 7)}Z" fill="#0B5F72"/>`).join('');
  $('#rays').animate([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: 24000, iterations: Infinity });
  $$('[data-icon]').forEach(e => { e.innerHTML = D.icon(e.dataset.icon); });
  renderMe(); pickers(); renderOpts();
  const first = params.get('screen'); if (first) show(first, true);

  window.APP = { S, show, scan, payOpen, payDone, payClose, earn, totals, launchApp, openPlaza, renderMe, moves, me };
})();
