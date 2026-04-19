/**
 * patrol.js — NPC patrol paths and movement
 */
const Patrol = (() => {
  const patrols = {};

  function init() {
    // Give NPCs patrol paths
    patrols.merchant = {
      points: [
        [8, 0, 4], [10, 0, 6], [8, 0, 8], [6, 0, 6],
      ],
      currentIdx: 0,
      speed: 0.8,
      waitTime: 3,
      waiting: false,
      waitTimer: 0,
    };

    patrols.scholar = {
      points: [
        [-6, 0, 8], [-8, 0, 10], [-6, 0, 12], [-4, 0, 10],
      ],
      currentIdx: 0,
      speed: 0.5,
      waitTime: 5,
      waiting: false,
      waitTimer: 0,
    };
  }

  function update(delta, npcs) {
    npcs.forEach(npc => {
      const key = npc.userData.npcKey;
      const patrol = patrols[key];
      if (!patrol) return;

      if (patrol.waiting) {
        patrol.waitTimer += delta;
        if (patrol.waitTimer >= patrol.waitTime) {
          patrol.waiting = false;
          patrol.waitTimer = 0;
          patrol.currentIdx = (patrol.currentIdx + 1) % patrol.points.length;
        }
        return;
      }

      const target = patrol.points[patrol.currentIdx];
      const targetY = World.getGroundHeight(target[0], target[2]);
      const targetPos = new THREE.Vector3(target[0], targetY, target[2]);

      const dir = new THREE.Vector3().subVectors(targetPos, npc.position);
      dir.y = 0;
      const dist = dir.length();

      if (dist < 0.5) {
        patrol.waiting = true;
        return;
      }

      dir.normalize();
      npc.position.add(dir.multiplyScalar(patrol.speed * delta));
      npc.position.y = World.getGroundHeight(npc.position.x, npc.position.z);

      // Face movement direction
      npc.rotation.y = Math.atan2(dir.x, dir.z);
    });
  }

  return { init, update };
})();
