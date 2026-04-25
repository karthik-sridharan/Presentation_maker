Stage 23B — renderer diagnostics cleanup

Copy/extract this patch directly into your Presentation_maker project root.

This patch keeps the existing stage24c filenames to avoid missing-file issues, but updates their cache-busting query strings to stage23b.

Test URL:
  index.html?v=stage24c-20260425-1&clearLuminaStorage=1

Diagnostics:
  diagnostics-stage24c.html?v=stage24c-20260425-1

What changed:
- Adds window.LuminaRendererApi in js/renderer-stage24c.js.
- Updates diagnostics to check LuminaRendererApi instead of a nonexistent renderSlide global.
- Updates the manifest to expect LuminaRendererApi.

No editor behavior changes, no Copilot split, no ES modules.
