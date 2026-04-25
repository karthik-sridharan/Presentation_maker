Stage 19 editor selection flat patch

Copy/extract the contents of this zip directly into your existing lumina-presenter project root.

Test URL:
  http://localhost:8000/index.html?v=stage19-20260424-1

Main files added/updated:
  index.html
  js/editor-selection-stage19.js
  js/editor-selection.js
  js/legacy-app-stage19.js
  js/legacy-app.js

What changed:
  - Extracted preview block/title selection logic into js/editor-selection-stage19.js.
  - Extracted preview style controls and animation controls into js/editor-selection-stage19.js.
  - Kept classic script loading.
  - Did not touch Copilot.
  - Did not modify the figure crop implementation from stage 18B.

Recommended checks:
  1. App loads and preview renders.
  2. Click title in preview; title should select.
  3. Click content blocks in preview; selected block should sync to the editor.
  4. Change selected block font scale/color/family/bullet type.
  5. Reset selected block style.
  6. Apply and clear animation on title/block/figure.
  7. Figure duplicate still works.
  8. Import/export/design still work.
