# Stage 39B Deploy Check

Manual checks:

1. Open the AI drawer from the center dock or top toolbar.
2. Confirm the drawer shows five steps: Outline, References, Prompt, Preview, Apply.
3. Upload an outline file and confirm its name appears in the Outline step.
4. Upload text/PDF reference files and confirm their names appear in the References step.
5. Confirm the generation context summary shows URL/text/PDF counts.
6. Confirm Apply buttons are disabled before a valid preview exists.
7. Generate a slide/deck preview and confirm the Preview card renders and Apply buttons unlock.
8. Apply to current slide, append, or replace only from the Apply step.
9. Confirm Advanced still contains JSON/import/export/AI settings/debug controls.
10. Run diagnostics and confirm `stage39BAiDrawerUsabilityStatus.pass` is true.
