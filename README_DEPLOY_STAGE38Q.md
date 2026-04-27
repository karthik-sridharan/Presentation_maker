# Stage 38Q deploy notes

Stage 38Q combines the next two UI cleanup tasks in one guarded pass:

- Copilot is moved into a dedicated AI drawer with separate Outline, References, Generate, and Preview & apply tabs.
- JSON, raw JSON import, generated-HTML export controls, AI model/API settings, and diagnostics are moved into an Advanced drawer.

Open with:

```text
index.html?v=stage38q-20260427-1&clearLuminaStorage=1
```

Primary diagnostics:

```text
stage38QAiDrawerAdvancedStatus.pass === true
stage38OCenterActionsStatus.pass === true
stage38PDiagnosticsAlignmentStatus.pass === true
```
