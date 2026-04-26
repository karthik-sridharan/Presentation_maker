# Stage 35Y — Figure drag responsiveness hotfix

Build: `stage35y-20260426-1`

This hotfix builds on Stage 35X and targets the remaining slow/restrictive figure movement in the preview.

## Changes

- Keeps figure drag/resize freeform during pointer movement.
- Defers guide snapping until pointer-up instead of running guide math on every pointermove.
- Leaves **Snap to guides** off by default so normal movement is unconstrained unless explicitly enabled.
- Optimizes resize by preparing figure media sizing once at resize start instead of re-querying/restyling nested media on every pointermove.
- Preserves Stage 35X behavior: editable SVG figures reopen at editor scale and save back into the same slide figure slot.

## Manual test

1. Open `index.html?v=stage35y-20260426-1&clearLuminaStorage=1`.
2. Add or edit a diagram figure.
3. Drag it around the preview with Snap to guides off; movement should be smooth and freeform.
4. Resize it; the handle should respond without sticky jumps.
5. Enable Snap to guides and drag near a guide; the figure should move freely while dragging and snap only after release.
6. Save/reopen the figure editor and confirm the edited drawing still saves back correctly.
