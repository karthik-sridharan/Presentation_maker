# Deploy check — Stage 38R

Deploy `index.html` and the existing asset folders as usual.

After loading with a cache-busting query string, copy diagnostics and confirm:

```text
stage === "stage38r-20260427-1"
diagnosticScriptStage === "stage38r-20260427-1"
stage38RDiagnosticsAlignmentStatus.pass === true
stage38OCenterActionsStatus.pass === true
stage38OCenterActionsStatus.tests.copilotPresent === true
stage38OCenterActionsStatus.tests.aiDrawerAcceptedAsCopilot === true
stage38QAiDrawerAdvancedStatus.pass === true
bootErrors.length === 0
capturedErrors.length === 0
```

Manual smoke check:

1. Confirm the center quick dock shows `AI drawer` rather than `Copilot`.
2. Click `AI drawer` and confirm the AI drawer opens.
3. Confirm Advanced still contains JSON/import/export/AI settings/diagnostics.
4. Confirm no old `Outline` or `Update slide` button reappears in the center dock.
