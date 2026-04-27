# Deploy Stage 40A

Deploy the folder contents to the GitHub Pages root for `Presentation_maker`.

Recommended test URL:

```text
index.html?v=stage40a-20260427-1&clearLuminaStorage=1
```

After loading, collect diagnostics and confirm:

```text
stage === "stage40a-20260427-1"
indexStageSignature === "index-inline-stage40a-real-deck-planning-mode-20260427-1"
stage40ADeckPlanningStatus.pass === true
stage40ADeckPlanningStatus.workflow includes "Plan"
stage39BAiDrawerUsabilityStatus.pass === true
stage39AAiDrawerWorkflowStatus.pass === true or supersededByStage40APlanningTabs === true
bootErrors.length === 0
capturedErrors.length === 0
```

Manual smoke:

1. Open AI drawer.
2. Confirm tabs: Outline, References, Prompt, Plan, Preview, Apply.
3. Add a prompt or outline.
4. Use **Create editable deck plan** or **Build plan from outline**.
5. Edit a planned slide.
6. Click **Generate preview from plan**.
7. Confirm preview renders without changing the deck until Apply.
