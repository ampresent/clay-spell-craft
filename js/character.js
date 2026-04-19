/**
 * character.js — NPCs, dialog trees, quest system (expanded with deep lore)
 */
const Characters = (() => {
  let scene;
  const npcs = [];

  const NPC_DATA = {
    elder: {
      name: '老塑灵师 · 泥爷爷',
      emoji: '\uD83D\uDC74',
      color: 0xa0704a,
      position: [0, 0, -6],
      dialog: [
        {
          id: 'greeting',
          text: '欢迎来到泥灵界，年轻的塑灵师。我是泥爷爷，在这里捏了一辈子的黏土了。',
          next: 'intro',
        },
        {
          id: 'intro',
          text: '在这个世界里，万物皆可由黏土和魔法创造。你看到地上那些发光的黏土矿了吗？走过去按 E 键就能采集。',
          next: 'explain_magic',
        },
        {
          id: 'explain_magic',
          text: '采集到足够的黏土后，按 Tab 键打开工坊，选择一种魔法注入，就能创造出属于你的助手！',
          next: 'tips',
        },
        {
          id: 'tips',
          text: '火焰助手能照明和熔炼，水流助手能灌溉和治疗，风暴助手能飞行和搬运，生命助手能培育植物。选哪个都好，祝你好运！',
          next: 'lore_intro',
          action: 'start_quest',
        },
        {
          id: 'lore_intro',
          text: '对了……在你去冒险之前，我想告诉你一些事情。关于泥灵界的历史，关于塑形者，关于……那个沉睡在地底的巨人。',
          next: 'lore_creation',
        },
        {
          id: 'lore_creation',
          text: '万物诞生之前，宇宙是一片虚空。塑形者从虚空中觉醒，用原始黏土创造了天地。祂吹了三口气息——大地、生灵、创造之力。然后祂就沉入了永恒的安眠。',
          next: 'lore_elements',
        },
        {
          id: 'lore_elements',
          text: '塑形者的力量分化为四种魔力，渗入大地，化为四色黏土矿脉。红色是火的意志，蓝色是水的记忆，白色是风的自由，绿色是生的渴望。而褐色的基础黏土，是传导一切魔力的载体。',
          next: 'lore_war',
        },
        {
          id: 'lore_war',
          text: '很久以前，四色学院——四所研究黏土魔法的学府——爆发了一场可怕的战争。人们叫它「黏土战争」。战争摧毁了我们大部分的成就，无数珍贵的知识在火焰中化为灰烬。',
          next: 'lore_giant',
          mood: 'sad',
        },
        {
          id: 'lore_giant',
          text: '战争之后，一种名为「暗影腐蚀」的灾厄出现了——黑色的黏土开始侵蚀大地。为了遏制它，四位大塑灵师合力封印了一个……东西。一个巨大的、沉睡的黏土人偶。',
          next: 'lore_warning',
        },
        {
          id: 'lore_warning',
          text: '那就是「远古黏土巨人」——塑灵术有史以来最伟大的造物。它的心脏据说由虚空黏土构成。现在，封印正在衰弱……但我不能告诉你太多，至少现在不行。',
          next: 'book_gift',
          mood: 'serious',
        },
        {
          id: 'book_gift',
          text: '拿着这本书吧。《泥灵创世录》——了解我们的过去，才能面对未来。当你准备好了，再来找我，我会告诉你更多。',
          next: null,
          action: 'give_book_creation',
        },
        {
          id: 'talk_war',
          text: '你想知道黏土战争的事？……好吧。那是我年轻时的事了。火系学院主张用武力统一四色教派，水系学院坚持和平谈判，风系学院要求各派独立，生系学院……他们的态度最暧昧。',
          next: 'talk_war_detail',
        },
        {
          id: 'talk_war_detail',
          text: '战争的导火索，据说是有人在暗影沼泽发现了一种前所未见的黑色黏土——虚空黏土。四位大塑灵师对如何处置它产生了不可调和的分歧。争吵变成了冲突，冲突变成了战争。',
          next: 'talk_war_personal',
        },
        {
          id: 'talk_war_personal',
          text: '我在那场战争中失去了太多……老师、同门、挚友。我的右手——你看——至今还会隐隐作痛。暗影腐蚀留下的伤疤，是治愈黏土也消除不了的。',
          next: null,
          mood: 'sad',
        },
        {
          id: 'talk_giant',
          text: '远古黏土巨人……它不是被创造来战斗的。它被创造来「重塑」。如果它完全觉醒，它有能力将整个泥灵界重新化为原始黏土——然后再重新塑形。',
          next: 'talk_giant_seal',
        },
        {
          id: 'talk_giant_seal',
          text: '封印每百年需要加固一次。下次加固的时间……快到了。我是四个守护者之一，代表火系。但我已经太老了，我的力量在衰退。我需要一个继承者。',
          next: null,
          mood: 'serious',
        },
        {
          id: 'talk_fourth_breath',
          text: '你从哪里听到「第四口气息」这个名字的？！……不，我现在不能解释。这不是你该知道的事情——至少不是现在。等你找到了四种魔法黏土，再来问我。',
          next: null,
          mood: 'alarmed',
          condition: 'has_four_elements',
        },
      ],
    },
    merchant: {
      name: '旅行商人 · 阿泥',
      emoji: '\uD83D\uDC68\u200D\uD83C\uDF3E',
      color: 0x6a8a5a,
      position: [8, 0, 4],
      dialog: [
        {
          id: 'greeting',
          text: '嘿嘿，又一个新来的塑灵师！我是阿泥，走遍了泥灵界的每个角落。',
          next: 'world_lore',
        },
        {
          id: 'world_lore',
          text: '你听说了吗？泥灵界的深处，有一个远古的黏土巨人沉睡在那里。传说只要收集齐四种魔法黏土，就能唤醒它……',
          next: 'advice',
        },
        {
          id: 'advice',
          text: '不过别急着去冒险。先把你的助手造好，有了帮手才能走得更远。记住，不同的魔法黏土在不同的地方能找到。',
          next: 'personal_question',
        },
        {
          id: 'personal_question',
          text: '你问我为什么一个人走来走去？嗯……因为我喜欢自由啊。而且，我总能在危险到来之前感觉到——就像鼻子能闻到暴风雨的味道一样。',
          next: 'personal_deep',
        },
        {
          id: 'personal_deep',
          text: '其实……我不完全是人类。我不知道该怎么解释。我的身体里，好像有一部分不属于这个世界。它很安静，但有时候——特别是在暗影沼泽附近——它会变得……活跃。',
          next: 'personal_fear',
          mood: 'conflicted',
        },
        {
          id: 'personal_fear',
          text: '我害怕有一天，那一部分会吞噬掉我。变成我害怕的那种东西——暗影傀儡。没有思想，没有感情，只会本能地攻击一切。',
          next: 'personal_hope',
          mood: 'vulnerable',
        },
        {
          id: 'personal_hope',
          text: '但你来了。你身上有一种……干净的气息。像是新捏的黏土，还没有被任何颜色污染。也许你能帮我找到答案——我到底是什么？',
          next: null,
          mood: 'hopeful',
        },
        {
          id: 'talk_territories',
          text: '你问哪里值得去？工坊谷附近最安全，但也没什么好东西。萤光森林的蘑菇很漂亮，但里面的黏土傀儡可不好惹。魔力湖畔很平静——如果你只是想放松一下。',
          next: 'talk_territories_danger',
        },
        {
          id: 'talk_territories_danger',
          text: '远古遗迹？你疯了吧——哦等等，你是认真的？那里的暗影生物可不是闹着玩的。但如果你真的要去……我会告诉你一条安全的路线。不是因为我关心你——好吧，也许有一点。',
          next: null,
        },
        {
          id: 'talk_swamp',
          text: '暗影沼泽……我不喜欢那里。每次靠近那里，我的皮肤都会发痒，好像有什么东西想要从里面钻出来。上次我路过沼泽边缘，看到一个黑色的人影站在迷雾里。它没有动，只是……看着我。',
          next: 'talk_swamp_detail',
          mood: 'uneasy',
        },
        {
          id: 'talk_swamp_detail',
          text: '那不是暗影傀儡——傀儡不会「看」。那是一个有意识的东西。它看了我很久，然后转身走进了沼泽深处。我发誓，它走的时候……对我点了点头。',
          next: null,
          mood: 'disturbed',
        },
      ],
    },
    scholar: {
      name: '黏土学者 · 瓷小姐',
      emoji: '\uD83D\uDC69\u200D\uD83D\uDD2C',
      color: 0x7a8aaa,
      position: [-6, 0, 8],
      dialog: [
        {
          id: 'greeting',
          text: '你好！我是瓷小姐，专门研究黏土的分子结构和魔法传导效率。',
          next: 'research',
        },
        {
          id: 'research',
          text: '你知道吗？不同颜色的黏土蕴含不同的魔力。褐色黏土最普通但最稳定，红色黏土蕴含火元素，蓝色黏土蕴含水元素……',
          next: 'discovery',
        },
        {
          id: 'discovery',
          text: '最近我发现了一种紫色的稀有黏土，它似乎能同时承载多种魔法！如果能找到它，或许能创造出前所未有的助手……',
          next: 'shop_offer',
          action: 'unlock_recipe',
        },
        {
          id: 'shop_offer',
          text: '对了，我这里有些好东西，要不要看看？按 G 打开商店！',
          next: 'personal_intro',
          action: 'open_shop',
        },
        {
          id: 'personal_intro',
          text: '你大概好奇我为什么一个人待在这里搞研究吧？我出生在澜教——水系教派——的贵族家庭。他们希望我继承家族的水系塑灵术，但我对所有元素都感兴趣。',
          next: 'personal_exile',
        },
        {
          id: 'personal_exile',
          text: '因为我研究了「不该研究的东西」——暗影腐蚀、虚空黏土——家族把我除名了。他们说我玷污了水系的纯洁。哈，纯洁？真理面前哪有什么纯洁不纯洁。',
          next: 'research_dark',
          mood: 'bitter',
        },
        {
          id: 'research_dark',
          text: '但我发现了一些……令人不安的东西。暗影腐蚀的蔓延速度与远古巨人的「呼吸频率」成正比。而巨人的呼吸频率正在逐年加快。',
          next: 'research_warning',
          mood: 'serious',
        },
        {
          id: 'research_warning',
          text: '我估计最多还有15到20年，封印就会完全崩溃。到那时候……整个泥灵界都会被暗影吞噬。除非我们能找到另一种方法——不靠封印，而是从根本上解决虚空黏土的问题。',
          next: 'research_hope',
        },
        {
          id: 'research_hope',
          text: '这就是我研究的目的。不是为了名利，不是为了家族的认可。是因为如果我不做，就没人会做了。',
          next: null,
          mood: 'determined',
        },
        {
          id: 'talk_war',
          text: '黏土战争的真相？教科书上说是因为理念分歧。但我从远古遗迹的残碑上解读出了不同的信息——战争的导火索是虚空黏土的发现。',
          next: 'talk_war_mystery',
        },
        {
          id: 'talk_war_mystery',
          text: '四位大塑灵师对如何处置虚空黏土产生了分歧。火系要销毁，水系要封存，风系要公开。但生系大塑灵师的意见……被刻意抹去了。整块石碑上，关于他的记载都被凿掉了。',
          next: 'talk_war_concern',
        },
        {
          id: 'talk_war_concern',
          text: '在所有历史记载中，生系大塑灵师的名字、面貌、结局——全部消失了。就像他从来没有存在过一样。这不是时间的风化，是有人故意干的。是谁？为什么？这是我现在最想知道的问题。',
          next: null,
          mood: 'intrigued',
        },
        {
          id: 'talk_notes',
          text: '你想看我的研究笔记？好吧，但你得保证不外传。我花了三年追踪暗影腐蚀的蔓延规律。数据不会骗人——但如果让暗影行者知道我在研究这些，他们会来找我麻烦的。',
          next: null,
          action: 'give_book_notes',
        },
        {
          id: 'talk_books',
          text: '我收集了不少关于黏土魔法的书籍和论文。有些是从远古遗迹里抢救出来的残卷，有些是我自己翻译的古文。知识不应该被埋没——即使有人想把它烧掉。',
          next: null,
          action: 'open_library',
        },
      ],
    },
  };

  function init(_scene) {
    scene = _scene;
    createNPCs();
  }

  function createNPCs() {
    Object.entries(NPC_DATA).forEach(([key, data]) => {
      const group = new THREE.Group();

      // Body
      const bodyGeo = new THREE.CapsuleGeometry(0.4, 0.8, 4, 8);
      const bodyMat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.7, metalness: 0.05 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 1; body.castShadow = true;
      group.add(body);

      // Head
      const headMat = new THREE.MeshStandardMaterial({ color: 0xd4a060, roughness: 0.6 });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 8), headMat);
      head.position.y = 1.85; head.castShadow = true;
      group.add(head);

      // Decorations
      if (key === 'elder') {
        const hat = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 6),
          new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.8 }));
        hat.position.y = 2.3; group.add(hat);
      } else if (key === 'scholar') {
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x88aacc, metalness: 0.8, roughness: 0.2 });
        const glassGeo = new THREE.TorusGeometry(0.1, 0.015, 8, 12);
        const lg = new THREE.Mesh(glassGeo, glassMat); lg.position.set(-0.12, 1.88, 0.3); group.add(lg);
        const rg = new THREE.Mesh(glassGeo, glassMat); rg.position.set(0.12, 1.88, 0.3); group.add(rg);
      } else if (key === 'merchant') {
        const pack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.3),
          new THREE.MeshStandardMaterial({ color: 0x6a5a3a, roughness: 0.9 }));
        pack.position.set(0, 1.1, -0.35); group.add(pack);
      }

      // Name plate
      const canvas = document.createElement('canvas');
      canvas.width = 256; canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(10,10,18,0.7)'; ctx.fillRect(0, 0, 256, 64);
      ctx.font = 'bold 22px sans-serif'; ctx.fillStyle = '#e8c87a'; ctx.textAlign = 'center';
      ctx.fillText(data.name, 128, 40);
      const tex = new THREE.CanvasTexture(canvas);
      const plate = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      plate.position.y = 2.8; plate.scale.set(2, 0.5, 1);
      group.add(plate);

      const groundY = World.getGroundHeight(data.position[0], data.position[2]);
      group.position.set(data.position[0], groundY, data.position[2]);
      group.userData.type = 'npc';
      group.userData.npcKey = key;
      group.userData.data = data;
      group.userData.interactable = true;

      scene.add(group);
      npcs.push(group);
    });
  }

  function getNPCs() { return npcs; }

  function update(time) {
    npcs.forEach((npc, i) => {
      npc.children.forEach(child => {
        if (child.isMesh) child.position.y += Math.sin(time * 1.5 + i) * 0.0003;
      });
      npc.rotation.y += Math.sin(time * 0.5 + i * 2) * 0.0005;
    });
  }

  return { init, getNPCs, update, NPC_DATA };
})();
