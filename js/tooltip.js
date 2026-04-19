/**
 * tooltip.js — Hover tooltip system
 */
const Tooltip = (() => {
  let el;
  let visible = false;

  function init() {
    el = document.createElement('div');
    el.id = 'game-tooltip';
    el.style.display = 'none';
    document.body.appendChild(el);

    // Style
    Object.assign(el.style, {
      position: 'fixed',
      zIndex: '300',
      background: 'rgba(8,8,16,0.92)',
      border: '1px solid rgba(200,122,74,0.25)',
      borderRadius: '8px',
      padding: '10px 14px',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      pointerEvents: 'none',
      maxWidth: '280px',
      transition: 'opacity 0.15s',
      opacity: '0',
      fontFamily: "'Noto Sans SC', sans-serif",
    });
  }

  function show(x, y, title, desc, extra) {
    let html = `<div style="color:#e8c87a;font-size:0.85rem;font-weight:700;margin-bottom:4px;">${title}</div>`;
    if (desc) html += `<div style="color:#a09888;font-size:0.78rem;line-height:1.5;">${desc}</div>`;
    if (extra) html += `<div style="color:#c87a4a;font-size:0.72rem;margin-top:6px;font-style:italic;">${extra}</div>`;
    el.innerHTML = html;
    el.style.display = 'block';
    el.style.opacity = '1';

    // Position (prevent overflow)
    const rect = el.getBoundingClientRect();
    const px = Math.min(x + 12, window.innerWidth - rect.width - 8);
    const py = Math.min(y + 12, window.innerHeight - rect.height - 8);
    el.style.left = px + 'px';
    el.style.top = py + 'px';
    visible = true;
  }

  function hide() {
    el.style.opacity = '0';
    setTimeout(() => { el.style.display = 'none'; }, 150);
    visible = false;
  }

  function isVisible() { return visible; }

  return { init, show, hide, isVisible };
})();
