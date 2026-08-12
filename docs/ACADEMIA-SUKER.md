# Academia Suker — guía de operación

Área privada de formación para boticas aliadas, dentro del mismo sitio
estático de `drogueriasuker.com`. No necesita servidor, base de datos ni
instalación: se sube por FTP o se despliega en Vercel como el resto.

> **Nota:** este archivo no contiene contraseñas. Las de las cuentas ya
> creadas se entregaron por separado; guárdalas donde corresponda.

---

## 1. Direcciones

| Dirección | Qué es |
|---|---|
| `https://drogueriasuker.com/academiasuker` | Portada con acceso + las dos salas |
| `https://drogueriasuker.com/academiasuker/formales` | Sala 01 · beneficios de ser formal |
| `https://drogueriasuker.com/academiasuker/informales` | Sala 02 · costo del canal informal |

Se entra por el botón dorado **Academia Suker** de la cabecera del sitio
principal (visible en computadora y en celular). Si alguien abre una sala
sin haber ingresado, se le pide la contraseña y luego se le lleva
directo a la sala que quería ver.

---

## 2. Archivos

```
academiasuker/
  index.html                 portada + formulario de acceso + las dos salas
  formales/index.html        sala 01  (el contenido NO está aquí)
  informales/index.html      sala 02  (el contenido NO está aquí)

assets/academia/
  academia.css               estilos del área (independiente de styles.css)
  academia-config.js      ←  DIRECCIÓN DEL EXCEL DE ACCESOS
  academia-datos.js       ←  TODO EL CONTENIDO (textos, videos, PDF, Drive)
  academia-usuarios.js       padrón local de respaldo
  academia-nucleo.js         acceso, sesión y pantalla "procesando datos"
  academia-sala.js           pinta las salas y las pantallas de módulo

tools/
  academia-usuarios.html     PANEL DE ACCESOS (crear y ver boticarios)
  academia-alta-usuario.html alta manual, sin Excel (respaldo)

docs/
  apps-script-academia.gs    código para pegar en el Excel
```

Los dos archivos marcados con ← son los únicos que se tocan en el día a día.

---

## 3. El Excel de accesos

Los usuarios y contraseñas viven en una hoja de cálculo de Google, igual
que el cuestionario de la web. **Es el mismo método**: una hoja + un
programita de Apps Script publicado como aplicación web.

La diferencia con el cuestionario es que aquí la hoja no solo recibe
datos, también **responde**: cuando un boticario intenta entrar, la
Academia le pregunta a Google si el usuario y la contraseña son
correctos. Así la contraseña se comprueba en el servidor y **nunca llega
al navegador de quien intenta entrar**. Es bastante más seguro que
tenerlas en un archivo del sitio.

### 3.1 Conectarlo (se hace una sola vez)

**Paso 1 · Crea la hoja.**
En Google Drive → Nueva hoja de cálculo. Llámala
**«Academia Suker — Accesos»**. No crees ninguna pestaña: el programa
las crea solo.

**Paso 2 · Pega el programa.**
En la hoja: `Extensiones → Apps Script`. Borra lo que haya y pega
completo el contenido de `docs/apps-script-academia.gs`. Guarda con el
icono del disquete.

**Paso 3 · Pon tu clave de administrador.**
En Apps Script: `Configuración del proyecto` (el engranaje) →
`Propiedades del script` → `Agregar propiedad`.

| Campo | Valor |
|---|---|
| Propiedad | `CLAVE_ADMIN` |
| Valor | la que tú elijas (ej. `Suker#Admin2026`) |

Esa clave es la que te pedirá el panel para crear accesos. Sin ella,
nadie puede agregar usuarios aunque descubra la dirección.

**Paso 4 · Prepara las hojas.**
Arriba del editor, en el desplegable de funciones elige `prepararHoja` y
pulsa **Ejecutar**. Google te pedirá permiso la primera vez: acepta con
tu cuenta (te va a advertir que la app "no está verificada" — es tuya,
entra en *Configuración avanzada → Ir a…*). Al terminar verás las
pestañas **Usuarios** e **Ingresos** creadas.

**Paso 5 · Publica la aplicación web.**
`Implementar → Nueva implementación` → engranaje → **Aplicación web**.

| Campo | Valor |
|---|---|
| Descripción | Academia Suker v1 |
| Ejecutar como | **Yo** (tu cuenta) |
| Quién tiene acceso | **Cualquier persona** |

Pulsa *Implementar* y copia la **URL que termina en `/exec`**.

> «Cualquier persona» suena riesgoso pero no lo es: significa que
> cualquiera puede *preguntar*, no que pueda ver la hoja. Sin la
> contraseña correcta la respuesta es siempre «no». Y para crear
> usuarios hace falta además la `CLAVE_ADMIN`.

**Paso 6 · Pega la dirección en el sitio.**
Abre `assets/academia/academia-config.js` y ponla entre las comillas:

```js
endpoint: "https://script.google.com/macros/s/AKfyc.../exec",
```

Sube el archivo. Listo: ya está conectado.

### 3.2 Usarlo todos los días

Entra a `https://drogueriasuker.com/tools/academia-usuarios.html`,
escribe tu `CLAVE_ADMIN` y desde ahí puedes:

