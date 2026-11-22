/* Hidro: the mascot renderer and its movements.
   Shared by the phone app, the station screen, the car widget and the demo film.
   Everything is drawn as SVG, so it stays sharp on a phone and on a 4 m screen. */
(function () {
  const P = '#004656';

  /* ---------- colour ---------- */
  const lerp = (a, b, t) => a + (b - a) * t;
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, t) => {
    const A = hex(a), B = hex(b);
    return '#' + A.map((v, i) => Math.round(lerp(v, B[i], t)).toString(16).padStart(2, '0')).join('');
  };
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  /* Grey -> blue -> green, like hydrogen itself (made from gas -> made from renewables). */
  const CORE = [[0, '#CBD5D9', '#A2B2B8'], [28, '#CBD5D9', '#A2B2B8'], [52, '#8FD6FF', '#45AEE8'], [76, '#38DCD6', '#00B3AE'], [100, '#38DCD6', '#00B3AE']];
  function core(shine) {
    for (let i = 1; i < CORE.length; i++) {
      if (shine <= CORE[i][0]) {
        const t = clamp((shine - CORE[i - 1][0]) / (CORE[i][0] - CORE[i - 1][0] || 1));
        return [mix(CORE[i - 1][1], CORE[i][1], t), mix(CORE[i - 1][2], CORE[i][2], t)];
      }
    }
    return [CORE[4][1], CORE[4][2]];
  }
  const stageOf = s => (s < 34 ? 'grey' : s < 67 ? 'blue' : 'green');

  /* ---------- atoms: each one is a real Moeve project ---------- */
  const ATOMS = {
    h2:   { n: 'H₂',   t: 'Green hydrogen', d: 'Andalusian Green Hydrogen Valley, 2 GW', f: '#F3BDFF', s: '#D78CF0', lv: 2, x: 90,   y: -108, r: 35 },
    volt: { n: 'Volt', t: 'Fast charging',  d: '420 ultra-fast charging points',         f: '#E0FF48', s: '#B9D600', lv: 3, x: -83,  y: -100, r: 30 },
    bio:  { n: 'Bio',  t: '2G biofuels',    d: 'Huelva plant, producing from 2027',      f: '#90FFBB', s: '#4FE08A', lv: 3, x: 136,  y: -34,  r: 35 },
    sol:  { n: 'Sol',  t: 'Solar power',    d: 'Renewable electricity',                  f: '#FFCFB5', s: '#FF9F6E', lv: 4, x: -129, y: -30,  r: 30 },
    aqua: { n: 'Aqua', t: 'Water for H₂',   d: 'Green hydrogen starts with water',       f: '#8FD6FF', s: '#45AEE8', lv: 5, x: 133,  y: 48,   r: 35 },
    jet:  { n: 'Jet',  t: 'SAF',            d: 'Sustainable jet fuel, 8 airlines',       f: '#FFB3D1', s: '#F27AA8', lv: 5, x: -126, y: 43,   r: 30 },
  };
  const ICONS = {
    h2:   `<g transform="translate(-1.6 -1.6) scale(.96)" fill="none" stroke="${P}" stroke-linecap="round" stroke-linejoin="round"><path d="M-17 -15V13 M2 -15V13 M-17 -1H2" stroke-width="7"/><path d="M11.5 9.2 A5 5 0 1 1 20 12.8 L11.5 21 H21.5" stroke-width="4.4"/></g>`,
    volt: `<path d="M5.2 -26 L-15.6 5.2 L-1.7 5.2 L-6.9 26 L15.6 -6.9 L1.7 -6.9Z" fill="${P}" stroke="${P}" stroke-width="3.5" stroke-linejoin="round"/>`,
    bio:  `<path d="M-19 19 Q-22 -19 21 -21 Q22 19 -19 19Z" fill="${P}"/><path d="M-15 15 L10 -10" stroke="#90FFBB" stroke-width="4.2" stroke-linecap="round"/>`,
    sol:  [0, 45, 90, 135, 180, 225, 270, 315].map(a => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<line x1="${17 * c}" y1="${17 * s}" x2="${26 * c}" y2="${26 * s}" stroke="${P}" stroke-width="5.2" stroke-linecap="round"/>`; }).join('') + `<circle r="11" fill="${P}"/>`,
    aqua: `<path d="M0 -24 Q19 0 14.6 10.3 A15 15 0 0 1 -14.6 10.3 Q-19 0 0 -24Z" fill="${P}"/>`,
    jet:  `<path d="M-22.5 1.7 L22.5 -17.3 L8.7 20.8 L0 6.9Z" fill="${P}" stroke="${P}" stroke-width="2.6" stroke-linejoin="round"/>`,
  };
  const atomsFor = lv => Object.keys(ATOMS).filter(k => ATOMS[k].lv <= lv);

  /* Shade = circle minus the same circle moved up-left, so it never leaves the outline. */
  function crescent(x, y, r, k = .17) {
    const d = k * r, u = d / 2, q = Math.sqrt(r * r - d * d / 2) / Math.SQRT2, n = v => +v.toFixed(2);
    const dx = u, hx = q;
    return `M${n(x - dx + hx)} ${n(y - dx - hx)} A${r} ${r} 0 1 1 ${n(x - dx - hx)} ${n(y - dx + hx)} A${r} ${r} 0 0 0 ${n(x - dx + hx)} ${n(y - dx - hx)}Z`;
  }
  function ball(x, y, r, f, s, sw) {
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/><path d="${crescent(x, y, r, r > 60 ? .14 : .17)}" fill="${s}"/>` +
      `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${P}" stroke-width="${sw}"/>` +
      `<ellipse cx="${x - .38 * r}" cy="${y - .45 * r}" rx="${.26 * r}" ry="${.15 * r}" transform="rotate(-35 ${x - .38 * r} ${y - .45 * r})" fill="#fff" opacity=".9"/>`;
  }
  function star(x, y, k, fill, sw = 2.5) {
    return `<path d="M${x} ${y - k} Q${x + k * .18} ${y - k * .18} ${x + k} ${y} Q${x + k * .18} ${y + k * .18} ${x} ${y + k} Q${x - k * .18} ${y + k * .18} ${x - k} ${y} Q${x - k * .18} ${y - k * .18} ${x} ${y - k}Z" fill="${fill}" stroke="${P}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  }

  /* ---------- faces ---------- */
  const X = 180, Y = 170, R = 72;
  const cheeks = `<ellipse cx="${X - 43}" cy="${Y + 13}" rx="11" ry="6" fill="#FF9CCB"/><ellipse cx="${X + 43}" cy="${Y + 13}" rx="11" ry="6" fill="#FF9CCB"/>`;
  const eye = ex => `<g class="h-eye" style="transform-origin:${ex}px ${Y - 7}px"><ellipse cx="${ex}" cy="${Y - 7}" rx="11" ry="14.4" fill="${P}"/><circle cx="${ex - 3}" cy="${Y - 13}" r="4.7" fill="#fff"/><circle cx="${ex + 4}" cy="${Y - 2}" r="2.1" fill="#fff"/></g>`;
  const eyes = eye(X - 23) + eye(X + 23);
  /* fill, tongue, then outline: the tongue stays inside the mouth */
  const mouth = (w, top, deep, tx, ty, ry) => { const d = `M${X - w} ${Y + top} C${X - w * .74} ${Y + deep} ${X + w * .74} ${Y + deep} ${X + w} ${Y + top} Q${X} ${Y + top + 2} ${X - w} ${Y + top}Z`; return `<path d="${d}" fill="${P}"/><ellipse cx="${X}" cy="${Y + ty}" rx="${tx}" ry="${ry}" fill="#FF8FC2"/><path d="${d}" fill="none" stroke="${P}" stroke-width="4" stroke-linejoin="round"/>`; };
  const smile = mouth(14.4, 12, 34, 6.4, 25, 3.6);
  const laugh = mouth(18.5, 10.5, 43, 8.6, 30, 5);
  const swirl = ex => `<path d="M${ex} ${Y - 7} m0 0 c4 -2 6 4 1 6 c-7 2 -11 -6 -6 -11 c7 -6 17 0 15 9 c-2 9 -14 12 -20 5" fill="none" stroke="${P}" stroke-width="4" stroke-linecap="round"/>`;
  const arcEye = (ex, up) => `<path d="M${ex - 11} ${Y - 4} Q${ex} ${Y - 4 + (up ? -15 : 13)} ${ex + 11} ${Y - 4}" fill="none" stroke="${P}" stroke-width="5.4" stroke-linecap="round"/>`;
  const FACES = {
    happy: cheeks + eyes + smile,
    excited: cheeks + eyes + laugh,
    joy: cheeks + arcEye(X - 23, true) + arcEye(X + 23, true) + laugh,
    wink: cheeks + eye(X - 23) + arcEye(X + 23, true) + smile,
    sleepy: cheeks +
      `<path d="M${X - 34} ${Y - 10} L${X - 14} ${Y - 4} M${X + 34} ${Y - 10} L${X + 14} ${Y - 4}" stroke="${P}" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M${X - 12} ${Y + 22} q6 -6 12 0 t12 0" fill="none" stroke="${P}" stroke-width="4" stroke-linecap="round"/>`,
    sad: cheeks + eyes + `<path d="M${X - 13} ${Y + 29} Q${X} ${Y + 17} ${X + 13} ${Y + 29}" fill="none" stroke="${P}" stroke-width="5" stroke-linecap="round"/>`,
    effort: cheeks +
      `<path d="M${X - 33} ${Y - 16} L${X - 14} ${Y - 7} L${X - 33} ${Y + 2} M${X + 33} ${Y - 16} L${X + 14} ${Y - 7} L${X + 33} ${Y + 2}" fill="none" stroke="${P}" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M${X - 13} ${Y + 22} Q${X} ${Y + 16} ${X + 13} ${Y + 22}" fill="none" stroke="${P}" stroke-width="5" stroke-linecap="round"/>`,
    dizzy: cheeks + swirl(X - 23) + swirl(X + 23) + `<ellipse cx="${X}" cy="${Y + 24}" rx="8" ry="7" fill="${P}"/>`,
  };

  /* ---------- accessories ---------- */
  function glasses(g) {
    const x = X, y = Y;
    if (g === 'sun') return `<rect x="${x - 44}" y="${y - 22}" width="38" height="27" rx="10" fill="${P}"/><rect x="${x + 6}" y="${y - 22}" width="38" height="27" rx="10" fill="${P}"/><path d="M${x - 6} ${y - 14}h12" stroke="${P}" stroke-width="5"/><path d="M${x - 36} ${y - 15}l10 0M${x + 14} ${y - 15}l10 0" stroke="#E0FF48" stroke-width="3.5" stroke-linecap="round"/>`;
    if (g === 'round') return `<circle cx="${x - 23}" cy="${y - 7}" r="19" fill="none" stroke="#F27AA8" stroke-width="5"/><circle cx="${x + 23}" cy="${y - 7}" r="19" fill="none" stroke="#F27AA8" stroke-width="5"/><path d="M${x - 4} ${y - 9}h8" stroke="#F27AA8" stroke-width="5"/>`;
    return '';
  }
  function head(h) {
    const x = X, y = Y;
    if (h === 'cap') return `<path d="M${x - 58} ${y - 34} C${x - 58} ${y - 92} ${x + 58} ${y - 92} ${x + 58} ${y - 34}Z" fill="#4BB3E7" stroke="${P}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M${x + 46} ${y - 42} Q${x + 82} ${y - 50} ${x + 90} ${y - 34} Q${x + 70} ${y - 27} ${x + 44} ${y - 32}Z" fill="${P}" stroke="${P}" stroke-width="4" stroke-linejoin="round"/>` +
      `<circle cx="${x}" cy="${y - 80}" r="7" fill="#E0FF48" stroke="${P}" stroke-width="3.5"/><path d="M${x - 30} ${y - 48} h22" stroke="#E0FF48" stroke-width="7" stroke-linecap="round"/>`;
    if (h === 'hat') return `<ellipse cx="${x}" cy="${y - 46}" rx="84" ry="16" fill="#F3BDFF" stroke="${P}" stroke-width="6"/>` +
      `<path d="M${x - 48} ${y - 50} Q${x - 46} ${y - 112} ${x} ${y - 114} Q${x + 46} ${y - 112} ${x + 48} ${y - 50}Z" fill="#F3BDFF" stroke="${P}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M${x - 47} ${y - 64} Q${x} ${y - 56} ${x + 47} ${y - 64} L${x + 48} ${y - 52} Q${x} ${y - 44} ${x - 48} ${y - 52}Z" fill="#90FFBB" stroke="${P}" stroke-width="4" stroke-linejoin="round"/>`;
    if (h === 'crown') {
      const at = (a, b) => `${x + a} ${y + b}`;
      const base = `Q${at(0, -48)} ${at(-38, -60)}`;
      const d = `M${at(-38, -60)} L${at(-43, -98)} L${at(-20.5, -86)} L${at(0, -116)} L${at(20.5, -86)} L${at(43, -98)} L${at(38, -60)} ${base}Z`;
      const rim = `M${at(-38, -60)} L${at(-39.1, -68)} Q${at(0, -56)} ${at(39.1, -68)} L${at(38, -60)} ${base}Z`;
      return `<path d="${d}" fill="#E0FF48"/><path d="${rim}" fill="#B9D600"/><path d="${d}" fill="none" stroke="${P}" stroke-width="6" stroke-linejoin="round"/>` +
        `<circle cx="${x}" cy="${y - 80}" r="6" fill="#F3BDFF" stroke="${P}" stroke-width="3"/><circle cx="${x - 24.5}" cy="${y - 77.5}" r="4" fill="#8FD6FF" stroke="${P}" stroke-width="3"/><circle cx="${x + 24.5}" cy="${y - 77.5}" r="4" fill="#90FFBB" stroke="${P}" stroke-width="3"/>`;
    }
    if (h === 'band') return `<path d="M${x - 66} ${y - 30} Q${x} ${y - 66} ${x + 66} ${y - 30} L${x + 61} ${y - 46} Q${x} ${y - 84} ${x - 61} ${y - 46}Z" fill="#E0FF48" stroke="${P}" stroke-width="5" stroke-linejoin="round"/>`;
    return '';
  }
  function scarf(a = '#0478B2', b = '#90FFBB') {
    const x = X, y = Y;
    return `<path d="M${x - 64} ${y + 36} Q${x} ${y + 74} ${x + 64} ${y + 36} L${x + 57} ${y + 56} Q${x} ${y + 92} ${x - 57} ${y + 56}Z" fill="${a}" stroke="${P}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M${x + 30} ${y + 62} l20 -4 l8 38 l-22 4z" fill="${a}" stroke="${P}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M${x - 38} ${y + 52} l5 18 M${x - 8} ${y + 62} l2 17 M${x + 24} ${y + 59} l-2 17" stroke="${b}" stroke-width="8"/><path d="M${x + 35} ${y + 82} l21 -4" stroke="${b}" stroke-width="7"/>`;
  }
  function extra(e) {
    const x = X, y = Y;
    if (e === 'cup') return `<g transform="translate(${x + 64} ${y + 46})"><path d="M-14 -12 h28 l-4 30 h-20z" fill="#FFCFB5" stroke="${P}" stroke-width="4" stroke-linejoin="round"/><path d="M14 -4 q12 0 10 10 q-2 8 -12 6" fill="none" stroke="${P}" stroke-width="4"/><rect x="-16" y="-16" width="32" height="6" rx="3" fill="${P}"/></g>`;
    if (e === 'bubbles') return [[x - 88, y + 46, 12], [x + 92, y - 70, 9], [x - 74, y - 82, 7], [x + 86, y + 64, 14], [x - 100, y + 8, 6]].map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r}" fill="#E4F2F9" stroke="${P}" stroke-width="3"/><circle cx="${a - r * .35}" cy="${b - r * .35}" r="${r * .25}" fill="#fff"/>`).join('');
    if (e === 'pin') return `<g transform="translate(${x - 40} ${y + 44})"><circle r="17" fill="#E0FF48" stroke="${P}" stroke-width="4"/><text y="6" font-size="15" font-weight="800" text-anchor="middle" fill="${P}" font-family="Outfit,sans-serif">27</text></g>`;
    if (e === 'scarf') return scarf();
    if (e === 'scarfF') return scarf('#B14DD6', '#F3BDFF');
    if (e === 'ball') return `<g transform="translate(${x + 78} ${y + 62})"><circle r="23" fill="#fff" stroke="${P}" stroke-width="5"/><path d="M0 -9 L9 -2 L5 8 L-5 8 L-9 -2Z" fill="${P}"/><path d="M0 -9 V-22 M9 -2 L21 -6 M5 8 L12 19 M-5 8 L-12 19 M-9 -2 L-21 -6" stroke="${P}" stroke-width="4"/></g>`;
    return '';
  }

  /* ---------- draw ----------
     c = {shine:0-100, level:1-5, atoms:[keys], head, glasses, extra, mood, ring, stars} */
  let uid = 0;
  function svg(c = {}) {
    const shine = c.shine ?? 80, lv = c.level ?? 5, id = 'h' + (uid++);
    const [f, s] = core(shine), grey = clamp(1 - shine / 46);
    const glow = (c.glow ?? 1) * clamp((shine - 58) / 30), ring = (c.ring ?? lv >= 5) ? clamp((shine - 30) / 30) : 0;
    const A = c.atoms || atomsFor(lv), mood = c.mood || 'happy';
    let o = `<svg class="hidro" viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg" overflow="visible">`;
    o += `<defs><radialGradient id="${id}"><stop offset=".45" stop-color="#90FFBB" stop-opacity=".8"/><stop offset="1" stop-color="#90FFBB" stop-opacity="0"/></radialGradient></defs>`;
    o += `<circle class="h-glow" cx="${X}" cy="${Y}" r="150" fill="url(#${id})" opacity="${glow}"/>`;
    o += `<g class="h-trail" opacity="0" fill="none" stroke-linecap="round">` +
      [['#E0FF48', 146, 14], ['#90FFBB', 164, 10], ['#F3BDFF', 128, 8]].map(([col, r, w], i) => `<path d="${arc(r, i * 120 - 60, i * 120 + 30)}" stroke="${col}" stroke-width="${w}"/><path d="${arc(r, i * 120 + 118, i * 120 + 190)}" stroke="${col}" stroke-width="${w}" opacity=".8"/>`).join('') + `</g>`;
    o += `<g class="h-body"><g class="h-rot">`;
    const orbit = (col, w) => `<ellipse cx="${X}" cy="${Y + 6}" rx="150" ry="62" transform="rotate(-14 ${X} ${Y})" fill="none" stroke="${col}" stroke-width="${w}"/>`;
    o += `<g class="h-ring" opacity="${ring}">` + orbit(P, 12) + orbit('#E0FF48', 6.4) + `</g>`;
    o += `<g class="h-feet"><ellipse class="h-foot h-footL" cx="${X - 27}" cy="${Y + 73}" rx="15.5" ry="11.5" fill="${s}" stroke="${P}" stroke-width="6"/><ellipse class="h-foot h-footR" cx="${X + 27}" cy="${Y + 73}" rx="15.5" ry="11.5" fill="${s}" stroke="${P}" stroke-width="6"/></g>`;
    o += `<g class="h-atoms">` + A.map(k => {
      const a = ATOMS[k], x = X + a.x, y = Y + a.y, af = mix(a.f, '#DDE4E7', grey), as = mix(a.s, '#B9C6CB', grey);
      return `<g class="h-atom" data-a="${k}"><line x1="${X}" y1="${Y}" x2="${x}" y2="${y}" stroke="${P}" stroke-width="24" stroke-linecap="round"/><line x1="${X}" y1="${Y}" x2="${x}" y2="${y}" stroke="${af}" stroke-width="12" stroke-linecap="round"/><line x1="${X}" y1="${Y}" x2="${(X + a.x * 82 / Math.hypot(a.x, a.y)).toFixed(1)}" y2="${(Y + a.y * 82 / Math.hypot(a.x, a.y)).toFixed(1)}" stroke="${as}" stroke-width="12"/>` +
        ball(x, y, a.r, af, as, 6) + `<g transform="translate(${x} ${y + 1}) scale(${a.r / 52})" opacity="${lerp(1, .5, grey)}">${ICONS[k]}</g></g>`;
    }).join('') + `</g>`;
    o += `<g class="h-core">` + ball(X, Y, R, f, s, 7) +
      Object.keys(FACES).map(k => `<g class="h-face" data-m="${k}" ${k === mood ? '' : 'style="display:none"'}>${FACES[k]}</g>`).join('') +
      `<g class="h-acc" style="filter:grayscale(${(grey * .92).toFixed(2)})">` + glasses(c.glasses) + head(c.head) + extra(c.extra) + `</g></g>`;
    o += `</g>`;
    const [zx, zy] = A.includes('h2') ? [20, 120] : [52, 76];
    if (mood === 'sleepy') o += `<g class="h-zz"><text x="${X + zx}" y="${Y - zy}" font-family="Outfit,sans-serif" font-weight="800" font-size="26" fill="${P}" opacity=".6">z</text><text x="${X + zx + 17}" y="${Y - zy - 22}" font-family="Outfit,sans-serif" font-weight="800" font-size="18" fill="${P}" opacity=".4">z</text></g>`;
    o += `</g>`;
    if (c.stars !== false) o += `<g class="h-stars" opacity="${glow}">` + star(26, 40, 16, '#E0FF48') + star(334, 236, 12, '#F3BDFF') + star(318, 30, 9, '#90FFBB') + `</g>`;
    return o + '</svg>';
  }
  function arc(r, a0, a1) {
    const p = a => [X + r * Math.cos(a * Math.PI / 180), Y + r * Math.sin(a * Math.PI / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }

  /* ---------- movement ---------- */
  const smoother = x => { x = clamp(x); return x * x * x * (x * (6 * x - 15) + 10); };
  const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
  const easeInOut = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const FOOT = 252;

  /* One pose of the spin at time t (s) of T (s).
     He winds up, takes a moment to get going, spins, slows down and lands back on his feet. */
  function spinPose(t, T = 3, turns = 3) {
    const a = .15 * T, b = .83 * T;
    const pose = { rot: 0, dy: 0, sx: 1, sy: 1, vel: 0, mood: 'excited', spread: 1 };
    if (t < a) {                                   // wind-up: squash and lean back
      const e = easeInOut(t / a);
      pose.rot = -17 * e; pose.sx = 1 + .1 * e; pose.sy = 1 - .15 * e; pose.mood = 'effort';
    } else if (t < b) {                            // engage, spin, slow down
      const u = (t - a) / (b - a);
      const p = smoother(u);
      pose.rot = -17 + (360 * turns + 17 + 9) * p;
      pose.vel = clamp(30 * u * u * (1 - u) * (1 - u) / 1.875);
      pose.dy = -54 * Math.sin(Math.PI * easeInOut(Math.min(1, u * 1.04)));
      const back = easeOut(u / .22);
      pose.sx = lerp(1.1, 1 - .03 * pose.vel, back); pose.sy = lerp(.85, 1 + .05 * pose.vel, back);
      pose.spread = 1 + .07 * pose.vel;
      pose.mood = u < .2 ? 'effort' : 'joy';
    } else {                                       // land: overshoot, wobble, stand
      const u = (t - b) / (T - b), d = Math.exp(-4.2 * u);
      pose.rot = 9 * Math.cos(u * 9) * d;
      const sq = .17 * Math.cos(u * 10) * d;
      pose.sx = 1 + sq * .7; pose.sy = 1 - sq;
      pose.mood = u < .42 ? 'dizzy' : 'joy';
    }
    return pose;
  }
  function applyPose(root, p) {
    const q = s => root.querySelector(s);
    const body = q('.h-body'), rot = q('.h-rot'), trail = q('.h-trail'), atoms = q('.h-atoms');
    if (!body) return;
    body.setAttribute('transform', `translate(0 ${p.dy || 0}) translate(${X} ${FOOT}) scale(${p.sx ?? 1} ${p.sy ?? 1}) translate(${-X} ${-FOOT})`);
    rot.setAttribute('transform', `rotate(${p.rot || 0} ${X} ${Y})`);
    if (atoms) atoms.setAttribute('transform', p.spread && p.spread !== 1 ? `translate(${X} ${Y}) scale(${p.spread}) translate(${-X} ${-Y})` : '');
    if (trail) { trail.setAttribute('opacity', (p.vel || 0) * .95); trail.setAttribute('transform', `translate(0 ${p.dy || 0}) rotate(${(p.rot || 0) * .8} ${X} ${Y})`); }
    if (p.mood) setMood(root, p.mood);
  }
  function setMood(root, m) {
    root.querySelectorAll('.h-face').forEach(g => { g.style.display = g.dataset.m === m ? '' : 'none'; });
  }
  function run(dur, frame, done) {
    const t0 = performance.now();
    const step = () => {
      const t = Math.min(dur, performance.now() - t0);
      frame(t / 1000);
      if (t < dur) requestAnimationFrame(step); else done && done();
    };
    requestAnimationFrame(step);
  }
  /* Pass cfg + from/to and his colour comes back while he turns. */
  const spin = (root, { dur = 3, turns = 3, after = 'happy', cfg, from, to } = {}) => new Promise(r => run(dur * 1000, t => {
    if (cfg) root.innerHTML = svg({ ...cfg, shine: lerp(from, to, smoother((t / dur - .18) / .58)) });
    applyPose(root, spinPose(t, dur, turns));
  }, () => { if (cfg) root.innerHTML = svg({ ...cfg, shine: to }); applyPose(root, { mood: after }); r(); }));
  const hop = (root, { h = 40, dur = .7, mood = 'joy', after = 'happy' } = {}) => new Promise(r => run(dur * 1000, t => {
    const u = t / dur;
    let p;
    if (u < .2) { const e = easeInOut(u / .2); p = { sx: 1 + .08 * e, sy: 1 - .12 * e, mood }; }
    else if (u < .72) { const v = (u - .2) / .52; p = { dy: -h * Math.sin(Math.PI * v), sx: .97, sy: 1.04, mood }; }
    else { const v = (u - .72) / .28, d = Math.exp(-4 * v) * Math.cos(v * 8); p = { sx: 1 + .08 * d, sy: 1 - .12 * d, mood }; }
    applyPose(root, p);
  }, () => { applyPose(root, { mood: after }); r(); }));
  const wave = (root, { n = 3, dur = 1.3, atom = 'h2' } = {}) => new Promise(r => {
    const g = root.querySelector(`.h-atom[data-a="${atom}"]`);
    if (!g) return r();
    run(dur * 1000, t => { const u = t / dur, env = Math.sin(Math.PI * u); g.setAttribute('transform', `rotate(${14 * Math.sin(u * n * 2 * Math.PI) * env} ${X} ${Y})`); }, () => { g.setAttribute('transform', ''); r(); });
  });
  function blink(root) {
    root.querySelectorAll('.h-eye').forEach(e => e.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(.08)', offset: .5 }, { transform: 'scaleY(1)' }], { duration: 190, easing: 'ease-in-out' }));
  }

  /* ---------- sound: the station's own signature (never the till's) ---------- */
  let audio;
  function sound() {
    try { audio = audio || new Audio('assets/hidro.mp3'); audio.currentTime = 0; const p = audio.play(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* autoplay blocked: silent */ }
  }

  window.HIDRO = { P, ATOMS, ICONS, FACES, svg, ball, star, mix, lerp, clamp, core, stageOf, atomsFor, spin, spinPose, hop, wave, blink, applyPose, setMood, run, easeOut, easeInOut, smoother, sound };
})();
