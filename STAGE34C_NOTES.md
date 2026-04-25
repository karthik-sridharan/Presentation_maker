# Stage 34C notes

Stage 34C does two incremental live-runtime promotions:

1. Keeps the Stage 34B command registry / keyboard shortcut layer running from guarded ESM using `js/esm/commands-stage34c.js`.
2. Promotes the diagram editor popup helper to guarded live ESM using `js/esm/diagram-editor-stage34c.js`.

The classic `js/commands-stage24c.js` is still loaded as a suppressed shadow baseline for parity diagnostics and fallback, so its keydown binding is intentionally suppressed during normal Stage 34C startup.

The classic `js/diagram-editor-stage24c.js` is captured as `window.LuminaClassicDiagramEditorStage34C` before the ESM diagram editor replaces `window.LuminaDiagramEditor`. If the ESM import fails, Stage 34C preserves the classic diagram editor runtime.

Expected diagnostic additions:

- `commandRuntimeSource: "esm:js/esm/commands-stage34c.js"`
- `diagramEditorRuntimeSource: "esm:js/esm/diagram-editor-stage34c.js"`
- `liveRuntimeStatus.commands.source: "esm"`
- `liveRuntimeStatus.diagramEditor.source: "esm"`
- `classicCommandsShadowReady: true`
- `classicDiagramEditorShadowReady: true`
