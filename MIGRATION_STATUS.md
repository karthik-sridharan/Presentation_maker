# Lumina Presenter Migration Status

## Current checkpoint

**Current migration checkpoint:** Stage 29A  
**Stage 29A purpose:** expand optional ES module parity coverage to state, theme, and presets  
**Runtime behavior changed in Stage 29A:** No intentional editor behavior changes

Stage 29A keeps the Stage 24C classic-script editor runtime as the authoritative production path. It extends the optional ES module parity harness from four leaf modules to seven modules, using dynamic imports that never block the editor from booting.

## Completed ES module parity coverage

- `js/esm/utils-stage29a.js`
- `js/esm/block-style-stage29a.js`
- `js/esm/parser-stage29a.js`
- `js/esm/import-stage29a.js`
- `js/esm/state-stage29a.js`
- `js/esm/theme-stage29a.js`
- `js/esm/presets-stage29a.js`

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

The copied report should also include optional ESM diagnostics:

```json
{
  "esModuleDiagnostics": {
    "ok": true,
    "status": "passed",
    "loaderMode": "inline-leaf-dynamic-import",
    "checkCount": 46
  },
  "esModuleSmokePassed": true,
  "esModuleSmokeStatus": "passed",
  "optionalEsmAssetCount": 7
}
```

The exact `checkCount` may increase if more parity cases are added, but it should not decrease unexpectedly.

## Still intentionally deferred

- Full ES module boot ownership
- Replacing classic-script globals with imports in the production path
- Separate experimental `index-esm.html`
- Backend proxy for production-safe OpenAI API calls
- Deeper Copilot extraction from `legacy-app-stage24c.js`
- Figure crop refinement
