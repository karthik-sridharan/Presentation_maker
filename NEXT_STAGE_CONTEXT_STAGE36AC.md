# Next Stage Context — Stage 36AC

Use `lumina-presenter-stage36ac-clean-deploy.zip` as the baseline.

## Key addition
Copilot now has a Deck Spec / Outline area that lets the user paste or upload a file describing a deck. The parser converts text/Markdown/JSON into a DeckPlan and the new `generateCopilotDeckFromSpec()` path asks Copilot to satisfy the plan.

## Important files
- `index.html` — Copilot UI includes spec file input, spec textarea, Check deck spec, and Generate deck from spec.
- `js/copilot-stage34k.js` — guarded UI binding for spec upload/check/generate actions.
- `js/legacy-app-stage24c.js` — main implementation: `parseCopilotDeckSpecText`, `generateCopilotDeckFromSpec`, DeckPlan prompting.
- `js/esm/copilot-stage34k.js` — ESM bridge exposes the new methods and delegates to the classic implementation when available.

## Manual smoke test
1. Open with `index.html?v=stage36ac-20260427-1&clearLuminaStorage=1`.
2. Open Copilot.
3. Paste a spec with `Slides: 4`, `Slide 1:`, one `Figure:`, and one `Demo:`.
4. Click **Check deck spec** and confirm the status reports slide specs, figures, and demos.
5. Click **Generate deck from spec** and confirm it creates exactly the requested number of slides.
6. Confirm Demo requirements produce custom HTML blocks and Figure requirements produce image blocks.
