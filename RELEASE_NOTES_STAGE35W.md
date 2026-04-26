# Stage 35W — Editable figure hotfix

This patch keeps Stage 35U editable SVG figure support and adds a reliability layer for iPad/Safari and touch devices.

## Fixes

- Adds double-tap detection in addition to browser `dblclick`.
- Adds click-to-select behavior for SVG figures in the preview.
- Shows a visible **Edit figure** button after selecting an editable figure.
- Uses the existing Stage 35U editor bridge, so saved edits still replace the original `figurehtml` slot and autosave through the normal block update path.

## Smoke test

1. Insert a diagram figure.
2. Click/tap the figure once; an **Edit figure** button should appear.
3. Double-click or double-tap the figure, or press **Edit figure**.
4. Save back to slide from the popup editor.
5. Confirm the original figure updates in the preview and no boot/captured errors appear.


Stage 35W note: fixes save-back by updating the live preview figure before the legacy figure-position sync runs, preventing the old SVG from overwriting the edited one.
