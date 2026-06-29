/* ============================================================
   DROGUERÍA SUKER — hero3d.js  (v=20260615b)
   Escena 3D futurista del hero con Three.js (build UMD global THREE).
   - Cápsula farmacéutica de cristal flotante (dorado + blanco)
   - Núcleo de energía + concha icosaédrica wireframe contrarrotante
   - Anillos orbitales con nodos tipo molécula
   - Campo de partículas doradas a la deriva
   - Parallax suave siguiendo el cursor / giroscopio
   - Respeta prefers-reduced-motion y pausa fuera de viewport / pestaña oculta
   Sin módulos ES, sin build. Falla en silencio si THREE no cargó.
   ============================================================ */
(function () {
  "use strict";

  function boot() {
    var mount = document.getElementById("hero3d");
    if (!mount || typeof THREE === "undefined") return;

    var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── Paleta de marca ── */
    var GOLD       = 0xE5B826;
    var GOLD_LIGHT = 0xF5D460;
    var NAVY_LIGHT = 0x3A5BBF;
    var WHITE      = 0xF6F2E4;

    /* ── Renderer ── */
    var renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setClearColor(0x000000, 0); // transparente → deja ver el fondo del hero
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    renderer.domElement.classList.add("hero-3d-canvas");

    /* ── Escena + cámara ── */
    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    /* Grupo raíz: todo el objeto gira/flota como una sola pieza */
    var root = new THREE.Group();
    scene.add(root);

    /* ── 1. Cápsula de cristal (la "pastilla" futurista) ── */
    var capsule = new THREE.Group();
    root.add(capsule);

    var capGeo = THREE.CapsuleGeometry
      ? new THREE.CapsuleGeometry(0.95, 1.7, 18, 40)
      : new THREE.CylinderGeometry(0.95, 0.95, 2.6, 40);

    // Mitad dorada (translúcida, metálica)
    var matGold = new THREE.MeshStandardMaterial({
      color: GOLD,
      metalness: 0.85,
      roughness: 0.18,
      emissive: GOLD,
      emissiveIntensity: 0.28,
      transparent: true,
      opacity: 0.92
    });
    // Mitad clara, casi de vidrio
    var matGlass = new THREE.MeshStandardMaterial({
      color: WHITE,
      metalness: 0.2,
      roughness: 0.08,
      emissive: 0xffffff,
      emissiveIntensity: 0.06,
      transparent: true,
      opacity: 0.46
    });

    var capGold  = new THREE.Mesh(capGeo, matGold);
    var capClear = new THREE.Mesh(capGeo, matGlass);
    // Recorte por planos para que cada material ocupe una mitad
    matGold.clippingPlanes  = [new THREE.Plane(new THREE.Vector3(0,  1, 0), 0)];
    matGlass.clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)];
    renderer.localClippingEnabled = true;
    capsule.add(capGold, capClear);
    capsule.rotation.z = Math.PI * 0.16;

    // Banda central brillante de la cápsula
    var bandGeo = new THREE.TorusGeometry(0.96, 0.07, 16, 48);
    var bandMat = new THREE.MeshStandardMaterial({
      color: GOLD_LIGHT, metalness: 1, roughness: 0.25,
      emissive: GOLD_LIGHT, emissiveIntensity: 0.6
    });
    var band = new THREE.Mesh(bandGeo, bandMat);
    band.rotation.x = Math.PI / 2;
    capsule.add(band);

    /* ── 1b. Logo flotante en el centro de la cápsula + halo dorado ── */
    function makeGlowTexture() {
      var c = document.createElement("canvas");
      c.width = c.height = 128;
      var ctx = c.getContext("2d");
      var g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0,    "rgba(245,212,96,0.95)");
      g.addColorStop(0.35, "rgba(229,184,38,0.35)");
      g.addColorStop(1,    "rgba(229,184,38,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
      var tex = new THREE.CanvasTexture(c);
      if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    // Halo suave detrás del logo (se ve siempre, flota con el conjunto)
    var logoGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeGlowTexture(), transparent: true,
      blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false,
      opacity: 0.75
    }));
    logoGlow.scale.set(2.4, 2.4, 1);
    logoGlow.renderOrder = 9;
    root.add(logoGlow);

    // El logo como sprite (siempre mira a la cámara → legible)
    var logoSprite = null;
    new THREE.TextureLoader().load("assets/img/logo.png", function (tex) {
      if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
      var mat = new THREE.SpriteMaterial({
        map: tex, transparent: true, depthTest: false, depthWrite: false
      });
      logoSprite = new THREE.Sprite(mat);
      logoSprite.scale.set(1.35, 1.35, 1);
      logoSprite.renderOrder = 10;
      root.add(logoSprite);
      // Asegura que el logo aparezca incluso en el frame estático (reduced-motion)
      renderer.render(scene, camera);
    });

    /* ── 2. Concha icosaédrica wireframe (campo de energía) ── */
    var shellGeo = new THREE.IcosahedronGeometry(2.55, 1);
    var shellMat = new THREE.MeshBasicMaterial({
      color: GOLD, wireframe: true, transparent: true, opacity: 0.22
    });
    var shell = new THREE.Mesh(shellGeo, shellMat);
    root.add(shell);

    /* ── 3. Anillos orbitales + nodos tipo molécula ── */
    var orbits = new THREE.Group();
    root.add(orbits);

    function makeOrbit(radius, tilt, color) {
      var g = new THREE.Group();
      var ringGeo = new THREE.TorusGeometry(radius, 0.012, 8, 96);
      var ringMat = new THREE.MeshBasicMaterial({
        color: color, transparent: true, opacity: 0.4
      });
      g.add(new THREE.Mesh(ringGeo, ringMat));

      var nodeGeo = new THREE.SphereGeometry(0.085, 16, 16);
      var nodeMat = new THREE.MeshStandardMaterial({
        color: color, emissive: color, emissiveIntensity: 0.9,
        metalness: 0.4, roughness: 0.3
      });
      var nNodes = 3;
      for (var i = 0; i < nNodes; i++) {
        var node = new THREE.Mesh(nodeGeo, nodeMat);
        var a = (i / nNodes) * Math.PI * 2;
        node.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
        g.add(node);
      }
      g.rotation.x = tilt;
      g.userData.spin = 0.16 + Math.random() * 0.12;
      orbits.add(g);
      return g;
    }
    makeOrbit(3.05, Math.PI * 0.5,  GOLD_LIGHT);
    makeOrbit(3.5,  Math.PI * 0.32, NAVY_LIGHT);
    makeOrbit(3.9,  Math.PI * 0.68, GOLD);

    /* ── 3b. Mini estrellas dando vueltas a la cápsula ── */
    function makeStarShape(outer, inner, points) {
      var shape = new THREE.Shape();
      for (var i = 0; i < points * 2; i++) {
        var rad = (i % 2 === 0) ? outer : inner;
        var a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
        var x = Math.cos(a) * rad, y = Math.sin(a) * rad;
        if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
      }
      shape.closePath();
      return shape;
    }
    var starGeo = new THREE.ShapeGeometry(makeStarShape(0.11, 0.045, 5));
    var starBaseMat = new THREE.MeshBasicMaterial({
      color: GOLD_LIGHT, transparent: true, opacity: 0.9, side: THREE.DoubleSide
    });
    var stars = new THREE.Group();
    root.add(stars);
    var starList = [];
    var nStars = reduced ? 8 : 22;
    for (var sI = 0; sI < nStars; sI++) {
      var star = new THREE.Mesh(starGeo, starBaseMat.clone());
      var sAng = (sI / nStars) * Math.PI * 2;
      var sRad = 2.6 + Math.random() * 0.7;
      var sY   = (Math.random() - 0.5) * 2.4;
      star.userData = {
        ang: sAng, rad: sRad, y: sY,
        spin: 0.6 + Math.random() * 0.9,
        bob:  0.7 + Math.random() * 0.6,
        tw:   Math.random() * Math.PI * 2
      };
      // Posición inicial (para el frame estático en reduced-motion)
      star.position.set(Math.cos(sAng) * sRad, sY, Math.sin(sAng) * sRad);
      stars.add(star);
      starList.push(star);
    }

    /* ── 4. Campo de partículas doradas ── */
    var pCount = reduced ? 90 : 260;
    var pPos = new Float32Array(pCount * 3);
    for (var p = 0; p < pCount; p++) {
      var r  = 4.2 + Math.random() * 4.0;
      var th = Math.random() * Math.PI * 2;
      var ph = Math.acos(2 * Math.random() - 1);
      pPos[p * 3]     = r * Math.sin(ph) * Math.cos(th);
      pPos[p * 3 + 1] = r * Math.cos(ph) * 0.7;
      pPos[p * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    var pMat = new THREE.PointsMaterial({
      color: GOLD_LIGHT, size: 0.055, transparent: true, opacity: 0.7,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    });
    var particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* ── Iluminación cinematográfica ── */
    scene.add(new THREE.AmbientLight(0x6a78b0, 0.55));
    var keyLight = new THREE.PointLight(GOLD_LIGHT, 2.4, 40);
    keyLight.position.set(5, 4, 6);
    scene.add(keyLight);
    var rimLight = new THREE.PointLight(NAVY_LIGHT, 1.8, 40);
    rimLight.position.set(-6, -2, 3);
    scene.add(rimLight);
    var topLight = new THREE.DirectionalLight(0xffffff, 0.5);
    topLight.position.set(0, 6, 2);
    scene.add(topLight);

    /* ── Resize responsivo ── */
    function resize() {
      var w = mount.clientWidth  || 1;
      var h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    /* ── Parallax con cursor (suavizado) ── */
    var tx = 0, ty = 0, cx = 0, cy = 0;
    if (!matchMedia("(hover: none)").matches) {
      window.addEventListener("mousemove", function (e) {
        tx = (e.clientX / window.innerWidth  - 0.5);
        ty = (e.clientY / window.innerHeight - 0.5);
      }, { passive: true });
    }
    // Giroscopio en móvil (parallax sutil)
    if (window.DeviceOrientationEvent && matchMedia("(hover: none)").matches) {
      window.addEventListener("deviceorientation", function (e) {
        if (e.gamma == null) return;
        tx = Math.max(-0.5, Math.min(0.5, e.gamma / 45));
        ty = Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 90));
      }, { passive: true });
    }

    /* ── Visibilidad: pausa fuera de viewport / pestaña oculta ── */
    var onScreen = true, tabVisible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (ents) {
        onScreen = ents[0].isIntersecting;
        if (onScreen && tabVisible) start();
      }, { threshold: 0.01 }).observe(mount);
    }
    document.addEventListener("visibilitychange", function () {
      tabVisible = !document.hidden;
      if (tabVisible && onScreen) start();
    });

    /* ── Bucle de animación ── */
    var clock = new THREE.Clock();
    var rafId = null;

    function frame() {
      rafId = null;
      if (!onScreen || !tabVisible) return; // pausa total

      var dt = clock.getDelta();   // avanza clock.elapsedTime
      var t  = clock.elapsedTime;  // usar la acumulada (getDelta ya la actualizó)
      if (dt > 0.1) dt = 0.1;      // evita saltos tras una pausa larga

      // Flotación + balanceo del conjunto
      root.position.y = Math.sin(t * 0.8) * 0.18;
      root.rotation.y = t * 0.28;
      capsule.rotation.y = t * 0.5;
      shell.rotation.y = -t * 0.18;
      shell.rotation.x = t * 0.08;
      band.material.emissiveIntensity = 0.45 + Math.sin(t * 2.2) * 0.25;

      // Orbitales girando a distintas velocidades
      for (var i = 0; i < orbits.children.length; i++) {
        orbits.children[i].rotation.z += orbits.children[i].userData.spin * dt;
      }

      // Partículas en deriva lenta
      particles.rotation.y = t * 0.04;
      particles.rotation.x = Math.sin(t * 0.1) * 0.1;

      // Logo flotante en el centro (mira siempre a cámara; flota con vida propia)
      var logoY = Math.sin(t * 1.1) * 0.12;
      logoGlow.position.y = logoY;
      logoGlow.material.opacity = 0.6 + Math.sin(t * 1.6) * 0.18;
      if (logoSprite) {
        logoSprite.position.y = logoY;
        var pulse = 1 + Math.sin(t * 1.6) * 0.04;
        logoSprite.scale.set(1.35 * pulse, 1.35 * pulse, 1);
      }

      // Mini estrellas orbitando + parpadeo
      for (var s = 0; s < starList.length; s++) {
        var st = starList[s];
        var d  = st.userData;
        var a  = d.ang + t * 0.45;
        st.position.set(
          Math.cos(a) * d.rad,
          d.y + Math.sin(t * d.bob + s) * 0.18,
          Math.sin(a) * d.rad
        );
        st.lookAt(camera.position);   // billboard hacia la cámara
        st.rotateZ(t * d.spin);       // giro propio (destello)
        st.material.opacity = 0.55 + Math.abs(Math.sin(t * 2 + d.tw)) * 0.45;
      }

      // Parallax suavizado de la cámara
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;
      camera.position.x = cx * 1.6;
      camera.position.y = -cy * 1.1;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      loop();
    }

    function loop() {
      if (rafId == null && onScreen && tabVisible) rafId = requestAnimationFrame(frame);
    }
    function start() { if (rafId == null) loop(); }

    if (reduced) {
      // Sin movimiento: una sola toma estática y bonita
      onScreen = true; tabVisible = true;
      clock.getDelta();
      renderer.render(scene, camera);
    } else {
      start();
    }

    // Revela el canvas con un fundido cuando la 1ª toma está lista
    requestAnimationFrame(function () { mount.classList.add("is-ready"); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
