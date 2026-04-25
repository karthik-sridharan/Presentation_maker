# Stage 34I

Stage 34I promotes two more browser helpers to guarded live ES modules:

- Export helpers (standalone slide/deck HTML, JSON save, PDF-ready helpers) via `js/esm/export-stage34i.js`.
- Small UI shell helpers (rail cleanup/tabs) via `js/esm/ui-stage34i.js`.

The classic Stage 24C export/UI scripts are still loaded first and captured as shadows. If either ESM import fails, the classic runtime is preserved and diagnostics record the fallback. Legacy app bootstrap and Copilot remain classic.
