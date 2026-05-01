# Stage 42D release notes

This is a deployment-visible hotfix for two UI issues:

- Theme Designer / Theme Copilot visibility: Stage 42D updates the app stage signature and loads the discovery script under a Stage 42D asset name so stale Stage 41/42C deployments are obvious in diagnostics.
- Font-size entry: the selected-item inspector font-size control now behaves like a normal editable field. Empty intermediate input is no longer treated as `20px`, and typed values are committed only on Enter, blur, or change.
