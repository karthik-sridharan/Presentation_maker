Stage 9B import fix

This patch fixes the import buttons error: "Can't find variable: applyImportedSlides".

Overwrite:
- index.html
- js/import-stage9b.js
- js/import.js
- js/legacy-app-stage9b.js
- js/legacy-app.js

Test with:
http://localhost:8000/index.html?v=stage9b-20260424-1
