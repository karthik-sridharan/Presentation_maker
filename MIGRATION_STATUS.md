# Lumina Presenter Migration Status

## Current checkpoint

**Current migration checkpoint:** Stage 31A  
**Stage 31A purpose:** expand optional ES module parity coverage to renderer helpers  
**Runtime behavior changed in Stage 31A:** No intentional editor behavior changes

Stage 31A keeps the Stage 24C classic-script editor runtime as the authoritative production path. It extends the optional ES module parity harness from seven helper modules to eight modules, adding renderer helper parity.

## Completed ES module parity coverage

- `js/esm/utils-stage31a.js`
- `js/esm/block-style-stage31a.js`
- `js/esm/parser-stage31a.js`
- `js/esm/import-stage31a.js`
- `js/esm/state-stage31a.js`
- `js/esm/theme-stage31a.js`
- `js/esm/presets-stage31a.js`
- `js/esm/renderer-stage31a.js`

## Expected diagnostics

Required runtime health should pass with no missing assets/globals/DOM ids and no boot/captured errors. The copied report should also include:

```json
{
  "esModuleDiagnostics": {
    "ok": true,
    "status": "passed",
    "loaderMode": "inline-leaf-dynamic-import"
  },
  "esModuleSmokePassed": true,
  "esModuleSmokeStatus": "passed",
  "optionalEsmAssetCount": 8
}
```

## Still intentionally deferred

- Full ES module boot ownership
- Replacing classic-script globals with imports in the production path
- Separate experimental `index-esm.html`
- Backend proxy for production-safe OpenAI API calls
- Deeper Copilot extraction from `legacy-app-stage24c.js`
- Figure crop refinement


## Stage 31A

Added optional ES module parity leaves for deck, file I/O/import bridge, figure insertion, and reusable block library. Classic Stage 24C remains authoritative.
