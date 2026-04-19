# Clay Spell Craft 🧙‍♂️🧱

一个 WebGL 魔法世界游戏 —— 在这里，所有人都捏黏土、注入魔法，来创造属于自己的魔法助手。

🔗 **在线游玩**: https://github.com/ampresent/clay-spell-craft

## 🌍 游戏世界观

在 **泥灵界 (Clayrealm)** 中，万物皆由魔法黏土构成。这里的住民被称为 **塑灵师 (Claymancers)**，他们通过揉捏、塑造黏土，并注入不同的魔法元素，创造出各种有生命的助手。

## 🎮 操作方式

| 按键 | 操作 |
|------|------|
| WASD | 移动 |
| 鼠标 | 视角 |
| 左键 | 释放魔法 |
| E | 交互（采集/对话） |
| Q | 任务日志 |
| I | 背包 |
| R | 技能面板 |
| P | 配方图鉴 |
| U | 成就面板 |
| Tab | 工坊 |
| F5 | 存档 |
| Esc | 设置 |
| 1-5 | 切换工具 |

## 🧱 核心玩法

- **捏黏土** — 采集魔法黏土矿
- **注入魔法** — 火/水/风/生命四种元素
- **造助手** — 创造可爱的助手跟随你
- **探索世界** — 发现地标、收集品、稀有黏土
- **完成任务** — 推进主线剧情
- **解锁成就** — 挑战各种成就

## 🏗️ 技术架构

```
js/
├── engine.js        # Three.js 渲染引擎、输入系统
├── world.js         # 程序化地形、天空着色器
├── structures.js    # 建筑：工坊、祭坛、树木
├── water.js         # 水域：池塘、溪流、瀑布
├── effects.js       # 粒子：萤火虫、浮尘、符文
├── landmarks.js     # POI地标标记
├── collectibles.js  # 探索收集品
├── clay.js          # 黏土系统、助手AI跟随
├── spell.js         # 魔法粒子特效
├── character.js     # NPC对话树
├── quest.js         # 任务系统（5条主线）
├── achievements.js  # 成就系统（13个成就）
├── recipes.js       # 配方图鉴（9种配方）
├── inventory.js     # 背包系统
├── abilities.js     # 技能树（6个技能）
├── daynight.js      # 昼夜循环
├── weather.js       # 天气系统（晴/雾/雨/魔力）
├── audio.js         # Web Audio 音效
├── save.js          # 存档系统
├── settings.js      # 设置面板
├── ui.js            # HUD、对话、工坊面板
├── minimap.js       # 增强小地图
├── compass.js       # 罗盘指南针
├── notify.js        # 通知队列系统
├── tooltip.js       # 悬浮提示
├── interact-prompt.js # 上下文交互提示
├── screenfx.js      # 屏幕特效（暗角/闪光）
├── particles-bg.js  # 标题画面粒子背景
└── main.js          # 入口、游戏循环
```

## 🎨 特色系统

- 🌅 昼夜循环 + 动态光照
- 🌧️ 天气系统自动切换
- 🎵 Web Audio 程序化音效
- 💾 localStorage 存档
- 🗺️ 实时小地图 + 罗盘
- 📜 任务追踪侧栏
- 🏆 成就系统

## 📜 License

MIT
