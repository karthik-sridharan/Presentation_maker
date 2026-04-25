# ES Module Migration Plan

## Principle

Move from classic scripts to ES modules in two tracks:

1. **Parity track:** create ESM copies of low-risk helpers and compare their output against classic globals.
2. **Boot track:** only after parity is stable, introduce a separate ESM entry point that imports modules in dependency order.

## Stage 31A status

Completed:

- Utility helper ESM exports.
- Block/title style helper ESM exports.
- Structured text parser ESM exports.
- Import helper/parser ESM exports.
- Autosave/state helper ESM exports.
- Theme/style-builder helper ESM exports.
- Slide preset ESM exports.
- Renderer helper ESM exports.
- Optional browser leaf-import smoke/parity harness.
- Diagnostics copy path includes `window.LuminaEsModuleDiagnostics`.
- Classic production runtime remains the Stage 24C script graph.

## Current optional ESM modules

```text
js/esm/utils-stage31a.js
js/esm/block-style-stage31a.js
js/esm/parser-stage31a.js
js/esm/import-stage31a.js
js/esm/state-stage31a.js
js/esm/theme-stage31a.js
js/esm/presets-stage31a.js
js/esm/renderer-stage31a.js
```

## Next parity candidates

Add ESM copies and parity checks for:

- Deck/file-IO helpers that can be tested without mutating production state.
- Small editor helper modules after side-effect boundaries are identified.
- A separate experimental `index-esm.html` once enough helper coverage is stable.

Do not replace classic runtime imports yet.
