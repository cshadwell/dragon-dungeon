"""Make a lean, unpublished copy. Never changes source or approved assets."""
from pathlib import Path
import shutil,tempfile,argparse
root=Path(__file__).resolve().parents[1]
parent=root/'build';parent.mkdir(exist_ok=True)
parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path);args=parser.parse_args()
out=args.output.resolve() if args.output else Path(tempfile.mkdtemp(prefix='dragon-dungeon-',dir=parent))
if args.output:out.mkdir(parents=True,exist_ok=False)
for p in (root/'dist').iterdir():
    if p.is_dir():
        shutil.copytree(p,out/p.name,ignore=lambda directory,names:['approved-v1'] if Path(directory).name=='characters' and 'approved-v1' in names else [])
    elif p.name not in {'opening-preview.html','ending-preview.html','ending-preview.css','ending-preview.js','audio-entry-preview.html','audio-entry-preview.js'}:
        shutil.copy2(p,out/p.name)
size=sum(p.stat().st_size for p in out.rglob('*') if p.is_file())
print(f'Unpublished release: {out}\nSize: {size/1048576:.1f} MiB; approved original assets retained in repository.')
