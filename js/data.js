/* Content and rules of the concept. One place to change a number. */
(function () {
  /* Points rule: everything members earn today stays. Greener moves count double.
     Litres keep today's gow cashback, but they never make Hidro shine.
     eur = what the customer saves, kg = CO2e avoided (see "How we estimate" in the app). */
  const MOVES = [
    { k: 'charge', n: 'EV charge',         d: '30 kWh',                     base: 40, green: true,  eur: 1.20, kg: 29,   shine: 22, icon: 'bolt',    why: 'Same 180 km on petrol: 11.7 L × 2.8 kg = 32.8 kg. On the Spanish grid: 30 kWh × 0.12 = 3.6 kg.' },
    { k: 'solar',  n: 'Solar-hours charge', d: 'Between 12:00 and 16:00',   base: 15, green: true,  eur: 0.60, kg: 1.2,  shine: 8,  icon: 'sun',     why: 'Midday grid is cleaner: ~0.08 instead of ~0.12 kg/kWh on 30 kWh.' },
    { k: 'cup',    n: 'Own cup',           d: 'Scanned at the till',        base: 10, green: true,  eur: 0.20, kg: 0.03, shine: 6,  icon: 'mug',     why: 'One paper cup and lid avoided (~30 g).' },
    { k: 'vuelve', n: 'Vuelve return',     d: 'Cups, cans, AdBlue jugs…',   base: 10, green: true,  eur: 0.20, kg: 0.08, shine: 6,  icon: 'loop',    why: 'Average of a can, a PET bottle and a reusable cup kept in the loop.' },
    { k: 'tyres',  n: 'Tyre check',        d: 'QR on the air machine',      base: 15, green: true,  eur: 0.00, kg: 1.8,  shine: 6,  icon: 'tyre',    why: '~1% better mileage over the next 1,000 km.' },
    { k: 'wash',   n: 'Recycled-water wash', d: 'Instead of washing at home', base: 15, green: true, eur: 0.40, kg: 0.5, shine: 6,  icon: 'bubbles', why: 'Less water to pump and heat.' },
    { k: 'friend', n: 'Shared ride',       d: 'Two gow members, one car',   base: 20, green: true,  eur: 0.00, kg: 3.6,  shine: 8,  icon: 'team',    why: 'One 20 km car trip avoided.' },
    { k: 'rescue', n: 'Rescued food',      d: 'Closing-time pack',          base: 10, green: true,  eur: 3.00, kg: 1.5,  shine: 5,  icon: 'bag',     why: 'About 0.6 kg of food not thrown away.' },
    { k: 'coffee', n: 'Coffee',            d: 'Shop, as today',             base: 25, green: false, eur: 0.09, kg: 0,    shine: 0,  icon: 'cup',     why: 'Saves money, not CO₂e on its own.' },
    { k: 'fuel',   n: 'Fuel',              d: 'gow cashback, as today',     base: 0,  green: false, eur: 1.50, kg: 0,    shine: 0,  icon: 'pump',    why: 'Earns what it earns today. It never makes Hidro shine.' },
  ];
  const pts = m => m.base * (m.green ? 2 : 1);
  const sum = list => list.reduce((o, m) => ({ pts: o.pts + pts(m), eur: o.eur + m.eur, kg: o.kg + m.kg, shine: o.shine + m.shine }), { pts: 0, eur: 0, kg: 0, shine: 0 });

  /* "Vuelve" = give it back, come back. Deposit-return for what drivers actually throw away. */
  const VUELVE = [
    { n: 'Reusable cup', icon: 'mug' }, { n: 'Cans and bottles', icon: 'can' }, { n: 'AdBlue jug', icon: 'jug' },
    { n: 'Motor-oil bottle', icon: 'oil' }, { n: 'Wiper blades', icon: 'wiper' }, { n: '12 V battery', icon: 'batt' },
  ];
  const LEVELS = [{ n: 'Atom', min: 0 }, { n: 'Duo', min: 200 }, { n: 'Molecule', min: 500 }, { n: 'Compound', min: 900 }, { n: 'Crystal', min: 1500 }];
  const HEAD = { none: { n: 'None', u: '', got: true }, cap: { n: 'Pit crew cap', u: 'You checked your tyres', got: true }, hat: { n: 'Bucket hat', u: 'Station of the month', got: true }, crown: { n: 'Crown', u: 'Reach level 5', lv: 5 } };
  const GLASSES = { none: { n: 'None', u: '', got: true }, sun: { n: 'Efficient shades', u: 'You fill up less often', got: true }, round: { n: 'Round glasses', u: 'Share a ride', got: false } };
  const EXTRA = { none: { n: 'None', u: '', got: true }, cup: { n: 'Cup', u: 'You brought your own cup', got: true }, scarf: { n: 'LALIGA scarf', u: 'Matchday move', got: true }, ball: { n: 'Match ball', u: 'Liga F Moeve matchday', got: false }, pin: { n: 'Huelva 2027 pin', u: 'When the biofuels plant opens', got: false } };
  const FACTS = [
    ['Moeve has already sold <b>70%</b> of its oil production assets.', 'Moeve'],
    ['More than <b>60%</b> of Moeve\'s €7–8 bn plan goes into sustainable projects.', 'Moeve, Positive Motion'],
    ['The Andalusian Green Hydrogen Valley will reach <b>2 GW</b>.', 'Moeve'],
    ['Grey hydrogen is made from gas. Green hydrogen is made from <b>water and renewable power</b>.', 'Moeve'],
  ];
  /* Regional Cup: ranked by the share of green moves, never by volume. Illustrative. */
  const CUP = [
    { r: 'Andalucía', s: 36 }, { r: 'Madrid', s: 34, me: true }, { r: 'Comunitat Valenciana', s: 31 }, { r: 'Catalunya', s: 30 }, { r: 'Euskadi', s: 29 }, { r: 'Galicia', s: 26 },
  ];
  /* Neighbours in the Plaza. Nicknames only. */
  const NICKS = [
    ['Chispa', 96, 5, 'crown', ''], ['Nube', 55, 3, '', ''], ['Turbo', 88, 4, 'cap', ''], ['Kiwi', 82, 2, '', ''], ['Pepa', 60, 4, 'hat', ''], ['Mar', 90, 3, '', 'sun'],
    ['Rayo', 64, 5, 'cap', ''], ['Coco', 78, 3, '', ''], ['Luz', 94, 4, '', ''], ['Lolo', 8, 2, '', ''], ['Bimba', 72, 3, 'hat', ''], ['Txema', 84, 4, 'cap', ''],
    ['Nico', 58, 3, '', 'sun'], ['Alba', 91, 4, '', ''], ['Sol', 86, 4, '', ''], ['Duna', 70, 2, '', ''], ['Gala', 89, 5, 'crown', ''],
  ];

  /* ---------- small round icons drawn as mini atoms ---------- */
  const H = window.HIDRO, P = H.P;
  function icon(k) {
    const map = {
      bolt: ['#E0FF48', '#B9D600', H.ICONS.volt], sun: ['#FFCFB5', '#FF9F6E', H.ICONS.sol], leaf: ['#90FFBB', '#4FE08A', H.ICONS.bio], h2: ['#F3BDFF', '#D78CF0', H.ICONS.h2],
      cup: ['#FFCFB5', '#FF9F6E', `<path d="M-15 -12 h30 l-4 28 h-22z" fill="${P}"/><path d="M15 -4 q11 0 9 9 q-2 7 -11 5" fill="none" stroke="${P}" stroke-width="5"/>`],
      mug: ['#90FFBB', '#4FE08A', `<path d="M-15 -14 h26 v22 a10 10 0 0 1 -10 10 h-6 a10 10 0 0 1 -10 -10z" fill="${P}"/><path d="M11 -8 q11 0 11 8 q0 8 -11 8" fill="none" stroke="${P}" stroke-width="5"/>`],
      loop: ['#8FD6FF', '#45AEE8', `<path d="M-19 4 A19 19 0 0 1 12 -15" fill="none" stroke="${P}" stroke-width="7" stroke-linecap="round"/><path d="M19 -4 A19 19 0 0 1 -12 15" fill="none" stroke="${P}" stroke-width="7" stroke-linecap="round"/><path d="M6 -25 L21 -13 L4 -5Z M-6 25 L-21 13 L-4 5Z" fill="${P}"/>`],
      tyre: ['#F3BDFF', '#D78CF0', `<circle r="21" fill="${P}"/><circle r="9" fill="#F3BDFF"/>`],
      bubbles: ['#8FD6FF', '#45AEE8', `<circle cx="-7" cy="5" r="11" fill="none" stroke="${P}" stroke-width="5"/><circle cx="11" cy="-9" r="7" fill="none" stroke="${P}" stroke-width="5"/>`],
      team: ['#90FFBB', '#4FE08A', `<circle cx="-9" cy="-7" r="8" fill="${P}"/><circle cx="11" cy="-7" r="8" fill="${P}"/><path d="M-22 18 a13 13 0 0 1 26 0zM-2 18 a13 13 0 0 1 26 0z" fill="${P}"/>`],
      bag: ['#FFCFB5', '#FF9F6E', `<path d="M-17 -8 h34 l-3 28 h-28z" fill="${P}"/><path d="M-8 -8 a8 9 0 0 1 16 0" fill="none" stroke="${P}" stroke-width="5"/>`],
      pump: ['#E6ECEE', '#C9D3D7', `<path d="M-16 22 V-18 a5 5 0 0 1 5 -5 h14 a5 5 0 0 1 5 5 V22 Z" fill="${P}"/><rect x="-11" y="-17" width="14" height="10" rx="2" fill="#E6ECEE"/><path d="M8 -8 h5 a4 4 0 0 1 4 4 v14 a3 3 0 0 0 6 0 V-10 l-6 -6" fill="none" stroke="${P}" stroke-width="4" stroke-linecap="round"/>`],
      can: ['#8FD6FF', '#45AEE8', `<rect x="-11" y="-21" width="22" height="42" rx="5" fill="${P}"/><path d="M-7 -8 h14" stroke="#8FD6FF" stroke-width="4"/>`],
      jug: ['#E4F2F9', '#BBD9E8', `<path d="M-14 22 V-6 l8 -10 h16 v38z" fill="${P}"/><rect x="-4" y="-24" width="9" height="8" fill="${P}"/><path d="M4 -8 v12" stroke="#E4F2F9" stroke-width="4" stroke-linecap="round"/>`],
      oil: ['#E0FF48', '#B9D600', `<path d="M-12 22 V-8 l6 -8 v-8 h12 v8 l6 8 V22z" fill="${P}"/><path d="M0 -4 q8 9 0 14 q-8 -5 0 -14" fill="#E0FF48"/>`],
      wiper: ['#F3BDFF', '#D78CF0', `<path d="M-21 -9 Q0 -23 21 -9" fill="none" stroke="${P}" stroke-width="6" stroke-linecap="round"/><path d="M0 -16 L8 20" stroke="${P}" stroke-width="6" stroke-linecap="round"/>`],
      batt: ['#FFB3D1', '#F27AA8', `<rect x="-20" y="-11" width="40" height="28" rx="4" fill="${P}"/><rect x="-14" y="-18" width="9" height="8" fill="${P}"/><rect x="5" y="-18" width="9" height="8" fill="${P}"/><path d="M-14 3 h8 M6 3 h8 M10 -1 v8" stroke="#FFB3D1" stroke-width="3.5"/>`],
      trophy: ['#E0FF48', '#B9D600', `<path d="M-13 -20 h26 v10 a13 13 0 0 1 -26 0z" fill="${P}"/><path d="M-13 -14 h-7 q0 12 9 12 M13 -14 h7 q0 12 -9 12" fill="none" stroke="${P}" stroke-width="4"/><rect x="-4" y="2" width="8" height="10" fill="${P}"/><rect x="-12" y="12" width="24" height="7" rx="2" fill="${P}"/>`],
      euro: ['#E0FF48', '#B9D600', `<path d="M14 -15 A18 18 0 1 0 14 15 M-19 -5 h24 M-19 6 h22" fill="none" stroke="${P}" stroke-width="6" stroke-linecap="round"/>`],
    };
    const [f, s, g] = map[k] || map.h2;
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">${H.ball(32, 32, 27, f, s, 4.5)}<g transform="translate(32 33) scale(.58)">${g}</g></svg>`;
  }

  window.DATA = { MOVES, pts, sum, VUELVE, LEVELS, HEAD, GLASSES, EXTRA, FACTS, CUP, NICKS, icon, OPS_DAY: 69, KG_PER_KM: 0.18 };
})();
