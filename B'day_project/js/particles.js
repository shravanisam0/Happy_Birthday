/* ============================================
   DOODLE SYSTEM — Hand-Drawn Particle Engine
   Replaces ParticleSystem with sketch-style effects
   ============================================ */

class DoodleSystem {
  constructor() {
    this.canvas = document.getElementById('doodle-canvas');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'doodle-canvas';
      document.body.prepend(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.running = false;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // ---------- Pencil Dots (replaces stars) ----------
  createDots(count = 40) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'dot',
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.15 + 0.05,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      });
    }
  }

  // ---------- Scribble Circles (replaces sparkles) ----------
  createScribbles(count = 8) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'scribble',
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 12 + 6,
        opacity: Math.random() * 0.06 + 0.02,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.005,
        vy: (Math.random() - 0.5) * 0.2,
        vx: (Math.random() - 0.5) * 0.2,
        wobble: Math.random() * 4,
      });
    }
  }

  // ---------- Doodle Hearts (replaces floating hearts) ----------
  createDoodleHearts(count = 6) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'heart',
        x: Math.random() * this.canvas.width,
        y: this.canvas.height + Math.random() * 200,
        size: Math.random() * 10 + 8,
        opacity: Math.random() * 0.12 + 0.04,
        vy: -(Math.random() * 0.4 + 0.15),
        vx: (Math.random() - 0.5) * 0.3,
        rotation: (Math.random() - 0.5) * 0.3,
        rotSpeed: (Math.random() - 0.5) * 0.01,
      });
    }
  }

  // Backwards compatibility aliases
  createStars(n) { this.createDots(Math.min(n, 50)); }
  createSparkles(n) { this.createScribbles(Math.min(n, 12)); }
  createFloatingHearts(n) { this.createDoodleHearts(Math.min(n, 8)); }
  createBalloons() { this.createScribbles(4); }
  startConfettiRain() { this._confettiRain = true; this._confettiTimer = 0; }

  // ---------- Paper Scrap Burst (replaces confetti burst) ----------
  burstPaperScraps(x, y, count = 30) {
    const colors = ['#ff4d4d', '#2d5da1', '#2d2d2d', '#e5e0d8', '#fff9c4', '#ff8a80', '#81d4fa'];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 5 + 2;
      this.particles.push({
        type: 'scrap',
        x: x,
        y: y,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        gravity: 0.08,
        opacity: 1,
        life: 1,
        decay: Math.random() * 0.008 + 0.005,
      });
    }
  }

  // Backwards compatibility
  burstConfetti(x, y, count) { this.burstPaperScraps(x, y, count); }

  // ---------- Doodle Burst (replaces fireworks) ----------
  launchDoodleBurst() {
    const x = Math.random() * this.canvas.width * 0.6 + this.canvas.width * 0.2;
    const y = Math.random() * this.canvas.height * 0.4 + this.canvas.height * 0.1;
    const colors = ['#ff4d4d', '#2d5da1', '#2d2d2d', '#fff9c4'];

    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const speed = Math.random() * 2 + 1;
      this.particles.push({
        type: 'doodleStar',
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        opacity: 1,
        life: 1,
        decay: Math.random() * 0.01 + 0.008,
      });
    }
  }

  // Backwards compatibility
  launchFirework() { this.launchDoodleBurst(); }

  // ---------- Render Loop ----------
  start() {
    if (this.running) return;
    this.running = true;
    this._animate();
  }

  _animate() {
    if (!this.running) return;
    requestAnimationFrame(() => this._animate());

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Confetti rain spawner
    if (this._confettiRain) {
      this._confettiTimer++;
      if (this._confettiTimer % 15 === 0) {
        const colors = ['#ff4d4d', '#2d5da1', '#fff9c4', '#e5e0d8', '#ff8a80'];
        this.particles.push({
          type: 'scrap',
          x: Math.random() * this.canvas.width,
          y: -10,
          w: Math.random() * 6 + 3,
          h: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 1,
          vy: Math.random() * 1.5 + 0.5,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.06,
          gravity: 0.01,
          opacity: 0.7,
          life: 1,
          decay: 0.001,
        });
      }
    }

    // Update & draw
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      switch (p.type) {
        case 'dot':
          this._updateDot(p);
          this._drawDot(p);
          break;
        case 'scribble':
          this._updateScribble(p);
          this._drawScribble(p);
          break;
        case 'heart':
          this._updateHeart(p);
          this._drawHeart(p);
          break;
        case 'scrap':
          this._updateScrap(p);
          this._drawScrap(p);
          if (p.life <= 0) { this.particles.splice(i, 1); }
          break;
        case 'doodleStar':
          this._updateDoodleStar(p);
          this._drawDoodleStar(p);
          if (p.life <= 0) { this.particles.splice(i, 1); }
          break;
      }
    }
  }

  // --- Dot ---
  _updateDot(p) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = this.canvas.width;
    if (p.x > this.canvas.width) p.x = 0;
    if (p.y < 0) p.y = this.canvas.height;
    if (p.y > this.canvas.height) p.y = 0;
  }

  _drawDot(p) {
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(45, 45, 45, ${p.opacity})`;
    this.ctx.fill();
  }

  // --- Scribble Circle ---
  _updateScribble(p) {
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotSpeed;
    if (p.x < -50) p.x = this.canvas.width + 50;
    if (p.x > this.canvas.width + 50) p.x = -50;
    if (p.y < -50) p.y = this.canvas.height + 50;
    if (p.y > this.canvas.height + 50) p.y = -50;
  }

  _drawScribble(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.beginPath();
    // Draw a wobbly circle
    for (let a = 0; a < Math.PI * 2; a += 0.3) {
      const r = p.size + Math.sin(a * 3 + p.wobble) * 2;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (a === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = `rgba(45, 45, 45, ${p.opacity})`;
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();
    this.ctx.restore();
  }

  // --- Doodle Heart ---
  _updateHeart(p) {
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotSpeed;
    // Reset when off screen
    if (p.y < -50) {
      p.y = this.canvas.height + 50;
      p.x = Math.random() * this.canvas.width;
    }
  }

  _drawHeart(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.beginPath();
    const s = p.size;
    // Simple heart shape
    this.ctx.moveTo(0, s * 0.3);
    this.ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.5, -s, 0, -s * 0.5);
    this.ctx.bezierCurveTo(s * 0.5, -s, s, -s * 0.3, 0, s * 0.3);
    this.ctx.strokeStyle = `rgba(255, 77, 77, ${p.opacity})`;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.restore();
  }

  // --- Paper Scrap ---
  _updateScrap(p) {
    p.vx *= 0.99;
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotSpeed;
    p.life -= p.decay;
    p.opacity = Math.max(0, p.life);
  }

  _drawScrap(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.globalAlpha = p.opacity;
    this.ctx.fillStyle = p.color;
    this.ctx.strokeStyle = '#2d2d2d';
    this.ctx.lineWidth = 1;
    // Slightly irregular rectangle
    this.ctx.beginPath();
    this.ctx.moveTo(-p.w / 2 + 1, -p.h / 2);
    this.ctx.lineTo(p.w / 2, -p.h / 2 + 1);
    this.ctx.lineTo(p.w / 2 - 1, p.h / 2);
    this.ctx.lineTo(-p.w / 2, p.h / 2 - 1);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();
  }

  // --- Doodle Star Burst ---
  _updateDoodleStar(p) {
    p.vx *= 0.97;
    p.vy *= 0.97;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotSpeed;
    p.life -= p.decay;
    p.opacity = Math.max(0, p.life);
  }

  _drawDoodleStar(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.globalAlpha = p.opacity;

    // Draw a 4-point star
    this.ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const r = i % 2 === 0 ? p.size : p.size * 0.4;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.closePath();
    this.ctx.fillStyle = p.color;
    this.ctx.strokeStyle = '#2d2d2d';
    this.ctx.lineWidth = 1.5;
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();
  }
}

// Backwards compatibility: expose as ParticleSystem too
const ParticleSystem = DoodleSystem;
