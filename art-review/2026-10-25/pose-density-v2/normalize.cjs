// Deterministic candidate revision. No generation, recoloring, palette replacement or baseline overwrite.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sharp=require('/Users/cshadwell/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const {createCanvas,loadImage}=require('/Users/cshadwell/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const dir=__dirname,root=path.resolve(dir,'../../../'),src=path.join(root,'dist/assets/characters/approved-v1'),catalog=JSON.parse(fs.readFileSync(path.join(src,'catalog.json'))),heads=JSON.parse(fs.readFileSync(path.join(dir,'head-analysis.json')));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function sourceScale(p){
 if(p.character==='elf'){const f=heads.find(a=>a.id===p.id).feature;return (151*128/906)/(f[3]-f[1]);}
 if(p.character==='ogre'){if(p.number<=3)return 128/762;const f=heads.find(a=>a.id===p.id).feature;return (244*128/762)/(f[2]-f[0]);}
 if(p.character==='wizard')return p.number===1?128/894:p.number>=10?.30:.28;
 return p.number===1?176/978:.48;
}
(async()=>{
 if(fs.existsSync(path.join(dir,'APPROVED.lock')))throw Error('Approved output is locked; create a new review version instead.');
 const manifest={version:'pose-density-v2-candidate',status:'AWAITING USER REVIEW - not baseline',benchmark:'Elf pose 1',benchmarkSource:'approved-v1/elf/pose-001.png',logicalBenchmarkHeight:104,counts:catalog.counts,padding:8,method:'Individual nearest-neighbor reduction at calibrated head/body scale, transparent variable-aspect canvases; no redraw or palette change.',calibration:'Elf1 outer silhouette has dominant 9-source-pixel steps; 104 logical artwork pixels approximate its 906px height at that density. Elf: face-height anchor calibrated from Elf1. Ogre: front head-width anchor; base side views share original base scale. Wizard and dragon: manually calibrated source-scale groups from base/action head comparisons; crouches, hats, staff and effects retain source-relative shape.',poses:[]};
 for(const p of catalog.poses){
  const input=fs.readFileSync(path.join(src,p.file));if(hash(input)!==p.sha256)throw Error('Baseline changed: '+p.id);
  const scale=sourceScale(p)*(104/128),w=Math.round(p.width*scale),h=Math.round(p.height*scale);
  const raw=await sharp(input).ensureAlpha().raw().toBuffer(),pixels=Buffer.alloc(w*h*4);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const sx=Math.min(p.width-1,Math.floor((x+.5)*p.width/w)),sy=Math.min(p.height-1,Math.floor((y+.5)*p.height/h));raw.copy(pixels,(y*w+x)*4,(sy*p.width+sx)*4,(sy*p.width+sx)*4+4);}
  const cw=Math.ceil((w+16)/8)*8,ch=Math.ceil((h+16)/8)*8,left=Math.floor((cw-w)/2),top=ch-8-h;
  const output=await sharp(pixels,{raw:{width:w,height:h,channels:4}}).extend({left,right:cw-w-left,top,bottom:8,background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();
  const folder=path.join(dir,'poses',p.character);fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(path.join(dir,'poses',p.file),output);
  // A nearest-neighbor pass must not introduce colors or alpha values absent in the input.
  const colors=new Set();for(let i=0;i<raw.length;i+=4)colors.add(raw.readUInt32LE(i));for(let i=0;i<pixels.length;i+=4)if(!colors.has(pixels.readUInt32LE(i)))throw Error('Resampling introduced a color: '+p.id);
  manifest.poses.push({...p,file:'poses/'+p.file,sourceSha256:p.sha256,sha256:hash(output),sourceWidth:p.width,sourceHeight:p.height,scale,width:cw,height:ch,artWidth:w,artHeight:h,artOffset:[left,top],baselineY:ch-8});
 }
 fs.writeFileSync(path.join(dir,'catalog.json'),JSON.stringify(manifest,null,2)+'\n');
 for(const char of Object.keys(catalog.counts)){
  const poses=manifest.poses.filter(p=>p.character===char),cols=3,cellW=Math.max(440,...poses.map(p=>p.width*3+20)),cellH=Math.max(480,...poses.map(p=>p.height*3+70)),c=createCanvas(cols*cellW,80+Math.ceil(poses.length/cols)*cellH),ctx=c.getContext('2d');ctx.fillStyle='#30373a';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#eee8d2';ctx.font='26px sans-serif';ctx.fillText(char.toUpperCase()+' - INDIVIDUAL PIXEL GRID V2 (3x native)',20,38);ctx.imageSmoothingEnabled=false;
  for(let i=0;i<poses.length;i++){const p=poses[i],x=(i%cols)*cellW,y=70+Math.floor(i/cols)*cellH;ctx.fillStyle='#f4d98b';ctx.font='22px sans-serif';ctx.fillText(char+' '+p.number+' | '+p.width+'x'+p.height+' native',x+10,y+26);const im=await loadImage(path.join(dir,p.file));ctx.drawImage(im,x+(cellW-p.width*3)/2,y+50,p.width*3,p.height*3);}
  fs.writeFileSync(path.join(dir,char+'-numbered-v2.png'),c.toBuffer('image/png'));
 }
 const e1=manifest.poses.find(p=>p.id==='elf-001'),e2=manifest.poses.find(p=>p.id==='elf-002'),c=createCanvas(1200,650),ctx=c.getContext('2d');ctx.fillStyle='#30373a';ctx.fillRect(0,0,1200,650);ctx.imageSmoothingEnabled=false;
 for(const [i,p] of [e1,e2].entries()){const im=await loadImage(path.join(dir,p.file));ctx.fillStyle='#f4d98b';ctx.font='26px sans-serif';ctx.fillText('Elf '+p.number+' | same 4x pixel scale',i*600+20,35);ctx.drawImage(im,i*600+(600-p.width*4)/2,60,p.width*4,p.height*4);}
 fs.writeFileSync(path.join(dir,'elf-1-vs-2.png'),c.toBuffer('image/png'));
 console.log('Generated and verified '+manifest.poses.length+' candidates; source pixels only; stable IDs; original SHA checks passed.');
})();
