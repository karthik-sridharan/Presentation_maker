# ES Module Migration Plan

## Principle

Move from classic scripts to ES modules in two tracks:

1. **Parity track:** create ESM copies of low-risk leaf helpers and compare their output against classic globals.
2. **Boot track:** only after parity is stable, introduce a separate ESM entry point that imports modules in dependency order.

## Stage 28C status

Completed:

- Utility helper ESM exports.
- Block/title style helper ESM exports.
- Structured text parser ESM exports.
- Import helper/parser ESM exports.
- Optional browser smoke/parity harness.
- Diagnostics copy path now includes `window.LuminaEsModuleDiagnostics`.
- Classic production runtime remains the Stage 24C script graph.

## Next parity candidates

Add ESM copies and parity checks for:

- Pure pieces of `state-stage24c.js`
- `theme-stage24c.js`
- `presets-stage24c.js`
- Small renderer helpers after dependency boundaries are explicit

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
