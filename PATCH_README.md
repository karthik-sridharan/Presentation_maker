# Lumina Presenter stage 6 patch

This patch continues from the working stage-5 version.

Overwrite these files in your existing `lumina-presenter` project:

```text
index.html
js/copilot.js
js/legacy-app.js
```

## What changed

- Added `js/copilot.js` as a classic browser script.
- Moved the Copilot/OpenAI workflow out of `js/legacy-app.js`.
- Kept the stable non-module startup path.
- Updated cache-busting query strings to `stage6a`.

`index.html` now loads scripts in this order:

```html
<script defer src="js/utils.js?v=stage6a"></script>
<script defer src="js/block-library.js?v=stage6a"></script>
<script defer src="js/theme.js?v=stage6a"></script>
<script defer src="js/copilot.js?v=stage6a"></script>
<script defer src="js/legacy-app.js?v=stage6a"></script>
```

## Test URL

Run a local server and open:

```text
http://localhost:8000/index.html?v=stage6a
```

Use a hard refresh or keep DevTools open with Disable cache checked if you see stale behavior.
