# Stage 36A deploy check

Open:

`index.html?v=stage36a-20260426-1&clearLuminaStorage=1`

Expected:

- `window.LUMINA_STAGE` is `stage36a-20260426-1`.
- The export panel checkbox text wraps inside its panel.
- Saving a full presentation with the Draw export checkbox enabled produces HTML with Draw, Export annotated slides, Generate PDF, and a Pointer dropdown.
- In the generated HTML, Pointer supports Red, Blue, Green, Black, and None.
- Choosing None hides the laser pointer. Re-selecting a color restores the pointer in that color.
