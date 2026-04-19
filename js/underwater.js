/**
 * underwater.js — Underwater zone with special effects
 */
const Underwater = (() => {
  let scene;
  let underwaterEffects = [];
  let isUnderwater = false;
  const WATER_LEVEL = -0.5;

  function init(_scene) {
    scene = _scene;
    createUnderwaterZone();
  }

  function createUnderwaterZone() {
    // Underwater cave entrance near pond
    const x = -14, z = -8;
    const y = World.getGroundHeight(x, z);

    // Submerged arch
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x3a5a6a, roughness: 0.7, metalness: 0.3, flatShading: true,
    });

    const pillarGeo = new THREE.BoxGeometry(0.6, 2, 0.6);
    const left = new THREE.Mesh(pillarGeo, archMat);
    left.position.set(x - 1, y - 1, z);
    scene.add(left);

    const right = new THREE.Mesh(pillarGeo, archMat);
    right.position.set(x + 1, y - 1, z);
    scene.add(right);

    const topGeo = new THREE.BoxGeometry(2.6, 0.4, 0.8);
    const top = new THREE.Mesh(topGeo, archMat);
    top.position.set(x, y + 0.2, z);
    scene.add(top);

    // Blue underwater glow
    const light = new THREE.PointLight(0x4488cc, 0.5, 8);
    light.position.set(x, y - 0.5, z);
    scene.add(light);

    // Bubbles
    for (let i = 0; i < 8; i++) {
      const bGeo = new THREE.SphereGeometry(0.05 + Math.random() * 0.08, 6, 6);
      const bMat = new THREE.MeshStandardMaterial({
        color: 0x88ccff, emissive: 0x4488cc, emissiveIntensity: 0.2,
        transparent: true, opacity: 0.3,
      });
      const bubble = new THREE.Mesh(bGeo, bMat);
      bubble.position.set(
        x + (Math.random() - 0.5) * 3,
        y - 0.5 - Math.random() * 2,
        z + (Math.random() - 0.5) * 2
      );
      bubble.userData = {
        type: 'underwaterBubble',
        baseX: bubble.position.x,
        baseZ: bubble.position.z,
        speed: 0.5 + Math.random() * 0.5,
        maxY: y + 0.5,
      };
      scene.add(bubble);
    }

    // Treasure chest underwater
    const chestGeo = new THREE.BoxGeometry(0.5, 0.3, 0.35);
    const chestMat = new THREE.MeshStandardMaterial({
      color: 0x6a5a3a, roughness: 0.8,
    });
    const chest = new THREE.Mesh(chestGeo, chestMat);
    chest.position.set(x + 2, y - 1.2, z + 1);
    chest.userData = { type: 'secret', secretId: 'underwater_treasure', name: '水下宝藏', interactable: true };
    scene.add(chest);

    // Coral
    const coralColors = [0xff6688, 0xffaa44, 0xcc66aa, 0x44ccaa];
    for (let i = 0; i < 6; i++) {
      const cGeo = new THREE.ConeGeometry(0.15 + Math.random() * 0.1, 0.4 + Math.random() * 0.3, 5);
      const cMat = new THREE.MeshStandardMaterial({
        color: coralColors[i % coralColors.length],
        emissive: coralColors[i % coralColors.length],
        emissiveIntensity: 0.15,
      });
      const coral = new THREE.Mesh(cGeo, cMat);
      coral.position.set(
        x + (Math.random() - 0.5) * 5,
        y - 1.5,
        z + (Math.random() - 0.5) * 4
      );
      coral.rotation.set(Math.random() * 0.3, Math.random(), Math.random() * 0.3);
      scene.add(coral);
    }

    // Sign
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 256;
    signCanvas.height = 64;
    const ctx = signCanvas.getContext('2d');
    ctx.fillStyle = 'rgba(10,20,40,0.7)';
    ctx.fillRect(0, 0, 256, 64);
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#4488cc';
    ctx.textAlign = 'center';
    ctx.fillText('🌊 水下洞穴', 128, 40);
    const tex = new THREE.CanvasTexture(signCanvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sign = new THREE.Sprite(mat);
    sign.position.set(x, y + 1.5, z);
    sign.scale.set(2, 0.5, 1);
    scene.add(sign);
  }

  function update(time) {
    const camera = Engine.getCamera();
    const playerY = camera.position.y;
    const groundY = World.getGroundHeight(camera.position.x, camera.position.z);

    const wasUnderwater = isUnderwater;
    isUnderwater = playerY < groundY + WATER_LEVEL + 1;

    // Animate bubbles
    scene.children.forEach(obj => {
      if (obj.userData.type === 'underwaterBubble') {
        const d = obj.userData;
        obj.position.y += d.speed * 0.01;
        obj.position.x = d.baseX + Math.sin(time * 2 + obj.position.y) * 0.1;
        if (obj.position.y > d.maxY) {
          obj.position.y = d.maxY - 3;
        }
      }
    });
  }

  function isInWater() { return isUnderwater; }

  return { init, update, isInWater };
})();
