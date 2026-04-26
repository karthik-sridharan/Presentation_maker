# Stage 35O — Right Panel Fit Polish

Stage 35O is a focused layout-polish patch on top of Stage 35N.

## What changed

- Removes the tall centered preview-stage minimum height that created empty space above and below the slide preview.
- Tightens the right-side preview card, live-preview header, viewport padding, and selected-item inspector controls.
- Adds adaptive `stage35o-right-tight` mode when the right column is measured taller than the left editor column.
- Adds `rightPanelFitStatus` to copied diagnostics with left/right heights and preview dead-space measurements.

## Behavior

No slide-rendering, export, Copilot, ESM migration, or data-model behavior changed. This is visual/layout polish only.
