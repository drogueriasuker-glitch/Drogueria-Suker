/* ============================================================
   fx.js — Efectos premium: tilt 3D, botones magnéticos y parallax.
   Sin dependencias, patrón IIFE. Usa pointer events + rAF.
   Respeta prefers-reduced-motion y solo actúa con puntero fino (mouse).
   ============================================================ */
(function () {
  "use strict";

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer =
    window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  // En táctil o con movimiento reducido no aplicamos estos efectos.
  if (reduce || !finePointer) return;

  var EASE_OUT = "transform .5s cubic-bezier(.22,1,.36,1)";

  /* ---------- 1. Tilt 3D en tarjetas [data-tilt] ---------- */
  function initTilt() {
    var els = document.querySelectorAll("[data-tilt]");
    Array.prototype.forEach.call(els, function (el) {
      var maxTilt = parseFloat(el.getAttribute("data-tilt")) || 9;
      var raf = null;
      var rect = null;

      function onEnter() {
        rect = el.getBoundingClientRect();
        el.style.transition = "transform .12s ease-out";
      }
      function onMove(e) {
        if (!rect) rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width; // 0..1
        var py = (e.clientY - rect.top) / rect.height; // 0..1
        var ry = (px - 0.5) * 2 * maxTilt; // rotateY
        var rx = (0.5 - py) * 2 * maxTilt; // rotateX
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          el.style.transform =
            "perspective(1000px) rotateX(" +
            rx.toFixed(2) +
            "deg) rotateY(" +
            ry.toFixed(2) +
            "deg) translateZ(0) scale(1.03)";
          el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
          el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
        });
      }
      function onLeave() {
        rect = null;
        if (raf) cancelAnimationFrame(raf);
        el.style.transition = EASE_OUT;
        el.style.transform = "";
        el.style.removeProperty("--gx");
        el.style.removeProperty("--gy");
      }

      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
    });
  }

  /* ---------- 2. Botones magnéticos [data-magnetic] ---------- */
  function initMagnetic() {
    var els = document.querySelectorAll("[data-magnetic]");
    Array.prototype.forEach.call(els, function (el) {
      var strength = parseFloat(el.getAttribute("data-magnetic")) || 0.3;
      var raf = null;
      var rect = null;

      function onEnter() {
        rect = el.getBoundingClientRect();
        el.style.transition = "transform .15s ease-out";
      }
      function onMove(e) {
        if (!rect) rect = el.getBoundingClientRect();
        var mx = (e.clientX - (rect.left + rect.width / 2)) * strength;
        var my = (e.clientY - (rect.top + rect.height / 2)) * strength;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          el.style.transform =
            "translate(" + mx.toFixed(1) + "px," + my.toFixed(1) + "px) scale(1.04)";
        });
      }
      function onLeave() {
        rect = null;
        if (raf) cancelAnimationFrame(raf);
        el.style.transition = EASE_OUT;
        el.style.transform = "";
      }

      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
    });
  }

  /* ---------- 3. Parallax 3D del panel del hero ---------- */
  function initHeroParallax() {
    var hero = document.querySelector(".hero");
    var panel = document.getElementById("hero3d");
    if (!hero || !panel) return;
    var raf = null;

    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
      var py = (e.clientY - r.top) / r.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        panel.classList.remove("fx-parallax-reset");
        panel.style.transform =
          "perspective(1300px) rotateY(" +
          (px * 6).toFixed(2) +
          "deg) rotateX(" +
          (-py * 6).toFixed(2) +
          "deg) translate3d(" +
          (px * 16).toFixed(1) +
          "px," +
          (py * 16).toFixed(1) +
          "px,0)";
      });
    });

    hero.addEventListener("pointerleave", function () {
      if (raf) cancelAnimationFrame(raf);
      panel.classList.add("fx-parallax-reset");
      panel.style.transform = "";
    });
  }

  function init() {
    initTilt();
    initMagnetic();
    initHeroParallax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
