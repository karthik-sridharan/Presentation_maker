# Stage 38E — Slide structure / outline editing polish

Stage 38E builds on Stage 38D and keeps the guarded ESM/classic runtime unchanged. It adds a non-destructive UI overlay for Keynote-like slide structure editing.

## Added

- Slide rail structure panel with slide count, refresh, and **Add section** action.
- Thumbnail-adjacent slide controls near each rail card:
  - Move up
  - Move down
  - Duplicate
  - Delete
- Drag-to-reorder from the slide thumbnail rail.
- Drag-to-reorder from the persistent deck outline.
- Outline rows get draggable grips plus compact move/jump controls.
- Section divider affordances:
  - Add section button creates a section divider slide through the existing visual layout gallery path.
  - Section-divider thumbnails show a section badge in the rail controls.
- Diagnostics added under:
  - `stage38ESlideStructureStatus`
  - `stage38ESlideStructureDiagnostics`

## Guardrails

- No ESM core migration changes.
- No renderer changes.
- No slide schema changes.
- Uses `LuminaAppCommands` for navigation, move, duplicate, delete, and autosave-backed operations.
- Keeps Stage 38D visual galleries and Stage 38C inspector behavior intact.

## Manual smoke checklist

1. Confirm `stage38ESlideStructureStatus.pass === true`.
2. Drag a slide thumbnail in the left rail and confirm the deck order changes.
3. Drag a row in the deck outline and confirm the deck order changes.
4. Use rail Move up / Move down and confirm active slide sync remains correct.
5. Use rail Duplicate and Delete and confirm deck count, preview, outline, and rail all update.
6. Click Add section and confirm a section divider slide is added through the existing layout-gallery workflow.
7. Confirm Stage 38D gallery status still passes.
8. Confirm Stage 38C selection-aware inspector status still passes.
