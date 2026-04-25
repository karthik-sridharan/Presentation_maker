# Stage 30A — ESM renderer parity

Purpose: add a browser-compatible ES module copy of the renderer helper layer and compare it against the classic `window.LuminaRendererApi` output.

Runtime policy:

- `index.html` still uses Stage 24C classic scripts for production behavior.
- `js/esm/renderer-stage30a.js` is optional and dynamically imported by the inline diagnostics harness.
- ES module failures are reported in `window.LuminaEsModuleDiagnostics` and must not block editor startup.

New parity coverage includes:

- diagram placeholder markup
- custom iframe markup
- diagram standalone document generation
- block normalization
- slide normalization
- panel/custom/pseudocode block rendering
- single/two-column/title slide markup
