# Stage 38N — Independent panel heights + preview lift

## What changed
- Fixed the left slide rail, center preview, and right inspector into independent height zones.
- Left and right panels now scroll internally instead of stretching the center preview when the slide rail grows.
- Tightened the Update slide / Add slide / Duplicate / Copilot quick dock above the preview to fixed tiny pill controls.
- Kept the page-level toolbar compact and prevented it from rescaling as deck content changes.
- Lifted and slightly enlarged the preview by reducing header/dock/padding overhead.

## Guardrails
- Visual/layout-only pass: no new command hooks and no deck mutation behavior changes.
- Preserves Stage 38K compact toolbar, Stage 38L fresh-deck seed, Stage 38M rail-sized toolbar, Stage 38I safe deck sync, and Stage 38F canvas fit cleanup.
- Adds `stage38NIndependentPanelHeightsStatus` and `stage38NIndependentPanelHeightsDiagnostics`.

## Expected diagnostic checks
- `stage38NIndependentPanelHeightsStatus.tests.pass === true`
- `stage38NIndependentPanelHeightsStatus.tests.panelSpreadFixed === true`
- `stage38NIndependentPanelHeightsStatus.tests.quickDockTiny === true`
- `stage38NIndependentPanelHeightsStatus.tests.internalScrollIsolation === true`
