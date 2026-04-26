# Stage 35Q — Scroll subtabs with left-panel content

This patch builds on Stage 35P.

## Change

- Disables the old sticky positioning for left-panel inner subtabs.
- Build/Assets subtabs such as **Slide / Content**, preset subtabs, block-library subtabs, and import subtabs now scroll naturally with the pane content.
- Keeps the main workflow tabs unchanged.
- Keeps Stage 35P's removed Export health quick-dock button.

## Expected diagnostics

- `stage: stage35q-20260425-1`
- `esModuleSmokePassed: true`
- `visualContrastSmokePassed: true`
- `featurePolishSummary.subtabStickyDisabled: true`
- `leftPanelSubtabScrollStatus.stickyDisabled: true`
- `featurePolishSummary.exportHealthButtonRemoved: true`
