# Deploy check — Stage 43Y

Open the app with:

```text
index.html?v=stage43y-import-safe-selected-block-mathpix-20260515-1&clearLuminaStorage=1
```

Then test:

1. Open Import.
2. Click Choose / import files.
3. Select a PDF or PPTX.
4. Confirm the file imports or the review dialog appears.
5. Click Continue import if the review dialog appears.
6. Select a math block and run Mathpix extraction; `\\text{...}` should remain intact.

Runtime status fields to inspect from the browser console if needed:

```js
window.__LUMINA_STAGE41T_LAST_IMPORT_CLICK
window.__LUMINA_STAGE41T_IMPORT_BUTTON_RESCUE
window.__LUMINA_STAGE42S_IMPORT_STATUS
window.__LUMINA_STAGE43Y_IMPORT_REVIEW_FALLBACK
```
