# GitHub Pages Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy TV Latino Web automatically from GitHub and make it discover the `channelwatch-cron` GitHub Pages feed without asking the user for a URL.

**Architecture:** Next.js is statically exported for GitHub Pages. In local development it reads bundled `/data` demo JSON; on a `*.github.io` site it automatically resolves the feed to `/channelwatch-cron/data` on the same GitHub Pages origin. An environment variable remains an optional override for Vercel/custom hosting.

**Tech Stack:** Next.js 16, React 19, TypeScript, hls.js, Node 20+, GitHub Actions, GitHub Pages.

**Spec:** Approved in conversation on 2026-08-28: keep the persistent-player intuitive UI, hide non-web channels, consume cron JSON remotely, and prepare the repository for automatic GitHub deployment.

## Global Constraints

- Repository name is `tv-latino-web` for zero-configuration GitHub Pages deployment.
- Cron repository name is `channelwatch-cron` under the same GitHub account.
- Existing ChannelWatch JSON schema remains unchanged.
- Local `PROBAR_WEB.bat` and `SINCRONIZAR_JSON.bat` remain available.
- GitHub Pages build must support a repository base path.
- `NEXT_PUBLIC_CHANNELWATCH_DATA_URL` remains an optional explicit override.

---

### Task 1: Add automatic GitHub Pages feed resolution

**Files:**
- Modify: `src/lib/data.ts`
- Modify: `src/lib/data.test.ts`

**Interfaces:**
- Consumes: optional explicit data base, browser hostname/origin, optional local base path.
- Produces: `resolveDataBase()` and `dataUrl()` that use `https://<owner>.github.io/channelwatch-cron/data` automatically on GitHub Pages.

- [ ] Write failing tests for GitHub Pages auto-resolution and local base-path fallback.
- [ ] Run focused Node tests and confirm expected failures.
- [ ] Implement minimal resolver while preserving explicit env override behavior.
- [ ] Run all library tests.

### Task 2: Configure static export and GitHub Pages workflow

**Files:**
- Modify: `next.config.ts`
- Create: `.github/workflows/deploy-pages.yml`
- Create: `docs/GITHUB_SETUP.md`
- Modify: `.env.example`
- Modify: `README.md`

**Interfaces:**
- Consumes: `GITHUB_REPOSITORY`, `GITHUB_ACTIONS`, Node/npm.
- Produces: static `out/` build deployed to the project-site base path.

- [ ] Configure `output: "export"` and derive `basePath` from the GitHub repository name only during GitHub Actions builds. `assetPrefix` is intentionally not used because Next.js recommends `basePath` for sub-path hosting.
- [ ] Add Pages workflow triggered by pushes to `main` and manual dispatch; install, test, build, upload `out/`, deploy.
- [ ] Inject `NEXT_PUBLIC_BASE_PATH` in the workflow for local demo-data fallback.
- [ ] Document the exact two-repository setup and zero-config same-owner behavior.

### Task 3: Verify repository package

**Files:**
- Verify all web project files.

**Interfaces:**
- Produces: repository ready to upload as `tv-latino-web`.

- [ ] Run `npm test`.
- [ ] Run TypeScript/static build if dependencies can be installed in the current environment; otherwise report the environmental limitation explicitly.
- [ ] Structurally verify workflow, Next static-export config, and automatic feed URL logic.
- [ ] Ensure no `.git`, `node_modules`, `.next`, `out`, or other generated folders are included in the final ZIP.
