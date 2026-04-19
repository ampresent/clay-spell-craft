/**
 * daynight.js — Day/night cycle with dynamic lighting
 */
const DayNight = (() => {
  let sun, ambient, hemi;
  let timeOfDay = 0.3; // 0-1, 0=midnight, 0.5=noon
  const DAY_SPEED = 0.01; // full cycle speed
  let skyMesh;

  function init(scene) {
    sun = scene.children.find(c => c.isDirectionalLight);
    ambient = scene.children.find(c => c.isAmbientLight);
    hemi = scene.children.find(c => c.isHemisphereLight);
    skyMesh = scene.getObjectByName('sky');
  }

  function update(delta) {
    timeOfDay = (timeOfDay + delta * DAY_SPEED) % 1;

    // Sun position
    const sunAngle = timeOfDay * Math.PI * 2 - Math.PI / 2;
    if (sun) {
      sun.position.set(
        Math.cos(sunAngle) * 150,
        Math.sin(sunAngle) * 150 + 10,
        20
      );

      // Sun color based on time
      const isDay = timeOfDay > 0.25 && timeOfDay < 0.75;
      const sunrise = smoothstep(0.2, 0.3, timeOfDay) * (1 - smoothstep(0.7, 0.8, timeOfDay));

      if (isDay) {
        const warmth = Math.sin(sunAngle) * 0.5 + 0.5;
        sun.color.setRGB(
          0.9 + warmth * 0.1,
          0.85 + warmth * 0.1,
          0.7 + warmth * 0.2
        );
        sun.intensity = 0.4 + warmth * 0.6;
      } else {
        sun.color.setRGB(0.3, 0.3, 0.5);
        sun.intensity = 0.15;
      }
    }

    // Ambient light
    if (ambient) {
      const brightness = Math.sin(sunAngle) * 0.3 + 0.4;
      ambient.intensity = Math.max(0.15, brightness);
      ambient.color.setRGB(
        0.2 + brightness * 0.3,
        0.15 + brightness * 0.25,
        0.25 + brightness * 0.2
      );
    }

    // Fog color
    const Engine_scene = Engine.getScene();
    if (Engine_scene) {
      const isDay = timeOfDay > 0.25 && timeOfDay < 0.75;
      if (isDay) {
        Engine_scene.fog.color.setRGB(0.15, 0.12, 0.2);
      } else {
        Engine_scene.fog.color.setRGB(0.04, 0.03, 0.08);
      }
    }
  }

  function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  function getTimeString() {
    const hours = Math.floor(timeOfDay * 24);
    const mins = Math.floor((timeOfDay * 24 - hours) * 60);
    const period = hours < 12 ? 'AM' : 'PM';
    const h12 = hours % 12 || 12;
    return `${h12}:${mins.toString().padStart(2, '0')} ${period}`;
  }

  function isNight() {
    return timeOfDay < 0.25 || timeOfDay > 0.75;
  }

  return {
    init, update, getTimeString, isNight,
    getTime: () => timeOfDay,
  };
})();
