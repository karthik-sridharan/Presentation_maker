# Stage 4 block-library migration patch

Overwrite these files in your existing lumina-presenter folder:

- index.html
- js/legacy-app.js
- js/block-library.js

This patch keeps the stable non-module runtime path. It adds a classic-script
`js/block-library.js` and moves the reusable block-library workflow out of
`legacy-app.js`.

Test URL:

http://localhost:8000/index.html?v=stage4a

Main things to verify:

1. The app loads and preview renders.
2. Left tabs/buttons still work.
3. In the reusable block library, select a built-in block and insert it.
4. Save the current block to the library, reload, and confirm it persists.
5. Delete a saved custom reusable block. Built-in blocks should not delete.
