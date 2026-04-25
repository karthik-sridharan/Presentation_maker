# Release notes: Stage 34H

## Summary

Stage 34H is a larger migration step. It promotes the stable core helper modules and the renderer bridge to guarded live ESM, while leaving export/UI/legacy/copilot classic.

## User-visible behavior

- Slide-action controls restored in Stage 34G2 remain present.
- Preview rendering should continue to look identical, now with the live ESM renderer bridge active.
- Diagnostics now expose runtime sources for utils, block style, parser, import helpers, state, theme, presets, and renderer.

## Validation target

A healthy diagnostic report should show:

- `stage: stage34h-20260425-1`
- `esModuleDiagnostics.ok: true`
- `liveRuntimeStatus.core.ok: true`
- `rendererRuntimeSource: esm:js/esm/renderer-stage34h.js`
- no missing assets, globals, DOM ids, boot errors, or captured errors.
