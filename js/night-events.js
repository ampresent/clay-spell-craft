/**
 * night-events.js — Night-only events, creatures, and story encounters
 */
const NightEvents = (() => {
  let scene;
  let wasNight = false;
  let ghostNPC = null;
  let nightDecorations = [];
  let nightEncounters = [];

  function init(_scene) {
    scene = _scene;
  }

  function update(time) {
    const isNight = DayNight.isNight();

    if (isNight && !wasNight) {
      onNightStart();
    } else if (!isNight && wasNight) {
      onNightEnd();
    }

    wasNight = isNight;

    if (isNight) {
      nightDecorations.forEach(d => {
        if (d.userData.type === 'ghostLight') {
          d.material.opacity = 0.3 + Math.sin(time * 2 + d.userData.offset) * 0.2;
          d.position.y += Math.sin(time + d.userData.offset) * 0.002;
        }
      });

      if (ghostNPC) {
        ghostNPC.children.forEach(c => {
          if (c.isMesh) {
            c.material.opacity = 0.5 + Math.sin(time * 1.5) * 0.2;
          }
        });
        ghostNPC.rotation.y = time * 0.3;
      }
    }
  }

  function onNightStart() {
    // Random night message
    const nightMessages = [
      '🌙 夜幕降临……远处传来低沉的嗡鸣',
      '🌙 月亮升起来了。黏土在月光下微微发光',
      '🌙 夜色如墨。你听到风中夹杂着若有若无的低语',
      '🌙 星星在天空中排列成奇怪的图案。你在它们的排列中看到了……数字？',
      '🌙 夜晚降临。空气中弥漫着一股甜腻的泥土气息',
    ];
    Notify.info(nightMessages[Math.floor(Math.random() * nightMessages.length)]);
    Achievements.track('night');

    // Ghost lights
    for (let i = 0; i < 12; i++) {
      const geo = new THREE.SphereGeometry(0.1 + Math.random() * 0.1, 6, 6);
      const colors = [0x6644aa, 0x4466cc, 0x8844aa];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const mat = new THREE.MeshStandardMaterial({
        color, emissive: color, emissiveIntensity: 0.8,
        transparent: true, opacity: 0.3,
      });
      const light = new THREE.Mesh(geo, mat);
      const x = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;
      const y = World.getGroundHeight(x, z);
      light.position.set(x, y + 1 + Math.random() * 2, z);
      light.userData = { type: 'ghostLight', offset: Math.random() * Math.PI * 2 };
      scene.add(light);
      nightDecorations.push(light);
    }

    // Ghost NPC
    if (!ghostNPC) {
      ghostNPC = createGhostNPC();
      scene.add(ghostNPC);
    } else {
      ghostNPC.visible = true;
    }

    // Spawn rare night encounters (10% chance each)
    spawnNightEncounters();
  }

  function onNightEnd() {
    nightDecorations.forEach(d => {
      scene.remove(d);
      d.geometry.dispose();
      d.material.dispose();
    });
    nightDecorations = [];

    nightEncounters.forEach(e => {
      scene.remove(e);
    });
    nightEncounters = [];

    if (ghostNPC) ghostNPC.visible = false;
  }

  function spawnNightEncounters() {
    // Rare: glowing rune circle on the ground (10% chance)
    if (Math.random() < 0.1) {
      const x = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 30;
      const y = World.getGroundHeight(x, z);
      const runeGroup = new THREE.Group();

      // Outer ring
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2, 0.05, 8, 32),
        new THREE.MeshStandardMaterial({ color: 0xaa44ff, emissive: 0x6622aa, emissiveIntensity: 0.6, transparent: true, opacity: 0.5 })
      );
      ring.rotation.x = Math.PI / 2;
      runeGroup.add(ring);

      // Inner pentagram (simplified as star shape with lines)
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const nextAngle = ((i + 2) % 5 / 5) * Math.PI * 2 - Math.PI / 2;
        const points = [
          new THREE.Vector3(Math.cos(angle) * 1.5, 0.05, Math.sin(angle) * 1.5),
          new THREE.Vector3(Math.cos(nextAngle) * 1.5, 0.05, Math.sin(nextAngle) * 1.5),
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xaa44ff }));
        runeGroup.add(line);
      }

      // Center glow
      const centerGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xff44aa, emissive: 0xff2288, emissiveIntensity: 0.8, transparent: true, opacity: 0.4 })
      );
      centerGlow.position.y = 0.3;
      runeGroup.add(centerGlow);

      runeGroup.position.set(x, y + 0.1, z);
      runeGroup.userData = { type: 'nightRune', nightOnly: true };
      scene.add(runeGroup);
      nightEncounters.push(runeGroup);

      Notify.warning('✨ 你感觉到了一股神秘的魔力波动……');
    }

    // Rare: shadow wraith patrol (8% chance)
    if (Math.random() < 0.08) {
      const wraith = createShadowWraith();
      scene.add(wraith);
      nightEncounters.push(wraith);
      Notify.warning('⚠️ 暗影生物在夜晚苏醒了……小心！');
    }
  }

  function createShadowWraith() {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1a1020, emissive: 0x0a0010, emissiveIntensity: 0.3,
      transparent: true, opacity: 0.7,
    });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1, 4, 8), bodyMat);
    body.position.y = 1.2;
    group.add(body);

    // Red eyes
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1 });
    const le = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), eyeMat);
    le.position.set(-0.15, 2, 0.35); group.add(le);
    const re = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), eyeMat);
    re.position.set(0.15, 2, 0.35); group.add(re);

    const x = -20 + Math.random() * 10;
    const z = -20 + Math.random() * 10;
    const y = World.getGroundHeight(x, z);
    group.position.set(x, y, z);
    group.userData = { type: 'shadowWraith', hp: 50, alive: true };

    return group;
  }

  function createGhostNPC() {
    const group = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x8888cc, emissive: 0x4444aa, emissiveIntensity: 0.3,
      transparent: true, opacity: 0.6,
    });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.35, 0.7, 4, 8), bodyMat);
    body.position.y = 1; group.add(body);

    const headMat = new THREE.MeshStandardMaterial({
      color: 0xaaaadd, emissive: 0x6666aa, emissiveIntensity: 0.3,
      transparent: true, opacity: 0.5,
    });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), headMat);
    head.position.y = 1.8; group.add(head);

    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xccccff, emissiveIntensity: 1 });
    const le = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), eyeMat);
    le.position.set(-0.1, 1.82, 0.25); group.add(le);
    const re = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), eyeMat);
    re.position.set(0.1, 1.82, 0.25); group.add(re);

    // Name plate
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(20,20,40,0.7)'; ctx.fillRect(0, 0, 256, 64);
    ctx.font = 'bold 20px sans-serif'; ctx.fillStyle = '#aaaadd'; ctx.textAlign = 'center';
    ctx.fillText('\uD83D\uDC7B 幽灵行者 · 夜语', 128, 40);
    const tex = new THREE.CanvasTexture(canvas);
    const plate = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
    plate.position.y = 2.6; plate.scale.set(2.5, 0.6, 1);
    group.add(plate);

    const x = -10, z = 15;
    const y = World.getGroundHeight(x, z);
    group.position.set(x, y, z);
    group.userData = {
      type: 'npc', npcKey: 'ghost', interactable: true,
      data: {
        name: '\uD83D\uDC7B 幽灵行者 · 夜语',
        emoji: '\uD83D\uDC7B',
        dialog: [
          {
            id: 'greeting',
            text: '……你能在黑暗中看见我？已经很久没有塑灵师在夜晚出来了。',
            next: 'who_are_you',
          },
          {
            id: 'who_are_you',
            text: '我是夜语。曾经也是一个塑灵师——在黏土战争中死去的塑灵师。我的身体消散了，但我的灵魂黏土——你知道的，每个塑灵师都会在体内积累微量的黏土——它保留了我的意识。',
            next: 'death_memory',
          },
          {
            id: 'death_memory',
            text: '我不记得自己是怎么死的了。只记得最后的画面——天空变成了四种颜色，大地在脚下裂开，有人在喊「快跑」。然后就是漫长的黑暗。',
            next: 'afterlife',
            mood: 'melancholy',
          },
          {
            id: 'afterlife',
            text: '死后，我发现自己能在夜晚凝聚形体。月光让我变得清晰，阳光会灼烧我。所以我只在夜间出现。这里的幽灵之光——那些飘浮的紫色光球——是我同类的碎片。',
            next: 'offer',
          },
          {
            id: 'offer',
            text: '你能帮我一个忙吗？在萤光森林深处，有一棵枯死的古树。我的最后一件黏土造物——一只用四种黏土混合捏制的鸟——就埋在树根下。如果你能把它带给我……也许我能想起更多。',
            next: null,
          },
          {
            id: 'clay_bird_return',
            text: '你找到了它……这只鸟。看，它的翅膀是白色的风暴黏土，胸膛是红色的火焰黏土，尾巴是蓝色的水流黏土，喙是绿色的生命黏土。这是我最后的作品，也是我最好的作品。',
            next: 'memory_flash',
            mood: 'moved',
            condition: 'has_clay_bird',
          },
          {
            id: 'memory_flash',
            text: '触碰它的时候……我想起来了。我的名字。我的老师。我是……我是四色学院风系的学生。我在战争的最后一天，在遗迹里捏了这只鸟。我想让它飞出去，把消息带给我的家人——告诉他们我爱他们。',
            next: 'memory_end',
            mood: 'crying',
          },
          {
            id: 'memory_end',
            text: '它没能飞出去。遗迹塌了。我死了。但……谢谢你让我想起了这些。记住我——我叫岚筝。风系学院第十七届毕业生。我喜欢捏黏土鸟。',
            next: 'farewell',
          },
          {
            id: 'farewell',
            text: '也许有一天，当暗影腐蚀被净化，当世界的伤疤被治愈——我就能安息了。但在那之前，我会继续在夜晚游荡，守护那些和我一样迷失的灵魂。',
            next: null,
            mood: 'peaceful',
          },
          {
            id: 'night_lore',
            text: '你想知道夜晚的秘密？暗影腐蚀在夜间最为活跃。那些被污染的黏土——它们在黑暗中会移动。如果你仔细听，能听到它们在地下蠕动的声音。那是大地在呻吟。',
            next: 'night_lore2',
          },
          {
            id: 'night_lore2',
            text: '但夜晚也不全是坏事。月光中的魔力比阳光更柔和、更细腻。用月光照射的黏土，能承载更精细的魔法——比如我这只鸟。它在白天看起来很普通，但在月光下……你会看到它的翅膀在微微发光。',
            next: null,
          },
          {
            id: 'war_memories',
            text: '黏土战争……我亲眼目睹了最后一战。四位大塑灵师在远古遗迹的中央对峙。四种魔力在空中交织、碰撞、撕裂——整个天空变成了万花筒。',
            next: 'war_end',
            mood: 'haunted',
          },
          {
            id: 'war_end',
            text: '然后一切都安静了。四位大塑灵师——消失了三位。只剩火系的大塑灵师活着走出来。但他什么也不肯说。他只是坐在遗迹的废墟上，用颤抖的手捏着一团黏土——一遍又一遍地捏，永远不成形。',
            next: null,
            mood: 'grief',
          },
        ],
      },
    };

    return group;
  }

  function getGhostNPC() { return ghostNPC; }

  return { init, update, getGhostNPC };
})();
