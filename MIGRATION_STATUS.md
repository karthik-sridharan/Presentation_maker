# Lumina Presenter Migration Status

## Current checkpoint

**Current migration checkpoint:** Stage 28D  
**Stage 28D purpose:** make the ES module parity harness browser-diagnostic and less fragile  
**Runtime behavior changed in Stage 28D:** No intentional editor behavior changes

Stage 28D keeps the Stage 24C classic-script editor runtime as the authoritative production path. It removes the static-import smoke module from the browser path and instead performs optional leaf-module dynamic imports from an inline classic loader. This should tell us exactly whether any failure is an HTTP/fetch/MIME problem or a specific ESM leaf import failure.

## Completed ES module parity coverage

- `js/esm/utils-stage28d.js`
- `js/esm/block-style-stage28d.js`
- `js/esm/parser-stage28d.js`
- `js/esm/import-stage28d.js`

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

The copied report now also includes detailed optional ESM diagnostics:

```json
{
  "esModuleDiagnostics": {
    "ok": true,
    "status": "passed",
    "loaderMode": "inline-leaf-dynamic-import",
    "assetProbeResults": [],
    "leafImportResults": []
  }
}
```

Optional ES module status is still environment-dependent. If imports are blocked by `file://`, MIME, CSP, or host configuration, the editor should still boot and the report should identify the failed leaf import or probe.

## Still intentionally deferred

- Full ES module boot ownership
- Replacing classic-script globals with imports in the production path
- Separate experimental `index-esm.html`
- Backend proxy for production-safe OpenAI API calls
- Deeper Copilot extraction from `legacy-app-stage24c.js`
- Figure crop refinement
