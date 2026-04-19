/**
 * interact-prompt.js — Context-sensitive interaction prompt
 */
const InteractPrompt = (() => {
  let el;
  let visible = false;
  let fadeTimeout = null;

  function init() {
    el = document.createElement('div');
    el.id = 'interact-prompt';
    Object.assign(el.style, {
      position: 'fixed',
      bottom: '160px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(8,8,16,0.85)',
      border: '1px solid rgba(200,122,74,0.2)',
      borderRadius: '8px',
      padding: '8px 20px',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      color: '#c0a878',
      fontSize: '0.82rem',
      fontFamily: "'Noto Sans SC', sans-serif",
      zIndex: '120',
      pointerEvents: 'none',
      opacity: '0',
      transition: 'opacity 0.25s',
      textAlign: 'center',
      letterSpacing: '0.03em',
    });
    document.body.appendChild(el);
  }

  function show(key, action) {
    el.innerHTML = `<span style="color:#e8c87a;font-weight:700;margin-right:6px;padding:2px 8px;border:1px solid rgba(232,200,122,0.3);border-radius:4px;font-size:0.75rem;">${key}</span>${action}`;
    el.style.opacity = '1';
    visible = true;

    if (fadeTimeout) clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => hide(), 2000);
  }

  function hide() {
    el.style.opacity = '0';
    visible = false;
  }

  function isVisible() { return visible; }

  return { init, show, hide, isVisible };
})();
