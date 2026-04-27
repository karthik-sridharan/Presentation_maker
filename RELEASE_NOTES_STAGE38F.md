# Stage 38F — Canvas fit regression cleanup

Stage 38F is a focused polish and guard pass on top of Stage 38E.

## What changed

- Restored the tight canvas preview fit after the Stage 38E slide-structure controls.
- Kept the 16:9 preview frame unchanged while preventing the surrounding `.preview-stage` from stretching to full spare viewport height.
- Added a Stage 38F runtime diagnostic block: `stage38FCanvasFitStatus`.
- Patched `rightPanelFitStatus.previewDeadSpace` after the Stage 38F measurement so the main diagnostic report reflects the corrected fit.
- Preserved Stage 38E rail / outline structure controls, Stage 38D visual galleries, Stage 38C selection-aware inspector, and all previous ESM/guarded runtime paths.

## Expected diagnostic targets

- `stage`: `stage38f-20260427-1`
- `indexStageSignature`: `index-inline-stage38f-canvas-fit-regression-cleanup-20260427-1`
- `stage38FCanvasFitStatus.pass`: `true`
- `stage38FCanvasFitStatus.previewDeadSpaceApprox`: `<= 24`
- `rightPanelFitStatus.previewDeadSpace.verticalDeadSpaceApprox`: should be near zero / under the Stage 38F threshold
- `stage38ESlideStructureStatus.pass`: `true`
- `stage38DVisualGalleryStatus.pass`: `true`
- `stage38CSelectionAwareInspectorStatus.pass`: `true`
- `visualContrastAudit.failureCount`: `0`

## Notes

This stage intentionally does not change slide rendering, slide rail ordering behavior, outline controls, Copilot, export, or figure editing behavior.
