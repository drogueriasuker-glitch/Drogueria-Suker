/* ============================================================
   ACADEMIA SUKER — academia-datos.js  v=20260812
   Todo el contenido de las dos salas vive aquí. Para cambiar un
   texto, publicar un video o colgar un PDF NO hace falta tocar
   el HTML.

   ▸ CÓMO ES UN MÓDULO
     Cada módulo tiene su propia pantalla: al hacer clic en la
     tarjeta se abre con su texto, su video y su material de
     apoyo (PDF, Drive, plantillas, enlaces… los que quieras).

     {
       modulo:   "Módulo 2",              rótulo corto
       titulo:   "…",                     título del módulo
       resumen:  "…",                     una línea, para la tarjeta
       duracion: "16:40",                 la real que muestra YouTube
       id:       "U4YXMN_soo8",           ID del video de YouTube
       estado:   "disponible",            o "programado" (candado)
       habilita: "Se habilita al…",       solo si está "programado"
       demo:     true,                    pone la etiqueta "Vista previa"
       descripcion: "…",                  párrafo(s) de la pantalla
       aprenderas: ["…", "…"],            lista de lo que se lleva
       recursos: [ … ]                    material de apoyo (abajo)
     }

   ▸ CÓMO AGREGAR MATERIAL A UN MÓDULO
     Dentro de "recursos" agrega tantos como quieras:

     { tipo: "pdf",    titulo: "Guía rápida",  detalle: "PDF · 4 páginas",  url: "https://…" }

     Tipos disponibles (cada uno pinta su propio icono y color):
       "pdf"      documento PDF
       "drive"    carpeta de Google Drive
       "hoja"     Google Sheets / Excel
       "doc"      Google Docs / Word
       "imagen"   infografía, afiche, foto
       "enlace"   página web externa
       "video"    video extra (otro de YouTube)
       "wa"       conversación de WhatsApp

     Si dejas url: "" el material aparece en gris como
     "Disponible pronto" — no se rompe nada.

   ▸ PARA PUBLICAR UN VIDEO
     1. Súbelo a YouTube en modo "Oculto / No listado".
     2. En youtu.be/U4YXMN_soo8 el ID es U4YXMN_soo8.
     3. Pon el id, cambia estado a "disponible", ajusta duracion
        y borra las lineas habilita y demo.

   ▸ NOTA DE RENDIMIENTO
     Los videos NUNCA se cargan al abrir la sala: solo se pinta
     la portada y el reproductor se inyecta al pulsar play.
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
        demo: true,
        descripcion: "Casi todos los boticarios saben que necesitan sus permisos, pero pocos han visto en una sola imagen todo lo que esos permisos les están dando. En este módulo ordenamos el panorama completo: qué te habilita legalmente cada documento, qué riesgos te quita de encima y — lo que más interesa — qué oportunidades comerciales solo existen para ti por tenerlos en regla.",
        aprenderas: [
          "Qué documentos debe tener colgados y vigentes tu botica, y cuál revisa primero un inspector",
          "La diferencia real entre estar registrado y estar en regla",
          "Por qué la formalidad es lo que te convierte en sujeto de crédito",
          "Qué clientes (clínicas, consultorios, convenios) solo puedes atender siendo formal"
        ],
        recursos: [
          { tipo: "pdf",   titulo: "Checklist: los 9 documentos de tu botica", detalle: "PDF · 2 páginas · para imprimir", url: "" },
          { tipo: "drive", titulo: "Carpeta de formatos editables",           detalle: "Google Drive",                    url: "" },
          { tipo: "enlace",titulo: "Consulta de establecimientos DIGEMID",    detalle: "Sitio oficial del MINSA",         url: "https://www.digemid.minsa.gob.pe/" }
        ]
      },
      {
        modulo: "Módulo 2",
        titulo: "Registro sanitario DIGEMID: leerlo y verificarlo en 30 segundos",
        resumen: "Dónde mirar en el empaque, cómo confirmarlo en línea y qué hacer cuando un proveedor no te lo puede mostrar.",
        duracion: "16:40",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 1",
        descripcion: "El registro sanitario es la diferencia entre un medicamento y una caja con pastillas adentro. Aquí te enseñamos a leerlo en el empaque sin lupa, a verificarlo en el buscador oficial en menos de medio minuto, y a reconocer las señales de un registro vencido, cancelado o simplemente inventado.",
        aprenderas: [
          "Dónde está impreso el registro sanitario en cada tipo de empaque",
          "Cómo verificarlo en el buscador de DIGEMID desde tu celular",
          "Qué significa que un registro esté vencido, suspendido o cancelado",
          "Qué responder cuando un proveedor no te lo quiere mostrar"
        ],
        recursos: [
          { tipo: "pdf",    titulo: "Guía visual: dónde mirar en cada empaque", detalle: "PDF · 4 páginas", url: "" },
          { tipo: "enlace", titulo: "Buscador de registro sanitario",           detalle: "DIGEMID en línea", url: "https://www.digemid.minsa.gob.pe/" }
        ]
      },
      {
        modulo: "Módulo 3",
        titulo: "Buenas Prácticas de Almacenamiento en una botica pequeña",
        resumen: "Temperatura, humedad, rotación y orden del anaquel con el espacio que realmente tienes. Sin inventar un almacén que no existe.",
        duracion: "14:55",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 2",
        descripcion: "Las Buenas Prácticas de Almacenamiento están escritas pensando en almacenes grandes, y eso desanima a quien tiene diez metros cuadrados. En este módulo las traducimos a la realidad de una botica de barrio en el altiplano: qué es obligatorio, qué es recomendable y cómo cumplir con lo que ya tienes.",
        aprenderas: [
          "Los rangos de temperatura y humedad que sí debes controlar, y con qué",
          "Cómo ordenar el anaquel para que la rotación se dé sola",
          "Qué productos nunca deben ir juntos ni cerca de la ventana",
          "El registro diario mínimo que te cubre ante una inspección"
        ],
        recursos: [
          { tipo: "hoja", titulo: "Planilla de control de temperatura y humedad", detalle: "Google Sheets · lista para copiar", url: "" },
          { tipo: "pdf",  titulo: "Cartilla de orden del anaquel",                detalle: "PDF · para pegar en la pared",      url: "" }
        ]
      },
      {
        modulo: "Módulo 4",
        titulo: "Control de vencimientos sin volverte loco",
        resumen: "El método de los 60-30-15 días, qué canjear, qué rematar a tiempo y cómo dejar de perder plata en producto vencido.",
        duracion: "15:30",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 3",
        descripcion: "El producto vencido es plata que ya pagaste y que se va directo a la basura. Aquí montamos un sistema simple —de cuaderno o de Excel, tú eliges— que te avisa a los 60, 30 y 15 días, para que siempre tengas tiempo de canjear con el proveedor o rematar antes de perderlo todo.",
        aprenderas: [
          "Cómo montar el aviso de 60-30-15 días sin sistema caro",
          "Qué se puede canjear con el proveedor y hasta cuándo",
          "Cuándo conviene rematar y a qué precio para no perder",
          "Cómo dar de baja lo vencido dejando constancia"
        ],
        recursos: [
          { tipo: "hoja", titulo: "Plantilla de control de vencimientos", detalle: "Google Sheets · con alertas automáticas", url: "" },
          { tipo: "pdf",  titulo: "Acta de baja de producto vencido",     detalle: "PDF · formato para llenar",              url: "" }
        ]
      },
      {
        modulo: "Módulo 5",
        titulo: "Crédito, facturación y crédito fiscal explicado simple",
        resumen: "Cómo funciona tu línea, qué es un pedido limpio, y por qué la factura del proveedor termina siendo plata en tu bolsillo.",
        duracion: "17:05",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 4",
        descripcion: "Este es el módulo de la plata. Explicamos sin tecnicismos qué es el crédito fiscal, por qué una compra con factura te sale más barata de lo que parece, y cómo funciona exactamente la línea de crédito de Suker: qué es un pedido limpio, cuándo sube tu nivel y qué la hace bajar.",
        aprenderas: [
          "Qué es el crédito fiscal y cómo calcular cuánto te devuelve una compra",
          "Los cuatro niveles de crédito de Suker y qué pide cada uno",
          "Qué cuenta como pedido limpio y qué te hace bajar de nivel",
          "Cómo ordenar tus comprobantes para no perder ninguno"
        ],
        recursos: [
          { tipo: "hoja",  titulo: "Calculadora: cuánto te devuelve comprar con factura", detalle: "Google Sheets", url: "" },
          { tipo: "pdf",   titulo: "Los 4 niveles de crédito Suker",                      detalle: "PDF · 1 página", url: "" },
          { tipo: "wa",    titulo: "Consultar mi nivel de crédito actual",                detalle: "WhatsApp con tu asesor", url: "https://wa.me/51932667799?text=Hola%20Suker%2C%20quiero%20saber%20en%20qu%C3%A9%20nivel%20de%20cr%C3%A9dito%20estoy" }
        ]
      },
      {
        modulo: "Módulo 6",
        titulo: "Cómo prepararte para una inspección de DIREMID",
        resumen: "La carpeta que debes tener lista, las diez observaciones más frecuentes y cómo responder sin ponerte nervioso.",
        duracion: "15:48",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 5",
        descripcion: "Una inspección deja de dar miedo cuando sabes exactamente qué van a pedirte. Armamos juntos la carpeta que debe estar siempre lista, repasamos las diez observaciones que más se repiten en Puno y ensayamos cómo responder con tranquilidad cuando algo no está perfecto.",
        aprenderas: [
          "Qué lleva la carpeta de inspección, documento por documento",
          "Las diez observaciones más frecuentes y cómo evitarlas antes",
          "Qué decir y qué no decir durante la visita",
          "Qué hacer en los días siguientes si te dejan una observación"
        ],
        recursos: [
          { tipo: "pdf",   titulo: "Carpeta de inspección: índice completo", detalle: "PDF · 3 páginas",  url: "" },
          { tipo: "drive", titulo: "Formatos de la carpeta, editables",      detalle: "Google Drive",     url: "" }
        ]
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
        demo: true,
        descripcion: "Para decidir bien hay que entender primero cómo funciona el otro lado. Seguimos la ruta completa de la mercadería informal que llega a Juliaca: de dónde sale, por dónde entra, cuántas manos toca y en qué condiciones viaja. Cuando ves el recorrido completo, el precio bajo deja de ser un misterio.",
        aprenderas: [
          "La ruta real del producto sin registro hasta tu barrio",
          "Por qué el precio es tan bajo y qué se está ahorrando en el camino",
          "En qué condiciones viaja la mercadería por el altiplano",
          "Cómo reconocer a un proveedor informal aunque se presente como formal"
        ],
        recursos: [
          { tipo: "pdf",    titulo: "Señales de alerta de un proveedor informal", detalle: "PDF · 2 páginas", url: "" },
          { tipo: "enlace", titulo: "Verificar si un proveedor está autorizado",  detalle: "DIGEMID en línea", url: "https://www.digemid.minsa.gob.pe/" }
        ]
      },
      {
        modulo: "Módulo 2",
        titulo: "Medicamento falsificado: reconocerlo en el mostrador",
        resumen: "Señales en el troquelado, el lote, la tinta y el blíster que puedes revisar en segundos antes de recibir un pedido.",
        duracion: "16:10",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 1",
        descripcion: "Un medicamento falsificado bien hecho engaña a simple vista, pero casi siempre falla en los detalles. Repasamos con ejemplos reales qué mirar en el troquelado, el lote, la tinta, el blíster y el sellado, para que puedas descartar un lote sospechoso antes de firmar la recepción.",
        aprenderas: [
          "Los seis puntos que se revisan en menos de un minuto",
          "Diferencias de impresión y troquelado que delatan una copia",
          "Qué hacer si ya recibiste un lote sospechoso",
          "A quién y cómo reportarlo"
        ],
        recursos: [
          { tipo: "pdf",    titulo: "Los 6 puntos de revisión, ilustrados", detalle: "PDF · para pegar en recepción", url: "" },
          { tipo: "imagen", titulo: "Comparativo: original vs. falsificado", detalle: "Infografía",                    url: "" }
        ]
      },
      {
        modulo: "Módulo 3",
        titulo: "Cadena de frío rota: el daño que no se ve",
        resumen: "Qué le pasa a una insulina, a una vacuna o a un antibiótico cuando viaja sin control de temperatura por el altiplano.",
        duracion: "14:40",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 2",
        descripcion: "Un producto que perdió la cadena de frío se ve exactamente igual que uno bueno. Ese es todo el problema. Explicamos qué le pasa por dentro a una insulina o a un antibiótico cuando el termómetro se sale de rango, por qué el paciente no lo nota hasta que el tratamiento no funciona, y cómo protegerte al recibir.",
        aprenderas: [
          "Qué productos exigen cadena de frío y cuál es su rango real",
          "Qué le ocurre al principio activo cuando la cadena se rompe",
          "Cómo verificar la temperatura al recibir un pedido",
          "Cuándo debes rechazar una entrega, sin discutir"
        ],
        recursos: [
          { tipo: "pdf",  titulo: "Productos de cadena de frío y sus rangos", detalle: "PDF · tabla de consulta", url: "" },
          { tipo: "hoja", titulo: "Registro de recepción con temperatura",    detalle: "Google Sheets",           url: "" }
        ]
      },
      {
        modulo: "Módulo 4",
        titulo: "Multas, decomisos y cierre: qué dice la norma",
        resumen: "El marco sancionador explicado en criollo: qué se considera falta, cuánto cuesta y qué pasa con tu stock incautado.",
        duracion: "15:55",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 3",
        descripcion: "Nadie lee el reglamento completo, pero todos deberían conocer las consecuencias. Traducimos el marco sancionador a lenguaje de mostrador: qué conductas se consideran falta, en qué rango de UIT se mueve cada una, qué pasa con la mercadería incautada y cuánto tiempo puede quedarse cerrada una botica.",
        aprenderas: [
          "Qué se considera falta leve, grave y muy grave",
          "El rango de multas en UIT y cómo se calcula",
          "Qué ocurre con el stock decomisado (y por qué no vuelve)",
          "Cuánto puede durar un cierre temporal y qué se pierde mientras tanto"
        ],
        recursos: [
          { tipo: "pdf", titulo: "Resumen del cuadro de sanciones", detalle: "PDF · 2 páginas", url: "" }
        ]
      },
      {
        modulo: "Módulo 5",
        titulo: "La matemática real del precio barato",
        resumen: "Sacamos la cuenta completa: descuento aparente contra crédito fiscal, mermas, devoluciones y riesgo. El número sorprende.",
        duracion: "15:05",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 4",
        descripcion: "Aquí no hay moral, hay calculadora. Tomamos una compra real y le sacamos la cuenta completa: el descuento aparente del canal informal contra el crédito fiscal que pierdes, las mermas que no puedes canjear, las devoluciones que nadie te acepta y el riesgo de multa. El resultado suele sorprender a quien lo ve por primera vez.",
        aprenderas: [
          "Cómo calcular el costo real de una compra, no el precio de lista",
          "Cuánto vale en soles el crédito fiscal que estás dejando de usar",
          "Qué peso tienen las mermas y devoluciones que no puedes canjear",
          "Cómo comparar dos proveedores con el mismo criterio"
        ],
        recursos: [
          { tipo: "hoja", titulo: "Comparador de costo real por proveedor", detalle: "Google Sheets · llena y compara", url: "" },
          { tipo: "pdf",  titulo: "El ejemplo del video, paso a paso",      detalle: "PDF · 3 páginas",                url: "" }
        ]
      },
      {
        modulo: "Módulo 6",
        titulo: "Del canal informal a un proveedor formal, paso a paso",
        resumen: "Cómo hacer la transición sin quedarte sin stock ni descapitalizarte: qué migrar primero y en qué orden.",
        duracion: "17:30",
        id: "",
        estado: "programado",
        habilita: "Se habilita al terminar el Módulo 5",
        descripcion: "Cambiar de proveedor da miedo cuando tu caja depende de la rotación diaria. Por eso la transición se hace por partes y en un orden que protege tu flujo: qué categorías migrar primero, cómo negociar el primer pedido, y en cuánto tiempo entras a la línea de crédito. Es el camino que ya recorrimos con otras boticas.",
        aprenderas: [
          "Qué categorías conviene migrar primero y por qué",
          "Cómo hacer el primer pedido sin descapitalizarte",
          "En cuántas semanas se completa una transición típica",
          "Qué pedirle a tu nuevo proveedor desde el primer día"
        ],
        recursos: [
          { tipo: "pdf", titulo: "Plan de transición en 4 semanas",   detalle: "PDF · 2 páginas",        url: "" },
          { tipo: "wa",  titulo: "Pedir mi diagnóstico sin compromiso", detalle: "WhatsApp con tu asesor", url: "https://wa.me/51932667799?text=Hola%20Suker%2C%20vengo%20del%20M%C3%B3dulo%206%20y%20quiero%20mi%20diagn%C3%B3stico" }
        ]
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
