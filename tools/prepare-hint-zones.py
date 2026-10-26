"""Trace the supplied 10px-per-cell zone overlay without changing maze geometry."""
from pathlib import Path
from PIL import Image
import json,re
root=Path(__file__).resolve().parents[1]
im=Image.open(root/'art-review/2026-10-25/hint-zones/source.png').convert('RGB')
assert im.size==(590,460)
maze=json.loads('['+re.search(r'MAZE_ROWS=\[(.*?)\];',(root/'dist/maze-data.js').read_text(),re.S).group(1)+']')
palette={'O':(229,198,137),'W':(94,110,204),'E':(108,156,103),'D':(166,96,167)}
rows=[]
for y,row in enumerate(maze):
 traced=''
 for x,cell in enumerate(row):
  rgb=im.getpixel((x*10+5,y*10+5))
  key=min(palette,key=lambda k:sum((a-b)**2 for a,b in zip(rgb,palette[k])))
  # Include the four darker encounter-dot colors within the surrounding zones.
  colored=max(rgb)-min(rgb)>25 and rgb!=(255,0,0)
  traced+=key if cell=='.' and colored else '.'
 rows.append(traced)
(root/'dist/hint-zone-data.js').write_text('// Traced from the user-approved colored map; only walkable cells are zoned.\nexport const HINT_ZONE_ROWS='+json.dumps(rows,indent=2)+';\n')
print({k:sum(r.count(k) for r in rows) for k in palette})
