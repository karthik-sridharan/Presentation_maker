# Stage 34G.2 notes — restore visible slide actions

This is not a new ESM migration stage. It is a small UI restoration patch on top of Stage 34G.

Changes:
- Restores a visible **Quick slide actions** panel inside the main **Slides → Slide** editor.
- Adds proxy buttons for: Add as new slide, Update selected slide, Duplicate selected, Delete selected, Clear form.
- Keeps the existing Organize pane and original deck buttons in place.
- Proxy buttons call the existing `window.LuminaAppCommands` deck methods first, then fall back to the original organizer buttons or command registry.
- Adds `window.__LUMINA_SLIDE_ACTIONS_RESTORE` for diagnostics.

Manual test:
1. Open with `?v=stage34g-20260425-2&clearLuminaStorage=1`.
2. Confirm the main Slides tab shows **Quick slide actions** above the slide title/type fields.
3. Click **Add as new slide** and confirm the slide appears in the rail.
4. Select a slide, edit title, click **Update selected slide**.
5. Test duplicate/delete from the same panel.
6. Confirm Stage 34G ESM diagnostics still pass.
