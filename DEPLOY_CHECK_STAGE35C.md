# Deploy check — Stage 35C

Use:

`index.html?v=stage35c-20260425-1&clearLuminaStorage=1`

Expected diagnostics:

- `stage`: `stage35c-20260425-1`
- `missingAssets`: `[]`
- `bootErrors`: `[]`
- `capturedErrors`: `[]`
- `esModuleSmokeStatus`: `passed`
- `visualPolishStage`: `stage35c-20260425-1`
- `efficiencyStage`: `stage35c-20260425-1`
- `efficiencySummary.quickDock`: `true`
- `efficiencySummary.quickDockButtonCount`: at least `7`

Manual smoke checks:

1. Click Compact view, reload, and confirm compact mode persists.
2. Use Update slide from the quick dock and confirm it calls the normal slide update path.
3. Use Copilot and Present/export from the quick dock and confirm workflow tabs switch correctly.
4. Hide/show the slide rail from the quick dock.
