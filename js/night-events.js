/**
 * night-events.js — Night-only events and creatures
 */
const NightEvents = (() => {
  let scene;
  let wasNight = false;
  let ghostNPC = null;
  let nightDecorations = [];

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

    // Animate night decorations
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
    Notify.info('🌙 夜幕降临……你感觉到了不同寻常的气息');
    Achievements.track('night');

    // Ghost lights
    for (let i = 0; i < 12; i++) {
      const geo = new THREE.SphereGeometry(0.1 + Math.random() * 0.1, 6, 6);
      const colors = [0x6644aa, 0x4466cc, 0x8844aa];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.3,
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

    // Night ghost NPC
    if (!ghostNPC) {
      ghostNPC = createGhostNPC();
      scene.add(ghostNPC);
    } else {
      ghostNPC.visible = true;
    }
  }

  function onNightEnd() {
    // Remove night decorations
    nightDecorations.forEach(d => {
      scene.remove(d);
      d.geometry.dispose();
      d.material.dispose();
    });
    nightDecorations = [];

    if (ghostNPC) {
      ghostNPC.visible = false;
    }
  }

  function createGhostNPC() {
    const group = new THREE.Group();

    const bodyGeo = new THREE.CapsuleGeometry(0.35, 0.7, 4, 8);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x8888cc,
      emissive: 0x4444aa,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.6,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1;
    group.add(body);

    const headGeo = new THREE.SphereGeometry(0.3, 8, 6);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xaaaadd,
      emissive: 0x6666aa,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.5,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.8;
    group.add(head);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.06, 6, 6);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xccccff,
      emissiveIntensity: 1,
    });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.1, 1.82, 0.25);
    group.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.1, 1.82, 0.25);
    group.add(rightEye);

    // Name plate
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(20,20,40,0.7)';
    ctx.fillRect(0, 0, 256, 64);
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#aaaadd';
    ctx.textAlign = 'center';
    ctx.fillText('👻 幽灵行者 · 夜语', 128, 40);
    const tex = new THREE.CanvasTexture(canvas);
    const plateMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const plate = new THREE.Sprite(plateMat);
    plate.position.y = 2.6;
    plate.scale.set(2.5, 0.6, 1);
    group.add(plate);

    const x = -10, z = 15;
    const y = World.getGroundHeight(x, z);
    group.position.set(x, y, z);
    group.userData = {
      type: 'npc',
      npcKey: 'ghost',
      interactable: true,
      data: {
        name: '幽灵行者 · 夜语',
        emoji: '👻',
        dialog: [
          { id: 'greeting', text: '……你能在黑暗中看见我？已经很久没有塑灵师在夜晚出来了。', next: 'secret' },
          { id: 'secret', text: '这个世界远比你看到的更深邃。在黑暗中，黏土会显露出不同的形态……也许你可以收集一些暗影黏土。', next: 'reward' },
          { id: 'reward', text: '如果你能在天亮之前找到3个幽灵之光带给我，我会教你一个古老的配方。', next: null },
        ],
      },
    };

    return group;
  }

  function getGhostNPC() { return ghostNPC; }

  return { init, update, getGhostNPC };
})();
