/**
 * abilities.js — Player abilities / skill tree
 */
const Abilities = (() => {
  const skills = {
    moldSpeed: { name: '快手塑形', desc: '采集黏土速度+50%', level: 0, maxLevel: 3, icon: '🤲', unlocked: true },
    manaPool: { name: '魔力源泉', desc: '最大魔力+30', level: 0, maxLevel: 5, icon: '💎', unlocked: true },
    spellPower: { name: '魔法增幅', desc: '魔法效果+25%', level: 0, maxLevel: 3, icon: '⚡', unlocked: false },
    claySight: { name: '黏土感知', desc: '小地图标记黏土矿位置', level: 0, maxLevel: 1, icon: '👁️', unlocked: false },
    assistantBoost: { name: '助手强化', desc: '助手移动速度+30%', level: 0, maxLevel: 3, icon: '🏃', unlocked: false },
    rareHarvest: { name: '稀有发掘', desc: '采集时有概率获得稀有黏土', level: 0, maxLevel: 3, icon: '🌟', unlocked: false },
  };

  function unlock(skillId) {
    if (skills[skillId]) {
      skills[skillId].unlocked = true;
      UI.notify(`🔓 解锁技能: ${skills[skillId].name}`);
    }
  }

  function upgrade(skillId) {
    const s = skills[skillId];
    if (!s || !s.unlocked || s.level >= s.maxLevel) return false;
    s.level++;
    UI.notify(`⬆️ ${s.name} Lv.${s.level}`);
    return true;
  }

  function getLevel(skillId) {
    return skills[skillId] ? skills[skillId].level : 0;
  }

  function getAll() { return skills; }

  function render() {
    const container = document.getElementById('abilities-grid');
    if (!container) return;
    container.innerHTML = '';

    Object.entries(skills).forEach(([id, skill]) => {
      const div = document.createElement('div');
      div.className = `ability-slot ${skill.unlocked ? 'unlocked' : 'locked'} ${skill.level >= skill.maxLevel ? 'maxed' : ''}`;

      let stars = '';
      for (let i = 0; i < skill.maxLevel; i++) {
        stars += i < skill.level ? '★' : '☆';
      }

      div.innerHTML = `
        <span class="ability-icon">${skill.unlocked ? skill.icon : '🔒'}</span>
        <span class="ability-name">${skill.name}</span>
        <span class="ability-level">${stars}</span>
        <span class="ability-desc">${skill.desc}</span>
      `;

      if (skill.unlocked && skill.level < skill.maxLevel) {
        div.addEventListener('click', () => {
          if (upgrade(id)) render();
        });
      }

      container.appendChild(div);
    });
  }

  return { unlock, upgrade, getLevel, getAll, render };
})();
