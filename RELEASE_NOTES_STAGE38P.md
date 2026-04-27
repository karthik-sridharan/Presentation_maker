# Stage 38P — Diagnostics alignment for center actions

Stage 38P keeps Stage 38O behavior unchanged and aligns diagnostics with the intentional center toolbar sizing change.

## Changes
- Preserves Stage 38O center dock behavior: no Update slide, no Outline button, delegated Duplicate/Copilot handlers.
- Adds a final diagnostics reconciliation layer so Stage 38N no longer fails the old "tiny quick dock" threshold after Stage 38O intentionally enlarged the center buttons.
- Adds `stage38PDiagnosticsAlignmentStatus` and `stage38PDiagnosticsAlignmentDiagnostics`.

## Expected
- `stage38OCenterActionsStatus.pass === true`
- `stage38NIndependentPanelHeightsStatus.pass === true`
- `stage38PDiagnosticsAlignmentStatus.pass === true`
