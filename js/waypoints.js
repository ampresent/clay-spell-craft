/**
 * waystones.js — Teleportation waypoint system
 * Scattered across the world, discovered by proximity, usable via world map
 */
const Waystones = (() => {
  let scene;
  const waystones = [];
  const discovered = new Set();

  const WAYSTONE_DATA = [
    { id: 'workshop', name: '工坊谷传送石', x: 2, z: 3, color: 0xe8c87a, desc: '新手塑灵师的起点', icon: '🏠' },
    { id: 'forest', name: '萤光森林传送石', x: -18, z: 14, color: 0x44cc88, desc: '发光蘑菇环绕的古老森林', icon: '🌲' },
    { id: 'lake', name: '魔力湖畔传送石', x: -14, z: -8, color: 0x4488ff, desc: '水晶莲歌唱的宁静湖泊', icon: '🌊' },
    { id: 'crystal', name: '水晶谷传送石', x: 25, z: 18, color: 0xcc88ff, desc: '闪耀七彩光芒的峡谷', icon: '💎' },
    { id: 'highland', name: '风暴高地传送石', x: 18, z: -18, color: 0xaaccff, desc: '浮空岛屿下的强风高原', icon: '⛰️' },
    { id: 'ruins', name: '远古遗迹传送石', x: -30, z: -25, color: 0xff6644, desc: '黏土战争的主战场', icon: '🏚️' },
    { id: 'swamp', name: '暗影沼泽传送石', x: -10, z: -30, color: 0x444444, desc: '危险的暗影腐蚀区域', icon: '🌑' },
    { id: 'north', name: '北境冰原传送石', x: 0, z: 50, color: 0xccddff, desc: '永冻的北方荒原', icon: '❄️' },
    { id: 'east', name: '东方峡谷传送石', x: 60, z: 0, color: 0xffaa44, desc: '通往未知的东方峡谷', icon: '🏜️' },
    { id: 'south', name: '南方深渊传送石', x: 0, z: -55, color: 0xaa2244, desc: '暗影腐蚀最严重的深渊', icon: '🔥' },
    { id: 'west', name: '西方旷野传送石', x: -55, z: 5, color: 0x88aa66, desc: '无人探索的西方旷野', icon: '🌿' },
    { id: 'summit', name: '云端之巅传送石', x: 40, z: 40, color: 0xffee88, desc: '泥灵界最高的山峰', icon: '☁️' },
  ];

  function init(_scene) {
    scene = _scene;
    createWaystones();
  }

  function createWaystones() {
    WAYSTONE_DATA.forEach(data => {
      const group = new THREE.Group();
      const y = World.getGroundHeight(data.x, data.z);

      // Base pillar
      const pillarGeo = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x5a5a6a, roughness: 0.7, metalness: 0.2, flatShading: true,
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.y = 1;
      pillar.castShadow = true;
      group.add(pillar);

      // Glowing orb on top
      const orbGeo = new THREE.SphereGeometry(0.25, 12, 12);
      const orbMat = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.85,
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.y = 2.3;
      group.add(orb);

      // Ground ring
      const ringGeo = new THREE.TorusGeometry(0.8, 0.04, 8, 24);
      const ringMat = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.4,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.05;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      // Rune marks on pillar (small emissive dots)
      for (let i = 0; i < 4; i++) {
        const runeGeo = new THREE.SphereGeometry(0.04, 6, 6);
        const runeMat = new THREE.MeshStandardMaterial({
          color: data.color, emissive: data.color, emissiveIntensity: 0.8,
        });
        const rune = new THREE.Mesh(runeGeo, runeMat);
        const angle = (i / 4) * Math.PI * 2;
        rune.position.set(Math.cos(angle) * 0.32, 0.5 + i * 0.4, Math.sin(angle) * 0.32);
        group.add(rune);
      }

      group.position.set(data.x, y, data.z);
      group.userData = {
        type: 'waystone',
        waystoneId: data.id,
        data: data,
        interactable: true,
      };

      scene.add(group);
      waystones.push(group);
    });
  }

  function update(time) {
    // Animate waystones
    waystones.forEach((ws, i) => {
      const orb = ws.children[1]; // glowing orb
      if (orb) {
        orb.position.y = 2.3 + Math.sin(time * 2 + i) * 0.1;
        orb.material.emissiveIntensity = 0.4 + Math.sin(time * 3 + i) * 0.2;
      }
      const ring = ws.children[2];
      if (ring) ring.rotation.z = time * 0.5 + i;
    });
  }

  function discover(waystoneId) {
    if (discovered.has(waystoneId)) return false;
    discovered.add(waystoneId);
    const ws = WAYSTONE_DATA.find(w => w.id === waystoneId);
    if (ws) {
      Notify.success(`⭐ 发现传送点：${ws.name}`);
      AudioSystem.playSFX('quest');
      Achievements.track('waystone', waystoneId);
    }
    return true;
  }

  function teleport(waystoneId) {
    const ws = WAYSTONE_DATA.find(w => w.id === waystoneId);
    if (!ws || !discovered.has(waystoneId)) {
      Notify.warning('你还没有发现这个传送点');
      return false;
    }

    const camera = Engine.getCamera();
    const targetY = World.getGroundHeight(ws.x, ws.z) + 2;

    // Teleport effect
    ScreenFX.flash('rgba(200,180,255,0.3)', 500);

    // Move camera
    camera.position.set(ws.x, targetY, ws.z);

    Notify.success(`🌀 传送至 ${ws.name}`);
    AudioSystem.playSFX('spell');
    return true;
  }

  function isDiscovered(waystoneId) {
    return discovered.has(waystoneId);
  }

  function getDiscovered() {
    return WAYSTONE_DATA.filter(w => discovered.has(w.id));
  }

  function getAll() {
    return WAYSTONE_DATA;
  }

  function getWaystones() {
    return waystones;
  }

  function renderWaypointPanel() {
    let panel = document.getElementById('waypoint-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'waypoint-panel';
      panel.style.cssText = `
        position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
        width:420px;max-height:70vh;background:#0e0a14;border:1px solid #3a2a4a;
        border-radius:8px;z-index:180;display:none;overflow-y:auto;
        font-family:'Noto Serif SC',Georgia,serif;padding:16px;
      `;
      document.body.appendChild(panel);
    }

    const discoveredList = getDiscovered();
    const allList = getAll();

    panel.innerHTML = `
      <div style="text-align:center;margin-bottom:12px;">
        <h2 style="color:#e8c87a;margin:0;font-size:1.1rem;">🌀 传送点 (${discoveredList.length}/${allList.length})</h2>
        <div style="color:#6a5a4a;font-size:0.75rem;">点击已发现的传送点进行传送</div>
      </div>
      ${allList.map(ws => {
        const found = discovered.has(ws.id);
        return `
          <div style="padding:8px 10px;margin:3px 0;border-radius:4px;cursor:${found ? 'pointer' : 'default'};
            background:${found ? '#1a1520' : '#0a0810'};
            border:1px solid ${found ? '#' + ws.color.toString(16).padStart(6,'0') : '#1a1520'};
            opacity:${found ? 1 : 0.4};"
            ${found ? `onclick="Waystones.teleport('${ws.id}');document.getElementById('waypoint-panel').style.display='none';"` : ''}>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:1.2rem;">${found ? ws.icon : '❓'}</span>
              <div>
                <div style="color:${found ? '#e8c87a' : '#555'};font-size:0.85rem;font-weight:bold;">${found ? ws.name : '未发现的传送点'}</div>
                ${found ? `<div style="color:#6a5a4a;font-size:0.7rem;">${ws.desc}</div>` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('')}
      <div style="text-align:center;margin-top:12px;">
        <button onclick="document.getElementById('waypoint-panel').style.display='none'" 
          style="background:#2a2030;color:#e8c87a;border:1px solid #4a3a5a;padding:6px 20px;border-radius:4px;cursor:pointer;">
          关闭
        </button>
      </div>
    `;

    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    AudioSystem.playSFX('click');
  }

  return {
    init, update, discover, teleport, isDiscovered,
    getDiscovered, getAll, getWaystones, renderWaypointPanel,
  };
})();
