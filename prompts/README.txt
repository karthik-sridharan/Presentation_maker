Stage 41U editable AI import prompts

The AI-assisted import prompt lives in:
  prompt/ai_import_review_prompt.txt

The repair prompt lives in:
  prompt/ai_import_repair_prompt.txt

Stage 41U keeps the Stage 41R math/figure preservation prompt, fixes the external prompt examples so JSON-visible LaTeX backslashes are shown as double backslashes, and adds a safe fallback: if AI cleanup still drops equations/figures after one repair pass, the app loads the source-extracted backend slides instead of leaving the user with no slides.

Do not put API keys or bearer tokens in prompt files.

Stage 41V note: AI-assisted import now includes a deterministic preserve-and-merge pass. The prompt should still ask the AI to preserve source math/figures, but the app will reinsert missing source math/figure blocks if validation detects that they were dropped.
