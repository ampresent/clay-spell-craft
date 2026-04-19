/**
 * mobile-controls.js — Virtual joystick + touch buttons for mobile
 */
const MobileControls = (() => {
  let enabled = false;
  let joystickActive = false;
  let lookActive = false;
  let joystickOrigin = { x: 0, y: 0 };
  let lookOrigin = { x: 0, y: 0 };
  let moveDir = { x: 0, y: 0 };

  const JOYSTICK_RADIUS = 50;

  let joystickBase, joystickKnob, btnInteract, btnCast, btnMenu;

  function init() {
    if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) return;
    enabled = true;
    createUI();
    bindEvents();
    patchEngine();
  }

  function createUI() {
    const container = document.createElement('div');
    container.id = 'mobile-controls';
    container.style.cssText = 'position:fixed;bottom:0;left:0;right:0;height:200px;pointer-events:none;z-index:100;display:none;';

    joystickBase = document.createElement('div');
    joystickBase.style.cssText = 'position:absolute;bottom:40px;left:40px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.12);border:2px solid rgba(255,255,255,0.25);pointer-events:auto;touch-action:none;';

    joystickKnob = document.createElement('div');
    joystickKnob.style.cssText = 'position:absolute;width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,0.35);border:2px solid rgba(255,255,255,0.5);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;';
    joystickBase.appendChild(joystickKnob);

    btnInteract = createButton('E', 'bottom:100px;right:40px;');
    btnCast = createButton('\u2726', 'bottom:40px;right:110px;');
    btnMenu = createButton('\u2630', 'top:10px;right:10px;');

    container.appendChild(joystickBase);
    container.appendChild(btnInteract);
    container.appendChild(btnCast);
    container.appendChild(btnMenu);
    document.body.appendChild(container);
  }

  function createButton(label, posStyle) {
    const btn = document.createElement('div');
    btn.textContent = label;
    btn.style.cssText = 'position:absolute;' + posStyle + 'width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.15);border:2px solid rgba(255,255,255,0.3);color:white;font-size:22px;font-weight:bold;display:flex;align-items:center;justify-content:center;pointer-events:auto;touch-action:none;user-select:none;';
    return btn;
  }

  function bindEvents() {
    joystickBase.addEventListener('touchstart', (e) => { e.preventDefault(); joystickActive = true; updateJoystick(e.touches[0]); }, { passive: false });
    joystickBase.addEventListener('touchmove', (e) => { e.preventDefault(); if (joystickActive) updateJoystick(e.touches[0]); }, { passive: false });
    joystickBase.addEventListener('touchend', () => { joystickActive = false; joystickKnob.style.transform = 'translate(-50%, -50%)'; Engine._mobileMove(0, 0); });

    btnInteract.addEventListener('touchstart', (e) => { e.preventDefault(); Engine.emit('interact'); }, { passive: false });
    btnCast.addEventListener('touchstart', (e) => { e.preventDefault(); Engine.emit('click'); }, { passive: false });
    btnMenu.addEventListener('touchstart', (e) => { e.preventDefault(); Engine.emit('escape'); }, { passive: false });

    const canvas = document.getElementById('game-canvas');
    canvas.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      if (t.clientX < window.innerWidth * 0.4) return;
      e.preventDefault();
      lookActive = true;
      lookOrigin.x = t.clientX;
      lookOrigin.y = t.clientY;
    }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
      if (!lookActive) return;
      e.preventDefault();
      const t = e.touches[0];
      Engine._mobileLook(t.clientX - lookOrigin.x, t.clientY - lookOrigin.y);
      lookOrigin.x = t.clientX;
      lookOrigin.y = t.clientY;
    }, { passive: false });
    canvas.addEventListener('touchend', () => { lookActive = false; });
  }

  function updateJoystick(touch) {
    const rect = joystickBase.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = touch.clientX - cx;
    const dy = touch.clientY - cy;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), JOYSTICK_RADIUS);
    const angle = Math.atan2(dy, dx);
    const kx = Math.cos(angle) * dist;
    const ky = Math.sin(angle) * dist;
    joystickKnob.style.transform = 'translate(calc(-50% + ' + kx + 'px), calc(-50% + ' + ky + 'px))';
    Engine._mobileMove(dist > 10 ? kx / JOYSTICK_RADIUS : 0, dist > 10 ? ky / JOYSTICK_RADIUS : 0);
  }

  function patchEngine() {
    Engine._mobileForward = false;
    Engine._mobileBackward = false;
    Engine._mobileLeft = false;
    Engine._mobileRight = false;
    Engine._mobileMove = function(x, y) {
      var dz = 0.2;
      Engine._mobileForward = y < -dz;
      Engine._mobileBackward = y > dz;
      Engine._mobileLeft = x < -dz;
      Engine._mobileRight = x > dz;
    };
    Engine._mobileLook = function(dx, dy) {
      if (Engine._applyLook) Engine._applyLook(dx * 0.003, dy * 0.003);
    };
  }

  function show() {
    if (!enabled) return;
    var el = document.getElementById('mobile-controls');
    if (el) el.style.display = 'block';
  }

  return { init, show, isEnabled: function() { return enabled; } };
})();
