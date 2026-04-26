# Stage 35Z deploy check

Open:

```text
index.html?v=stage35z-20260426-1&clearLuminaStorage=1
```

Then run diagnostics and confirm:

- `stageFromWindow` is `stage35z-20260426-1`.
- No missing assets.
- No boot errors or captured errors.
- `figureToolsRuntimeSource` is still ESM when available.
- `window.__LUMINA_STAGE35Z_FIGURE_SELECTION_ACTIONS.bound === true`.
- Single-clicking a figure in preview adds a visible selected outline and opens the contextual action palette.
- Dragging/resizing is smooth; no live grid snapping occurs while moving.
- Double-click/Edit still reopens the diagram editor for SVG figures and save-back persists.
