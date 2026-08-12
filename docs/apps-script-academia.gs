/**
 * ============================================================
 * ACADEMIA SUKER — Apps Script del Excel de accesos
 * ------------------------------------------------------------
 * Pega este código en el editor de Apps Script de la hoja de
 * cálculo "Academia Suker — Accesos" y publícalo como aplicación
 * web. Las instrucciones paso a paso están en
 * docs/ACADEMIA-SUKER.md, sección "El Excel de accesos".
 *
 * QUÉ HACE
 *  · crear   → agrega un boticario nuevo a la hoja
 *  · entrar  → verifica usuario y contraseña cuando alguien
 *              intenta entrar a la Academia
 *  · listar  → devuelve el padrón para la herramienta interna
 *  · estado  → activa o suspende una cuenta
 *
 * POR QUÉ IMPORTA
 * La contraseña se verifica AQUÍ, en el servidor de Google, y
 * nunca viaja al navegador del visitante. Es bastante más seguro
 * que el padrón que vive en el archivo del sitio.
 * ============================================================
 */

/* ---------- Ajustes ---------- */
var HOJA_USUARIOS = 'Usuarios';
var HOJA_INGRESOS = 'Ingresos';
var MAX_INTENTOS  = 8;      // intentos fallidos seguidos antes de frenar
var MINUTOS_FRENO = 15;     // cuánto dura el freno

/* La clave de administrador NO va escrita aquí.
   Se guarda en: Configuración del proyecto → Propiedades del script
   Propiedad:  CLAVE_ADMIN     Valor: la que tú elijas          */
function claveAdmin_() {
  return PropertiesService.getScriptProperties().getProperty('CLAVE_ADMIN') || '';
}

/* ---------- Columnas de la hoja ---------- */
var COLUMNAS = [
  'Fecha de alta', 'Usuario', 'Contraseña', 'Nombre', 'Botica', 'Ciudad',
  'Rol', 'Estado', 'Vence', 'Último ingreso', 'Ingresos', 'Notas'
];
var C_FECHA = 0, C_USUARIO = 1, C_CLAVE = 2, C_NOMBRE = 3, C_BOTICA = 4,
    C_CIUDAD = 5, C_ROL = 6, C_ESTADO = 7, C_VENCE = 8, C_ULTIMO = 9,
    C_INGRESOS = 10, C_NOTAS = 11;

/* ============================================================
   Punto de entrada
   ============================================================ */
function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var accion = String(p.accion || '').toLowerCase();

    if (accion === 'entrar') { return responder_(entrar_(p)); }
    if (accion === 'crear')  { return responder_(crear_(p));  }
    if (accion === 'listar') { return responder_(listar_(p)); }
    if (accion === 'estado') { return responder_(estado_(p)); }

    return responder_({ ok: false, error: 'accion_desconocida' });
  } catch (err) {
    return responder_({ ok: false, error: 'error_interno', detalle: String(err) });
  }
}

/* Permite probar desde el navegador que la publicación funciona */
function doGet() {
  return responder_({ ok: true, servicio: 'Academia Suker', version: 1 });
}

function responder_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ============================================================
   Hojas
   ============================================================ */
function hojaUsuarios_() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var h = libro.getSheetByName(HOJA_USUARIOS);
  if (!h) {
    h = libro.insertSheet(HOJA_USUARIOS);
    h.appendRow(COLUMNAS);
    h.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold').setBackground('#02164A').setFontColor('#FFC401');
    h.setFrozenRows(1);
  }
  return h;
}

function hojaIngresos_() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var h = libro.getSheetByName(HOJA_INGRESOS);
  if (!h) {
    h = libro.insertSheet(HOJA_INGRESOS);
    h.appendRow(['Fecha', 'Usuario', 'Resultado', 'Detalle']);
    h.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#02164A').setFontColor('#FFC401');
    h.setFrozenRows(1);
  }
  return h;
}

function anotarIngreso_(usuario, resultado, detalle) {
  try {
    hojaIngresos_().appendRow([new Date(), usuario, resultado, detalle || '']);
  } catch (err) { /* si falla el registro, no se cae el login */ }
}

/* ============================================================
   Utilidades
   ============================================================ */
function normalizar_(s) {
  return String(s == null ? '' : s).trim().toLowerCase();
}

function filasUsuarios_() {
  var h = hojaUsuarios_();
  var ultima = h.getLastRow();
  if (ultima < 2) { return []; }
  return h.getRange(2, 1, ultima - 1, COLUMNAS.length).getValues();
}

function buscarFila_(usuario) {
  var filas = filasUsuarios_();
  var u = normalizar_(usuario);
  for (var i = 0; i < filas.length; i++) {
    if (normalizar_(filas[i][C_USUARIO]) === u) {
      return { fila: i + 2, datos: filas[i] };
    }
  }
  return null;
}

function vigente_(datos) {
  if (normalizar_(datos[C_ESTADO]) !== 'activa') { return false; }
  var vence = datos[C_VENCE];
  if (vence instanceof Date) {
    var limite = new Date(vence.getTime());
    limite.setHours(23, 59, 59, 999);
    if (new Date() > limite) { return false; }
  }
  return true;
}

/* Freno simple contra intentos a ciegas */
function frenado_(usuario) {
  var cache = CacheService.getScriptCache();
  var n = parseInt(cache.get('fallos_' + normalizar_(usuario)) || '0', 10);
  return n >= MAX_INTENTOS;
}

function sumarFallo_(usuario) {
  var cache = CacheService.getScriptCache();
  var llave = 'fallos_' + normalizar_(usuario);
  var n = parseInt(cache.get(llave) || '0', 10) + 1;
  cache.put(llave, String(n), MINUTOS_FRENO * 60);
}

