/**
 * compass.js — HUD compass bar
 */
const Compass = (() => {
  let el, canvas, ctx;

  function init() {
    el = document.getElementById('compass');
    canvas = document.getElementById('compass-canvas');
    ctx = canvas.getContext('2d');
  }

  function render() {
    const camera = Engine.getCamera();
    const yaw = camera.rotation.y;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = 'rgba(10,10,18,0.6)';
    ctx.fillRect(0, 0, w, h);

    // Cardinal directions
    const dirs = [
      { label: 'N', angle: 0, color: '#e8c87a' },
      { label: 'E', angle: Math.PI / 2, color: '#8a7a6a' },
      { label: 'S', angle: Math.PI, color: '#8a7a6a' },
      { label: 'W', angle: -Math.PI / 2, color: '#8a7a6a' },
    ];

    // Intercardinals
    const interDirs = [
      { label: 'NE', angle: Math.PI / 4 },
      { label: 'SE', angle: 3 * Math.PI / 4 },
      { label: 'SW', angle: -3 * Math.PI / 4 },
      { label: 'NW', angle: -Math.PI / 4 },
    ];

    const range = Math.PI / 2; // visible range
    const centerX = w / 2;

    // Tick marks
    for (let deg = 0; deg < 360; deg += 10) {
      const rad = (deg * Math.PI / 180) - yaw;
      const normRad = ((rad + Math.PI) % (2 * Math.PI)) - Math.PI;
      if (Math.abs(normRad) > range) continue;

      const x = centerX + (normRad / range) * (w / 2);
      const isMajor = deg % 90 === 0;
      const isMinor = deg % 30 === 0;

      ctx.strokeStyle = isMajor ? 'rgba(232,200,122,0.5)' : 'rgba(200,122,74,0.15)';
      ctx.lineWidth = isMajor ? 1.5 : 0.5;
      ctx.beginPath();
      ctx.moveTo(x, isMajor ? 4 : isMinor ? 8 : 12);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Direction labels
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';

    dirs.forEach(d => {
      const rad = d.angle - yaw;
      const normRad = ((rad + Math.PI) % (2 * Math.PI)) - Math.PI;
      if (Math.abs(normRad) > range) return;

      const x = centerX + (normRad / range) * (w / 2);
      ctx.fillStyle = d.color;
      ctx.fillText(d.label, x, 26);
    });

    interDirs.forEach(d => {
      const rad = d.angle - yaw;
      const normRad = ((rad + Math.PI) % (2 * Math.PI)) - Math.PI;
      if (Math.abs(normRad) > range) return;

      const x = centerX + (normRad / range) * (w / 2);
      ctx.fillStyle = 'rgba(100,90,70,0.6)';
      ctx.font = '9px sans-serif';
      ctx.fillText(d.label, x, 24);
    });

    // Center indicator
    ctx.fillStyle = '#e8c87a';
    ctx.beginPath();
    ctx.moveTo(centerX - 4, 0);
    ctx.lineTo(centerX + 4, 0);
    ctx.lineTo(centerX, 6);
    ctx.closePath();
    ctx.fill();
  }

  return { init, render };
})();
