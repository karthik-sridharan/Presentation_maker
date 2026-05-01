# Lumina Presenter Stage 42D — theme discovery + font-size text-entry hotfix

Deploy the contents of this folder to your `Presentation_maker` GitHub Pages root. Then open:

`index.html?v=stage42d-20260501-1&clearLuminaStorage=1`

## Fixes

- Makes the Theme Designer and Theme Copilot entry points explicit in the Design tab.
- Forces the top toolbar Theme button to route to the Design tab / Theme Designer.
- Adds `stage42DThemeDiscoveryStatus` diagnostics so the report proves the Stage 42D script actually loaded.
- Fixes the right-panel selected-item font-size field: typing/backspace no longer immediately coerces empty input to `20px`, and the value commits on Enter, blur, or change.
- Adds `stage42DFontSizeEntryStatus` diagnostics.

## Manual checks

1. Open DesignTheme + motion. Confirm Theme Designer and Theme Copilot buttons are visible.
2. Click the top toolbar Theme button. It should open/scroll to Theme Designer.
3. Select a preview block. In the right inspector, click Font size and type `24`; Backspace should not jump to arbitrary values. Press Enter or blur to apply.
4. Run diagnostics and confirm `stageFromWindow`, `indexStageSignature`, `stage42DThemeDiscoveryStatus.pass`, and `stage42DFontSizeEntryStatus.pass`.
