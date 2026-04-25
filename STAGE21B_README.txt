Stage 21B diagnostics patch for Lumina Presenter

Copy/extract this zip directly into the lumina-presenter project root.

Open:
  http://localhost:8000/index.html?v=stage21b-20260425-1&clearLuminaStorage=1

This patch intentionally does not split Copilot and does not change editor behavior. It adds diagnostics only.

If startup fails, open:
  http://localhost:8000/diagnostics-stage21b.html?v=stage21b-20260425-1

The diagnostics page checks whether all expected js/css files are reachable from the server.
