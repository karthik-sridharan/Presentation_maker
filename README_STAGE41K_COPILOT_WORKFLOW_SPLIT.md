# Stage 41K — Copilot workflow split

This stage reorganizes the AI workflow without changing the core deck editor.

## What changed

- Review is now a separate workflow tab (`Review`).
- AI connection setup is now a separate workflow tab (`AI setup`).
- The Copilot entry is repurposed as an import/create router.
- The AI drawer now asks the user to choose:
  - Import existing presentation with Copilot
  - Create new deck with Copilot
- Import mode accepts source URLs and uploaded PDF/HTML/text/Markdown/JSON files, then generates a preview deck before apply.
- Create mode keeps the previous prompt/reference/plan/preview/apply flow.
- AI setup fields (model, endpoint, browser key/backend proxy) are removed from the creation flow and moved to the AI setup tab.
- System-level prompt text is split into editable files:
  - `prompts/import_prompt.txt`
  - `prompts/create_prompt.txt`
  - `prompts/system_promp.txt` remains as a legacy fallback.

## Files added

- `css/copilot-workflow-stage41k.css`
- `js/copilot-workflow-stage41k.js`
- `prompts/import_prompt.txt`
- `prompts/create_prompt.txt`

## Files updated

- `index.html`
- `js/esm/copilot-stage34k.js`

## Smoke check

After deployment, open diagnostics and confirm:

```js
window.__LUMINA_STAGE41K_COPILOT_WORKFLOW_STATUS
```

Expected highlights:

- `reviewSeparateTab: true`
- `aiSetupSeparateTab: true`
- `copilotImportCreateRouter: true`
- `tests.pass: true`
- `importPromptFile: "prompts/import_prompt.txt"`
- `createPromptFile: "prompts/create_prompt.txt"`
