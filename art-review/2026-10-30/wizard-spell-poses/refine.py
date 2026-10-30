from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib
root=Path(__file__).resolve().parents[3];old=root/'dist/assets/characters/wizard-spells-v1';out=root/'dist/assets/characters/wizard-spells-v2';out.mkdir(exist_ok=True)
m=json.loads((old/'catalog.json').read_text());changes={}
for p in m['poses']:
 file=f"wizard/pose-{p['number']:03}.png";im=Image.open(old/file).convert('RGBA');before=im.copy();blue=Image.open(old/f"wizard/pose-{13+p['cell']:03}.png").convert('RGBA')
 if p['cell']==2 and p['color']!='blue':
  for y in range(im.height):
   for x in range(im.width):
    b=blue.getpixel((x,y));v=im.getpixel((x,y))
    if b[3]>200 and v[3]<50 and min(b[:3])>220:im.putpixel((x,y),b)
 if p['color']=='white':
  for y in range(im.height):
   for x in range(im.width):
    b=blue.getpixel((x,y));v=im.getpixel((x,y));original=before.getpixel((x,y))
    # Color-variant differences isolate magic from unchanged robe/beard/staff.
    if b[3]>0 and original[3]>0 and b[:3]!=original[:3] and max(v[:3])-min(v[:3])<8:
     level=round(200+55*max(v[:3])/255);im.putpixel((x,y),(level,level,level,v[3]))
 target=out/file;target.parent.mkdir(exist_ok=True);im.save(target)
 changes[p['number']]=sum(a!=b for a,b in zip(before.getdata(),im.getdata()))
 p['file']='../wizard-spells-v2/'+file;p['sha256']=hashlib.sha256(target.read_bytes()).hexdigest()
m['version']='wizard-spells-v2';m['status']='User-requested white highlight restoration and white spell brightness revision';m['pixelChanges']=changes
(out/'catalog.json').write_text(json.dumps(m,indent=2)+'\n');(root/'dist/wizard-spell-art-data.js').write_text('// User-requested spell highlight revision; stable IDs preserved.\nexport const wizardSpellPoses='+json.dumps(m['poses'],separators=(',',':'))+';\n')
review=Path(__file__).resolve().parent;html=(review/'index.html').read_text().replace('wizard-spells-v1/','wizard-spells-v2/');(review/'index.html').write_text(html)
canvas=Image.new('RGB',(900,440),'#273134');d=ImageDraw.Draw(canvas);font=ImageFont.truetype('/System/Library/Fonts/Menlo.ttc',16)
for i,n in enumerate([15,30]):
 im=Image.open(out/f'wizard/pose-{n:03}.png');im=im.resize((im.width*3,im.height*3),Image.Resampling.NEAREST);canvas.paste(im,(i*450,50),im);d.text((i*450+10,10),'Blue reference' if i==0 else 'White spell · restored highlights',font=font,fill='#ead18b')
canvas.save(review/'white-refinement.png');print(changes)
contact=Image.new('RGB',(1080,3090),'#273134');d=ImageDraw.Draw(contact)
d.text((20,20),'Wizard spell poses — restored highlights / brighter white',font=font,fill='#ead18b')
for i,p in enumerate(m['poses']):
 im=Image.open(out/f"wizard/pose-{p['number']:03}.png");im=im.resize((im.width*3,im.height*3),Image.Resampling.NEAREST);x=i%3*360;y=80+i//3*430
 d.text((x+12,y+8),f"Wizard {p['number']} · {p['color']}",font=font,fill='#ead18b');contact.paste(im,(x+(360-im.width)//2,y+45),im)
contact.save(review/'numbered.png')
