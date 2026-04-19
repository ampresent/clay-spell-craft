/**
 * enemies.js — Enemy creatures and combat basics
 */
const Enemies = (() => {
  let scene;
  const enemies = [];
  const SPAWN_INTERVAL = 15; // seconds
  let spawnTimer = 0;
  const MAX_ENEMIES = 8;

  const ENEMY_TYPES = {
    mudSlime: {
      name: '泥浆史莱姆',
      emoji: '🟢',
      color: 0x5a8a3a,
      emissive: 0x3a6a2a,
      size: 0.5,
      hp: 20,
      speed: 1.5,
      damage: 5,
      xp: 10,
      desc: '普通的泥浆生物，会缓慢接近你',
    },
    fireSpirit: {
      name: '火焰游魂',
      emoji: '🔴',
      color: 0xff4422,
      emissive: 0xff2200,
      size: 0.4,
      hp: 30,
      speed: 2.5,
      damage: 8,
      xp: 20,
      desc: '飘忽不定的火焰生物',
    },
    windWisp: {
      name: '风暴幽光',
      emoji: '🔵',
      color: 0x88bbff,
      emissive: 0x4488cc,
      size: 0.35,
      hp: 15,
      speed: 4,
      damage: 3,
      xp: 15,
      desc: '快速移动的风暴精灵',
    },
    clayGolem: {
      name: '黏土傀儡',
      emoji: '🟤',
      color: 0x8a6a4a,
      emissive: 0x5a3a2a,
      size: 0.8,
      hp: 60,
      speed: 0.8,
      damage: 15,
      xp: 40,
      desc: '沉睡的远古黏土傀儡',
    },
    shadowClay: {
      name: '暗影黏土',
      emoji: '⚫',
      color: 0x3a2a4a,
      emissive: 0x2a1a3a,
      size: 0.6,
      hp: 40,
      speed: 2,
      damage: 12,
      xp: 30,
      desc: '被黑暗侵蚀的黏土生命体',
    },
  };

  function init(_scene) {
    scene = _scene;
    // Spawn some initial enemies
    for (let i = 0; i < 4; i++) {
      spawnRandom();
    }
  }

  function spawnRandom() {
    if (enemies.length >= MAX_ENEMIES) return;

    const types = Object.keys(ENEMY_TYPES);
    const weights = [40, 20, 20, 10, 10]; // probability weights
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    let typeIdx = 0;
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i];
      if (r <= 0) { typeIdx = i; break; }
    }

    const typeId = types[typeIdx];
    const template = ENEMY_TYPES[typeId];

    // Spawn position (away from center)
    const angle = Math.random() * Math.PI * 2;
    const dist = 12 + Math.random() * 25;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;
    const y = World.getGroundHeight(x, z);

    const enemy = createEnemyMesh(template, typeId);
    enemy.position.set(x, y + template.size, z);
    scene.add(enemy);
    enemies.push(enemy);
  }

  function createEnemyMesh(template, typeId) {
    const group = new THREE.Group();

    // Body
    const bodyGeo = typeId === 'windWisp'
      ? new THREE.OctahedronGeometry(template.size, 1)
      : new THREE.SphereGeometry(template.size, 10, 8);
    bodyGeo.scale(1, 0.8, 1);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: template.color,
      emissive: template.emissive,
      emissiveIntensity: 0.3,
      roughness: 0.6,
      metalness: 0.1,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    group.add(body);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(template.size * 0.15, 6, 6);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xff0000,
      emissiveIntensity: 0.8,
    });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-template.size * 0.25, template.size * 0.15, template.size * 0.7);
    group.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(template.size * 0.25, template.size * 0.15, template.size * 0.7);
    group.add(rightEye);

    // HP bar
    const hpBgGeo = new THREE.PlaneGeometry(template.size * 2, 0.1);
    const hpBgMat = new THREE.MeshBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.6 });
    const hpBg = new THREE.Mesh(hpBgGeo, hpBgMat);
    hpBg.position.y = template.size + 0.3;
    group.add(hpBg);

    const hpGeo = new THREE.PlaneGeometry(template.size * 2, 0.08);
    const hpMat = new THREE.MeshBasicMaterial({ color: 0x44cc66 });
    const hpBar = new THREE.Mesh(hpGeo, hpMat);
    hpBar.position.y = template.size + 0.3;
    hpBar.position.z = 0.01;
    group.add(hpBar);

    // Shadow circle
    const shadowGeo = new THREE.CircleGeometry(template.size * 0.8, 12);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -template.size * 0.7;
    group.add(shadow);

    group.userData = {
      type: 'enemy',
      typeId,
      template: { ...template },
      hp: template.hp,
      maxHp: template.hp,
      alive: true,
      state: 'idle', // idle, chase, attack, hurt, dead
      stateTimer: 0,
      attackCooldown: 0,
      hurtTimer: 0,
      wanderAngle: Math.random() * Math.PI * 2,
      wanderTimer: 0,
      floatOffset: Math.random() * Math.PI * 2,
    };

    return group;
  }

  function damageEnemy(enemy, amount) {
    if (!enemy.userData.alive) return;
    enemy.userData.hp -= amount;
    enemy.userData.state = 'hurt';
    enemy.userData.hurtTimer = 0.3;

    // Update HP bar
    const hpRatio = Math.max(0, enemy.userData.hp / enemy.userData.maxHp);
    const hpBar = enemy.children[3]; // HP bar mesh
    if (hpBar) {
      hpBar.scale.x = hpRatio;
      hpBar.position.x = -(1 - hpRatio) * enemy.userData.template.size;
      hpBar.material.color.setHex(hpRatio > 0.5 ? 0x44cc66 : hpRatio > 0.25 ? 0xffaa44 : 0xff4444);
    }

    // Flash red
    const body = enemy.children[0];
    if (body && body.material) {
      body.material.emissiveIntensity = 1.5;
      setTimeout(() => { if (body.material) body.material.emissiveIntensity = 0.3; }, 150);
    }

    if (enemy.userData.hp <= 0) {
      killEnemy(enemy);
    }

    ScreenFX.flash('rgba(255,255,255,0.1)', 100);
  }

  function killEnemy(enemy) {
    enemy.userData.alive = false;
    enemy.userData.state = 'dead';

    // Rewards
    const tmpl = enemy.userData.template;
    Notify.success(`击败 ${tmpl.emoji} ${tmpl.name}！获得 ${tmpl.xp} 经验`);
    Inventory.add('clay', Math.floor(tmpl.xp / 5));
    Inventory.add('crystals', 1);
    Achievements.track('harvest');

    // Death animation
    enemy.userData.deathTime = performance.now() / 1000;
    AudioSystem.playSFX('craft');
  }

  function update(delta, time, playerPos) {
    // Spawn timer
    spawnTimer += delta;
    if (spawnTimer >= SPAWN_INTERVAL) {
      spawnTimer = 0;
      spawnRandom();
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      const ud = e.userData;

      if (!ud.alive) {
        // Death animation
        const elapsed = time - ud.deathTime;
        if (elapsed < 0.8) {
          e.scale.multiplyScalar(0.95);
          e.children.forEach(c => {
            if (c.material) c.material.opacity = Math.max(0, 1 - elapsed / 0.8);
          });
        } else {
          scene.remove(e);
          enemies.splice(i, 1);
        }
        continue;
      }

      const distToPlayer = e.position.distanceTo(playerPos);
      const template = ud.template;

      // Hurt state
      if (ud.hurtTimer > 0) {
        ud.hurtTimer -= delta;
        e.position.y += Math.sin(time * 30) * 0.01;
        continue;
      }

      // AI behavior
      if (distToPlayer < 20) {
        ud.state = 'chase';
      } else {
        ud.state = 'idle';
      }

      if (ud.state === 'chase' && distToPlayer > 1.5) {
        const dir = new THREE.Vector3().subVectors(playerPos, e.position);
        dir.y = 0;
        dir.normalize();
        e.position.add(dir.multiplyScalar(template.speed * delta));

        // Face player
        e.rotation.y = Math.atan2(dir.x, dir.z);
      } else if (ud.state === 'idle') {
        // Wander
        ud.wanderTimer += delta;
        if (ud.wanderTimer > 3) {
          ud.wanderTimer = 0;
          ud.wanderAngle = Math.random() * Math.PI * 2;
        }
        const wx = Math.cos(ud.wanderAngle) * template.speed * 0.3 * delta;
        const wz = Math.sin(ud.wanderAngle) * template.speed * 0.3 * delta;
        e.position.x += wx;
        e.position.z += wz;
        e.rotation.y = ud.wanderAngle;
      }

      // Clamp to ground
      const gy = World.getGroundHeight(e.position.x, e.position.z);
      e.position.y = gy + template.size + Math.sin(time * 3 + ud.floatOffset) * 0.1;

      // Attack cooldown
      if (ud.attackCooldown > 0) ud.attackCooldown -= delta;

      // Attack player
      if (distToPlayer < 1.5 && ud.attackCooldown <= 0) {
        ud.attackCooldown = 1.5;
        ScreenFX.damageFlash();
        Notify.warning(`${template.emoji} ${template.name} 攻击了你！`);
      }

      // Idle animation
      const body = e.children[0];
      if (body) {
        body.scale.y = 0.8 + Math.sin(time * 4 + ud.floatOffset) * 0.05;
      }
    }
  }

  function getEnemies() { return enemies; }

  return {
    init, update, damageEnemy, getEnemies, ENEMY_TYPES,
  };
})();
