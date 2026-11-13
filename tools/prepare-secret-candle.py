"""Keep all supplied candle frames/alpha; crop padding and nearest-resize for the game."""
from pathlib import Path
import json,hashlib,shutil
from PIL import Image
root=Path(__file__).resolve().parents[1]
source=Path('/Users/cshadwell/Desktop/candle-transparent.apng');im=Image.open(source);frames=[];durations=[];bounds=[]
for i in range(im.n_frames):
 im.seek(i);frame=im.convert('RGBA');frames.append(frame.copy());durations.append(im.info.get('duration',1000/24));bounds.append(frame.getbbox())
box=(min(b[0] for b in bounds),min(b[1] for b in bounds),max(b[2] for b in bounds),max(b[3] for b in bounds))
frames=[f.crop(box).resize((80,130),Image.Resampling.NEAREST) for f in frames]
out=root/'dist/assets/secret/candle.apng';frames[0].save(out,save_all=True,append_images=frames[1:],duration=durations,loop=0,disposal=0,blend=0)
frames[0].save(root/'dist/assets/secret/candle-still.png')
shutil.copyfile('/Users/cshadwell/Desktop/correct.mp3',root/'dist/assets/secret/correct.mp3')
meta={'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'frames':len(frames),'crop':box,'size':[80,130],'frame_duration_ms':durations,'derived_sha256':hashlib.sha256(out.read_bytes()).hexdigest()}
(root/'art-review/2026-11-13/candle-celebration/asset-record.json').write_text(json.dumps(meta,indent=2)+'\n');print('Candle APNG:',out.stat().st_size,'bytes;',len(frames),'frames')
