# Stage 40C Deploy Check

Load with:

```
index.html?v=stage40c-20260427-1&clearLuminaStorage=1
```

Manual smoke test:

1. Open **AI drawer**.
2. Go to **Prompt**.
3. Confirm there is exactly one card titled **Generate without changing the deck**.
4. Switch between Outline / References / Prompt / Plan / Preview / Apply several times.
5. Reopen AI drawer and re-run diagnostics.
6. Confirm the Prompt tab still has exactly one such card.

Diagnostic expectations:

```json
{
  "stage": "stage40c-20260427-1",
  "stage40CPromptDedupStatus": {
    "pass": true,
    "promptActionBlockCount": 1,
    "duplicatePromptButtonIds": []
  }
}
```
