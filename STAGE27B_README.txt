Stage 27B — ES Module Bridge / Parity Harness

This stage begins the ES module migration safely.

Runtime behavior:
- The production editor still boots from the Stage 24C classic-script files.
- Stage 27B adds ESM helper modules and a non-blocking smoke/parity harness.
- The harness reports to window.LuminaEsModuleDiagnostics.

Files added/updated:
- index.html
- diagnostics.html
- diagnostics-stage27b.html
- js/diagnostics-stage27b.js
- js/module-manifest-stage27b.js
- js/esm/utils-stage27b.js
- js/esm/block-style-stage27b.js
- js/es-module-smoke-stage27b.js
- MIGRATION_STATUS.md
- RUNTIME_INVENTORY.md
- RELEASE_NOTES_STAGE27B.md
- RELEASE_FILES_STAGE27B.json
- ES_MODULE_MIGRATION_PLAN.md

Recommended test URL:
index.html?v=stage27b-20260425-1&clearLuminaStorage=1

Diagnostics:
diagnostics-stage27b.html?v=stage27b-20260425-1
