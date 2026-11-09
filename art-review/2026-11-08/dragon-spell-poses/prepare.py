"""Extract supplied transparent PNG cells with one nearest-neighbor pixel scale.
No image generation, color changes, or background keying. Standard library only.
"""
from pathlib import Path
import struct,zlib,binascii,json,hashlib,shutil,math,sys
from collections import deque
root=Path(__file__).resolve().parents[3]
review=Path(__file__).resolve().parent
out=root/'dist/assets/characters/dragon-spells-v1'
def decode(path):
 data=path.read_bytes();pos=8;packed=b''
 while pos<len(data):
  size=struct.unpack('>I',data[pos:pos+4])[0];kind=data[pos+4:pos+8];chunk=data[pos+8:pos+8+size];pos+=12+size
  if kind==b'IHDR':w,h,depth,color,_,_,interlace=struct.unpack('>IIBBBBB',chunk)
  if kind==b'IDAT':packed+=chunk
 assert (depth,color,interlace)==(8,6,0)
 raw=zlib.decompress(packed);stride=w*4;rows=[];previous=bytearray(stride);pos=0
 for y in range(h):
  mode=raw[pos];pos+=1;row=bytearray(raw[pos:pos+stride]);pos+=stride
  for x in range(stride):
   a=row[x-4] if x>=4 else 0;b=previous[x];c=previous[x-4] if x>=4 else 0
   p=a+b-c;pa,pb,pc=abs(p-a),abs(p-b),abs(p-c)
   predictor=[0,a,b,(a+b)//2,a if pa<=pb and pa<=pc else b if pb<=pc else c][mode]
   row[x]=(row[x]+predictor)&255
  rows.append(row);previous=row
 return w,h,rows
def save(path,w,h,rows):
 def chunk(kind,data):return struct.pack('>I',len(data))+kind+data+struct.pack('>I',binascii.crc32(kind+data)&0xffffffff)
 path.write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,h,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(b''.join(b'\0'+bytes(r) for r in rows),9))+chunk(b'IEND',b''))
if __name__=='__main__':
 if (out/'catalog.json').exists() and '--revise-unapproved' not in sys.argv:raise SystemExit('Existing extraction preserved. Make a new version for revisions.')
 poses=[];scale=.46
 bw,bh,blue=decode(Path('/Users/cshadwell/Desktop/dragon-spells-blue.png'))
 # All seven sheets share geometry. Flood only the BLUE reference background,
 # so white spell interiors never become mistaken for white background.
 def background(x,y):
  pixel=blue[y][x*4:x*4+4]
  return pixel[3]==0 or min(pixel[:3])>=250
 mask=set();queue=deque()
 for x in range(bw):queue.extend([(x,0),(x,bh-1)])
 for y in range(bh):queue.extend([(0,y),(bw-1,y)])
 while queue:
  x,y=queue.popleft()
  if not (0<=x<bw and 0<=y<bh) or (x,y) in mask or not background(x,y):continue
  mask.add((x,y));queue.extend([(x-1,y),(x+1,y),(x,y-1),(x,y+1)])
 for ci,color in enumerate(['blue','green','orange','purple','red','white','yellow']):
  src=Path('/Users/cshadwell/Desktop')/f'dragon-spells-{color}.png'
  (review/'sources').mkdir(exist_ok=True);shutil.copy2(src,review/'sources'/src.name)
  w,h,rows=decode(src)
  for x,y in mask:rows[y][x*4+3]=0
  print(color,'corner',list(rows[0][:4]),'alpha',sum(r[x+3]>0 for r in rows for x in range(0,len(r),4)))
  for cell,(left,right) in enumerate([(0,535),(535,975),(975,1505)],1):
   occupied=[(x,y) for y,row in enumerate(rows) for x in range(left,right) if row[x*4+3]>0]
   x0=min(x for x,y in occupied);x1=max(x for x,y in occupied)+1;y0=min(y for x,y in occupied);y1=max(y for x,y in occupied)+1
   aw,ah=round((x1-x0)*scale),round((y1-y0)*scale);cw,ch=math.ceil((aw+16)/8)*8,math.ceil((ah+16)/8)*8
   ox,oy=(cw-aw)//2,ch-8-ah;result=[bytearray(cw*4) for _ in range(ch)]
   for y in range(ah):
    sy=y0+min(y1-y0-1,int((y+.5)*(y1-y0)/ah))
    for x in range(aw):
     sx=x0+min(x1-x0-1,int((x+.5)*(x1-x0)/aw));result[oy+y][(ox+x)*4:(ox+x)*4+4]=rows[sy][sx*4:sx*4+4]
   number=38+ci*3+cell-1;file=f'dragon/pose-{number:03}.png';path=out/file;path.parent.mkdir(parents=True,exist_ok=True);save(path,cw,ch,result)
   poses.append(dict(character='dragon',number=number,id=f'dragon-{number:03}',sheet=f'dragon-spells-{color}',cell=cell,color=color,spellPose=cell,file='../dragon-spells-v1/'+file,width=cw,height=ch,bounds=[x0,y0,x1,y1],scale=scale,sha256=hashlib.sha256(path.read_bytes()).hexdigest(),sourceSha256=hashlib.sha256(src.read_bytes()).hexdigest()))
 (out/'catalog.json').write_text(json.dumps(dict(version='dragon-spells-v1',scale=scale,method='RGBA cell extraction and nearest-neighbor sampling; source colors preserved; shared blue-reference exterior white mask; alpha retained elsewhere',poses=poses),indent=2)+'\n')
 (root/'dist/dragon-spell-art-data.js').write_text('export const dragonSpellPoses='+json.dumps(poses,separators=(',',':'))+';\n')
