# Lumina Presenter Stage 27C Release Notes

Stage 27C is a hotfix over Stage 27B for external ES module load failures.

## Changed

- Removed the production `type="module"` script tag for the smoke harness.
- Added `js/es-module-loader-stage27c.js`, a classic-script loader that optionally dynamic-imports the smoke harness.
- Kept ESM helper copies under `js/esm/`.
- Updated diagnostics so ES module parity is reported separately from required runtime boot health.
- Removed `LuminaEsModuleDiagnostics` from required startup globals.

## Why

Some deployment environments reject external module loading before module code can run. Stage 27C makes ES module parity checks non-blocking so the presentation editor remains usable while the migration continues.

## Validation

- Required assets are classic scripts and should load on the same hosts that supported Stage 24C.
- `window.LuminaEsModuleDiagnostics.status` reports `passed`, `load-failed`, `skipped-file-protocol`, `unsupported`, or `disabled`.
- `strictEsModuleSmoke=1` can be added to the URL when you intentionally want optional ESM load failure to be promoted to a boot error.
