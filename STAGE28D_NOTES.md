# Stage 28D — ES module leaf-import diagnostics

Stage 28D keeps the known-good Stage 24C classic runtime authoritative.

This patch responds to the Stage 28C browser report:

```json
"esModuleSmokeStatus": "load-failed",
"error": "Importing a module script failed."
```

The Stage 28C failure happened before the static-import smoke module could expose which dependency failed. Stage 28D removes that browser-side static-import smoke entry and replaces it with an inline, optional leaf importer.

## Changes

- No new required startup scripts.
- No production `type="module"` script tags.
- No browser import of `js/es-module-smoke-*.js`.
- Optional ESM files are imported one by one:
  - `js/esm/utils-stage28d.js`
  - `js/esm/block-style-stage28d.js`
  - `js/esm/parser-stage28d.js`
  - `js/esm/import-stage28d.js`
- The ESM files were rewritten to avoid fragile newer syntax such as nullish coalescing, optional chaining, and RegExp dotAll flags.
- Copied diagnostics now include fetch/MIME probes and per-leaf import results.

## Expected success report

```json
{
  "stage": "stage28d-20260425-1",
  "indexStageSignature": "index-inline-stage28d-20260425-1",
  "esModuleSmokeStatus": "passed",
  "esModuleDiagnostics": {
    "ok": true,
    "status": "passed",
    "loaderMode": "inline-leaf-dynamic-import",
    "checkCount": 33
  }
}
```

If a module still fails to load, check `esModuleDiagnostics.assetProbeResults` and `esModuleDiagnostics.leafImportResults` in the copied report.
