/**
 * settings.js — Game settings panel
 */
const Settings = (() => {
  const defaults = {
    mouseSensitivity: 0.002,
    masterVolume: 0.3,
    musicVolume: 0.15,
    sfxVolume: 0.5,
    showMinimap: true,
    showCompass: true,
    showQuestTracker: true,
  };

  let current = { ...defaults };

  function init() {
    const saved = localStorage.getItem('clay_spell_settings');
    if (saved) {
      try { current = { ...defaults, ...JSON.parse(saved) }; } catch (e) {}
    }
  }

  function save() {
    localStorage.setItem('clay_spell_settings', JSON.stringify(current));
  }

  function get(key) { return current[key]; }

  function set(key, value) {
    current[key] = value;
    save();
  }

  function render() {
    const container = document.getElementById('settings-content');
    if (!container) return;

    container.innerHTML = `
      <div class="setting-row">
        <label>鼠标灵敏度</label>
        <input type="range" min="5" max="40" value="${current.mouseSensitivity * 10000}" 
               oninput="Settings.set('mouseSensitivity', this.value/10000); this.nextElementSibling.textContent=(this.value/10).toFixed(1)">
        <span class="setting-value">${(current.mouseSensitivity * 10000 / 10).toFixed(1)}</span>
      </div>
      <div class="setting-row">
        <label>主音量</label>
        <input type="range" min="0" max="100" value="${current.masterVolume * 100}"
               oninput="Settings.set('masterVolume', this.value/100); this.nextElementSibling.textContent=this.value+'%'">
        <span class="setting-value">${Math.round(current.masterVolume * 100)}%</span>
      </div>
      <div class="setting-row">
        <label>显示小地图</label>
        <label class="toggle">
          <input type="checkbox" ${current.showMinimap ? 'checked' : ''} 
                 onchange="Settings.set('showMinimap', this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="setting-row">
        <label>显示罗盘</label>
        <label class="toggle">
          <input type="checkbox" ${current.showCompass ? 'checked' : ''}
                 onchange="Settings.set('showCompass', this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="setting-row">
        <label>显示任务追踪</label>
        <label class="toggle">
          <input type="checkbox" ${current.showQuestTracker ? 'checked' : ''}
                 onchange="Settings.set('showQuestTracker', this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </div>
    `;
  }

  return { init, get, set, save, render };
})();
