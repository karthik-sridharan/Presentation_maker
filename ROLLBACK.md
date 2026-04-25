# Rollback

Stage 27C keeps the Stage 24C classic runtime intact.

To roll back:
1. Restore the Stage 24C clean release snapshot.
2. Remove Stage 27C-only files:
   - js/es-module-loader-stage27c.js
   - js/es-module-smoke-stage27c.js
   - js/esm/utils-stage27c.js
   - js/esm/block-style-stage27c.js
   - js/diagnostics-stage27c.js
   - js/module-manifest-stage27c.js
   - diagnostics-stage27c.html
3. Restore `index.html` from Stage 24C if a full folder rollback is not possible.

Stage 27C does not migrate persisted user data, so rollback is file-only.
