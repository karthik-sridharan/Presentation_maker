Stage 42C editable AI import prompts

ai_import_review_prompt.txt is now a conservative import-repair prompt.
It tells the AI to preserve slide count, block ids, image assets, and freeform layout, and only repair garbled math plus small placement/sizing issues.

ai_import_repair_prompt.txt is the one-pass retry prompt used if the first response is invalid JSON or still contains obvious broken math artifacts.

These files are loaded by the frontend at import time, so users can edit them without rebuilding the app.
