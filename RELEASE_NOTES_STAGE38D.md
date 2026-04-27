# Stage 38D Release Notes

## Added

- Thumbnail-based layout picker for visual add-slide workflows.
- Layout cards for all 14 existing slide presets/templates.
- Per-layout **Load** and **Add** buttons.
- Thumbnail-based theme picker for all 8 master presentation styles.
- Top-toolbar **Add slide** now opens the visual layout picker.
- Diagnostic hooks:
  - `window.__LUMINA_STAGE38D_STATUS`
  - `window.__LUMINA_STAGE38D_TESTS`
  - `window.LuminaStage38D`
  - `stage38DVisualGalleryStatus`
  - `stage38DVisualGalleryDiagnostics`

## Preserved

- Existing data-preset and data-style-preset handlers remain the source of behavior.
- Existing Add as new slide button remains available in Deck / Actions.
- Stage 38C toolbar polish and selection-aware inspector remain active.
