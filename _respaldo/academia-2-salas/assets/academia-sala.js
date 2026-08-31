/* ============================================================
   ACADEMIA SUKER — academia-sala.js  v=20260812
   Pinta una sala (tarjetas + programa de módulos) y la pantalla
   de cada módulo (texto + video + material de apoyo).

   NAVEGACIÓN: al abrir un módulo la URL pasa a #modulo-2, así el
   botón "atrás" del navegador vuelve al listado y el enlace de un
   módulo se puede compartir. Todo ocurre en la misma página: no
   hay recarga ni petición extra.

   RENDIMIENTO: al abrir la sala NO se descarga nada de YouTube.
   Solo se pinta la portada del video (una imagen) y el reproductor
   se inyecta al pulsar play, dentro del módulo.
   ============================================================ */
(function (win, doc) {
  "use strict";

  var LLAVE_VISTOS = "suker_academia_vistos";

  /* ---------- Iconos (SVG en línea, sin peticiones extra) ---------- */
  var ICONOS = {
    escudo:       '<path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
    ruta:         '<circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><path d="M6 7v4a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4"/>',
    grafico:      '<path d="M3 17l6-6 4 4 7-7"/><path d="M14 8h6v6"/>',
    recibo:       '<path d="M5 3v18l2.5-1.6L10 21l2-1.6L14 21l2.5-1.6L19 21V3H5z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    portapapeles: '<rect x="8" y="3" width="8" height="4" rx="1"/><path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/><path d="M9 14l2 2 4-4"/>',
    corazon:      '<path d="M12 20s-7-4.4-7-9.3A4 4 0 0 1 12 7a4 4 0 0 1 7 3.7C19 15.6 12 20 12 20z"/>',
    edificio:     '<path d="M3 21h18"/><path d="M5 21V6l7-3 7 3v15"/><path d="M9 21v-4h6v4"/><path d="M9 10h.01M15 10h.01"/>',
    alerta:       '<path d="M10.3 4.3 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z"/><path d="M12 9.5v4M12 17h.01"/>',
    brujula:      '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5 13.6 13.6 8.5 15.5l1.9-5.1z"/>',
    martillo:     '<path d="M14 3l7 7-3 3-7-7z"/><path d="M11.5 8.5 4 16v4h4l7.5-7.5"/><path d="M3 21h8"/>',
    billete:      '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
    candado:      '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    persona:      '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    techo:        '<path d="M4 4h16"/><path d="M12 21V9"/><path d="M7 14l5-5 5 5"/>',
    reloj:        '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    check:        '<path d="M20 6 9 17l-5-5"/>',
    flecha:       '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    atras:        '<path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/>',
    chevron:      '<path d="M9 6l6 6-6 6"/>',
    wa:           '<path d="M3 21l1.7-5A8.4 8.4 0 1 1 8 19.4L3 21z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5"/>',
    libro:        '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z"/><path d="M8 8h7M8 12h7"/>',
    pelicula:     '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M8 5v14M16 5v14M2.5 12h19"/>',
    maletin:      '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
    /* Tipos de material de apoyo */
    pdf:          '<path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5z"/><path d="M14 2v5h5"/><path d="M9 13h6M9 17h4"/>',
    drive:        '<path d="M8.4 3h7.2l5.4 9.3-3.6 6.2H6.6L3 12.3 8.4 3z"/><path d="M8.4 3 3 12.3M15.6 3l-5.4 9.3M3.1 12.3h17.8"/>',
    hoja:         '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
    doc:          '<path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5z"/><path d="M14 2v5h5"/><path d="M8.5 12.5h7M8.5 16h5"/>',
    imagen:       '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="m4 17 4.5-4.5 3.5 3.5 3-3L20 17"/>',
    enlace:       '<path d="M10 13a4 4 0 0 0 5.7.3l3-3a4 4 0 1 0-5.7-5.7L11.5 6"/><path d="M14 11a4 4 0 0 0-5.7-.3l-3 3a4 4 0 1 0 5.7 5.7l1.4-1.4"/>',
    descarga:     '<path d="M12 3v12"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/>'
  };

  /* Etiqueta legible para cada tipo de material */
  var NOMBRE_TIPO = {
    pdf: "PDF", drive: "Google Drive", hoja: "Hoja de cálculo", doc: "Documento",
    imagen: "Imagen", enlace: "Enlace", video: "Video", wa: "WhatsApp", descarga: "Descarga"
  };

  function svg(nombre, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
           (extra ? " " + extra : "") + ">" + (ICONOS[nombre] || ICONOS.enlace) + "</svg>";
  }

  function iconoDeTipo(tipo) {
    if (tipo === "video") { return "pelicula"; }
    return ICONOS[tipo] ? tipo : "enlace";
  }

  /* ---------- Utilidades ---------- */
  function esc(t) {
    return String(t == null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function leerVistos() {
    try { return JSON.parse(win.localStorage.getItem(LLAVE_VISTOS) || "{}") || {}; }
    catch (e) { return {}; }
  }

  function marcarVisto(clave) {
    try {
      var v = leerVistos();
      v[clave] = Date.now();
      win.localStorage.setItem(LLAVE_VISTOS, JSON.stringify(v));
    } catch (e) { /* sin almacenamiento: el avance no se recuerda */ }
  }

  /* ---------- Aparición suave al hacer scroll ---------- */
  var observador = null;
  if (win.IntersectionObserver) {
    observador = new win.IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-dentro");
          observador.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .05 });
  }

  function revelar(nodos, escalonar) {
    Array.prototype.forEach.call(nodos, function (n, i) {
      n.style.transitionDelay = (escalonar ? Math.min(i, 8) * 45 : 0) + "ms";
      if (observador) { observador.observe(n); }
      else { n.classList.add("is-dentro"); }
    });
  }

  /* ---------- YouTube: portada ahora, reproductor al pulsar ---------- */
  var yaConectado = false;
  function precalentarYouTube() {
    if (yaConectado) { return; }
    yaConectado = true;
    ["https://www.youtube-nocookie.com", "https://i.ytimg.com"].forEach(function (u) {
      var l = doc.createElement("link");
      l.rel = "preconnect";
      l.href = u;
      l.crossOrigin = "";
      doc.head.appendChild(l);
    });
  }

  function portada(id, alt, clases) {
    return '<img src="https://i.ytimg.com/vi/' + esc(id) + '/maxresdefault.jpg" ' +
           'data-respaldo="https://i.ytimg.com/vi/' + esc(id) + '/hqdefault.jpg" ' +
           'alt="' + esc(alt) + '" width="1280" height="720" loading="lazy" decoding="async"' +
           (clases ? ' class="' + clases + '"' : '') + '>';
  }

  function conectarRespaldoPortadas(caja) {
    Array.prototype.forEach.call(caja.querySelectorAll("img[data-respaldo]"), function (img) {
      img.addEventListener("error", function () {
        var alt = img.getAttribute("data-respaldo");
        if (alt && img.src !== alt) { img.src = alt; }
      }, { once: true });
    });
  }

  function reproducir(marco, video) {
    var f = doc.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(video.id) +
            "?autoplay=1&rel=0&modestbranding=1&playsinline=1&color=white";
    f.title = video.modulo + " · " + video.titulo;
    f.setAttribute("frameborder", "0");
    f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    f.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen");
    f.setAttribute("allowfullscreen", "");
    marco.innerHTML = "";
    marco.appendChild(f);
    marco.classList.add("is-reproduciendo");
  }

  /* ══════════════════════════════════════════════════════════
     LISTADO DE LA SALA
     ══════════════════════════════════════════════════════════ */
  function pintarTarjetas(caja, tarjetas) {
    caja.innerHTML = tarjetas.map(function (t, i) {
      return '<article class="ac-tarjeta">' +
               '<div class="ac-tarjeta-cab">' +
                 '<span class="ac-tarjeta-icono">' + svg(t.icono) + '</span>' +
                 '<span class="ac-tarjeta-idx">' + ("0" + (i + 1)).slice(-2) + '</span>' +
               '</div>' +
               '<h3>' + esc(t.titulo) + '</h3>' +
               '<p>' + esc(t.texto) + '</p>' +
               (t.pie
                 ? '<div class="ac-tarjeta-pie">' + svg("check") + '<span>' + esc(t.pie) + '</span></div>'
                 : '') +
             '</article>';
    }).join("");
    revelar(caja.children, true);
  }

  function pintarModulos(caja, videos, sala) {
    var vistos = leerVistos();

    caja.innerHTML = videos.map(function (v, i) {
      var visto = !!vistos[sala + ":" + i];
      var disponible = v.estado === "disponible" && v.id;
      var nRecursos = (v.recursos || []).length;

      var marco = disponible
        ? '<div class="ac-marco">' +
            portada(v.id, "Portada de " + v.titulo) +
            (v.demo ? '<span class="ac-etiqueta ac-etiqueta-demo">Vista previa</span>' : '') +
            '<span class="ac-duracion">' + esc(v.duracion) + '</span>' +
            '<span class="ac-play"><span class="ac-play-circulo">' +
              '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6L19 12z"/></svg>' +
            '</span></span>' +
          '</div>'
        : '<div class="ac-marco ac-marco-agenda">' +
            '<span class="ac-etiqueta ac-etiqueta-agenda">Próximo módulo</span>' +
            '<span class="candado">' + svg("candado") + '</span>' +
            '<span>' + esc(v.habilita || "Se habilita al avanzar en el programa") + '</span>' +
          '</div>';

      return '<article class="ac-video">' +
               marco +
               '<div class="ac-video-cuerpo">' +
                 '<span class="ac-video-modulo">' + esc(v.modulo) + '</span>' +
                 '<h3>' + esc(v.titulo) + '</h3>' +
                 '<p>' + esc(v.resumen) + '</p>' +
                 '<div class="ac-video-meta">' +
                   '<span>' + svg("reloj") + esc(v.duracion) + '</span>' +
                   (nRecursos
                     ? '<span class="ac-video-recursos">' + svg("maletin") + nRecursos + ' recurso' + (nRecursos > 1 ? 's' : '') + '</span>'
                     : '') +
                   (visto ? '<span>' + svg("check") + 'Visto</span>' : '') +
                   '<span class="ac-video-entrar">Abrir' + svg("flecha") + '</span>' +
                 '</div>' +
               '</div>' +
               '<button class="ac-video-abrir" type="button" data-modulo="' + i + '" ' +
                       'aria-label="Abrir ' + esc(v.modulo) + ': ' + esc(v.titulo) + '"></button>' +
             '</article>';
    }).join("");

    revelar(caja.children, true);
    conectarRespaldoPortadas(caja);

    caja.addEventListener("pointerenter", precalentarYouTube, { once: true, capture: true });
    caja.addEventListener("focusin", precalentarYouTube, { once: true });

    caja.addEventListener("click", function (ev) {
      var btn = ev.target.closest ? ev.target.closest("[data-modulo]") : null;
      if (!btn) { return; }
      abrirModulo(parseInt(btn.getAttribute("data-modulo"), 10), true);
    });
  }

  function actualizarAvance(videos, sala) {
    var el = doc.getElementById("acAvance");
    if (!el) { return; }
    var vistos = leerVistos(), n = 0;
    videos.forEach(function (v, i) { if (vistos[sala + ":" + i]) { n++; } });
    el.textContent = n + " de " + videos.length + " módulos iniciados · ≈ 15 min cada uno";
  }

  /* ══════════════════════════════════════════════════════════
     PANTALLA DE UN MÓDULO
     ══════════════════════════════════════════════════════════ */
  var DATOS = null, SALA = "", VISTA = null;

  function pintarRecursos(recursos) {
    if (!recursos || !recursos.length) {
      return '<p>El material de apoyo de este módulo se publica junto con el video.</p>';
    }
    return '<div class="ac-recursos">' + recursos.map(function (r) {
      var etiqueta = r.detalle || NOMBRE_TIPO[r.tipo] || "Material";
      var icono = '<span class="ac-recurso-icono">' + svg(iconoDeTipo(r.tipo)) + '</span>';
      var texto = '<span class="ac-recurso-txt"><b>' + esc(r.titulo) + '</b><span>' + esc(etiqueta) + '</span></span>';

      if (!r.url) {
        return '<div class="ac-recurso is-pendiente">' + icono + texto +
                 '<span class="ac-recurso-sello">Pronto</span>' +
               '</div>';
      }
      return '<a class="ac-recurso" href="' + esc(r.url) + '" target="_blank" rel="noopener">' +
               icono + texto +
               '<span class="ac-recurso-flecha">' + svg("flecha") + '</span>' +
             '</a>';
    }).join("") + '</div>';
  }

  function pintarModulo(i) {
    var videos = DATOS.videos || [];
    var v = videos[i];
    if (!v || !VISTA) { return; }

    var disponible = v.estado === "disponible" && v.id;
    var anterior = videos[i - 1];
    var siguiente = videos[i + 1];

    var reproductor = disponible
      ? '<div class="ac-reproductor" id="acReproductor">' +
          portada(v.id, "Portada de " + v.titulo) +
          '<button class="ac-play" type="button" id="acPlay" aria-label="Reproducir el video del módulo">' +
            '<span class="ac-play-circulo">' +
              '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6L19 12z"/></svg>' +
            '</span>' +
          '</button>' +
          '<span class="ac-duracion">' + esc(v.duracion) + '</span>' +
          (v.demo ? '<span class="ac-etiqueta ac-etiqueta-demo">Vista previa</span>' : '') +
        '</div>'
      : '<div class="ac-reproductor ac-reproductor-agenda">' +
          '<span class="candado">' + svg("candado") + '</span>' +
          '<b>Este módulo todavía no está publicado</b>' +
          '<span>' + esc(v.habilita || "Se habilita al avanzar en el programa") + '</span>' +
        '</div>';

    VISTA.innerHTML =
      '<button class="ac-volver" type="button" id="acVolver">' +
        svg("atras") + 'Volver al programa' +
      '</button>' +

      '<header class="ac-modulo-cab">' +
        '<span class="ac-modulo-num">' + esc(v.modulo) + '</span>' +
        '<h1>' + esc(v.titulo) + '</h1>' +
        '<div class="ac-modulo-datos">' +
          '<span class="ac-chip">' + svg("reloj") + esc(v.duracion) + '</span>' +
          '<span class="ac-chip">' + svg(disponible ? "pelicula" : "candado") +
            (disponible ? 'Video disponible' : 'Próximamente') + '</span>' +
          ((v.recursos || []).length
            ? '<span class="ac-chip">' + svg("maletin") + v.recursos.length + ' material' + (v.recursos.length > 1 ? 'es' : '') + ' de apoyo</span>'
            : '') +
        '</div>' +
      '</header>' +

      '<section class="ac-bloque">' +
        '<h2 class="ac-bloque-tit">' + svg("libro") + 'De qué trata</h2>' +
        '<p>' + esc(v.descripcion || v.resumen) + '</p>' +
        ((v.aprenderas || []).length
          ? '<ul class="ac-aprender">' + v.aprenderas.map(function (a) {
              return '<li>' + svg("check") + '<span>' + esc(a) + '</span></li>';
            }).join("") + '</ul>'
          : '') +
      '</section>' +

      '<section class="ac-bloque">' +
        '<h2 class="ac-bloque-tit">' + svg("pelicula") + 'Video del módulo</h2>' +
        reproductor +
      '</section>' +

      '<section class="ac-bloque">' +
        '<h2 class="ac-bloque-tit">' + svg("maletin") + 'Material de apoyo</h2>' +
        pintarRecursos(v.recursos) +
      '</section>' +

      '<nav class="ac-modulo-nav" aria-label="Navegación entre módulos">' +
        (anterior
          ? '<a href="#modulo-' + i + '" data-ir="' + (i - 1) + '">' + svg("atras") +
              '<span><small>Anterior</small><b>' + esc(anterior.modulo) + '</b></span></a>'
          : '<span></span>') +
        (siguiente
          ? '<a class="siguiente" href="#modulo-' + (i + 2) + '" data-ir="' + (i + 1) + '">' +
              '<span><small>Siguiente</small><b>' + esc(siguiente.modulo) + '</b></span>' + svg("flecha") + '</a>'
          : '') +
      '</nav>';

    conectarRespaldoPortadas(VISTA);

    var play = doc.getElementById("acPlay");
    if (play) {
      play.addEventListener("click", function () {
        precalentarYouTube();
        reproducir(doc.getElementById("acReproductor"), v);
        marcarVisto(SALA + ":" + i);
        actualizarAvance(videos, SALA);
      });
    }

    var volver = doc.getElementById("acVolver");
    if (volver) {
      /* Siempre cierra el módulo y vuelve al programa. No usamos
         history.back(): si el boticario saltó entre varios módulos,
         "atrás" lo devolvería al módulo anterior, no al listado. */
      volver.addEventListener("click", function () { cerrarModulo(true); });
    }

    Array.prototype.forEach.call(VISTA.querySelectorAll("[data-ir]"), function (a) {
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        abrirModulo(parseInt(a.getAttribute("data-ir"), 10), true);
      });
    });

    doc.title = v.modulo + " · " + v.titulo + " | Academia Suker";
  }

  function abrirModulo(i, cambiarUrl) {
    var videos = (DATOS && DATOS.videos) || [];
    if (!videos[i]) { return; }
    if (cambiarUrl) {
      try { win.history.pushState({ modulo: i }, "", "#modulo-" + (i + 1)); }
      catch (e) { win.location.hash = "modulo-" + (i + 1); }
    }
    doc.body.classList.add("ac-en-modulo");
    pintarModulo(i);
    win.scrollTo({ top: 0, behavior: AcademiaSinMovimiento() ? "auto" : "smooth" });
  }

  function cerrarModulo(cambiarUrl) {
    if (cambiarUrl) {
      try { win.history.pushState({}, "", win.location.pathname + win.location.search); }
      catch (e) { win.location.hash = ""; }
    }
    doc.body.classList.remove("ac-en-modulo");
    if (VISTA) { VISTA.innerHTML = ""; }
    doc.title = TITULO_SALA;
  }

  function AcademiaSinMovimiento() {
    return !!(win.AcademiaSuker && win.AcademiaSuker.sinMovimiento);
  }

  /* Lee #modulo-N de la URL (1 = primer módulo) */
  function moduloEnUrl() {
    var m = /^#modulo-(\d+)$/.exec(win.location.hash || "");
    if (!m) { return -1; }
    var i = parseInt(m[1], 10) - 1;
    return (i >= 0 && DATOS && DATOS.videos && DATOS.videos[i]) ? i : -1;
  }

  function sincronizarConUrl() {
    var i = moduloEnUrl();
    if (i >= 0) { abrirModulo(i, false); }
    else { cerrarModulo(false); }
  }

  /* ---------- Cierre de la sala ---------- */
  function pintarCierre(caja, cierre) {
    if (!caja || !cierre) { return; }

    var pasos = (cierre.pasos || []).map(function (p, i) {
      return '<div class="ac-paso"><b>' + (i + 1) + '</b><div>' +
               '<strong>' + esc(p.titulo) + '</strong>' + esc(p.texto) +
             '</div></div>';
    }).join("");

    var botones = (cierre.botones || []).map(function (b) {
      var clase = b.tipo === "wa" ? "ac-btn ac-btn-wa" : "ac-btn ac-btn-fantasma";
      var extra = b.tipo === "wa"
        ? ' target="_blank" rel="noopener"'
        : (b.transicion ? ' data-transicion' : "");
      return '<a class="' + clase + '" href="' + esc(b.url) + '"' + extra + '>' +
               (b.tipo === "wa" ? svg("wa") : "") + esc(b.texto) +
               (b.tipo === "wa" ? "" : svg("flecha")) +
             '</a>';
    }).join("");

    caja.innerHTML =
      '<h2>' + esc(cierre.titulo) + '</h2>' +
      '<p>' + esc(cierre.texto) + '</p>' +
      (pasos ? '<div class="ac-pasos">' + pasos + '</div>' : "") +
      (botones ? '<div class="ac-cierre-botones">' + botones + '</div>' : "");
  }

  /* ---------- Arranque ---------- */
  var TITULO_SALA = "";

  function iniciar() {
    SALA = doc.documentElement.getAttribute("data-sala");
    DATOS = (win.ACADEMIA_CONTENIDO || {})[SALA];
    if (!DATOS) { return; }
    TITULO_SALA = doc.title;

    var elCinta   = doc.getElementById("acCinta");
    var elTitulo  = doc.getElementById("acTitulo");
    var elBajada  = doc.getElementById("acBajada");
    var elTarjeta = doc.getElementById("acTarjetas");
    var elVideos  = doc.getElementById("acVideos");
    var elCierre  = doc.getElementById("acCierre");
    VISTA = doc.getElementById("acModulo");

    if (elCinta)  { elCinta.textContent = DATOS.cinta; }
    if (elTitulo) { elTitulo.innerHTML = DATOS.titulo; }   /* el <em> viene del archivo de datos */
    if (elBajada) { elBajada.innerHTML = DATOS.bajada; }   /* idem con <strong> */

    /* Pintamos en el siguiente cuadro para que el navegador
       muestre primero la cabecera y la sala se sienta instantánea. */
    win.requestAnimationFrame(function () {
      if (elTarjeta) { pintarTarjetas(elTarjeta, DATOS.tarjetas || []); }
      if (elVideos)  { pintarModulos(elVideos, DATOS.videos || [], SALA); }
      if (elCierre)  { pintarCierre(elCierre, DATOS.cierre); }
      actualizarAvance(DATOS.videos || [], SALA);

      /* Los enlaces recién creados también usan la animación de paso */
      Array.prototype.forEach.call(doc.querySelectorAll("#acCierre [data-transicion]"), function (a) {
        a.addEventListener("click", function (ev) {
          if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) { return; }
          ev.preventDefault();
          var destino = a.getAttribute("href");
          var ac = win.AcademiaSuker;
          if (ac && ac.cargador) {
            ac.cargador.correr(["Preparando la otra sala…", "Ordenando los módulos…", "Listo"], function () {
              win.location.href = destino;
            });
          } else { win.location.href = destino; }
        });
      });

      /* Si alguien llega con un enlace directo a un módulo, se abre solo */
      sincronizarConUrl();
    });

    /* Botón atrás / adelante del navegador */
    win.addEventListener("popstate", sincronizarConUrl);
    win.addEventListener("hashchange", sincronizarConUrl);
  }

  if (doc.readyState === "loading") { doc.addEventListener("DOMContentLoaded", iniciar); }
  else { iniciar(); }

})(window, document);
