# Stage 42L — Import flow restore + narrow AI stale-repair fix

Stage: `stage42l-import-flow-restore-ai-stale-fix-20260511-1`

## What changed

- Restored the import flow baseline from Stage 42J, which was the last build before the broader Stage 42K marker-preservation changes.
- Kept the Stage 42J frontend/backend patch-task AI repair protocol.
- Added only a narrow stale-repair fix: when background AI repair returns, the app now accepts the imported batch if the current slides still match the originally imported slide signatures, even if a temporary batch marker was stripped by normal slide sync.
- If the imported batch really was edited/replaced before AI repair returns, the app now keeps the current deck and shows only a non-scary toast instead of an “AI repair did not complete” warning card.

## Files changed from Stage 42K

- `index.html`
- `js/file-io-stage24c.js`
- `js/esm/file-io-stage34j.js`
- `js/block-editor-stage24c.js`
- `js/esm/block-editor-stage34j.js`

## Backend

No backend change is required beyond the Stage 42J backend patch.
