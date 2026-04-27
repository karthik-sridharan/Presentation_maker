# Stage 38C deploy check

After deploying, open:

`index.html?v=stage38c-20260427-2&clearLuminaStorage=1`

Recommended manual checks:

1. Confirm the top toolbar appears and the inspector status chip says `Slide`.
2. Click slide background: inspector should show `Slide`.
3. Click title or normal text block: inspector should switch to `Text` and keep typography controls working.
4. Click an SVG/image figure: inspector should switch to `Figure`; Edit/Duplicate/Bring front/Crop/Reset should use the existing figure bridge.
5. Click a custom HTML/demo block: inspector should switch to `Demo`.
6. Click the slide rail: inspector should switch to `Deck`.
7. Copy diagnostics and confirm `stage38CSelectionAwareInspectorStatus.pass === true`.
