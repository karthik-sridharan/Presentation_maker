# Stage 35R — Final right-panel fit + live slide-jump diagnostics

This patch builds on Stage 35Q.

## Changes

- Adds a small final tight-mode trim to the right preview/inspector column.
- Re-measures the right-panel height **after** the tight-mode class is applied, so copied diagnostics reflect the actual post-fit layout.
- Adds a live `LuminaStage35LFeaturePolish.getStatus()` getter for the slide-jump overlay.
- Copied diagnostics now refresh slide-jump status before reporting it, so `slideJumpStatus.slideCount` should match the deck/outline count even when the Jump overlay is closed.

## Expected diagnostics

- `stage: stage35r-20260425-1`
- `esModuleSmokePassed: true`
- `visualContrastSmokePassed: true`
- `featurePolishSummary.rightPanelPostTightRemeasure: true`
- `featurePolishSummary.slideJumpLiveDiagnostics: true`
- `rightPanelFitStatus.rightMinusLeft` close to `0`
- `slideJumpStatus.slideCount` matches `deckOutlineStatus.slideCount`
- `featurePolishSummary.exportHealthButtonRemoved: true`
- `leftPanelSubtabScrollStatus.stickyDisabled: true`
