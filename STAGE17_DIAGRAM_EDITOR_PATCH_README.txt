Stage 17 diagram editor migration patch

Copy/extract this flat patch directly into your existing lumina-presenter project root.

New files:
- js/diagram-editor-stage17.js
- js/diagram-editor.js

Updated files:
- index.html
- js/legacy-app-stage17.js
- js/legacy-app.js

Test URL:
http://localhost:8000/index.html?v=stage17-20260424-1

Checks:
1. App loads and preview renders.
2. Main tabs and hide rail work.
3. Add Figure > Open simple diagram editor opens the popup.
4. Draw a shape/text and click Insert into slide.
5. The inserted SVG appears in the current block/slide.
6. Existing image figure insertion, drag/resize/crop, import, export, design still work.
