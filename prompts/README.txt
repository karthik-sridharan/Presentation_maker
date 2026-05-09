Lumina AI import prompts

These editable text files are loaded by the browser during AI-assisted PDF/PPT/PPTX import.

- ai_import_review_prompt.txt: main prompt used after backend extraction.
- ai_import_repair_prompt.txt: repair prompt used if the first AI JSON fails validation.

You can edit these files in GitHub and redeploy GitHub Pages. Reload Presentation Maker before importing.
Do not put API keys or secrets in these prompt files.

The repair prompt supports these placeholders:
{{PROBLEMS}}        validation errors found by Lumina
{{PREVIOUS_OUTPUT}} AI JSON/text output that needs repair
