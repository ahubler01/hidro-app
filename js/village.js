/* The village behind the Plaza: a Moeve station on a sunny morning.
   Shared by the app (phone + station screen) and the final deck. Pure SVG; the small motions
   (turbines, clouds, the passing car, steam from the hydrogen plant) use SVG animation, so no CSS is needed.
   scene(W, H, {g, k, plaza}) returns SVG markup for a W x H box:
     g = y of the town's ground line, k = size of the buildings, plaza = also draw the paved square in front. */
(function () {
  const P = '#004656', SW = 5;
  let uid = 0;
  const MARK = '<path d="M0 33.7 L24.5 41.75 V86 L0 94.4Z"/><path d="M48.75 33.7 L72.8 41.75 V86 L48.75 94.4Z"/><path d="M24.5 3 H60.1 A60.75 60.75 0 0 1 120.85 63.75 V91.85 H96.85 V30.4 A5.2 5.2 0 0 0 91.65 25.2 H24.5Z"/>';
  const LOGO = MARK + '<path d="M329.3 3 H352.7 L379.75 67.9 L405.7 3 H429.6 L393.7 85.6 Q389.6 94.9 379.6 94.9 Q369.7 94.9 365.6 85.6Z"/><path d="M129.1 47.4 A50.1 47.5 0 1 1 229.3 47.4 A50.1 47.5 0 1 1 129.1 47.4Z M150.4 47.45 A28.7 27.7 0 1 0 207.8 47.45 A28.7 27.7 0 1 0 150.4 47.45Z"/><path d="M332.95 39.25 L264.30 62.95 A28.9 28 0 0 0 313.65 63.95 L332.20 70.05 A52.2 47.4 0 0 1 286.30 94.85 A48.6 47.4 0 0 1 237.70 47.4 A48.6 47.4 0 0 1 286.30 0 A47.4 47.4 0 0 1 332.95 39.25Z M258.85 46.75 L307.00 30.25 A28 27.7 0 0 0 284.60 18.85 A26 27.7 0 0 0 258.85 46.75Z"/><path d="M519.15 39.25 L450.50 62.95 A28.9 28 0 0 0 499.85 63.95 L518.40 70.05 A52.2 47.4 0 0 1 472.50 94.85 A48.6 47.4 0 0 1 423.90 47.4 A48.6 47.4 0 0 1 472.50 0 A47.4 47.4 0 0 1 519.15 39.25Z M445.05 46.75 L493.20 30.25 A28 27.7 0 0 0 470.80 18.85 A26 27.7 0 0 0 445.05 46.75Z"/>';
  const at = (x, y, k, body) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${k})">${body}</g>`;
  const spin = dur => `<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${dur}s" repeatCount="indefinite"/>`;

  /* ---------- pieces, drawn standing on y = 0 ---------- */
  const cloud = `<path d="M-60 0 Q-66 -22 -42 -24 Q-36 -48 -8 -44 Q8 -64 32 -46 Q60 -50 58 -22 Q74 -16 66 0Z" fill="#fff" stroke="${P}" stroke-width="${SW}" stroke-linejoin="round"/>`;
  const bird = `<path d="M-12 0 Q-6 -8 0 0 Q6 -8 12 0" fill="none" stroke="${P}" stroke-width="3.5" stroke-linecap="round"/>`;
  const turbine = (h, dur) => `<path d="M-5 0 L-2.5 ${-h} H2.5 L5 0Z" fill="#fff" stroke="${P}" stroke-width="${SW * .8}" stroke-linejoin="round"/>` +
    `<g transform="translate(0 ${-h})"><g>${spin(dur)}${[0, 120, 240].map(a => `<path transform="rotate(${a})" d="M0 0 Q6 ${-h * .2} 1.5 ${-h * .48} Q-4 ${-h * .3} 0 0Z" fill="#fff" stroke="${P}" stroke-width="${SW * .7}" stroke-linejoin="round"/>`).join('')}</g><circle r="6" fill="#E0FF48" stroke="${P}" stroke-width="${SW * .7}"/></g>`;
  const tree = (c = '#4FE08A') => `<path d="M0 0 V-34" stroke="${P}" stroke-width="${SW * 1.4}" stroke-linecap="round"/><path d="M-30 -40 Q-36 -72 -12 -80 Q-4 -104 18 -94 Q40 -92 36 -66 Q44 -44 22 -36 Q0 -28 -30 -40Z" fill="${c}" stroke="${P}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M-12 -62 Q-6 -76 8 -78" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>`;
  const pine = `<path d="M0 0 V-16" stroke="${P}" stroke-width="${SW * 1.2}"/><path d="M0 -92 L22 -46 H12 L28 -16 H-28 L-12 -46 H-22Z" fill="#38C98A" stroke="${P}" stroke-width="${SW}" stroke-linejoin="round"/>`;
  const panel = `<path d="M0 0 V-8 M30 0 V-14" stroke="${P}" stroke-width="3"/><path d="M-6 -6 L32 -6 L40 -26 L2 -26Z" fill="#4BB3E7" stroke="${P}" stroke-width="3.5" stroke-linejoin="round"/><path d="M13 -6 L21 -26 M-2 -16 L36 -16" stroke="#BFE6F5" stroke-width="2"/>`;
  function car(col, plugged) {
    return `<path d="M-58 -12 Q-60 -32 -38 -36 L-22 -56 Q-16 -62 -4 -62 H22 Q34 -62 42 -52 L54 -36 Q66 -34 66 -20 V-12Z" fill="${col}" stroke="${P}" stroke-width="${SW}" stroke-linejoin="round"/>` +
      `<path d="M-30 -38 L-18 -54 H2 V-38Z M10 -38 V-54 H22 Q30 -54 34 -48 L42 -38Z" fill="#DDF3FB" stroke="${P}" stroke-width="3.5" stroke-linejoin="round"/>` +
      `<rect x="57" y="-30" width="9" height="6" rx="3" fill="#FF6B8A" stroke="${P}" stroke-width="2.5"/><rect x="-66" y="-30" width="10" height="7" rx="3" fill="#E0FF48" stroke="${P}" stroke-width="2.5"/>` +
      [-34, 40].map(x => `<circle cx="${x}" cy="-10" r="13" fill="${P}"/><circle cx="${x}" cy="-10" r="5.5" fill="#E4F2F9"/>`).join('') +
      (plugged ? `<circle cx="-56" cy="-28" r="4" fill="#E0FF48" stroke="${P}" stroke-width="2.5"/>` : '');
  }
  const pump = `<rect x="-20" y="-82" width="40" height="82" rx="8" fill="#fff" stroke="${P}" stroke-width="${SW}"/><rect x="-12" y="-72" width="24" height="16" rx="3" fill="#8FD6FF" stroke="${P}" stroke-width="3"/><path d="M-6 -46 h12 M-6 -38 h12" stroke="${P}" stroke-width="3" stroke-linecap="round"/><path d="M20 -50 q14 4 12 24 v14" fill="none" stroke="${P}" stroke-width="4" stroke-linecap="round"/>`;
  const charger = `<rect x="-20" y="-86" width="40" height="86" rx="10" fill="#E0FF48" stroke="${P}" stroke-width="${SW}"/><path d="M3 -74 L-9 -52 H0 L-4 -34 L10 -58 H1Z" fill="${P}"/><circle cx="0" cy="-20" r="5" fill="#38DCD6" stroke="${P}" stroke-width="2.5"><animate attributeName="opacity" values="1;.25;1" dur="1.6s" repeatCount="indefinite"/></circle>`;

  /* the station: price totem, canopy with a pump and two chargers (one car charging), shop with café and solar roof */
  function station() {
    let s = '';
    // totem
    s += `<rect x="-262" y="-150" width="16" height="150" fill="${P}"/><rect x="-292" y="-196" width="76" height="92" rx="10" fill="${P}" stroke="${P}" stroke-width="${SW}"/>` +
      `<svg x="-275" y="-188" width="42" height="33" viewBox="0 0 121 95" fill="#fff">${MARK}</svg>` +
      [['#E0FF48', '1,55'], ['#90FFBB', '1,62'], ['#fff', '0,39']].map(([c, t], i) => `<rect x="-284" y="${-150 + i * 14}" width="60" height="10" rx="3" fill="${c}"/>`).join('');
    // shop (behind)
    s += `<rect x="190" y="-150" width="250" height="150" rx="8" fill="#fff" stroke="${P}" stroke-width="${SW}"/>` +
      `<rect x="206" y="-96" width="96" height="60" rx="5" fill="#BFE6F5" stroke="${P}" stroke-width="4"/><path d="M222 -86 l20 -0 M222 -76 l34 0" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` +
      `<rect x="330" y="-92" width="70" height="92" rx="4" fill="#BFE6F5" stroke="${P}" stroke-width="4"/><path d="M365 -92 V0" stroke="${P}" stroke-width="3"/>` +
      `<path d="M190 -126 H440 V-110 ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `Q${435 - i * 25} -98 ${415 - i * 25} -110`).join(' ')} Z" fill="#fff" stroke="${P}" stroke-width="4" stroke-linejoin="round"/>` +
      [0, 2, 4, 6, 8].map(i => `<path d="M${440 - i * 25} -126 V-110 Q${435 - i * 25} -98 ${415 - i * 25} -110 V-126Z" fill="#38DCD6"/>`).join('') +
      `<rect x="214" y="-146" width="96" height="16" rx="4" fill="${P}"/><text x="262" y="-134" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="800" font-size="12" fill="#90FFBB" letter-spacing="2">CAFÉ</text>` +
      [0, 1, 2].map(i => at(330 + i * 34, -150, .8, panel)).join('');
    // canopy
    s += `<rect x="-150" y="-150" width="18" height="150" fill="#fff" stroke="${P}" stroke-width="${SW}"/><rect x="132" y="-150" width="18" height="150" fill="#fff" stroke="${P}" stroke-width="${SW}"/>`;
    s += at(-96, 0, 1, pump) + at(0, 0, 1, charger) + at(96, 0, 1, charger);
    s += `<rect x="-200" y="-196" width="400" height="48" rx="16" fill="${P}" stroke="${P}" stroke-width="${SW}"/><rect x="-200" y="-156" width="400" height="8" fill="#38DCD6"/>` +
      `<svg x="-62" y="-187" width="124" height="23" viewBox="0 0 520 95" fill="#fff" fill-rule="evenodd">${LOGO}</svg>`;
    // a car charging under the canopy (cable from the right charger)
    s += at(160, 0, .9, car('#F3BDFF', true));
    s += `<path d="M112 -56 Q130 -10 112 -26" fill="none" stroke="${P}" stroke-width="3.5"/>`;
    return s;
  }
  /* green hydrogen plant: electrolyser hall, two spheres, a little steam */
  function h2plant() {
    const id = 'st' + (uid++);
    return `<rect x="0" y="-70" width="120" height="70" rx="6" fill="#fff" stroke="${P}" stroke-width="${SW}"/><path d="M0 -70 L30 -94 L60 -70 L90 -94 L120 -70" fill="#90FFBB" stroke="${P}" stroke-width="${SW}" stroke-linejoin="round"/>` +
      [16, 50, 84].map(x => `<rect x="${x}" y="-50" width="20" height="26" rx="3" fill="#BFE6F5" stroke="${P}" stroke-width="3"/>`).join('') +
      `<rect x="140" y="-150" width="16" height="150" fill="#fff" stroke="${P}" stroke-width="${SW}"/>` +
      [0, 1, 2].map(i => `<circle cx="148" cy="-160" r="${10 + i * 3}" fill="#fff" stroke="${P}" stroke-width="3" opacity="0"><animate attributeName="cy" values="-160;-230" dur="4.5s" begin="${i * 1.5}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.9;0" dur="4.5s" begin="${i * 1.5}s" repeatCount="indefinite"/></circle>`).join('') +
      [[210, 40], [290, 34]].map(([x, r]) => `<path d="M${x - r * .7} 0 L${x - r * .5} ${-r} M${x + r * .7} 0 L${x + r * .5} ${-r}" stroke="${P}" stroke-width="4"/><circle cx="${x}" cy="${-r * 1.55}" r="${r}" fill="#fff" stroke="${P}" stroke-width="${SW}"/><path d="M${x - r * .6} ${-r * 1.9} q${r * .3} ${-r * .35} ${r * .7} ${-r * .3}" fill="none" stroke="#8FD6FF" stroke-width="5" stroke-linecap="round"/><text x="${x}" y="${-r * 1.35}" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="800" font-size="${r * .6}" fill="${P}">H₂</text>`).join('') +
      `<path d="M120 -30 H${210 - 28}" stroke="${P}" stroke-width="6"/><path d="M120 -30 H${210 - 28}" stroke="#90FFBB" stroke-width="2.5"/>`;
  }
  const lamp = `<path d="M0 0 V-120" stroke="${P}" stroke-width="${SW * 1.2}" stroke-linecap="round"/><path d="M-12 -120 H12 L8 -136 H-8Z" fill="${P}"/><circle cx="0" cy="-114" r="7" fill="#E0FF48" stroke="${P}" stroke-width="3"/>`;
  const bench = `<rect x="-44" y="-30" width="88" height="10" rx="4" fill="#FFCFB5" stroke="${P}" stroke-width="4"/><rect x="-44" y="-50" width="88" height="10" rx="4" fill="#FFCFB5" stroke="${P}" stroke-width="4"/><path d="M-34 -20 V0 M34 -20 V0 M-34 -40 V-30 M34 -40 V-30" stroke="${P}" stroke-width="5" stroke-linecap="round"/>`;
  const kiosk = `<rect x="-36" y="-96" width="72" height="96" rx="12" fill="#90FFBB" stroke="${P}" stroke-width="${SW}"/><rect x="-24" y="-62" width="48" height="12" rx="6" fill="${P}"/>` +
    `<path d="M-10 -80 A12 12 0 1 1 -12 -72" fill="none" stroke="${P}" stroke-width="4" stroke-linecap="round"/><path d="M-16 -78 L-11 -71 L-5 -77" fill="none" stroke="${P}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<text x="0" y="-22" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="800" font-size="15" fill="${P}">Vuelve</text>`;
  const planter = c => `<rect x="-30" y="-26" width="60" height="26" rx="6" fill="#FFCFB5" stroke="${P}" stroke-width="4"/>` + at(0, -22, .62, tree(c));
  const flowers = `<path d="M-30 0 Q-30 -26 0 -26 Q30 -26 30 0Z" fill="#38C98A" stroke="${P}" stroke-width="4"/>` + [[-16, -18, '#F3BDFF'], [2, -24, '#E0FF48'], [18, -14, '#FFCFB5'], [-2, -10, '#8FD6FF']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="6" fill="${c}" stroke="${P}" stroke-width="2.5"/>`).join('');
  function bunting(x1, y1, x2, y2, sag, k) {
    const cols = ['#E0FF48', '#90FFBB', '#F3BDFF', '#8FD6FF', '#38DCD6'], n = Math.max(5, Math.round(Math.abs(x2 - x1) / (34 * k)));
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + sag;
    let s = `<path d="M${x1} ${y1} Q${mx} ${my + sag} ${x2} ${y2}" fill="none" stroke="${P}" stroke-width="${2.5 * k}"/>`;
    for (let i = 1; i < n; i++) {
      const t = i / n, x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * (my + sag) + t * t * y2, w = 9 * k;
      s += `<path d="M${(x - w).toFixed(1)} ${y.toFixed(1)} L${(x + w).toFixed(1)} ${y.toFixed(1)} L${x.toFixed(1)} ${(y + 18 * k).toFixed(1)}Z" fill="${cols[i % 5]}" stroke="${P}" stroke-width="${2 * k}" stroke-linejoin="round"/>`;
    }
    return s;
  }

  function scene(W, H, o = {}) {
    const g = o.g, k = o.k, id = 'v' + (uid++);
    let s = `<defs><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE6F5"/><stop offset="1" stop-color="#F2FAFD"/></linearGradient>` +
      `<pattern id="${id}t" width="${48 * k}" height="${24 * k}" patternUnits="userSpaceOnUse"><rect width="${48 * k}" height="${24 * k}" fill="#EEF7F3"/><path d="M0 ${24 * k} H${48 * k} M${24 * k} 0 V${12 * k} M0 ${12 * k} H${48 * k} M${12 * k} ${12 * k} V${24 * k} M${36 * k} ${12 * k} V${24 * k}" stroke="#DCEDE6" stroke-width="${2 * k}"/></pattern></defs>`;
    s += `<rect width="${W}" height="${H}" fill="url(#${id}s)"/>`;
    // sun with slow rays
    const sx = W * .88, sy = g * .3;
    s += at(sx, sy, k, `<g>${spin(40)}${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path transform="rotate(${a})" d="M0 -46 V-58" stroke="#E0FF48" stroke-width="7" stroke-linecap="round"/>`).join('')}</g><circle r="34" fill="#E0FF48" stroke="${P}" stroke-width="${SW}"/>`);
    // clouds and birds
    [[.16, .22, 1], [.5, .14, .8], [.72, .34, .65]].forEach(([x, y, c], i) =>
      s += `<g><animateTransform attributeName="transform" type="translate" values="0 0;${30 * k} 0;0 0" dur="${24 + i * 7}s" repeatCount="indefinite"/>${at(W * x, g * y, k * c, cloud)}</g>`);
    s += at(W * .34, g * .28, k * .9, bird) + at(W * .37, g * .22, k * .7, bird) + at(W * .62, g * .2, k * .8, bird);
    // far hills: turbines on the left, solar farm, hydrogen plant on the right
    s += `<path d="M0 ${g - 70 * k} Q${W * .18} ${g - 150 * k} ${W * .38} ${g - 80 * k} T${W * .75} ${g - 96 * k} T${W} ${g - 120 * k} V${g} H0Z" fill="#D9FBE6" stroke="${P}" stroke-width="${3 * k}"/>`;
    s += at(W * .06, g - 84 * k, k * .9, turbine(150, 7)) + at(W * .15, g - 112 * k, k * .75, turbine(150, 5.5)) + at(W * .23, g - 104 * k, k * .6, turbine(150, 8));
    s += `<path d="M0 ${g - 30 * k} Q${W * .25} ${g - 70 * k} ${W * .5} ${g - 40 * k} T${W} ${g - 50 * k} V${g} H0Z" fill="#B8F3CF" stroke="${P}" stroke-width="${3 * k}"/>`;
    for (let i = 0; i < 4; i++) s += at(W * .02 + i * 46 * k, g - 30 * k - i * 3 * k, k * .9, panel);
    s += at(W * .74, g - 34 * k, k * .62, h2plant());
    s += at(W * .3, g - 40 * k, k * .55, pine) + at(W * .33, g - 44 * k, k * .45, pine) + at(W * .96, g - 46 * k, k * .55, pine);
    // the town line: station, trees
    s += `<rect x="0" y="${g - 6 * k}" width="${W}" height="${8 * k}" fill="#D5E9EF"/>`;
    s += at(W * .1, g, k * .8, tree()) + at(W * .92, g, k * .9, tree('#38DCD6'));
    s += at(W * .46, g, k * .78, station());
    // road with a passing car
    const r0 = g + 2 * k, rh = 30 * k;
    s += `<rect x="0" y="${r0}" width="${W}" height="${rh}" fill="#6E8C95"/><path d="M0 ${r0} H${W} M0 ${r0 + rh} H${W}" stroke="${P}" stroke-width="${3 * k}"/><path d="M0 ${r0 + rh / 2} H${W}" stroke="#fff" stroke-width="${3 * k}" stroke-dasharray="${22 * k} ${18 * k}"/>`;
    s += `<g><animateTransform attributeName="transform" type="translate" from="${-140 * k} 0" to="${W + 140 * k} 0" dur="9s" repeatCount="indefinite"/>${at(0, r0 + rh * .78, k * .62, `<g transform="scale(-1 1)">${car('#8FD6FF')}</g>`)}</g>`;
    s += `<g><animateTransform attributeName="transform" type="translate" from="${W + 140 * k} 0" to="${-140 * k} 0" dur="12s" begin="-5s" repeatCount="indefinite"/>${at(0, r0 + rh * .42, k * .55, car('#E0FF48'))}</g>`;
    if (o.below) s += `<rect x="0" y="${r0 + rh}" width="${W}" height="${H - r0 - rh}" fill="${o.below}"/>`;
    if (o.plaza) {
      const p0 = r0 + rh;
      const ph = H - p0, cx = W * .5, cy = p0 + ph * .5;
      s += `<rect x="0" y="${p0}" width="${W}" height="${ph}" fill="url(#${id}t)"/><path d="M0 ${p0} H${W}" stroke="${P}" stroke-width="${3 * k}"/>`;
      // grass beds in the corners and the lime podium in the middle
      s += `<path d="M-10 ${H + 10} V${p0 + ph * .55} Q${W * .12} ${p0 + ph * .42} ${W * .26} ${H + 10}Z" fill="#B8F3CF" stroke="${P}" stroke-width="${3 * k}"/>`;
      s += `<path d="M${W + 10} ${H + 10} V${p0 + ph * .5} Q${W * .86} ${p0 + ph * .4} ${W * .72} ${H + 10}Z" fill="#B8F3CF" stroke="${P}" stroke-width="${3 * k}"/>`;
      s += `<ellipse cx="${cx}" cy="${cy + 8 * k}" rx="${150 * k}" ry="${34 * k}" fill="${P}"/><ellipse cx="${cx}" cy="${cy}" rx="${150 * k}" ry="${34 * k}" fill="#E0FF48" stroke="${P}" stroke-width="${4 * k}"/><ellipse cx="${cx}" cy="${cy - 2 * k}" rx="${112 * k}" ry="${22 * k}" fill="#F1FFA8"/>`;
      // lamps with bunting across the square
      const ly = p0 + 40 * k, lx = [W * .03, W * .36, W * .64, W * .97];
      for (let i = 0; i < 3; i++) s += bunting(lx[i], ly - 112 * k, lx[i + 1], ly - 112 * k, 14 * k, k);
      lx.forEach(x => s += at(x, ly, k * .95, lamp));
      s += at(W * .2, p0 + 46 * k, k * .8, bench) + at(W * .57, p0 + 36 * k, k * .75, kiosk) + at(W * .8, p0 + 46 * k, k * .8, bench);
      s += at(W * .05, H - 4 * k, k * 1.1, planter()) + at(W * .95, H - 4 * k, k * 1.1, planter('#38DCD6'));
      s += at(W * .14, H - 2 * k, k, flowers) + at(W * .22, p0 + ph * .72, k * .8, flowers) + at(W * .84, H - 2 * k, k, flowers) + at(W * .79, p0 + ph * .7, k * .8, flowers);
      s += at(W * .1, p0 + ph * .62, k * .55, tree()) + at(W * .9, p0 + ph * .6, k * .6, tree('#38DCD6'));
    }
    return s;
  }
  window.VILLAGE = { scene, bunting, lamp, flowers, planter, car, tree };
})();
