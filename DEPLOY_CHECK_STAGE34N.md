# Deploy check — Stage 34N

Use:

```text
index.html?v=stage34n-20260425-1&clearLuminaStorage=1
```

Expected diagnostics:

```text
stage: stage34n-20260425-1
esModuleSmokeStatus: passed
missingAssets: []
bootErrors: []
capturedErrors: []
copilotDevPromptFile: prompts/dev.txt
copilotDeckPromptAppliesTo: deck-only
```

After generating a deck from a prompt containing a URL with web search checked, expect:

```text
copilotDeckPromptSource: prompts/dev.txt
copilotDeckPromptStatus: loaded-file
copilotWebSearchEnabled: true
copilotWebSearchStatus: enabled-url-detected
```
