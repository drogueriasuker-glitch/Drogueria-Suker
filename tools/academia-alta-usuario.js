/* ============================================================
   ACADEMIA SUKER — alta de usuarios (herramienta interna)
   Genera la ficha lista para pegar en academia-usuarios.js.
   La contraseña nunca sale de este navegador: solo se calcula
   su huella con el mismo método que usa la Academia.
   ============================================================ */
(function (win, doc) {
  "use strict";

  var VUELTAS = (win.ACADEMIA_USUARIOS && win.ACADEMIA_USUARIOS.vueltas) || 6000;

  function sal(bytes) {
    var a = new Uint8Array(bytes || 8);
    if (win.crypto && win.crypto.getRandomValues) { win.crypto.getRandomValues(a); }
    else { for (var i = 0; i < a.length; i++) { a[i] = Math.floor(Math.random() * 256); } }
    return Array.prototype.map.call(a, function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
  }

  function claveSugerida() {
    var silabas = ["Su", "Ker", "An", "Puno", "Ju", "lia", "Bo", "ti", "Far", "Al", "ti", "Sur"];
    var p = "";
    for (var i = 0; i < 3; i++) { p += silabas[Math.floor(Math.random() * silabas.length)]; }
    return p + (2026 + Math.floor(Math.random() * 3)) + "*";
  }

  function hoy() {
    var d = new Date();
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }

  function texto(id) { return (doc.getElementById(id).value || "").trim(); }

  function arrancar() {
    var salida    = doc.getElementById("tSalida");
    var bloque    = doc.getElementById("tBloque");
    var resumen   = doc.getElementById("tResumen");
    var btnGenera = doc.getElementById("tGenerar");
    var btnClave  = doc.getElementById("tDado");
    var btnCopiar = doc.getElementById("tCopiar");

    btnClave.addEventListener("click", function () {
      doc.getElementById("tClave").value = claveSugerida();
    });

    btnGenera.addEventListener("click", function () {
      var usuario = texto("tUsuario").toLowerCase();
      var clave   = texto("tClave");
      var nombre  = texto("tNombre")  || "Boticario";
      var botica  = texto("tBotica")  || "—";
      var ciudad  = texto("tCiudad")  || "Juliaca";
      var rol     = doc.getElementById("tRol").value;
      var expira  = texto("tExpira");

      if (!usuario || !clave) {
        alert("Escribe el usuario y la contraseña.");
        return;
      }
      if (!/^[a-z0-9._-]+$/.test(usuario)) {
        alert("El usuario solo puede llevar letras minúsculas, números, punto, guion y guion bajo.\nEjemplo: botica.sanmartin");
        return;
      }

      btnGenera.disabled = true;
      btnGenera.textContent = "Calculando…";

      win.setTimeout(function () {
        var s = sal(8);
        var h = win.AcademiaSuker.derivar(usuario, clave, s, VUELTAS);

        bloque.textContent =
          '    {\n' +
          '      usuario: "' + usuario + '",\n' +
          '      nombre:  "' + nombre + '",\n' +
          '      botica:  "' + botica + '",\n' +
          '      ciudad:  "' + ciudad + '",\n' +
          '      rol:     "' + rol + '",\n' +
          '      estado:  "activa",\n' +
          '      expira:  ' + (expira ? '"' + expira + '"' : "null") + ',\n' +
          '      sal:     "' + s + '",\n' +
          '      hash:    "' + h + '",\n' +
          '      alta:    "' + hoy() + '"\n' +
          '    },';

        resumen.textContent =
          "Entregar al boticario →   usuario: " + usuario + "   ·   contraseña: " + clave;

        salida.hidden = false;
        btnGenera.disabled = false;
        btnGenera.textContent = "Generar ficha";
        salida.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 40);
    });

    btnCopiar.addEventListener("click", function () {
      var t = bloque.textContent;
      function ok() {
        btnCopiar.textContent = "¡Copiado!";
        win.setTimeout(function () { btnCopiar.textContent = "Copiar ficha"; }, 1800);
      }
      if (win.navigator.clipboard && win.navigator.clipboard.writeText) {
        win.navigator.clipboard.writeText(t).then(ok, function () { alert("Copia el texto a mano."); });
      } else {
        var ta = doc.createElement("textarea");
        ta.value = t;
        doc.body.appendChild(ta);
        ta.select();
        try { doc.execCommand("copy"); ok(); } catch (e) { alert("Copia el texto a mano."); }
        doc.body.removeChild(ta);
      }
    });
  }

  if (doc.readyState === "loading") { doc.addEventListener("DOMContentLoaded", arrancar); }
  else { arrancar(); }

})(window, document);
