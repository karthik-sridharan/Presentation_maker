# Lumina Presenter Stage 36G Deploy Package

Stage: `stage36g-20260426-1`

This folder is a deploy-ready static build. Upload the folder contents to GitHub Pages or another static host.

## What changed in Stage 36G

- Fixed the Stage 36F dropdown bug where Draw and Export annotated slides could be checked in the editor but omitted from generated HTML.
- Export code now reads the live control checkboxes directly at save time.
- Generated HTML toolbar alignment now starts from the left side of the top toolbar row so selected controls are not hidden by right-aligned overflow.
- Previous and Next buttons in exported HTML remain always included.
- Preserved Stage 36E editor undo/redo and Stage 36D/36C generated-presenter behavior.

## Deploy

Open with a cache-busting URL such as:

`index.html?v=stage36g-20260426-1&clearLuminaStorage=1`
