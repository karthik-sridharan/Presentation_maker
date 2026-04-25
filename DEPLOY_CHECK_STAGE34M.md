# Stage 34M deploy check

Stage: `stage34m-20260425-1`

## Goal

Add a repository-editable deck-only Copilot prompt file.

## Upload paths

Upload these files to the repository root:

- `index.html`
- `js/copilot-stage34k.js`
- `js/esm/copilot-stage34k.js`
- `js/legacy-app-stage24c.js`
- `prompts/deck.txt`
- `DEPLOY_CHECK_STAGE34M.md`
- `RELEASE_NOTES_STAGE34M.md`
- `RELEASE_FILES_STAGE34M.json`

## Test URL

`index.html?v=stage34m-20260425-1&clearLuminaStorage=1`

## Expected diagnostics

- `stage: "stage34m-20260425-1"`
- `esModuleSmokePassed: true`
- `liveRuntimeStatus.copilot.source: "esm"`
- `copilotDeckPromptFile: "prompts/deck.txt"`
- `copilotDeckPromptAppliesTo: "deck-only"`
- `missingAssets: []`
- `bootErrors: []`
- `capturedErrors: []`

## Manual Copilot check

1. Edit `prompts/deck.txt`, or leave the default file as-is.
2. Use **Draft current slide** and confirm this deck prompt file is **not** needed for the single-slide flow.
3. Use **Generate full deck** and confirm diagnostics show `copilotDeckPromptSource` / `copilotDeckPromptStatus` after the request starts.
