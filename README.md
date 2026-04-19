# Clay Spell Craft 🧙‍♂️🧱

一个 WebGL 魔法世界游戏 —— 在这里，所有人都捏黏土、注入魔法，来创造属于自己的魔法助手。

🔗 **仓库**: https://github.com/ampresent/clay-spell-craft

## 🌍 泥灵界

在 **泥灵界 (Clayrealm)** 中，万物皆由魔法黏土构成。作为 **塑灵师 (Claymancer)**，你将探索这个世界，采集黏土、释放魔法、创造助手、战斗怪物、挑战Boss。

## 🎮 操作

| 按键 | 功能 | 按键 | 功能 |
|------|------|------|------|
| WASD | 移动 | Q | 任务日志 |
| 鼠标 | 视角 | I | 背包 |
| 左键 | 施法/攻击 | R | 技能 |
| E | 交互 | P | 配方图鉴 |
| 1-5 | 切换魔法 | U | 成就 |
| Tab | 工坊 | T | 统计 |
| F | 商店 | M | 世界地图 |
| F5 | 存档 | Esc | 设置 |

## 🎯 核心系统

### 世界探索
- 🗺️ 7个区域：工坊区/萤光森林/魔力湖畔/远古遗迹/水晶谷/风暴高地/暗影沼泽
- 📍 6个地标 + 5个隐藏地点
- 💎 20个收集品散布世界
- 🌅 昼夜循环 + 4种天气

### 战斗系统
- ⚔️ 5种怪物：泥浆史莱姆/火焰游魂/风暴幽光/黏土傀儡/暗影黏土
- 👑 2个Boss：黏土之王(Lv.5)/水晶龙(Lv.8)
- 🎯 锥形瞄准 + 伤害计算
- 💀 死亡重生机制

### 创造系统
- 🧱 黏土采集 → 工坊创造 → 助手跟随
- 📋 9种配方（3级进阶）
- 🔥💧🌪️🌿 4种魔法元素
- 🤖 助手AI自动跟随

### 成长系统
- ⭐ 等级/经验/升级
- ⚡ 6个技能树
- 🏆 13个成就（含隐藏）
- 🐰🦊🟢 3种宠物

### 经济系统
- 🏪 NPC商店（5种商品）
- 💎 水晶货币
- 🎒 背包管理

### 社交系统
- 👴 泥爷爷（新手引导）
- 🧑‍🌾 阿泥（商人+世界传说）
- 👩‍🔬 瓷小姐（黏土研究）
- 👻 夜语（夜间幽灵NPC）

## 🏗️ 技术栈

- **渲染**: Three.js (WebGL)
- **音频**: Web Audio API（程序化音效+音乐）
- **存档**: localStorage
- **无依赖**: 纯前端，CDN加载Three.js

## 📁 项目结构 (42个JS模块)

```
核心: engine.js, main.js, player.js
世界: world.js, structures.js, water.js, zones.js
环境: effects.js, landmarks.js, collectibles.js, secrets.js
战斗: enemies.js, bosses.js
角色: character.js, night-events.js, pets.js
创造: clay.js, spell.js, recipes.js
成长: abilities.js, achievements.js, stats.js
经济: inventory.js, shop.js
世界: daynight.js, weather.js
任务: quest.js
音频: audio.js, music.js
界面: ui.js, minimap.js, compass.js, worldmap.js,
      notify.js, tooltip.js, interact-prompt.js,
      screenfx.js, trail.js, particles-bg.js
数据: save.js, settings.js
```

## 📊 代码统计

- **25 个 commit**
- **42 个 JS 模块**
- **~7800 行代码**

## 📜 License

MIT
