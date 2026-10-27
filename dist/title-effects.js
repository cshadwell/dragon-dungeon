// Animated pixel overlays and sampled flame cutouts. Original PNG stays unchanged.
export function animateTitle(canvas,art){
 const ctx=canvas.getContext('2d'),base=document.createElement('canvas');base.width=480;base.height=360;
 const b=base.getContext('2d');b.imageSmoothingEnabled=false;b.drawImage(art,0,0,480,360);
 const original=b.getImageData(0,0,480,360),pixels=original.data,eyes=[];
 for(let y=237;y<252;y++)for(let x=222;x<261;x++){const i=(y*480+x)*4;if(pixels[i+1]>12&&pixels[i+1]>pixels[i]*1.05&&pixels[i+1]>pixels[i+2]*1.05)eyes.push([x,y,pixels[i],pixels[i+1],pixels[i+2]]);}
 // Isolate the bright fire from the approved title, keeping its own warm palette.
 const regions=[[10,162,47,57],[423,162,47,57],[165,219,13,19],[191,244,10,14],[278,244,10,14],[301,219,13,19]];
 const flames=regions.map(([x,y,w,h],index)=>{
  const sprite=document.createElement('canvas');sprite.width=w;sprite.height=h;const c=sprite.getContext('2d'),image=c.createImageData(w,h);
  let silhouette=null;
  if(index<2){
   // Include the entire connected fire, including its red outer tongues. The
   // previous yellow-only mask left part of the original flame stationary.
   // Geometry constrains segmentation to the fire itself: orange-lit stone can
   // share the same colors and must never enter the animated cutout.
   const outline=[[32,163],[35,171],[33,176],[37,183],[34,190],[39,191],[41,188],[45,195],[44,201],[48,201],[51,207],[54,211],[53,217],[50,219],[14,219],[11,215],[12,209],[16,204],[18,198],[18,193],[21,188],[24,194],[27,191],[25,185],[29,180],[29,173]];
   const inside=(col,row)=>{const px=index===0?x+col:479-(x+col),py=y+row;let yes=false;for(let a=0,z=outline.length-1;a<outline.length;z=a++){const [ax,ay]=outline[a],[zx,zy]=outline[z];if((ay>py)!==(zy>py)&&px<(zx-ax)*(py-ay)/(zy-ay)+ax)yes=!yes;}return yes;};
   const fire=(col,row)=>{if(!inside(col,row))return false;const i=((y+row)*480+x+col)*4,r=pixels[i],g=pixels[i+1],blue=pixels[i+2];return r>45&&r>g*1.15&&r>blue*1.5||r>180&&g>130&&r>blue*1.2;};
   const connected=new Set(),queue=[[Math.floor(w/2),h-12]];
   while(queue.length){const [col,row]=queue.pop(),key=row*w+col;if(col<0||col>=w||row<0||row>=h||connected.has(key)||!fire(col,row))continue;connected.add(key);queue.push([col-1,row],[col+1,row],[col,row-1],[col,row+1]);}
   silhouette=connected;
  }
  for(let row=0;row<h;row++)for(let col=0;col<w;col++){
   const i=((y+row)*480+x+col)*4,j=(row*w+col)*4;
   if(silhouette?silhouette.has(row*w+col):pixels[i]>170&&pixels[i+1]>65&&pixels[i+1]>pixels[i+2]*1.45&&pixels[i]>pixels[i+2]*1.5){image.data.set(pixels.subarray(i,i+4),j);}
  }
  c.putImageData(image,0,0);return {x,y,w,h,sprite,foreground:index<2,mask:image.data};
 });
 const still=document.createElement('canvas');still.width=480;still.height=360;still.getContext('2d').drawImage(base,0,0);
 // Cover only sampled flame pixels on the working background, then replace with
 // their moving cutouts. Torches, braziers and surrounding masonry remain still.
 const backing=b.getImageData(0,0,480,360);
 for(const f of flames)for(let row=0;row<f.h;row++)for(let col=0;col<f.w;col++){
  if(!f.mask[(row*f.w+col)*4+3])continue;
  const i=((f.y+row)*480+f.x+col)*4,side=col<f.w/2?f.x-2:f.x+f.w+1,k=((f.y+row)*480+side)*4;
  backing.data[i]=pixels[k]*.65;backing.data[i+1]=pixels[k+1]*.65;backing.data[i+2]=pixels[k+2]*.65;
 }
 b.putImageData(backing,0,0);
 const sparkles=[[1.2,147,61],[4.8,321,126],[8.1,261,69]];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=null,last=-Infinity,active=true,started=null;
 function render(now){if(!active)return;frame=requestAnimationFrame(render);if(now-last<1000/30||document.hidden)return;last=now;started??=now;
  ctx.imageSmoothingEnabled=false;ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  if(reduced.matches){ctx.drawImage(still,0,0);return;}
  ctx.drawImage(base,0,0);const t=(now-started)/1000,step=Math.floor(t*10);
  flames.forEach((f,n)=>{
   const scale=1+.09*Math.sin(step*.91+n*2)+.045*Math.sin(step*1.73+n),height=Math.round(f.h*scale),bottom=f.y+f.h;
   // Scanline sway changes the tongues of the flame more than its anchored base.
   for(let row=0;row<f.h;row++){
    if(f.foreground&&row>=f.h-8){ctx.drawImage(f.sprite,0,row,f.w,1,f.x,f.y+row,f.w,1);continue;}
    const upper=1-row/f.h,sway=Math.round(Math.sin(row*.32+step*.8+n*2)*upper*(f.w>20?3:1));
    const movable=f.foreground?f.h-8:f.h,anchor=f.foreground?f.y+movable:bottom,span=f.foreground?Math.round(movable*scale):height;
    const top=anchor-span+Math.floor(row*span/movable),next=anchor-span+Math.floor((row+1)*span/movable);
    ctx.drawImage(f.sprite,0,row,f.w,1,f.x+sway,top,f.w,Math.max(1,next-top));
   }
   // No rectangular lighting wash: masonry outside the cutout stays static.
  });
  for(const [n,x] of [[0,32],[1,448]])for(let j=0;j<3;j++){
   const age=(t*.3+j/3+n*.19)%1;ctx.fillStyle=`rgba(255,${160+j*25},45,${Math.sin(age*Math.PI)*.85})`;ctx.fillRect(Math.round(x+Math.sin(age*5+j*3)*5),Math.round(189-age*38),1,j===0?2:1);
  }
  // Three occasional, short gold/ivory glints per ten seconds; no title halo.
  for(const [when,x,y] of sparkles){const age=(t%10)-when;if(age<0||age>.65)continue;const strength=Math.sin(age/.65*Math.PI),r=Math.max(1,Math.round(strength*5));
   ctx.globalAlpha=strength;ctx.fillStyle='#d9951b';ctx.fillRect(x-r-1,y,r*2+3,1);ctx.fillRect(x,y-r-1,1,r*2+3);
   ctx.fillStyle='#ffe088';ctx.fillRect(x-r,y,r*2+1,1);ctx.fillRect(x,y-r,1,r*2+1);ctx.fillStyle='#fff4c4';ctx.fillRect(x-1,y-1,3,3);ctx.globalAlpha=1;
  }
  const cycle=t%4.6;
  // Close fully, hold black for 0.18s, then reopen; include all green edge pixels.
  const blink=cycle<3.8||cycle>=4.48?0:cycle<4.05?(cycle-3.8)/.25:cycle<4.23?1:1-(cycle-4.23)/.25;
  if(blink>0){ctx.globalCompositeOperation='source-over';ctx.fillStyle=`rgba(0,0,0,${blink})`;ctx.fillRect(226,238,34,13);}
  else for(const [x,y,r,g,blue]of eyes){ctx.globalCompositeOperation='screen';ctx.fillStyle=`rgba(${r},${g},${blue},.14)`;ctx.fillRect(x,y,1,1);}
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
 }
 frame=requestAnimationFrame(render);return ()=>{active=false;cancelAnimationFrame(frame);};
}
