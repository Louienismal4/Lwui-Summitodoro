# Copy the entire reference frontend UI

Status: ready-for-agent

## Request

2026-10-13: During implementation of About ticket #02, the user requested “a 1:1 copy of the ui” of `/Users/louiesaldynismal/Developer/sum`, then explicitly selected “Entire reference project UI”. This replaces the initial selective About-page implementation scope.

## Scope

Copy the reference frontend's public pages, shared header/footer, expedition UI, maps, transitions, dialogs, theme, assets, and supporting client behavior. Preserve the target Laravel backend, Docker/Nginx development setup, and frontend build configuration. Retain reference text and behavior for visual fidelity, including historical changelog entries and footer links. Authentication and server task/profile persistence require follow-up backend integration; backend implementation is outside this UI-copy request.

## Implementation

- Copied all 99 reference source/public files, including 105 existing frontend tests.
- The only functional source differences are same-origin `/api` as the API default and an explicit Vite `?url` import for the MapLibre worker with `setWorkerUrl`. Copied files also receive minor trailing-whitespace cleanup.
- Added the four runtime dependencies used by the copied frontend: axios, maplibre-gl, motion, and react-router-dom. Preserved the target manifest, lockfile, and toolchain; added the frontend test command, Node test types, and the same explicit lint export allowance for badge variants already used for button variants.
- Removed the superseded App.css and SiteLayout. Kept the target entry HTML metadata and added the copied favicon.

## Validation

- Eight byte-identical reference/target screenshots: Home, About, Changelog, and expedition onboarding at 320px and 1440px, with reduced motion and external map requests blocked for deterministic comparison.
- Browser assertions cover all routes, direct/refresh loads, no horizontal overflow, guest onboarding, starting a 30-minute focus session, guest persistence, mobile/desktop navigation, and back/forward history.
- Explicit worker regression check on ports 5173 and 8080: actual workers load with HTTP 200 and JavaScript MIME, and the map canvas renders using a deterministic local test style. This fixes the reported empty-MIME `504 Outdated Optimize Dep` worker response caused by MapLibre deriving its worker URL from Vite's relocated optimized dependency.
- Browser scripts/screenshots are under `/tmp/summitodoro-browser-check/`, `/tmp/reference-*.png`, and `/tmp/copied-*.png`; no browser-test dependency was added to the project.
- Final frontend lint, typecheck/build, all 105 frontend tests, and all three backend tests pass after the worker change. The production build emits the worker as a separate JavaScript asset.

## Review

Separate standards and spec reviews found no integration issues. The spec review independently confirmed all reference source/public files are present.

## Limits

Account login/registration and server profile/task syncing are copied UI/API clients, not implemented Laravel endpoints. Guest expedition behavior is available locally. Live external map tiles and a full timed summit were not part of the deterministic browser checks. The reference's existing no-op Privacy/Terms links and historical release claims are retained for the requested fidelity. Build warns about the large MapLibre bundle; dependency audit reports seven existing shadcn-chain findings, unrelated to the four added runtime packages.
