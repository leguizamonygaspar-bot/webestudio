# Estudio Jurídico Leguizamón & Gaspar · sitio web

Sitio estático (HTML, CSS y JS, sin compilación) publicado con **Cloudflare Workers** (static assets). Cada cambio que se sube a la rama `main` se publica solo.

- Dominio: leguizamonjubilaciones.com.ar (en proceso de conexión)
- Borrador: https://leguizamon-gaspar.leguizamonygaspar.workers.dev

## Estructura
- `index.html`: la página.
- `404.html`: página para direcciones que no existen.
- `assets/css/styles.css`: estilos. La paleta y las tipografías están al principio, en `:root`.
- `assets/js/config.js`: número de WhatsApp, mensaje predeterminado y dirección de Formspree. Es el único archivo que hay que tocar para esos datos.
- `assets/js/main.js`: links de WhatsApp, menú y envío del formulario.
- `assets/img/`, `assets/fonts/`: imágenes y la tipografía Libre Caslon Text (licencia OFL).
- `_headers`: encabezados de seguridad y caché.
- `wrangler.jsonc`: configuración de Cloudflare. El campo `name` tiene que coincidir con el nombre del Worker.
- `.assetsignore`: archivos que no se publican (este README, la configuración).

## Antes de la publicación definitiva
Sacar el `noindex` de `index.html` y de `_headers` para que Google indexe la página.
