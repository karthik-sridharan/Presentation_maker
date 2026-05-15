Stage 43AA corrected frontend root overlay (43V -> 43AA)

This overlay is intended to be applied on top of a clean Stage 43V frontend root.
It includes every frontend-root file that changed between the Stage 43V full frontend
and the Stage 43AA full frontend.

Included files:
- index.html
- js/export-stage24c.js
- js/file-io-stage24c.js
- js/legacy-app-stage24c.js
- js/renderer-stage24c.js
- js/esm/export-stage34j.js
- js/esm/file-io-stage34j.js
- js/esm/renderer-stage34j.js
- README_STAGE43AA.md

Reason for corrected overlay:
The earlier overlay omitted js/esm/file-io-stage34j.js. This corrected overlay adds it,
so the overlay now fully matches the 43V -> 43AA frontend diff.
