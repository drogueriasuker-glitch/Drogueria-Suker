# Videos de la Academia Suker — guía de grabación y publicación

Cómo grabar, subir y publicar los 12 módulos de ~15 minutos sin que la
página se ponga lenta.

---

## 1. Los 12 módulos que faltan grabar

Los títulos y descripciones ya están escritos en la web. Grábalos con
estos nombres para que todo calce.

### Sala Formales

| # | Título | Duración objetivo | Estado |
|---|---|---|---|
| 1 | Qué significa de verdad ser una botica formal | 15:00 | muestra puesta |
| 2 | Registro sanitario DIGEMID: leerlo y verificarlo en 30 segundos | 16:00 | por grabar |
| 3 | Buenas Prácticas de Almacenamiento en una botica pequeña | 15:00 | por grabar |
| 4 | Control de vencimientos sin volverte loco | 15:00 | por grabar |
| 5 | Crédito, facturación y crédito fiscal explicado simple | 17:00 | por grabar |
| 6 | Cómo prepararte para una inspección de DIREMID | 15:00 | por grabar |

### Sala Informales

| # | Título | Duración objetivo | Estado |
|---|---|---|---|
| 1 | Cómo entra el producto informal a Juliaca | 15:00 | muestra puesta |
| 2 | Medicamento falsificado: reconocerlo en el mostrador | 16:00 | por grabar |
| 3 | Cadena de frío rota: el daño que no se ve | 15:00 | por grabar |
| 4 | Multas, decomisos y cierre: qué dice la norma | 16:00 | por grabar |
| 5 | La matemática real del precio barato | 15:00 | por grabar |
| 6 | Del canal informal a un proveedor formal, paso a paso | 17:00 | por grabar |

Si cambias un título, cámbialo también en
`assets/academia/academia-datos.js`. Es un archivo de texto: se edita el
título entre comillas y listo.

---

## 2. Cómo grabar

**Quién.** El QF Gerente (Gilver) da la autoridad técnica; la bata con el
logo UPCH es parte del mensaje. Para los módulos 5 de cada sala
(los de plata y crédito) puede entrar Aristo o Cielo.

**Formato de grabación.**

| Parámetro | Valor |
|---|---|
| Resolución | 1920×1080 (Full HD). No hace falta 4K |
| Cuadros por segundo | 30 fps |
| Orientación | Horizontal, siempre |
| Audio | Micrófono de solapa. Es lo que más se nota si falla |
| Encuadre | Medio (de la cintura para arriba), cámara a la altura de los ojos |
| Fondo | Almacén con anaqueles surtidos, o pared lisa con el logo |

**Estructura de los 15 minutos** (lo que mejor retiene atención):

1. **0:00–0:30 — Gancho.** La pregunta que el boticario se hace.
   "¿Sabes qué pasa si mañana entra DIREMID a tu botica?"
2. **0:30–1:00 — Qué se va a llevar.** "Al terminar vas a saber…"
3. **1:00–12:00 — El contenido**, en 3 bloques de ~4 minutos. Un solo
   punto por bloque.
4. **12:00–14:00 — Un caso real** de Juliaca, Azángaro o San Antón.
   Sin nombres propios.
5. **14:00–15:00 — Cierre.** Una acción concreta para hacer esta semana
   + "cualquier duda, escríbeme por WhatsApp".

**Consejos que se notan mucho:**

- Grabar en **tomas cortas** y unirlas. Nadie sale bien de corrido 15 min.
- Hablar como en visita a botica, no como en conferencia.
- Si vas a mostrar un empaque, un blíster o un registro sanitario,
  **acércalo a cámara y deja la toma 3 segundos** — se entiende más que
  cualquier explicación.
- No leer diapositivas.

---

## 3. Cómo subirlos a YouTube

Sube todo a la cuenta de YouTube de Droguería Suker.

**Al subir, configura así:**

| Campo | Qué poner |
|---|---|
| Visibilidad | **Oculto (No listado)** ← lo más importante |
| Título | `Academia Suker · Módulo 2 · Registro sanitario DIGEMID` |
| Descripción | 2 líneas + "Contenido exclusivo para boticas aliadas" |
| Miniatura | Personalizada, 1280×720 (ver abajo) |
| Público infantil | No |
| Playlist | "Academia Suker — Formales" / "— Informales" |
| Categoría | Educación |

### Por qué "Oculto" y no "Privado" ni "Público"

- **Público** = cualquiera lo encuentra buscando. No sirve: el contenido
  es el beneficio de ser cliente.
- **Privado** = solo tú lo ves. **No se puede incrustar**, así que la
  Academia mostraría un error.
