# Stage 34B notes

Stage 34B does two things:

1. Updates the visible stage/signature labels to `stage34b-20260425-1` and `index-inline-stage34b-live-esm-commands-20260425-1`.
2. Promotes the command registry / keyboard shortcut layer to a guarded live ESM runtime using `js/esm/commands-stage34b.js`.

The classic `js/commands-stage24c.js` is still loaded as a suppressed shadow baseline for parity diagnostics and fallback, but its keydown binding is intentionally suppressed during normal Stage 34B startup. If the live ESM command import fails, Stage 34B dynamically falls back to the classic command script.
