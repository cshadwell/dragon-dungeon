import {cells,neighbor,START,ENCOUNTER,DRAGON,WIZARD,QUEEN,WORLD_WIDTH,WORLD_HEIGHT} from './runtime.js?v=6f08161e9101';

// Fixed atlas: discovering cells never changes the map's scale or reveals new bounds.
export function exploredMap(s){
 const tile=Math.min(240/WORLD_WIDTH,200/WORLD_HEIGHT),ox=(256-WORLD_WIDTH*tile)/2,oy=(216-WORLD_HEIGHT*tile)/2;
 const center=p=>{const [x,y]=p.split(',').map(Number);return [ox+(x+.5)*tile,oy+(y+.5)*tile];};
 let svg='<rect width="256" height="216" fill="#050807"/>';
 for(const p of s.visited){const [cx,cy]=center(p);
   for(let d=0;d<4;d++){const n=neighbor(p,d);if(cells.has(n)&&!s.visited.includes(n)){const [nx,ny]=center(n);svg+=`<path d="M${cx},${cy} l${(nx-cx)*.7},${(ny-cy)*.7}" stroke="#82856b" stroke-width="${tile*.42}" stroke-dasharray="1 1"/>`;}}
   svg+=`<rect data-cell="${p}" x="${cx-tile/2}" y="${cy-tile/2}" width="${tile+.05}" height="${tile+.05}" fill="#d8d8be"/>`;
   const landmark=p===ENCOUNTER?['O',s.completed,'#dfa42b']:p===WIZARD?['W',s.wizard.completed,'#658ae9']:p===QUEEN?['Q',s.queen.completed,'#6eae63']:p===DRAGON?['D',s.dragon.victory,'#bf74d1']:null;
   if(landmark){svg+=`<circle cx="${cx}" cy="${cy}" r="${tile*.9}" fill="${landmark[2]}"/><text x="${cx}" y="${cy+tile*.53}" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="${tile*1.5}" fill="#101910">${landmark[1]?'✓':landmark[0]}</text>`;}
   if(p===START)svg+=`<rect x="${cx-tile*.3}" y="${cy-tile*.3}" width="${tile*.6}" height="${tile*.6}" fill="#d77162"/>`;
 }
 const [x,y]=center(s.pos),r=Math.max(2.4,tile*.65);svg+=`<path d="M0,-${r} L${r*.8},${r} L0,${r*.45} L-${r*.8},${r}Z" fill="#f7cc6c" stroke="#302718" stroke-width=".6" transform="translate(${x} ${y}) rotate(${s.facing*90})"/>`;
 return `<svg viewBox="0 0 256 216" role="img" aria-label="Explored map. Unvisited rooms are concealed. Gold arrow marks your position and facing.">${svg}</svg>`;
}
