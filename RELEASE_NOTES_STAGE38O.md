# Stage 38O — Center action dock cleanup

- Removes the center-panel **Update slide** and **Outline** buttons from the quick dock.
- Rebinds center-panel **Add slide**, **Duplicate**, **Copilot**, **Present/export**, and **Hide rail** through a final delegated action layer so the buttons keep working after layout polish.
- Makes the remaining center-panel quick buttons larger and fixed-size while preserving independent left/center/right panel heights.
- Keeps the preview frame slightly larger with reduced preview chrome padding.

Diagnostic target: `stage38OCenterActionsStatus.tests.pass === true`.