- **Crear un acceso** — usuario, contraseña (o pulsa el dado para que la
  invente), nombre, botica y ciudad. El boticario puede entrar de
  inmediato: no hay que tocar ni subir ningún archivo.
- **Ver el padrón completo** — con las contraseñas a la vista, para
  poder recordárselas a un cliente que la perdió.
- **Suspender o reactivar** a cualquiera con un clic.
- **Ver quién entró y cuántas veces** — la columna *Ingresos* te dice
  quién está aprovechando la Academia y quién necesita un empujón.

La pestaña **Ingresos** de la hoja guarda cada intento, incluidos los
fallidos. Si alguien anda probando contraseñas, ahí se ve.

### 3.3 Detalles que conviene saber

- Tras **8 intentos fallidos seguidos** el mismo usuario queda frenado
  15 minutos. Es automático.
- Puedes ponerle **fecha de vencimiento** a un acceso (campo *Vence*).
- Si Google no responde (sin internet, corte del servicio), la Academia
  recurre al **padrón local** de `academia-usuarios.js`, donde siguen
  `admin.suker` y `botica.demo`. Nadie se queda afuera.
- Mientras no pegues la dirección en `academia-config.js`, todo funciona
  con el padrón local, exactamente como hasta ahora.
- **El Excel no se comparte con nadie fuera del equipo:** ahí están las
  contraseñas en claro para que puedas entregárselas a los clientes.

---

## 4. Publicar un video

Todo está en `assets/academia/academia-datos.js`.

1. Sube el video a YouTube en modo **Oculto / No listado** (nunca Público:
   es la única protección real del contenido).
2. Copia el ID. En `youtu.be/U4YXMN_soo8` el ID es `U4YXMN_soo8`.
3. En el módulo que corresponda:
   ```js
   id: "U4YXMN_soo8",
   estado: "disponible",
   duracion: "15:12",
   ```
   y borra la línea `demo: true` (es la que pone la etiqueta "Vista previa").
4. Sube el archivo. Listo, no se toca ningún HTML.

Los módulos con `estado: "programado"` muestran un candado y la condición
de apertura (`habilita: "..."`). Sirven para publicar por goteo.

Hoy hay **dos módulos con video de muestra** (el institucional de 36 s,
marcado como "Vista previa") para que puedas probar el reproductor:
`formales` módulo 1 e `informales` módulo 1.

---

## 5. Por qué carga rápido

- **Los videos no se descargan al abrir la sala.** Solo se pinta la portada
  (una imagen de ~15 KB desde YouTube) y el reproductor se inserta recién
  al pulsar play. Con 6 módulos eso ahorra más de 1,5 MB y unas 20
  peticiones por página.
- **Hoja de estilos propia y liviana**: el área no carga los 100 KB de
  `styles.css` del sitio público.
- **Las salas se precargan** mientras el boticario mira la portada, así el
  clic en "Entrar a la sala" se siente instantáneo.
- **Esqueletos y aparición progresiva**: se ve estructura desde el primer
  instante, nunca una pantalla en blanco.
- **Pantalla "procesando datos"** con anillo de avance y mensajes
  ("Verificando credenciales…", "Preparando tu sala…") al ingresar y al
  cambiar de sala, para que la espera se sienta acompañada.
- Todo respeta "reducir movimiento" del sistema operativo.

---

## 6. Hasta dónde protege el acceso (importante)

El sitio es estático: no hay servidor propio que valide contraseñas, así
que la verificación ocurre en el navegador del visitante.

**Qué sí hace:** reserva la Academia a los clientes, lleva orden de quién
tiene acceso, permite suspender y hacer caducar cuentas, y guarda las
contraseñas como huella encadenada (6.000 vueltas de SHA-256 con sal
única) — nunca en texto plano.

**Qué no hace:** no es una caja fuerte. Alguien con conocimientos técnicos
puede leer el padrón y los IDs de video en el código de la página.

Por eso, mientras siga así:

- Los videos van en YouTube como **Oculto / No listado**.
- No poner en la Academia información confidencial (precios de compra,
  márgenes, datos de clientes).
- No reutilizar contraseñas de otros servicios.

**Cuando la Academia crezca**, el siguiente paso es mover la validación a
un servidor (Vercel Functions). El resto del sistema —salas, contenido,
diseño, videos— queda igual; solo cambia `academia-nucleo.js`.

---

## 7. Detalles técnicos

- La sesión dura **12 horas**, o **30 días** si el boticario marca
  "mantener la sesión iniciada". Se ajusta en `academia-usuarios.js`.
- Las páginas llevan `noindex` y están bloqueadas en `robots.txt`;
  `vercel.json` además manda `X-Robots-Tag: noindex` para `/academiasuker/`
  y `/tools/`.
- `vercel.json` sirve `assets/academia/*` con `no-cache` para que un alta
  de usuario tome efecto de inmediato.
- Los videos se incrustan desde `youtube-nocookie.com`, ya permitido por la
  política de seguridad (CSP) del sitio.
- El avance del boticario ("módulos iniciados") se guarda en su propio
  navegador; no se envía a ningún lado.
