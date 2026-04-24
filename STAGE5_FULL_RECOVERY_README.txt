Stage 5 full recovery patch

Copy/overwrite all files in this patch into your project.

This index.html intentionally uses cache-proof runtime filenames:
  css/styles-stage5restore.css
  js/utils-stage5restore.js
  js/block-library-stage5restore.js
  js/theme-stage5restore.js
  js/legacy-app-stage5restore.js

It also includes the same files under the normal names for future migration work.

Test with:
  http://localhost:8000/index.html?v=stage5restore-20260424-1

If it still fails, look for the red diagnostic box at the bottom of the page and copy its contents.
