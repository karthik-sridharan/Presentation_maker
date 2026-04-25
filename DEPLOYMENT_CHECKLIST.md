# GitHub Pages Deployment Checklist

Use this checklist whenever applying a new Lumina Presenter patch.

## 1. Copy files to the correct root

For flat patches, copy/extract files directly into the repository root:

```text
Presentation_maker/index.html
Presentation_maker/css/...
Presentation_maker/js/...
Presentation_maker/diagnostics-....html
```

Avoid accidentally creating:

```text
Presentation_maker/Presentation_maker/js/...
```

or:

```text
Presentation_maker/lumina-presenter/js/...
```

## 2. Check local paths before committing

Run:

```bash
find js -maxdepth 1 -type f | sort | tail -50
find css -maxdepth 1 -type f | sort | tail -20
ls -1 diagnostics*.html
```

## 3. Commit and push

```bash
git status
git add .
git commit -m "Apply Lumina migration stage"
git push
```

Copying files locally is not enough for the live GitHub Pages URL.

## 4. Wait for GitHub Pages deployment

If GitHub Pages is slow to update, wait briefly and then use a fresh query string:

```text
https://karthik-sridharan.github.io/Presentation_maker/index.html?v=stage-name-try2
```

## 5. Verify direct asset URLs

If the app says a file failed to load, open that file directly in the browser.

Examples:

```text
https://karthik-sridharan.github.io/Presentation_maker/js/legacy-app-stage23b2.js?v=check
https://karthik-sridharan.github.io/Presentation_maker/css/styles-stage23b2.css?v=check
```

Expected: JavaScript/CSS text.

Bad signs:

- 404 page.
- Old file contents.
- HTML instead of JavaScript/CSS.

## 6. Run diagnostics

Use the current diagnostics page:

```text
https://karthik-sridharan.github.io/Presentation_maker/diagnostics-stage23b2.html?v=check
```

The key fields should be:

```json
{
  "missingAssets": [],
  "missingGlobals": [],
  "missingDomIds": [],
  "basicUiBound": true,
  "previewHasContent": true,
  "bootErrors": [],
  "capturedErrors": []
}
```

## 7. Smoke test the app

Minimum manual checks:

1. Preview renders.
2. Files / Slides / Insert / Design / Copilot tabs switch.
3. Hide/show rail works.
4. Add/update/duplicate/delete slides.
5. Select a block and edit text/style.
6. Import Markdown or Beamer outline.
7. Export presentation JSON or HTML.
8. Figure insertion and duplication still work.

## 8. Avoid unnecessary localStorage clearing

Only use `clearLuminaStorage=1` when testing recovery from bad saved state:

```text
index.html?v=stage-name&clearLuminaStorage=1
```

For normal testing, omit it to make sure autosave still works.
