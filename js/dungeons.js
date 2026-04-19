/**
 * dungeons.js — Dungeon entrances and zone system
 */
const Dungeons = (() => {
  let scene;
  const dungeons = [];
  const portals = [];

  function init(_scene) {
    scene = _scene;
    createDungeonEntrance();
    createPortal();
    createDangerZones();
  }

  function createDungeonEntrance() {
    // Ancient cave entrance
    const group = new THREE.Group();
    group.position.set(-25, 0, -20);

    const baseY = World.getGroundHeight(-25, -20);

    // Arch
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x5a5a6a, roughness: 0.8, metalness: 0.15, flatShading: true,
    });

    // Left pillar
    const pillarGeo = new THREE.BoxGeometry(1, 4, 1);
    const leftPillar = new THREE.Mesh(pillarGeo, archMat);
    leftPillar.position.set(-1.5, baseY + 2, 0);
    leftPillar.castShadow = true;
    group.add(leftPillar);

    // Right pillar
    const rightPillar = new THREE.Mesh(pillarGeo, archMat);
    rightPillar.position.set(1.5, baseY + 2, 0);
    rightPillar.castShadow = true;
    group.add(rightPillar);

    // Top bar
    const topGeo = new THREE.BoxGeometry(4, 0.8, 1.2);
    const top = new THREE.Mesh(topGeo, archMat);
    top.position.set(0, baseY + 4.2, 0);
    top.castShadow = true;
    group.add(top);

    // Rune glow on arch
    const runeCanvas = document.createElement('canvas');
    runeCanvas.width = 256;
    runeCanvas.height = 64;
    const ctx = runeCanvas.getContext('2d');
    ctx.fillStyle = '#e8c87a';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚠ 远古遗迹 ⚠', 128, 40);
    const runeTex = new THREE.CanvasTexture(runeCanvas);
    const runeMat = new THREE.SpriteMaterial({ map: runeTex, transparent: true });
    const runeSprite = new THREE.Sprite(runeMat);
    runeSprite.position.set(0, baseY + 5.5, 0);
    runeSprite.scale.set(3, 0.75, 1);
    group.add(runeSprite);

    // Blue fire
    const fireGeo = new THREE.ConeGeometry(0.2, 0.6, 5);
    const fireMat = new THREE.MeshStandardMaterial({
      color: 0x4488ff, emissive: 0x2266cc, emissiveIntensity: 1,
      transparent: true, opacity: 0.7,
    });
    const leftFire = new THREE.Mesh(fireGeo, fireMat);
    leftFire.position.set(-1.5, baseY + 4.8, 0);
    group.add(leftFire);

    const rightFire = new THREE.Mesh(fireGeo.clone(), fireMat.clone());
    rightFire.position.set(1.5, baseY + 4.8, 0);
    group.add(rightFire);

    // Point light
    const light = new THREE.PointLight(0x4488ff, 0.8, 10);
    light.position.set(0, baseY + 4, 0);
    group.add(light);

    // Ground decoration
    const groundGeo = new THREE.RingGeometry(2, 3, 16);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x4488ff, emissive: 0x2244aa, emissiveIntensity: 0.2,
      transparent: true, opacity: 0.3, side: THREE.DoubleSide,
    });
    const groundRing = new THREE.Mesh(groundGeo, groundMat);
    groundRing.rotation.x = -Math.PI / 2;
    groundRing.position.y = baseY + 0.05;
    group.add(groundRing);

    group.userData = {
      type: 'dungeon',
      name: '远古遗迹',
      desc: '传说中沉睡着黏土巨人的地方……',
      requiredLevel: 1,
    };

    scene.add(group);
    dungeons.push(group);
  }

  function createPortal() {
    // Magical portal
    const portalGeo = new THREE.TorusGeometry(1.5, 0.1, 8, 24);
    const portalMat = new THREE.MeshStandardMaterial({
      color: 0xaa44ff,
      emissive: 0x8822cc,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.7,
    });
    const portal = new THREE.Mesh(portalGeo, portalMat);

    const x = 22, z = 18;
    const y = World.getGroundHeight(x, z);
    portal.position.set(x, y + 2, z);
    portal.userData = {
      type: 'portal',
      name: '魔力传送门',
      destination: '深邃洞穴',
      floatOffset: 0,
    };
    scene.add(portal);

    // Inner swirl
    const swirlGeo = new THREE.CircleGeometry(1.3, 16);
    const swirlMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vec2 center = vUv - 0.5;
          float angle = atan(center.y, center.x);
          float dist = length(center);
          float spiral = sin(angle * 3.0 + dist * 10.0 - uTime * 3.0);
          vec3 col = mix(vec3(0.5, 0.2, 1.0), vec3(0.3, 0.5, 1.0), spiral * 0.5 + 0.5);
          float alpha = smoothstep(0.7, 0.3, dist) * 0.5;
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    const swirl = new THREE.Mesh(swirlGeo, swirlMat);
    swirl.position.set(x, y + 2, z + 0.05);
    swirl.userData.type = 'portalSwirl';
    swirl.userData.shaderMat = swirlMat;
    scene.add(swirl);

    // Light
    const light = new THREE.PointLight(0xaa44ff, 0.6, 8);
    light.position.set(x, y + 2, z);
    scene.add(light);

    portals.push({ ring: portal, swirl, light });
  }

  function createDangerZones() {
    // Lava/mud pits
    const dangerPositions = [
      { pos: [-30, 5], radius: 4, type: 'lava' },
      { pos: [25, -10], radius: 3, type: 'mud' },
      { pos: [-8, -25], radius: 3.5, type: 'lava' },
    ];

    dangerPositions.forEach(dz => {
      const y = World.getGroundHeight(dz.pos[0], dz.pos[1]);
      const geo = new THREE.CircleGeometry(dz.radius, 16);
      const color = dz.type === 'lava' ? 0xff4400 : 0x6a5a3a;
      const emissive = dz.type === 'lava' ? 0xaa2200 : 0x3a2a1a;
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      });
      const zone = new THREE.Mesh(geo, mat);
      zone.rotation.x = -Math.PI / 2;
      zone.position.set(dz.pos[0], y + 0.03, dz.pos[1]);
      zone.userData = {
        type: 'dangerZone',
        zoneType: dz.type,
        radius: dz.radius,
        damage: dz.type === 'lava' ? 10 : 3,
      };
      scene.add(zone);

      // Bubbles
      for (let i = 0; i < 5; i++) {
        const bGeo = new THREE.SphereGeometry(0.1 + Math.random() * 0.15, 6, 6);
        const bMat = new THREE.MeshStandardMaterial({
          color: dz.type === 'lava' ? 0xff6600 : 0x8a7a5a,
          emissive: dz.type === 'lava' ? 0xff4400 : 0x5a4a3a,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.5,
        });
        const bubble = new THREE.Mesh(bGeo, bMat);
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * dz.radius * 0.8;
        bubble.position.set(
          dz.pos[0] + Math.cos(angle) * dist,
          y + 0.1,
          dz.pos[1] + Math.sin(angle) * dist
        );
        bubble.userData = {
          type: 'dangerBubble',
          baseY: y + 0.1,
          floatOffset: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random(),
        };
        scene.add(bubble);
      }
    });
  }

  function update(time) {
    // Animate portals
    portals.forEach(p => {
      p.ring.rotation.z = time * 0.5;
      if (p.swirl.userData.shaderMat) {
        p.swirl.userData.shaderMat.uniforms.uTime.value = time;
      }
      p.light.intensity = 0.5 + Math.sin(time * 2) * 0.2;
    });

    // Animate danger bubbles
    scene.children.forEach(obj => {
      if (obj.userData.type === 'dangerBubble') {
        const d = obj.userData;
        obj.position.y = d.baseY + Math.sin(time * d.speed + d.floatOffset) * 0.3;
        obj.scale.setScalar(0.8 + Math.sin(time * 2 + d.floatOffset) * 0.2);
      }
    });
  }

  function getDungeons() { return dungeons; }
  function getPortals() { return portals; }

  return { init, update, getDungeons, getPortals };
})();
