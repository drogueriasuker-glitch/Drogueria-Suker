/* ============================================================
   ACADEMIA SUKER — academia-datos.js  v=20260811
   Todo el contenido de las dos salas vive aquí. Para cambiar un
   texto o publicar un video NO hace falta tocar el HTML.

   ▸ PARA PUBLICAR UN VIDEO
     1. Sube el video a YouTube en modo "Oculto / No listado".
     2. Copia el ID: en youtu.be/U4YXMN_soo8 el ID es U4YXMN_soo8.
     3. En el módulo que corresponda pon:  id: "U4YXMN_soo8",
        estado: "disponible"  y borra la línea  demo: true.
     4. Ajusta "duracion" a la real (mm:ss o h:mm:ss).

   ▸ ESTADOS DE UN MÓDULO
     "disponible" → se ve la portada y se reproduce al hacer clic.
     "programado" → tarjeta con candado y la fecha/condición de
                    apertura (contenido por goteo: se habilita
                    cuando el boticario termina el anterior).

   ▸ NOTA DE RENDIMIENTO
     Los videos NUNCA se cargan al abrir la página: solo se pinta
     la portada (una imagen de ~15 KB) y el reproductor se inyecta
     recién cuando el usuario pulsa play. Por eso la sala abre
     igual de rápido con 6 módulos que con 60.
   ============================================================ */

