/* ============================================================
   ACADEMIA SUKER — academia-config.js
   ------------------------------------------------------------
   Aquí se pega la dirección del Excel de accesos (la aplicación
   web de Google Apps Script). Es lo ÚNICO que hay que cambiar
   para conectar la Academia con la hoja de cálculo.

   CÓMO OBTENERLA
     1. Abre la hoja "Academia Suker — Accesos".
     2. Extensiones → Apps Script → pega docs/apps-script-academia.gs
     3. Implementar → Nueva implementación → Aplicación web
        · Ejecutar como:      Yo
        · Quién tiene acceso: Cualquier persona
     4. Copia la URL que termina en /exec y pégala abajo.

   El paso a paso completo está en docs/ACADEMIA-SUKER.md.

   MIENTRAS ESTÉ VACÍO
   La Academia sigue funcionando con el padrón local de
   academia-usuarios.js. No se rompe nada.

   CUANDO TENGA LA DIRECCIÓN
   El ingreso se verifica en el servidor de Google: la contraseña
   deja de viajar al navegador del visitante y basta con agregar
   una fila en la hoja para dar acceso a un boticario nuevo.
   Si Google no responde (sin señal, corte), la Academia recurre
   al padrón local para que nadie se quede afuera.
   ============================================================ */

window.ACADEMIA_CONFIG = {

  /* Pega aquí la URL /exec de tu aplicación web */
  endpoint: "",

  /* Segundos de espera antes de recurrir al padrón local */
  esperaMaxima: 12,

  /* Si un usuario existe en la hoja Y en el archivo local,
     manda lo que diga la hoja (es la fuente de verdad). */
  prioridadHoja: true
};
