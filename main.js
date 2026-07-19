/* ============================================
   DROGUERÍA SUKER — main.js v=20260608
   IIFE pattern — no ES modules
   ============================================ */
(function () {
  "use strict";

  /* ── Utility: safe init wrapper ── */
  function safe(fn, name) {
    try { fn(); }
    catch (e) { console.warn("[Suker:" + name + "]", e); }
  }

  /* ── Utility: WA number placeholder ── */
  var WA = "51932667799";
  var WA_BASE = "https://wa.me/" + WA;

  /* URL del Web App de Google Apps Script que guarda los registros
     del formulario "Regístrate" en Google Sheets (termina en /exec).
     Mientras esté vacía, el formulario envía los datos por WhatsApp. */
  var LEAD_FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbx4FwnwuU8wLNeajdRWDbga_PYr2Wh2qyL8aYQfcuiN2865arRBEMXTvP5aSih91qxv/exec";

  /* ============================================================
     1. SPLASH — Cinematic intro sequence
        0.0s  logo scales in + rings pulse
        0.5s  name appears
        0.75s tagline appears
        1.8s  logo + text scale up and fade out
        2.3s  overlay fades → page revealed
     ============================================================ */
  function initSplash() {
    var splash   = document.querySelector("[data-splash]");
    if (!splash) return;

    var logo    = document.getElementById("splashLogo");
    var name    = document.getElementById("splashName");
    var tagline = document.getElementById("splashTagline");

    // ── Phase 1: elements come in ──
    //  El logo gira (0–1.08s) y frena; el texto entra DESPUÉS del frenado,
    //  acompañando el zoom lento, para una entrada premium y ordenada.
    function phaseIn() {
      if (logo)    logo.classList.add("logo-in");
      setTimeout(function () {
        if (name) name.classList.add("txt-in");
      }, 1250);
      setTimeout(function () {
        if (tagline) tagline.classList.add("txt-in");
      }, 1550);
    }

    // ── Phase 2: elements exit ──
    function phaseOut() {
      if (logo)    logo.classList.add("logo-out");
      if (name)    name.classList.add("txt-out");
      if (tagline) tagline.classList.add("txt-out");
    }

    // ── Phase 3: overlay disappears ──
    function phaseReveal() {
      aborted = true; // prevent hardHide from firing
      splash.classList.add("is-exiting");
      setTimeout(function () {
        splash.classList.add("is-out");
        // Signal to GSAP that the page is now revealed
        document.dispatchEvent(new CustomEvent("suker:splashDone"));
      }, 750);
    }

    // Abort safety — if anything takes too long
    var aborted = false;
    function hardHide() {
      if (aborted) return;
      aborted = true;
      splash.style.transition = "none";
      splash.style.opacity = "0";
      splash.style.pointerEvents = "none";
      setTimeout(function () {
        splash.classList.add("is-out");
        document.dispatchEvent(new CustomEvent("suker:splashDone"));
      }, 60);
    }

    // Sequence
    //  0.0s  giro rápido del logo + escala de entrada
    //  ~1.04s frenado con destello "lock" → texto aparece
    //  1.35s zoom lento y elegante del logo
    //  2.5s  salida del logo (continúa el zoom + desvanece)
    //  2.9s  reveal de la página
    function runSequence() {
      if (aborted) return;
      phaseIn();
      setTimeout(function () {
        if (!aborted) phaseOut();
      }, 2500);
      setTimeout(function () {
        if (!aborted) phaseReveal();
      }, 2900);
    }

    // Absolute hard safety at 5.5s
    setTimeout(hardHide, 5500);

    if (document.readyState === "complete") {
      setTimeout(runSequence, 80);
    } else {
      window.addEventListener("load", function () {
        setTimeout(runSequence, 80);
      });
      // If load never fires, start anyway
      setTimeout(function () {
        if (!aborted) runSequence();
      }, 1500);
    }
  }

  /* ============================================================
     2. HEADER — scroll solidify + active nav
     ============================================================ */
  function initHeader() {
    var header = document.getElementById("header");
    if (!header) return;

    var scrollThreshold = 60;
    var progress = document.getElementById("scrollProgress");

    function onScroll() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        progress.style.transform = "scaleX(" + ratio + ")";
      }
      updateActiveNav();
      updateScrollTopBtn();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on init
  }

  /* ============================================================
     3. MOBILE NAV (hamburger)
     ============================================================ */
  function initMobileNav() {
    var hamburger = document.getElementById("hamburger");
    var overlay   = document.getElementById("navOverlay");
    if (!hamburger || !overlay) return;

    var isOpen = false;

    function openNav() {
      isOpen = true;
      hamburger.classList.add("is-open");
      hamburger.setAttribute("aria-expanded", "true");
      overlay.style.display = "flex";
      requestAnimationFrame(function () { overlay.classList.add("is-open"); });
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeNav() {
      isOpen = false;
      hamburger.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      setTimeout(function () {
        if (!isOpen) overlay.style.display = "none";
      }, 350);
    }

    hamburger.addEventListener("click", function () {
      isOpen ? closeNav() : openNav();
    });

    // Close on link click
    overlay.querySelectorAll("[data-mobile-link]").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen) closeNav();
    });
  }

  /* ============================================================
     4. SMOOTH SCROLL (anchor links, native)
     ============================================================ */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 76;
      var top = target.getBoundingClientRect().top + window.scrollY - navH;
      var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" });
    });
  }

  /* ============================================================
     5. REVEAL ON SCROLL (IntersectionObserver)
     ============================================================ */
  function initReveal() {
    var elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    var io = new IntersectionObserver(function (entries) {
      var idx = 0;
      entries.forEach(function (entry) {
        var el = entry.target;
        if (entry.isIntersecting) {
          // Stagger: los elementos entran en cascada, ágil y elegante
          var delay = idx * 130;
          el.style.transitionDelay = delay + "ms";
          el.classList.add("is-visible");
          (function (node, wait) {
            setTimeout(function () {
              if (node.classList.contains("is-visible")) node.style.transitionDelay = "";
            }, wait);
          })(el, 1900 + delay);
          idx++;
        } else {
          // Reaparece cada vez: al salir del viewport se reinicia el estado
          el.classList.remove("is-visible");
          el.style.transitionDelay = "";
        }
        // No se hace unobserve → el efecto se repite en cada entrada/salida
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -4% 0px" });

    elements.forEach(function (el) { io.observe(el); });

    // Safety: si algo quedó oculto pero está visible en pantalla, mostrarlo
    setTimeout(function () {
      elements.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (!el.classList.contains("is-visible") &&
            r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* ============================================================
     5b. MARQUEES — pausa cuando no están en pantalla
     (la cinta solo anima si se ve → menos GPU y arranque fluido)
     ============================================================ */
  function initMarqueePause() {
    if (!("IntersectionObserver" in window)) return;
    document.querySelectorAll(".nosotros-marquee, .prov-marquee").forEach(function (mq) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle("is-offscreen", !entry.isIntersecting);
        });
      }, { rootMargin: "160px 0px" }).observe(mq);
    });
  }

  /* ============================================================
     6. CARD TILT (3D hover on service cards)
     ============================================================ */
  function initTilt() {
    // Only on hover-capable devices
    if (matchMedia("(hover: none)").matches) return;

    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("mouseover", function (e) {
        if (card.contains(e.relatedTarget)) return;
      });

      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width  - 0.5;
        var y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateY(" + (x * 9) + "deg) rotateX(" + (-y * 9) + "deg) translateY(-6px) scale(1.01)";
        card.style.boxShadow = "0 24px 60px rgba(27,42,78,.18)";
        card.style.borderColor = "var(--gold)";
        // Spotlight dorado que sigue al cursor
        card.style.setProperty("--mx", ((x + 0.5) * 100) + "%");
        card.style.setProperty("--my", ((y + 0.5) * 100) + "%");
      });

      card.addEventListener("mouseout", function (e) {
        if (card.contains(e.relatedTarget)) return;
        card.style.transform = "";
        card.style.boxShadow = "";
        card.style.borderColor = "";
      });
    });
  }

  /* ============================================================
     7. ACTIVE NAV HIGHLIGHT (scroll-spy)
     ============================================================ */
  function updateActiveNav() {
    var sections = ["inicio", "historia", "categorias", "faq", "contacto"];
    var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 76;
    var scrollY = window.scrollY + navH + 60;

    var current = sections[0];
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) current = id;
    });

    document.querySelectorAll(".nav-link[data-section]").forEach(function (link) {
      link.classList.toggle("is-active", link.dataset.section === current);
    });
  }

  /* ============================================================
     8. SCROLL-TO-TOP BUTTON
     ============================================================ */
  function updateScrollTopBtn() {
    var btn = document.getElementById("scrollTopBtn");
    if (!btn) return;
    btn.classList.toggle("is-visible", window.scrollY > 400);
  }

  function initScrollTop() {
    var btn = document.getElementById("scrollTopBtn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    });
  }

  /* ============================================================
     9. WHATSAPP QUICK-ORDER FORM
     ============================================================ */
  function initWAForm() {
    var form = document.getElementById("waForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name    = (document.getElementById("wa-name")    || {}).value || "";
      var message = (document.getElementById("wa-message") || {}).value || "";
      name    = name.trim();
      message = message.trim();

      if (!name || !message) {
        var first = !name
          ? document.getElementById("wa-name")
          : document.getElementById("wa-message");
        if (first) { first.focus(); first.style.borderColor = "#E5B826"; }
        return;
      }

      var text = "Hola Droguería Suker, soy " + name + ". " + message;
      var url  = WA_BASE + "?text=" + encodeURIComponent(text);
      window.open(url, "_blank", "noopener,noreferrer");
    });

    // Reset border on input
    ["wa-name", "wa-message"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("input", function () { el.style.borderColor = ""; });
    });
  }

  /* ============================================================
     9b. FORMULARIO DE REGISTRO (tarjeta "Regístrate")
     Guarda los datos en Google Sheets vía Apps Script; si el
     endpoint no está configurado o falla, envía por WhatsApp.
     ============================================================ */
  function initLeadForm() {
    var form = document.getElementById("leadForm");
    if (!form) return;

    var nombreEl  = document.getElementById("lead-nombre");
    var celularEl = document.getElementById("lead-celular");
    var tipoEl    = document.getElementById("lead-tipo");
    var boton     = form.querySelector(".lead-submit");
    var status    = form.querySelector(".lead-status");

    function marcar(el) {
      if (el) { el.focus(); el.style.borderColor = "#E5B826"; }
    }
    function aviso(texto, esError) {
      if (!status) return;
      status.textContent = texto;
      status.classList.toggle("is-ok", !esError);
      status.classList.toggle("is-error", !!esError);
    }
    function porWhatsApp(nombre, celular, tipo) {
      var text = "Hola Droguería Suker, soy " + nombre + " (" + tipo + "). " +
                 "Mi celular es " + celular + " y quiero registrarme para recibir atención personalizada.";
      window.open(WA_BASE + "?text=" + encodeURIComponent(text), "_blank", "noopener,noreferrer");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre  = (nombreEl  ? nombreEl.value  : "").trim();
      var celular = (celularEl ? celularEl.value : "").replace(/\D/g, "");
      var tipo    = tipoEl ? tipoEl.value : "";
      var hp      = (form.elements.website ? form.elements.website.value : "");

      if (!nombre) { marcar(nombreEl); return; }
      if (!/^9\d{8}$/.test(celular)) {
        marcar(celularEl);
        aviso("El celular debe tener 9 dígitos y empezar con 9.", true);
        return;
      }

      if (!LEAD_FORM_ENDPOINT) {
        porWhatsApp(nombre, celular, tipo);
        aviso("¡Gracias, " + nombre + "! Completa el envío en WhatsApp.", false);
        form.reset();
        return;
      }

      if (boton) boton.disabled = true;
      aviso("Enviando…", false);

      var datos = new URLSearchParams();
      datos.append("nombre", nombre);
      datos.append("celular", celular);
      datos.append("tipo", tipo);
      datos.append("website", hp); // honeypot: el script descarta si viene lleno

      fetch(LEAD_FORM_ENDPOINT, { method: "POST", mode: "no-cors", body: datos })
        .then(function () {
          aviso("¡Gracias, " + nombre + "! Registramos tus datos y un asesor te contactará pronto.", false);
          form.reset();
        })
        .catch(function () {
          // Sin conexión con Google: no se pierde el contacto, va por WhatsApp
          porWhatsApp(nombre, celular, tipo);
          aviso("No pudimos guardar el registro; completa el envío en WhatsApp.", true);
        })
        .then(function () {
          if (boton) boton.disabled = false;
        });
    });

    // Limpia la marca dorada de error al volver a escribir
    [nombreEl, celularEl].forEach(function (el) {
      if (el) el.addEventListener("input", function () {
        el.style.borderColor = "";
        if (status) { status.textContent = ""; status.classList.remove("is-ok", "is-error"); }
      });
    });
  }

  /* ============================================================
     10. GSAP SCROLL ANIMATIONS
     NOTE: Hero entrance fires AFTER splash exits (suker:splashDone).
     All other sections use CSS .reveal to avoid GSAP opacity conflict.
     ============================================================ */
  /* Entrada escalonada del hero — JS puro (reemplaza a GSAP) */
  function initHeroEntrance() {
    var content = document.querySelector(".hero-content");
    if (!content || !content.children.length) return;
    var items = Array.prototype.slice.call(content.children);
    var actions = document.querySelector(".hero .hero-actions");
    if (actions) items.push(actions);
    var done = false;

    function run() {
      if (done) return;
      done = true;
      // Si ya está visible (sin splash), no animar
      if (parseFloat(getComputedStyle(items[0]).opacity) > 0.1) return;
      items.forEach(function (el, i) {
        el.style.transition = "none";
        el.style.opacity = "0";
        el.style.transform = "translateY(32px)";
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            el.style.transition =
              "opacity .8s cubic-bezier(.22,1,.36,1) " + (i * 120) + "ms, " +
              "transform .8s cubic-bezier(.22,1,.36,1) " + (i * 120) + "ms";
            el.style.opacity = "1";
            el.style.transform = "none";
          });
        });
      });
      // Limpia los estilos inline al terminar (equivale a clearProps)
      setTimeout(function () {
        items.forEach(function (el) {
          el.style.transition = ""; el.style.opacity = ""; el.style.transform = "";
        });
      }, 1000 + items.length * 120);
    }

    document.addEventListener("suker:splashDone", run, { once: true });
    setTimeout(run, 3500); // respaldo si el splash no dispara su evento
  }

  /* Parallax de scroll del resplandor del hero — JS puro (reemplaza a GSAP) */
  function initBloomParallax() {
    var bloom = document.querySelector(".hero-bloom");
    var hero = document.getElementById("inicio");
    if (!bloom || !hero) return;
    if (matchMedia("(hover: none) and (pointer: coarse)").matches) return; // móvil: ahorro
    var raf = null;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        var hh = hero.offsetHeight || 1;
        var p = Math.min(1, Math.max(0, window.scrollY / hh));
        bloom.style.transform = "translate3d(0," + (p * 16).toFixed(2) + "%,0)";
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     10b. LOCKUP ROTATOR — cicla palabras en el eyebrow del hero
     ============================================================ */
  function initLockupRotator() {
    var el = document.getElementById("heroRotator");
    if (!el) return;
    var words = (el.getAttribute("data-words") || "")
      .split("|").map(function (s) { return s.trim(); }).filter(Boolean);
    if (words.length < 2) return;

    var i = 0, paused = false;
    document.addEventListener("visibilitychange", function () { paused = document.hidden; });

    setInterval(function () {
      if (paused) return;
      el.classList.add("is-swapping");           // fade + slide out (CSS .35s)
      setTimeout(function () {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.classList.remove("is-swapping");        // fade + slide in
      }, 360);
    }, 2600);
  }

  /* ============================================================
     10c. HERO PARALLAX — las tarjetas de vidrio siguen al cursor
          (profundidad por capa; solo escritorio con hover)
     ============================================================ */
  function initHeroParallax() {
    if (matchMedia("(hover: none)").matches) return;
    if (matchMedia("(max-width: 991px)").matches) return; // tarjetas ocultas
    var hero  = document.getElementById("inicio");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".glass-card"));
    if (!hero || !cards.length) return;

    var depth = { front: 28, mid: 17, back: 11 };
    var raf = null, tx = 0, ty = 0;

    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width  - 0.5;   // -0.5 … 0.5
      ty = (e.clientY - r.top)  / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    hero.addEventListener("mouseleave", function () {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    });

    function apply() {
      raf = null;
      cards.forEach(function (c) {
        var k = c.classList.contains("is-front") ? "front"
              : c.classList.contains("is-mid")   ? "mid" : "back";
        var d = depth[k];
        c.style.setProperty("--px", (tx * d).toFixed(1) + "px");
        c.style.setProperty("--py", (ty * d).toFixed(1) + "px");
      });
    }
  }


  /* ============================================================
     SECTION VEIL — quita el gradiente inferior cuando se llega al fondo
     ============================================================ */
  function initSectionVeil() {
    var sections = document.querySelectorAll(".section");
    if (!sections.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // El rootMargin negativo hace que se dispare cuando el BORDE INFERIOR
          // de la sección ya está a punto de salir por arriba → velo desaparece
          entry.target.classList.add("section-seen");
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -85% 0px" });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ============================================================
     VIDEO DEL HERO — autoplay mudo + botón de sonido
     ============================================================ */
  function initHeroVideo() {
    var video = document.getElementById("heroVideoEl");
    if (!video) return;
    var panel = document.getElementById("hero3d");
    var btn = document.getElementById("heroVideoSound");
    var pausedByUser = false;
    var soundOn = false;

    // Ahorro de datos activado por el usuario: solo la portada (póster)
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && conn.saveData) {
      if (panel) panel.classList.add("poster-only");
      video.preload = "none";
      video.pause();
      return;
    }

    // Celular / táctil: el video SÍ se reproduce (mudo + playsinline);
    // preload ligero para que la descarga avance solo mientras reproduce
    var isTouch = matchMedia("(hover: none) and (pointer: coarse)").matches;

    // En táctiles se sirve la versión ligera (540p, ~4.6 MB vs 8.8 MB)
    if (isTouch) {
      var srcEl = video.querySelector("source");
      if (srcEl && srcEl.getAttribute("src").indexOf("suker.mp4") !== -1) {
        srcEl.setAttribute("src", srcEl.getAttribute("src").replace("suker.mp4", "suker-movil.mp4"));
        video.load();
      }
    }

    // El indicador de pausa sigue el estado REAL del video
    if (panel) {
      video.addEventListener("pause", function () { panel.classList.add("is-paused"); });
      video.addEventListener("play",  function () { panel.classList.remove("is-paused"); });
    }

    // Reproducir SIEMPRE de forma automática (mudo → permitido por el navegador),
    // incluso con "reducir movimiento" activo: es un pedido explícito.
    video.muted = true;
    video.preload = isTouch ? "metadata" : "auto";
    function tryPlay() {
      var pr = video.play();
      if (pr && typeof pr.catch === "function") { pr.catch(function () {}); }
    }
    tryPlay();
    // Plan B: si el navegador bloqueara el autoplay, arranca en la 1ª interacción
    function kickstart() {
      if (video.paused && !pausedByUser) tryPlay();
      ["pointerdown", "keydown", "scroll", "touchstart"].forEach(function (ev) {
        window.removeEventListener(ev, kickstart);
      });
    }
    ["pointerdown", "keydown", "scroll", "touchstart"].forEach(function (ev) {
      window.addEventListener(ev, kickstart, { passive: true });
    });

    // Botón de sonido
    if (btn) {
      btn.addEventListener("click", function () {
        soundOn = !soundOn;
        video.muted = !soundOn;
        btn.setAttribute("aria-pressed", soundOn ? "true" : "false");
        btn.setAttribute("aria-label", soundOn ? "Silenciar el video" : "Activar sonido del video");
        if (soundOn) {
          // Empieza la narración desde el inicio y asegura reproducción
          video.currentTime = 0;
          pausedByUser = false;
          var pr = video.play();
          if (pr && typeof pr.catch === "function") { pr.catch(function () {}); }
        }
      });
    }

    // Botón de pantalla completa (el contenedor → conserva botones e indicador)
    var fsBtn = document.getElementById("heroVideoFs");
    if (fsBtn) {
      fsBtn.addEventListener("click", function () {
        var doc = document;
        var inFs = doc.fullscreenElement || doc.webkitFullscreenElement;
        if (!inFs) {
          var target = panel || video;
          var req = target.requestFullscreen || target.webkitRequestFullscreen || target.msRequestFullscreen;
          if (req) { try { req.call(target); return; } catch (e) {} }
          // iOS: solo el <video> admite pantalla completa (reproductor nativo)
          if (video.webkitEnterFullscreen) { try { video.webkitEnterFullscreen(); } catch (e) {} }
        } else {
          var exit = doc.exitFullscreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
          if (exit) { try { exit.call(doc); } catch (e) {} }
        }
      });
    }

    // Clic sobre el video: pausar / reanudar
    video.addEventListener("click", function () {
      if (video.paused) {
        pausedByUser = false;
        var pr = video.play();
        if (pr && typeof pr.catch === "function") { pr.catch(function () {}); }
      } else {
        pausedByUser = true;
        video.pause();
      }
    });

    // Al salir de pantalla completa: forzar repintado (evita que el video quede en blanco)
    function onFsChange() {
      var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (fsEl) return;
      video.style.transform = "translateZ(0)";
      requestAnimationFrame(function () {
        video.style.transform = "";
        if (!pausedByUser) {
          var pr = video.play();
          if (pr && typeof pr.catch === "function") { pr.catch(function () {}); }
        }
      });
    }
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);

    // Ahorro de recursos: pausar fuera del viewport, reanudar al volver
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (ents) {
        var visible = ents[0].isIntersecting;
        if (!visible) {
          video.pause();
        } else if (!pausedByUser) {
          var pr = video.play();
          if (pr && typeof pr.catch === "function") { pr.catch(function () {}); }
        }
      }, { threshold: 0.15 }).observe(video);
    }
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    safe(initSplash,       "splash");
    safe(initHeader,       "header");
    safe(initMobileNav,    "mobileNav");
    safe(initSmoothScroll, "smoothScroll");
    safe(initReveal,       "reveal");
    safe(initMarqueePause, "marqueePause");
    safe(initSectionVeil,  "sectionVeil");
    safe(initTilt,         "tilt");
    safe(initScrollTop,    "scrollTop");
    safe(initWAForm,       "waForm");
    safe(initLeadForm,     "leadForm");
    safe(initHeroEntrance, "heroEntrance");
    safe(initBloomParallax,"bloomParallax");
    safe(initLockupRotator,"lockupRotator");
    safe(initHeroParallax, "heroParallax");
    safe(initHeroVideo,    "heroVideo");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
