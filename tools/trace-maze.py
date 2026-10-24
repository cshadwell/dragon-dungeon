from PIL import Image, ImageDraw
from collections import deque
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
im=Image.open('/Users/cshadwell/Desktop/maze.png').convert('RGB')
# Image aligns to a 14-pixel lattice, beginning 4 pixels inside the outer border.
# Black wall blocks occupy an entire lattice tile; fine annotations occupy much less.
w,h=59,46
rows=[];ratios=[]
for y in range(h):
 row=''
 for x in range(w):
  samples=[im.getpixel((4+x*14+dx,4+y*14+dy)) for dy in range(1,13) for dx in range(1,13)]
  dark=sum(max(c)<75 for c in samples)/len(samples)
  row+='#' if dark>.60 else '.'
  if .25<dark<.85:ratios.append((x,y,round(dark,2)))
 rows.append(row)
start=(58,45)
walk={(x,y) for y,r in enumerate(rows) for x,c in enumerate(r) if c=='.'}
seen={start};q=deque([start])
while q:
 x,y=q.popleft()
 for p in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
  if p in walk and p not in seen:seen.add(p);q.append(p)
print('size',w,h,'walkable',len(walk),'reachable',len(seen),'unreachable',sorted(walk-seen),'ambiguous',ratios)
(root/'dist/maze-data.js').write_text('// Traced from the supplied maze.png. # wall; . corridor. Annotations ignored.\nexport const MAZE_ROWS='+json.dumps(rows,indent=2)+';\nexport const MAZE_START="58,45";\nexport const MAZE_WIDTH=59, MAZE_HEIGHT=46;\n')
scale=10
out=Image.new('RGB',(w*scale,h*scale),'black');d=ImageDraw.Draw(out)
for x,y in walk:d.rectangle((x*scale,y*scale,(x+1)*scale-1,(y+1)*scale-1),fill='white' if (x,y) in seen else 'orange')
d.rectangle((start[0]*scale,start[1]*scale,(start[0]+1)*scale-1,(start[1]+1)*scale-1),fill='red')
out.save(root/'maze-trace-check.png')
