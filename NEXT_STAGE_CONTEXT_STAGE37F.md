# Next-stage context: Stage 37F

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
`index.html?v=stage37f-20260427-1&clearLuminaStorage=1`

## Stage 37F context

Copilot reference material now supports PDFs. The browser reads uploaded PDFs as base64 and keeps them out of the pasted-text textarea. During Copilot deck/deck-spec generation, default OpenAI Responses requests add uploaded PDFs as `input_file` entries with `filename` and `file_data`; PDF URLs are added as `input_file` entries with `file_url`.
