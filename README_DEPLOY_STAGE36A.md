# Lumina Presenter — Stage 36A clean deployment

Build: `stage36a-20260426-1`

This archive is based on the cleaned Stage 35Z deployment and adds two focused presentation-export improvements:

1. The export checkbox label for “In generated presentation, add a Draw button on every slide” now wraps inside its panel instead of overflowing.
2. Generated HTML presentations now include a Pointer dropdown in the slide action controls with Red, Blue, Green, Black, and None options. None hides the laser pointer.

## Deploy

Upload the contents of this folder to the static host/root used by the presentation maker. Open with cache busting after upload:

`index.html?v=stage36a-20260426-1&clearLuminaStorage=1`

## Contents

- Stage 36A `index.html` shell
- Runtime CSS/JS assets required by the app
- Guarded ESM assets used by the live app
- Copilot prompt text files
- Stage 36A release notes, deploy check, and file manifest

## Smoke checks

See `DEPLOY_CHECK_STAGE36A.md`.
