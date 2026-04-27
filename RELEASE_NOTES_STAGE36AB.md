# Stage 36AB release notes

Fixes the selected-item inspector real font size control.

## Fixed
- The live ESM block-style runtime now preserves `style.fontSize`.
- Preview block/title wrapper styles now emit `--block-font-size` and inline `font-size`.
- Explicit pixel font sizes now override theme/layout font rules in preview.
- Generated/exported HTML keeps explicit pixel font sizes.

## Preserved
- Stage 36Z real font-size storage model.
- Expanded font-family choices.
- Stage 36X notebook/chalkboard theme fixes.
- Stage 36V image generation cap removal.
