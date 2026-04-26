# Deploy check — Stage 35N

Deploy the root contents of this patch over the repository root. Then open:

`https://karthik-sridharan.github.io/Presentation_maker/index.html?v=stage35n-20260425-1&clearLuminaStorage=1`

Expected diagnostic highlights:

- stage: `stage35n-20260425-1`
- esModuleSmokePassed: `true`
- visualContrastSmokePassed: `true`
- featurePolishSummary.exportDiagnostics: `true`
- featurePolishSummary.outlineNavigator: `true`
- exportDiagnosticsStatus.exportDiagnosticsButton: `true`
- deckOutlineStatus.outlinePanel: `true`

Manual smoke checklist:

1. Add or import 3–5 slides.
2. Confirm the Deck outline panel appears under the slide rail.
3. Click outline entries and confirm the selected slide changes.
4. Add a section-divider slide and confirm later slides group under that section.
5. Open Jump slide or press Ctrl/⌘+K and confirm Stage 35L still works.
6. Open Export health. Confirm the probe runs and copy report works.
7. Try Save presentation JSON, Save current slide JSON, Save current slide, and Save full presentation.
8. If Safari reports Download Failed, open Export health and copy the report.
