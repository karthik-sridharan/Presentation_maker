# Stage 35H — Late Template/Tab Contrast Fix

This patch keeps the Stage 35B/35C visual polish but moves the template contrast repair to the end of the document head and re-appends it at runtime after load.

## Fix
- Core presets and Layout templates no longer rely on an early CSS block that can be overridden later.
- Preset subtabs now use classic blue/gray inactive colors and dark-blue active state with white text.
- Template cards use light blue/gray backgrounds with dark navy text, not white-on-pale combinations.
- Diagnostic reports now include `templateContrastComputed` to show the computed color/background for the visible preset controls.

## Expected stage
`stage35h-20260425-1`
