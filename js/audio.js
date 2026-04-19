/**
 * audio.js — Web Audio API ambient and SFX system
 */
const AudioSystem = (() => {
  let ctx;
  let masterGain;
  let ambientGain;
  let sfxGain;
  let isInitialized = false;

  function init() {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.3;
      masterGain.connect(ctx.destination);

      ambientGain = ctx.createGain();
      ambientGain.gain.value = 0.15;
      ambientGain.connect(masterGain);

      sfxGain = ctx.createGain();
      sfxGain.gain.value = 0.5;
      sfxGain.connect(masterGain);

      isInitialized = true;
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  // Generate ambient wind/drone
  function startAmbient() {
    if (!isInitialized) return;

    // Low drone
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 80;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.08;
    osc1.connect(droneGain);
    droneGain.connect(ambientGain);
    osc1.start();

    // Shimmering overtone
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 320;
    const shimGain = ctx.createGain();
    shimGain.gain.value = 0.03;
    osc2.connect(shimGain);
    shimGain.connect(ambientGain);
    osc2.start();

    // LFO modulation on overtone
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 15;
    lfo.connect(lfoGain);
    lfoGain.connect(osc2.frequency);
    lfo.start();

    // Wind noise
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Filter for wind character
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 1;

    const windGain = ctx.createGain();
    windGain.gain.value = 0.04;

    noise.connect(filter);
    filter.connect(windGain);
    windGain.connect(ambientGain);
    noise.start();

    // LFO on wind filter
    const windLfo = ctx.createOscillator();
    windLfo.type = 'sine';
    windLfo.frequency.value = 0.08;
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.value = 200;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(filter.frequency);
    windLfo.start();
  }

  // Play a short sound effect
  function playSFX(type) {
    if (!isInitialized) return;

    switch (type) {
      case 'harvest':
        playNote(440, 0.1, 'triangle', 0.3);
        playNote(660, 0.1, 'triangle', 0.15);
        break;
      case 'craft':
        playNote(523, 0.15, 'sine', 0.3);
        setTimeout(() => playNote(659, 0.15, 'sine', 0.25), 100);
        setTimeout(() => playNote(784, 0.2, 'sine', 0.2), 200);
        break;
      case 'spell':
        playNote(300 + Math.random() * 200, 0.3, 'sine', 0.15);
        playNote(600 + Math.random() * 200, 0.2, 'sine', 0.1);
        break;
      case 'click':
        playNote(800, 0.05, 'square', 0.1);
        break;
      case 'dialog':
        playNote(440, 0.08, 'sine', 0.15);
        break;
      case 'quest':
        playNote(523, 0.12, 'sine', 0.2);
        setTimeout(() => playNote(659, 0.12, 'sine', 0.15), 120);
        setTimeout(() => playNote(784, 0.15, 'sine', 0.12), 240);
        setTimeout(() => playNote(1047, 0.2, 'sine', 0.1), 360);
        break;
    }
  }

  function playNote(freq, duration, waveType, volume) {
    const osc = ctx.createOscillator();
    osc.type = waveType;
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.05);
  }

  return {
    init, resume, startAmbient, playSFX,
  };
})();
