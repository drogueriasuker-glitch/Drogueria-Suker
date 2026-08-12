/* ============================================================
   ACADEMIA SUKER — REGISTRO DE USUARIOS (la "base de datos")
   ------------------------------------------------------------
   Este archivo es el padrón de boticarios con acceso a la
   Academia. Se edita a mano y se sube con el resto del sitio.

   NUNCA se guarda la contraseña en texto plano: solo su huella
   (hash SHA-256 encadenada 6.000 vueltas con una sal única).
   Para dar de alta a un boticario nuevo abre en el navegador:
       /tools/academia-alta-usuario.html
   escribe usuario y contraseña, y pega aquí la línea que genera.

   CAMPOS
   ┌──────────┬────────────────────────────────────────────────┐
   │ usuario  │ identificador para entrar (minúsculas, sin ñ)   │
   │ nombre   │ nombre del boticario — se saluda con este       │
   │ botica   │ razón/nombre comercial del establecimiento      │
   │ ciudad   │ plaza o distrito                                │
   │ rol      │ "boticario" | "admin"                           │
   │ estado   │ "activa" | "suspendida"  (suspendida = no entra)│
   │ expira   │ "AAAA-MM-DD" o null (sin caducidad)             │
   │ sal      │ cadena aleatoria única — no reutilizar          │
   │ hash     │ huella de la contraseña (la genera la tool)     │
   │ alta     │ fecha de creación, solo informativa             │
   └──────────┴────────────────────────────────────────────────┘

   AVISO DE SEGURIDAD (importante, léelo)
   El sitio es estático (sin servidor propio), así que esta
   verificación ocurre en el navegador del visitante. Sirve para
   reservar la Academia a los clientes y llevar orden, pero NO es
   una caja fuerte: alguien con conocimientos puede leer este
   archivo. Por eso:
     · Los videos de YouTube deben estar en modo "Oculto/No
       listado", nunca "Público".
     · No pongas aquí información confidencial (precios de
       compra, márgenes, datos de clientes).
     · No reutilices contraseñas que uses en otros servicios.
   Cuando la Academia crezca, el paso siguiente es mover esta
   validación a un servidor (Vercel Functions) — el resto del
   sistema ya está preparado para ese cambio.
   ============================================================ */

window.ACADEMIA_USUARIOS = {
  version: 1,
  vueltas: 6000,          // debe coincidir con academia-nucleo.js
  duracionSesionHoras: 12, // sesión normal
  duracionRecordarDias: 30, // con "mantener sesión iniciada"

  cuentas: [
    {
      usuario: "admin.suker",
      nombre:  "Equipo Suker",
      botica:  "Droguería Suker",
      ciudad:  "Juliaca",
      rol:     "admin",
      estado:  "activa",
      expira:  null,
      sal:     "cfbc6dc424b181ef",
      hash:    "d126ffe6add32cdb8e7580fa67edf77aa525ab841512f0df169eafc9037c6217",
      alta:    "2026-08-11"
    },
    {
      /* ── CUENTA DE PRUEBA ──
         Úsala para revisar la Academia mientras se termina de
         cargar el contenido. Bórrala antes de abrir al público. */
      usuario: "botica.demo",
      nombre:  "Boticario invitado",
      botica:  "Botica Demo",
      ciudad:  "Juliaca",
      rol:     "boticario",
      estado:  "activa",
      expira:  null,
      sal:     "d7f792c90b6bbe3f",
      hash:    "cffbaba287573d8aef163c0e9433b2a4fe53e5f227980b37580a7e36d8f242eb",
      alta:    "2026-08-11"
    },
    {
      /* Ejemplos listos para entregar. Cámbiales la contraseña
         con la tool antes de dárselos a un cliente real. */
      usuario: "botica.juliaca01",
      nombre:  "Boticario Juliaca 01",
      botica:  "—",
      ciudad:  "Juliaca",
      rol:     "boticario",
      estado:  "activa",
      expira:  null,
      sal:     "99706a026285af63",
      hash:    "f4944937fa15a6eca0956d81ff685ccef858f0106713520a600915bd6b8d79ca",
      alta:    "2026-08-11"
    },
    {
      usuario: "botica.azangaro01",
      nombre:  "Boticario Azángaro 01",
      botica:  "—",
      ciudad:  "Azángaro",
      rol:     "boticario",
      estado:  "activa",
      expira:  null,
      sal:     "f7d5a32c45859958",
      hash:    "0cdd02718a32f24fe171c5a377df48acf1fd27d77bee2f350398483a9da31be2",
      alta:    "2026-08-11"
    },
    {
      usuario: "botica.sananton01",
      nombre:  "Boticario San Antón 01",
      botica:  "—",
      ciudad:  "San Antón",
      rol:     "boticario",
      estado:  "activa",
      expira:  null,
      sal:     "66f7ce6424cc6443",
      hash:    "e9983ecc61c6b8fbb905ba5bff5af86f99d5ea35b29ffd013016088fd8ae61ad",
      alta:    "2026-08-11"
    }
  ]
};
