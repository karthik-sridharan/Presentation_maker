# Deploy Stage 39A

Deploy the contents of this folder to the existing GitHub Pages / static host location.

Recommended URL after deploy:

```text
index.html?v=stage39a-20260427-1&clearLuminaStorage=1
```

## Primary validation

After loading the page, copy the diagnostic report and check:

```text
stage === "stage39a-20260427-1"
indexStageSignature === "index-inline-stage39a-ai-drawer-workflow-polish-20260427-1"
stage39AAiDrawerWorkflowStatus.pass === true
stage38QAiDrawerAdvancedStatus.pass === true
stage38RDiagnosticsAlignmentStatus.pass === true
stage38OCenterActionsStatus.pass === true
```

## Manual smoke test

1. Click **AI drawer** from the center dock or top toolbar.
2. Confirm the drawer tabs read: Outline, References, Prompt, Preview, Apply.
3. Add a small prompt and click **Generate slide preview**.
4. Confirm the deck does not change until an Apply button is pressed.
5. Open **Preview**, confirm the generated-slide preview renders.
6. Open **Apply**, test **Apply to current slide** or **Append as new slides**.
7. Open **Advanced**, confirm JSON/raw import/export controls/AI settings remain out of the main authoring flow.
