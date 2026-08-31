/* ============================================================
   ACADEMIA SUKER — academia-datos.js  v=20260813
   Las 4 rutas y sus 3 videos cada una. Todo el contenido vive
   aquí: para cambiar un texto, publicar un video o colgar un
   PDF no hace falta tocar el HTML.

   ▸ ESTRUCTURA
     ruta  →  3 videos  →  cada video tiene su pantalla con
              el reproductor y su material de apoyo.

   ▸ PARA PUBLICAR UN VIDEO
     1. Súbelo a YouTube en modo "Oculto / No listado".
     2. En youtu.be/U4YXMN_soo8 el ID es U4YXMN_soo8.
     3. Pon el id y cambia estado a "disponible".
     4. Ajusta "duracion" a la real que muestra YouTube.

   ▸ PARA COLGAR MATERIAL DE APOYO
     Dentro de "recursos" agrega los que quieras:

     { tipo: "pdf", titulo: "Resumen del módulo", detalle: "PDF · 1 página", url: "https://…" }

     Tipos: pdf · drive · hoja · doc · imagen · enlace · video · wa
     Sin url aparece en gris como "Pronto" y no rompe nada.

   ▸ RENDIMIENTO
     Los videos NUNCA se cargan al abrir la ruta: solo se pinta
     la portada y el reproductor se inyecta al pulsar play.
   ============================================================ */

