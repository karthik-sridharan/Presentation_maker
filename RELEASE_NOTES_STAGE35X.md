# Stage 35X — Editable figure scale + drag responsiveness hotfix

This patch builds on Stage 35W.

## Fixes

- Reopened SVG diagrams now load into the diagram editor at a comfortable intrinsic canvas scale instead of inheriting slide-sized width/height/style values.
- Saving an edited diagram now preserves the existing figure box wrapper when possible, so position, size, crop, z-index, and manual geometry survive the edit.
- Figure drag/resize no longer snaps to a 20px grid merely because guide snapping is enabled. Grid quantization now happens only when **Show grid** is enabled; guide snapping still works near guide targets.

## Files

- `index.html`
- `js/esm/figure-tools-stage34j.js`
- `js/figure-tools-stage24c.js`
