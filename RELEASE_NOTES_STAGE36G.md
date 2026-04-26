# Release Notes — Stage 36G

Stage 36G is a bug-fix release for the generated-HTML controls picker introduced in Stage 36F.

## Changes

- Hardened export-time state capture so Draw and Export annotated slides are read directly from the live dropdown checkboxes when saving HTML.
- Current-slide and full-deck HTML exports both embed the selected optional controls.
- Adjusted the generated HTML toolbar so optional controls start from the left of the top row instead of being clipped by right-aligned overflow.
- Previous/Next navigation remains always included and not configurable.
- Preserved Stage 36E undo/redo and Stage 36B/36C/36D generated-presentation behavior.

## Compatibility

- Older saved presentations with `enableLiveDraw: true` still load with Draw and Export annotated slides enabled.
- Default export behavior remains: Slides, Pointer menu, and Generate PDF are selected by default; Draw and Export annotated slides are off by default.
