Stage 19 missing-files patch

Copy/extract this zip directly into your existing lumina-presenter project root.
After extraction these files must exist:

  js/editor-selection-stage19.js
  js/legacy-app-stage19.js

Before opening index.html again, test these URLs directly while your local server is running:

  http://localhost:8000/js/editor-selection-stage19.js
  http://localhost:8000/js/legacy-app-stage19.js

Each URL should show JavaScript text, not a 404 page.
Then open:

  http://localhost:8000/index.html?v=stage19-missing-files-20260424-1
