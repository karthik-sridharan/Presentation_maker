# Stage 27D Hotfix Notes

Stage 27D fixes the Stage 27C startup regression where new stage-numbered diagnostic files were loaded as required early scripts.

## Change

- Startup now requires only the known-good Stage 24C classic runtime assets.
- No `js/diagnostics-stage27d.js`, `js/module-manifest-stage27d.js`, or `js/es-module-loader-stage27d.js` file is required by `index.html`.
- ES module parity remains available through an inline optional dynamic import of `js/es-module-smoke-stage27d.js`.
- If the optional module import fails, `window.LuminaEsModuleDiagnostics` records it, but the editor startup is unaffected.

## Test URLs

- `index.html?v=stage27d-20260425-1&clearLuminaStorage=1`
- `diagnostics-stage27d.html?v=stage27d-20260425-1`

## Expected result

No startup overlay should report missing `js/diagnostics-stage27c.js`, `js/module-manifest-stage27c.js`, `js/diagnostics-stage27d.js`, or `js/module-manifest-stage27d.js`.
