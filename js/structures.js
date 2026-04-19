/**
 * structures.js — Buildings and structures in the world
 */
const Structures = (() => {
  let scene;

  function init(_scene) {
    scene = _scene;
    createWorkshop();
    createTownCenter();
    createFences();
    createTrees();
    createMushrooms();
  }

  function createWorkshop() {
    const group = new THREE.Group();
    group.position.set(0, 0, 0);

    // Floor
    const floorGeo = new THREE.BoxGeometry(6, 0.2, 5);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x5a4a3a, roughness: 0.9, flatShading: true,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = 0.1;
    floor.receiveShadow = true;
    group.add(floor);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x7a6a5a, roughness: 0.85, flatShading: true,
    });

    // Back wall
    const backWallGeo = new THREE.BoxGeometry(6, 3, 0.3);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 1.7, -2.5);
    backWall.castShadow = true;
    group.add(backWall);

    // Side walls
    const sideWallGeo = new THREE.BoxGeometry(0.3, 3, 5);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.position.set(-3, 1.7, 0);
    leftWall.castShadow = true;
    group.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
    rightWall.position.set(3, 1.7, 0);
    rightWall.castShadow = true;
    group.add(rightWall);

    // Roof
    const roofGeo = new THREE.ConeGeometry(4.5, 2, 4);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x8a4a2a, roughness: 0.8, flatShading: true,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 4, 0);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    // Workbench inside
    const benchGeo = new THREE.BoxGeometry(3, 0.8, 1.2);
    const benchMat = new THREE.MeshStandardMaterial({
      color: 0x6a5030, roughness: 0.85,
    });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.set(0, 0.6, -1.5);
    bench.castShadow = true;
    group.add(bench);

    // Clay pots on bench
    for (let i = -1; i <= 1; i++) {
      const potGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.3, 8);
      const potColors = [0xc87a4a, 0x5a8aaa, 0x6aaa5a];
      const potMat = new THREE.MeshStandardMaterial({
        color: potColors[i + 1], roughness: 0.7,
      });
      const pot = new THREE.Mesh(potGeo, potMat);
      pot.position.set(i * 0.8, 1.1, -1.5);
      pot.castShadow = true;
      group.add(pot);
    }

    // Door frame
    const doorFrameGeo = new THREE.BoxGeometry(1.5, 2.5, 0.35);
    const doorFrameMat = new THREE.MeshStandardMaterial({
      color: 0x4a3a2a, roughness: 0.9,
    });
    const doorFrame = new THREE.Mesh(doorFrameGeo, doorFrameMat);
    doorFrame.position.set(0, 1.45, 2.5);
    group.add(doorFrame);

    // Lantern
    const lanternGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xffaa44, emissive: 0xff8800, emissiveIntensity: 0.8,
    });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(0, 3, 2.6);
    group.add(lantern);

    // Lantern light
    const lanternLight = new THREE.PointLight(0xffaa44, 0.8, 8);
    lanternLight.position.copy(lantern.position);
    group.add(lanternLight);

    // Sign
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 256;
    signCanvas.height = 64;
    const ctx = signCanvas.getContext('2d');
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(0, 0, 256, 64);
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#e8c87a';
    ctx.textAlign = 'center';
    ctx.fillText('🧱 黏土工坊', 128, 42);
    const signTex = new THREE.CanvasTexture(signCanvas);
    const signMat = new THREE.SpriteMaterial({ map: signTex });
    const sign = new THREE.Sprite(signMat);
    sign.position.set(0, 3.8, 2.6);
    sign.scale.set(2, 0.5, 1);
    group.add(sign);

    scene.add(group);
  }

  function createTownCenter() {
    // Central plaza circle
    const plazaGeo = new THREE.CylinderGeometry(5, 5, 0.1, 24);
    const plazaMat = new THREE.MeshStandardMaterial({
      color: 0x4a3a2a, roughness: 0.9, flatShading: true,
    });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.position.set(0, 0.05, 0);
    plaza.receiveShadow = true;
    scene.add(plaza);

    // Ancient stone in center
    const altarGeo = new THREE.CylinderGeometry(0.8, 1.2, 1.5, 6);
    const altarMat = new THREE.MeshStandardMaterial({
      color: 0x5a5a6a, roughness: 0.7, metalness: 0.2, flatShading: true,
    });
    const altar = new THREE.Mesh(altarGeo, altarMat);
    altar.position.set(0, 0.8, 0);
    altar.castShadow = true;
    altar.userData.type = 'altar';
    scene.add(altar);

    // Runes on altar
    const runeGeo = new THREE.TorusGeometry(1, 0.03, 8, 24);
    const runeMat = new THREE.MeshStandardMaterial({
      color: 0x88aaff, emissive: 0x4466cc, emissiveIntensity: 0.5,
      transparent: true, opacity: 0.4,
    });
    const rune = new THREE.Mesh(runeGeo, runeMat);
    rune.position.set(0, 1.6, 0);
    rune.rotation.x = Math.PI / 2;
    rune.userData.type = 'runeRing';
    scene.add(rune);
  }

  function createFences() {
    const fenceMat = new THREE.MeshStandardMaterial({
      color: 0x6a5a3a, roughness: 0.9, flatShading: true,
    });

    // Fence posts around workshop area
    const posts = [
      [-5, 0, 4], [-5, 0, 0], [-5, 0, -4],
      [5, 0, 4], [5, 0, 0], [5, 0, -4],
    ];

    posts.forEach(([x, , z]) => {
      const y = World.getGroundHeight(x, z);
      const postGeo = new THREE.CylinderGeometry(0.08, 0.1, 1.5, 6);
      const post = new THREE.Mesh(postGeo, fenceMat);
      post.position.set(x, y + 0.75, z);
      post.castShadow = true;
      scene.add(post);
    });
  }

  function createTrees() {
    const treeMat = new THREE.MeshStandardMaterial({
      color: 0x3a6a3a, roughness: 0.8, flatShading: true,
    });
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x5a4a2a, roughness: 0.9, flatShading: true,
    });

    const treePositions = [
      [-10, -8], [12, -6], [-8, 12], [15, 8], [-18, -3],
      [20, -12], [-14, 16], [7, -15], [-22, 10], [18, 18],
      [-6, -18], [10, 14], [-16, -14], [22, 4], [-11, 20],
    ];

    treePositions.forEach(([x, z], i) => {
      const y = World.getGroundHeight(x, z);
      const height = 2 + Math.random() * 3;
      const radius = 0.8 + Math.random() * 1.2;

      // Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.15, 0.25, height, 6);
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(x, y + height / 2, z);
      trunk.castShadow = true;
      scene.add(trunk);

      // Canopy (multiple cones for organic look)
      const layers = 2 + Math.floor(Math.random() * 2);
      for (let l = 0; l < layers; l++) {
        const r = radius * (1 - l * 0.25);
        const h = 1.5 + Math.random() * 0.5;
        const canopyGeo = new THREE.ConeGeometry(r, h, 6 + Math.floor(Math.random() * 3));
        const canopy = new THREE.Mesh(canopyGeo, treeMat);
        canopy.position.set(x, y + height + l * 0.8, z);
        canopy.castShadow = true;
        scene.add(canopy);
      }
    });
  }

  function createMushrooms() {
    const colors = [0xff6688, 0x88aaff, 0xffaa44, 0xaa88ff, 0x44ffaa];

    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      if (Math.sqrt(x * x + z * z) < 8) continue;

      const y = World.getGroundHeight(x, z);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 0.1 + Math.random() * 0.2;

      // Stem
      const stemGeo = new THREE.CylinderGeometry(size * 0.3, size * 0.4, size, 6);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0xddccaa, roughness: 0.8 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.set(x, y + size / 2, z);
      scene.add(stem);

      // Cap
      const capGeo = new THREE.SphereGeometry(size * 0.7, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
      const capMat = new THREE.MeshStandardMaterial({
        color, emissive: color, emissiveIntensity: 0.2,
        roughness: 0.5,
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(x, y + size, z);
      scene.add(cap);
    }
  }

  return { init };
})();
