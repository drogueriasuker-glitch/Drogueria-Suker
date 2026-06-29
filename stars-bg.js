/* ============================================================
   DROGUERÍA SUKER — stars-bg.js  (v=20260616a)
   Campo de estrellas de fondo para TODA la página.
   - Canvas fijo (position:fixed) detrás de todo el contenido.
   - Estrellas "flotantes": titilan y derivan muy lento en su sitio.
   - Estrellas "viajeras": cruzan la pantalla de un lado a otro con estela.
   - No interrumpe el texto (pointer-events:none, z-index detrás).
   - Pausa con la pestaña oculta y respeta prefers-reduced-motion.
   IIFE, sin módulos, sin dependencias.
   ============================================================ */
(function () {
  "use strict";

  function boot() {
    var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    var canvas = document.createElement("canvas");
    canvas.className = "starfield-bg";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var w = 0, h = 0, dpr = 1;
    var floaters = [];   // estrellas que flotan/titilan
    var travelers = [];  // estrellas que cruzan la pantalla

    /* ── Tamaño + densidad responsiva ── */
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildFloaters();
    }

    function buildFloaters() {
      var count = Math.round((w * h) / 8500);
      count = Math.max(50, Math.min(170, count));
      if (reduced) count = Math.min(count, 70);
      floaters = [];
      for (var i = 0; i < count; i++) {
        floaters.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.3 + 0.4,
          baseA: Math.random() * 0.45 + 0.22,
          tw: Math.random() * Math.PI * 2,         // fase de parpadeo
          twSpeed: Math.random() * 1.4 + 0.4,      // velocidad de parpadeo
          dx: (Math.random() - 0.5) * 0.05,         // deriva lenta horizontal
          dy: (Math.random() - 0.5) * 0.05,         // deriva lenta vertical
          gold: Math.random() < 0.28                // ~28% doradas
        });
      }
    }

    /* ── Estrella viajera (cruza de un lado al otro) ── */
    function spawnTraveler() {
      var dir = Math.random() < 0.5 ? 1 : -1;
      var speed = Math.random() * 70 + 55;          // px/s
      travelers.push({
        x: dir === 1 ? -30 : w + 30,
        y: Math.random() * h * 0.9,
        vx: dir * speed,
        vy: (Math.random() - 0.5) * 16,
        r: Math.random() * 1.1 + 0.7,
        len: Math.random() * 70 + 45,               // largo de la estela
        a: Math.random() * 0.35 + 0.5,
        gold: Math.random() < 0.5
      });
    }

    /* ── Dibujo ── */
    function drawStar(x, y, r, a, gold) {
      if (a <= 0) return;
      var col = gold ? "240,203,80" : "255,255,255";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + col + "," + a + ")";
      ctx.fill();
      if (r > 1) { // halo sutil en las más grandes
        ctx.beginPath();
        ctx.arc(x, y, r * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + col + "," + (a * 0.12) + ")";
        ctx.fill();
      }
    }

    function drawTraveler(tr) {
      var col = tr.gold ? "240,203,80" : "255,255,255";
      var sp = Math.max(Math.abs(tr.vx), 1);
      var ux = tr.vx / sp, uy = tr.vy / sp;
      var tailX = tr.x - ux * tr.len;
      var tailY = tr.y - uy * tr.len;
      var grad = ctx.createLinearGradient(tr.x, tr.y, tailX, tailY);
      grad.addColorStop(0, "rgba(" + col + "," + tr.a + ")");
      grad.addColorStop(1, "rgba(" + col + ",0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = tr.r;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(tr.x, tr.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
      // cabeza brillante
      ctx.beginPath();
      ctx.arc(tr.x, tr.y, tr.r * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + col + "," + Math.min(1, tr.a + 0.25) + ")";
      ctx.fill();
    }

    /* ── Bucle ── */
    var last = performance.now();
    var travelTimer = 0;
    var nextTravel = Math.random() * 2.5 + 1.2;
    var rafId = null;
    var running = false;

    function frame(now) {
      rafId = null;
      var dt = (now - last) / 1000; last = now;
      if (dt > 0.1) dt = 0.1;
      var t = now / 1000;

      ctx.clearRect(0, 0, w, h);

      // Flotantes
      for (var i = 0; i < floaters.length; i++) {
        var s = floaters[i];
        s.x += s.dx; s.y += s.dy;
        if (s.x < 0) s.x = w; else if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h; else if (s.y > h) s.y = 0;
        var a = s.baseA + Math.sin(t * s.twSpeed + s.tw) * 0.25;
        drawStar(s.x, s.y, s.r, a, s.gold);
      }

      // Viajeras: aparición espaciada
      travelTimer += dt;
      if (travelTimer >= nextTravel) {
        travelTimer = 0;
        nextTravel = Math.random() * 3.5 + 1.4;
        spawnTraveler();
      }
      for (var j = travelers.length - 1; j >= 0; j--) {
        var tr = travelers[j];
        tr.x += tr.vx * dt; tr.y += tr.vy * dt;
        drawTraveler(tr);
        if (tr.x < -120 || tr.x > w + 120) travelers.splice(j, 1);
      }

      loop();
    }

    function loop() { if (rafId == null && running) rafId = requestAnimationFrame(frame); }
    function start() { if (!running) { running = true; last = performance.now(); loop(); } }
    function stop()  { running = false; if (rafId != null) { cancelAnimationFrame(rafId); rafId = null; } }

    /* ── Toma estática (sin movimiento) ── */
    function drawStatic() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < floaters.length; i++) {
        var s = floaters[i];
        drawStar(s.x, s.y, s.r, s.baseA, s.gold);
      }
    }

    /* ── Eventos ── */
    window.addEventListener("resize", function () {
      resize();
      if (reduced) drawStatic();
    }, { passive: true });

    document.addEventListener("visibilitychange", function () {
      if (reduced) return;
      if (document.hidden) stop(); else start();
    });

    resize();
    if (reduced) drawStatic(); else start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
