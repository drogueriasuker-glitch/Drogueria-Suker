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

    // GSAP + ScrollTrigger setup
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
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
     10. GSAP SCROLL ANIMATIONS
     NOTE: Hero entrance fires AFTER splash exits (suker:splashDone).
     All other sections use CSS .reveal to avoid GSAP opacity conflict.
     ============================================================ */
  function initGSAP() {
    if (!window.gsap) return;

    // ── Parallax de scroll del resplandor (profundidad cinematográfica) ──
    // Se configura una sola vez. Mueve el contenedor .hero-bloom; los blooms
    // hijos siguen "respirando" por CSS (elementos distintos → sin conflicto).
    if (window.ScrollTrigger) {
      var bloomEl = document.querySelector(".hero-bloom");
      if (bloomEl) {
        gsap.to(bloomEl, {
          yPercent: 16, ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
      }
    }

    function runHeroEntrance() {
      var heroContent = document.querySelector(".hero-content");
      if (!heroContent || !heroContent.children.length) return;
      // Only run if children are still at opacity 0 (i.e. not already visible)
      var firstChild = heroContent.children[0];
      if (parseFloat(getComputedStyle(firstChild).opacity) > 0.1) return;
      gsap.from(heroContent.children, {
        y: 32, opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "all"   // ← cleans inline style when done
      });
      // Entrada de cámara: las tarjetas de vidrio aparecen con leve escala + subida
      var cards = document.querySelector(".hero-cards");
      if (cards) {
        gsap.from(cards, {
          opacity: 0, y: 26, scale: 0.95,
          duration: 1.0, delay: 0.15,
          ease: "power3.out",
          clearProps: "all"
        });
      }
    }

    // Fire when splash signals it's done
    document.addEventListener("suker:splashDone", runHeroEntrance, { once: true });

    // Safety fallback: if splash event never fires, run after 3.5s
    setTimeout(function () {
      runHeroEntrance();
    }, 3500);
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

  /* initStory eliminado — sección reemplazada por nosotros estático */

  function initStory() { return; // eliminado
    var section = document.querySelector(".story");
    var stage   = document.querySelector(".story-stage");
    var canvas  = document.getElementById("storyCanvas");
    var rail    = document.getElementById("storyRail");
    if (!section || !stage || !canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var heads = Array.prototype.slice.call(document.querySelectorAll(".story-headline"));
    var N = 46; // puntos por formación (igual en todas para interpolar)

    /* ---- generadores de formaciones (puntos en ~[-1,1]) ---- */
    function ellipse(rx, ry) {
      var a = [];
      for (var i = 0; i < N; i++) { var t = i / N * Math.PI * 2; a.push({ x: Math.cos(t) * rx, y: Math.sin(t) * ry }); }
      return a;
    }
    function molecule() {
      var a = [];
      for (var i = 0; i < N; i++) { var ring = i % 3; var ang = i / N * Math.PI * 6; var r = 0.16 + ring * 0.2; a.push({ x: Math.cos(ang) * r * 1.15, y: Math.sin(ang) * r }); }
      return a;
    }
    function sampleAlong(verts, closed) {
      var v = verts.map(function (p) { return { x: p[0], y: p[1] }; });
      if (closed) v = v.concat([{ x: v[0].x, y: v[0].y }]);
      var lens = [], total = 0, i;
      for (i = 0; i < v.length - 1; i++) { var dx = v[i + 1].x - v[i].x, dy = v[i + 1].y - v[i].y, L = Math.sqrt(dx * dx + dy * dy); lens.push(L); total += L; }
      var out = [];
      for (var k = 0; k < N; k++) {
        var d = (closed ? k / N : k / (N - 1)) * total, seg = 0;
        while (seg < lens.length - 1 && d > lens[seg]) { d -= lens[seg]; seg++; }
        var f = lens[seg] ? d / lens[seg] : 0;
        out.push({ x: v[seg].x + (v[seg + 1].x - v[seg].x) * f, y: v[seg].y + (v[seg + 1].y - v[seg].y) * f });
      }
      return out;
    }
    function pin() {
      var a = [], ringN = 32, cx = 0, cy = -0.12, r = 0.3, i;
      for (i = 0; i < ringN; i++) { var t = i / ringN * Math.PI * 2; a.push({ x: cx + Math.cos(t) * r, y: cy + Math.sin(t) * r }); }
      var tailN = N - ringN;
      for (i = 0; i < tailN; i++) { var f = (i + 1) / tailN; a.push({ x: cx, y: cy + r + f * 0.44 }); }
      return a;
    }
    function lcg(s) { return function () { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }; }
    function network() {
      var r = lcg(9), a = [];
      for (var i = 0; i < N; i++) { var ang = r() * Math.PI * 2, rad = 0.12 + r() * 0.62; a.push({ x: Math.cos(ang) * rad, y: Math.sin(ang) * rad * 0.82 }); }
      return a;
    }
    var ecg = sampleAlong([[-.85, 0], [-.45, 0], [-.33, 0], [-.27, -.06], [-.18, 0], [-.06, 0], [-.02, .15], [0, -.62], [.04, .42], [.08, 0], [.2, 0], [.34, -.06], [.45, 0], [.85, 0]], false);
    var w = .18, e = .52;
    var cross = sampleAlong([[-w, -e], [w, -e], [w, -w], [e, -w], [e, w], [w, w], [w, e], [-w, e], [-w, w], [-e, w], [-e, -w], [-w, -w]], true);

    var forms = [ellipse(0.6, 0.26), molecule(), ecg, pin(), network(), cross];
    var segCount = forms.length - 1;

    /* ---- canvas hi-dpi ---- */
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      var cw = stage.clientWidth, ch = stage.clientHeight;
      canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
      canvas.style.width = cw + "px"; canvas.style.height = ch + "px";
    }
    resize();
    window.addEventListener("resize", resize);

    function easeInOut(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    function lerpForm(p) {
      var x = Math.max(0, Math.min(0.9999, p)) * segCount;
      var i = Math.floor(x); if (i >= segCount) i = segCount - 1;
      var f = easeInOut(x - i), A = forms[i], B = forms[i + 1], out = [];
      for (var k = 0; k < N; k++) { out.push({ x: A[k].x + (B[k].x - A[k].x) * f, y: A[k].y + (B[k].y - A[k].y) * f }); }
      return out;
    }
    function draw(p) {
      var cw = stage.clientWidth, ch = stage.clientHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      var cx = cw / 2, cy = ch * 0.5, s = Math.min(cw, ch) * 0.34;
      var raw = lerpForm(p), pts = [], i, j;
      for (i = 0; i < N; i++) pts.push({ x: cx + raw[i].x * s, y: cy + raw[i].y * s });
      // líneas tipo constelación
      var maxd = s * 0.46;
      ctx.lineWidth = 1;
      for (i = 0; i < N; i++) {
        for (j = i + 1; j < N; j++) {
          var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxd) {
            var a = (1 - d / maxd) * 0.26;
            if (a > 0.03) { ctx.strokeStyle = "rgba(229,184,38," + a.toFixed(3) + ")"; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
          }
        }
      }
      // puntos con glow + parpadeo
      var now = (window.performance && performance.now) ? performance.now() : Date.now();
      ctx.shadowColor = "rgba(229,184,38,0.9)"; ctx.shadowBlur = 12;
      for (i = 0; i < N; i++) {
        var tw = 0.62 + 0.38 * Math.sin(now * 0.0022 + i * 0.7);
        ctx.fillStyle = "rgba(245,212,96," + tw.toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 2.7, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
    function updateHeads(p) {
      var idx = Math.round(p * segCount); if (idx < 0) idx = 0; if (idx > segCount) idx = segCount;
      for (var k = 0; k < heads.length; k++) heads[k].classList.toggle("is-active", k === idx);
      if (rail) rail.style.width = (Math.max(0, Math.min(1, p)) * 100).toFixed(1) + "%";
    }

    /* ---- driver de scroll ----
       El morph se dibuja directamente en cada onUpdate del scroll (responde al
       instante y no depende del rAF, que el navegador pausa si la pestaña no está
       visible). Un rAF aparte añade solo el parpadeo de los puntos cuando es visible. */
    function perfnow() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
    var P = 0;
    function render(p) { draw(p); updateHeads(p); }

    var pinned = !matchMedia("(max-width: 991px)").matches && window.gsap && window.ScrollTrigger;

    if (pinned) {
      window.ScrollTrigger.create({
        trigger: ".story",
        start: "top top",
        end: "+=" + (forms.length * 100) + "%",
        pin: stage,
        scrub: true,
        onUpdate: function (self) { P = self.progress; render(P); }
      });
      // parpadeo continuo de los puntos (solo corre cuando la página es visible)
      (function twinkle() { draw(P); requestAnimationFrame(twinkle); })();
    } else {
      // móvil / sin GSAP: auto-reproduce el morph en bucle ping-pong
      var t0 = perfnow(), DUR = 24000;
      (function auto() {
        var ph = ((perfnow() - t0) % DUR) / DUR;
        P = ph < 0.5 ? ph * 2 : (1 - ph) * 2;
        render(P);
        requestAnimationFrame(auto);
      })();
    }

    render(0); // primer dibujo
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
    var panel = document.getElementById("heroVideoBg");
    var btn = document.getElementById("heroVideoSound");
    var pausedByUser = false;
    var soundOn = false;

    // El indicador de pausa sigue el estado REAL del video
    if (panel) {
      video.addEventListener("pause", function () { panel.classList.add("is-paused"); });
      video.addEventListener("play",  function () { panel.classList.remove("is-paused"); });
    }

    // Reproducir SIEMPRE de forma automática (mudo → permitido por el navegador),
    // incluso con "reducir movimiento" activo: es un pedido explícito.
    video.muted = true;
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
          var req = video.requestFullscreen || video.webkitRequestFullscreen || video.msRequestFullscreen;
          if (req) { try { req.call(video); return; } catch (e) {} }
          // iOS: reproductor nativo a pantalla completa
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
    safe(initSectionVeil,  "sectionVeil");
    safe(initTilt,         "tilt");
    safe(initScrollTop,    "scrollTop");
    safe(initWAForm,       "waForm");
    safe(initGSAP,         "gsap");
    safe(initStory,        "story");
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
