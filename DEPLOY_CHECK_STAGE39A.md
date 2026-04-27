# Stage 39A deploy check

Use:

```text
https://karthik-sridharan.github.io/Presentation_maker/index.html?v=stage39a-20260427-1&clearLuminaStorage=1
```

Expected diagnostic markers:

```text
stage39AAiDrawerWorkflowStatus.pass === true
stage39AAiDrawerWorkflowStatus.previewOnlyGeneration === true
stage39AAiDrawerWorkflowStatus.applyOnlyMutation === true
stage39AAiDrawerWorkflowStatus.tests.fiveStepTabs === true
stage39AAiDrawerWorkflowStatus.tests.legacyAutoApplyHidden === true
```

Expected UI:

- AI drawer has five steps: Outline, References, Prompt, Preview, Apply.
- The Prompt step has preview-only generation buttons.
- Generated results appear in Preview before applying.
- Apply step has explicit apply/append/replace deck buttons.
- Advanced remains the place for raw JSON, diagnostics, export controls, AI settings, and raw imports.
