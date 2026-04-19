/**
 * particles-bg.js — Title screen animated background
 */
const ParticlesBg = (() => {
  let canvas, ctx;
  let particles = [];
  let animId = null;
  let w, h;

  function init(_canvas) {
    canvas = _canvas;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    createParticles(80);
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.4,
        alpha: 0.2 + Math.random() * 0.5,
        hue: 25 + Math.random() * 20, // warm clay tones
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      });
    }
  }

  function start() {
    if (animId) return;
    function draw() {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.7, 0, w * 0.5, h * 0.7, w * 0.8);
      grad.addColorStop(0, 'rgba(30, 18, 40, 1)');
      grad.addColorStop(0.5, 'rgba(16, 10, 24, 1)');
      grad.addColorStop(1, 'rgba(10, 10, 18, 1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Wrap
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const glow = 0.5 + Math.sin(p.pulse) * 0.5;
        const r = p.r * (0.8 + glow * 0.4);

        // Glow
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
        g.addColorStop(0, `hsla(${p.hue}, 70%, 60%, ${p.alpha * glow * 0.3})`);
        g.addColorStop(1, `hsla(${p.hue}, 70%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connection lines (near particles)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.08;
            ctx.strokeStyle = `rgba(200, 160, 100, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
    draw();
  }

  function stop() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  return { init, start, stop };
})();
