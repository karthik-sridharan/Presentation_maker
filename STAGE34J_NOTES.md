# Stage 34J

Stage 34J promotes two more browser helpers to guarded live ES modules:

- Export helpers (standalone slide/deck HTML, JSON save, PDF-ready helpers) via `js/esm/export-stage34j.js`.
- Small UI shell helpers (rail cleanup/tabs) via `js/esm/ui-stage34j.js`.

The classic Stage 24C export/UI scripts are still loaded first and captured as shadows. If either ESM import fails, the classic runtime is preserved and diagnostics record the fallback. Legacy app bootstrap and Copilot remain classic.
