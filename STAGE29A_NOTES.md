# Stage 29A — ESM state/theme/presets parity

Stage 29A keeps the known-good Stage 24C classic runtime authoritative and adds more optional ES module parity coverage.

## Changes

- No new required startup scripts.
- No production `type="module"` script tags.
- No browser import of `js/es-module-smoke-*.js`.
- Optional ESM files are imported one by one from `js/esm/`.
- New ESM copies added:
  - `js/esm/state-stage29a.js`
  - `js/esm/theme-stage29a.js`
  - `js/esm/presets-stage29a.js`
- Existing Stage 28D ESM helpers were copied forward to Stage 29A names:
  - `js/esm/utils-stage29a.js`
  - `js/esm/block-style-stage29a.js`
  - `js/esm/parser-stage29a.js`
  - `js/esm/import-stage29a.js`
- The optional parity harness now checks autosave behavior, theme/style-builder outputs, Beamer preset themes, and slide preset object parity.

## Expected success report

```json
{
  "stage": "stage29a-20260425-1",
  "indexStageSignature": "index-inline-stage29a-20260425-1",
  "esModuleSmokeStatus": "passed",
  "esModuleSmokePassed": true,
  "optionalEsmAssetCount": 7,
  "esModuleDiagnostics": {
    "ok": true,
    "status": "passed",
    "loaderMode": "inline-leaf-dynamic-import"
  }
}
```

If a module fails to load, check `esModuleDiagnostics.assetProbeResults` and `esModuleDiagnostics.leafImportResults` in the copied report.
