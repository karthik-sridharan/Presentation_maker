Stage 18B figure tools fix

Copy/extract this flat patch directly into the existing lumina-presenter project root.

Fixes:
- Figure duplication now matches the literal \begin{figurehtml} wrapper correctly.
- Crop now restores the selected figure after preview rebuild, so repeated crop/uncrop actions remain reliable.
- Duplication saves the current interactive figure state before cloning, so the duplicate reflects the current crop/size/position.

Test URL:
http://localhost:8000/index.html?v=stage18b-20260424-1

Main checks:
1. Insert a figure.
2. Select it and click duplicate.
3. Select a figure and toggle crop on/off multiple times.
4. Resize/crop/duplicate and refresh to confirm persistence.
