// 2x2 linear map playground: no libraries, works on any static host.
(function () {
  const PRESETS = {
    'Identity': [1, 0, 0, 1],
    'Rotate 90°': [0, -1, 1, 0],
    'Shear': [1, 1, 0, 1],
    'Reflect': [1, 0, 0, -1],
    'Project': [1, 0, 0, 0],
    'Scale': [2, 0, 0, 0.5],
    'Random': null
  };
  const fmt = x => {
    if (Math.abs(x) < 1e-9) x = 0;
    return Number.isInteger(x) ? String(x) : x.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
  };

  function eigen(a, b, c, d) {
    const tr = a + d, det = a * d - b * c, disc = tr * tr - 4 * det;
    if (disc < -1e-12) {
      const re = tr / 2, im = Math.sqrt(-disc) / 2;
      return { complex: true, text: `${fmt(re)} ± ${fmt(im)}i`, vecs: [] };
    }
    const s = Math.sqrt(Math.max(disc, 0));
    const ls = s < 1e-12 ? [tr / 2] : [(tr + s) / 2, (tr - s) / 2];
    const vecs = [];
    ls.forEach(l => {
      if (Math.abs(b) > 1e-12) vecs.push([b, l - a]);
      else if (Math.abs(c) > 1e-12) vecs.push([l - d, c]);
      else if (Math.abs(a - d) < 1e-12) { vecs.push([1, 0], [0, 1]); }
      else vecs.push(Math.abs(l - a) < 1e-12 ? [1, 0] : [0, 1]);
    });
    return { complex: false, text: ls.map(fmt).join(', '), vecs };
  }

  function mount(root) {
    const start = (root.dataset.matrix || '1,1,0,1').split(',').map(Number);
    root.innerHTML = `
      <div class="la2d-controls">
        <div class="la2d-matrix">
          <span class="bracket">[</span>
          <div class="grid">${[0, 1, 2, 3].map(i => `<input type="number" step="0.1" value="${start[i]}" aria-label="entry ${i}">`).join('')}</div>
          <span class="bracket">]</span>
        </div>
        <div class="la2d-presets">${Object.keys(PRESETS).map(k => `<button type="button">${k}</button>`).join('')}</div>
        <label class="la2d-t">Morph from the identity: <input type="range" min="0" max="1" step="0.01" value="1"></label>
      </div>
      <canvas></canvas>
      <div class="la2d-info"></div>
      <p class="la2d-legend"><span style="color:#d33">■</span> image of e₁ &nbsp; <span style="color:#36c">■</span> image of e₂ &nbsp; <span style="color:#2a2">- -</span> eigenvector directions</p>`;
    const inputs = [...root.querySelectorAll('.grid input')];
    const slider = root.querySelector('.la2d-t input');
    const canvas = root.querySelector('canvas');
    const info = root.querySelector('.la2d-info');
    const ctx = canvas.getContext('2d');
    const R = 4; // show [-R, R]^2

    function size() {
      const w = Math.min(root.clientWidth || 480, 480), dpr = window.devicePixelRatio || 1;
      canvas.style.width = canvas.style.height = w + 'px';
      canvas.width = canvas.height = Math.round(w * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return w;
    }

    function draw() {
      const w = size(), u = w / (2 * R);
      const P = (x, y) => [w / 2 + x * u, w / 2 - y * u];
      const A = inputs.map(i => parseFloat(i.value) || 0);
      const t = parseFloat(slider.value);
      const [a, b, c, d] = [1 + t * (A[0] - 1), t * A[1], t * A[2], 1 + t * (A[3] - 1)];
      const M = (x, y) => [a * x + b * y, c * x + d * y];
      const line = (p, q, col, wid, dash) => {
        ctx.beginPath(); ctx.setLineDash(dash || []); ctx.strokeStyle = col; ctx.lineWidth = wid;
        ctx.moveTo(...P(...p)); ctx.lineTo(...P(...q)); ctx.stroke(); ctx.setLineDash([]);
      };
      const arrow = (v, col) => {
        line([0, 0], v, col, 3);
        const [x, y] = P(...v), ang = Math.atan2(-(v[1]), v[0]);
        ctx.beginPath(); ctx.fillStyle = col; ctx.moveTo(x, y);
        ctx.lineTo(x - 10 * Math.cos(ang - 0.4), y - 10 * Math.sin(ang - 0.4));
        ctx.lineTo(x - 10 * Math.cos(ang + 0.4), y - 10 * Math.sin(ang + 0.4)); ctx.fill();
      };
      ctx.clearRect(0, 0, w, w);
      for (let k = -R; k <= R; k++) {               // original grid
        line([k, -R], [k, R], '#eee', 1); line([-R, k], [R, k], '#eee', 1);
      }
      line([-R, 0], [R, 0], '#bbb', 1); line([0, -R], [0, R], '#bbb', 1);
      const L = 3 * R;                                 // transformed grid
      for (let k = -L; k <= L; k++) {
        line(M(k, -L), M(k, L), k === 0 ? '#999' : '#ccd', k === 0 ? 1.5 : 1);
        line(M(-L, k), M(L, k), k === 0 ? '#999' : '#ccd', k === 0 ? 1.5 : 1);
      }
      const det = a * d - b * c;                       // image of the unit square
      ctx.beginPath(); ctx.fillStyle = det >= 0 ? 'rgba(255,200,0,.35)' : 'rgba(200,0,200,.25)';
      [[0, 0], [1, 0], [1, 1], [0, 1]].map(p => P(...M(...p))).forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p));
      ctx.fill();
      const e = eigen(a, b, c, d);
      e.vecs.forEach(([x, y]) => { const n = Math.hypot(x, y) || 1; line([-2 * R * x / n, -2 * R * y / n], [2 * R * x / n, 2 * R * y / n], '#2a2', 1.5, [6, 5]); });
      arrow(M(1, 0), '#d33'); arrow(M(0, 1), '#36c');
      info.innerHTML = `<span>det = <b>${fmt(det)}</b></span><span>trace = <b>${fmt(a + d)}</b></span>` +
        `<span>eigenvalues: <b>${e.text}</b>${e.complex ? ' (complex: no real eigenvectors)' : ''}</span>` +
        (Math.abs(det) < 1e-9 ? '<span>not invertible: the plane is squashed onto a line or a point</span>' : '');
    }

    inputs.forEach(i => i.addEventListener('input', draw));
    slider.addEventListener('input', draw);
    root.querySelectorAll('.la2d-presets button').forEach(btn => btn.addEventListener('click', () => {
      const m = PRESETS[btn.textContent] || [0, 0, 0, 0].map(() => Math.round((Math.random() * 4 - 2) * 2) / 2);
      inputs.forEach((inp, i) => inp.value = m[i]);
      slider.value = 1; draw();
    }));
    window.addEventListener('resize', draw);
    draw();
  }
  document.querySelectorAll('.la2d').forEach(mount);
})();
