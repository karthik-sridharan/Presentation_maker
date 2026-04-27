# Deploy check — Stage 38F

Use the deployed app URL and run the standard diagnostic report.

Confirm:

```json
{
  "stage": "stage38f-20260427-1",
  "indexStageSignature": "index-inline-stage38f-canvas-fit-regression-cleanup-20260427-1",
  "stage38FCanvasFitStatus": {
    "pass": true,
    "previewDeadSpaceApprox": "<= 24"
  },
  "stage38ESlideStructureStatus": {
    "pass": true
  },
  "stage38DVisualGalleryStatus": {
    "pass": true
  },
  "stage38CSelectionAwareInspectorStatus": {
    "pass": true
  }
}
```

Manual smoke:

1. Open the app in normal desktop width.
2. Confirm the preview frame is centered and there is no large vertical dead zone inside the canvas stage.
3. Confirm the slide rail action controls still appear.
4. Confirm outline / structure controls still reorder and jump correctly.
5. Confirm Add slide gallery and Theme gallery still open from the toolbar.
