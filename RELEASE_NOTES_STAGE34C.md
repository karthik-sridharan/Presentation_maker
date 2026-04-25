# Release notes: Stage 34C

- Bumped `window.LUMINA_STAGE` to `stage34c-20260425-1`.
- Bumped `window.LUMINA_STAGE_SIGNATURE` to `index-inline-stage34c-live-esm-commands-diagram-editor-20260425-1`.
- Added Stage 34C ESM leaf files under `js/esm/*-stage34c.js`.
- Kept `commands-stage34c.js` as the guarded live runtime source for `window.LuminaCommands`.
- Promoted `diagram-editor-stage34c.js` to a guarded live runtime source for `window.LuminaDiagramEditor`.
- Kept `commands-stage24c.js` as a suppressed classic shadow baseline for diagnostics and fallback.
- Preserved the classic Stage 24C diagram editor as `window.LuminaClassicDiagramEditorStage34C` before replacing the live global.
- Extended copied diagnostics with `liveRuntimeStatus`, `commandRuntimeSource`, `classicCommandsShadowReady`, `diagramEditorRuntimeSource`, and `classicDiagramEditorShadowReady`.