window.ACADEMIA_CONTENIDO = {

  /* ══════════════════════════════════════════════════════════
     SALA 1 · FORMALES
     ══════════════════════════════════════════════════════════ */
  formales: {
    slug: "formales",
    cinta: "Sala 01 · Formales",
    titulo: 'Lo que <em>ya ganaste</em> siendo formal',
    bajada: 'Tú ya diste el paso más difícil: tienes tus permisos, compras con factura y respondes por lo que vendes. Esta sala existe para que veas con nombre y apellido <strong>todo lo que eso te está devolviendo</strong> — y para que sepas exactamente cómo exprimirlo.',
    acento: "oro",

    tarjetas: [
      {
        icono: "escudo",
        titulo: "Respaldo sanitario en cada caja",
        texto: "Todo lo que entra a tu botica tiene registro sanitario y llega por una cadena autorizada. No es un papel más en la pared: es la certeza de que el paciente que confía en ti se lleva exactamente lo que dice el empaque.",
        pie: "Permisos DIGEMID y DIREMID vigentes"
      },
      {
        icono: "ruta",
        titulo: "Trazabilidad de punta a punta",
        texto: "Lote, fecha de vencimiento y cadena de custodia quedan registrados en cada salida de almacén. Si un laboratorio observa un lote, tú sabes en minutos si lo tuviste, cuánto y a quién se lo vendiste.",
        pie: "Auditoría de vencimientos en cada despacho"
      },
      {
        icono: "grafico",
        titulo: "Crédito que crece con tu historial",
        texto: "La formalidad es lo que te convierte en sujeto de crédito. Con Suker la línea sube sola: un pedido limpio te abre 15 días, tres pedidos seguidos te dan 30, y seis meses sin mora te llevan a 45 días. Tu buen comportamiento vale dinero.",
        pie: "Nivel 0 → 3 · reglas escritas, sin regateo"
      },
      {
        icono: "recibo",
        titulo: "Facturas que te devuelven plata",
        texto: "Cada compra con comprobante electrónico es crédito fiscal y gasto deducible. Eso que el canal informal parece ahorrarte en el precio, tú lo recuperas al declarar — con la diferencia de que a ti nadie te lo puede quitar después.",
        pie: "Comprobante electrónico en cada pedido"
      },
      {
        icono: "portapapeles",
        titulo: "Fiscalización sin sobresaltos",
        texto: "Cuando llega DIREMID, SUNAT o la Municipalidad, tú abres tu archivador en vez de bajar la reja. Tener la documentación en regla significa algo muy concreto: tu botica no deja de vender ese día, ni el siguiente.",
        pie: "Documentación lista para inspección"
      },
      {
        icono: "corazon",
        titulo: "La confianza del barrio",
        texto: "El paciente no lee tu licencia, pero la siente. Se nota en el orden del anaquel, en la receta bien atendida y en el producto que sí hace efecto. La botica formal es a la que se vuelve — y la que aguanta cuando abre competencia al frente.",
        pie: "Reputación que ningún descuento compra"
      },
      {
        icono: "edificio",
        titulo: "Un negocio con techo alto",
        texto: "Con los papeles en orden puedes atender clínicas y consultorios, firmar convenios, abrir un segundo local o traspasar tu botica el día que quieras. La formalidad no es un gasto mensual: es lo que hace que tu negocio valga algo cuando alguien lo mida.",
        pie: "Acceso a clientes institucionales"
      }
    ],

    videos: [
      {
        modulo: "Módulo 1",
        titulo: "Qué significa de verdad ser una botica formal",
        resumen: "Más allá del certificado enmarcado: qué te habilita, qué te protege y qué puertas te abre la formalidad en el día a día del mostrador.",
        duracion: "15:12",
        id: "U4YXMN_soo8",
        estado: "disponible",
        demo: true
      },
      {
        modulo: "Módulo 2",
        titulo: "Registro sanitario DIGEMID: leerlo y verificarlo en 30 segundos",
        resumen: "Dónde mirar en el empaque, cómo confirmarlo en línea y qué hacer cuando un proveedor no te lo puede mostrar.",
        duracion: "16:40",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 1"
      },
      {
        modulo: "Módulo 3",
        titulo: "Buenas Prácticas de Almacenamiento en una botica pequeña",
        resumen: "Temperatura, humedad, rotación y orden del anaquel con el espacio que realmente tienes. Sin inventar un almacén que no existe.",
        duracion: "14:55",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 2"
      },
      {
        modulo: "Módulo 4",
        titulo: "Control de vencimientos sin volverte loco",
        resumen: "El método de los 60-30-15 días, qué canjear, qué rematar a tiempo y cómo dejar de perder plata en producto vencido.",
        duracion: "15:30",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 3"
      },
      {
        modulo: "Módulo 5",
        titulo: "Crédito, facturación y crédito fiscal explicado simple",
        resumen: "Cómo funciona tu línea, qué es un pedido limpio, y por qué la factura del proveedor termina siendo plata en tu bolsillo.",
        duracion: "17:05",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 4"
      },
      {
        modulo: "Módulo 6",
        titulo: "Cómo prepararte para una inspección de DIREMID",
        resumen: "La carpeta que debes tener lista, las diez observaciones más frecuentes y cómo responder sin ponerte nervioso.",
        duracion: "15:48",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 5"
      }
    ],

    cierre: {
      titulo: "Ya hiciste la parte difícil",
      texto: "Formalizarte costó tiempo, dinero y paciencia. Lo que sigue es cobrar ese esfuerzo: mejor crédito, mejor surtido, respaldo técnico y un proveedor que te trata como aliado y no como número de pedido.",
      pasos: [],
      botones: [
        { tipo: "wa", texto: "Hablar con mi asesor Suker", url: "https://wa.me/51932667799?text=Hola%20Suker%2C%20estoy%20en%20la%20Academia%20y%20quiero%20aprovechar%20mejor%20mi%20l%C3%ADnea%20de%20cr%C3%A9dito" },
        { tipo: "fantasma", texto: "Ver la sala de informales", url: "../informales/", transicion: true }
      ]
    }
  },

  /* ══════════════════════════════════════════════════════════
     SALA 2 · INFORMALES
     ══════════════════════════════════════════════════════════ */
  informales: {
    slug: "informales",
    cinta: "Sala 02 · Informales",
    titulo: 'El costo real del <em>canal informal</em>',
    bajada: 'Esta sala no juzga a nadie. Comprar en el mercado informal casi siempre empieza por una razón entendible: la caja está justa y el precio tienta. Lo que aquí verás es <strong>la cuenta completa</strong> — la que no aparece en la boleta, pero se paga igual.',
    acento: "riesgo",

    tarjetas: [
      {
        icono: "alerta",
        titulo: "Producto que nadie puede respaldar",
        texto: "Sin registro sanitario no hay forma de saber si el principio activo está, si está completo, o si viajó tres días a cuarenta grados en la tolva de un camión. El empaque puede ser idéntico al original. Lo de adentro, no.",
        pie: "Sin registro no hay garantía posible"
      },
      {
        icono: "brujula",
        titulo: "Cuando algo sale mal, no hay dónde mirar",
        texto: "El día que un laboratorio retira un lote, el que compró informal no tiene lote que buscar, ni factura que revisar, ni proveedor que conteste el teléfono. La duda se queda íntegra en tu mostrador.",
        pie: "Sin lote ni cadena de custodia"
      },
      {
        icono: "martillo",
        titulo: "Multas, decomiso y cierre temporal",
        texto: "Una intervención no termina en una conversación: termina en acta, con la mercadería decomisada y una multa calculada en UIT. Y mientras dure la observación, la botica no vende. El ahorro de meses se va en una tarde.",
        pie: "Sanción administrativa + mercadería perdida"
      },
      {
        icono: "billete",
        titulo: "Cada compra es plata que no vuelve",
        texto: "Sin comprobante no hay crédito fiscal ni gasto deducible. Ante SUNAT tu botica aparece comprando poco y vendiendo mucho, y esa diferencia la terminas pagando tú — muchas veces con intereses encima.",
        pie: "Compra invisible = utilidad inflada"
      },
      {
        icono: "candado",
        titulo: "Siempre al contado, siempre justo de caja",
        texto: "El canal informal no da crédito, no fía y no te construye historial. Tu capital vive congelado en cajas y cada campaña fuerte te encuentra sin espalda para comprar cuando más se vende.",
        pie: "Sin línea de crédito ni historial"
      },
      {
        icono: "persona",
        titulo: "La responsabilidad se queda contigo",
        texto: "Si un paciente se agrava, el que vendió informal ya no está. El nombre en la boleta, el rótulo en la puerta y la cara conocida del barrio son los tuyos. La responsabilidad también es tuya, aunque el producto no lo fuera.",
        pie: "Responsabilidad sanitaria del titular"
      },
      {
        icono: "techo",
        titulo: "Un negocio que no puede crecer",
        texto: "Sin formalidad no hay convenio con clínicas, ni licitación, ni banco que te evalúe, ni comprador que te tase el día que quieras vender. Puedes sostener la botica muchos años, pero no puedes hacerla crecer.",
        pie: "Techo comercial y financiero"
      }
    ],

    videos: [
      {
        modulo: "Módulo 1",
        titulo: "Cómo entra el producto informal a Juliaca",
        resumen: "La ruta real de la mercadería sin registro, quién la mueve y por qué llega tan barata al mostrador de tu barrio.",
        duracion: "15:20",
        id: "U4YXMN_soo8",
        estado: "disponible",
        demo: true
      },
      {
        modulo: "Módulo 2",
        titulo: "Medicamento falsificado: reconocerlo en el mostrador",
        resumen: "Señales en el troquelado, el lote, la tinta y el blíster que puedes revisar en segundos antes de recibir un pedido.",
        duracion: "16:10",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 1"
      },
      {
        modulo: "Módulo 3",
        titulo: "Cadena de frío rota: el daño que no se ve",
        resumen: "Qué le pasa a una insulina, a una vacuna o a un antibiótico cuando viaja sin control de temperatura por el altiplano.",
        duracion: "14:40",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 2"
      },
      {
        modulo: "Módulo 4",
        titulo: "Multas, decomisos y cierre: qué dice la norma",
        resumen: "El marco sancionador explicado en criollo: qué se considera falta, cuánto cuesta y qué pasa con tu stock incautado.",
        duracion: "15:55",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 3"
      },
      {
        modulo: "Módulo 5",
        titulo: "La matemática real del precio barato",
        resumen: "Sacamos la cuenta completa: descuento aparente contra crédito fiscal, mermas, devoluciones y riesgo. El número sorprende.",
        duracion: "15:05",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 4"
      },
      {
        modulo: "Módulo 6",
        titulo: "Del canal informal a un proveedor formal, paso a paso",
        resumen: "Cómo hacer la transición sin quedarte sin stock ni descapitalizarte: qué migrar primero y en qué orden.",
        duracion: "17:30",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 5"
      }
    ],

    cierre: {
      titulo: "El puente ya está construido",
      texto: "Pasar al canal formal no exige cambiarlo todo de golpe. Se hace por partes, empezando por lo que más rota, y con alguien que te acompañe en el camino. Estos son los cuatro pasos que seguimos con cada botica.",
      pasos: [
        { titulo: "Diagnóstico sin compromiso", texto: "Revisamos juntos qué compras hoy, a quién y a qué precio real." },
        { titulo: "Migración por categorías", texto: "Empezamos por lo de mayor rotación. El resto sigue su ritmo." },
        { titulo: "Primer pedido con factura", texto: "Contado, sin mínimos imposibles. Es tu prueba, no un contrato." },
        { titulo: "Tu línea de crédito", texto: "Con un pedido limpio ya entras al Nivel 1 y empieza a subir sola." }
      ],
      botones: [
        { tipo: "wa", texto: "Quiero mi diagnóstico gratuito", url: "https://wa.me/51932667799?text=Hola%20Suker%2C%20vengo%20de%20la%20Academia%20y%20quiero%20un%20diagn%C3%B3stico%20para%20mi%20botica" },
        { tipo: "fantasma", texto: "Ver los beneficios de ser formal", url: "../formales/", transicion: true }
      ]
    }
  }
};
