---
name: drogueria-futurista-3d
description: >-
  Genera sitios web estáticos premium para droguerías y distribuidoras
  farmacéuticas (Perú): parte de la base oscura tipo "Droguería Suker" (splash,
  header sticky, hero, nosotros, catálogo, contacto, footer, WhatsApp) y le añade
  estética futurista — escena 3D real con Three.js en el hero, animaciones fluidas,
  varias paletas neón y layouts modernos. HTML/CSS/JS puro, sin build ni npm, listo
  para subir por FTP a Hostinger. Úsalo cuando pidan crear/rehacer la web de una
  droguería, farmacia o distribuidora de medicamentos con look moderno/3D/futurista.
---

# Droguería Futurista 3D — generador de webs

Crea webs de **droguería/distribuidora farmacéutica** que arrancan de la base premium de Droguería
Suker y suben el nivel visual con **3D real (Three.js)**, animaciones fluidas, **varias paletas
futuristas** y layouts modernos. Salida: estática (HTML+CSS+JS), sin build, lista para FTP.

## Cuándo usar

- "Hazme la web de mi droguería / farmacia / distribuidora de medicamentos."
- "Quiero algo moderno, futurista, con 3D y animaciones fluidas" para ese rubro.
- Rehacer/clonar el estilo de Droguería Suker para otro negocio del rubro.

No usar para: apps con backend/DB, tiendas con carrito real, o sitios ajenos al rubro farmacéutico.

## Lee primero (en este orden)

1. `reference/01-base-structure.md` — el esqueleto fijo del que SIEMPRE se parte ("que empiece así").
2. `reference/07-gotchas-deploy.md` — errores que rompen el sitio en silencio + cierre/deploy.
3. `reference/03-threejs-3d.md` — la firma 3D y su fallback robusto.
4. `reference/06-content-pharma.md` — contenido y SEO del rubro (droguería ≠ farmacia).
5. `reference/02-palettes.md`, `reference/04-fluid-animations.md`, `reference/05-modern-layouts.md`
   — según lo que el proyecto necesite.

## Flujo (minimiza fricción; el cliente no es técnico)

### 1 · Intake mínimo (un solo mensaje, ≤5 preguntas)
Pregunta solo lo que no puedas inferir:
1. Nombre/marca de la droguería.
2. Paleta futurista preferida (`suker-gold`, `neon-teal`, `violet-blue`, `mint-clinic`, `glass-light`)
   o "elige tú" (ver `02-palettes.md` para decidir).
3. WhatsApp real (si no, se deja placeholder visible `51XXXXXXXXX`).
4. Logo/fotos propias (o usar el placeholder existente).
5. Algo que la web DEBA incluir (texto libre, opcional).
Datos del rubro (dirección, ciudad/región, horario, correo, dominio) pídelos si no los tienes; el
horario por defecto es Lun–Vie 8am–5pm.
Todo lo demás (fuentes, efectos, escena 3D, layout) decídelo en silencio.

### 2 · Setup silencioso
- Crea la carpeta del proyecto con `assets/img/`, `lib/`.
- Descarga librerías (gsap, ScrollTrigger, three). **Detecta el entorno:**
  - Con Python: `python scripts/download_libs.py --target <proyecto>/lib`
  - Sin Python (p.ej. Windows/PowerShell): `powershell -NoProfile -File scripts/download_libs.ps1 -Target "<proyecto>\lib"`
  - Si nada funciona, descarga los tres archivos a mano desde cdnjs.com. Si falla three, el sitio degrada al bloom.
- Copia `templates/htaccess.template` como `<proyecto>/.htaccess`.

### 3 · Generar
A partir de los templates (`base-index.html`, `base-styles.css`, `base-main.js`):
- Reemplaza TODOS los marcadores `{{…}}`.
- Aplica la paleta elegida (clase `palette-…` en `<body>`).
- Inyecta el contenido del rubro (`06-content-pharma.md`) y el JSON-LD `Pharmacy`.
- Elige **una** escena 3D para el hero (`capsules` | `molecule` | `particles`).
- Suma 4–5 efectos fluidos como mucho (los del template ya cuentan) y **un** layout moderno destacado.
- Crea `.claude/launch.json` para el preview en :8765 (servidor estático).

### 4 · Verificar
Corre el verificador y corrige lo que reporte (errores, no avisos):
- Con Python: `python scripts/verify_project.py --project <proyecto>`
- Sin Python: `powershell -NoProfile -File scripts/verify_project.ps1 -Project "<proyecto>"`

### 5 · Preview
`preview_start` en :8765. Verifica por DOM (`preview_eval`) y `preview_console_logs`
(las capturas suelen dar timeout — ver `07-gotchas-deploy.md`). Comprueba: splash aparece y se oculta,
el hero monta `<canvas>` o cae a `.no-webgl`, los `.reveal` se activan, sin errores en consola.

### 6 · Entrega
Ruta del proyecto + "el preview corre en :8765" + una frase de deploy (arrastrar a Hostinger por FTP)
+ recordatorio de reemplazar el WhatsApp si quedó placeholder. Sin cátedra técnica.

## Reglas duras (NUNCA romper)

- Sin `<script type="module">`, sin `import/export`, sin npm/build/frameworks. IIFE + `<script defer>`.
- `?v=YYYYMMDD[letra]` en cada `<link>`/`<script>`; `.htaccess` en la raíz.
- Contenido hardcodeado en HTML (se lee sin JS); la animación solo enriquece.
- Cada `init*` en `safe()`. Reveal con threshold ≤0.05 + safety-net 6s. Splash con doble seguridad.
- 3D: detectar WebGL, fallback `.no-webgl`, DPR limitado, pausa fuera de viewport, estático en
  reduced-motion / móvil de gama baja.
- **No** gatear micro-interacciones con `prefers-reduced-motion` (Windows lo trae ON); solo lo intrusivo.
- 4–5 efectos por página máximo; una sola firma visual (la escena 3D).
- Una sola paleta por sitio. La escena 3D toma su color de `--accent` (no hardcodear).
- Rubro: por defecto **sin** inyectología/inyectables/fórmulas médicas salvo confirmación.

## Índice de archivos

```
SKILL.md
reference/01-base-structure.md   05-modern-layouts.md
reference/02-palettes.md         06-content-pharma.md
reference/03-threejs-3d.md       07-gotchas-deploy.md
reference/04-fluid-animations.md
scripts/download_libs.py(.ps1)   scripts/verify_project.py(.ps1)
templates/base-index.html  base-styles.css  base-main.js  htaccess.template  launch.json.template
```
