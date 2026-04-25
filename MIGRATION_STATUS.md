# Lumina Presenter Migration Status

## Current checkpoint

**Current migration checkpoint:** Stage 27C  
**Stage 27C purpose:** make the ES module parity harness optional and non-blocking  
**Runtime behavior changed in Stage 27C:** No intentional editor behavior changes

Stage 27C keeps the Stage 24C classic-script editor runtime as the authoritative production path. It keeps the first ES module helper copies, but no longer loads the smoke harness with a production `<script type="module">` tag.

Instead, `index.html` loads `js/es-module-loader-stage27c.js` as a classic required script. That loader optionally dynamic-imports `js/es-module-smoke-stage27c.js` and records the result in `window.LuminaEsModuleDiagnostics`.

## Why this checkpoint exists

Stage 27B could produce a startup error:

```text
Failed to load js/es-module-smoke-stage27b.js
```

That could happen before the smoke code executed, especially in local `file://` use, MIME-restricted static hosting, CSP-restricted hosting, or dependency import failures. Stage 27C makes those conditions diagnostics-only so the classic editor still boots.

## Expected diagnostics at this checkpoint

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

Optional ES module status is environment-dependent:

```text
passed                - the browser/server executed the ESM parity harness
load-failed           - module import failed, but the classic editor remains usable
skipped-file-protocol - running from file://; serve over HTTP to test modules
unsupported           - browser does not support dynamic import
disabled              - disableEsModuleSmoke was present in the query string
```

## Stage 27C files

- `js/es-module-loader-stage27c.js` is the required classic loader for optional ESM diagnostics.
- `js/es-module-smoke-stage27c.js` imports the ESM helpers and validates parity with classic globals when dynamic import works.
- `js/esm/utils-stage27c.js` exports the shared utility helpers as ES modules.
- `js/esm/block-style-stage27c.js` exports block/title style helpers as ES modules.
- `js/diagnostics-stage27c.js` reports required runtime status plus optional ESM status.
- `js/module-manifest-stage27c.js` separates required assets from optional ESM assets.
- `diagnostics-stage27c.html` boots the app in a hidden iframe and reports both required runtime health and optional ESM status.

## Still intentionally deferred

- Full ES module boot ownership
- Replacing classic-script globals with imports in the production path
- Backend proxy for production-safe OpenAI API calls
- Deeper Copilot extraction from `legacy-app-stage24c.js`
- Figure crop refinement
- Deleting old historical stage-tagged files from the repository

## Recommended next stages

1. Add ESM copies for parser/import helpers and extend parity tests.
2. Add an ESM loader prototype on a separate `index-esm.html` without changing `index.html`.
3. Move the production boot path to ESM only after diagnostics prove the prototype is clean.
4. Design the backend proxy for Copilot before public deployment.