- **Oculto / No listado** = no sale en búsquedas ni en tu canal, pero sí
  se puede incrustar. **Esta es la correcta.**

### La miniatura importa más de lo que parece

Es lo único que el boticario ve antes de decidir si mira el video, y es
lo único que la página descarga al abrir la sala. Hazla 1280×720, con el
número de módulo grande, 4 o 5 palabras máximo y los colores de la marca
(navy #02164A + amarillo #FFC401). Que se lea en un celular pequeño.

---

## 4. Cómo ponerlos en la web

Un solo archivo: `assets/academia/academia-datos.js`.

**Paso 1.** Del enlace de YouTube saca el ID:

```
https://youtu.be/U4YXMN_soo8              →  U4YXMN_soo8
https://www.youtube.com/watch?v=U4YXMN_soo8  →  U4YXMN_soo8
```

Es lo que va después de `youtu.be/` o de `watch?v=`.

**Paso 2.** Busca el módulo en el archivo y déjalo así:

```js
{
  modulo: "Módulo 2",
  titulo: "Registro sanitario DIGEMID: leerlo y verificarlo en 30 segundos",
  resumen: "Dónde mirar en el empaque, cómo confirmarlo en línea y qué hacer…",
  duracion: "16:40",        ← la duración real que muestra YouTube
  id: "AQUI_EL_ID",         ← pega el ID
  estado: "disponible"      ← cambia "programado" por "disponible"
}
```

Y **borra la línea `habilita:`** (la del candado) si la tiene.

**Paso 3.** En los dos módulos de muestra, borra además la línea
`demo: true` — es la que pone la etiqueta amarilla "Vista previa".

**Paso 4.** Sube el archivo. Los cambios se ven al instante: ese archivo
se sirve sin caché a propósito.

No hay que tocar ningún HTML, ni CSS, ni recompilar nada.

---

## 5. Por qué no se va a poner lenta

Esta fue la preocupación principal, y está resuelta de raíz.

**Los videos no se descargan al abrir la sala.** Lo que se pinta es solo
la **portada** de cada video (una imagen de unos 15 KB que sirve YouTube).
El reproductor se inserta **recién cuando el boticario pulsa play**, y
solo el que pulsó.

La diferencia:

| | Con 6 reproductores incrustados | Como quedó |
|---|---|---|
| Peso al abrir | ~1,5 MB | ~15 KB por portada |
| Peticiones al abrir | más de 20 | 6 imágenes |
| Reproductores cargados | 6 | 0 hasta que se pulse play |

Y da igual si mañana son 6 módulos o 60: el costo de abrir la sala no sube.

**Lo demás que ayuda:**

- El área tiene su propia hoja de estilos liviana; no carga los 100 KB del
  sitio público.
- Mientras el boticario mira la portada, las dos salas ya se están
  descargando en segundo plano. El clic en "Entrar a la sala" se siente
  instantáneo.
- Las portadas se cargan solo cuando entran en pantalla, no las 6 de golpe.
- Al pasar el mouse sobre un video se abre la conexión con YouTube por
  adelantado, así el play arranca más rápido.

**Y cuando sí hay que esperar, se ve la animación:** al entrar con
usuario y contraseña, y al cambiar de sala, aparece un anillo dorado con
porcentaje y mensajes que van cambiando:

> Verificando credenciales… → Estableciendo canal seguro… → Cargando tu
> plan de formación… → Optimizando el contenido para tu conexión… →
> Todo listo. Bienvenido.

Además hay "esqueletos" (recuadros grises que laten) mientras se pinta el
contenido, para que nunca se vea una pantalla en blanco.

---

## 6. Consejo de ritmo

No publiques los 12 de golpe. Los módulos que aún no tienen video salen
con candado y el texto "Se habilita al terminar el Módulo N". Eso es a
propósito: da sensación de programa serio y da motivo para volver.

Un ritmo que funciona: **dos módulos por sala al arrancar, y uno nuevo
cada quince días.** Cuando publiques uno, avisa por WhatsApp a las boticas
con acceso. Es una excusa perfecta para retomar contacto sin estar
vendiendo.

---

## 7. Errores que hay que evitar

| Error | Qué pasa |
|---|---|
| Subir el video como **Público** | Cualquiera lo ve; deja de ser beneficio de cliente |
| Subirlo como **Privado** | La Academia muestra un error: no se puede incrustar |
| Pegar el enlace completo en vez del ID | El video no carga |
| Poner una duración que no es la real | Se pierde credibilidad en un detalle tonto |
| Grabar en vertical | Sale con franjas negras a los lados |
| Dejar `demo: true` en un módulo real | Sale la etiqueta "Vista previa" |
| Grabar de corrido sin cortes | Se nota el cansancio y baja la retención |
