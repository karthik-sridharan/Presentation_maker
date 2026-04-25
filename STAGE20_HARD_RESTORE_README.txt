Stage 20 hard restore patch

Copy/extract the CONTENTS of this zip directly into your existing lumina-presenter project root.

This patch uses brand-new cache-proof filenames ending in -stage20hard.js / -stage20hard.css and restores the last confirmed working stage-20 runtime. It does not load stage21/copilot files.

Open:
  http://localhost:8000/index.html?v=stage20hard-20260425-1

If it still fails, test direct URLs such as:
  http://localhost:8000/js/block-editor-stage20-stage20hard.js?v=stage20hard-20260425-1
  http://localhost:8000/js/legacy-app-stage20-stage20hard.js?v=stage20hard-20260425-1