function limpiarFallos_(usuario) {
  CacheService.getScriptCache().remove('fallos_' + normalizar_(usuario));
}

/* ============================================================
   ACCIÓN: entrar — la usa la Academia al iniciar sesión
   ============================================================ */
function entrar_(p) {
  var usuario = String(p.usuario || '').trim();
  var clave   = String(p.clave || '');

  if (!usuario || !clave) {
    return { ok: false, error: 'faltan_datos' };
  }

  if (frenado_(usuario)) {
    anotarIngreso_(usuario, 'BLOQUEADO', 'Demasiados intentos seguidos');
    return { ok: false, error: 'demasiados_intentos' };
  }

  var reg = buscarFila_(usuario);
  if (!reg || String(reg.datos[C_CLAVE]) !== clave) {
    sumarFallo_(usuario);
    anotarIngreso_(usuario, 'FALLIDO', reg ? 'Contraseña incorrecta' : 'Usuario inexistente');
    return { ok: false, error: 'credenciales' };
  }

  if (!vigente_(reg.datos)) {
    anotarIngreso_(usuario, 'RECHAZADO', 'Cuenta suspendida o vencida');
    return { ok: false, error: 'suspendida' };
  }

  limpiarFallos_(usuario);

  /* Deja constancia del ingreso en la propia fila */
  var h = hojaUsuarios_();
  h.getRange(reg.fila, C_ULTIMO + 1).setValue(new Date());
  h.getRange(reg.fila, C_INGRESOS + 1).setValue((parseInt(reg.datos[C_INGRESOS], 10) || 0) + 1);
  anotarIngreso_(usuario, 'OK', reg.datos[C_BOTICA] || '');

  return {
    ok: true,
    usuario: String(reg.datos[C_USUARIO]),
    nombre:  String(reg.datos[C_NOMBRE] || reg.datos[C_USUARIO]),
    botica:  String(reg.datos[C_BOTICA] || ''),
    rol:     String(reg.datos[C_ROL] || 'boticario')
  };
}

/* ============================================================
   ACCIÓN: crear — la usa la herramienta interna
   ============================================================ */
function crear_(p) {
  if (String(p.admin || '') !== claveAdmin_() || !claveAdmin_()) {
    return { ok: false, error: 'admin_invalido' };
  }

  var usuario = normalizar_(p.usuario);
  var clave   = String(p.clave || '');

  if (!usuario || !clave) { return { ok: false, error: 'faltan_datos' }; }
  if (!/^[a-z0-9._-]+$/.test(usuario)) { return { ok: false, error: 'usuario_invalido' }; }
  if (clave.length < 6) { return { ok: false, error: 'clave_corta' }; }
  if (buscarFila_(usuario)) { return { ok: false, error: 'usuario_repetido' }; }

  hojaUsuarios_().appendRow([
    new Date(),
    usuario,
    clave,
    String(p.nombre || 'Boticario'),
    String(p.botica || ''),
    String(p.ciudad || ''),
    String(p.rol || 'boticario'),
    'activa',
    p.vence ? new Date(p.vence) : '',
    '',
    0,
    String(p.notas || '')
  ]);

  return { ok: true, usuario: usuario, clave: clave };
}

/* ============================================================
   ACCIÓN: listar — devuelve el padrón a la herramienta interna
   ============================================================ */
function listar_(p) {
  if (String(p.admin || '') !== claveAdmin_() || !claveAdmin_()) {
    return { ok: false, error: 'admin_invalido' };
  }

  var cuentas = filasUsuarios_().map(function (f) {
    return {
      usuario:  String(f[C_USUARIO]),
      clave:    String(f[C_CLAVE]),
      nombre:   String(f[C_NOMBRE] || ''),
      botica:   String(f[C_BOTICA] || ''),
      ciudad:   String(f[C_CIUDAD] || ''),
      rol:      String(f[C_ROL] || 'boticario'),
      estado:   String(f[C_ESTADO] || ''),
      vence:    f[C_VENCE] instanceof Date ? Utilities.formatDate(f[C_VENCE], 'GMT-5', 'yyyy-MM-dd') : '',
      ultimo:   f[C_ULTIMO] instanceof Date ? Utilities.formatDate(f[C_ULTIMO], 'GMT-5', 'yyyy-MM-dd HH:mm') : '',
      ingresos: parseInt(f[C_INGRESOS], 10) || 0
    };
  });

  return { ok: true, total: cuentas.length, cuentas: cuentas };
}

/* ============================================================
   ACCIÓN: estado — activa o suspende una cuenta
   ============================================================ */
function estado_(p) {
  if (String(p.admin || '') !== claveAdmin_() || !claveAdmin_()) {
    return { ok: false, error: 'admin_invalido' };
  }

  var reg = buscarFila_(p.usuario);
  if (!reg) { return { ok: false, error: 'no_existe' }; }

  var nuevo = normalizar_(p.estado) === 'activa' ? 'activa' : 'suspendida';
  hojaUsuarios_().getRange(reg.fila, C_ESTADO + 1).setValue(nuevo);

  return { ok: true, usuario: String(reg.datos[C_USUARIO]), estado: nuevo };
}

/* ============================================================
   Ejecuta esto UNA VEZ desde el editor para dejar la hoja lista
   ============================================================ */
function prepararHoja() {
  hojaUsuarios_();
  hojaIngresos_();
  SpreadsheetApp.getActiveSpreadsheet().toast('Hojas listas. Ahora publica la aplicación web.');
}
