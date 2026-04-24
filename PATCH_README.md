# Stage 2 Safe Runtime Patch

This patch intentionally restores the known-working stage-1 runtime path.

Overwrite these files:

- `index.html`
- `js/legacy-app.js`

Optional:

- `build/lumina-presenter-bundle.html`

Why: the previous stage-2 patch made `legacy-app.js` depend on ES module imports (`main.js`, `theme.js`, `utils.js`). If the project is opened from `file://`, or if any import path/MIME behavior fails, the app stops before preview, hide rail, main tabs, and many buttons are bound. This patch makes `legacy-app.js` self-contained again and loads it as a plain deferred script.

After this is confirmed working, the next modularization pass should split one feature at a time behind a browser-tested entry point.
