Stage 7 parser migration patch

Overwrite these files in your lumina-presenter folder:

  index.html
  js/parser-stage7.js
  js/parser.js
  js/legacy-app-stage7.js
  js/legacy-app.js

This patch keeps the classic-script startup path. It does not use ES modules.
It extracts only the structured text / LaTeX-ish parser from legacy-app into js/parser-stage7.js.

Test with:

  http://localhost:8000/index.html?v=stage7-20260424-1

Things to check:
  - app loads and preview renders
  - main tabs and hide rail work
  - existing slides render bullets, cards, equations, and inline math
  - figurehtml insertion still works outside equation/math mode
  - slide presets still work
  - export/preview still renders text correctly
