Stage 20 block editor/form sync flat patch

Copy/extract this patch directly into your existing lumina-presenter project root.

New files:
- js/block-editor-stage20.js
- js/block-editor.js
- js/legacy-app-stage20.js

Updated files:
- index.html
- js/legacy-app.js

Test URL:
http://localhost:8000/index.html?v=stage20-20260424-1

Main checks:
1. App loads and preview renders.
2. Clicking blocks in the preview loads their content into the form.
3. Editing the form and clicking Update changes only the selected block.
4. Add, duplicate, delete, and move block up/down work.
5. Switching left/right columns on two-column slides works.
6. Autosave/refresh preserves block edits.
7. Import/export/design/figure duplicate still work.
