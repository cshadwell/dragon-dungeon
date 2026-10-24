"""Isolate poses from the user's transparent v2 PNG sheets without pixel changes.
Requires Pillow. Alpha is supplied by the artist: no background removal/resampling.
"""
from pathlib import Path
from collections import deque
import json
from PIL import Image
root=Path(__file__).resolve().parents[1]/'dist/assets/ogre'
meta={}
for sheet,kind,anchors,scale in [('character','idle',[360,815,1270],.29),('attack','attack',[590,995,1390],.32),('snort','snort',[590,995,1390],.32),('swing','swing',[320,925,1545],.42)]:
 im=Image.open(root/f'source-{sheet}-v2.png').convert('RGBA');w,h=im.size;px=im.load();seen=bytearray(w*h);components=[]
 for y in range(h):
  for x in range(w):
   if seen[y*w+x] or px[x,y][3]==0:continue
   seen[y*w+x]=1;q=deque([(x,y)]);points=[]
   while q:
    ax,ay=q.popleft();points.append((ax,ay))
    for nx,ny in [(ax-1,ay),(ax+1,ay),(ax,ay-1),(ax,ay+1)]:
     if 0<=nx<w and 0<=ny<h and not seen[ny*w+nx] and px[nx,ny][3]>0:seen[ny*w+nx]=1;q.append((nx,ny))
   if len(points)>100:components.append(points)
 figures=sorted(sorted(components,key=len,reverse=True)[:3],key=lambda points:min(x for x,y in points));assert len(figures)==3
 for n,points in enumerate(figures):
  x0=min(x for x,y in points);y0=min(y for x,y in points);x1=max(x for x,y in points)+1;y1=max(y for x,y in points)+1
  out=Image.new('RGBA',(x1-x0,y1-y0))
  for x,y in points:out.putpixel((x-x0,y-y0),px[x,y])
  name=f'{kind}-{n}-v2.png';out.save(root/name)
  # Verify retained foreground pixels exactly match the supplied sheet.
  assert all(out.getpixel((x-x0,y-y0))==px[x,y] for x,y in points)
  meta[f'{kind}-{n}']={'file':name,'w':out.width,'h':out.height,'anchor':anchors[n]-x0,'scale':scale}
(root.parents[1]/'ogre-sprite-data.js').write_text('// Original transparent v2 poses; no background removal or resampling.\nexport const ogreSprites='+json.dumps(meta)+';\n')
print('Extracted and pixel-verified',len(meta),'transparent v2 poses.')
