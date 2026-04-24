# Migration Status

## Stage 2 complete

This project now uses a modular entrypoint while preserving the working app behavior.

### What changed in stage 2

- `index.html` now loads `js/main.js` instead of `js/legacy-app.js` directly.
- `js/main.js` is now a safe compatibility entrypoint that imports the working app.
- Shared utility functions were removed from `legacy-app.js` and imported from `js/utils.js`.
- Pure theme helpers were extracted into `js/theme.js`:
  - `normalizeTheme`
  - `buildSlideStyleForTheme`
  - `beamerPresetTheme`
  - `styleClassForTheme`
- `legacy-app.js` still owns the DOM-bound editor workflow, but it is smaller and now depends on real modules.
- `build/bundle.py` now recursively inlines local ES module imports, so the modular app can still be bundled into one standalone HTML file.

### Current runtime path

```text
index.html
  -> js/main.js
      -> js/legacy-app.js
          -> js/utils.js
          -> js/theme.js
```

### Recommended next migration pass

Move the reusable block-library workflow out of `legacy-app.js` into a dedicated module, because it is relatively self-contained:

- `builtinLibraryEntries`
- `loadBlockLibrary`
- `persistBlockLibrary`
- `renderBlockLibrary`
- `saveCurrentBlockToLibrary`
- `insertSelectedLibraryBlock`
- `deleteSelectedLibraryBlock`

The cleanest version of that pass is to create `js/block-library.js` and pass it a small adapter object for editor callbacks such as `currentBlockFromEditor`, `currentColumnName`, `blockArray`, `renderBlockList`, `buildPreview`, and `scheduleAutosave`.

### Things intentionally not done yet

- `state.js`, `renderer.js`, `editor.js`, `export.js`, `import.js`, and `copilot.js` still contain scaffold/stub code from the target architecture.
- The main production behavior still lives mostly in `legacy-app.js`.
- No large behavioral rewrite was attempted in this stage.
