const sharp=require('/Users/cshadwell/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../../../');
const source=path.join(root,'dist/assets/characters/approved-v1');const catalog=JSON.parse(fs.readFileSync(path.join(source,'catalog.json')));
async function analyze(p){let {data,info}=await sharp(path.join(source,p.file)).ensureAlpha().raw().toBuffer({resolveWithObject:true});let w=info.width,h=info.height,mask=new Uint8Array(w*h),seen=new Uint8Array(w*h),comps=[];
 for(let y=0;y<h*.6;y++)for(let x=0;x<w;x++){let i=(y*w+x)*4,r=data[i],g=data[i+1],b=data[i+2];if(data[i+3]<128)continue;
 mask[y*w+x]=p.character==='ogre'?(g>r*.93&&g>b*1.45&&g>40&&r>30):(r>155&&g>80&&b>40&&b<190&&r>g*1.08&&r<g*2.2&&g>b*1.1&&g-b<105);
 }
 for(let k=0;k<mask.length;k++){if(!mask[k]||seen[k])continue;let queue=[k],n=0,x0=w,y0=h,x1=0,y1=0;seen[k]=1;
 for(let t=0;t<queue.length;t++){let at=queue[t],x=at%w,y=Math.floor(at/w);n++;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);for(let v of [x?at-1:-1,x<w-1?at+1:-1,y?at-w:-1,y<h-1?at+w:-1])if(v>=0&&mask[v]&&!seen[v]){seen[v]=1;queue.push(v);}}
 if(n>20)comps.push({n,box:[x0,y0,x1+1,y1+1]});}
 comps.sort((a,b)=>b.n-a.n);return {...p,feature:comps[0]?.box,alternatives:comps.slice(0,3)};}
(async()=>{const out=[];for(const p of catalog.poses.filter(p=>p.character!=='dragon'))out.push(await analyze(p));fs.writeFileSync(path.join(__dirname,'head-analysis.json'),JSON.stringify(out,null,2));for(const p of out)console.log(p.id,p.feature);})();
