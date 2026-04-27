# Stage 38O deploy check

Open:

```text
index.html?v=stage38o-20260427-1&clearLuminaStorage=1
```

Expected:

```text
stage38OCenterActionsStatus.tests.pass: true
stage38OCenterActionsStatus.tests.removedUpdate: true
stage38OCenterActionsStatus.tests.removedOutline: true
stage38OCenterActionsStatus.tests.duplicatePresent: true
stage38OCenterActionsStatus.tests.copilotPresent: true
stage38OCenterActionsStatus.tests.delegateBound: true
```

Manual smoke:

1. Add a few slides; left rail scrolls without resizing the center or right columns.
2. Center **Duplicate** duplicates the selected slide.
3. Center **Copilot** opens the Copilot drawer/pane.
4. Center dock no longer shows **Update slide** or **Outline**.
