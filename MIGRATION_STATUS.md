# Lumina Presenter Migration Status

## Current checkpoint

**Current migration checkpoint:** Stage 28C  
**Stage 28C purpose:** expand ES module parity coverage without changing the production boot path  
**Runtime behavior changed in Stage 28C:** No intentional editor behavior changes

Stage 28C keeps the Stage 24C classic-script editor runtime as the authoritative production path. It extends the optional ES module parity harness so parser and import helpers now have ESM copies and behavior checks.

## Completed ES module parity coverage

- `js/esm/utils-stage28c.js`
- `js/esm/block-style-stage28c.js`
- `js/esm/parser-stage28c.js`
- `js/esm/import-stage28c.js`
- `js/es-module-smoke-stage28c.js`

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
