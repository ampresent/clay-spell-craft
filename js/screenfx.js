/**
 * screenfx.js — Screen-space visual effects
 */
const ScreenFX = (() => {
  let canvas, ctx;
  let w, h;
  const effects = [];

  function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'screen-fx';
    Object.assign(canvas.style, {
      position: 'fixed',
      inset: '0',
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: '90',
    });
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function flash(color = '#fff', duration = 300) {
    effects.push({ type: 'flash', color, start: performance.now(), duration });
  }

  function vignette(intensity = 0.3) {
    effects.push({ type: 'vignette', intensity, start: performance.now(), duration: 2000 });
  }

  function damageFlash() {
    flash('rgba(255,50,50,0.15)', 200);
  }

  function magicGlow(color) {
    vignette(0.15);
  }

  function update() {
    ctx.clearRect(0, 0, w, h);
    const now = performance.now();

    for (let i = effects.length - 1; i >= 0; i--) {
      const fx = effects[i];
      const elapsed = now - fx.start;
      const progress = elapsed / fx.duration;

      if (progress >= 1) {
        effects.splice(i, 1);
        continue;
      }

      if (fx.type === 'flash') {
        const alpha = 1 - progress;
        ctx.fillStyle = fx.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
      }

      if (fx.type === 'vignette') {
        const alpha = fx.intensity * (1 - progress);
        const grad = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.7);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, `rgba(0,0,0,${alpha})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
    }

    // Always-on subtle vignette
    const baseVig = ctx.createRadialGradient(w / 2, h / 2, w * 0.35, w / 2, h / 2, w * 0.75);
    baseVig.addColorStop(0, 'rgba(0,0,0,0)');
    baseVig.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = baseVig;
    ctx.fillRect(0, 0, w, h);
  }

  return { init, flash, vignette, damageFlash, magicGlow, update };
})();
