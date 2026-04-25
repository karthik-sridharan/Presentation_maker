# Lumina Presenter Migration Status

Current known-good stage: **Stage 22B — diagnostics / migration cleanup**.

Runtime style remains intentionally conservative:

- Classic browser scripts, not ES modules yet.
- Full flat runtime patches to avoid missing-file/path issues.
- Cache-proof stage filenames.
- Copilot remains inside `legacy-app-stage22b.js` for now.

Successful extractions through this stage:

1. `utils`
2. `block-library`
3. `theme`
4. `presets`
5. `parser`
6. `block-style`
7. `import`
8. `state/autosave`
9. `export`
10. `renderer`
11. `deck/snippet`
12. `file-io`
13. `ui shell`
14. `figure insertion`
15. `diagram editor`
16. `figure tools` — duplicate works; crop still needs deeper review later.
17. `editor selection`
18. `block editor/form synchronization`
19. `commands / keyboard shortcuts`
20. `module manifest / diagnostics alignment`

Stage 22B added `js/module-manifest-stage22b.js`, which is now the source of truth for expected runtime assets and diagnostics checks.

Recommended next steps:

- Stage 23A: stable filename cleanup / alias files, while keeping stage-tagged files for rollback.
- Stage 23B: figure crop repair with tests.
- Stage 24: carefully retry Copilot extraction behind a feature flag.
- Later: convert to ES modules only after the classic-script architecture is fully stable.

## Stage 23A — stable filename cleanup

- Active runtime now loads stable filenames (`js/utils.js`, `js/theme.js`, `js/legacy-app.js`, etc.).
- Stage-tagged files can remain as rollback artifacts.
- No Copilot split, no ES modules, and no intended editor behavior changes.
- Diagnostics live at `diagnostics-stage23a.html` and `diagnostics.html`.


## stage23afix2-20260425-1

Cache-proof repair for Stage 23A. Runtime now loads suffixed stage23afix2 filenames to avoid stale stable `legacy-app.js`.


## Stage 23B — Renderer diagnostics cleanup

- Added `window.LuminaRendererApi` as a narrow diagnostics/API bridge for renderer helpers.
- Updated diagnostics so `rendererFunctionBased` checks the actual renderer API rather than a nonexistent `renderSlide` global.
- Updated the manifest to expect `LuminaRendererApi`.
- No behavior changes intended.
- Copilot remains inside `legacy-app`; ES modules are still deferred.
