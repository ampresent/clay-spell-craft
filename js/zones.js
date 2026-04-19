/**
 * zones.js — World zone detection and area effects (expanded with rich descriptions)
 */
const Zones = (() => {
  const zones = [
    {
      id: 'workshop', name: '工坊谷', center: [0, 0], radius: 12, music: 'overworld',
      desc: '泥灵界中心的宜居谷地，也是新晋塑灵师的训练基地',
      lore: '谷地周围环绕着低矮的黏土山丘，山丘上长满了散发着清香的黏土草。泥爷爷的工坊就坐落在谷地的中央，那座歪歪斜斜的小屋已经在这里矗立了五十年。每到清晨，工坊的烟囱里会升起淡紫色的烟——那是泥爷爷在调配新的黏土配方。',
      atmosphere: '阳光温暖，微风轻拂，黏土草的清香弥漫在空气中',
    },
    {
      id: 'forest', name: '萤光森林', center: [-15, 12], radius: 10, music: 'night',
      desc: '发光蘑菇与萤火虫的古老森林',
      lore: '工坊谷东北方的一片古老森林。这里的蘑菇和苔藓都蕴含微量魔力，入夜后会发出柔和的蓝绿色光芒，如同地上的星空。森林深处有一座被藤蔓覆盖的古老神殿——四色学院时代的生命系圣地。据说在月圆之夜，神殿的石门会自行打开，传出悠远的吟唱声。',
      atmosphere: '空气中弥漫着蘑菇的甜香，脚下的苔藓在你走过时发出微弱的荧光',
    },
    {
      id: 'lake', name: '魔力湖畔', center: [-12, -5], radius: 8, music: 'overworld',
      desc: '平静的魔法池塘，湖底蕴含蓝色黏土矿脉',
      lore: '工坊谷西北方的一片宁静湖泊。湖水呈现淡蓝色，是因为湖底蕴含大量蓝色黏土矿脉。湖中生长着会唱歌的水晶莲——那些半透明的花朵在月光下会发出清脆的音符。渔夫们说，水晶莲的歌声是远古塑灵师的残存记忆，通过湖水传到了莲花中。',
      atmosphere: '湖水泛着淡蓝色的微光，远处传来水晶莲清脆的歌声',
    },
    {
      id: 'ruins', name: '远古遗迹', center: [-25, -20], radius: 8, music: 'dungeon',
      desc: '黏土战争的主战场，危险的远古废墟',
      lore: '位于泥灵界最西端的一片废墟，是黏土战争的主战场。残破的巨型黏土造物散布在焦黑的土地上——有的像折断的手臂伸向天空，有的像蜷缩的胎儿埋入土中。时间在这里凝固了，空气中弥漫着烧焦黏土的气味。遗迹深处保存着战争前的塑灵术秘籍——如果有人能活着带出来的话。',
      atmosphere: '焦黑的土地散发着烧灼的气味，远处暗影在废墟间游荡',
    },
    {
      id: 'crystal', name: '水晶谷', center: [20, 15], radius: 10, music: 'dungeon',
      desc: '闪耀的水晶矿脉，风系黏土的宝库',
      lore: '工坊谷东北远方的一条峡谷，谷壁上生长着巨大的水晶簇。这些水晶是高浓度魔力凝结而成的产物，可以用来强化黏土造物的能力。风系大塑灵师曾在峡谷中留下他的最终杰作——一座悬浮在半空中的水晶塔，至今仍在缓缓旋转，折射出彩虹般的光芒。',
      atmosphere: '水晶在阳光下闪耀七彩光芒，峡谷中的风声像是远古的低语',
    },
    {
      id: 'highland', name: '风暴高地', center: [15, -15], radius: 12, music: 'overworld',
      desc: '浮空岛屿下的强风高原',
      lore: '一片被强风席卷的高原地带。高地之上，几座小岛漂浮在空中——这是远古塑灵师用风系黏土创造的奇迹。最高的浮空岛上有一座古老的观测站，据说能看到整个泥灵界的全貌。但要到达那里，需要先找到通往浮空岛的风之阶梯——它只在特定的天气条件下出现。',
      atmosphere: '强风呼啸着掠过你的面庞，头顶的浮空岛投下巨大的阴影',
    },
    {
      id: 'swamp', name: '暗影沼泽', center: [-8, -25], radius: 9, music: 'night',
      desc: '弥漫暗影气息的危险沼泽',
      lore: '泥灵界南方的一片沼泽地，地面被黑色黏土覆盖，散发着令人不安的气息。这里是暗影腐蚀最严重的区域——普通黏土在这里会被迅速污染，变成黏稠的黑色物质。沼泽深处有一座倒置的塔——塔尖朝下插入泥中，塔基朝上指向天空。没有人知道它是怎么变成这样的，也没有人敢靠近去调查。',
      atmosphere: '黑色的雾气缠绕着你的脚踝，远处传来低沉的、类似心跳的声音',
    },
    {
      id: 'wilderness', name: '荒野', center: [0, 0], radius: 999, music: 'overworld',
      desc: '泥灵界的广袤荒野地带',
      lore: '泥灵界的大部分区域是无人居住的荒野。褐色的黏土草覆盖着起伏的丘陵，偶尔能看到远古时代遗留的黏土碎片。这些碎片已经失去了魔力，但如果你仔细观察，仍然能辨认出它们曾经的形状——一只手、一只翅膀、一个微笑的嘴唇。它们是塑灵术鼎盛时代的遗物，也是对逝去荣光的无声纪念。',
      atmosphere: '广袤的褐色荒野延伸到地平线，风中传来黏土草沙沙的声响',
    },
  ];

  let currentZone = null;
  let zoneChangeCallback = null;

  function init(callback) {
    zoneChangeCallback = callback;
  }

  function update(playerPos) {
    let newZone = null;
    for (const zone of zones) {
      const dx = playerPos.x - zone.center[0];
      const dz = playerPos.z - zone.center[1];
      if (Math.sqrt(dx * dx + dz * dz) < zone.radius) {
        newZone = zone;
        break;
      }
    }
    if (!newZone) newZone = zones[zones.length - 1]; // wilderness fallback

    if (!currentZone || currentZone.id !== newZone.id) {
      currentZone = newZone;
      if (zoneChangeCallback) zoneChangeCallback(newZone);
    }
  }

  function getCurrentZone() { return currentZone; }
  function getZones() { return zones; }

  return { init, update, getCurrentZone, getZones };
})();
