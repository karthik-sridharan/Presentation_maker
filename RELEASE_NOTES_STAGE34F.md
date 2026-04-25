# Release Notes: Stage 34F

Stage 34F continues the guarded ES module migration from Stage 34E.

## Newly promoted live ESM modules

- `LuminaFileIo` now runs from `js/esm/file-io-stage34f.js` when dynamic import succeeds.
- `LuminaBlockEditor` now runs from `js/esm/block-editor-stage34f.js` when dynamic import succeeds.

## Previously promoted modules retained

- `LuminaCommands`
- `LuminaDiagramEditor`
- `LuminaFigureInsert`
- `LuminaBlockLibrary`
- `LuminaDeck`
- `LuminaEditorSelection`

All promoted ESM modules remain guarded and optional. If an ESM import fails, Stage 34F preserves the captured Stage 24C classic runtime and records the failure as an optional diagnostic warning instead of surfacing a startup error.

## Test URL

```text
index.html?v=stage34f-20260425-1&clearLuminaStorage=1
```

## Expected diagnostic markers

```text
stage: stage34f-20260425-1
bootErrors: []
capturedErrors: []
esModuleDiagnostics.ok: true
esModuleSmokePassed: true

fileIoRuntimeSource: esm:js/esm/file-io-stage34f.js
blockEditorRuntimeSource: esm:js/esm/block-editor-stage34f.js
classicFileIoShadowReady: true
classicBlockEditorShadowReady: true
```
