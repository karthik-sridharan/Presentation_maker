# Lumina Presenter Migration Status

## Current checkpoint

**Current migration checkpoint:** Stage 27A  
**Stage 27A purpose:** begin ES module migration safely with a non-blocking parity harness  
**Runtime behavior changed in Stage 27A:** No intentional editor behavior changes

Stage 27A keeps the Stage 24C classic-script editor runtime as the authoritative production path. It adds ES module copies of the first low-risk leaf helpers and a browser smoke/parity harness that imports those modules after the app boots, compares them against the existing classic globals, and exposes the result as `window.LuminaEsModuleDiagnostics`.

This is deliberately an incremental bridge instead of a full script-loader rewrite. The next ES module stage can move more leaf modules once the diagnostics stay clean in production.

## Known-good local files

```text
index.html
diagnostics-stage27a.html
diagnostics.html
```

## Expected diagnostics at this checkpoint

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
  "copilotCoreExposed": true,
  "copilotGuardBound": true,
  "copilotValidationBound": true,
  "commandsBound": true,
  "esModuleSmokePassed": true,
  "bootErrors": [],
  "capturedErrors": []
}
```

## Modularization completed before this stage

- Utilities
- Reusable block library
- Theme helpers
- Presets
- Parser/import parsing helpers
- Block style helpers
- Import workflows
- State/autosave wrappers
- Export helpers
- Renderer helpers and renderer diagnostics bridge
- Deck/snippet helpers
- File I/O helpers
- UI shell/tab/rail helpers
- Figure insertion
- Simple diagram editor
- Figure tools
- Editor selection
- Block editor/form synchronization
- Commands/keyboard shortcuts
- Diagnostics/manifest
- Guarded Copilot binding and validation

## Stage 27A additions

- `js/esm/utils-stage27a.mjs` exports the shared utility helpers as ES modules.
- `js/esm/block-style-stage27a.mjs` exports block/title style helpers as ES modules.
- `js/es-module-smoke-stage27a.mjs` imports those ESM helpers and validates parity with `window.LuminaUtils` and `window.LuminaBlockStyle`.
- `js/diagnostics-stage27a.js` reports `esModuleDiagnostics` and fails startup diagnostics if the ESM smoke check is missing or failed.
- `js/module-manifest-stage27a.js` tracks the classic runtime plus the new ESM harness assets.
- `diagnostics-stage27a.html` boots the app in a hidden iframe and checks both asset availability and runtime diagnostics.

## Still intentionally deferred

- Full ES module boot ownership
- Replacing classic-script globals with imports in the production path
- Backend proxy for production-safe OpenAI API calls
- Deeper Copilot extraction from `legacy-app-stage24c.js`
- Figure crop refinement
- Deleting old historical stage-tagged files from the repository

## Recommended next stages

1. **Stage 27B:** Add ESM copies for parser/import helpers and extend parity tests.
2. **Stage 27C:** Add an ESM loader prototype on a separate `index-esm.html` without changing `index.html`.
3. **Stage 28A:** Move the production boot path to ESM only after diagnostics prove the prototype is clean.
4. **Stage 26A / parallel:** Design backend proxy for Copilot before public deployment.
