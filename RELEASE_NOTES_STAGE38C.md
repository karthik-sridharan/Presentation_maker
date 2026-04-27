# Stage 38C release notes

## Added
- Toolbar polish pass: tighter Keynote-style chrome, better focus states, action tooltips, and an inspector status chip.
- Inspector reset: the right panel is rebuilt into a mode-based inspector instead of a single text-style block.
- Selection-aware inspector modes: `Slide`, `Text`, `Figure`, `Demo`, and `Deck`.
- Figure mode actions are wired to the existing Stage 35Z figure action bridge.
- Demo mode separates custom HTML/iframe blocks from normal text typography controls.
- Deck mode exposes deck rail, add/duplicate, export, and raw JSON entry points.

## Preserved
- Stage 38A canvas-first shell.
- Stage 38B persistent top toolbar workflow.
- Stage 35Z figure drag/resize responsiveness and contextual action palette.
- Existing text style controls and JSON/update workflow.

## Diagnostics
- Added `window.__LUMINA_STAGE38C_STATUS`, `window.__LUMINA_STAGE38C_TESTS`, and `window.LuminaStage38C`.
- Patched diagnostics with `stage38CToolbarPolishStatus` and `stage38CSelectionAwareInspectorStatus`.


## Stage 38C v2 diagnostic fix

- Scoped the selection-aware inspector tab diagnostic to the inspector tab strip.
- Toolbar workspace mode buttons are now reported separately and no longer make `stage38CSelectionAwareInspectorStatus.pass` fail.
