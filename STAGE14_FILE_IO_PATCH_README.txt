Stage 14 file/import workflow patch

Copy/extract this flat patch directly into your existing lumina-presenter project root.

New files:
- js/file-io-stage14.js
- js/file-io.js

Updated files:
- index.html
- js/legacy-app-stage14.js
- js/legacy-app.js

Test with: http://localhost:8000/index.html?v=stage14-20260424-1

Key checks:
- App load/preview/tabs/hide rail
- Markdown/Beamer/JSON/PowerPoint text imports
- File import for images/PDF/text
- Load saved editable deck HTML
- Load presentation JSON
- Export functions from stage 11
