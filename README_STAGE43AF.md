Stage 43AF frontend overlay

Clean reset based on known-good Stage 43V frontend.

Apply contents of this overlay folder to the repository root. It intentionally includes the entire js/ runtime folder and index.html so it can overwrite 43X/43Y/43Z/43AD residue.

Fixes retained:
- Stage 43I import preview isolation from clean 43V.
- Selected-block Mathpix flow from clean 43V; no 43AD missing function reference.
- Safer literal escape decoding so LaTeX \text{...} is preserved and earlier ext{...} damage is repaired.

Stage: stage43af-43v-clean-reset-text-command-fix-20260515-1
