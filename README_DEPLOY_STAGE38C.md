# Lumina Presenter — Stage 38C deploy package

Entry point: `index.html`

Stage 38C keeps the Stage 38A canvas-first layout, carries forward the Stage 38B top toolbar, and adds a toolbar polish pass plus the new selection-aware inspector reset.

Deploy by uploading the full folder contents to the same static host path. Use a cache-busting query such as:

`index.html?v=stage38c-20260427-2&clearLuminaStorage=1`
