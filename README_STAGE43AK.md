Stage 43AK verified image-blob source guard

Built from clean Stage 43V frontend. Fixes:
- Blocks stale preview figure sync from replacing imported image-blob patch sources across slides.
- Adds preview owner/slide-switch guard.
- Preserves LaTeX \text{...} by not decoding \t in LaTeX commands as tabs.
