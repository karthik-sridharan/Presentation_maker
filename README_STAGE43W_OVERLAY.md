# Stage 43W frontend overlay

Copy these files over the current `Presentation_maker` frontend root. This overlay includes the full Stage 43V selected-block Mathpix fixes plus the Stage 43W fix for `\text{...}` being displayed or saved as `ext{...}`.

Primary fix: literal-tab decoding now uses `\\t(?![A-Za-z{])`, so LaTeX commands like `\text`, `\times`, `\top`, and `\theta` are preserved.
