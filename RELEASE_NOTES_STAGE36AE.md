# Stage 36AE release notes

Adds Copilot reference-material support on top of Stage 36AC.

## Added
- Reference material section in Copilot panel.
- Upload multiple text-based reference files (`.txt`, `.md`, `.json`, `.csv`, `.tex`, `.html`).
- Paste reference text directly.
- Add reference URLs, one per line.
- `Check references` and `Clear references` controls.
- Copilot prompt now includes reference URLs and uploaded/pasted reference text as grounding material.
- With web search enabled and OpenAI endpoint selected, reference URLs are passed to the Responses API with web search enabled for deck/spec generation.

## Preserved
- Stage 36AC deck-spec / outline generation.
- Demo requests become custom HTML blocks.
- Figure requests become generated image blocks.
- Stage 36AB explicit font-size rendering fixes.

## Stage 36AE addition

- Copilot reference uploads now accept PDF files in addition to text-based notes.
- Uploaded PDFs are stored in-memory as base64 file inputs and attached to OpenAI Responses requests when the default OpenAI endpoint is used.
- Reference URL entries ending in `.pdf` are also attached as PDF file inputs for the default OpenAI Responses endpoint.
- The reference checker now reports uploaded PDF count and PDF URL count.
