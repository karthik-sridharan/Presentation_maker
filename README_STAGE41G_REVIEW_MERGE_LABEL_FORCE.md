# Stage 41G review merge label hotfix

This patch fixes the **visible Remake merge-checkbox panel** so each checkbox shows:

- a mini slide thumbnail
- the slide number
- the slide title
- slide type and a short content summary when available

## Option A: replacing existing Stage 41E hotfix files

Copy these files into your deployed app, preserving paths:

- `js/copilot-review-remake-controls-hotfix.js`
- `css/copilot-review-remake-controls-hotfix.css`

This works if your `index.html` already loads those Stage 41E hotfix files.

## Option B: force-load as a new add-on

If your current fix is inline in `index.html` or you are not sure the Stage 41E files are loaded, copy these files too:

- `js/copilot-review-merge-label-force.js`
- `css/copilot-review-merge-label-force.css`

Then add these two tags **after** the existing review CSS/JS tags in `index.html`:

```html
<link rel="stylesheet" href="css/copilot-review-merge-label-force.css?v=stage41g-review-merge-label-force-1" />
<script src="js/copilot-review-merge-label-force.js?v=stage41g-review-merge-label-force-1"></script>
```

## Diagnostic global

After opening Review deck and setting a slide to Remake, check:

```js
window.__LUMINA_STAGE41G_REVIEW_MERGE_LABEL_STATUS
```

Expected: `pass: true`, and `choicesWithTitles` / `choicesWithThumbs` should equal `choiceCount`.
