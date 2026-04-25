Lumina Stage 20 Rescue Patch

This is a self-contained stage-20 rescue build. It intentionally does not load local js/*.js or css/*.css files, so it bypasses path/copy/cache problems from stage 21.

Files included:
- index.html
- index-stage20-rescue.html

How to test:
1. Copy/extract these files directly into your lumina-presenter project root.
2. Open:
   http://localhost:8000/index.html?v=stage20rescue-20260425-1&clearLuminaStorage=1

The clearLuminaStorage parameter clears old Lumina-related localStorage keys once, in case a bad autosave is breaking startup. After it works, you can use:
   http://localhost:8000/index.html?v=stage20rescue-20260425-2

This restores the last confirmed working feature set through stage 20, but as a self-contained file rather than modular scripts.
