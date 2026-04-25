# Stage 34H notes

Stage 34H promotes the remaining stable core ES modules in a single guarded step while preserving the classic Stage 24C app shell.

## Promoted in this stage

- Core helper factories: `utils`, `block-style`, `parser`, `import`, `state`, `theme`, and `presets`.
- Renderer bridge: `LuminaRendererApi` is created from `js/esm/renderer-stage34h.js` and its global helper functions are bridged onto `window` for live preview/export callers.
- Existing Stage 34G live ESM modules remain active: commands, diagram editor, figure insert, block library, deck, editor selection, file I/O, block editor, and figure tools.
- Export, UI shell, legacy app bootstrap, and Copilot remain classic-script guarded runtime.

## Safety behavior

Every Stage 34H core promotion captures the Stage 24C classic object first. If any optional ESM import fails, the classic object is restored and the report records a diagnostic warning instead of blocking app startup.
