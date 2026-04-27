# Stage 36Q Release Notes

Stage 36Q is a clean deployment bundle based on the stable Stage 36P editor/export behavior.

Changes:

1. Copilot block schema now supports `custom` and `image` modes.
2. `custom` blocks are intended for self-contained HTML demos, animations, simulations, and interactive widgets.
3. `image` blocks are materialized into figure HTML by calling an OpenAI-compatible image generation endpoint.
4. Generated image blocks include alt text and size hints.
5. Copilot includes style context from the active deck/slide and attempts to attach a current-preview screenshot as visual context.
6. Runtime failures during image generation create an explicit placeholder rather than stopping deck generation.
7. This zip is cleaned for deployment and continuation work: no historical migration artifacts or old stage bundles are included.

Preserved from Stage 36P:

- Generated presentation controls fade after 2 seconds of inactivity and stay hidden until real activity.
- Full screen button and Cmd/Ctrl+F shortcut behavior.
- Optional exported-HTML controls selector.
- Pointer menu, draw/export annotated controls, and generated-PDF behavior.
- Undo/redo history.
- Figure selection/editing workflow.
