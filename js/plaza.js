/* The Plaza: one tidy scene, used on the phone and on the station's big screen.
   Everyone has a fixed place on three terraces. The visitor stands on the podium in front. */
(function () {
  const H = window.HIDRO, D = window.DATA, P = H.P;

  const turbine = (x, y, h, r, dur) => `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - h}" stroke="${P}" stroke-width="${r * .13}" stroke-linecap="round"/><g transform="translate(${x} ${y - h})"><g class="blades" style="animation-duration:${dur}s"><path d="M0 0L0 ${-r}M0 0L${r * .87} ${r * .5}M0 0L${-r * .87} ${r * .5}" stroke="${P}" stroke-width="${r * .14}" stroke-linecap="round"/></g><circle r="${r * .16}" fill="#fff" stroke="${P}" stroke-width="${r * .08}"/></g>`;
  const tree = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-46" stroke="${P}" stroke-width="9" stroke-linecap="round"/><circle cx="0" cy="-78" r="42" fill="#4FE08A" stroke="${P}" stroke-width="6"/><circle cx="-32" cy="-60" r="27" fill="#4FE08A" stroke="${P}" stroke-width="6"/><circle cx="33" cy="-60" r="27" fill="#4FE08A" stroke="${P}" stroke-width="6"/><circle cx="0" cy="-72" r="36" fill="#4FE08A"/><circle cx="-26" cy="-60" r="19" fill="#4FE08A"/><circle cx="27" cy="-60" r="19" fill="#4FE08A"/></g>`;
  const logo = (x, y, w, fill) => `<svg x="${x}" y="${y}" width="${w}" height="${w * 95 / 520}" viewBox="0 0 520 95" fill="${fill}" fill-rule="evenodd">${LOGO}</svg>`;
  const LOGO = '<path d="M0 33.7 L24.5 41.75 V86 L0 94.4Z"/><path d="M48.75 33.7 L72.8 41.75 V86 L48.75 94.4Z"/><path d="M24.5 3 H60.1 A60.75 60.75 0 0 1 120.85 63.75 V91.85 H96.85 V30.4 A5.2 5.2 0 0 0 91.65 25.2 H24.5Z"/><path d="M329.3 3 H352.7 L379.75 67.9 L405.7 3 H429.6 L393.7 85.6 Q389.6 94.9 379.6 94.9 Q369.7 94.9 365.6 85.6Z"/><path d="M129.1 47.4 A50.1 47.5 0 1 1 229.3 47.4 A50.1 47.5 0 1 1 129.1 47.4Z M150.4 47.45 A28.7 27.7 0 1 0 207.8 47.45 A28.7 27.7 0 1 0 150.4 47.45Z"/><path d="M332.95 39.25 L264.30 62.95 A28.9 28 0 0 0 313.65 63.95 L332.20 70.05 A52.2 47.4 0 0 1 286.30 94.85 A48.6 47.4 0 0 1 237.70 47.4 A48.6 47.4 0 0 1 286.30 0 A47.4 47.4 0 0 1 332.95 39.25Z M258.85 46.75 L307.00 30.25 A28 27.7 0 0 0 284.60 18.85 A26 27.7 0 0 0 258.85 46.75Z"/><path d="M519.15 39.25 L450.50 62.95 A28.9 28 0 0 0 499.85 63.95 L518.40 70.05 A52.2 47.4 0 0 1 472.50 94.85 A48.6 47.4 0 0 1 423.90 47.4 A48.6 47.4 0 0 1 472.50 0 A47.4 47.4 0 0 1 519.15 39.25Z M445.05 46.75 L493.20 30.25 A28 27.7 0 0 0 470.80 18.85 A26 27.7 0 0 0 445.05 46.75Z"/>';
  const MARK = '<path d="M0 33.7 L24.5 41.75 V86 L0 94.4Z"/><path d="M48.75 33.7 L72.8 41.75 V86 L48.75 94.4Z"/><path d="M24.5 3 H60.1 A60.75 60.75 0 0 1 120.85 63.75 V91.85 H96.85 V30.4 A5.2 5.2 0 0 0 91.65 25.2 H24.5Z"/>';

  /* A station: canopy, charger, pump, shop. Drawn in a 600 x 210 box. */
  function station(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})" stroke="${P}" stroke-width="6" stroke-linejoin="round">
      <rect x="395" y="74" width="196" height="136" rx="10" fill="#fff"/><rect x="395" y="74" width="196" height="30" rx="10" fill="#38DCD6"/><rect x="418" y="122" width="70" height="88" fill="#BFE6F5"/><rect x="504" y="122" width="66" height="52" rx="4" fill="#BFE6F5"/>
      <rect x="62" y="62" width="17" height="148" fill="#fff"/><rect x="306" y="62" width="17" height="148" fill="#fff"/>
      <rect x="0" y="0" width="404" height="66" rx="20" fill="${P}"/>
      <rect x="124" y="112" width="54" height="98" rx="12" fill="#E0FF48"/><path d="M154 132 L139 160 H150 L146 182 L163 153 H152Z" fill="${P}" stroke="none"/>
      <rect x="216" y="112" width="54" height="98" rx="12" fill="#fff"/><rect x="227" y="125" width="32" height="22" rx="4" fill="#4BB3E7" stroke-width="4"/>
      <g stroke="none">${logo(128, 20, 148, '#fff')}</g></g>`;
  }

  const CONF = {
    station: {
      w: 1920, h: 752, rows: [{ n: 7, y: 318, s: 122, x0: 300, x1: 1620, c: 30 }, { n: 6, y: 470, s: 136, x0: 290, x1: 1630, c: 34 }, { n: 4, y: 622, s: 156, x0: 236, x1: 1684, c: 34, gap: true }],
      me: { x: 960, y: 640, s: 268 }, bg: () => {
        let o = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDF0F8"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient></defs><rect width="1920" height="752" fill="url(#sky)"/>`;
        o += `<circle cx="1716" cy="86" r="52" fill="#E0FF48" stroke="${P}" stroke-width="6"/>`;
        o += `<path d="M0 232 Q300 150 620 214 T1260 196 T1920 226 V752 H0Z" fill="#D9FBE6"/>`;
        o += turbine(196, 232, 138, 60, 6) + turbine(330, 222, 108, 46, 8) + turbine(1520, 214, 136, 56, 7);
        o += tree(1372, 236, .78) + tree(566, 236, .64) + station(690, 46, .9);
        o += `<path d="M-60 268 Q960 196 1980 268 V752 H-60Z" fill="#CDFADF" stroke="${P}" stroke-width="5"/>`;
        o += `<path d="M-60 428 Q960 352 1980 428 V752 H-60Z" fill="#B2F5CD" stroke="${P}" stroke-width="5"/>`;
        o += `<path d="M-60 582 Q960 506 1980 582 V752 H-60Z" fill="#97EFBB" stroke="${P}" stroke-width="5"/>`;
        o += `<ellipse cx="960" cy="690" rx="236" ry="46" fill="${P}"/><ellipse cx="960" cy="676" rx="236" ry="46" fill="#E0FF48" stroke="${P}" stroke-width="6"/><ellipse cx="960" cy="674" rx="186" ry="33" fill="#F1FFA8"/>`;
        return o;
      },
    },
    phone: {
      w: 390, h: 386, rows: [{ n: 5, y: 138, s: 60, x0: 46, x1: 344, c: 7 }, { n: 4, y: 206, s: 66, x0: 48, x1: 342, c: 9 }, { n: 2, y: 292, s: 74, x0: 88, x1: 302, c: 0 }],
      me: { x: 195, y: 330, s: 126 }, bg: () => {
        let o = `<defs><linearGradient id="skyp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDF0F8"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><rect width="390" height="386" fill="url(#skyp)"/>`;
        o += `<circle cx="346" cy="36" r="17" fill="#E0FF48" stroke="${P}" stroke-width="2.5"/><path d="M0 96 Q100 62 200 88 T390 84 V386 H0Z" fill="#D9FBE6"/>`;
        o += turbine(40, 94, 60, 24, 6) + tree(322, 106, .32) + station(102, 32, .315);
        o += `<path d="M-20 122 Q195 88 410 122 V386 H-20Z" fill="#C4F8D9" stroke="${P}" stroke-width="2.5"/>`;
        o += `<path d="M-20 190 Q195 154 410 190 V386 H-20Z" fill="#A9F3C7" stroke="${P}" stroke-width="2.5"/>`;
        o += `<path d="M-20 268 Q195 228 410 268 V386 H-20Z" fill="#90EDB6" stroke="${P}" stroke-width="2.5"/>`;
        o += `<ellipse cx="195" cy="350" rx="92" ry="18" fill="${P}"/><ellipse cx="195" cy="345" rx="92" ry="18" fill="#E0FF48" stroke="${P}" stroke-width="2.5"/><ellipse cx="195" cy="344" rx="72" ry="12.5" fill="#F1FFA8"/>`;
        return o;
      },
    },
  };

  function build(el, mode) {
    const C = CONF[mode];
    if (mode === 'phone') {                                   // scale the scene to any phone width
      const inner = document.createElement('div'), host = el;
      inner.style.cssText = `position:absolute;left:0;top:0;width:${C.w}px;height:${C.h}px;transform-origin:0 0;overflow:hidden`;
      host.innerHTML = ''; host.appendChild(inner);
      const size = () => { const k = (host.clientWidth || C.w) / C.w; inner.style.transform = `scale(${k})`; host.style.height = C.h * k + 'px'; };
      addEventListener('resize', size); size(); el = inner;
    }
    el.innerHTML = `<svg class="bg" viewBox="0 0 ${C.w} ${C.h}" preserveAspectRatio="none">${C.bg()}</svg>`;
    const mols = [];
    let k = 0;
    C.rows.forEach((row, ri) => {
      for (let i = 0; i < row.n; i++) {
        const nick = D.NICKS[k % D.NICKS.length];
        let u = row.n === 1 ? .5 : i / (row.n - 1);
        let x = row.x0 + (row.x1 - row.x0) * u;
        if (row.gap) x = i < 2 ? row.x0 + i * 270 : row.x1 - (row.n - 1 - i) * 270;      // leave the podium free
        const mid = C.w / 2, cy = row.y + row.c * Math.pow((x - mid) / mid, 2);
        const m = document.createElement('div');
        m.className = 'mol'; m.style.cssText = `left:${x - row.s / 2}px;top:${cy - row.s * .78}px;width:${row.s}px;z-index:${2 + ri}`;
        const [n, shine, lv, head, gl] = nick;
        m.innerHTML = H.svg({ shine, level: lv, head, glasses: gl, stars: false, ring: lv >= 5, mood: shine < 28 ? 'sleepy' : 'happy' }) + `<span class="nick">${n}</span>`;
        m.dataset.x = x; m.dataset.y = cy; m.dataset.asleep = shine < 28 ? 1 : '';
        el.appendChild(m); mols.push(m); k++;
      }
    });
    /* gentle idle bob, staggered; asleep ones stay still */
    mols.forEach((m, i) => { if (!m.dataset.asleep) m.querySelector('.hidro').animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-4%)' }, { transform: 'translateY(0)' }], { duration: 2600 + (i % 5) * 130, iterations: Infinity, delay: -i * 310, easing: 'ease-in-out' }); });
    const api = { el, mols, C, me: null };
    api.place = cfg => {
      if (api.me) api.me.remove();
      const m = document.createElement('div');
      m.className = 'mol me'; m.style.cssText = `left:${C.me.x - C.me.s / 2}px;top:${C.me.y - C.me.s * .62}px;width:${C.me.s}px;z-index:9`;
      m.innerHTML = H.svg({ shine: 90, level: 5, head: 'crown', mood: 'happy', ...cfg }) + `<span class="nick">You</span>`;
      el.appendChild(m); api.me = m; return m;
    };
    /* drop in, land, cheer outwards */
    api.enter = async cfg => {
      const m = api.place(cfg), svgEl = m.querySelector('.hidro'), nick = m.querySelector('.nick');
      nick.animate([{ opacity: 0, transform: 'scale(.4)' }, { opacity: 0, transform: 'scale(.4)', offset: .8 }, { opacity: 1, transform: 'scale(1)' }], { duration: 1250, fill: 'both', easing: 'ease-out' });
      await svgEl.animate([{ transform: 'translateY(-260%) scale(.45)' }, { transform: 'translateY(0) scale(1)' }], { duration: 620, easing: 'cubic-bezier(.45,0,.9,.6)', fill: 'both' }).finished;
      burst(el, C.me.x, C.me.y + C.me.s * .1, C.me.s * .95, 22);
      H.hop(svgEl, { h: 26, dur: .8 });
      api.cheer();
    };
    api.cheer = () => mols.filter(m => !m.dataset.asleep).forEach(m => {
      const d = Math.hypot(+m.dataset.x - C.me.x, (+m.dataset.y - C.me.y) * 1.6) / C.w;
      setTimeout(() => H.hop(m.querySelector('.hidro'), { h: 46, dur: .75 }), 120 + d * 1300);
    });
    return api;
  }
  function burst(el, x, y, r, n = 18) {
    const cols = ['#E0FF48', '#90FFBB', '#F3BDFF', '#8FD6FF', '#FFCFB5'];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i'), a = (i / n) * Math.PI * 2 + (i % 2) * .16, d = r * (.62 + .38 * ((i * 37) % 10) / 10);
      s.className = 'spark';
      s.style.cssText = `left:${x}px;top:${y}px;background:${cols[i % 5]};border:2px solid ${P};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d * .8}px`;
      el.appendChild(s); setTimeout(() => s.remove(), 1000);
    }
  }
  window.PLAZA = { build, burst, station, turbine, tree, LOGO, MARK, logo };
})();
