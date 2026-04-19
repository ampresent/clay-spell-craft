/**
 * player.js — Player stats, level, experience
 */
const Player = (() => {
  let level = 1;
  let xp = 0;
  let xpToNext = 50;
  let maxHp = 100;
  let hp = 100;
  let attackPower = 10;
  let defense = 5;

  function addXP(amount) {
    xp += amount;
    while (xp >= xpToNext) {
      xp -= xpToNext;
      level++;
      xpToNext = Math.floor(xpToNext * 1.5);
      onLevelUp();
    }
    updateHUD();
  }

  function onLevelUp() {
    maxHp += 10;
    hp = maxHp;
    attackPower += 2;
    defense += 1;
    Notify.success(`🎉 升级！等级 ${level}！HP+10 攻击+2 防御+1`);
    AudioSystem.playSFX('quest');
    ScreenFX.flash('rgba(255,215,0,0.15)', 500);

    // Unlock recipes at certain levels
    if (level === 3) {
      Recipes.unlock('fire_golem');
      Recipes.unlock('water_sprite');
    }
    if (level === 5) {
      Recipes.unlock('storm_eagle');
      Recipes.unlock('forest_guardian');
    }
    if (level === 8) {
      Recipes.unlock('clay_titan');
    }

    // Unlock abilities
    if (level === 2) Abilities.unlock('spellPower');
    if (level === 3) Abilities.unlock('claySight');
    if (level === 4) Abilities.unlock('assistantBoost');
    if (level === 5) Abilities.unlock('rareHarvest');
  }

  function takeDamage(amount) {
    const reduced = Math.max(1, amount - defense);
    hp = Math.max(0, hp - reduced);
    ScreenFX.damageFlash();
    if (hp <= 0) {
      // Respawn
      setTimeout(() => {
        hp = maxHp;
        const camera = Engine.getCamera();
        camera.position.set(0, 2, 10);
        Notify.warning('💀 你在工坊附近苏醒了……');
        updateHUD();
      }, 500);
    }
    updateHUD();
  }

  function heal(amount) {
    hp = Math.min(maxHp, hp + amount);
    updateHUD();
  }

  function updateHUD() {
    // Update mana bar to show HP
    const fill = document.getElementById('mana-fill');
    if (fill) fill.style.width = (hp / maxHp * 100) + '%';
    const text = document.getElementById('mana-text');
    if (text) text.textContent = `${hp}/${maxHp}`;

    // Update player name with level
    const nameEl = document.getElementById('player-name');
    if (nameEl) nameEl.textContent = `塑灵师 Lv.${level}`;
  }

  function getLevel() { return level; }
  function getHP() { return hp; }
  function getMaxHP() { return maxHp; }
  function getAttack() { return attackPower; }

  return {
    addXP, takeDamage, heal, updateHUD,
    getLevel, getHP, getMaxHP, getAttack,
  };
})();
