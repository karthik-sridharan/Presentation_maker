# Release Notes — Stage 27B ES Module Bridge

## Release summary

Stage 27B begins the ES module migration in a low-risk way. The app still uses the Stage 24C classic-script runtime for production behavior, but it now ships ES module versions of two leaf helper modules and verifies them in-browser after startup.

## Highlights

- Added ESM exports for shared utilities in `js/esm/utils-stage27b.js`.
- Added ESM exports for block/title style helpers in `js/esm/block-style-stage27b.js`.
- Added `js/es-module-smoke-stage27b.js`, a non-blocking browser harness that imports the ESM helpers and compares them against the classic globals.
- Added `window.LuminaEsModuleDiagnostics` so diagnostics can report whether ESM parity passed.
- Added `diagnostics-stage27b.html`, which checks assets and boots the app in a hidden iframe to inspect runtime health.
- Updated the manifest/diagnostics layer for Stage 27B.

## What did not change

- The editor still boots through classic scripts.
- No production UI behavior was intentionally changed.
- Copilot still uses the existing browser-side flow.
- Stage 24C runtime files remain the rollback-safe core.

## Known issues / watch items

- ESM modules are currently parity-tested but not used as the production source of truth.
- Browser-side OpenAI API keys remain suitable only for local testing.
- The old `diagnostics-stage24c.html` referenced some non-stage aliases; Stage 27B diagnostics uses the actual current asset list.

## Suggested validation

1. Open `index.html?v=stage27b-20260425-1&clearLuminaStorage=1`.
2. Open `diagnostics-stage27b.html?v=stage27b-20260425-1`.
3. Confirm `esModuleSmokePassed: true` and no missing assets/globals/DOM ids.
4. Confirm `window.LuminaEsModuleDiagnostics.ok === true` in the browser console.


## Stage 27B browser hotfix

Stage 27B supersedes Stage 27A for deployment. Stage 27A used `.mjs` filenames for the ESM bridge; those files were present in the release zip, but some static hosts serve `.mjs` with a MIME type browsers reject for module scripts. Stage 27B uses `.js` filenames with `<script type="module">` instead.
