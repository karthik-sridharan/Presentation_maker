# Lumina Presenter Migration Status

## Current checkpoint

**Current migration checkpoint:** Stage 28A  
**Stage 28A purpose:** expand ES module parity coverage without changing the production boot path  
**Runtime behavior changed in Stage 28A:** No intentional editor behavior changes

Stage 28A keeps the Stage 24C classic-script editor runtime as the authoritative production path. It extends the optional ES module parity harness so parser and import helpers now have ESM copies and behavior checks.

## Completed ES module parity coverage

- `js/esm/utils-stage28a.js`
- `js/esm/block-style-stage28a.js`
- `js/esm/parser-stage28a.js`
- `js/esm/import-stage28a.js`
- `js/es-module-smoke-stage28a.js`

## Expected diagnostics

Required runtime health should pass:

```json
{
  "missingAssets": [],
  "missingGlobals": [],
  "missingDomIds": [],
  "basicUiBound": true,
  "previewHasContent": true,
  "rendererFunctionBased": true,
  "uiFunctionBased": true,
  "manifestLoaded": true,
  "commandsBound": true,
  "bootErrors": [],
  "capturedErrors": []
}
```

The copied report now also includes:

```json
{
  "esModuleDiagnostics": {
    "ok": true,
    "status": "passed"
  }
}
```

Optional ES module status is still environment-dependent. If imports are blocked by `file://`, MIME, CSP, or host configuration, the editor should still boot.

## Still intentionally deferred

- Full ES module boot ownership
- Replacing classic-script globals with imports in the production path
- Separate experimental `index-esm.html`
- Backend proxy for production-safe OpenAI API calls
- Deeper Copilot extraction from `legacy-app-stage24c.js`
- Figure crop refinement
