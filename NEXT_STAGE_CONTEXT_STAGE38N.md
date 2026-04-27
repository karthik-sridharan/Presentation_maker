# Next stage context from Stage 38N

Stage 38N isolates layout heights across the slide rail, center preview, and inspector. The important principle is: left/right content should scroll internally and should not force the center preview toolbar/quick-dock/viewport to resize.

If further tuning is needed, adjust only the Stage 38N CSS block near the end of `index.html`, especially:
- `--stage38n-toolbar-height`
- `.stage35c-quick-dock` and `.stage35c-quick-dock .btn`
- `.preview-wrap`, `.preview-header`, `.preview-viewport`, and `.preview-frame`

Avoid reintroducing MutationObserver-based live sync. Preserve Stage 38I safe command-only deck sync.
