# Lumina Presenter — Stage 36C clean deployment

Build: `stage36c-20260426-1`

Deploy the contents of this folder to static hosting. For a cache-busted smoke test use:

`index.html?v=stage36c-20260426-1&clearLuminaStorage=1`

## Includes

- Stage 36C `index.html` shell
- Runtime JS/CSS assets referenced by the shell
- Guarded ESM assets used by the current loader
- Copilot prompt files
- Stage 36C release notes, deploy check, and file manifest

## Change summary

Stage 36C keeps the Stage 36A export checkbox and generated pointer color controls, keeps Stage 36B touch-safe generated HTML navigation, and changes the generated HTML pointer dropdown option from `Black` to `Pointer`. The new `Pointer` mode displays a classic black mouse-pointer arrow instead of a black laser dot.
