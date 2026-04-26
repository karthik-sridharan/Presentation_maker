# Stage 35A — Workflow navigation cleanup

This patch reorganizes the visible editor navigation into five workflow modes while preserving the existing pane IDs, DOM IDs, command bindings, and legacy routing hooks.

## Visible top-level workflows

- Build — slide editor, content blocks, and organizer shortcuts
- Design — theme builder and animation tools
- Assets — presets, import tools, block library, and figure tools
- Copilot — slide/deck generation
- Present — save, load, export, and help shortcuts

## Compatibility notes

- The legacy panes (files, edit, presets, styles, animate, tools, slides, copilot, help) still exist.
- Hidden legacy tab buttons remain in the DOM so existing data-left-tab-proxy logic keeps working.
- A routing patch keeps the correct visible workflow tab highlighted even when opening a hidden legacy pane.

## Included carry-forward files

This patch also includes the Stage 34N Copilot prompt/reference files (`js/copilot-stage34k.js`, `js/esm/copilot-stage34k.js`, `prompts/dev.txt`, and `prompts/deck.txt`) so deploying Stage 35A does not drop the prompt-file and reference-following improvements.
