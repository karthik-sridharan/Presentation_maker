Stage 22B — diagnostics / migration cleanup

Copy/extract this flat patch directly into the lumina-presenter project root.

What changed:
- Added js/module-manifest-stage22b.js as a single manifest of expected assets, globals, DOM ids, and load order.
- Updated js/diagnostics-stage22b.js to read from that manifest instead of duplicating assumptions.
- Kept the stage-22A keyboard command layer.
- No Copilot split, no ES modules, no editor behavior changes.

Test URL:
  index.html?v=stage22b-20260425-1&clearLuminaStorage=1

Diagnostics page:
  diagnostics-stage22b.html?v=stage22b-20260425-1

Expected diagnostics:
- missingAssets: []
- missingGlobals: []
- missingDomIds: []
- manifestLoaded: true
- basicUiBound: true
- commandsBound: true
- previewHasContent: true
