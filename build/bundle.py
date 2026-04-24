#!/usr/bin/env python3
"""
Bundle the current modular Lumina Presenter into a single HTML file.

This bundler supports the incremental migration strategy used by the app:
- inline local CSS files referenced by index.html
- preserve external CDN scripts
- inline local JavaScript module entrypoints
- recursively inline static local ES module imports such as:
    import './legacy-app.js';
    import { showToast } from './utils.js';

It intentionally handles the simple static import/export patterns used in this
project, not every possible JavaScript module syntax.
"""

from pathlib import Path
import re

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_FILE = PROJECT_ROOT / "build" / "lumina-presenter-bundle.html"

LOCAL_IMPORT_RE = re.compile(
    r"^\s*import\s+(?:[\s\S]*?\s+from\s+)?[\"'](\.[^\"']+)[\"'];\s*",
    flags=re.MULTILINE,
)


def read_local(rel_path: str) -> str:
    path = (PROJECT_ROOT / rel_path).resolve()
    root = PROJECT_ROOT.resolve()
    if root not in path.parents and path != root:
        raise ValueError(f"Refusing to read outside project: {rel_path}")
    return path.read_text(encoding="utf-8")


def project_relative(path: Path) -> str:
    return path.resolve().relative_to(PROJECT_ROOT.resolve()).as_posix()


def strip_module_exports(js: str) -> str:
    """Convert the subset of ESM exports used here into plain declarations."""
    js = re.sub(r"^\s*export\s+default\s+", "", js, flags=re.MULTILINE)
    js = re.sub(r"^\s*export\s+(async\s+function|function|class)\s+", r"\1 ", js, flags=re.MULTILINE)
    js = re.sub(r"^\s*export\s+(const|let|var)\s+", r"\1 ", js, flags=re.MULTILINE)
    js = re.sub(r"^\s*export\s*\{[^}]*\};?\s*", "", js, flags=re.MULTILINE)
    return js


def bundle_js_module(rel_path: str, seen: set[str] | None = None) -> str:
    """Return a local JS module and its local dependency graph as one script."""
    seen = seen or set()
    abs_path = (PROJECT_ROOT / rel_path).resolve()
    rel_key = project_relative(abs_path)
    if rel_key in seen:
        return f"\n/* skipped duplicate module {rel_key} */\n"
    seen.add(rel_key)

    js = abs_path.read_text(encoding="utf-8")
    chunks: list[str] = []

    def collect_import(match: re.Match) -> str:
        spec = match.group(1)
        imported_abs = (abs_path.parent / spec).resolve()
        imported_rel = project_relative(imported_abs)
        chunks.append(bundle_js_module(imported_rel, seen))
        return ""

    body = LOCAL_IMPORT_RE.sub(collect_import, js)
    body = strip_module_exports(body)
    chunks.append(f"\n/* bundled from {rel_key} */\n{body}\n")
    return "".join(chunks)


def bundle() -> None:
    html = (PROJECT_ROOT / "index.html").read_text(encoding="utf-8")

    def inline_css(match: re.Match) -> str:
        tag = match.group(0)
        href_match = re.search(r'href=["\']([^"\']+)["\']', tag, flags=re.IGNORECASE)
        if not href_match:
            return tag
        href = href_match.group(1)
        if re.match(r"^[a-z]+://", href) or href.startswith("//"):
            return tag
        try:
            css = read_local(href)
        except FileNotFoundError:
            print(f"Warning: CSS file not found: {href}")
            return tag
        return f"<style>\n/* bundled from {href} */\n{css}\n</style>"

    html = re.sub(
        r'<link\b(?=[^>]*\brel=["\']stylesheet["\'])(?=[^>]*\bhref=["\'][^"\']+["\'])[^>]*>',
        inline_css,
        html,
        flags=re.IGNORECASE,
    )

    def inline_js(match: re.Match) -> str:
        tag_open = match.group(1)
        tag = match.group(0)
        src_match = re.search(r'src=["\']([^"\']+)["\']', tag_open, flags=re.IGNORECASE)
        if not src_match:
            return tag
        src = src_match.group(1)
        if re.match(r"^[a-z]+://", src) or src.startswith("//"):
            return tag
        try:
            js = bundle_js_module(src)
        except FileNotFoundError:
            print(f"Warning: JS file not found: {src}")
            return tag
        open_without_src = re.sub(r'\s+src=["\'][^"\']+["\']', '', tag_open, flags=re.IGNORECASE)
        return f"{open_without_src}>\n{js}\n</script>"

    html = re.sub(
        r'(<script\b[^>]*\bsrc=["\'][^"\']+["\'][^>]*)>([\s\S]*?)(</script>)',
        inline_js,
        html,
        flags=re.IGNORECASE,
    )

    OUTPUT_FILE.write_text(html, encoding="utf-8")
    print(f"✓ Bundle created: {OUTPUT_FILE}")
    print(f"  Size: {len(html):,} bytes")


if __name__ == "__main__":
    bundle()
