// =========================================================
//  AETHEROS BLOSSOM v5.0 — AURORA CANVAS
//  Animated radial gradient blobs on canvas
// =========================================================

(function initAurora() {
  const cv  = $('aurora-canvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, frame = 0;

  const blobs = [
    { ox: 0.15, oy: 0.45, r: 0.36, hue: 340, spd: 0.00055, phase: 0 },
    { ox: 0.85, oy: 0.28, r: 0.28, hue: 352, spd: 0.00048, phase: 1.2 },
    { ox: 0.50, oy: 0.72, r: 0.22, hue: 330, spd: 0.00070, phase: 2.5 },
    { ox: 0.22, oy: 0.82, r: 0.18, hue: 358, spd: 0.00090, phase: 0.7 },
    { ox: 0.78, oy: 0.62, r: 0.20, hue: 344, spd: 0.00080, phase: 3.1 },
  ];

  function resize() {
    W = cv.width  = innerWidth;
    H = cv.height = innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const t = frame * 16;

    blobs.forEach((b, i) => {
      const x = W * (b.ox + 0.07 * Math.sin(t * b.spd + b.phase));
      const y = H * (b.oy + 0.05 * Math.cos(t * b.spd * 1.1 + b.phase + 1));
      const r = Math.min(W, H) * b.r;
      const a = 0.055 + 0.025 * Math.sin(t * 0.001 + i);

      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0,   `hsla(${b.hue},80%,52%,${a})`);
      g.addColorStop(0.5, `hsla(${b.hue + 12},70%,42%,${a * 0.45})`);
      g.addColorStop(1,   'transparent');

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });

    frame++;
    requestAnimationFrame(draw);
  }

  draw();
  console.log('%cAurora canvas — running', 'color:#ff6eb4');
})();
