# Stage 36A — Export checkbox wrap + generated HTML pointer menu

Build: `stage36a-20260426-1`

## Fixed

- The export option checkbox label now stays inside the export panel by giving `.inline-checks` and its labels proper `min-width`, wrapping, and checkbox flex sizing.

## Added

- Generated standalone HTML presentations now include a `Pointer` dropdown in each slide's top action controls.
- Pointer choices are: Red, Blue, Green, Black, and None.
- Selecting None immediately hides the pointer and disables the cursor-hiding laser behavior until another pointer color is selected.
- Selecting a color synchronizes the dropdown state across all slides in the generated presentation.

## Files changed

- `css/styles-stage24c.css`
- `js/export-stage24c.js`
- `js/esm/export-stage34j.js`
- `index.html`

## Verification

- JS syntax checks passed for both export helper files using `node --check`.
- Generated HTML was checked from the ESM export API for the new `laser-select` dropdown and `None` option.
