"""Lossless approval packaging: copy sheets, crop numbered cells, verify exact RGBA.
Never restyles, filters, rescales or overwrites an existing approved library.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib,shutil,math
from collections import deque
root=Path(__file__).resolve().parents[1];review=root/'art-review/2026-10-25/character-sheets-v1';dest=root/'dist/assets/characters/approved-v1'
if (dest/'catalog.json').exists():raise SystemExit('Library already locked; refusing overwrite.')
qa=json.loads((review/'qa-manifest.json').read_text());catalog={'version':'approved-v1','approved':'2026-10-25','counts':{},'sheets':[],'poses':[]};font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',22)
for item in qa:
 src=review/item['file'];digest=hashlib.sha256(src.read_bytes()).hexdigest();assert digest==item['sha256']
 (dest/'sheets').mkdir(exist_ok=True);sheet=dest/'sheets'/src.name;shutil.copy2(src,sheet)
 character=item['id'].split('-')[0];folder=dest/character;folder.mkdir(exist_ok=True);im=Image.open(src).convert('RGBA');n=item['poses'];cols={1:1,3:3,4:2,6:3,9:3,12:4}[n];rows=math.ceil(n/cols)
 first=catalog['counts'].get(character,0)+1
 catalog['sheets'].append({'id':item['id'],'character':character,'file':'sheets/'+src.name,'sha256':digest,'first':first,'last':first+n-1,'columns':cols,'rows':rows})
 # Discover complete opaque pose bodies; equal grid cells can cut across figures.
 alpha=im.getchannel('A');ap=alpha.load();seen=bytearray(im.width*im.height);components=[]
 for yy in range(im.height):
  for xx in range(im.width):
   if seen[yy*im.width+xx] or ap[xx,yy]<64:continue
   seen[yy*im.width+xx]=1;q=deque([(xx,yy)]);points=[]
   while q:
    x,y=q.popleft();points.append((x,y))
    for nx,ny in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
     if 0<=nx<im.width and 0<=ny<im.height and not seen[ny*im.width+nx] and ap[nx,ny]>=64:seen[ny*im.width+nx]=1;q.append((nx,ny))
   if len(points)>=3:components.append(points)
 components.sort(key=len,reverse=True);main=components[:n];assert len(main)==n
 def boxof(points):return (min(x for x,y in points),min(y for x,y in points),max(x for x,y in points)+1,max(y for x,y in points)+1)
 # Stable reading order based on row bands, then x-center (not grid clipping).
 main.sort(key=lambda points:((boxof(points)[1]+boxof(points)[3])/2))
 ordered=[]
 for row in range(rows):ordered.extend(sorted(main[row*cols:(row+1)*cols],key=lambda points:(boxof(points)[0]+boxof(points)[2])/2))
 groups=[list(points) for points in ordered];boxes=[boxof(p) for p in ordered]
 def distance(box,points):
  x0,y0,x1,y1=box;bx0,by0,bx1,by1=boxof(points)
  return max(x0-bx1,bx0-x1,0)**2+max(y0-by1,by0-y1,0)**2
 for extra in components[n:]:
  # Preserve detached particles/effects with the nearest full figure, not a neighbor fragment.
  owner=min(range(n),key=lambda i:distance(boxes[i],extra));groups[owner].extend(extra)
 for index,points in enumerate(groups):
  number=first+index
  # Retain exact edge alpha around assigned visible components, without adjacent figures.
  keep=set(points)
  for x,y in points:
   for dx,dy in [(-1,0),(1,0),(0,-1),(0,1)]:
    nx,ny=x+dx,y+dy
    if 0<=nx<im.width and 0<=ny<im.height and 0<ap[nx,ny]<64:keep.add((nx,ny))
  box=boxof(keep);x0,y0,x1,y1=box;crop=Image.new('RGBA',(x1-x0,y1-y0))
  for x,y in keep:crop.putpixel((x-x0,y-y0),im.getpixel((x,y)))
  file=f'{character}/pose-{number:03}.png';crop.save(dest/file)
  assert all(crop.getpixel((x-x0,y-y0))==im.getpixel((x,y)) for x,y in keep)
  catalog['poses'].append({'character':character,'number':number,'id':f'{character}-{number:03}','sheet':item['id'],'cell':index+1,'bounds':list(box),'isolation':'assigned connected figure and detached effects; original retained RGBA','file':file,'width':crop.width,'height':crop.height,'sha256':hashlib.sha256((dest/file).read_bytes()).hexdigest()})
 catalog['counts'][character]=first+n-1
(dest/'catalog.json').write_text(json.dumps(catalog,indent=2)+'\n')
(root/'dist/character-pose-data.js').write_text('// User-approved 2026-10-25. Never renumber or alter approved artwork.\nexport const characterPoseData='+json.dumps(catalog)+';\n')
guide=review/'numbered';guide.mkdir(exist_ok=True)
for character,count in catalog['counts'].items():
 poses=[p for p in catalog['poses'] if p['character']==character];canvas=Image.new('RGB',(1200,80+math.ceil(count/4)*270),'#30373a');d=ImageDraw.Draw(canvas);d.text((20,20),f'{character.upper()} — LOCKED POSES 1–{count}',font=font,fill='#eee8d2')
 for i,p in enumerate(poses):
  x=(i%4)*300;y=70+(i//4)*270;thumb=Image.open(dest/p['file']).convert('RGBA');thumb.thumbnail((280,220),Image.Resampling.NEAREST);canvas.paste(thumb,(x+(300-thumb.width)//2,y+35+(220-thumb.height)//2),thumb);d.text((x+14,y+4),f'{character.title()} {p["number"]}',font=font,fill='#f4d98b')
 canvas.save(guide/f'{character}-numbered.png')
print('Locked',len(catalog['sheets']),'unchanged sheets and',len(catalog['poses']),'lossless pose crops:',catalog['counts'])
