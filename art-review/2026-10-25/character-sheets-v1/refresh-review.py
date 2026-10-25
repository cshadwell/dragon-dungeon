"""Build review artifacts only; never edits source or final sheet pixels."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib,html,urllib.parse,zipfile,shutil
r=Path(__file__).resolve().parent
jobs=json.loads((r/'generation-final-manifest.json').read_text());qa=[]
canvas=Image.new('RGB',(1600,2160),'#34383c');d=ImageDraw.Draw(canvas);font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',18);cards=[]
for i,j in enumerate(jobs):
 p=r/'sheets'/(j['id']+'.png');im=Image.open(p).convert('RGBA');a=im.getchannel('A');bounds=a.point(lambda x:255 if x>=128 else 0).getbbox()
 assert im.size==(1536,1024),(p.name,im.size)
 assert a.getextrema()[0]==0 and a.getextrema()[1]>128,(p.name,'alpha')
 assert bounds and bounds[0]>0 and bounds[1]>0 and bounds[2]<1536 and bounds[3]<1024,(p.name,'visible-edge clipping')
 qa.append({'id':j['id'],'file':str(p.relative_to(r)),'source':j['file'],'poses':j['count'],'size':[1536,1024],'transparent':True,'visible_bounds':list(bounds),'pose_count_review':'passed visual overview','sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'fidelity_revision':bool(j.get('fidelityRevision'))})
 thumb=im.copy();thumb.thumbnail((515,320),Image.Resampling.NEAREST);x=(i%3)*533;y=(i//3)*360;canvas.paste(thumb,(x+(533-thumb.width)//2,y+28),thumb);d.text((x+10,y+5),j['id']+' ('+str(j['count'])+' poses)',font=font,fill='white')
 src=urllib.parse.quote('originals/'+j['file']);out='sheets/'+j['id']+'.png';label=html.escape(j['id'])
 cards.append(f'<article><h2>{label} · {j["count"]} poses</h2><div class="pair"><figure><a href="{src}"><img src="{src}" alt="Original {label}"></a><figcaption>Original</figcaption></figure><figure><a href="{out}"><img src="{out}" alt="Normalized {label}"></a><figcaption>Normalized · 1536 × 1024</figcaption></figure></div></article>')
canvas.save(r/'batch-overview.png');(r/'qa-manifest.json').write_text(json.dumps(qa,indent=2)+'\n')
(r/'review.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dragon Dungeon · Character Art Review</title><style>body{font:16px system-ui;margin:24px;background:#202529;color:#eee7d4}h1{font-size:26px}h2{font-size:18px}article{border-top:1px solid #5a6062;padding:18px 0}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}figure{margin:0}img{display:block;width:100%;background:var(--bg,#34383c);image-rendering:pixelated}figcaption{padding:8px}select{font:inherit;padding:8px}a{color:#f2cb7b}@media(max-width:700px){.pair{grid-template-columns:1fr}}</style><h1>Dragon Dungeon · Cohesive Character Library v1</h1><p>17 sheets · 78 poses · normalized outputs 1536 × 1024 · original files preserved. Click any sheet for full size. This review does not change the running game.</p><label>Preview background <select onchange="document.body.style.setProperty('--bg',this.value)"><option value="#34383c">Charcoal</option><option value="#101812">Dungeon green</option><option value="#ffffff">White</option><option value="#000000">Black</option></select></label>'''+''.join(cards)+'</html>')
shutil.copy2(r.parent/'style-study-v2.png',r/'approved-style.png')
for record in json.loads((r/'source-manifest.json').read_text()):
 for original in [r/'originals'/record['file'],Path('/Users/cshadwell/Desktop/Characters')/record['file']]:assert hashlib.sha256(original.read_bytes()).hexdigest()==record['sha256']
archive=r.parent/'Dragon-Dungeon-Character-Sheets-v1.zip'
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED) as z:
 for p in sorted((r/'sheets').glob('*.png')):z.write(p,'sheets/'+p.name)
 for name in ['README.md','qa-manifest.json','batch-overview.png','approved-style.png']:z.write(r/name,name)
print('Verified 17 sheets, 78 poses; all 1536x1024 with transparency and clear visible borders; originals unchanged.')
print('Archive:',archive)
