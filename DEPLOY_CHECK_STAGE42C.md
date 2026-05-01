# Stage 42C deploy check

Expected checks:

- `missingAssets` is empty.
- `stage42CThemeDiscoveryStatus.pass === true`.
- `stage42CThemeDiscoveryStatus.themeDesignerVisible === true`.
- `stage42CThemeDiscoveryStatus.themeCopilotVisibleEntry === true`.
- `stage42CThemeDiscoveryStatus.themeControlsMovedToDesign === true`.
- `stage42CThemeDiscoveryStatus.themeCopilotMovedToDesign === true`.
- `stage42CThemeDiscoveryStatus.toolbarThemeRoutesToDesign === true`.

The older Stage 42A/42B JSON theme diagnostics should remain passing.
