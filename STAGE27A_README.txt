Stage 27A — ES Module Bridge / Parity Harness

This stage begins the ES module migration safely.

Runtime behavior:
- The production editor still boots from the Stage 24C classic-script files.
- Stage 27A adds ESM helper modules and a non-blocking smoke/parity harness.
- The harness reports to window.LuminaEsModuleDiagnostics.

Files added/updated:
- index.html
- diagnostics.html
- diagnostics-stage27a.html
- js/diagnostics-stage27a.js
- js/module-manifest-stage27a.js
- js/esm/utils-stage27a.mjs
- js/esm/block-style-stage27a.mjs
- js/es-module-smoke-stage27a.mjs
- MIGRATION_STATUS.md
- RUNTIME_INVENTORY.md
- RELEASE_NOTES_STAGE27A.md
- RELEASE_FILES_STAGE27A.json
- ES_MODULE_MIGRATION_PLAN.md

Recommended test URL:
index.html?v=stage27a-20260425-1&clearLuminaStorage=1

Diagnostics:
diagnostics-stage27a.html?v=stage27a-20260425-1
