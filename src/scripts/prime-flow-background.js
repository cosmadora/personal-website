/*
 * Prime flow field — animated website background.
 *
 * Expected HTML:
 *   <canvas id="bgCanvas" aria-hidden="true"></canvas>
 *
 * The background color is read from:
 *   --background-color
 *
 * This version is adapted for the Astro website and does not depend on
 * PaperMod, data-theme, --theme, or #theme-toggle.
 */

function initializePrimeFlowBackground() {
  const canvas = document.getElementById("bgCanvas");

  if (!(canvas instanceof HTMLCanvasElement)) {
    console.error("Prime flow background: #bgCanvas was not found.");
    return;
  }

  /*
   * Astro may initialize the script again during client-side navigation.
   * Clean up any previous instance before creating a new one.
   */
  if (typeof window.__primeFlowCleanup === "function") {
    window.__primeFlowCleanup();
  }

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("Prime flow background: 2D canvas is unavailable.");
    return;
  }

  const CONFIG = {
    primes: [2, 3, 5, 7, 11, 13],

    // More means a greater number of smaller vortices.
    K: 1.15,

    // Distance particles move during each rendered frame.
    speed: 1.4,

    // Speed at which the vector field changes over time.
    timeStep: 0.004,

    /*
     * One particle per approximately this many CSS pixels.
     * Lower values create more particles and use more processing power.
     */
    density: 1800,

    // Particle limits for performance.
    minDesktopParticles: 400,
    minMobileParticles: 220,
    maxParticles: 1400,

    minLife: 60,
    maxLife: 240,

    palette: {
      colors: [
        "#FF85B8", // accent
        "#1492FF", // links
        "#c2f486", // special
        "#a4c0f4", // code
        "#bebebe", // body text
      ],
      weights: [4, 4, 3, 2, 1],

      baseAlpha: 0.5,
      lineWidth: 1.2,
      fade: 0.15,
      composite: "source-over",
    },

    // Used to normalize particle brightness.
    maxSpeed: 1.8,

    // Maximum canvas pixel density.
    maxDevicePixelRatio: 1.5,

    // Target animation frame rate.
    framesPerSecond: 30,
  };

  const palette = CONFIG.palette;
  const primes = CONFIG.primes;

  let width = 0;
  let height = 0;
  let centerX = 0;
  let centerY = 0;
  let fieldScale = 1;
  let devicePixelRatio = 1;

  let backgroundColor = "#212121";
  let particles = [];
  let weightedColorPool = [];

  let fieldTime = 0;
  let animationFrameId = null;
  let running = false;
  let destroyed = false;
  let lastFrameTime = 0;

  const minimumFrameDuration = 1000 / CONFIG.framesPerSecond;

  const reduceMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const fieldVelocity = { x: 0, y: 0 };

  /*
   * Each prime wave receives an independent temporal drift and phase offset.
   * This prevents the complete pattern from visibly repeating during ordinary
   * viewing periods.
   */
  const driftX = primes.map((prime, index) => 0.18 + 0.05 * index);
  const driftY = primes.map((prime, index) => 0.13 + 0.045 * index);
  const phaseX = primes.map((prime) => prime * 0.7);
  const phaseY = primes.map((prime) => prime * 1.3);

  function readBackgroundColor() {
    const rootStyles = getComputedStyle(document.documentElement);

    backgroundColor =
      rootStyles.getPropertyValue("--background-color").trim() ||
      rootStyles.backgroundColor ||
      "#212121";
  }

  function buildWeightedColorPool() {
    weightedColorPool = [];

    palette.colors.forEach((color, index) => {
      const weight = palette.weights[index] || 1;

      for (let count = 0; count < weight; count += 1) {
        weightedColorPool.push(color);
      }
    });
  }

  function pickColor() {
    if (weightedColorPool.length === 0) {
      return palette.colors[0];
    }

    const index = Math.floor(Math.random() * weightedColorPool.length);
    return weightedColorPool[index];
  }

  function calculateField(x, y, time, output) {
    const normalizedX = (x - centerX) / fieldScale;
    const normalizedY = (y - centerY) / fieldScale;

    let horizontalVelocity = 0;
    let verticalVelocity = 0;

    for (let index = 0; index < primes.length; index += 1) {
      const prime = primes[index];

      const angleX =
        prime * CONFIG.K * normalizedX +
        driftX[index] * time +
        phaseX[index];

      const angleY =
        prime * CONFIG.K * normalizedY +
        driftY[index] * time +
        phaseY[index];

      const weight = 1 / prime;

      horizontalVelocity -=
        weight * Math.sin(angleX) * Math.sin(angleY);

      verticalVelocity -=
        weight * Math.cos(angleX) * Math.cos(angleY);
    }

    output.x = horizontalVelocity;
    output.y = verticalVelocity;
  }

  function spawnParticle(particle) {
    particle.x = Math.random() * width;
    particle.y = Math.random() * height;

    particle.life =
      CONFIG.minLife +
      Math.random() * (CONFIG.maxLife - CONFIG.minLife);

    /*
     * Begin particles at different points in their lifespan so they do not
     * all fade or respawn simultaneously.
     */
    particle.age = Math.random() * particle.life;
    particle.color = pickColor();
  }

  function createParticles() {
    const minimumParticles =
      width < 700
        ? CONFIG.minMobileParticles
        : CONFIG.minDesktopParticles;

    const desiredParticleCount = Math.round(
      (width * height) / CONFIG.density
    );

    const particleCount = Math.min(
      CONFIG.maxParticles,
      Math.max(minimumParticles, desiredParticleCount)
    );

    particles = new Array(particleCount);

    for (let index = 0; index < particleCount; index += 1) {
      const particle = {};
      spawnParticle(particle);
      particles[index] = particle;
    }
  }

  function paintBackdrop(alpha = 1) {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = alpha;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;
  }

  function resizeCanvas() {
    readBackgroundColor();

    devicePixelRatio = Math.min(
      window.devicePixelRatio || 1,
      CONFIG.maxDevicePixelRatio
    );

    width = window.innerWidth;
    height = window.innerHeight;

    /*
     * Canvas dimensions must be integers. CSS dimensions remain based on CSS
     * pixels, while the backing bitmap is scaled for limited high-DPI support.
     */
    canvas.width = Math.round(width * devicePixelRatio);
    canvas.height = Math.round(height * devicePixelRatio);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(
      devicePixelRatio,
      0,
      0,
      devicePixelRatio,
      0,
      0
    );

    centerX = width / 2;
    centerY = height / 2;
    fieldScale = Math.max(1, Math.min(width, height) * 0.42);

    paintBackdrop(1);
    createParticles();
  }

  function drawParticleStep(particle) {
    calculateField(
      particle.x,
      particle.y,
      fieldTime,
      fieldVelocity
    );

    const speed = Math.hypot(
      fieldVelocity.x,
      fieldVelocity.y
    );

    const nextX =
      particle.x + fieldVelocity.x * CONFIG.speed;

    const nextY =
      particle.y + fieldVelocity.y * CONFIG.speed;

    /*
     * Fade each particle in near birth and out near death.
     */
    const lifeFade =
      Math.min(
        particle.age,
        particle.life - particle.age
      ) / 18;

    const normalizedSpeed = Math.min(
      speed / CONFIG.maxSpeed,
      1
    );

    ctx.globalAlpha =
      palette.baseAlpha *
      (0.35 + 0.65 * normalizedSpeed) *
      Math.min(1, Math.max(0, lifeFade));

    ctx.strokeStyle = particle.color;

    ctx.beginPath();
    ctx.moveTo(particle.x, particle.y);
    ctx.lineTo(nextX, nextY);
    ctx.stroke();

    particle.x = nextX;
    particle.y = nextY;
    particle.age += 1;

    const outsideCanvas =
      nextX < -20 ||
      nextX > width + 20 ||
      nextY < -20 ||
      nextY > height + 20;

    if (particle.age >= particle.life || outsideCanvas) {
      spawnParticle(particle);
    }
  }

  function renderAnimationStep() {
    paintBackdrop(palette.fade);

    ctx.globalCompositeOperation = palette.composite;
    ctx.lineWidth = palette.lineWidth;
    ctx.lineCap = "round";

    for (let index = 0; index < particles.length; index += 1) {
      drawParticleStep(particles[index]);
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    fieldTime += CONFIG.timeStep;
  }

  function animationLoop(timestamp) {
    if (!running || destroyed) {
      return;
    }

    animationFrameId = requestAnimationFrame(animationLoop);

    if (timestamp - lastFrameTime < minimumFrameDuration) {
      return;
    }

    /*
     * Preserve a stable throttle even if the browser does not call rAF at an
     * exact multiple of the requested frame duration.
     */
    lastFrameTime =
      timestamp -
      ((timestamp - lastFrameTime) % minimumFrameDuration);

    renderAnimationStep();
  }

  function renderStaticFrame() {
    paintBackdrop(1);

    ctx.globalCompositeOperation = palette.composite;
    ctx.lineWidth = palette.lineWidth;
    ctx.lineCap = "round";

    const staticVelocity = { x: 0, y: 0 };

    for (let index = 0; index < particles.length; index += 1) {
      let x = particles[index].x;
      let y = particles[index].y;
      const color = particles[index].color;

      for (let segment = 0; segment < 90; segment += 1) {
        calculateField(x, y, 0, staticVelocity);

        const speed = Math.hypot(
          staticVelocity.x,
          staticVelocity.y
        );

        const nextX = x + staticVelocity.x * CONFIG.speed;
        const nextY = y + staticVelocity.y * CONFIG.speed;

        const normalizedSpeed = Math.min(
          speed / CONFIG.maxSpeed,
          1
        );

        ctx.globalAlpha =
          palette.baseAlpha *
          (0.25 + 0.6 * normalizedSpeed) *
          0.5;

        ctx.strokeStyle = color;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nextX, nextY);
        ctx.stroke();

        x = nextX;
        y = nextY;

        if (
          x < 0 ||
          x > width ||
          y < 0 ||
          y > height
        ) {
          break;
        }
      }
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function startAnimation() {
    if (destroyed) {
      return;
    }

    if (reduceMotionQuery.matches) {
      stopAnimation();
      renderStaticFrame();
      return;
    }

    if (running) {
      return;
    }

    running = true;
    lastFrameTime = performance.now();
    animationFrameId = requestAnimationFrame(animationLoop);
  }

  function stopAnimation() {
    running = false;

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function handleResize() {
    resizeCanvas();

    if (reduceMotionQuery.matches) {
      renderStaticFrame();
    }
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  }

  function handleMotionPreferenceChange() {
    stopAnimation();
    resizeCanvas();
    startAnimation();
  }

  function cleanup() {
    if (destroyed) {
      return;
    }

    destroyed = true;
    stopAnimation();

    window.removeEventListener("resize", handleResize);
    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    reduceMotionQuery.removeEventListener?.(
      "change",
      handleMotionPreferenceChange
    );

    if (window.__primeFlowCleanup === cleanup) {
      delete window.__primeFlowCleanup;
    }
  }

  window.addEventListener("resize", handleResize);

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );

  reduceMotionQuery.addEventListener?.(
    "change",
    handleMotionPreferenceChange
  );

  window.__primeFlowCleanup = cleanup;

  buildWeightedColorPool();
  resizeCanvas();
  startAnimation();
}

/*
 * Standard page loading and Astro client-side navigation are both supported.
 */
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializePrimeFlowBackground,
    { once: true }
  );
} else {
  initializePrimeFlowBackground();
}

document.addEventListener(
  "astro:page-load",
  initializePrimeFlowBackground
);
