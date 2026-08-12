/* ============================================================
   ACADEMIA SUKER — academia-nucleo.js  v=20260811
   Puerta de acceso, sesión y pantalla de "procesando datos".
   Se carga SIN defer en el <head>: decide antes del primer
   pintado si la página se muestra o se pide la contraseña,
   de modo que el contenido nunca parpadea.
   Sin dependencias externas. ~9 KB.
   ============================================================ */
(function (win, doc) {
  "use strict";

  var RAIZ  = doc.documentElement;
  var LLAVE = "suker_academia_sesion";
  var PAD   = win.ACADEMIA_USUARIOS || { cuentas: [], vueltas: 6000 };

  /* ══════════════════════════════════════════════════════════
     1. SHA-256 (implementación propia, funciona en cualquier
        navegador y también abriendo el archivo en local)
     ══════════════════════════════════════════════════════════ */
  var K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ];

  function rotd(x, n) { return (x >>> n) | (x << (32 - n)); }

  function aBytesUtf8(s) {
    var out = [], i, c;
    for (i = 0; i < s.length; i++) {
      c = s.charCodeAt(i);
      if (c < 0x80) { out.push(c); }
      else if (c < 0x800) { out.push(0xc0 | (c >> 6), 0x80 | (c & 63)); }
      else if (c < 0xd800 || c >= 0xe000) { out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63)); }
      else {
        i++;
        c = 0x10000 + (((c & 0x3ff) << 10) | (s.charCodeAt(i) & 0x3ff));
        out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      }
    }
    return out;
  }

  function hex8(n) {
    var s = (n >>> 0).toString(16);
    return "00000000".slice(s.length) + s;
  }

  function sha256(texto) {
    var b = aBytesUtf8(texto);
    var bits = b.length * 8;
    b.push(0x80);
    while (b.length % 64 !== 56) { b.push(0); }
    var alto = Math.floor(bits / 4294967296);
    b.push((alto >>> 24) & 255, (alto >>> 16) & 255, (alto >>> 8) & 255, alto & 255);
    b.push((bits >>> 24) & 255, (bits >>> 16) & 255, (bits >>> 8) & 255, bits & 255);

    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    var w = new Array(64);
    var i, t, a, bb, c, d, e, f, g, h, s0, s1, t1, t2;

    for (i = 0; i < b.length; i += 64) {
      for (t = 0; t < 16; t++) {
        w[t] = (b[i + 4*t] << 24) | (b[i + 4*t + 1] << 16) | (b[i + 4*t + 2] << 8) | b[i + 4*t + 3];
      }
      for (t = 16; t < 64; t++) {
        s0 = rotd(w[t-15], 7) ^ rotd(w[t-15], 18) ^ (w[t-15] >>> 3);
        s1 = rotd(w[t-2], 17) ^ rotd(w[t-2], 19) ^ (w[t-2] >>> 10);
        w[t] = (w[t-16] + s0 + w[t-7] + s1) | 0;
      }
      a = H[0]; bb = H[1]; c = H[2]; d = H[3]; e = H[4]; f = H[5]; g = H[6]; h = H[7];
      for (t = 0; t < 64; t++) {
        s1 = rotd(e, 6) ^ rotd(e, 11) ^ rotd(e, 25);
        t1 = (h + s1 + ((e & f) ^ (~e & g)) + K[t] + w[t]) | 0;
        s0 = rotd(a, 2) ^ rotd(a, 13) ^ rotd(a, 22);
        t2 = (s0 + ((a & bb) ^ (a & c) ^ (bb & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = bb; bb = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0;  H[1] = (H[1] + bb) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0;  H[5] = (H[5] + f) | 0;  H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    return H.map(hex8).join("");
  }

  /* Huella de la contraseña: encadenada para que probar claves
     a la fuerza cueste caro. Debe coincidir con la tool de alta. */
  function derivar(usuario, clave, sal, vueltas) {
    var h = sha256(sal + "|" + String(usuario).toLowerCase() + "|" + clave);
    for (var i = 1; i < (vueltas || 6000); i++) { h = sha256(h + "|" + sal); }
    return h;
  }

  /* ══════════════════════════════════════════════════════════
     2. PADRÓN Y SESIÓN
     ══════════════════════════════════════════════════════════ */
  /* Compara usuarios sin que estorben mayúsculas, espacios ni tildes */
  function normalizar(s) {
    var t = String(s == null ? "" : s).trim().toLowerCase();
    return t.normalize ? t.normalize("NFD").replace(/[̀-ͯ]/g, "") : t;
  }

  function buscarCuenta(usuario) {
    var u = normalizar(usuario), lista = PAD.cuentas || [], i;
    for (i = 0; i < lista.length; i++) {
      if (normalizar(lista[i].usuario) === u) { return lista[i]; }
    }
    return null;
  }

  function cuentaVigente(cuenta) {
    if (!cuenta || cuenta.estado !== "activa") { return false; }
    if (cuenta.expira) {
      var lim = Date.parse(cuenta.expira + "T23:59:59");
      if (!isNaN(lim) && Date.now() > lim) { return false; }
    }
    return true;
  }

  function guardarSesion(cuenta, recordar) {
    var horas = recordar
      ? (PAD.duracionRecordarDias || 30) * 24
      : (PAD.duracionSesionHoras || 12);
    var dato = {
      u: cuenta.usuario,
      n: cuenta.nombre || cuenta.usuario,
      b: cuenta.botica || "",
      r: cuenta.rol || "boticario",
      exp: Date.now() + horas * 3600000
    };
    var txt = JSON.stringify(dato);
    try {
      if (recordar) { win.localStorage.setItem(LLAVE, txt); }
      else { win.sessionStorage.setItem(LLAVE, txt); win.localStorage.removeItem(LLAVE); }
    } catch (e) { /* almacenamiento bloqueado: la sesión durará solo esta página */ }
    sesionActual = dato;
    return dato;
  }

  function leerSesion() {
    var txt = null, dato;
    try { txt = win.sessionStorage.getItem(LLAVE) || win.localStorage.getItem(LLAVE); }
    catch (e) { return null; }
    if (!txt) { return null; }
    try { dato = JSON.parse(txt); } catch (e) { return null; }
    if (!dato || !dato.u || !dato.exp || Date.now() > dato.exp) { borrarSesion(); return null; }
    if (!cuentaVigente(buscarCuenta(dato.u))) { borrarSesion(); return null; }
    return dato;
  }

  function borrarSesion() {
    try { win.sessionStorage.removeItem(LLAVE); win.localStorage.removeItem(LLAVE); } catch (e) {}
    sesionActual = null;
  }

  var sesionActual = leerSesion();

  /* ── Decisión antes del primer pintado ── */
  RAIZ.classList.add(sesionActual ? "ac-abierto" : "ac-cerrado", "ac-listo");

  /* ══════════════════════════════════════════════════════════
     3. PANTALLA "PROCESANDO DATOS"
     ══════════════════════════════════════════════════════════ */
  var sinMovimiento = win.matchMedia && win.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var Cargador = {
    nodo: null, txt: null, sub: null, pct: null, aro: null, etapas: null,

    montar: function () {
      if (this.nodo) { return this.nodo; }
      var d = doc.createElement("div");
      d.className = "ac-cargando";
      d.setAttribute("role", "status");
      d.setAttribute("aria-live", "polite");
      d.innerHTML =
        '<div class="ac-anillo">' +
          '<svg viewBox="0 0 116 116" aria-hidden="true">' +
            '<defs><linearGradient id="acDegradado" x1="0" y1="0" x2="1" y2="1">' +
              '<stop offset="0%" stop-color="#FFDD73"/><stop offset="100%" stop-color="#C9A020"/>' +
            '</linearGradient></defs>' +
            '<circle class="pista"  cx="58" cy="58" r="52"/>' +
            '<circle class="avance" cx="58" cy="58" r="52"/>' +
          '</svg>' +
          '<span class="ac-anillo-pct">0%</span>' +
        '</div>' +
        '<div class="ac-cargando-texto"></div>' +
        '<div class="ac-etapas"></div>' +
        '<div class="ac-cargando-sub">Academia Suker</div>';
      doc.body.appendChild(d);
      this.nodo   = d;
      this.txt    = d.querySelector(".ac-cargando-texto");
      this.sub    = d.querySelector(".ac-cargando-sub");
      this.pct    = d.querySelector(".ac-anillo-pct");
      this.aro    = d.querySelector(".avance");
      this.etapas = d.querySelector(".ac-etapas");
      return d;
    },

    /* pasos: array de textos · alTerminar: callback */
    correr: function (pasos, alTerminar) {
      var self = this;
      this.montar();
      this.etapas.innerHTML = "";
      pasos.forEach(function () {
        var s = doc.createElement("i");
        s.className = "ac-etapa";
        self.etapas.appendChild(s);
      });
      this.nodo.classList.add("is-visible");
      this.fijar(0, pasos[0] || "");

      var i = 0;
      var espera = sinMovimiento ? 120 : 380;

      function siguiente() {
        var marcas = self.etapas.children;
        if (marcas[i]) { marcas[i].classList.add("is-hecha"); }
        i++;
        if (i < pasos.length) {
          self.fijar(Math.round((i / pasos.length) * 100), pasos[i]);
          win.setTimeout(siguiente, espera + (sinMovimiento ? 0 : Math.random() * 190));
        } else {
          self.fijar(100, pasos[pasos.length - 1]);
          win.setTimeout(function () {
            if (typeof alTerminar === "function") { alTerminar(); }
          }, sinMovimiento ? 60 : 320);
        }
      }
      win.setTimeout(siguiente, espera);
    },

    fijar: function (porcentaje, texto) {
      if (this.aro) { this.aro.style.strokeDashoffset = String(326 - (326 * porcentaje) / 100); }
      if (this.pct) { this.pct.textContent = porcentaje + "%"; }
      if (texto != null && this.txt && this.txt.textContent !== texto) {
        var t = this.txt;
        t.classList.add("is-cambiando");
        win.setTimeout(function () { t.textContent = texto; t.classList.remove("is-cambiando"); }, sinMovimiento ? 0 : 150);
      }
    },

    cerrar: function () {
      if (!this.nodo) { return; }
      var n = this.nodo;
      n.classList.remove("is-visible");
      win.setTimeout(function () { n.style.display = ""; }, 320);
    }
  };

  var PASOS_ENTRADA = [
    "Verificando credenciales…",
    "Estableciendo canal seguro…",
    "Cargando tu plan de formación…",
    "Optimizando el contenido para tu conexión…",
    "Todo listo. Bienvenido."
  ];
  var PASOS_SALA = [
    "Preparando tu sala…",
    "Ordenando los módulos…",
    "Listo"
  ];

  /* ══════════════════════════════════════════════════════════
     4. FORMULARIO DE ACCESO
     ══════════════════════════════════════════════════════════ */
  var SALAS = { formales: "formales/", informales: "informales/" };

  function destinoPedido() {
    var m = /[?&]ir=([a-z]+)/.exec(win.location.search || "");
    return (m && SALAS[m[1]]) ? SALAS[m[1]] : null;
  }

  function avisar(caja, tipo, mensaje) {
    if (!caja) { return; }
    caja.className = "ac-aviso ac-aviso-" + tipo + " is-visible";
    caja.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      (tipo === "ok"
        ? '<path d="M20 6 9 17l-5-5"/>'
        : '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5h.01"/>') +
      '</svg><span></span>';
    caja.querySelector("span").textContent = mensaje;
  }

  function limpiarAviso(caja) { if (caja) { caja.className = "ac-aviso"; } }

  function conectarLogin() {
    var form = doc.getElementById("acFormulario");
    if (!form) { return; }

    var elUsuario = doc.getElementById("acUsuario");
    var elClave   = doc.getElementById("acClave");
    var elRecord  = doc.getElementById("acRecordar");
    var elAviso   = doc.getElementById("acAviso");
    var elBoton   = doc.getElementById("acEntrar");
    var elOjo     = doc.getElementById("acOjo");

    if (elOjo && elClave) {
      elOjo.addEventListener("click", function () {
        var oculto = elClave.type === "password";
        elClave.type = oculto ? "text" : "password";
        elOjo.setAttribute("aria-label", oculto ? "Ocultar contraseña" : "Mostrar contraseña");
        elOjo.setAttribute("aria-pressed", oculto ? "true" : "false");
        elClave.focus();
      });
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      limpiarAviso(elAviso);

      var usuario = (elUsuario.value || "").trim();
      var clave   = elClave.value || "";

      if (!usuario || !clave) {
        avisar(elAviso, "error", "Escribe tu usuario y tu contraseña para continuar.");
        (usuario ? elClave : elUsuario).focus();
        return;
      }

      var textoOriginal = elBoton.innerHTML;
      elBoton.disabled = true;
      elBoton.innerHTML = '<span class="ac-hilo" aria-hidden="true"></span> Verificando…';

      /* El cálculo de la huella bloquea unos milisegundos: lo
         aplazamos un tick para que el botón alcance a repintarse. */
      win.setTimeout(function () {
        var cuenta = buscarCuenta(usuario);
        var valida = false;

        if (cuenta) {
          try {
            valida = derivar(cuenta.usuario, clave, cuenta.sal, PAD.vueltas) === cuenta.hash;
          } catch (e) { valida = false; }
        }

        if (!valida || !cuentaVigente(cuenta)) {
          elBoton.disabled = false;
          elBoton.innerHTML = textoOriginal;
          elClave.value = "";
          if (cuenta && valida && !cuentaVigente(cuenta)) {
            avisar(elAviso, "error", "Tu acceso está suspendido o venció. Escríbenos por WhatsApp y lo reactivamos.");
          } else {
            avisar(elAviso, "error", "Usuario o contraseña incorrectos. Revisa que no haya espacios de más.");
          }
          elClave.focus();
          return;
        }

        guardarSesion(cuenta, !!(elRecord && elRecord.checked));

        Cargador.correr(PASOS_ENTRADA, function () {
          var ir = destinoPedido();
          if (ir) { win.location.replace(ir); return; }
          win.location.reload();
        });
      }, 60);
    });

    /* Foco cómodo al abrir */
    if (elUsuario && !elUsuario.value) { elUsuario.focus(); }
  }

  /* ══════════════════════════════════════════════════════════
     5. CABECERA: nombre, salida y navegación con transición
     ══════════════════════════════════════════════════════════ */
  function conectarCabecera() {
    var nom = doc.getElementById("acNombre");
    if (nom && sesionActual) { nom.textContent = sesionActual.n; }

    var salir = doc.getElementById("acSalir");
    if (salir) {
      salir.addEventListener("click", function (ev) {
        ev.preventDefault();
        borrarSesion();
        win.location.href = salir.getAttribute("data-destino") || "./";
      });
    }

    /* Enlaces internos que muestran la animación antes de saltar */
    var conTransicion = doc.querySelectorAll("[data-transicion]");
    Array.prototype.forEach.call(conTransicion, function (a) {
      a.addEventListener("click", function (ev) {
        if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) { return; }
        ev.preventDefault();
        var destino = a.getAttribute("href");
        Cargador.correr(PASOS_SALA, function () { win.location.href = destino; });
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     6. PROTECCIÓN DE LAS SALAS
     ══════════════════════════════════════════════════════════ */
  function protegerSala() {
    var sala = RAIZ.getAttribute("data-sala");
    if (!sala || sesionActual) { return; }
    /* Sin sesión: al portal, recordando a dónde quería entrar */
    win.location.replace("../?ir=" + encodeURIComponent(sala));
  }

  /* ══════════════════════════════════════════════════════════
     7. ARRANQUE
     ══════════════════════════════════════════════════════════ */
  protegerSala();

  function iniciar() {
    conectarLogin();
    conectarCabecera();
    /* Aviso discreto cuando el usuario venía de una sala */
    if (!sesionActual && destinoPedido()) {
      avisar(doc.getElementById("acAviso"), "ok", "Ingresa tus datos y te llevamos directo a la sala que abriste.");
    }
  }

  if (doc.readyState === "loading") { doc.addEventListener("DOMContentLoaded", iniciar); }
  else { iniciar(); }

  /* API pública (la usa academia-sala.js) */
  win.AcademiaSuker = {
    sesion: function () { return sesionActual; },
    salir: function () { borrarSesion(); },
    cargador: Cargador,
    sha256: sha256,
    derivar: derivar,
    sinMovimiento: sinMovimiento
  };

})(window, document);
