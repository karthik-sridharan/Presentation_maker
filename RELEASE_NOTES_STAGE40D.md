# Stage 40D — Plan board UX tightening

Stage 40D builds on Stage 40C with an additive Plan-tab UX layer for the AI planning workspace.

## Changes

- Adds a Plan board above the slide cards with storyboard-first navigation.
- Adds a 4-slide starter plan CTA for empty plans.
- Adds quick add buttons for a normal slide, section divider, and demo/visual slide.
- Adds per-slide intent summaries for goal, evidence, visual, and notes before the editable fields.
- De-emphasizes advanced JSON while keeping the JSON recovery/editing path intact.
- Preserves Stage 40A plan-before-generation, Stage 40B validation/gating, and Stage 40C prompt-action dedup.

## Safety properties

- Preview generation remains preview-only.
- Apply remains the only deck mutation step.
- No MutationObserver or command-registry hooks are added by Stage 40D.
- Stage 40D is an additive inline layer and can be removed independently.
