# Stage 23A: Stable filename cleanup

This patch keeps the working classic-script runtime, but switches the active `index.html` to load stable filenames.

No editor behavior should change. Copilot is still inside `legacy-app.js`; do not split it yet.

Test URL:

/index.html?v=stage23a-stable-20260425-1&clearLuminaStorage=1

Diagnostics:

/diagnostics-stage23a.html?v=stage23a-stable-20260425-1
/diagnostics.html?v=stage23a-stable-20260425-1
