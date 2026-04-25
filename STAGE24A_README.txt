Stage 24A — Documentation / rollback cleanup

Copy/extract this patch directly into the root of your Presentation_maker project.

This stage does not change app behavior. It only adds/updates documentation:

  MIGRATION_STATUS.md
  ROLLBACK.md
  DEPLOYMENT_CHECKLIST.md
  RUNTIME_INVENTORY.md

Current known-good runtime remains Stage 23B2.

Main test URL:
  https://karthik-sridharan.github.io/Presentation_maker/index.html?v=stage23b2-20260425-2

Diagnostics URL:
  https://karthik-sridharan.github.io/Presentation_maker/diagnostics-stage23b2.html?v=stage23b2-20260425-2

Expected diagnostics:
  missingAssets: []
  missingGlobals: []
  missingDomIds: []
  basicUiBound: true
  previewHasContent: true
  rendererFunctionBased: true
  uiFunctionBased: true
  manifestLoaded: true
  commandsBound: true
  bootErrors: []
  capturedErrors: []

No JS/CSS/index.html files are changed by this patch.
