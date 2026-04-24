Stage 6B presets migration patch

Overwrite these files in your lumina-presenter folder:

  index.html
  js/presets-stage6b.js
  js/presets.js
  js/legacy-app-stage6b.js
  js/legacy-app.js

This patch continues from the cache-proof stage-5 recovery. It extracts the slide preset definitions into js/presets-stage6b.js while keeping the runtime as classic browser scripts. It does not reintroduce ES modules or the Copilot split.

Test with:

  http://localhost:8000/index.html?v=stage6b-20260424-1

Primary checks:
  - app loads and preview renders
  - main tabs / hide rail still work
  - preset buttons create the correct slide layouts
  - add/update/duplicate/delete slides still work
  - theme tab still works
