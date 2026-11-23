#!/usr/bin/env python3
"""Build documents.html from every .md file inside document_md/.

Each markdown file is rendered as a stacked section headed by its file name,
with a sticky table-of-contents listing all files.

Usage:  python3 build_documents.py
Requires: pip install markdown
"""
import html
import pathlib
import re
from datetime import datetime, timezone

import markdown

ROOT = pathlib.Path(__file__).resolve().parent
MD_DIR = ROOT / "document_md"
OUTPUT = ROOT / "documents.html"

md_extensions = ["tables", "fenced_code", "codehilite", "toc", "sane_lists"]


def slugify(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", pathlib.Path(name).stem.lower()).strip("-")
    return s or "doc"


def title_of(text: str, fallback: str) -> str:
    for line in text.splitlines():
        line = line.strip()
        if line.startswith("#"):
            return line.lstrip("#").strip()
        if line:
            return fallback
    return fallback


def build():
    md_files = sorted(MD_DIR.glob("*.md"))
    if not md_files:
        raise SystemExit(f"No .md files found in {MD_DIR}")

    toc_items = []
    sections = []
    for f in md_files:
        raw = f.read_text(encoding="utf-8")
        body = markdown.markdown(raw, extensions=md_extensions)
        slug = slugify(f.name)
        title = title_of(raw, f.name)
        mtime = datetime.fromtimestamp(f.stat().st_mtime, tz=timezone.utc)
        updated = mtime.strftime("%d %b %Y")
        anchor = f"doc-{slug}"
        toc_items.append(
            f'<a class="toc-link" href="#{anchor}">'
            f'<span class="toc-name">{html.escape(f.name)}</span></a>'
        )
        sections.append(
            f'<section class="doc-section" id="{anchor}">'
            f'<header class="doc-header">'
            f'<span class="doc-file">{html.escape(f.name)}</span>'
            f'<span class="doc-title">{html.escape(title)}</span>'
            f'<span class="doc-meta">updated {updated}</span>'
            f"</header>"
            f'<div class="doc-body">{body}</div>'
            f"</section>"
        )

    generated = datetime.now(timezone.utc).strftime("%d %b %Y, %H:%M UTC")

    page = f"""<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <script>(function(){{var K="rn-theme-manual",D=K+"-date";function h(){{var n=new Date(),u=n.getTime()+n.getTimezoneOffset()*60000,i=new Date(u+19800000);return i.getHours();}}function d(){{var n=new Date(),u=n.getTime()+n.getTimezoneOffset()*60000,i=new Date(u+19800000);return i.getFullYear()+"-"+i.getMonth()+"-"+i.getDate();}}var m=localStorage.getItem(K),day=localStorage.getItem(D),today=d();document.documentElement.setAttribute("data-theme",(m&&day===today)?m:((h()>=6&&h()<19)?"light":"dark"));}})()</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Documents · Rahul Naik</title>
<meta name="description" content="All project documents in one place — markdown files rendered for easy reading.">
<link rel="stylesheet" href="assets/css/theme.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
<style>
body {{
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  margin: 0;
}}

.page-wrap {{ padding-top: 60px; }}

.page-head {{
  max-width: 1100px;
  margin: 0 auto;
  padding: 3.5rem 2rem 1.5rem;
}}

.page-eyebrow {{
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--cyan);
  margin-bottom: 0.8rem;
}}

.page-title {{
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  margin: 0 0 0.5rem;
}}

.page-sub {{
  color: var(--text2);
  font-size: 0.95rem;
  margin: 0;
}}

.layout {{
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem 2rem 5rem;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 2.5rem;
  align-items: start;
}}

/* ── TOC ── */
.toc {{
  position: sticky;
  top: 84px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.2rem;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}}

.toc-label {{
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.8rem;
}}

.toc-link {{
  display: block;
  padding: 0.45rem 0.6rem;
  border-radius: 6px;
  color: var(--text2);
  text-decoration: none;
  font-size: 0.82rem;
  font-family: var(--font-mono);
  border-left: 2px solid transparent;
  transition: all 0.2s;
  overflow-wrap: anywhere;
}}

.toc-link:hover {{
  color: var(--cyan);
  background: var(--s2);
  border-left-color: var(--cyan);
}}

.toc-link.active {{
  color: var(--cyan);
  background: var(--s2);
  border-left-color: var(--cyan);
}}

/* ── Sections ── */
.docs {{
  min-width: 0;
}}

.doc-section {{
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  scroll-margin-top: 90px;
}}

.doc-header {{
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.6rem 1rem;
  padding-bottom: 1.2rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}}

.doc-file {{
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--cyan);
  background: var(--s2);
  border: 1px solid var(--border);
  padding: 0.25rem 0.7rem;
  border-radius: 6px;
}}

.doc-title {{
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
}}

.doc-meta {{
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--muted);
  letter-spacing: 0.08em;
}}

/* ── Markdown body ── */
.doc-body {{ line-height: 1.7; font-size: 0.95rem; color: var(--text); }}
.doc-body h1, .doc-body h2, .doc-body h3 {{
  font-family: var(--font-display);
  color: var(--text);
  scroll-margin-top: 90px;
}}
.doc-body h1 {{ font-size: 1.6rem; margin: 2rem 0 1rem; }}
.doc-body h2 {{ font-size: 1.25rem; margin: 1.8rem 0 0.8rem; padding-bottom: 0.4rem; border-bottom: 1px solid var(--border); }}
.doc-body h3 {{ font-size: 1.05rem; margin: 1.5rem 0 0.6rem; }}
.doc-body p {{ margin: 0.8rem 0; color: var(--text2); }}
.doc-body a {{ color: var(--cyan); text-decoration: none; }}
.doc-body a:hover {{ text-decoration: underline; }}
.doc-body ul, .doc-body ol {{ color: var(--text2); padding-left: 1.4rem; }}
.doc-body li {{ margin: 0.35rem 0; }}
.doc-body code {{
  font-family: var(--font-mono);
  font-size: 0.82em;
  background: var(--s2);
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 0.1rem 0.4rem;
  color: var(--green);
}}
.doc-body pre {{
  background: var(--bg1);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.1rem;
  overflow-x: auto;
}}
.doc-body pre code {{ background: none; border: none; padding: 0; color: var(--text); }}
.doc-body blockquote {{
  margin: 1rem 0;
  padding: 0.5rem 1.2rem;
  border-left: 3px solid var(--cyan);
  background: var(--s2);
  border-radius: 0 8px 8px 0;
  color: var(--text2);
}}
.doc-body table {{
  width: 100%;
  border-collapse: collapse;
  margin: 1.2rem 0;
  font-size: 0.85rem;
  display: block;
  overflow-x: auto;
}}
.doc-body th {{
  background: var(--s2);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--cyan);
  text-align: left;
}}
.doc-body th, .doc-body td {{
  border: 1px solid var(--border);
  padding: 0.55rem 0.8rem;
  vertical-align: top;
}}
.doc-body tr:nth-child(even) td {{ background: var(--s2); }}
.doc-body hr {{ border: none; border-top: 1px solid var(--border); margin: 2rem 0; }}
.doc-body img {{ max-width: 100%; border-radius: 8px; }}

.footer-note {{
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem 3rem;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--muted);
  letter-spacing: 0.1em;
}}

@media (max-width: 900px) {{
  .layout {{ grid-template-columns: 1fr; }}
  .toc {{ position: static; max-height: none; }}
  .doc-section {{ padding: 1.4rem; }}
  .doc-meta {{ margin-left: 0; }}
}}
</style>
</head>
<body>

<div class="hexgrid"></div>
<div class="glow-overlay" style="background:radial-gradient(ellipse 60% 40% at 20% 20%,rgba(0,212,255,0.03),transparent)"></div>

<nav class="site-nav">
  <a class="nav-logo" href="/index.html">RN <span class="dot"></span></a>
  <div class="nav-links" id="nav-links">
    <a href="/index.html">Home</a>
    <div class="nav-item">
      <button class="nav-btn" aria-haspopup="true">Projects <span class="nav-arrow">▾</span></button>
      <div class="nav-dropdown">
        <a href="/projects/loaniq.html">LoanIQ — Underwriter Agent</a>
        <a href="/projects/salesforce-agent.html">Salesforce AI Agent</a>
        <a href="/projects/findocqa.html">FinDoc QA</a>
        <a href="/projects/finbot.html">FinBot</a>
        <a href="/projects/wfo-risk.html">WFO Risk Engine</a>
        <hr>
        <a href="/projects/evolution.html">Technical Journey</a>
      </div>
    </div>
    <div class="nav-item">
      <button class="nav-btn" aria-haspopup="true">Study <span class="nav-arrow">▾</span></button>
      <div class="nav-dropdown">
        <a href="/study/index.html">Study Hub</a>
        <a href="/study/guide.html">Complete Guide</a>
        <a href="/study/checklist.html">Interview Checklist</a>
        <a href="/study/scenarios.html">100 Scenarios</a>
        <a href="/study/architecture.html">Architecture Map</a>
      </div>
    </div>
    <a href="/documents.html" class="active">Documents</a>
    <a href="/index.html#contact">Contact</a>
  </div>
  <div class="nav-right">
    <div class="theme-toggle" role="button" aria-label="Toggle theme">
      <div class="toggle-track"><div class="toggle-thumb"></div></div>
      <span class="theme-label">LIGHT</span>
    </div>
    <button class="hamburger" id="hamburger" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<div class="page-wrap">

  <div class="page-head">
    <div class="page-eyebrow">// documentation</div>
    <h1 class="page-title">Documents</h1>
    <p class="page-sub">{len(md_files)} markdown documents, rendered for easy reading — newest stacked below with their file names.</p>
  </div>

  <div class="layout">
    <nav class="toc" aria-label="Document list">
      <div class="toc-label">Files ({len(md_files)})</div>
      {chr(10).join(toc_items)}
    </nav>

    <main class="docs">
      {chr(10).join(sections)}
    </main>
  </div>

  <div class="footer-note">generated {generated} · rahulnaik99.github.io/documents.html</div>
</div>

<a href="https://api.whatsapp.com/send/?phone=919591522079" target="_blank" rel="noopener" class="wa-float" aria-label="Chat on WhatsApp">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>

<script src="assets/js/main.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script>
  document.querySelectorAll('pre code').forEach(function(el) {{ try {{ hljs.highlightElement(el); }} catch(e) {{}} }});
  // Highlight active TOC entry while scrolling
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc-link'));
  var sections = links.map(function(l) {{ return document.querySelector(l.getAttribute('href')); }});
  function onScroll() {{
    var y = window.scrollY + 120, idx = 0;
    sections.forEach(function(s, i) {{ if (s && s.offsetTop <= y) idx = i; }});
    links.forEach(function(l, i) {{ l.classList.toggle('active', i === idx); }});
  }}
  window.addEventListener('scroll', onScroll, {{ passive: true }});
  onScroll();
</script>
</body>
</html>
"""
    OUTPUT.write_text(page, encoding="utf-8")
    print(f"Built {OUTPUT.name} with {len(md_files)} documents:")
    for f in md_files:
        print(f"  - {f.name}")


if __name__ == "__main__":
    build()
