// Guardian graphics shared verbatim with the final encounter. Palette overrides only.
import {ORBIT} from './elf-defence-model.js?v=6d789c038015';
export function drawDefenceArena(ctx,state,settings,{flash=null,running=true,loaded=true,completed=false,palette={}}={}){
 const color=value=>palette[value]??value;
 const rad=degrees=>degrees*Math.PI/180;
 const dot=(x,y,w,value)=>{ctx.fillStyle=color(value);ctx.fillRect(Math.round(x),Math.round(y),w,w);};
 const ring=(radius,value,step=2)=>{for(let deg=0;deg<360;deg+=step)dot(100+Math.cos(rad(deg))*radius,100+Math.sin(rad(deg))*radius,1,value);};
ctx.imageSmoothingEnabled=false;ctx.fillStyle=color('#09110e');ctx.fillRect(0,0,200,200);ring(91,color('#526044'));ring(89,color('#273c2b'));for(let deg=0;deg<360;deg+=15)dot(99+Math.cos(rad(deg))*91,99+Math.sin(rad(deg))*91,3,color('#a99c62'));ring(ORBIT,color('#354637'),9);
 // A single physical arc. No separate shields or instant directional snapping.
 for(let offset=-settings.shieldSize/2;offset<=settings.shieldSize/2;offset+=1.5){const a=rad(state.angle+offset);dot(99+Math.cos(a)*ORBIT,99+Math.sin(a)*ORBIT,3,flash==='block'?color('#fff0bb'):color('#b5c2af'));dot(100+Math.cos(a)*(ORBIT-2),100+Math.sin(a)*(ORBIT-2),2,color('#5e8c65'));}
 const hurt=flash==='miss';ctx.fillStyle=hurt?color('#c0654c'):color('#806b35');ctx.fillRect(97,94,7,13);ctx.fillRect(94,97,13,7);ctx.fillStyle=hurt?color('#ffa575'):color('#edcd77');ctx.fillRect(98,96,5,9);ctx.fillRect(96,98,9,5);dot(99,99,3,color('#fff0bc'));
 if(state.projectile){const p=state.projectile,a=rad(p.angle),x=100+Math.cos(a)*p.radius,y=100+Math.sin(a)*p.radius;for(let n=1;n<=4;n++)dot(x+Math.cos(a)*n*3-1,y+Math.sin(a)*n*3-1,2,['',color('#b4a4e6'),color('#8474b6'),color('#554969'),color('#302e40')][n]);ctx.fillStyle=color('#d6caff');ctx.fillRect(Math.round(x)-3,Math.round(y)-2,7,5);ctx.fillRect(Math.round(x)-2,Math.round(y)-3,5,7);dot(x-1,y-1,3,color('#fff0d0'));}
 if(!running){ctx.fillStyle=color('#09110ec9');ctx.fillRect(51,162,98,18);ctx.fillStyle=color('#d8c98e');ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(completed?'WELL DEFENDED':loaded?'READY / PAUSED':'LOADING…',100,174);}

}
export function updateAttackRail(rail,{targetCenter,targetWidth,position}){
 rail.querySelector('.target').style.left=(targetCenter*100-targetWidth*50)+'%';
 rail.querySelector('.target').style.width=targetWidth*100+'%';
 if(position!==undefined)rail.querySelector('.marker').style.left=position*100+'%';
}
export function createColorChoices(round,onAnswer,palette){
 return round.choices.map(({word,ink,background},i)=>{
  const b=document.createElement('button');const direction=['up','left','right','down'][i];b.className=direction;b.setAttribute('aria-label',`${direction}: ${word.toUpperCase()}`);
  const arrow=document.createElement('span');arrow.className='direction';arrow.textContent=['↑','←','→','↓'][i];arrow.setAttribute('aria-hidden','true');
  const name=document.createElement('span');name.className='color-word';name.style.setProperty('--letters',word.length);name.textContent=word.toUpperCase();name.style.color=palette[ink];
  if(background)b.style.backgroundColor=palette[background];
  b.append(name,arrow);b.onclick=()=>onAnswer(word);return b;
 });
}
