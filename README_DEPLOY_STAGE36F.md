# Lumina Presenter Stage 36F Deploy Package

Stage: `stage36f-20260426-1`

This folder is a deploy-ready static build. Upload the folder contents to GitHub Pages or another static host.

## What changed in Stage 36F

- Replaced the broken generated-HTML Draw checkbox label with a compact dropdown-style controls picker.
- Exported HTML can now independently include or omit these optional controls:
  - Slides button
  - Draw button
  - Export annotated slides button
  - Pointer menu
  - Generate PDF button
- Previous and Next buttons in exported HTML remain always included.
- Current-slide HTML export now honors the same generated-HTML controls selection as full-deck export.
- Preserved Stage 36E editor undo/redo and Stage 36D/36C generated-presenter behavior.

## Deploy

Open with a cache-busting URL such as:

`index.html?v=stage36f-20260426-1&clearLuminaStorage=1`