window.ACADEMIA_RUTAS = [

  /* ══════════════════ RUTA 1 ══════════════════ */
  {
    slug: "vender-mejor",
    numero: 1,
    nombre: "Vender mejor",
    lema: "Que el paciente vuelva, no que compre más.",
    descripcion: "Tres módulos cortos sobre lo que pasa en el mostrador: qué puedes recomendar con tranquilidad, cómo cuidar al cliente que vuelve cada mes y qué contestar cuando te dicen que está caro.",
    acento: "#FFC401",
    escena: "mostrador",
    videos: [
      {
        titulo: "Autocuidado que sí puedes recomendar",
        duracion: "7 min",
        id: "",
        estado: "proximamente",
        descripcion: "Qué productos de autocuidado puedes recomendar con tranquilidad desde el mostrador, y dónde está el límite.",
        recursos: [
          { tipo: "pdf",   titulo: "Resumen del módulo",  detalle: "PDF · 1 página", url: "" },
          { tipo: "drive", titulo: "Carpeta del módulo",  detalle: "Google Drive",   url: "" }
        ]
      },
      {
        titulo: "Tu cliente crónico vale 12 ventas al año",
        duracion: "6 min",
        id: "",
        estado: "proximamente",
        descripcion: "Cómo cuidar al paciente que vuelve todos los meses por su tratamiento, y por qué es el más valioso de tu botica.",
        recursos: [
          { tipo: "pdf",   titulo: "Resumen del módulo",  detalle: "PDF · 1 página", url: "" },
          { tipo: "drive", titulo: "Carpeta del módulo",  detalle: "Google Drive",   url: "" }
        ]
      },
      {
        titulo: "“Está muy caro”: qué contestar",
        duracion: "6 min",
        id: "",
        estado: "proximamente",
        descripcion: "Qué responder cuando te dicen que está caro, sin regalar tu margen ni perder la venta.",
        recursos: [
          { tipo: "pdf",   titulo: "Resumen del módulo",  detalle: "PDF · 1 página", url: "" },
          { tipo: "drive", titulo: "Carpeta del módulo",  detalle: "Google Drive",   url: "" }
        ]
      }
    ]
  },

  /* ══════════════════ RUTA 2 ══════════════════ */
  {
    slug: "comprar-y-ganar",
    numero: 2,
    nombre: "Comprar y ganar",
    lema: "Dónde se gana la plata de verdad.",
    descripcion: "Tres módulos sobre el otro lado del negocio: cuánto te queda de verdad en el cajón, qué plata tienes dormida en el anaquel y cuánto te termina costando una compra barata.",
    acento: "#34D399",
    escena: "cajas",
    videos: [
      {
        titulo: "Margen real vs. lo que queda en el cajón",
        duracion: "8 min",
        id: "",
        estado: "proximamente",
        descripcion: "La diferencia entre el margen que crees que tienes y la plata que realmente queda al cerrar el día.",
        recursos: [
          { tipo: "pdf",   titulo: "Resumen del módulo",  detalle: "PDF · 1 página", url: "" },
          { tipo: "drive", titulo: "Carpeta del módulo",  detalle: "Google Drive",   url: "" }
        ]
      },
      {
        titulo: "La plata dormida",
        duracion: "7 min",
        id: "",
        estado: "proximamente",
        descripcion: "El capital que tienes parado en el anaquel sin rotar, y cómo despertarlo.",
        recursos: [
          { tipo: "pdf",   titulo: "Resumen del módulo",  detalle: "PDF · 1 página", url: "" },
          { tipo: "drive", titulo: "Carpeta del módulo",  detalle: "Google Drive",   url: "" }
        ]
      },
      {
        titulo: "El costo real de una compra barata",
        duracion: "9 min",
        id: "",
        estado: "proximamente",
        descripcion: "Cómo sacar la cuenta completa de una compra, más allá del precio de lista.",
        recursos: [
          { tipo: "pdf",   titulo: "Resumen del módulo",  detalle: "PDF · 1 página", url: "" },
          { tipo: "drive", titulo: "Carpeta del módulo",  detalle: "Google Drive",   url: "" }
        ]
      }
    ]
  },

  /* ══════════════════ RUTA 3 ══════════════════ */
  {
    slug: "botica-ordenada",
    numero: 3,
    nombre: "Mi botica ordenada",
    lema: "Que nada se venza y nada te sorprenda.",
    descripcion: "Tres módulos sobre el orden diario: cómo ver de un vistazo qué está por vencer, cómo cuidar el producto a 3.825 metros de altura y qué puede hacer cada persona de tu equipo.",
    acento: "#6FC3FF",
    escena: "estante",
    videos: [
      {
        titulo: "El semáforo de tus vencimientos",
        duracion: "8 min",
        id: "",
        estado: "proximamente",
        descripcion: "Un sistema simple para ver de un vistazo qué está por vencer y actuar a tiempo.",
        recursos: [
          { tipo: "pdf",   titulo: "Resumen del módulo",  detalle: "PDF · 1 página", url: "" },
          { tipo: "drive", titulo: "Carpeta del módulo",  detalle: "Google Drive",   url: "" }
        ]
      },
      {
        titulo: "Temperatura, humedad y altura",
        duracion: "7 min",
        id: "",
        estado: "proximamente",
        descripcion: "Qué cuidar en el almacenamiento cuando tu botica está a 3.825 metros sobre el nivel del mar.",
        recursos: [
          { tipo: "pdf",   titulo: "Resumen del módulo",  detalle: "PDF · 1 página", url: "" },
          { tipo: "drive", titulo: "Carpeta del módulo",  detalle: "Google Drive",   url: "" }
        ]
      },
      {
        titulo: "Qué puede y qué no puede hacer tu técnico",
        duracion: "7 min",
        id: "",
        estado: "proximamente",
        descripcion: "Los límites de cada rol dentro de la botica, explicados sin vueltas.",
        recursos: [
          { tipo: "pdf",   titulo: "Resumen del módulo",  detalle: "PDF · 1 página", url: "" },
          { tipo: "drive", titulo: "Carpeta del módulo",  detalle: "Google Drive",   url: "" }
        ]
      }
    ]
  },

  /* ══════════════════ RUTA 4 ══════════════════ */
  {
    slug: "botica-digital",
    numero: 4,
    nombre: "Mi botica digital",
    lema: "Herramientas que no te cuestan nada.",
    descripcion: "Tres módulos para usar el celular a favor de tu botica: WhatsApp Business, mandar tu pedido con una foto del cuaderno y qué no deberías preguntarle nunca a una inteligencia artificial.",
    acento: "#FFDD73",
    escena: "celular",
    videos: [
      {
        titulo: "WhatsApp Business para tu botica",
        duracion: "7 min",
        id: "",
        estado: "proximamente",
        descripcion: "Cómo dejar tu WhatsApp listo para atender pedidos sin complicarte.",
        recursos: [
          { tipo: "pdf",   titulo: "Resumen del módulo",  detalle: "PDF · 1 página", url: "" },
          { tipo: "drive", titulo: "Carpeta del módulo",  detalle: "Google Drive",   url: "" }
        ]
      },
      {
        titulo: "La foto de tu cuaderno en lista de pedido",
        duracion: "7 min",
        id: "",
        estado: "proximamente",
        descripcion: "Cómo mandar tu pedido con una foto de tu cuaderno y que llegue bien entendido.",
        recursos: [
          { tipo: "pdf",   titulo: "Resumen del módulo",  detalle: "PDF · 1 página", url: "" },
          { tipo: "drive", titulo: "Carpeta del módulo",  detalle: "Google Drive",   url: "" }
        ]
      },
      {
        titulo: "Lo que NUNCA debes preguntarle a la IA",
        duracion: "5 min",
        id: "",
        estado: "proximamente",
        descripcion: "Los límites de la inteligencia artificial en una botica, y por qué hay preguntas que solo responde un profesional.",
        recursos: [
          { tipo: "pdf",   titulo: "Resumen del módulo",  detalle: "PDF · 1 página", url: "" },
          { tipo: "drive", titulo: "Carpeta del módulo",  detalle: "Google Drive",   url: "" }
        ]
      }
    ]
  }
];

/* Acceso rápido por slug (lo usa academia-ruta.js) */
window.ACADEMIA_POR_SLUG = {};
window.ACADEMIA_RUTAS.forEach(function (r) { window.ACADEMIA_POR_SLUG[r.slug] = r; });
