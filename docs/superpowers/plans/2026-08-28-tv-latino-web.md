# TV Latino Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a Windows-friendly ChannelWatch runner BAT and a Next.js web client that consumes the generated static country JSON feeds.

**Architecture:** ChannelWatch remains the producer and persists health history in SQLite, then writes static JSON. Next.js is a pure client of those JSON feeds and plays eligible HLS streams with native HLS/hls.js; no API server or database is introduced.

**Tech Stack:** Python 3.11+, pytest, Windows BAT, Next.js 16, React 19, TypeScript, hls.js, Node.js built-in test runner.

**Spec:** `docs/superpowers/specs/2026-08-28-tv-latino-web-design.md`

## Global Constraints
- Keep the existing ChannelWatch JSON schema unchanged.
- Do not add Supabase/FastAPI/backend services.
- Default web data source is `/data`; remote source is configured by `NEXT_PUBLIC_CHANNELWATCH_DATA_URL`.
- Streams with `web_playable=false` must not be started by the web player.
- Local scripts must be usable from Windows by double-click.

---

### Task 1: Windows local runner for ChannelWatch

**Files:**
- Create: `PROBAR_LOCAL.bat` in the ChannelWatch repo worktree.
- Create: `tests/test_windows_bat.py`.
- Modify: `README.md`.

**Interfaces:**
- Consumes: existing CLI `python -m channelwatch validate-config`, `list-countries`, and `run --country CODE`.
- Produces: `public/data/countries.json` and per-country JSON through the existing CLI.

- [ ] Write a failing pytest asserting the BAT exists and contains venv creation, editable install, config validation, country selection, ALL mode, and JSON-folder opening.
- [ ] Run that test and verify failure because the BAT is absent.
- [ ] Add the BAT with Python launcher detection, `.venv` bootstrap, config validation, country input, run, error handling, and `explorer public\data`.
- [ ] Run the BAT test and then the full pytest suite.
- [ ] Update README with double-click instructions.

### Task 2: Next.js data layer and filtering

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `Node.js test scripts in `package.json`.
- Create: `src/lib/types.ts`, `src/lib/data.ts`, `src/lib/filter.ts`.
- Create: `src/lib/data.test.ts`, `src/lib/filter.test.ts`.

**Interfaces:**
- Produces: `dataUrl(path: string)`, `filterChannels(channels, query, category)`, and feed TypeScript types.

- [ ] Write failing tests for slash-safe data URL construction and accent-insensitive channel filtering.
- [ ] Run tests and verify expected module-not-found/function-missing failures.
- [ ] Implement only the tested helpers and types.
- [ ] Run tests and verify green.

### Task 3: Next.js dashboard and HLS player

**Files:**
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`.
- Create: `src/components/tv-dashboard.tsx`, `src/components/hls-player.tsx`.

**Interfaces:**
- Consumes: static ChannelWatch feeds through `dataUrl` and filtering through `filterChannels`.
- Produces: responsive country/channel dashboard and player modal.

- [ ] Build the page around `countries.json` and selected country feeds, with loading/error/retry states.
- [ ] Add search, category filters, status badges, source/latency metadata, and web-playability rules.
- [ ] Add native HLS / hls.js playback with graceful errors and teardown.
- [ ] Run unit tests, TypeScript syntax validation, and Next production build when dependencies are available.

### Task 4: Demo feeds and Windows web scripts

**Files:**
- Create: `public/data/countries.json`, `public/data/bo.json`, `public/data/ar.json`, `public/data/br.json`.
- Create: `PROBAR_WEB.bat`, `SINCRONIZAR_JSON.bat`, `.env.example`, `.gitignore`, `README.md`.

**Interfaces:**
- `PROBAR_WEB.bat` installs dependencies if needed and starts `npm run dev`.
- `SINCRONIZAR_JSON.bat` copies `*.json` from a selected/sibling ChannelWatch `public/data` folder into the web's `public/data`.

- [ ] Add clearly labeled demo feeds that match schema version 1 and use public HLS test media rather than pretending to be real broadcasters.
- [ ] Add both BAT scripts with path/error checks.
- [ ] Document local demo use and real cron synchronization.
- [ ] Run unit tests and production build again.

### Task 5: Packaging verification

**Files:**
- Produce: `/mnt/data/channelwatch-cron-v2.zip` and `/mnt/data/tv-latino-web-nextjs.zip`.

- [ ] Run ChannelWatch full pytest suite.
- [ ] Run web `npm test -- --run` and `npm run build`.
- [ ] Inspect ZIP listings to ensure `.git`, `.worktrees`, `.venv`, `node_modules`, and `.next` are excluded.
- [ ] Package each project under a single top-level folder.
