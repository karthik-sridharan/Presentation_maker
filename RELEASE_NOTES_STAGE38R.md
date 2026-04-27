# Stage 38R — diagnostics alignment for AI drawer

Stage 38R is a narrow diagnostic-only pass on top of Stage 38Q.

## What changed

- Aligns the older Stage 38O center-actions diagnostic with the Stage 38Q UI rename from `Copilot` to `AI drawer`.
- Accepts the `AI drawer` center button as the valid Copilot successor for the stale `copilotPresent` check.
- Adds `stage38RDiagnosticsAlignmentStatus` and `stage38RDiagnosticsAlignmentDiagnostics` to the full runtime diagnostic report.

## What did not change

- No new command hooks.
- No UI behavior changes.
- No changes to the AI drawer, Advanced drawer, Copilot generation flow, preview/apply flow, panel heights, or slide/deck commands.
