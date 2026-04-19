/**
 * achievements.js — Achievement / milestone system
 */
const Achievements = (() => {
  const achievements = [
    { id: 'first_steps', name: '初来乍到', desc: '踏入泥灵界', icon: '👣', done: false, hidden: false },
    { id: 'first_harvest', name: '黏土新手', desc: '第一次采集黏土', icon: '🧱', done: false, hidden: false },
    { id: 'first_spell', name: '魔法入门', desc: '第一次释放魔法', icon: '✨', done: false, hidden: false },
    { id: 'first_craft', name: '造物主', desc: '创造第一个助手', icon: '🎨', done: false, hidden: false },
    { id: 'collect_50', name: '黏土收藏家', desc: '累计采集50单位黏土', icon: '📦', done: false, hidden: false },
    { id: 'all_spells', name: '元素精通', desc: '使用过所有4种魔法', icon: '🌀', done: false, hidden: false },
    { id: 'meet_all', name: '社交达人', desc: '与所有NPC交谈', icon: '🤝', done: false, hidden: false },
    { id: 'night_owl', name: '夜猫子', desc: '在夜晚探索世界', icon: '🦉', done: false, hidden: false },
    { id: 'rain_walker', name: '雨中漫步', desc: '在雨中行走', icon: '🌧️', done: false, hidden: false },
    { id: 'four_assistants', name: '助手军团', desc: '同时拥有4个助手', icon: '👥', done: false, hidden: false },
    { id: 'explorer', name: '探险家', desc: '发现所有地标', icon: '🗺️', done: false, hidden: false },
    { id: 'master_crafter', name: '大师工匠', desc: '创造一个2级助手', icon: '🏆', done: false, hidden: false },
    { id: 'hidden_rainbow', name: '🌈 彩虹黏土', desc: '???', icon: '🌈', done: false, hidden: true },
  ];

  const spellTracker = new Set();
  const npcTracker = new Set();
  let totalHarvested = 0;

  function track(event, data) {
    switch (event) {
      case 'harvest':
        totalHarvested++;
        if (totalHarvested === 1) complete('first_harvest');
        if (totalHarvested >= 50) complete('collect_50');
        break;
      case 'spell':
        spellTracker.add(data);
        if (spellTracker.size >= 4) complete('all_spells');
        break;
      case 'craft':
        complete('first_craft');
        break;
      case 'npc':
        npcTracker.add(data);
        if (npcTracker.size >= 3) complete('meet_all');
        break;
      case 'night':
        complete('night_owl');
        break;
      case 'rain':
        complete('rain_walker');
        break;
      case 'assistants':
        if (data >= 4) complete('four_assistants');
        break;
    }
  }

  function complete(id) {
    const a = achievements.find(a => a.id === id);
    if (!a || a.done) return;
    a.done = true;
    Notify.success(`🏆 成就解锁: ${a.name}`);
    AudioSystem.playSFX('quest');
  }

  function getAll() { return achievements; }

  function getCount() {
    return achievements.filter(a => a.done).length;
  }

  function render() {
    const container = document.getElementById('achievements-grid');
    if (!container) return;
    container.innerHTML = '';

    achievements.forEach(a => {
      const div = document.createElement('div');
      div.className = `achievement-slot ${a.done ? 'done' : ''} ${a.hidden && !a.done ? 'hidden-ach' : ''}`;

      div.innerHTML = `
        <span class="ach-icon">${a.done ? a.icon : (a.hidden ? '❓' : a.icon)}</span>
        <span class="ach-name">${a.hidden && !a.done ? '???' : a.name}</span>
        <span class="ach-desc">${a.hidden && !a.done ? '条件未明' : a.desc}</span>
        ${a.done ? '<span class="ach-check">✅</span>' : ''}
      `;
      container.appendChild(div);
    });
  }

  return { track, complete, getAll, getCount, render };
})();
