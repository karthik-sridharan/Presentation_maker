# Stage 36S Release Notes

Bug fix release for generated standalone HTML presentations.

## Fixed
- Hardened generated-presentation navigation so Previous, Next, and Slides-map selections update the visible slide using explicit active class, hidden state, aria-hidden, and inline display state.
- Added event delegation for slide-map navigation buttons so dynamically rendered map items remain clickable.
- Exposed `window.LuminaStandaloneDeckGo(index)` in generated presentations for quick debugging from the browser console.

## Preserved
- Stage 36Q/36R Copilot custom HTML demos and generated image handling.
- Generated-presentation optional controls, pointer menu, drawing, annotated export, and PDF controls.
