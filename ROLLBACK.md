# Lumina Presenter Rollback Map

Current recommended rollback point: **Stage 23B2**.

Stage 24A is documentation-only, so rolling back from Stage 24A usually means doing nothing to runtime files.

## Known-good runtime

Use the Stage 23B2 runtime files:

```text
index.html
css/styles-stage23b2.css
js/diagnostics-stage23b2.js
js/module-manifest-stage23b2.js
js/utils-stage23b2.js
js/block-library-stage23b2.js
js/theme-stage23b2.js
js/presets-stage23b2.js
js/parser-stage23b2.js
js/block-style-stage23b2.js
js/import-stage23b2.js
js/state-stage23b2.js
js/export-stage23b2.js
js/renderer-stage23b2.js
js/deck-stage23b2.js
js/file-io-stage23b2.js
js/ui-stage23b2.js
js/figure-insert-stage23b2.js
js/diagram-editor-stage23b2.js
js/figure-tools-stage23b2.js
js/editor-selection-stage23b2.js
js/block-editor-stage23b2.js
js/legacy-app-stage23b2.js
js/commands-stage23b2.js
```

Diagnostics page:

```text
diagnostics-stage23b2.html
```

## How to confirm rollback worked

Open:

```text
https://karthik-sridharan.github.io/Presentation_maker/index.html?v=stage23b2-rollback-check
```

Then open diagnostics:

```text
https://karthik-sridharan.github.io/Presentation_maker/diagnostics-stage23b2.html?v=stage23b2-rollback-check
```

Expected diagnostic essentials:

```json
{
  "missingAssets": [],
  "missingGlobals": [],
  "missingDomIds": [],
  "basicUiBound": true,
  "previewHasContent": true,
  "rendererFunctionBased": true,
  "uiFunctionBased": true,
  "manifestLoaded": true,
  "commandsBound": true,
  "bootErrors": [],
  "capturedErrors": []
}
```

## If GitHub Pages still serves an old file

Use a new query string:

```text
?v=rollback-YYYYMMDD-N
```

Also verify individual asset URLs directly. For example:

```text
https://karthik-sridharan.github.io/Presentation_maker/js/legacy-app-stage23b2.js?v=rollback-check
https://karthik-sridharan.github.io/Presentation_maker/js/renderer-stage23b2.js?v=rollback-check
https://karthik-sridharan.github.io/Presentation_maker/css/styles-stage23b2.css?v=rollback-check
```

If direct asset URLs 404, the files were not committed/pushed or landed in the wrong folder.

## Stages to avoid using as rollback points

These stages had known startup or cache/file-path problems:

- Stage 6 Copilot split.
- Stage 21 Copilot split.
- Stage 23A stable filename attempt, unless fully repaired.
- Single-file Stage 20 rescue builds, which were only temporary recovery attempts.

## Safe rollback principle

When in doubt, roll back to the last stage with clean diagnostics, not merely the last stage that visually loaded.
