Stage 9 import/parser migration patch

Overwrite these files in your lumina-presenter folder:
- index.html
- js/import-stage9.js
- js/import.js
- js/legacy-app-stage9.js
- js/legacy-app.js

Test with:
http://localhost:8000/index.html?v=stage9-20260424-1

Main checks:
1. App loads and preview renders.
2. Main tabs and hide rail work.
3. Import Markdown outline works.
4. Import LaTeX/Beamer outline works.
5. Import JSON outline works.
6. Import PowerPoint-style text works.
7. File import for image/PDF/markdown/json still works.
