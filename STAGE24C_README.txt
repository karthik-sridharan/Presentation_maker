# Stage 24C — Copilot UX/security hardening

This stage keeps the Stage 24B guarded Copilot architecture but improves user-facing behavior.

## What changed

- Adds a local-testing warning under the OpenAI API key field.
- Warns immediately when the key field contains a URL instead of an `sk-...` key.
- Blocks default OpenAI API calls when the key is missing, looks wrong, or is a page URL.
- Provides friendlier messages for 401, 403, 404, 429, and 5xx API errors.
- Adds `window.LuminaCopilotRuntimeStatus` for diagnostics.
- Keeps Copilot guarded so Copilot errors should not freeze preview/tabs/editor.

## Test URL

```text
https://karthik-sridharan.github.io/Presentation_maker/index.html?v=stage24c-20260425-1&clearLuminaStorage=1
```

## Diagnostics

```text
https://karthik-sridharan.github.io/Presentation_maker/diagnostics-stage24c.html?v=stage24c-20260425-1
```

Expected: no missing assets/globals, `copilotCoreExposed: true`, `copilotGuardBound: true`, `copilotValidationBound: true`.

## Copilot test cases

1. Paste `https://platform.openai.com/account/api-keys` into the key field. You should see a warning and the request should be blocked.
2. Paste a valid `sk-...` or `sk-proj-...` key. The warning should become a local-testing/security reminder.
3. Try a tiny Copilot request. If the key is valid, the result JSON should appear.
4. Try an invalid key. You should get a friendly 401 message without freezing the app.
