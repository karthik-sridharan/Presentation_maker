# Release Notes — Stage 36F

Stage 36F replaces the generated-presentation Draw checkbox with a dropdown-style controls picker.

## Changes

- Removed the long checkbox text that was overflowing in the export panel.
- Added a `Generated HTML controls` dropdown in the Present → Save / export panel.
- Users can choose whether exported HTML includes Slides, Draw, Export annotated slides, Pointer menu, and Generate PDF controls.
- Previous/Next navigation buttons are not configurable and are always included in generated HTML.
- Pointer menu omission now also disables the visible pointer/laser overlay by default.
- Full-presentation and current-slide HTML exports both use the selected generated-HTML controls.

## Compatibility

- Older saved presentations with `enableLiveDraw: true` still load with Draw and Export annotated slides enabled.
- Default export behavior preserves existing optional controls: Slides, Pointer menu, and Generate PDF are selected by default; Draw and Export annotated slides are off by default.
