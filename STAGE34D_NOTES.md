# Stage 34D Notes

Stage 34D extends the guarded live ESM migration after Stage 34C manual diagram-editor testing.

## Live ESM modules

- Commands remains live from `js/esm/commands-stage34d.js`, with a captured classic shadow/fallback.
- Diagram Editor remains live from `js/esm/diagram-editor-stage34d.js`, with a captured classic shadow/fallback.
- Figure Insert is promoted to guarded live ESM from `js/esm/figure-insert-stage34d.js`.
- Block Library is promoted to guarded live ESM from `js/esm/block-library-stage34d.js`.

## Fallback behavior

All newly promoted ESM modules are optional and non-blocking. If an import fails, Stage 34D preserves the Stage 24C classic runtime and records the failure in diagnostics instead of raising a startup error.

## Diagnostics to expect

The copied diagnostic report should include:

- `figureInsertRuntimeSource: "esm:js/esm/figure-insert-stage34d.js"`
- `blockLibraryRuntimeSource: "esm:js/esm/block-library-stage34d.js"`
- `classicFigureInsertShadowReady: true`
- `classicBlockLibraryShadowReady: true`
- `esModuleDiagnostics.status: "passed"`
