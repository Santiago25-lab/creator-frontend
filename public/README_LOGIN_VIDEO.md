# Instrucciones para el Video de Fondo de Login / Registro

¡Hola! Este archivo sirve de guía para colocar el video de fondo en la pantalla de inicio de sesión de **CreatorCV**.

## 📁 ¿Dónde colocar el video?

Debes guardar el archivo de video en este mismo directorio (`public/`).

* **Ruta del archivo:** `creator-frontend/public/background.mp4`
* **Nombre de archivo exacto:** `background.mp4`

---

## ⚙️ Especificaciones recomendadas para el video:

Para asegurar la compatibilidad y optimizar el rendimiento de la aplicación, utiliza las siguientes especificaciones:

1. **Formato:** `.mp4`
2. **Códec de Video:** `H.264` (para máxima compatibilidad con todos los navegadores).
3. **Resolución:** `1920x1080` (Full HD) o `1280x720` (HD). No se recomienda mayor resolución para evitar retrasos en la carga.
4. **Relación de aspecto:** `16:9` (horizontal).
5. **Duración:** Entre `10` y `30` segundos (debe ser un bucle fluido / seamless loop).
6. **Peso del archivo:** Idealmente **menor a 10MB** (puedes comprimirlo usando herramientas como Handbrake o Adobe Media Encoder) para que cargue rápido.
7. **Audio:** No es necesario que tenga audio (el reproductor está silenciado por defecto `muted`), pero si tiene, el navegador no lo reproducirá.

---

*Nota: La pantalla ya tiene aplicada una capa oscura (`.auth-bg-overlay`) con gradiente radial por encima del video para asegurar que los textos y la tarjeta de login sean completamente legibles.*
