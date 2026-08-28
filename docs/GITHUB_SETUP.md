# Subir TV Latino Web a GitHub

## Nombres recomendados

Para que todo funcione sin escribir URLs a mano, crea los dos repositorios bajo la misma cuenta:

```text
channelwatch-cron
tv-latino-web
```

La web detecta que está en `TU-USUARIO.github.io` y automáticamente busca:

```text
https://TU-USUARIO.github.io/channelwatch-cron/data/countries.json
```

## Publicar la web

1. Sube esta carpeta a un repo llamado **`tv-latino-web`**.
2. En GitHub abre **Settings > Pages**.
3. En **Build and deployment > Source**, selecciona **GitHub Actions**.
4. Haz push a `main` o abre **Actions > Deploy TV Latino Web to GitHub Pages > Run workflow**.

El workflow instala dependencias, ejecuta las pruebas, hace `next build` con exportación estática y despliega `out/`.

## URL final

Si tu usuario es `ejemplo`:

```text
https://ejemplo.github.io/tv-latino-web/
```

Y la web leerá automáticamente:

```text
https://ejemplo.github.io/channelwatch-cron/data/countries.json
https://ejemplo.github.io/channelwatch-cron/data/bo.json
```

No necesitas `SINCRONIZAR_JSON.bat` en producción.

## Orden recomendado la primera vez

1. Sube y publica `channelwatch-cron`.
2. Ejecuta manualmente una vez su workflow para generar los JSON iniciales.
3. Sube `tv-latino-web`.
4. GitHub Pages despliega la web automáticamente.

Después el cron actualiza los JSON semanalmente y la web ve los cambios sin necesitar un nuevo deploy.

## Si cambias los nombres de los repos

Si el repo del cron no se llama `channelwatch-cron`, configura una URL explícita antes de construir:

```env
NEXT_PUBLIC_CHANNELWATCH_DATA_URL=https://TU-USUARIO.github.io/OTRO-NOMBRE/data
```

Para GitHub Pages con los nombres recomendados no es necesario.
