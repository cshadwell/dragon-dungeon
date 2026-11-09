"""Validate static references and repository-subpath safety without changing files."""
import re,sys
from pathlib import Path
from urllib.parse import urlsplit,unquote
root=Path(sys.argv[1]).resolve();errors=[];checked=0
patterns=[r'''(?:src|href)=["']([^"']+)["']''',r'''(?:from\s*|import\s*|new Audio\(|loadImage\(|url\()["']([^"']+)["']''']
for p in root.rglob('*'):
 if p.suffix not in {'.html','.js','.css'}:continue
 text=p.read_text()
 for pattern in patterns:
  for value in re.findall(pattern,text):
   if value.startswith(('#','http:','https:','data:','mailto:','blob:')):continue
   if value.startswith('/'):errors.append(f'{p.relative_to(root)}: absolute path {value}');continue
   if not value or any(c in value for c in '{}$'):continue
   target=(p.parent/unquote(urlsplit(value).path)).resolve()
   if not target.is_relative_to(root) or not target.exists():errors.append(f'{p.relative_to(root)}: missing {value}')
   checked+=1
assert (root/'index.html').is_file()
assert "name:'CHAZ'" in (root/'dragon.js').read_text()
if errors:raise SystemExit('\n'.join(errors))
print(f'Pages path check passed: {checked} static references; CHAZ confirmed.')
