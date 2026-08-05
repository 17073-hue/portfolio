/*
  sparkles.js
  ---------------------------------------------------------------
  วาดผงเกล็ดดาว/กากเพชรลอยตกลงมาเบาๆ พร้อมประกายระยิบระยับ
  ลงบน <canvas id="sparkles"> ที่วางไว้ในทุกหน้า
  ไม่ต้องแก้ไฟล์นี้ — ทำงานอัตโนมัติเมื่อโหลดหน้าเว็บ
  ---------------------------------------------------------------
*/
(function () {
  var canvas = document.getElementById('sparkles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var particles = [];
  var width, height, dpr;

  var COLORS = ['#f7a8c4', '#e0578f', '#cf9a49', '#f3d999', '#cba9e4', '#ffffff'];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildParticles();
  }

  function buildParticles() {
    var count = Math.round((width * height) / 16000);
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(makeParticle(Math.random() * height));
    }
  }

  function makeParticle(startY) {
    return {
      x: Math.random() * width,
      y: startY,
      r: Math.random() * 2 + 0.8,
      speed: Math.random() * 0.35 + 0.12,
      sway: Math.random() * 0.6 + 0.2,
      swayPhase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      star: Math.random() < 0.35
    };
  }

  function drawStar(cx, cy, r, alpha, color) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);
    ctx.beginPath();
    for (var i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(r * 0.3, r * 0.3, r, 0);
      ctx.quadraticCurveTo(r * 0.3, -r * 0.3, 0, 0);
    }
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function draw(t) {
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var twinkle = 0.4 + 0.6 * Math.sin(t * p.twinkleSpeed + p.twinklePhase);
      var px = p.x + Math.sin(t * 0.001 + p.swayPhase) * p.sway * 18;

      if (p.star) {
        drawStar(px, p.y, p.r * 2.4, Math.max(twinkle, 0.15), p.color);
      } else {
        ctx.beginPath();
        ctx.globalAlpha = Math.max(twinkle, 0.15);
        ctx.fillStyle = p.color;
        ctx.arc(px, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) {
        p.y += p.speed;
        if (p.y > height + 10) {
          particles[i] = makeParticle(-10);
        }
      }
    }
    ctx.globalAlpha = 1;

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();

  if (reduceMotion) {
    draw(0); // single static frame, gentle sparkle without movement
  } else {
    requestAnimationFrame(draw);
  }
})();
