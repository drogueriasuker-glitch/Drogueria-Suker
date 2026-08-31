/* ============================================================
   ACADEMIA SUKER — academia-escenas.js  v=20260813
   Tres cosas pequeñas para las tarjetas de ruta:

   1. Inclinar la escena hacia el cursor (solo en computadora).
      JavaScript NO anima nada: se limita a escribir dos variables
      CSS y es la transición de la hoja de estilos la que mueve.
   2. Pausar los bucles cuando la tarjeta sale de pantalla, para
      no gastar batería ni procesador en el celular.
   3. Hundir la tarjeta al tocarla, antes de navegar.

   Sin dependencias. ~2 KB.
   ============================================================ */
(function (win, doc) {
  "use strict";

  var GRADOS = 8;   /* inclinación máxima, como pide el diseño */

  var sinMovimiento = win.matchMedia &&
                      win.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var conCursor = win.matchMedia &&
                  win.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function iniciar() {
    var rutas = doc.querySelectorAll(".ac-ruta");
    if (!rutas.length) { return; }

    /* ---- 1. Inclinación hacia el cursor ---- */
    if (conCursor && !sinMovimiento) {
      Array.prototype.forEach.call(rutas, function (tarjeta) {
        var escena = tarjeta.querySelector(".ac-escena");
        var capa3d = tarjeta.querySelector(".ac-escena-3d");
        if (!escena || !capa3d) { return; }

        escena.addEventListener("pointermove", function (ev) {
          var caja = escena.getBoundingClientRect();
          /* -1 a 1 dentro de la escena */
          var px = (ev.clientX - caja.left) / caja.width * 2 - 1;
          var py = (ev.clientY - caja.top) / caja.height * 2 - 1;
          capa3d.style.setProperty("--ry", (px * GRADOS).toFixed(2) + "deg");
          capa3d.style.setProperty("--rx", (-py * GRADOS).toFixed(2) + "deg");
        });

        escena.addEventListener("pointerleave", function () {
          capa3d.style.setProperty("--ry", "0deg");
          capa3d.style.setProperty("--rx", "0deg");
        });
      });
    }

    /* ---- 2. Fuera de pantalla, los bucles se detienen ---- */
    if (win.IntersectionObserver) {
      var vigia = new win.IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          e.target.classList.toggle("is-fuera", !e.isIntersecting);
        });
      }, { rootMargin: "120px 0px" });

      Array.prototype.forEach.call(doc.querySelectorAll(".ac-escena"), function (e) {
        vigia.observe(e);
      });
    }

    /* ---- 3. Precargar las rutas, salvo con ahorro de datos ----
       Asi el clic en una tarjeta se siente instantaneo, pero a quien
       paga sus megas no le gastamos ni uno de mas. */
    var con = win.navigator.connection || win.navigator.mozConnection || win.navigator.webkitConnection;
    if (!(con && con.saveData)) {
      win.setTimeout(function () {
        Array.prototype.forEach.call(doc.querySelectorAll(".ac-ruta-enlace"), function (a) {
          var l = doc.createElement("link");
          l.rel = "prefetch";
          l.href = a.getAttribute("href");
          doc.head.appendChild(l);
        });
      }, 1200);   /* despues de que la portada ya este pintada */
    }

    /* ---- 4. Al tocar, la tarjeta se hunde ---- */
    Array.prototype.forEach.call(rutas, function (tarjeta) {
      function hundir()   { tarjeta.classList.add("is-tocada"); }
      function soltar()   { tarjeta.classList.remove("is-tocada"); }
      tarjeta.addEventListener("pointerdown", hundir);
      tarjeta.addEventListener("pointerup", soltar);
      tarjeta.addEventListener("pointercancel", soltar);
      tarjeta.addEventListener("pointerleave", soltar);
    });
  }

  if (doc.readyState === "loading") { doc.addEventListener("DOMContentLoaded", iniciar); }
  else { iniciar(); }

})(window, document);
