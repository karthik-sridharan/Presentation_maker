# Stage 2 runtime patch

This patch contains all runtime files required for the modular Stage 2 version.

Overwrite these paths in your existing `lumina-presenter` folder:

- `index.html`
- `css/styles.css`
- `css/slides.css`
- `css/copilot.css`
- `js/main.js`
- `js/legacy-app.js`
- `js/theme.js`
- `js/utils.js`

Optional build/distribution files included:

- `build/bundle.py`
- `build/lumina-presenter-bundle.html`
- `MIGRATION_STATUS.md`

Important: test the modular app through a local server, not by opening `index.html` via `file://`.

```bash
cd lumina-presenter
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Why this patch is larger than the previous one: `js/legacy-app.js` now imports `js/utils.js` and `js/theme.js`, and `index.html` now starts through `js/main.js`. Copying only `legacy-app.js` can leave the app in a mismatched state.
