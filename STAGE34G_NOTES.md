# Stage 34G Notes

Stage 34G promotes the interactive Figure Tools module to live guarded ESM:

```text
LuminaFigureTools -> js/esm/figure-tools-stage34g.js
```

Already-live guarded ESM modules remain active:

```text
LuminaCommands
LuminaDiagramEditor
LuminaFigureInsert
LuminaBlockLibrary
LuminaDeck
LuminaEditorSelection
LuminaFileIo
LuminaBlockEditor
```

Suggested manual checks:

```text
1. Select an inserted figure and verify move/resize/crop/lock-aspect controls.
2. Toggle grid and margins.
3. Serialize figure edits back into the block content/snippet.
4. Confirm imported figures still work after markdown/image import.
5. Confirm diagram editor, block editor, deck actions, and shortcuts still work.
```
