# Deploy check — Stage 35R

Open:

```text
https://karthik-sridharan.github.io/Presentation_maker/index.html?v=stage35r-20260425-1&clearLuminaStorage=1
```

Manual smoke:

1. Copy diagnostics immediately after load.
2. Confirm `stage`, `diagnosticScriptStage`, and `stageFromWindow` are `stage35r-20260425-1`.
3. Confirm `rightPanelFitStatus.rightPanelFit` is true and `rightPanelFitStatus.rightMinusLeft` is close to `0`.
4. Confirm `previewDeadSpace.verticalDeadSpaceApprox` remains near `0`.
5. Confirm `slideJumpStatus.slideCount` matches `deckOutlineStatus.slideCount` without opening the Jump overlay first.
6. Open **Jump slide** or press `Ctrl/⌘+K`; confirm slide search still opens and jumps correctly.
7. Confirm the **Export health** button is still absent and Build/Assets subtabs scroll with content.
