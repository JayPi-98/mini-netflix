# Mini‑Netflix

Construí una app con Expo Router para explorar series por categoría con un carrusel horizontal y una pantalla de detalle sencilla, usando Supabase como backend.

---

## Cómo ejecutar

Requisitos

- Node 18+ y npm 10+

Entorno

- Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Supabase:

  ```bash
  EXPO_PUBLIC_SUPABASE_URL="<tu-supabase-url>"
  EXPO_PUBLIC_SUPABASE_ANON_KEY="<tu-anon-key>"
  ```

Instalar dependencias

```bash
npm install
```

Iniciar el servidor

```bash
npx expo start
```
Y el elegir la opcion de:
```bash
Press w | open web
```

Notas

- Las claves de Supabase se leen desde variables de entorno (`EXPO_PUBLIC_*`). Reinicia el servidor tras editar `.env`.
- La app usa Expo Router con rutas basadas en archivos dentro de `app/`.

---

## Decisiones técnicas

- Elegí Expo Router para mantener rutas declarativas y portables entre nativo y web. Use un Stack para detalles y una barra de pestañas con una sola pestaña (Home) ya que solamente para esta prueba se necesitaba una vista inicial como esta.
- En la pantalla de inicio use `react-native-reanimated-carousel` para un carrusel horizontal suave. Ajusté el ancho del viewport para mostrar un “peek” sutil de los pósters adyacentes.
- Obtengo los datos desde Supabase con `@supabase/supabase-js`. En web evito AsyncStorage para mantener el bundle ligero. La URL y la anon key las leo de `.env` con el prefijo `EXPO_PUBLIC_` para que estén disponibles en tiempo de ejecución de Expo.
- Implementé una pequeña capa de temas (`ThemedView` / `ThemedText`) que usa el esquema de color actual. En la pantalla de detalle se tiene un póster 2:3 compacto entre el título y la sinopsis.
- Para las interfaces y las constantes de datos cree carpetas aparte donde exporto estas a los componentes donde se utilizan para que el código no este tan apretado y sea facil de leer.

---

## Prompts usados con IA

Estos son los prompts que utilicé con la IA (resumidos):

- “Haz que el carrusel muestre pósters asomándose a ambos lados sin cambiar tamaño ni colores.”
- “Añade el póster a la página de detalle entre el título y la sinopsis”
- “Alinea el póster a la izquierda y limita la sinopsis a ~25% del ancho.”
- “Añade un botón de volver en la página de detalle para regresar a Home.”
- “Añade una barra superior en Home con ‘Mini‑Netflix’; céntrala, que sea sticky y con sombra.”
- “Configura el favicon web con el logo del folder imgs.”

---

## Qué haría después

- Accesibilidad: aumentaría las áreas táctiles, haría el focus visible en web, añadiría descripciones de imágenes y verificaría el contraste de color.
- Responsividad: prepararía un layout en dos columnas (póster izquierda, texto derecha) en tablet/desktop, manteniendo layout apilado en móviles.
- Offline e imágenes: cachearía pósters, incorporaría reintentos y retrocesos cuando no haya red.
- Autenticaciones y perfiles: implementaría el inicio de sesión y crearía perfiles para tener favoritos o recomendaciones basadas en gustos.
