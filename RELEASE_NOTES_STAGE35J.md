# Stage 35J — Solid contrast fallbacks

This stage fixes the contrast audit failures reported by Stage 35I while preserving the current visual design.

## What changed

- Stage identity updated to `stage35j-20260425-1`.
- Keeps the Stage 35H/35I classic blue-gray palette and layout polish.
- Adds a late runtime CSS guard that gives gradient controls explicit `background-color` fallbacks.
- Targets the failing audit categories:
  - workflow tabs
  - active workflow tabs
  - active preset subtabs
  - quick action dock primary buttons
- Keeps the diagnostic contrast audit in place.

## Why

The controls visually had gradient backgrounds, but computed `backgroundColor` was transparent because CSS gradients live in `background-image`. The audit therefore measured white text against the white parent panel. Stage 35J preserves the gradients and adds solid fallback colors so both rendering and diagnostics have a real contrast background.

## Behavior

No behavior changes. No layout changes.
