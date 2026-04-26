# Stage 36B — Touch-safe generated HTML navigation

Build: `stage36b-20260426-1`

## Changes

- Generated standalone HTML presentations now distinguish touch/pen input from desktop mouse input.
- On touch screens, tapping the active slide no longer advances immediately.
- A second nearby tap within a short interval advances the slide or the next animation step.
- The top Next button still advances normally on all devices.
- Desktop/laptop mouse click-to-advance remains enabled.
- Existing Stage 36A fixes are preserved: wrapped export checkbox label and generated HTML laser pointer color/none menu.

## Files changed

- `js/export-stage24c.js`
- `js/esm/export-stage34j.js`
- `index.html` stage/version strings and notes
