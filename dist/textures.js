// Original code-drawn repeating pixel surfaces inspired by the supplied references.
// No source-image pixels or watermarked stock previews are used.
export const noise=(x,y)=>{let n=Math.imul(x+173,374761393)^Math.imul(y+791,668265263);n=Math.imul(n^(n>>>13),1274126177);return (n^(n>>>16))>>>0;};
const mod=(n,m)=>((n%m)+m)%m;
export function wallPixel(u,v){
 u=mod(u,128);v=mod(v,128);
 const row=Math.floor(v/16),offset=u+(row%2)*16,brick=Math.floor(offset/32),x=offset%32,y=v%16,seed=noise(brick,row);
 const notch=2+(seed%2),corner=(x<notch&&y<notch-x)||(x>31-notch&&y<x-(31-notch))||(x<notch&&y>15-notch+x)||(x>31-notch&&y>15-(x-(31-notch)));
 if(x===0||y===0||corner)return [27,28,28];
 let base=99+seed%24;
 // Broad stepped facets make the stone read as chipped rock, rather than noise.
 const facet=noise(Math.floor(x/4)+brick*9,Math.floor(y/3)+row*7)%5;
 base+=[-27,-12,0,16,28][facet];
 if(y<3||x<2)base=174+(seed%17);
 else if(y>13||x>29)base=57+(seed%13);
 else if(y>=3&&y<6&&x>3&&x<24&&((x+y+seed)%13)<7)base+=31;
 // Short staggered hairline cracks, deliberately separated per stone.
 const crackX=8+seed%17;
 if(y>6&&y<13&&x===crackX+Math.floor((y-6)/3))base=47;
 return [base,base,base];
}
export function floorPixel(u,v){
 u=mod(u,128);v=mod(v,128);const tx=Math.floor(u/16),ty=Math.floor(v/16),x=u%16,y=v%16,seed=noise(tx,ty);
 if(x===0||y===0)return [13,22,11];
 const palette=[[39,57,27],[52,65,43],[31,49,20],[62,72,53]],base=palette[seed%4];
 const patch=noise(Math.floor(x/3)+tx*5,Math.floor(y/3)+ty*5)%7;
 let light=patch<2?-9:patch>4?5:0;
 if(x===1||y===1)light+=7;if(x===15||y===15)light-=6;
 return base.map(c=>Math.max(0,c+light));
}
export const ceilingPixel=(u,v)=>{const n=24+noise(mod(u,128),mod(v,128))%13;return [n,n,n];};
// Generate once; wall/floor samples during motion are inexpensive lookups.
function texture(fn){const data=new Uint8Array(128*128*3);for(let y=0;y<128;y++)for(let x=0;x<128;x++)data.set(fn(x,y),(y*128+x)*3);return data;}
export const textures={wall:texture(wallPixel),floor:texture(floorPixel),ceiling:texture(ceilingPixel)};
export function sample(texture,u,v){const i=(mod(Math.floor(v),128)*128+mod(Math.floor(u),128))*3;return [texture[i],texture[i+1],texture[i+2]];}
