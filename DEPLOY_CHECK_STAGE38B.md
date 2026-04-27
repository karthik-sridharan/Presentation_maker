# Stage 38B deploy check

Open `index.html` with a cache-busting URL such as:

`index.html?v=stage38b-hotfix-v3&clearLuminaStorage=1`

Expected:
- No `Unexpected EOF` / syntax startup error.
- Stage 38A canvas-first shell loads.
- Stage 38B Keynote-style toolbar appears above the canvas.
- Diagnostics should report `esModuleSmokePassed: true` and `stage38KeynoteToolbarStatus.pass: true` once the app settles.

Hotfix note: Stage 38B toolbar assets were moved out of the embedded SVG editor popup template so browser HTML parsing no longer terminates the parent script early.
