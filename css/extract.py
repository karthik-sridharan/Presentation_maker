#!/usr/bin/env python3
"""
Extract and modularize the single-file Bun.html into a structured project.
"""

import re
import os
from pathlib import Path

def extract_css_sections(html_content):
    """Extract CSS from <style> tags and categorize by purpose."""
    
    # Extract everything between <style> and </style>
    style_match = re.search(r'<style>(.*?)</style>', html_content, re.DOTALL)
    if not style_match:
        return {}, {}, {}
    
    css_content = style_match.group(1)
    
    # Split into sections based on comments and selectors
    styles_css = []  # App shell + editor UI
    slides_css = []  # Slide rendering
    copilot_css = []  # Copilot panel
    
    current_section = styles_css
    
    for line in css_content.split('\n'):
        # Detect slide-related styles
        if '.slide' in line or '.deck-slide' in line or '.preview-frame' in line or '.preview-scale' in line:
            current_section = slides_css
        # Detect copilot-related styles
        elif '.copilot' in line:
            current_section = copilot_css
        # Otherwise it's general app styles
        elif line.strip().startswith('.page') or line.strip().startswith('.panel') or line.strip().startswith('.btn'):
            current_section = styles_css
        
        current_section.append(line)
    
    return {
        'styles': '\n'.join(styles_css),
        'slides': '\n'.join(slides_css),
        'copilot': '\n'.join(copilot_css)
    }

def extract_javascript_sections(html_content):
    """Extract JavaScript and categorize by function."""
    
    # Extract everything between <script> and </script> (excluding external scripts)
    script_sections = re.findall(r'<script>(.*?)</script>', html_content, re.DOTALL)
    
    js_code = '\n\n'.join([s for s in script_sections if 'window.MathJax' not in s])
    
    sections = {
        'utils': [],
        'state': [],
        'renderer': [],
        'editor': [],
        'animate': [],
        'import': [],
        'export': [],
        'copilot': [],
        'main': []
    }
    
    # Simple heuristic-based categorization
    lines = js_code.split('\n')
    
    for line in lines:
        if 'localStorage' in line or 'saveToLocalStorage' in line or 'loadFromLocalStorage' in line:
            sections['state'].append(line)
        elif 'renderPreview' in line or 'renderSlide' in line or 'updatePreview' in line:
            sections['renderer'].append(line)
        elif 'addBlock' in line or 'editBlock' in line or 'figureEditor' in line:
            sections['editor'].append(line)
        elif 'animation' in line.lower() or 'buildin' in line.lower() or 'buildout' in line.lower():
            sections['animate'].append(line)
        elif 'import' in line.lower() or 'markdown' in line.lower() or 'beamer' in line.lower():
            sections['import'].append(line)
        elif 'export' in line.lower() or 'pdf' in line.lower() or 'standalone' in line.lower():
            sections['export'].append(line)
        elif 'copilot' in line.lower() or 'ai' in line.lower() or 'llm' in line.lower():
            sections['copilot'].append(line)
        elif 'escapeHtml' in line or 'debounce' in line or 'UUID' in line:
            sections['utils'].append(line)
        else:
            sections['main'].append(line)
    
    return {k: '\n'.join(v) for k, v in sections.items()}

def extract_html_body(html_content):
    """Extract the HTML body content."""
    body_match = re.search(r'<body[^>]*>(.*?)</body>', html_content, re.DOTALL)
    if body_match:
        return body_match.group(1)
    return ""

def create_index_html(body_content):
    """Create the main index.html file."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Lumina Presenter</title>

<!-- Stylesheets -->
<link rel="stylesheet" href="css/styles.css" />
<link rel="stylesheet" href="css/slides.css" />
<link rel="stylesheet" href="css/copilot.css" />

<!-- External dependencies -->
<script>
window.MathJax = {{
  tex: {{ inlineMath: [['$','$'], ['\\\\(','\\\\)']], displayMath: [['$$','$$'], ['\\\\[','\\\\]']] }},
  svg: {{ fontCache: 'global' }}
}};
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>

<!-- Application modules -->
<script type="module" src="js/main.js"></script>
</head>
<body>
{body_content}
</body>
</html>
"""

def main():
    """Main extraction function."""
    
    # Read the original HTML file
    input_file = '/mnt/user-data/uploads/Bun.html'
    with open(input_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    output_dir = Path('/home/claude/lumina-presenter')
    
    # Extract CSS
    print("Extracting CSS...")
    css_sections = extract_css_sections(html_content)
    
    # Extract JavaScript
    print("Extracting JavaScript...")
    js_sections = extract_javascript_sections(html_content)
    
    # Extract HTML body
    print("Extracting HTML body...")
    body_content = extract_html_body(html_content)
    
    # Create index.html
    print("Creating index.html...")
    index_html = create_index_html(body_content)
    with open(output_dir / 'index.html', 'w', encoding='utf-8') as f:
        f.write(index_html)
    
    print(f"\\n✓ Extracted modular components to {output_dir}")
    print(f"  - index.html created")
    print(f"  - CSS sections identified")
    print(f"  - JavaScript modules identified")
    print("\\n⚠ Note: The original file is very large. Manual review and refinement needed.")
    print("   Suggested next steps:")
    print("   1. Review extracted sections in /home/claude/lumina-presenter")
    print("   2. Manually split the JavaScript into proper ES6 modules")
    print("   3. Test and refine the modular structure")

if __name__ == '__main__':
    main()
