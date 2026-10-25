// Original procedural 256×216 renderer. World cells are shared with collision/map.
import {cells,DIRS,neighbor,WORLD_WIDTH,WORLD_HEIGHT} from './runtime.js?v=830f4095e72a';
import {textures,sample} from './textures.js?v=830f4095e72a';
import {isOgreDoorFace,ogreDoorPixel} from './ogre-gate.js?v=830f4095e72a';
export function corridorPixels(state,w=256,h=216,pose=null){
 const data=new Uint8ClampedArray(w*h*4),[cx,cy]=state.pos.split(',').map(Number);
 const px=pose?.x??cx+.5,py=pose?.y??cy+.5,angle=pose?.angle??state.facing*Math.PI/2;
 // Exact cardinal values avoid tiny sin/cos residuals and texture seams at rest.
 const dx=pose?Math.sin(angle):DIRS[state.facing][0],dy=pose?-Math.cos(angle):DIRS[state.facing][1],planeX=-dy*.7,planeY=dx*.7;
 const put=(x,y,r,g,b)=>{const i=(y*w+x)*4;data[i]=r;data[i+1]=g;data[i+2]=b;data[i+3]=255;};
 for(let x=0;x<w;x++){
   const camera=2*x/w-1,rx=dx+planeX*camera,ry=dy+planeY*camera;
   let mx=Math.floor(px),my=Math.floor(py),side=0,dist=0;const ddx=Math.abs(1/rx),ddy=Math.abs(1/ry),sx=rx<0?-1:1,sy=ry<0?-1:1;
   let tx=(rx<0?px-mx:mx+1-px)*ddx,ty=(ry<0?py-my:my+1-py)*ddy;
   for(let n=0;n<WORLD_WIDTH+WORLD_HEIGHT+4;n++){if(tx<ty){tx+=ddx;mx+=sx;side=0;}else{ty+=ddy;my+=sy;side=1;}if(!cells.has(`${mx},${my}`))break;}
   dist=Math.max(.05,side?ty-ddy:tx-ddx);const wallH=h/dist,top=(h-wallH)/2,bottom=(h+wallH)/2;
   const hit=side?px+dist*rx:py+dist*ry,u=Math.floor((hit-Math.floor(hit))*128);
   for(let y=0;y<h;y++){
     if(y>=top&&y<=bottom){
       const v=Math.floor((y-top)/wallH*128),shade=(side?.88:1)/(1+dist*.13),door=isOgreDoorFace(mx,my,side,side?sy:sx),[r,g,b]=(door&&ogreDoorPixel(u,v))||sample(textures.wall,u,v);
       put(x,y,r*shade,g*shade,b*shade);
     }else{
       const ceiling=y<h/2,depth=h/(2*Math.max(1,Math.abs(y-h/2))),wx=px+depth*rx,wy=py+depth*ry;
       const shade=1/(1+depth*.13),[r,g,b]=sample(ceiling?textures.ceiling:textures.floor,wx*64,wy*64);
       put(x,y,r*shade,g*shade,b*shade);
     }
   }
 }
 return data;
}
export function drawCorridor(host,state,pose=null){
 let canvas=host.querySelector('canvas');if(!canvas){canvas=document.createElement('canvas');canvas.width=256;canvas.height=216;canvas.setAttribute('role','img');host.replaceChildren(canvas);}
 canvas.setAttribute('aria-label',`Pixel stone corridor. ${cells.has(neighbor(state.pos,state.facing))?'Passage ahead.':'Wall ahead.'} ${cells.has(neighbor(state.pos,(state.facing+3)%4))?'Opening left.':''} ${cells.has(neighbor(state.pos,(state.facing+1)%4))?'Opening right.':''}`);
 canvas.getContext('2d').putImageData(new ImageData(corridorPixels(state,256,216,pose),256,216),0,0);
}
