# ES Module Migration Plan

## Principle

Move from classic scripts to ES modules in two tracks:

1. **Parity track:** create ESM copies of low-risk leaf helpers and compare their output against classic globals.
2. **Boot track:** only after parity is stable, introduce a separate ESM entry point that imports modules in dependency order.

## Stage 27C status

Completed:

- Utility helper ESM exports.
- Block/title style helper ESM exports.
- Optional browser smoke/parity harness.
- Classic-script ES module loader that prevents module-hosting issues from blocking the editor.
- Manifest and diagnostics separation between required runtime assets and optional ESM assets.

## Next parity candidates

Add ESM copies and parity checks for:

- `parser-stage24c.js`
- `import-stage24c.js`
- Pure parts of `state-stage24c.js` where helper boundaries are clear

Do not replace classic runtime imports yet.

## Future ESM prototype

Create `index-esm.html` as an experimental entry point. It should:

- Load one module entry script.
- Import ESM helpers in dependency order.
- Attach temporary compatibility globals only where legacy modules still need them.
- Keep `index.html` on the classic runtime until diagnostics pass consistently.

## Stage 28A promotion criteria

Promote the ESM entry point only when:

- Required runtime diagnostics show no missing assets/globals/DOM ids.
- The preview renders content.
- Commands and basic UI binding are active.
- Optional ESM diagnostics pass on the intended production host.
- Copilot failures remain isolated from the core editor.
- Rollback to Stage 24C remains documented and tested.
