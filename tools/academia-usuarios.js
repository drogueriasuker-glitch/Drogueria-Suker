/* ============================================================
   ACADEMIA SUKER — Panel de accesos (uso interno)
   Crea boticarios en el Excel de accesos y lista los que ya
   existen. Requiere la clave de administrador, que se comprueba
   en el servidor de Google: aquí no se guarda nada.
   ============================================================ */
(function (win, doc) {
  "use strict";

  var CONF = win.ACADEMIA_CONFIG || {};
  var LLAVE_ADMIN = "suker_academia_admin";   // solo durante esta pestaña

  function $(id) { return doc.getElementById(id); }
  function val(id) { return ($(id).value || "").trim(); }

  function esc(t) {
    return String(t == null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function claveAdmin() {
    try { return win.sessionStorage.getItem(LLAVE_ADMIN) || ""; } catch (e) { return ""; }
  }
  function guardarClaveAdmin(c) {
    try { win.sessionStorage.setItem(LLAVE_ADMIN, c); } catch (e) {}
  }

  function avisar(tipo, mensaje) {
    var caja = $("uAviso");
    caja.className = "ac-aviso ac-aviso-" + tipo + " is-visible";
    caja.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      (tipo === "ok" ? '<path d="M20 6 9 17l-5-5"/>'
                     : '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5h.01"/>') +
      '</svg><span></span>';
    caja.querySelector("span").textContent = mensaje;
  }
  function limpiarAviso() { $("uAviso").className = "ac-aviso"; }

  /* ---------- Llamadas al Excel ---------- */
  function pedir(datos) {
    if (!CONF.endpoint) {
      return win.Promise.resolve({ ok: false, error: "sin_endpoint" });
    }
    var cuerpo = new win.URLSearchParams();
    Object.keys(datos).forEach(function (k) { cuerpo.append(k, datos[k]); });

    return win.fetch(CONF.endpoint, { method: "POST", body: cuerpo })
      .then(function (r) { return r.ok ? r.json() : { ok: false, error: "respuesta_" + r.status }; })
      .catch(function () { return { ok: false, error: "sin_conexion" }; });
  }

  var MENSAJES = {
    sin_endpoint:     "Falta pegar la dirección del Excel en assets/academia/academia-config.js.",
    sin_conexion:     "No se pudo contactar con Google. Revisa tu internet y que la aplicación web esté publicada para «Cualquier persona».",
    admin_invalido:   "La clave de administrador no es correcta.",
    usuario_invalido: "El usuario solo puede llevar minúsculas, números, punto, guion y guion bajo.",
    usuario_repetido: "Ese usuario ya existe en el Excel.",
    clave_corta:      "La contraseña debe tener al menos 6 caracteres.",
    faltan_datos:     "Faltan el usuario o la contraseña.",
    no_existe:        "Ese usuario no está en el Excel."
  };
  function explicar(e) { return MENSAJES[e] || ("No se pudo completar la operación (" + e + ")."); }

  /* ---------- Sugerir contraseña ---------- */
  function claveSugerida() {
    var trozos = ["Su", "Ker", "Puno", "Ju", "lia", "Bo", "ti", "Far", "Al", "ti", "Sur", "An"];
    var p = "";
    for (var i = 0; i < 3; i++) { p += trozos[Math.floor(Math.random() * trozos.length)]; }
    return p + (2026 + Math.floor(Math.random() * 3)) + "*";
  }

  /* ---------- Crear ---------- */
  function crear() {
    limpiarAviso();
    var admin = val("uAdmin");
    if (!admin) { avisar("error", "Escribe la clave de administrador."); $("uAdmin").focus(); return; }
    if (!val("uUsuario") || !val("uClave")) {
      avisar("error", "El usuario y la contraseña son obligatorios.");
      return;
    }

    var boton = $("uCrear");
    boton.disabled = true;
    boton.innerHTML = '<span class="ac-hilo" aria-hidden="true"></span> Guardando…';

    pedir({
      accion:  "crear",
      admin:   admin,
      usuario: val("uUsuario").toLowerCase(),
      clave:   val("uClave"),
      nombre:  val("uNombre") || "Boticario",
      botica:  val("uBotica"),
      ciudad:  val("uCiudad"),
      rol:     $("uRol").value,
      vence:   val("uVence"),
      notas:   val("uNotas")
    }).then(function (r) {
      boton.disabled = false;
      boton.textContent = "Crear acceso";

      if (!r.ok) { avisar("error", explicar(r.error)); return; }

      guardarClaveAdmin(admin);
      avisar("ok", "Listo. Entrega estos datos al boticario →  usuario: " + r.usuario + "   ·   contraseña: " + r.clave);
      ["uUsuario", "uClave", "uNombre", "uBotica", "uNotas"].forEach(function (id) { $(id).value = ""; });
      listar();
    });
  }

  /* ---------- Listar ---------- */
  function listar() {
    var admin = val("uAdmin") || claveAdmin();
    if (!admin) { avisar("error", "Escribe la clave de administrador para ver el padrón."); return; }

    var caja = $("uTabla");
    caja.innerHTML = '<p class="u-vacio">Consultando el Excel…</p>';

    pedir({ accion: "listar", admin: admin }).then(function (r) {
      if (!r.ok) {
        caja.innerHTML = '<p class="u-vacio">' + esc(explicar(r.error)) + '</p>';
        return;
      }
      guardarClaveAdmin(admin);
      $("uTotal").textContent = r.total + (r.total === 1 ? " acceso" : " accesos");

      if (!r.cuentas.length) {
        caja.innerHTML = '<p class="u-vacio">Todavía no hay ningún acceso creado.</p>';
        return;
      }

      caja.innerHTML =
        '<table class="u-tabla"><thead><tr>' +
          '<th>Usuario</th><th>Contraseña</th><th>Botica</th><th>Ciudad</th>' +
          '<th>Estado</th><th>Ingresos</th><th>Último</th><th></th>' +
        '</tr></thead><tbody>' +
        r.cuentas.map(function (c) {
          var activa = c.estado === "activa";
          return '<tr' + (activa ? '' : ' class="is-suspendida"') + '>' +
            '<td><b>' + esc(c.usuario) + '</b><small>' + esc(c.nombre) + '</small></td>' +
            '<td class="u-clave">' + esc(c.clave) + '</td>' +
            '<td>' + esc(c.botica || "—") + '</td>' +
            '<td>' + esc(c.ciudad || "—") + '</td>' +
            '<td><span class="u-pastilla ' + (activa ? 'ok' : 'no') + '">' + esc(c.estado) + '</span></td>' +
            '<td class="u-num">' + c.ingresos + '</td>' +
            '<td class="u-num">' + esc(c.ultimo || "—") + '</td>' +
            '<td><button class="u-mini" type="button" data-usuario="' + esc(c.usuario) + '" ' +
                 'data-estado="' + (activa ? 'suspendida' : 'activa') + '">' +
                 (activa ? 'Suspender' : 'Reactivar') + '</button></td>' +
          '</tr>';
        }).join("") +
        '</tbody></table>';
    });
  }

  /* ---------- Activar / suspender ---------- */
  function cambiarEstado(usuario, estado) {
    var admin = val("uAdmin") || claveAdmin();
    pedir({ accion: "estado", admin: admin, usuario: usuario, estado: estado }).then(function (r) {
      if (!r.ok) { avisar("error", explicar(r.error)); return; }
      avisar("ok", "El acceso de " + r.usuario + " quedó como «" + r.estado + "».");
      listar();
    });
  }

  /* ---------- Arranque ---------- */
  function iniciar() {
    if (!CONF.endpoint) {
      avisar("error", "Aún no has conectado el Excel. Sigue los pasos de docs/ACADEMIA-SUKER.md y pega la dirección en assets/academia/academia-config.js.");
    }
    var guardada = claveAdmin();
    if (guardada) { $("uAdmin").value = guardada; listar(); }

    $("uDado").addEventListener("click", function () { $("uClave").value = claveSugerida(); });
    $("uCrear").addEventListener("click", crear);
    $("uListar").addEventListener("click", listar);

    $("uTabla").addEventListener("click", function (ev) {
      var b = ev.target.closest ? ev.target.closest("[data-usuario]") : null;
      if (!b) { return; }
      cambiarEstado(b.getAttribute("data-usuario"), b.getAttribute("data-estado"));
    });

    $("uAdmin").addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") { listar(); }
    });
  }

  if (doc.readyState === "loading") { doc.addEventListener("DOMContentLoaded", iniciar); }
  else { iniciar(); }

})(window, document);
