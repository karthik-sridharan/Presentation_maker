# Stage 35A deployment check

Deploy the changed files at the repository root, then open:

`index.html?v=stage35a-20260425-1&clearLuminaStorage=1`

Expected checks:

1. Top navigation shows exactly five visible workflow tabs: Build, Design, Assets, Copilot, Present.
2. Build opens the slide editor and can still add/update/duplicate/delete slides.
3. Design opens the theme builder; the Animation Tools shortcut opens animation controls while keeping Design highlighted.
4. Assets opens presets; Import, Block Library, and Figure Tools shortcuts route correctly while keeping Assets highlighted.
5. Present opens Save / Export; Import and Help shortcuts work.
6. Diagnostics should still report no missing globals, no missing DOM IDs, and no boot errors.
