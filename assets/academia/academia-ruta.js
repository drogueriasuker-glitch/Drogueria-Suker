/* ============================================================
   ACADEMIA SUKER — academia-ruta.js  v=20260813
   Pinta una ruta: sus 3 videos, y la pantalla de cada video con
   su reproductor y su material de apoyo.

   NAVEGACIÓN: al abrir un video la URL pasa a #video-2, así el
   botón "atrás" del navegador vuelve a la lista y el enlace de un
   video se puede compartir. Todo ocurre en la misma página: no
   hay recarga ni petición extra.

   RENDIMIENTO (patrón de fachada): al abrir la ruta NO se
   descarga nada de YouTube. Solo se pinta la portada y el
   reproductor se inyecta al pulsar play. Un iframe de YouTube
   pesa más de 1 MB; la portada, unos 15 KB.
   ============================================================ */
(function (win, doc) {
  "use strict";

  var LLAVE_VISTOS = "suker_academia_vistos";

  /* ---------- Iconos ---------- */
  var ICONOS = {
    reloj:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    flecha:   '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    atras:    '<path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/>',
    check:    '<path d="M20 6 9 17l-5-5"/>',
    libro:    '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z"/><path d="M8 8h7M8 12h7"/>',
    pelicula: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M8 5v14M16 5v14M2.5 12h19"/>',
    maletin:  '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
    reloj2:   '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    /* tipos de material */
    pdf:      '<path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5z"/><path d="M14 2v5h5"/><path d="M9 13h6M9 17h4"/>',
    drive:    '<path d="M8.4 3h7.2l5.4 9.3-3.6 6.2H6.6L3 12.3 8.4 3z"/><path d="M8.4 3 3 12.3M15.6 3l-5.4 9.3M3.1 12.3h17.8"/>',
    hoja:     '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
    doc:      '<path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5z"/><path d="M14 2v5h5"/><path d="M8.5 12.5h7M8.5 16h5"/>',
    imagen:   '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="m4 17 4.5-4.5 3.5 3.5 3-3L20 17"/>',
    enlace:   '<path d="M10 13a4 4 0 0 0 5.7.3l3-3a4 4 0 1 0-5.7-5.7L11.5 6"/><path d="M14 11a4 4 0 0 0-5.7-.3l-3 3a4 4 0 1 0 5.7 5.7l1.4-1.4"/>',
    wa:       '<path d="M3 21l1.7-5A8.4 8.4 0 1 1 8 19.4L3 21z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5"/>'
  };
  var NOMBRE_TIPO = {
    pdf: "PDF", drive: "Google Drive", hoja: "Hoja de cálculo", doc: "Documento",
    imagen: "Imagen", enlace: "Enlace", video: "Video", wa: "WhatsApp"
  };

  function svg(nombre) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
           (ICONOS[nombre] || ICONOS.enlace) + '</svg>';
  }
  function iconoTipo(t) { return t === "video" ? "pelicula" : (ICONOS[t] ? t : "enlace"); }

  function esc(t) {
    return String(t == null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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

  /* ---------- Aparición suave ---------- */
  var observador = null;
  if (win.IntersectionObserver) {
    observador = new win.IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-dentro"); observador.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .05 });
  }
  function revelar(nodos) {
    Array.prototype.forEach.call(nodos, function (n, i) {
      n.style.transitionDelay = Math.min(i, 6) * 55 + "ms";
      if (observador) { observador.observe(n); } else { n.classList.add("is-dentro"); }
    });
  }

  /* ---------- YouTube bajo demanda ---------- */
  var yaConectado = false;
  function precalentarYouTube() {
    if (yaConectado) { return; }
    yaConectado = true;
    ["https://www.youtube-nocookie.com", "https://i.ytimg.com"].forEach(function (u) {
      var l = doc.createElement("link");
      l.rel = "preconnect"; l.href = u; l.crossOrigin = "";
      doc.head.appendChild(l);
    });
  }

  /* Ahorro de datos activado en el celular → portada más liviana */
  function ahorroDatos() {
    var c = win.navigator.connection || win.navigator.mozConnection || win.navigator.webkitConnection;
    return !!(c && c.saveData);
  }

  function portada(id, alt) {
    var calidad = ahorroDatos() ? "mqdefault" : "maxresdefault";
    var respaldo = "https://i.ytimg.com/vi/" + esc(id) + "/hqdefault.jpg";
    return '<img src="https://i.ytimg.com/vi/' + esc(id) + '/' + calidad + '.jpg" ' +
           'data-respaldo="' + respaldo + '" alt="' + esc(alt) + '" ' +
           'width="1280" height="720" loading="lazy" decoding="async">';
  }
  function conectarRespaldo(caja) {
    Array.prototype.forEach.call(caja.querySelectorAll("img[data-respaldo]"), function (img) {
      img.addEventListener("error", function () {
        var alt = img.getAttribute("data-respaldo");
        if (alt && img.src !== alt) { img.src = alt; }
      }, { once: true });
    });
  }

  function reproducir(marco, video, indice) {
    var f = doc.createElement("iframe");
    /* cc_load_policy=1 deja los subtítulos activados desde el inicio */
    f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(video.id) +
            "?autoplay=1&rel=0&modestbranding=1&playsinline=1&cc_load_policy=1&color=white";
    f.title = "Video " + (indice + 1) + " · " + video.titulo;
    f.setAttribute("frameborder", "0");
    f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    f.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen");
    f.setAttribute("allowfullscreen", "");
    marco.innerHTML = "";
    marco.appendChild(f);
    marco.classList.add("is-reproduciendo");
  }

  /* ══════════════════════════════════════════════════════════
     LISTA DE LOS 3 VIDEOS
     ══════════════════════════════════════════════════════════ */
  function pintarVideos(caja, ruta) {
    var vistos = leerVistos();

    caja.innerHTML = ruta.videos.map(function (v, i) {
      var visto = !!vistos[ruta.slug + ":" + i];
      var listo = v.estado === "disponible" && v.id;
      var nRec = (v.recursos || []).length;

      var marco = listo
        ? '<div class="ac-marco">' +
            portada(v.id, "Portada de " + v.titulo) +
            '<span class="ac-duracion">' + esc(v.duracion) + '</span>' +
            '<span class="ac-play"><span class="ac-play-circulo">' +
              '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6L19 12z"/></svg>' +
            '</span></span>' +
          '</div>'
        : '<div class="ac-marco is-proximo">' +
            '<span class="ac-etiqueta ac-etiqueta-proximo">Próximamente</span>' +
            '<span class="ac-duracion">' + esc(v.duracion) + '</span>' +
            '<span class="ac-play"><span class="ac-play-circulo">' +
              '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6L19 12z"/></svg>' +
            '</span></span>' +
          '</div>';

      return '<article class="ac-video">' +
               marco +
               '<div class="ac-video-cuerpo">' +
                 '<span class="ac-video-modulo">Video ' + (i + 1) + ' de ' + ruta.videos.length + '</span>' +
                 '<h3>' + esc(v.titulo) + '</h3>' +
                 '<p>' + esc(v.descripcion) + '</p>' +
                 '<div class="ac-video-meta">' +
                   '<span>' + svg("reloj") + esc(v.duracion) + '</span>' +
                   (nRec ? '<span class="ac-video-recursos">' + svg("maletin") + nRec + ' material' + (nRec > 1 ? 'es' : '') + '</span>' : '') +
                   (visto ? '<span>' + svg("check") + 'Visto</span>' : '') +
                   '<span class="ac-video-entrar">Abrir' + svg("flecha") + '</span>' +
                 '</div>' +
               '</div>' +
               '<button class="ac-video-abrir" type="button" data-video="' + i + '" ' +
                       'aria-label="Abrir el video ' + (i + 1) + ': ' + esc(v.titulo) + '"></button>' +
             '</article>';
    }).join("");

    revelar(caja.children);
    conectarRespaldo(caja);

    caja.addEventListener("pointerenter", precalentarYouTube, { once: true, capture: true });
    caja.addEventListener("focusin", precalentarYouTube, { once: true });

    caja.addEventListener("click", function (ev) {
      var b = ev.target.closest ? ev.target.closest("[data-video]") : null;
      if (b) { abrirVideo(parseInt(b.getAttribute("data-video"), 10), true); }
    });
  }

  /* ══════════════════════════════════════════════════════════
     PANTALLA DE UN VIDEO
     ══════════════════════════════════════════════════════════ */
  var RUTA = null, VISTA = null, TITULO_RUTA = "";

  function pintarRecursos(recursos) {
    if (!recursos || !recursos.length) {
      return '<p>El material de apoyo de este video se publica junto con él.</p>';
    }
    return '<div class="ac-recursos">' + recursos.map(function (r) {
      var etiqueta = r.detalle || NOMBRE_TIPO[r.tipo] || "Material";
      var icono = '<span class="ac-recurso-icono">' + svg(iconoTipo(r.tipo)) + '</span>';
      var txt = '<span class="ac-recurso-txt"><b>' + esc(r.titulo) + '</b><span>' + esc(etiqueta) + '</span></span>';
      if (!r.url) {
        return '<div class="ac-recurso is-pendiente">' + icono + txt +
               '<span class="ac-recurso-sello">Pronto</span></div>';
      }
      return '<a class="ac-recurso" href="' + esc(r.url) + '" target="_blank" rel="noopener">' +
             icono + txt + '<span class="ac-recurso-flecha">' + svg("flecha") + '</span></a>';
    }).join("") + '</div>';
  }

  function pintarVideo(i) {
    var videos = RUTA.videos;
    var v = videos[i];
    if (!v || !VISTA) { return; }

    var listo = v.estado === "disponible" && v.id;
    var anterior = videos[i - 1], siguiente = videos[i + 1];

    var reproductor = listo
      ? '<div class="ac-reproductor" id="acReproductor">' +
          portada(v.id, "Portada de " + v.titulo) +
          '<button class="ac-play" type="button" id="acPlay" aria-label="Reproducir el video">' +
            '<span class="ac-play-circulo">' +
              '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6L19 12z"/></svg>' +
            '</span>' +
          '</button>' +
          '<span class="ac-duracion">' + esc(v.duracion) + '</span>' +
        '</div>'
      : '<div class="ac-reproductor ac-reproductor-agenda is-proximo">' +
          '<span class="ac-etiqueta ac-etiqueta-proximo">Próximamente</span>' +
          '<span class="ac-play"><span class="ac-play-circulo">' +
            '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6L19 12z"/></svg>' +
          '</span></span>' +
          '<span class="ac-duracion">' + esc(v.duracion) + '</span>' +
        '</div>';

    VISTA.innerHTML =
      '<button class="ac-volver" type="button" id="acVolver">' + svg("atras") + 'Volver a la ruta</button>' +

      '<header class="ac-modulo-cab">' +
        '<span class="ac-modulo-num">Video ' + (i + 1) + ' de ' + videos.length + '</span>' +
        '<h1>' + esc(v.titulo) + '</h1>' +
        '<div class="ac-modulo-datos">' +
          '<span class="ac-chip">' + svg("reloj") + esc(v.duracion) + '</span>' +
          '<span class="ac-chip">' + svg("pelicula") + (listo ? 'Disponible' : 'Próximamente') + '</span>' +
          ((v.recursos || []).length
            ? '<span class="ac-chip">' + svg("maletin") + v.recursos.length + ' material' + (v.recursos.length > 1 ? 'es' : '') + '</span>'
            : '') +
        '</div>' +
      '</header>' +

      '<section class="ac-bloque">' +
        '<h2 class="ac-bloque-tit">' + svg("libro") + 'De qué trata</h2>' +
        '<p>' + esc(v.descripcion) + '</p>' +
      '</section>' +

      '<section class="ac-bloque">' +
        '<h2 class="ac-bloque-tit">' + svg("pelicula") + 'El video</h2>' +
        reproductor +
      '</section>' +

      '<section class="ac-bloque">' +
        '<h2 class="ac-bloque-tit">' + svg("maletin") + 'Material de apoyo</h2>' +
        pintarRecursos(v.recursos) +
      '</section>' +

      '<nav class="ac-modulo-nav" aria-label="Navegación entre videos">' +
        (anterior
          ? '<a href="#video-' + i + '" data-ir="' + (i - 1) + '">' + svg("atras") +
            '<span><small>Anterior</small><b>' + esc(anterior.titulo) + '</b></span></a>'
          : '<span></span>') +
        (siguiente
          ? '<a class="siguiente" href="#video-' + (i + 2) + '" data-ir="' + (i + 1) + '">' +
            '<span><small>Siguiente</small><b>' + esc(siguiente.titulo) + '</b></span>' + svg("flecha") + '</a>'
          : '') +
      '</nav>';

    conectarRespaldo(VISTA);

    var play = doc.getElementById("acPlay");
    if (play) {
      play.addEventListener("click", function () {
        precalentarYouTube();
        reproducir(doc.getElementById("acReproductor"), v, i);
        marcarVisto(RUTA.slug + ":" + i);
      });
    }

    var volver = doc.getElementById("acVolver");
    if (volver) {
      /* Siempre vuelve a la lista. No usamos history.back(): si el
         boticario saltó entre videos, "atrás" lo llevaría al anterior. */
      volver.addEventListener("click", function () { cerrarVideo(true); });
    }

    Array.prototype.forEach.call(VISTA.querySelectorAll("[data-ir]"), function (a) {
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        abrirVideo(parseInt(a.getAttribute("data-ir"), 10), true);
      });
    });

    doc.title = v.titulo + " | " + RUTA.nombre + " · Academia Suker";
  }

  function sinMovimiento() {
    return !!(win.AcademiaSuker && win.AcademiaSuker.sinMovimiento);
  }

  function abrirVideo(i, cambiarUrl) {
    if (!RUTA || !RUTA.videos[i]) { return; }
    if (cambiarUrl) {
      try { win.history.pushState({ video: i }, "", "#video-" + (i + 1)); }
      catch (e) { win.location.hash = "video-" + (i + 1); }
    }
    doc.body.classList.add("ac-en-modulo");
    pintarVideo(i);
    win.scrollTo({ top: 0, behavior: sinMovimiento() ? "auto" : "smooth" });
  }

  function cerrarVideo(cambiarUrl) {
    if (cambiarUrl) {
      try { win.history.pushState({}, "", win.location.pathname + win.location.search); }
      catch (e) { win.location.hash = ""; }
    }
    doc.body.classList.remove("ac-en-modulo");
    if (VISTA) { VISTA.innerHTML = ""; }
    doc.title = TITULO_RUTA;
  }

  function videoEnUrl() {
    var m = /^#video-(\d+)$/.exec(win.location.hash || "");
    if (!m) { return -1; }
    var i = parseInt(m[1], 10) - 1;
    return (i >= 0 && RUTA && RUTA.videos[i]) ? i : -1;
  }
  function sincronizar() {
    var i = videoEnUrl();
    if (i >= 0) { abrirVideo(i, false); } else { cerrarVideo(false); }
  }

  /* ---------- Arranque ---------- */
  function iniciar() {
    var slug = doc.documentElement.getAttribute("data-ruta");
    RUTA = (win.ACADEMIA_POR_SLUG || {})[slug];
    if (!RUTA) { return; }
    TITULO_RUTA = doc.title;
    VISTA = doc.getElementById("acVideoVista");

    /* El acento de la ruta tiñe toda la página */
    var raiz = doc.body;
    var hex = RUTA.acento;
    var r = parseInt(hex.substr(1, 2), 16),
        g = parseInt(hex.substr(3, 2), 16),
        b = parseInt(hex.substr(5, 2), 16);
    raiz.style.setProperty("--acento", hex);
    raiz.style.setProperty("--acento-suave", "rgba(" + r + "," + g + "," + b + ",.14)");
    raiz.style.setProperty("--acento-borde", "rgba(" + r + "," + g + "," + b + ",.45)");
    raiz.style.setProperty("--acento-15", "rgba(" + r + "," + g + "," + b + ",.15)");

    var elCinta  = doc.getElementById("acCinta");
    var elTitulo = doc.getElementById("acTitulo");
    var elLema   = doc.getElementById("acLema");
    var elVideos = doc.getElementById("acVideos");

    if (elCinta)  { elCinta.textContent = "Ruta " + RUTA.numero + " · " + RUTA.nombre; }
    if (elTitulo) { elTitulo.textContent = RUTA.nombre; }
    if (elLema)   { elLema.textContent = RUTA.descripcion; }

    /* Pintamos en el siguiente cuadro para que la cabecera aparezca
       primero. El temporizador es el seguro: si el navegador congela
       requestAnimationFrame (pestana de fondo, pagina fuera de vista),
       el contenido se pinta igual y nadie ve una pagina vacia. */
    var pintado = false;
    function pintarTodo() {
      if (pintado) { return; }
      pintado = true;
      if (elVideos) { pintarVideos(elVideos, RUTA); }
      sincronizar();
    }
    win.requestAnimationFrame(pintarTodo);
    win.setTimeout(pintarTodo, 300);

    win.addEventListener("popstate", sincronizar);
    win.addEventListener("hashchange", sincronizar);
  }

  if (doc.readyState === "loading") { doc.addEventListener("DOMContentLoaded", iniciar); }
  else { iniciar(); }

})(window, document);
