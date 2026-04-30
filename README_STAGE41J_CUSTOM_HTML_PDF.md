# Stage 41J — Custom HTML included in PDF export

Changed files:

- `js/esm/export-stage34j.js`
- `js/export-stage24c.js`

What changed:

1. Standalone generated decks no longer skip slides whose blocks use `mode: "custom"`.
2. The standalone PDF generator now includes every slide returned by `deckPayload.slides`.
3. Before rasterizing a slide for PDF, sandboxed custom HTML iframes are replaced in the offscreen clone with a static visible-area snapshot based on the iframe `srcdoc`.
4. The image-first app PDF path also keeps custom blocks instead of replacing them with a placeholder card, then applies the same visible-area snapshot approach before rasterization.
5. A runtime diagnostic marker is exposed:

```js
window.LuminaExportPdfStatus
window.luminaStandalonePdfStatus
```

Expected diagnostic values:

```js
skipCustomSlides: false
customHtmlVisibleSnapshot: true
stage: "stage41j-custom-html-pdf-visible-snapshot-20260429-1"
```

Notes:

- This captures the static HTML/CSS that is visible within the custom block area.
- Scripts, nested iframes, objects, embeds, and event-handler attributes are removed from the PDF snapshot for safety and stability.
- Existing already-exported standalone HTML files such as `Dems/At.html` need to be regenerated from the app after this patch, because their PDF button contains the old embedded exporter code.
