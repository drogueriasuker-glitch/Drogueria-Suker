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
  academia-usuarios.js    ←  PADRÓN DE BOTICARIOS (usuarios y huellas)
  academia-datos.js       ←  TODO EL CONTENIDO (textos y videos)
  academia-nucleo.js         acceso, sesión y pantalla "procesando datos"
  academia-sala.js           pinta las salas y maneja los videos

tools/
  academia-alta-usuario.html herramienta interna para crear accesos
```

Los dos archivos marcados con ← son los únicos que se tocan en el día a día.

---

## 3. Dar de alta a un boticario

1. Abre `https://drogueriasuker.com/tools/academia-alta-usuario.html`.
2. Escribe el usuario (minúsculas, sin ñ ni tildes: `botica.sanmartin`) y
   una contraseña, o pulsa el dado para que sugiera una.
3. Completa nombre, botica y ciudad y pulsa **Generar ficha**.
4. Copia la ficha y pégala dentro de `cuentas: [ … ]` en
   `assets/academia/academia-usuarios.js`.
5. Sube el archivo. **Cambia el `?v=` de la fecha** en las tres páginas
   HTML si quieres forzar la actualización inmediata en navegadores que
   ya visitaron el sitio.
6. Entrega al boticario el usuario y la contraseña de la línea amarilla.

**La contraseña no se puede recuperar después.** Solo se guarda su huella.
Si un cliente la pierde, se genera una nueva y se reemplaza su ficha.

Para **suspender** un acceso: cambia `estado: "activa"` por
`estado: "suspendida"`. Para que caduque solo: `expira: "2027-03-31"`.

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
