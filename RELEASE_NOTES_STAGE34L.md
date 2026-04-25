# Stage 34L release notes

Stage 34L is a cleanup/stabilization patch after the successful Stage 34K Copilot ESM migration.

Changes:

- Bumped runtime/cache marker to `stage34l-20260425-1`.
- Fixed the stale Copilot runtime status stage label so it follows `window.LUMINA_STAGE`.
- Added explicit Copilot diagnostic fields: `copilotRuntimeSource`, `copilotRuntimeStage`, `copilotRuntimeStatus`, and `copilotDiagnosticsSummary`.
- Added `copilotManualSmokeChecklist` to copied diagnostics reports.

No new major module migration is included in this stage.
