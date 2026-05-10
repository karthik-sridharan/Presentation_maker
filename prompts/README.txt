Stage 41R editable AI import prompts

The AI-assisted import prompt lives in:
  prompt/ai_import_review_prompt.txt

The repair prompt lives in:
  prompt/ai_import_repair_prompt.txt

Stage 41R adds stricter math/figure preservation. The frontend sends the AI a compact per-slide summary with sourceText, mathCandidates, and figureCandidates. If AI drops equations or figures, the frontend automatically requests one repair pass using prompt/ai_import_repair_prompt.txt.

Do not put API keys or bearer tokens in prompt files.
