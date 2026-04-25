# ES Module Migration Plan

## Principle

Move from classic scripts to ES modules in two tracks:

1. **Parity track:** create ESM copies of low-risk helpers and compare their output against classic globals.
2. **Boot track:** only after parity is stable, introduce a separate ESM entry point that imports modules in dependency order.

## Stage 29A status

Completed:

- Utility helper ESM exports.
- Block/title style helper ESM exports.
- Structured text parser ESM exports.
- Import helper/parser ESM exports.
- Autosave/state helper ESM exports.
- Theme/style-builder helper ESM exports.
- Slide preset ESM exports.
- Optional browser leaf-import smoke/parity harness.
- Diagnostics copy path includes `window.LuminaEsModuleDiagnostics`.
- Classic production runtime remains the Stage 24C script graph.

## Current optional ESM modules

```text
js/esm/utils-stage29a.js
js/esm/block-style-stage29a.js
js/esm/parser-stage29a.js
js/esm/import-stage29a.js
js/esm/state-stage29a.js
js/esm/theme-stage29a.js
js/esm/presets-stage29a.js
```

## Next parity candidates

Add ESM copies and parity checks for:

- Renderer helpers with explicit dependencies.
- Deck/file-IO helpers that can be tested without mutating production state.
- Small editor helper modules after side-effect boundaries are identified.

Do not replace classic runtime imports yet.

## Future ESM prototype

Create `index-esm.html` as an experimental entry point. It should:

- Load one module entry script.
- Import ESM helpers in dependency order.
- Attach temporary compatibility globals only where legacy modules still need them.
- Keep `index.html` on the classic runtime until diagnostics pass consistently.

## Promotion criteria

Promote the ESM entry point only when:

- Required runtime diagnostics show no missing assets/globals/DOM ids.
- The preview renders content.
- Commands and basic UI binding are active.
- Optional ESM diagnostics pass on the intended production host.
- Copilot failures remain isolated from the core editor.
- Rollback to Stage 24C remains documented and tested.
