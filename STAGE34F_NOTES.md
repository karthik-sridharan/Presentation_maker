# Stage 34F Notes

Stage 34F promotes two additional workflow modules to live guarded ESM:

- File I/O (`LuminaFileIo`)
- Block Editor (`LuminaBlockEditor`)

The migration still keeps the Stage 24C classic runtime available as shadows/fallbacks. The ESM parity harness remains non-blocking and now waits for the File I/O and Block Editor promotion promises before finalizing the report.

Suggested manual checks:

1. Import markdown/JSON/PowerPoint-style text using append and replace modes.
2. Add, duplicate, move, update, and delete blocks.
3. Switch slide layouts and verify block lists/editor controls stay in sync.
4. Confirm existing deck, preview selection, figure insert, block library, diagram editor, and command shortcuts still work.
