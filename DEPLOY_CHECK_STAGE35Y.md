# Stage 35Y deploy check

Open:

```text
index.html?v=stage35y-20260426-1&clearLuminaStorage=1
```

Expected diagnostics:

- `stageFromWindow`: `stage35y-20260426-1`
- `featurePolishSummary.figureDragResponsivenessHotfix`: `true`
- `featurePolishSummary.figureLiveGuideSnappingDuringPointerMove`: `false`
- `featurePolishSummary.figureSnapToGuidesDefaultChecked`: `false`
- `bootErrors`: `[]`
- `capturedErrors`: `[]`

Manual smoke:

- Drag figure with Snap to guides off: no grid/guide stickiness.
- Resize figure: no slow nested media restyle loop.
- Turn Snap to guides on: snap happens on pointer-up, not during every pointermove.
- Double-click SVG figure: editor opens at normal canvas scale, saves back to existing figure.
