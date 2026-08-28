# TV Latino Web — GitHub Edition

Interfaz Next.js tipo televisor para los JSON producidos por ChannelWatch Cron: lista compacta de canales a la izquierda, reproductor persistente, cambio con un clic y únicamente canales confirmados como compatibles con web.

## GitHub automático

Este repo está preparado para llamarse **`tv-latino-web`** y trabajar junto a otro repo de la misma cuenta llamado **`channelwatch-cron`**.

Cuando está publicado en GitHub Pages, la web descubre automáticamente:

```text
https://TU-USUARIO.github.io/channelwatch-cron/data
```

Por eso no tienes que pegar la URL del cron ni sincronizar JSON manualmente en producción.

Consulta [docs/GITHUB_SETUP.md](docs/GITHUB_SETUP.md) para subir ambos repos.

## Flujo final

```text
GitHub Actions (channelwatch-cron)
          ↓
bo.json / ar.json / countries.json
          ↓
GitHub Pages
          ↓
TV Latino Web
          ↓
usuario cambia de canal con 1 clic
```

El cron corre semanalmente. La web lee los JSON cada vez que se abre, así que una actualización de canales no requiere recompilar la web.

## Probar localmente en Windows

Haz doble clic en:

```text
PROBAR_WEB.bat
```

Abre:

```text
http://localhost:3000
```

En local usa los JSON de `public/data`.

Si quieres copiar los JSON que generó un cron local, usa:

```text
SINCRONIZAR_JSON.bat
```

## Publicación GitHub Pages

`.github/workflows/deploy-pages.yml` se ejecuta cuando haces push a `main` y también puede lanzarse manualmente.

El build:

1. instala dependencias;
2. ejecuta `npm test`;
3. ejecuta `npm run build`;
4. exporta Next.js a `out/`;
5. publica `out/` con GitHub Pages.

El `basePath` se calcula automáticamente a partir del nombre real del repo durante GitHub Actions.

## Fuente de datos personalizada

Solo si no usas el repo `channelwatch-cron` bajo la misma cuenta, define:

```env
NEXT_PUBLIC_CHANNELWATCH_DATA_URL=https://tu-servidor.example/data
```

## Desarrollo

Requiere Node.js 20.9+.

```bash
npm install
npm test
npm run dev
```

Build estático:

```bash
npm run build
```

## Uso responsable

La web reproduce directamente streams que el cron haya marcado como compatibles con navegador. No retransmite señales ni intenta saltarse autenticación, DRM o controles de acceso.
