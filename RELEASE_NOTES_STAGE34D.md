# Lumina Presenter Stage 34D

Stage 34D promotes two additional low-risk modules to guarded live ESM:

1. `LuminaFigureInsert`
2. `LuminaBlockLibrary`

Commands and Diagram Editor remain live ESM from the previous stage. The classic Stage 24C runtime remains available as shadow/fallback for all promoted modules.

## What changed

- Added guarded dynamic import boot for `figure-insert-stage34d.js`.
- Added guarded dynamic import boot for `block-library-stage34d.js`.
- Added live runtime source fields to copied diagnostics.
- Added parity checks proving the live globals are sourced from Stage 34D ESM.
- Kept the ESM leaf parity harness non-blocking.

## Upload/test path

Deploy the files in this patch, then open:

```text
index.html?v=stage34d-20260425-1&clearLuminaStorage=1
```

Expected diagnostic highlights:

```text
esModuleDiagnostics.ok: true
figureInsertRuntimeSource: esm:js/esm/figure-insert-stage34d.js
blockLibraryRuntimeSource: esm:js/esm/block-library-stage34d.js
commandRuntimeSource: esm:js/esm/commands-stage34d.js
diagramEditorRuntimeSource: esm:js/esm/diagram-editor-stage34d.js
bootErrors: []
capturedErrors: []
```
