Stage 6 recovery patch

This rolls back only the failed Copilot extraction and restores the known-working stage-5 runtime.

Overwrite:
- index.html
- js/legacy-app.js

This keeps utils.js, block-library.js, and theme.js as external classic scripts.
Copilot logic is back inside legacy-app.js for now, so the UI should no longer freeze if js/copilot.js is missing or broken.

Test URL:
http://localhost:8000/index.html?v=stage6recovery
