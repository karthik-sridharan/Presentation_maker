# Lumina Presenter Stage 34G.2 — Slide actions restore

Stage 34G.2 restores the slide action controls to the main slide editor while preserving the successful Stage 34G guarded ESM runtime.

What changed:
- Added a **Quick slide actions** panel to the active slide editor pane.
- Added safe proxy controls wired to the existing deck command bridge.
- Did not advance the migration or change which ESM modules are live.

Expected diagnostics:
- `esModuleDiagnostics.ok: true`
- `esModuleSmokePassed: true`
- `figureToolsRuntimeSource: esm:js/esm/figure-tools-stage34g.js`
- `window.__LUMINA_SLIDE_ACTIONS_RESTORE.bound: true`
