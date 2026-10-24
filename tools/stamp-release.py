"""Stamp the whole module graph consistently after edits; prevents mixed cached releases."""
from pathlib import Path
import hashlib,re
root=Path(__file__).resolve().parents[1]/'dist'
files=sorted(root.glob('*.js'))
def clean(s):return re.sub(r'([.]js|[.]css)\?v=[a-zA-Z0-9_-]+',r'\1',s)
sources={p:clean(p.read_text()) for p in files}
html=root/'index.html';html_source=clean(html.read_text());css=root/'style.css'
version=hashlib.sha256((''.join(p.name+sources[p] for p in files)+html_source+css.read_text()).encode()).hexdigest()[:12]
for p,s in sources.items():p.write_text(re.sub(r"(from\s+['\"]\./[^'\"]+\.js)(['\"])",rf'\1?v={version}\2',s))
html.write_text(html_source.replace('src="app.js"',f'src="app.js?v={version}"').replace('href="style.css"',f'href="style.css?v={version}"'))
print('Stamped release:',version)
