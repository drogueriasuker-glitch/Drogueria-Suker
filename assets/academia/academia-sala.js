/* ============================================================
   ACADEMIA SUKER — academia-sala.js  v=20260811
   Pinta una sala (tarjetas + módulos de video) desde
   academia-datos.js y gestiona la carga diferida de YouTube.

   CLAVE DE RENDIMIENTO: al abrir la sala NO se descarga nada de
   YouTube. Solo se pinta la portada del video (una imagen) y el
   reproductor se inyecta al pulsar play. Eso ahorra ~1,5 MB y
   más de 20 peticiones por página respecto a incrustar 6 iframes.
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
    chevron:      '<path d="M9 6l6 6-6 6"/>',
    wa:           '<path d="M3 21l1.7-5A8.4 8.4 0 1 1 8 19.4L3 21z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5"/>'
  };

  function svg(nombre, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
           (extra ? " " + extra : "") + ">" + (ICONOS[nombre] || "") + "</svg>";
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

  /* ---------- Portadas de YouTube ---------- */
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

  /* ---------- Pintado de las 7 tarjetas ---------- */
  function pintarTarjetas(caja, tarjetas) {
    var html = tarjetas.map(function (t, i) {
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
    caja.innerHTML = html;
    revelar(caja.children, true);
  }

  /* ---------- Pintado de los módulos de video ---------- */
  function pintarVideos(caja, videos, sala) {
    var vistos = leerVistos();

    var html = videos.map(function (v, i) {
      var clave = sala + ":" + i;
      var visto = !!vistos[clave];
      var disponible = v.estado === "disponible" && v.id;

      var marco;
      if (disponible) {
        marco =
          '<div class="ac-marco" data-indice="' + i + '">' +
            '<img src="https://i.ytimg.com/vi/' + esc(v.id) + '/maxresdefault.jpg" ' +
                 'data-respaldo="https://i.ytimg.com/vi/' + esc(v.id) + '/hqdefault.jpg" ' +
                 'alt="Portada de ' + esc(v.titulo) + '" width="1280" height="720" ' +
                 'loading="lazy" decoding="async">' +
            (v.demo ? '<span class="ac-etiqueta ac-etiqueta-demo">Vista previa</span>' : '') +
            '<span class="ac-duracion">' + esc(v.duracion) + '</span>' +
            '<button class="ac-play" type="button" data-play="' + i + '" ' +
                    'aria-label="Reproducir ' + esc(v.modulo) + ': ' + esc(v.titulo) + '">' +
              '<span class="ac-play-circulo">' +
                '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6L19 12z"/></svg>' +
              '</span>' +
            '</button>' +
          '</div>';
      } else {
        marco =
          '<div class="ac-marco ac-marco-agenda">' +
            '<span class="ac-etiqueta ac-etiqueta-agenda">Próximo módulo</span>' +
            '<span class="candado">' + svg("candado") + '</span>' +
            '<span>' + esc(v.habilita || "Se habilita al avanzar en el programa") + '</span>' +
          '</div>';
      }

      return '<article class="ac-video">' +
               marco +
               '<div class="ac-video-cuerpo">' +
                 '<span class="ac-video-modulo">' + esc(v.modulo) + '</span>' +
                 '<h3>' + esc(v.titulo) + '</h3>' +
                 '<p>' + esc(v.resumen) + '</p>' +
                 '<div class="ac-video-meta">' +
                   '<span>' + svg("reloj") + esc(v.duracion) + '</span>' +
                   (visto
                     ? '<span data-visto="' + i + '">' + svg("check") + 'Visto</span>'
                     : '<span data-visto="' + i + '"></span>') +
                 '</div>' +
               '</div>' +
             '</article>';
    }).join("");

    caja.innerHTML = html;
    revelar(caja.children, true);

    /* Respaldo de portada: algunos videos no tienen versión maxres */
    Array.prototype.forEach.call(caja.querySelectorAll(".ac-marco img"), function (img) {
      img.addEventListener("error", function () {
        var alt = img.getAttribute("data-respaldo");
        if (alt && img.src !== alt) { img.src = alt; }
      }, { once: true });
    });

    /* Precalentar la conexión con YouTube en cuanto haya intención */
    caja.addEventListener("pointerenter", precalentarYouTube, { once: true, capture: true });
    caja.addEventListener("focusin", precalentarYouTube, { once: true });

    /* Reproducir bajo demanda */
    caja.addEventListener("click", function (ev) {
      var btn = ev.target.closest ? ev.target.closest("[data-play]") : null;
      if (!btn) { return; }
      var i = parseInt(btn.getAttribute("data-play"), 10);
      var v = videos[i];
      if (!v || !v.id) { return; }
      precalentarYouTube();
      reproducir(btn.parentNode, v);
      marcarVisto(sala + ":" + i);
      var sello = caja.querySelector('[data-visto="' + i + '"]');
      if (sello && !sello.innerHTML) { sello.innerHTML = svg("check") + "Visto"; }
      actualizarAvance(videos, sala);
    });

    actualizarAvance(videos, sala);
  }

  function actualizarAvance(videos, sala) {
    var el = doc.getElementById("acAvance");
    if (!el) { return; }
    var vistos = leerVistos(), n = 0;
    videos.forEach(function (v, i) { if (vistos[sala + ":" + i]) { n++; } });
    el.textContent = n + " de " + videos.length + " módulos iniciados · ≈ 15 min cada uno";
  }

  /* ---------- Pintado del cierre ---------- */
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
  function iniciar() {
    var sala = doc.documentElement.getAttribute("data-sala");
    var datos = (win.ACADEMIA_CONTENIDO || {})[sala];
    if (!datos) { return; }

    var elCinta   = doc.getElementById("acCinta");
    var elTitulo  = doc.getElementById("acTitulo");
    var elBajada  = doc.getElementById("acBajada");
    var elTarjeta = doc.getElementById("acTarjetas");
    var elVideos  = doc.getElementById("acVideos");
    var elCierre  = doc.getElementById("acCierre");

    if (elCinta)  { elCinta.textContent = datos.cinta; }
    if (elTitulo) { elTitulo.innerHTML = datos.titulo; }   /* contiene <em> del propio archivo de datos */
    if (elBajada) { elBajada.innerHTML = datos.bajada; }   /* idem: <strong> redactado por nosotros */

    if (datos.acento === "riesgo") { doc.body.classList.add("ac-riesgo"); }

    /* Pintamos en el siguiente cuadro para que el navegador
       muestre primero la cabecera y la sala se sienta instantánea. */
    win.requestAnimationFrame(function () {
      if (elTarjeta) { pintarTarjetas(elTarjeta, datos.tarjetas || []); }
      if (elVideos)  { pintarVideos(elVideos, datos.videos || [], sala); }
      if (elCierre)  { pintarCierre(elCierre, datos.cierre); }

      /* Los enlaces recién creados también usan la transición */
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
    });
  }

  if (doc.readyState === "loading") { doc.addEventListener("DOMContentLoaded", iniciar); }
  else { iniciar(); }

})(window, document);
