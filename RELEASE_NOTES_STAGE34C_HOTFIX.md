# Stage 34C Hotfix 1 — non-blocking live ESM import fallback

This hotfix keeps Stage 34C’s live ESM command and diagram-editor migration, but fixes the failure path:

- Optional live ESM import failures no longer call `luminaBootError`.
- Commands first try `commands-stage34c.js`, then `commands-stage34b.js`, then activate the captured classic Stage 24C shadow.
- Diagram editor first tries `diagram-editor-stage34c.js`, then `diagram-editor-stage34b.js`, then preserves the already-loaded classic Stage 24C runtime.
- Optional import failures are recorded as diagnostics/warnings instead of blocking startup.

Expected clean path still reports ESM sources for both commands and diagram editor. If an asset is stale/missing on GitHub Pages, the app should remain usable and report `classic-preserved` or previous-stage ESM fallback.
