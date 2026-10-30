from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib,shutil,math
root=Path(__file__).resolve().parents[3]
out=root/'dist/assets/characters/wizard-spells-v1'
review=Path(__file__).resolve().parent
if (out/'catalog.json').exists():
 raise SystemExit('Refusing to overwrite prepared library; create a new revision for authorized changes.')
src=Path('/Users/cshadwell/Documents/Codex/2026-10-30/referenced-chatgpt-conversation-this-is-an/outputs')
colors=['blue','green','orange','purple','red','white','yellow']
scale=.24375
poses=[]
for ci,color in enumerate(colors):
 sheet=Image.open(src/f'wizard-spells-{color}.png').convert('RGBA')
 (review/'sources').mkdir(exist_ok=True)
 shutil.copy2(src/f'wizard-spells-{color}.png',review/'sources'/f'{color}.png')
 for cell,(left,right) in enumerate([(0,420),(420,1000),(1000,1536)],1):
  crop=sheet.crop((left,0,right,sheet.height));box=crop.getchannel('A').getbbox();crop=crop.crop(box)
  w,h=[round(v*scale) for v in crop.size]
  art=crop.resize((w,h),Image.Resampling.NEAREST)
  cw,ch=[math.ceil((v+16)/8)*8 for v in [w,h]]
  im=Image.new('RGBA',(cw,ch));offset=((cw-w)//2,ch-8-h);im.paste(art,offset)
  number=14+ci*3+cell-1;file=f'wizard/pose-{number:03}.png';p=out/file;p.parent.mkdir(parents=True,exist_ok=True);im.save(p)
  poses.append(dict(character='wizard',number=number,id=f'wizard-{number:03}',sheet=f'wizard-spells-{color}',cell=cell,color=color,spellPose=cell,file='../wizard-spells-v1/'+file,width=cw,height=ch,bounds=[left+box[0],box[1],left+box[2],box[3]],scale=scale,artWidth=w,artHeight=h,artOffset=offset,baselineY=ch-8,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),sourceSha256=hashlib.sha256((src/f'wizard-spells-{color}.png').read_bytes()).hexdigest()))
manifest=dict(version='wizard-spells-v1',status='Prepared for user review; existing approved-v2 unchanged',scale=scale,poses=poses)
(out/'catalog.json').write_text(json.dumps(manifest,indent=2)+'\n')
(root/'dist/wizard-spell-art-data.js').write_text('// Additional supplied spell poses; existing approved IDs are unchanged.\nexport const wizardSpellPoses='+json.dumps(poses,separators=(',',':'))+';\n')
font=ImageFont.truetype('/System/Library/Fonts/Menlo.ttc',18)
contact=Image.new('RGB',(1080,7*430+80),'#273134');d=ImageDraw.Draw(contact);d.text((20,20),'Wizard spell additions — same 3x pixel scale',font=font,fill='#ead18b')
figs=[]
for i,p in enumerate(poses):
 im=Image.open(out/p['file'].replace('../wizard-spells-v1/',''));col=i%3;row=i//3;x=col*360;y=80+row*430
 d.text((x+12,y+8),f"Wizard {p['number']} · {p['color']}",font=font,fill='#ead18b')
 im=im.resize((im.width*3,im.height*3),Image.Resampling.NEAREST);contact.paste(im,(x+(360-im.width)//2,y+45),im)
 url='../../../dist/assets/characters/'+p['file'].replace('../','')
 figs.append(f'<figure><figcaption>Wizard {p["number"]} · {p["color"]} · pose {p["cell"]}</figcaption><img src="{url}" width="{p["width"]*3}" height="{p["height"]*3}"><p>{p["width"]} × {p["height"]} native pixels</p></figure>')
contact.save(review/'numbered.png')
(review/'index.html').write_text('<!doctype html><meta charset="utf-8"><title>Wizard spell pose gallery</title><style>body{background:#273134;color:#eadfc3;font:16px monospace;margin:24px}main{display:grid;grid-template-columns:repeat(3,minmax(360px,1fr));gap:12px}figure{margin:0;padding:12px;background:#343e42}img{display:block;image-rendering:pixelated}a{color:#ead18b}</style><h1>Wizard spell poses 14–34</h1><p>Existing poses 1–13 remain unchanged. All additions share the existing spell-art scale; transparent backgrounds and nearest-neighbor pixels.</p><a href="../../2026-10-25/pose-density-v2/index.html#wizard">Original wizard poses</a><main>'+''.join(figs)+'</main>')
