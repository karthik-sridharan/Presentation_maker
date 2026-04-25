# Release Notes — Stage 34K

Stage 34K is a conservative Copilot migration release.

Functional changes from 34J:

- Copilot core now has a live guarded ESM implementation at `js/esm/copilot-stage34k.js`.
- Copilot UI binding now uses `js/copilot-stage34k.js` so click handlers pick up the live ESM core after it replaces the classic fallback.
- The classic Copilot runtime remains captured and usable as fallback.
- Diagnostics now expect 24 required classic assets and 20 optional ESM assets, including Copilot.
- The stage marker is `stage34k-20260425-1`.

This stage does not change the OpenAI request format or the visible Copilot UI. It only changes how the Copilot core is loaded and guarded.
