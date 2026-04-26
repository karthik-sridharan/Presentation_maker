# Stage 35Z — Figure selection/action and drag hotfix

Build: `stage35z-20260426-1`

This patch is on top of Stage 35Y and targets the connected symptom where double-click could open the figure editor, but a normal single-click did not expose figure actions and drag/resize still felt constrained.

## What changed

- Adds a contextual action palette directly in the preview after selecting a figure:
  - Edit
  - Duplicate
  - Bring front
  - Send back
  - Crop
  - Snap
  - Reset
- Forces single-click/pointer-down on preview figures to also select the `.figure-box` used by the existing figure-tools module.
- Ensures preview figures have an interactive `.figure-box` wrapper and resize handle even after preview rebuilds or figure-editor save-back.
- Sets `touch-action: none` on interactive figure boxes and their media so Safari/iPad pointer movement is not treated as page/tap gesture handling.
- Removes live grid quantization during pointer movement and resize. Movement stays freeform while dragging; explicit Snap and release-time guide snap remain available.

## Files

- `index.html`
- `js/figure-tools-stage24c.js`
- `js/esm/figure-tools-stage34j.js`

## Manual smoke test

1. Open `index.html?v=stage35z-20260426-1&clearLuminaStorage=1`.
2. Insert a diagram/figure into a slide.
3. Single-click the figure in preview.
4. Confirm the figure gets a selection outline and the contextual action palette appears near the figure.
5. Click **Edit** and confirm the diagram editor opens for SVG diagrams.
6. Save back and confirm the edited SVG remains in the slide.
7. Drag and resize the figure in preview; movement should be smooth/freeform.
8. Try Duplicate, Bring front, Send back, Crop, Snap, and Reset from the contextual palette.

## Expected diagnostics

- `stageFromWindow`: `stage35z-20260426-1`
- `window.__LUMINA_STAGE35Z_FIGURE_SELECTION_ACTIONS.bound`: `true`
- `window.__LUMINA_STAGE35Z_FIGURE_SELECTION_ACTIONS.contextualFigureActions`: `true`
- `window.__LUMINA_STAGE35Z_FIGURE_DRAG_RESPONSIVENESS_HOTFIX.liveGuideSnappingDuringPointerMove`: `false`
