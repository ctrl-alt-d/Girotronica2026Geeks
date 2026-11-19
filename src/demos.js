// Live creative-coding demos embedded in the slides. No dependencies.

const PALETTE = ['#de7de3', '#faab41', '#7ee2a8', '#ff8a95', '#efa3f3'];
const BACKGROUND = '4, 3, 17';

/** "Codi que dibuixa": points drifting through a flow field. */
export function setupFlowDemo() {
  const canvas = document.getElementById('flow-canvas');
  const chaosInput = document.getElementById('flow-chaos');
  const chaosCode = document.getElementById('flow-code-chaos');
  const toggle = document.getElementById('flow-toggle');
  const clear = document.getElementById('flow-clear');
  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const W = 640;
  const H = 396;
  canvas.width = W;
  canvas.height = H;

  const points = Array.from({ length: 700 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
  }));
  const pointer = { x: -1000, y: -1000 };

  let active = false; // the slide is on screen
  let playing = !reducedMotion; // the user has not paused it
  let frame = 0;
  let time = 0;

  function wipe() {
    ctx.fillStyle = `rgb(${BACKGROUND})`;
    ctx.fillRect(0, 0, W, H);
  }

  function step() {
    const chaos = Number(chaosInput.value);
    time += 0.004;
    ctx.fillStyle = `rgba(${BACKGROUND}, 0.05)`;
    ctx.fillRect(0, 0, W, H);

    for (const p of points) {
      const noise = Math.sin(p.x * 0.006 + time * 3) + Math.cos(p.y * 0.008 - time * 2);
      const angle = noise * chaos;
      let dx = Math.cos(angle) * 1.6;
      let dy = Math.sin(angle) * 1.6;

      const px = p.x - pointer.x;
      const py = p.y - pointer.y;
      const distance = Math.hypot(px, py);
      if (distance < 90 && distance > 0.01) {
        dx += (px / distance) * 4;
        dy += (py / distance) * 4;
      }

      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      p.x += dx;
      p.y += dy;
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
        p.x = Math.random() * W;
        p.y = Math.random() * H;
      }
    }
  }

  function loop() {
    step();
    frame = requestAnimationFrame(loop);
  }

  function update() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (active && playing) frame = requestAnimationFrame(loop);
    toggle.textContent = playing ? 'Pausa' : 'Play';
  }

  canvas.addEventListener('pointermove', (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * W;
    pointer.y = ((event.clientY - rect.top) / rect.height) * H;
  });
  canvas.addEventListener('pointerleave', () => {
    pointer.x = pointer.y = -1000;
  });
  chaosInput.addEventListener('input', () => {
    chaosCode.textContent = chaosInput.value;
  });
  toggle.addEventListener('click', () => {
    playing = !playing;
    update();
  });
  clear.addEventListener('click', wipe);

  wipe();
  // With reduced motion the sketch starts paused: paint one still picture.
  if (reducedMotion) for (let i = 0; i < 120; i += 1) step();
  update();

  return {
    root: canvas,
    setActive(value) {
      active = value;
      update();
    },
  };
}

/** "Codi que sona": eight pads on a pentatonic scale. */
export function setupSoundDemo() {
  const pads = document.getElementById('sound-pads');
  const buttons = [...pads.querySelectorAll('button')];
  const waveSelect = document.getElementById('sound-wave');
  const waveCode = document.getElementById('sound-code-wave');
  const freqCode = document.getElementById('sound-code-freq');
  const autoButton = document.getElementById('sound-auto');

  let audio = null;
  let timer = 0;

  function play(button) {
    audio ??= new AudioContext();
    if (audio.state === 'suspended') audio.resume();

    const frequency = Number(button.dataset.freq);
    const now = audio.currentTime;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = waveSelect.value;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.5);

    freqCode.textContent = Math.round(frequency);
    button.classList.remove('is-playing');
    void button.offsetWidth; // restart the CSS animation
    button.classList.add('is-playing');
  }

  function setAuto(on) {
    clearInterval(timer);
    timer = 0;
    if (on) {
      timer = setInterval(() => {
        if (Math.random() < 0.75) play(buttons[Math.floor(Math.random() * buttons.length)]);
      }, 220);
    }
    autoButton.setAttribute('aria-pressed', String(on));
    autoButton.textContent = on ? 'Para' : 'Toca sol';
  }

  for (const button of buttons) button.addEventListener('click', () => play(button));
  waveSelect.addEventListener('change', () => {
    waveCode.textContent = waveSelect.value;
  });
  autoButton.addEventListener('click', () => setAuto(!timer));

  return {
    root: pads,
    setActive(value) {
      if (!value) setAuto(false);
    },
  };
}
