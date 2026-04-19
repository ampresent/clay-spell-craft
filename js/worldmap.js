/**
 * worldmap.js — Full-screen world map overview
 */
const WorldMap = (() => {
  let canvas, ctx;
  let visible = false;
  const MAP_SIZE = 600;
  const WORLD_SCALE = MAP_SIZE / 300; // world is ~100 units

  function init() {
    canvas = document.getElementById('worldmap-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = MAP_SIZE;
    canvas.height = MAP_SIZE;
  }

  function toggle() {
    visible = !visible;
    document.getElementById('worldmap-panel').style.display = visible ? 'flex' : 'none';
    if (visible) render();
  }

  function isVisible() { return visible; }

  function render() {
    const w = MAP_SIZE;
    const h = MAP_SIZE;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(200,122,74,0.06)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < w; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0); ctx.lineTo(i, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i); ctx.lineTo(w, i);
      ctx.stroke();
    }

    // Terrain dots (approximation)
    ctx.fillStyle = 'rgba(60,50,35,0.4)';
    for (let x = -150; x < 150; x += 4) {
      for (let z = -150; z < 150; z += 4) {
        const h2 = World.getGroundHeight(x, z);
        if (h2 > -1) {
          const mx = cx + x * WORLD_SCALE * 0.5;
          const my = cy + z * WORLD_SCALE * 0.5;
          const brightness = Math.min(1, (h2 + 3) / 8);
          ctx.fillStyle = `rgba(${60 + brightness * 40},${50 + brightness * 30},${35 + brightness * 20},0.5)`;
          ctx.fillRect(mx, my, 2, 2);
        }
      }
    }

    // Zones
    const zones = Zones.getZones();
    zones.forEach(zone => {
      const mx = cx + zone.center[0] * WORLD_SCALE * 0.5;
      const my = cy + zone.center[1] * WORLD_SCALE * 0.5;
      const mr = zone.radius * WORLD_SCALE * 0.5;

      ctx.strokeStyle = 'rgba(200,122,74,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#c8a06a';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(zone.name, mx, my - mr - 4);
    });

    // Landmarks
    const landmarks = Landmarks.getLandmarks();
    landmarks.forEach(lm => {
      const mx = cx + lm.pos[0] * WORLD_SCALE * 0.5;
      const my = cy + lm.pos[2] * WORLD_SCALE * 0.5;

      ctx.fillStyle = lm.color;
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lm.emoji, mx, my + 5);
    });

    // Dungeons
    const dungeons = Dungeons.getDungeons();
    dungeons.forEach(d => {
      const mx = cx + d.position.x * WORLD_SCALE * 0.5;
      const my = cy + d.position.z * WORLD_SCALE * 0.5;
      ctx.fillStyle = '#4488ff';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🚪', mx, my + 5);
    });

    // Portals
    const portals = Dungeons.getPortals();
    portals.forEach(p => {
      const mx = cx + p.ring.position.x * WORLD_SCALE * 0.5;
      const my = cy + p.ring.position.z * WORLD_SCALE * 0.5;
      ctx.fillStyle = '#aa44ff';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌀', mx, my + 5);
    });

    // NPCs
    const npcs = Characters.getNPCs();
    npcs.forEach(npc => {
      const mx = cx + npc.position.x * WORLD_SCALE * 0.5;
      const my = cy + npc.position.z * WORLD_SCALE * 0.5;
      ctx.fillStyle = '#60cc80';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👤', mx, my + 4);
    });

    // Player
    const camera = Engine.getCamera();
    const px = cx + camera.position.x * WORLD_SCALE * 0.5;
    const py = cy + camera.position.z * WORLD_SCALE * 0.5;

    ctx.fillStyle = '#e8c87a';
    ctx.shadowColor = '#e8c87a';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Direction
    const dir = Engine.getCameraForward();
    ctx.strokeStyle = '#e8c87a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + dir.x * 12, py + dir.z * 12);
    ctx.stroke();

    // Waystones
    const wsAll = Waystones.getAll();
    wsAll.forEach(ws => {
      const mx = cx + ws.x * WORLD_SCALE;
      const my = cy + ws.z * WORLD_SCALE;
      const found = Waystones.isDiscovered(ws.id);

      if (found) {
        // Star marker for discovered waystones
        ctx.fillStyle = '#' + ws.color.toString(16).padStart(6, '0');
        ctx.shadowColor = '#' + ws.color.toString(16).padStart(6, '0');
        ctx.shadowBlur = 6;
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⭐', mx, my + 4);
        ctx.shadowBlur = 0;

        // Name label
        ctx.fillStyle = '#8a7a6a';
        ctx.font = '8px sans-serif';
        ctx.fillText(ws.name.replace('传送石', ''), mx, my + 14);
      } else {
        // Unknown marker
        ctx.fillStyle = '#333';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('❓', mx, my + 4);
      }
    });

        // Legend
    ctx.fillStyle = '#6a5a4a';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🟤 黏土矿  👤 NPC  📍 地标  🚪 遗迹  🌀 传送门', 10, h - 10);
  }

  return { init, toggle, isVisible, render };
})();
