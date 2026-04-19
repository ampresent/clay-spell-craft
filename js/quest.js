/**
 * quest.js — Quest tracking and progression system (expanded with branching narrative)
 */
const QuestSystem = (() => {
  const quests = [];
  const completedQuests = [];

  function init() {
    // === 第一章：初入泥灵界 ===
    addQuest({
      id: 'first_steps',
      title: '\uD83E\uDDF1 初入泥灵界',
      description: '学会泥灵界的基本操作，了解这个世界的过去',
      chapter: '第一章 · 新生',
      objectives: [
        { id: 'talk_elder', text: '与泥爷爷交谈', done: false },
        { id: 'harvest_clay', text: '采集黏土矿 (按 E)', done: false },
        { id: 'cast_spell', text: '释放一个魔法 (左键)', done: false },
      ],
      reward: '解锁工坊 | 获得《泥灵创世录》',
      lore: '每一个塑灵师的旅程，都从一团黏土开始。泥爷爷会告诉你这个世界的故事——那些被时间掩埋的秘密。',
    });

    // === 第二章：第一个助手 ===
    addQuest({
      id: 'first_assistant',
      title: '\u2728 第一个助手',
      description: '用黏土和魔法创造属于你的第一个伙伴',
      chapter: '第二章 · 创造',
      objectives: [
        { id: 'open_workshop', text: '打开工坊 (Tab)', done: false },
        { id: 'collect_10_clay', text: '收集 10 单位黏土', done: false },
        { id: 'craft_assistant', text: '创造一个助手', done: false },
      ],
      reward: '助手跟随系统',
      lore: '塑灵术的核心，是「用双手赋予黏土灵魂」。你的第一个助手也许笨拙，但它会成长——就像你一样。',
      locked: true,
    });

    // === 第三章：学者的请求 ===
    addQuest({
      id: 'meet_scholar',
      title: '\uD83D\uDD2C 黏土学徒',
      description: '拜访瓷小姐，了解黏土的秘密和暗影腐蚀的真相',
      chapter: '第三章 · 求知',
      objectives: [
        { id: 'talk_scholar', text: '与瓷小姐交谈', done: false },
        { id: 'find_rare_clay', text: '找到一块稀有黏土', done: false },
        { id: 'read_notes', text: '阅读瓷小姐的研究笔记', done: false },
      ],
      reward: '高级配方解锁 | 研究笔记',
      lore: '瓷小姐是泥灵界唯一还在研究暗影腐蚀的学者。她发现了一些令人不安的规律——关于远古巨人呼吸频率的加速……',
      locked: true,
    });

    // === 第四章：四象之力 ===
    addQuest({
      id: 'four_elements',
      title: '\uD83C\uDF00 四象之力',
      description: '掌握四种元素的黏土魔法，创造对应属性的助手',
      chapter: '第四章 · 觉醒',
      objectives: [
        { id: 'fire_assistant', text: '创造火灵助手', done: false },
        { id: 'water_assistant', text: '创造水灵助手', done: false },
        { id: 'wind_assistant', text: '创造风灵助手', done: false },
        { id: 'life_assistant', text: '创造绿灵助手', done: false },
      ],
      reward: '解锁远古黏土巨人副本',
      lore: '四种元素，四种哲学。火说毁灭即重生，水说柔能克刚，风说自由即力量，生说守护即创造。当你理解了四种道理，你才真正踏入了塑灵师的殿堂。',
      locked: true,
    });

    // === 第五章：探索世界 ===
    addQuest({
      id: 'explore_forest',
      title: '\uD83C\uDF3F 萤光之秘',
      description: '深入萤光森林，发现远古神殿的遗迹',
      chapter: '第五章 · 探索',
      objectives: [
        { id: 'enter_forest', text: '到达萤光森林', done: false },
        { id: 'find_shrine', text: '找到远古神殿', done: false },
        { id: 'collect_green', text: '采集绿色生命黏土', done: false },
        { id: 'defeat_guardian', text: '击败黏土傀儡守卫', done: false },
      ],
      reward: '生命系高级配方',
      lore: '萤光森林的深处有一座被藤蔓覆盖的古老神殿——四色学院时代的生命系圣地。传说神殿中保存着治愈一切的终极塑灵术。',
      locked: true,
    });

    addQuest({
      id: 'explore_lake',
      title: '\uD83C\uDF0A 湖底之歌',
      description: '探索魔力湖畔的秘密，聆听水晶莲的歌声',
      objectives: [
        { id: 'reach_lake', text: '到达魔力湖畔', done: false },
        { id: 'find_lily', text: '找到一朵水晶莲', done: false },
        { id: 'listen_song', text: '聆听水晶莲之歌（在湖边等待）', done: false },
        { id: 'collect_blue', text: '采集蓝色水流黏土', done: false },
      ],
      reward: '水系高级配方 | 治愈之歌技能',
      lore: '水晶莲的歌声据说能治愈心灵的创伤。但很少有人知道，那些歌声其实是远古塑灵师的残存记忆——它们通过湖水传到了莲花中。',
      locked: true,
    });

    // === 第六章：真相 ===
    addQuest({
      id: 'ancient_giant',
      title: '\uD83D\uDDFF 远古黏土巨人',
      description: '收集四种魔法黏土，前往远古遗迹探寻巨人的真相',
      chapter: '第六章 · 命运',
      objectives: [
        { id: 'fire_clay', text: '获取火焰黏土', done: false },
        { id: 'water_clay', text: '获取水流黏土', done: false },
        { id: 'wind_clay', text: '获取风暴黏土', done: false },
        { id: 'life_clay', text: '获取生命黏土', done: false },
        { id: 'explore_ruins', text: '探索远古遗迹', done: false },
        { id: 'read_seal', text: '阅读封印记录', done: false },
      ],
      reward: '远古巨人封印的真相',
      lore: '所有线索都指向同一个方向——远古遗迹。黏土战争的导火索、虚空黏土的发现、生系大塑灵师的消失……答案就在那片焦黑的土地上。',
      locked: true,
    });

    // === 终章：抉择 ===
    addQuest({
      id: 'final_choice',
      title: '\uD83D\uDCA1 第四口气息',
      description: '面对最终的抉择——唤醒巨人，还是维持封印？',
      chapter: '终章 · 重塑',
      objectives: [
        { id: 'gather_all', text: '集齐四种魔法黏土', done: false },
        { id: 'confront_shadow', text: '前往暗影沼泽寻找真相', done: false },
        { id: 'make_choice', text: '做出你的抉择', done: false },
      ],
      reward: '???（取决于你的选择）',
      lore: '塑形者吹了四口气息。前三口创造了有形之物。第四口创造了可能性。虚空黏土不是虚无——它是尚未实现的一切。当你面对它时，你会选择实现什么？',
      locked: true,
    });

    // === 支线：商人的秘密 ===
    addQuest({
      id: 'merchant_secret',
      title: '\uD83D\uDC68\u200D\uD83C\uDF3E 阿泥的秘密',
      description: '帮助阿泥了解她体内虚空之力的真相',
      objectives: [
        { id: 'talk_merchant_deep', text: '与阿泥深入交谈', done: false },
        { id: 'find_swamp_sample', text: '在暗影沼泽边缘采集样本', done: false },
        { id: 'bring_to_scholar', text: '将样本交给瓷小姐分析', done: false },
        { id: 'report_findings', text: '将分析结果告诉阿泥', done: false },
      ],
      reward: '阿泥的信任 | 虚空探测能力',
      lore: '阿泥体内流淌着微量的虚空之力。她是「虚空白泥」——一种由虚空黏土和普通黏土混合而生的特殊存在。她不是暗影，也不是光明。她是另一种可能性。',
      locked: true,
    });

    // === 支线：学者的执念 ===
    addQuest({
      id: 'scholar_obsession',
      title: '\uD83D\uDD2C 被抹去的历史',
      description: '帮助瓷小姐解开生系大塑灵师消失之谜',
      objectives: [
        { id: 'talk_scholar_war', text: '与瓷小姐讨论黏土战争', done: false },
        { id: 'find_ruin_tablet', text: '在远古遗迹中找到残碑', done: false },
        { id: 'decode_tablet', text: '解读残碑上的文字', done: false },
        { id: 'reveal_truth', text: '揭开生系大塑灵师的命运', done: false },
      ],
      reward: '完整的历史真相 | 生系秘术',
      lore: '在所有历史记载中，生系大塑灵师的名字、面貌、结局——全部消失了。但真相不会永远被掩埋。在远古遗迹的最深处，有人留下了一块刻意隐藏的石碑……',
      locked: true,
    });
  }

  function addQuest(quest) {
    quest.status = quest.locked ? 'locked' : 'active';
    quests.push(quest);
  }

  function completeObjective(questId, objectiveId) {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.status !== 'active') return;

    const obj = quest.objectives.find(o => o.id === objectiveId);
    if (!obj || obj.done) return;

    obj.done = true;
    UI.notify('\u2705 ' + obj.text);

    if (quest.objectives.every(o => o.done)) {
      quest.status = 'completed';
      completedQuests.push(quest);
      QuestAnim.celebrate(quest.title);
      unlockNextQuests(quest.id);
    }

    updateQuestPanel();
  }

  function unlockNextQuests(completedId) {
    const unlockMap = {
      'first_steps': ['first_assistant', 'explore_forest'],
      'first_assistant': ['meet_scholar'],
      'meet_scholar': ['four_elements', 'scholar_obsession'],
      'four_elements': ['ancient_giant', 'explore_lake'],
      'ancient_giant': ['final_choice'],
      'explore_forest': ['merchant_secret'],
    };

    const toUnlock = unlockMap[completedId] || [];
    toUnlock.forEach(id => {
      const quest = quests.find(q => q.id === id);
      if (quest && quest.status === 'locked') {
        quest.status = 'active';
        UI.notify('\uD83D\uDCCB 新任务: ' + quest.title);
      }
    });
  }

  function getActiveQuests() { return quests.filter(q => q.status === 'active'); }
  function getAllQuests() { return quests; }
  function updateQuestPanel() {}

  return { init, completeObjective, getActiveQuests, getAllQuests };
})();
