# Stage 35P — Remove Export Health Dock Button

This patch keeps Stage 35O right-panel fit polish and removes the visible **Export health** button from the quick-action dock.

## Changes

- Prevents the Stage 35M export diagnostics helper from injecting the `Export health` quick-dock button.
- Removes any stale `[data-stage35m-export-button]` / `.stage35m-export-button` node if it already exists during initialization.
- Keeps export diagnostics state/probes available internally for reports, without adding a visible dock control.
- Removes the export-health button from the contrast audit sample list and manual smoke checklist.
- Updates stage identity to `stage35p-20260425-1`.

## Expected

- Quick dock should no longer show `Export health`.
- `featurePolishSummary.exportHealthButtonRemoved` should be `true`.
- `featurePolishSummary.exportDiagnosticsButton` should be `false`.
- Existing Stage 35O right-panel fit diagnostics should remain available.
