# Stage 36AA release notes

This stage changes the selected item inspector from a percentage scale control into a true font-size control.

## Changes
- Selected item inspector now shows **Font size (px)**, not percent/scale.
- New edits store `style.fontSize` as a real CSS pixel size such as `24px`.
- Renderer CSS uses `--block-font-size` directly when present, so the selected text renders at the requested actual size.
- Existing decks remain compatible: old `fontScale` values are still read as a fallback when `fontSize` is not present.
- Reset style clears the explicit font size and returns to theme defaults.
- Generated/exported HTML also preserves and renders true pixel font sizes.
- The expanded font family menu from Stage 36Y is preserved.

## Verification
- Classic block-style, editor-selection, app, and export JS syntax checks passed.
- ESM block-style, editor-selection, and export JS syntax checks passed.
- Zip integrity passes.
