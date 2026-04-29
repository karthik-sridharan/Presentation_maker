# Stage 41H large-deck target patch — JS only

Overlay these files onto the deployed Presentation_maker folder. This avoids replacing `index.html`.

Files:
- `js/esm/copilot-stage34k.js`
- `js/legacy-app-stage24c.js`

Recommended manual index.html edits:
1. Change the Copilot target input from `max="30"` to `max="100"`.
2. Change the inline planning clamp `Math.min(30,Number(val('copilotSlideCount')||0)||0)` to `Math.min(100,Number(val('copilotSlideCount')||0)||0)`.

The JS files remove the main Copilot generation cap and strengthen instructions to preserve numbered outline slides.
