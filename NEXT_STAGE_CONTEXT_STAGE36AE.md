# Next-stage context: Stage 36AE

Use this clean deploy bundle as the next baseline.

Important new Copilot fields:
- `#copilotReferenceFile` multiple file upload for text-based references.
- `#copilotReferenceUrls` newline-separated URL references.
- `#copilotReferenceText` pasted/uploaded reference text.
- `#copilotCheckRefsBtn` and `#copilotClearRefsBtn`.

Main Copilot functions added/exposed:
- `getCopilotReferenceText()`
- `setCopilotReferenceText(text, append)`
- `getCopilotReferenceUrls()`
- `setCopilotReferenceUrls(text)`
- `getCopilotReferenceMaterial()`
- `summarizeCopilotReferences()`

Test URL:
`index.html?v=stage36ae-20260427-1&clearLuminaStorage=1`

## Stage 36AE context

Copilot reference material now supports PDFs. The browser reads uploaded PDFs as base64 and keeps them out of the pasted-text textarea. During Copilot deck/deck-spec generation, default OpenAI Responses requests add uploaded PDFs as `input_file` entries with `filename` and `file_data`; PDF URLs are added as `input_file` entries with `file_url`.
