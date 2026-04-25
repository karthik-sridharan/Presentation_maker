# Release Notes: Stage 34E

## Purpose

Continue the low-risk live ESM migration by promoting Deck and Editor Selection while preserving classic Stage 24C fallbacks.

## Changes

- Added guarded dynamic import boot for `deck-stage34e.js`.
- Added guarded dynamic import boot for `editor-selection-stage34e.js`.
- Captured classic shadows as `LuminaClassicDeckStage34E` and `LuminaClassicEditorSelectionStage34E`.
- Added diagnostics checks for live Deck and Editor Selection runtime sources.
- Retained live guarded ESM for Commands, Diagram Editor, Figure Insert, and Block Library.

## Test URL

```text
index.html?v=stage34e-20260425-1&clearLuminaStorage=1
```

## Expected report markers

```text
stage: stage34e-20260425-1
bootErrors: []
capturedErrors: []
esModuleDiagnostics.ok: true
esModuleSmokePassed: true

deckRuntimeSource: esm:js/esm/deck-stage34e.js
editorSelectionRuntimeSource: esm:js/esm/editor-selection-stage34e.js
commandRuntimeSource: esm:js/esm/commands-stage34e.js
diagramEditorRuntimeSource: esm:js/esm/diagram-editor-stage34e.js
figureInsertRuntimeSource: esm:js/esm/figure-insert-stage34e.js
blockLibraryRuntimeSource: esm:js/esm/block-library-stage34e.js
```

## Suggested manual checks

1. Add, duplicate, move, update, and delete a slide.
2. Format/load/add from the JSON snippet box.
3. Click a slide title in preview and change its style/animation.
4. Click a preview block and change its style/animation.
5. Select a figure and verify animation controls still work.
