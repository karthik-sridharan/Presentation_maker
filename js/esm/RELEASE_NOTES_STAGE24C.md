# Release Notes — Stage 24C Stable Checkpoint

## Release summary

Stage 24C is the current stable checkpoint for the Lumina Presenter migration. The app is still a browser-only HTML presentation maker, but most of the original monolith has been separated into classic-script modules with diagnostics guarding startup.

## Highlights

- Modular classic-script runtime through the main editor/render/import/export layers.
- Diagnostics and manifest system for missing files, globals, DOM ids, startup errors, and app health.
- Keyboard shortcuts / command registry.
- Renderer API bridge for diagnostics.
- Guarded Copilot binding: Copilot loads separately after the main app, so failures should not freeze preview/tabs/editor.
- Copilot API-key validation and friendlier error handling.

## Known issues

- OpenAI API key is still browser-side. This is acceptable for local testing only, not public production use.
- Figure crop behavior still needs refinement.
- Copilot core still partly lives in `legacy-app-stage24c.js`; only guarded binding/validation moved out.
- The repo may contain many historical stage files. Stage 25A documents the current runtime but does not delete old files.

## Recommended production direction

Before exposing Copilot publicly, add a backend proxy that keeps the OpenAI API key server-side. The browser should call your backend, and the backend should call OpenAI.
