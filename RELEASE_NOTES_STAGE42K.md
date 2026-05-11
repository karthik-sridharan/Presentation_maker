# Stage 42K — AI import repair batch-marker preservation

Fixes a false stale-import failure in the background AI import repair flow.

## Root cause
The imported slides were tagged with `__stage42eImportBatchId` at the top level. During normal editor/autosave syncing, the active slide could be rebuilt from form fields via `currentDraftSlide()`, which preserved `importMeta` but not the temporary top-level AI repair batch marker. When the AI repair returned, `applyStage42eBackgroundAiRepair()` checked the current deck for that marker and concluded the import batch had changed.

## Changes
- Store the import batch marker in both top-level fields and `importMeta`, so it survives normal editor/autosave sync.
- Preserve `__stage42eImportBatchId`, `__stage42eImportBatchIndex`, `__stage42eRawImported`, and `__stage42eAiRepaired` when rebuilding the current draft slide.
- Preserve `__aiSourceBlockId`/source block identifiers when syncing the selected block from the editor.
- Make the background AI repair batch check accept either marker location and use a conservative slide-signature fallback.
- Suppress the orange "AI repair did not complete" banner for genuinely stale async repair results; show a small toast instead.

## Files changed
- `index.html`
- `js/file-io-stage24c.js`
- `js/esm/file-io-stage34j.js`
- `js/block-editor-stage24c.js`
- `js/esm/block-editor-stage34j.js`
