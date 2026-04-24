Stage 8 block-style migration patch

Overwrite these files in your lumina-presenter folder:

  index.html
  js/block-style-stage8.js
  js/block-style.js
  js/legacy-app-stage8.js
  js/legacy-app.js

Test URL:
  http://localhost:8000/index.html?v=stage8-20260424-1

This patch starts from the working stage-7 parser state. It extracts block/title style and animation helpers into a classic-script module. It does not touch Copilot and does not use ES modules.

Suggested checks:
  - App loads and preview renders.
  - Main tabs and hide rail work.
  - Select a preview block and change font scale/color/family/bullet type.
  - Select the title and change title style.
  - Animate tab still applies build-in/build-out settings.
  - Stage-7 parser features still work.
