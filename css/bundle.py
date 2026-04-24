#!/usr/bin/env python3
"""
Bundle all modular files back into a single HTML file for distribution.

Usage:
    python bundle.py

Output:
    lumina-presenter-bundle.html
"""

from pathlib import Path
import re

def read_file(filepath):
    """Read file content."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"Warning: {filepath} not found")
        return ""

def bundle():
    """Create single-file bundle."""
    
    project_root = Path(__file__).parent.parent
    
    print("📦 Bundling Lumina Presenter...")
    
    # Read CSS files
    styles_css = read_file(project_root / 'css' / 'styles.css')
    slides_css = read_file(project_root / 'css' / 'slides.css')
    copilot_css = read_file(project_root / 'css' / 'copilot.css')
    
    # Read JS files
    utils_js = read_file(project_root / 'js' / 'utils.js')
    state_js = read_file(project_root / 'js' / 'state.js')
    renderer_js = read_file(project_root / 'js' / 'renderer.js')
    editor_js = read_file(project_root / 'js' / 'editor.js')
    animate_js = read_file(project_root / 'js' / 'animate.js')
    import_js = read_file(project_root / 'js' / 'import.js')
    export_js = read_file(project_root / 'js' / 'export.js')
    copilot_js = read_file(project_root / 'js' / 'copilot.js')
    main_js = read_file(project_root / 'js' / 'main.js')
    
    # Read HTML body
    index_html = read_file(project_root / 'index.html')
    
    # Extract body content
    body_match = re.search(r'<body[^>]*>(.*?)</body>', index_html, re.DOTALL)
    body_content = body_match.group(1) if body_match else ""
    
    # Combine all CSS
    combined_css = f"""
{styles_css}

{slides_css}

{copilot_css}
""".strip()
    
    # Combine all JS (remove import/export statements)
    def strip_modules(js_code):
        # Remove import statements
        js_code = re.sub(r'import\s+.*?from\s+[\'"].*?[\'"];?\s*', '', js_code)
        # Remove export statements
        js_code = re.sub(r'export\s+(function|const|let|var|class|default)\s+', r'\1 ', js_code)
        return js_code
    
    combined_js = f"""
// === utils.js ===
{strip_modules(utils_js)}

// === state.js ===
{strip_modules(state_js)}

// === renderer.js ===
{strip_modules(renderer_js)}

// === editor.js ===
{strip_modules(editor_js)}

// === animate.js ===
{strip_modules(animate_js)}

// === import.js ===
{strip_modules(import_js)}

// === export.js ===
{strip_modules(export_js)}

// === copilot.js ===
{strip_modules(copilot_js)}

// === main.js ===
{strip_modules(main_js)}
""".strip()
    
    # Create bundled HTML
    bundled_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Lumina Presenter</title>
<style>
{combined_css}
</style>

<script>
window.MathJax = {{
  tex: {{ inlineMath: [['$','$'], ['\\\\(','\\\\)']], displayMath: [['$$','$$'], ['\\\\[','\\\\]']] }},
  svg: {{ fontCache: 'global' }}
}};
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
</head>
<body>
{body_content}

<script>
{combined_js}
</script>
</body>
</html>
"""
    
    # Write output
    output_file = project_root / 'build' / 'lumina-presenter-bundle.html'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(bundled_html)
    
    print(f"✓ Bundle created: {output_file}")
    print(f"  Size: {len(bundled_html):,} bytes")
    
if __name__ == '__main__':
    bundle()
