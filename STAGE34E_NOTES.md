# Stage 34E Notes

Stage 34E extends the guarded live ESM migration after Stage 34D diagnostics passed.

## Live ESM modules

- Commands remains live from `js/esm/commands-stage34e.js`, with a captured classic shadow/fallback.
- Diagram Editor remains live from `js/esm/diagram-editor-stage34e.js`, with a captured classic shadow/fallback.
- Figure Insert remains live from `js/esm/figure-insert-stage34e.js`, with a captured classic shadow/fallback.
- Block Library remains live from `js/esm/block-library-stage34e.js`, with a captured classic shadow/fallback.
- Deck is promoted to guarded live ESM from `js/esm/deck-stage34e.js`.
- Editor Selection is promoted to guarded live ESM from `js/esm/editor-selection-stage34e.js`.

## Fallback behavior

All promoted ESM modules are optional and non-blocking. If an import fails, Stage 34E preserves the Stage 24C classic runtime and records the failure in diagnostics instead of raising a startup error.

## Diagnostics to expect

The copied diagnostic report should include:

- `deckRuntimeSource: "esm:js/esm/deck-stage34e.js"`
- `editorSelectionRuntimeSource: "esm:js/esm/editor-selection-stage34e.js"`
- `classicDeckShadowReady: true`
- `classicEditorSelectionShadowReady: true`
- `esModuleDiagnostics.status: "passed"`
