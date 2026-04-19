/**
 * recipes.js — Crafting recipe system with tiers
 */
const Recipes = (() => {
  const recipes = [
    {
      id: 'fire_assistant',
      name: '炎灵助手',
      emoji: '🔥',
      clay: 10,
      spell: 'fire',
      tier: 1,
      desc: '忠诚的火焰助手',
    },
    {
      id: 'water_assistant',
      name: '水灵助手',
      emoji: '💧',
      clay: 10,
      spell: 'water',
      tier: 1,
      desc: '柔和的水流助手',
    },
    {
      id: 'wind_assistant',
      name: '风灵助手',
      emoji: '🌪️',
      clay: 10,
      spell: 'wind',
      tier: 1,
      desc: '自由的风暴助手',
    },
    {
      id: 'life_assistant',
      name: '绿灵助手',
      emoji: '🌿',
      clay: 10,
      spell: 'life',
      tier: 1,
      desc: '温柔的生命助手',
    },
    {
      id: 'fire_golem',
      name: '熔岩傀儡',
      emoji: '🌋',
      clay: 25,
      rareClay: { fireClay: 5 },
      spell: 'fire',
      tier: 2,
      desc: '由火焰黏土铸成的强力傀儡',
      locked: true,
    },
    {
      id: 'water_sprite',
      name: '水精精灵',
      emoji: '🧜',
      clay: 25,
      rareClay: { waterClay: 5 },
      spell: 'water',
      tier: 2,
      desc: '能在水中自由穿行的精灵',
      locked: true,
    },
    {
      id: 'storm_eagle',
      name: '雷鹰',
      emoji: '🦅',
      clay: 25,
      rareClay: { windClay: 5 },
      spell: 'wind',
      tier: 2,
      desc: '翱翔天际的雷电之鹰',
      locked: true,
    },
    {
      id: 'forest_guardian',
      name: '森林守护者',
      emoji: '🌳',
      clay: 25,
      rareClay: { lifeClay: 5 },
      spell: 'life',
      tier: 2,
      desc: '古老森林意志的化身',
      locked: true,
    },
    {
      id: 'clay_titan',
      name: '黏土泰坦',
      emoji: '🗿',
      clay: 50,
      rareClay: { fireClay: 10, waterClay: 10, windClay: 10, lifeClay: 10 },
      spell: 'life',
      tier: 3,
      desc: '远古黏土巨人的微型复制品',
      locked: true,
    },
  ];

  function getAvailable() {
    return recipes.filter(r => !r.locked);
  }

  function getAll() {
    return recipes;
  }

  function unlock(recipeId) {
    const r = recipes.find(r => r.id === recipeId);
    if (r) {
      r.locked = false;
      Notify.quest(`🔓 新配方解锁: ${r.name}`);
    }
  }

  function canCraft(recipe) {
    if (recipe.locked) return false;
    if (Inventory.get('clay') < recipe.clay) return false;
    if (recipe.rareClay) {
      for (const [id, amount] of Object.entries(recipe.rareClay)) {
        if (Inventory.get(id) < amount) return false;
      }
    }
    return true;
  }

  function render() {
    const container = document.getElementById('recipe-list');
    if (!container) return;
    container.innerHTML = '';

    recipes.forEach(r => {
      const div = document.createElement('div');
      div.className = `recipe-item ${r.locked ? 'locked' : ''} tier-${r.tier}`;

      let reqs = `${r.clay} 黏土`;
      if (r.rareClay) {
        const names = { fireClay: '火黏土', waterClay: '水黏土', windClay: '风黏土', lifeClay: '生黏土' };
        Object.entries(r.rareClay).forEach(([id, amt]) => {
          reqs += ` + ${amt} ${names[id] || id}`;
        });
      }

      const tierStars = '⭐'.repeat(r.tier);

      div.innerHTML = `
        <div class="recipe-header">
          <span class="recipe-emoji">${r.locked ? '❓' : r.emoji}</span>
          <span class="recipe-name">${r.locked ? '???' : r.name}</span>
          <span class="recipe-tier">${tierStars}</span>
        </div>
        <div class="recipe-desc">${r.locked ? '未解锁' : r.desc}</div>
        <div class="recipe-reqs">需要: ${reqs}</div>
      `;

      if (!r.locked && canCraft(r)) {
        div.style.cursor = 'pointer';
        div.style.borderColor = 'rgba(200,122,74,0.3)';
      }

      container.appendChild(div);
    });
  }

  return { getAvailable, getAll, unlock, canCraft, render };
})();
