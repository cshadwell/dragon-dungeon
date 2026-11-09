"""Stamp the whole module graph consistently after edits; prevents mixed cached releases."""
from pathlib import Path
import hashlib,re
root=Path(__file__).resolve().parents[1]/'dist'
files=sorted(root.glob('*.js'))
def clean(s):return re.sub(r'([.]js|[.]css)\?v=[a-zA-Z0-9_-]+',r'\1',s)
sources={p:clean(p.read_text()) for p in files}
html=root/'index.html';html_source=clean(html.read_text());styles=sorted(root.glob('*.css'))
version=hashlib.sha256((''.join(p.name+sources[p] for p in files)+html_source+''.join(p.name+p.read_text() for p in styles)).encode()).hexdigest()[:12]
for p,s in sources.items():
 s=re.sub(r"((?:from\s+|import\s*\(\s*)['\"]\./[^'\"]+\.js)(['\"])",rf'\1?v={version}\2',s)
 p.write_text(s)
html.write_text(re.sub(r'(src|href)="([^"?]+\.(?:js|css))"',lambda m:f'{m[1]}="{m[2]}?v={version}"',html_source))
print('Stamped release:',version)

# Standalone playtests share the release graph, without entering the main app.
for extra in [root/"ogre-playtest.html",root/"elf-playtest.html",root/"wizard-playtest.html",root/"dragon-room.html"]:
 if extra.exists():
  source=clean(extra.read_text())
  source=re.sub(r'(src|href)="([^"?]+\.(?:js|css))"',lambda m:f'{m[1]}="{m[2]}?v={version}"',source)
  extra.write_text(source)
