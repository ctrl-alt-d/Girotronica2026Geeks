// Generative background for the cover: points drifting through a flow field
// and leaving a trail. Plain Canvas 2D, no dependencies.

const PALETTE = ['#de7de3', '#faab41', '#7ee2a8', '#ff8a95', '#efa3f3'];
const BACKGROUND = '4, 3, 17';
const CHAOS = 10; // how hard the field twists: 1 is calm, 10 is a mess
const SPEED = 1.6;
const DENSITY = 1 / 600; // points per pixel of screen

export function createChaosBackground(container) {
  const canvas = document.createElement('canvas');
  canvas.className = 'chaos-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  container.append(canvas);

  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer = { x: -1000, y: -1000 };
  let points = [];
  let width = 0;
  let height = 0;
  let active = false;
  let frame = 0;
  let time = 0;

  function randomPoint() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    };
  }

  function resize() {
    width = canvas.width = container.clientWidth || window.innerWidth;
    height = canvas.height = container.clientHeight || window.innerHeight;
    points = Array.from({ length: Math.round(width * height * DENSITY) }, randomPoint);
    ctx.fillStyle = `rgb(${BACKGROUND})`;
    ctx.fillRect(0, 0, width, height);
    // Without animation, paint one still picture instead of an empty slide.
    if (reducedMotion) for (let i = 0; i < 120; i += 1) step();
  }

  function step() {
    time += 0.004;
    ctx.fillStyle = `rgba(${BACKGROUND}, 0.05)`;
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 1.5;

    for (const p of points) {
      const noise = Math.sin(p.x * 0.006 + time * 3) + Math.cos(p.y * 0.008 - time * 2);
      const angle = noise * CHAOS;
      let dx = Math.cos(angle) * SPEED;
      let dy = Math.sin(angle) * SPEED;

      // Points run away from the mouse.
      const px = p.x - pointer.x;
      const py = p.y - pointer.y;
      const distance = Math.hypot(px, py);
      if (distance < 110 && distance > 0.01) {
        dx += (px / distance) * 4;
        dy += (py / distance) * 4;
      }

      ctx.strokeStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      p.x += dx;
      p.y += dy;
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) Object.assign(p, randomPoint());
    }
  }

  function loop() {
    step();
    frame = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  });
  document.documentElement.addEventListener('pointerleave', () => {
    pointer.x = pointer.y = -1000;
  });

  resize();

  return {
    /** Animate only while the cover is on screen. */
    setActive(value) {
      active = value;
      cancelAnimationFrame(frame);
      frame = 0;
      if (active && !reducedMotion) frame = requestAnimationFrame(loop);
    },
  };
}
