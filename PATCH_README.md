# Lumina Presenter stage-1 reset patch

Overwrite these files in your existing `lumina-presenter` folder:

- `index.html`
- `css/styles.css`
- `js/legacy-app.js`

This patch intentionally removes the fragile stage-2 ES-module startup path and restores the known-working stage-1 runtime:

`index.html` → `css/styles.css` + `js/legacy-app.js`

For testing, run from the project folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

I also included `index-working.html` as an emergency reference copy of the original monolithic working file. If `index.html` still fails after overwriting the three files above, open `index-working.html` directly to confirm the browser/environment is still able to run the original app.


Optional diagnostic:

- Open `index-debug.html` if the normal `index.html` still appears blank. It shows browser JavaScript errors directly on the page.
