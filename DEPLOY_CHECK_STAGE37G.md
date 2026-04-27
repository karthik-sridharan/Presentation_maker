# Stage 37G Deploy Check

After deploy, run diagnostics and confirm:

- `stageFromWindow` is `stage37g-20260427-1`
- no missing assets
- Copilot core is exposed
- Copilot guard is bound
- `copilotRuntimeStatus.requestInFlight` is false when idle

Manual Copilot spec check:

```markdown
# Deck: PCA intuition
Slides: 4
Style: notebook

## Slide 1: Title
Content:
- PCA as rotation and projection

## Slide 2: Scatter plot
Figure:
Prompt: Clean lecture-style PCA scatter plot with PC1 and PC2 arrows.
Size: wide

## Slide 3: Interactive intuition
Demo:
Prompt: HTML demo with a slider rotating a 2D point cloud and showing variance along an axis.

## Slide 4: Summary
Content:
- PCA finds directions of maximum variance
- Projection compresses data
```

Click **Check deck spec**, then **Generate deck from spec**.
