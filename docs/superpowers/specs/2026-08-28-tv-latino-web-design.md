# TV Latino Web – Design

## Goal
Build a lightweight Next.js web client that consumes ChannelWatch's static JSON feeds without requiring a database or API server.

## Data contract
The data source exposes `countries.json` plus one lowercase ISO file per country, such as `bo.json`. The web must support a local `/data` base path and a remote base URL through `NEXT_PUBLIC_CHANNELWATCH_DATA_URL`.

Country index entries contain `code`, `name`, `channels`, `generated_at`, and `path`. Country channel feeds contain `country`, `generated_at`, `total_channels`, and `channels`. A channel contains `id`, `name`, `logo`, `category`, `stream`, `alternates`, `status`, `latency_ms`, `sources`, `android_playable`, `https`, `cors`, `web_playable`, and `last_checked`.

## UX
The home page shows a compact premium dashboard with a country selector, totals, search, category chips, and responsive channel cards. A channel marked `web_playable=false` is shown but cannot be started in the browser. `web_playable=true` can be played; `null`/unknown can be tried with a warning. The player is a modal using native HLS where available and hls.js otherwise.

## Local testing
The repository includes demo JSON under `public/data`, `PROBAR_WEB.bat` for Windows setup/start, and `SINCRONIZAR_JSON.bat` to copy real JSON from a sibling ChannelWatch cron checkout. The cron repository gets `PROBAR_LOCAL.bat`, which creates a venv, installs the package when needed, validates config, accepts an ISO country code or ALL, runs the checker, and opens the generated JSON folder.

## Error handling
Fetch failures are shown in the UI with a retry action. Broken logos fall back to initials. Player errors are displayed without crashing the page. Missing country JSON returns a clear message. Static demo data is labeled as demo data in the README and can be replaced by the sync script.

## Testing
Use Node.js built-in tests with TypeScript type stripping for data URL helpers, filtering, and playback eligibility behavior. Use the Next.js production build as the integration/build verification. The cron BAT is covered by a repository test that verifies the expected commands and safety behavior are present; the existing Python suite must remain green.
