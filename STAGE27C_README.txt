Lumina Presenter — Stage 27C ES Module Loader Hotfix

Purpose
- Fixes Stage 27B environments that showed: Failed to load js/es-module-smoke-stage27b.js.
- Keeps the Stage 24C classic runtime authoritative.
- Replaces the direct production <script type="module"> tag with a classic-script loader.

How Stage 27C works
- Required runtime asset: js/es-module-loader-stage27c.js
- Optional ESM parity assets:
  - js/es-module-smoke-stage27c.js
  - js/esm/utils-stage27c.js
  - js/esm/block-style-stage27c.js
- If module import fails because of file://, MIME, CSP, or host restrictions, the editor should still boot.
- The loader records details in window.LuminaEsModuleDiagnostics instead of raising a startup error.

Test URLs
- index.html?v=stage27c-20260425-1&clearLuminaStorage=1
- diagnostics-stage27c.html?v=stage27c-20260425-1

Optional strict test
- index.html?v=stage27c-20260425-1&strictEsModuleSmoke=1
