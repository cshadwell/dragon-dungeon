import {playClosingScene} from './closing-scene.js?v=5847e2b65376';
import {installDialogueLayout} from './dialogue-layout.js?v=5847e2b65376';
import {DRAGON_OPENING} from './dialogue-copy.js?v=5847e2b65376';
import {createImageLoader,recoverArtwork} from './image-loader.js?v=5847e2b65376';
import {createEndingAudio} from './ending-audio.js?v=5847e2b65376';
import {dragonGaugeFrame} from './dragon-warmup-model.js?v=5847e2b65376';
import {setupDragonWarmup} from './dragon-warmup.js?v=5847e2b65376';
import {getCharacterPose} from './character-art.js?v=5847e2b65376';
import {getRoomArt} from './room-art.js?v=5847e2b65376';
import {setupRoomControls} from './encounter-console.js?v=5847e2b65376';
installDialogueLayout();

const integrated=window.parent!==window;
const notify=type=>{if(integrated)parent.postMessage({type:'dragon-room:'+type},location.origin);};
const dialogue=DRAGON_OPENING;
let dialogueIndex=0,artReady=false,roomImage,plaqueImage,closingStarted=false,roomMuted=false;
window.addEventListener('message',event=>{if(event.source===parent&&event.origin===location.origin&&event.data?.type==='dragon-room:sound')roomMuted=event.data.muted;});
const standaloneEnding=integrated?null:createEndingAudio(new Audio('./assets/audio/victory.wav'),new Audio('./assets/audio/ending.mp3'));
const poseImages=new Map();
let gaugeImage=null;
const message=document.getElementById('message');
const prompt=document.createElement('p');prompt.id='dialogue-continue';prompt.textContent='-Press Space Bar-';document.querySelector('.narrative').append(prompt);
const loadImage=createImageLoader();
let loadingArt=false,poseRequest=0;
const recoverArt=task=>recoverArtwork(task,{message});
function artPause(active){loadingArt=active;window.dispatchEvent(new CustomEvent('encounter:pause',{detail:{reason:'art',active}}));}
function showDialogue(){
  const [number,text]=dialogue[dialogueIndex];
  message.textContent=text;
  document.getElementById('dragon-gauge').hidden=dialogueIndex<4;
  showPose(number);
}
function showPose(number,spellColor=null,spellName=''){
  if(!artReady)return;
  if(!poseImages.has(number)){
   const token=++poseRequest;artPause(true);const saved=message.textContent;
   recoverArt(()=>loadImage(getCharacterPose('dragon',number).url)).then(image=>{poseImages.set(number,image);if(token!==poseRequest)return;message.textContent=saved;showPose(number,spellColor,spellName);artPause(false);});return;
  }
  const pose=getCharacterPose('dragon',number),canvas=document.getElementById('room'),ctx=canvas.getContext('2d');
  ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,470,200);
  ctx.drawImage(roomImage,0,0,470,200);
  ctx.drawImage(poseImages.get(number),Math.round((470-pose.width)/2),192-pose.height,pose.width,pose.height);
  canvas.setAttribute('aria-label',`Dragon pose ${number} in the volcanic lair${spellColor?' casting '+(spellName==='orange'?'an ':'a ')+spellName+' spell':''}`);
}
function showMeter(level){
  const canvas=document.getElementById('dragon-gauge');
  canvas.setAttribute('aria-label',`Life meter level ${level} of 10${level===10?' — full':level===0?' — empty':''}`);
  canvas.dataset.level=level;
  if(!gaugeImage)return;
  const left=[29,106,184,261,338,416,493,570,648,725,802][dragonGaugeFrame(level)];
  const ctx=canvas.getContext('2d');ctx.clearRect(0,0,71,304);ctx.imageSmoothingEnabled=false;
  ctx.drawImage(gaugeImage,left,32,71,304,0,0,71,304);
  const pixels=ctx.getImageData(0,0,71,304);
  for(let i=0;i<pixels.data.length;i+=4){
    if(pixels.data[i]>240&&pixels.data[i+1]>240&&pixels.data[i+2]>240)pixels.data[i+3]=0;
  }
  ctx.putImageData(pixels,0,0);
}
async function revealPrize(animate=true){
 if(!plaqueImage){artPause(true);plaqueImage=await recoverArt(()=>loadImage('./assets/ending/chaz-golden-plaque.png'));artPause(false);}
 const canvas=document.getElementById('room'),ctx=canvas.getContext('2d'),pose=getCharacterPose('dragon',4);
 document.getElementById('dragon-gauge').hidden=true;
 function draw(alpha,plaque=0){
  ctx.imageSmoothingEnabled=false;ctx.globalAlpha=1;ctx.clearRect(0,0,470,200);ctx.drawImage(roomImage,0,0,470,200);
  if(alpha>0){ctx.globalAlpha=alpha;ctx.drawImage(poseImages.get(4),Math.round((470-pose.width)/2),192-pose.height,pose.width,pose.height);}
  if(plaque>0){ctx.globalAlpha=plaque;ctx.drawImage(plaqueImage,0,0,470,200);}ctx.globalAlpha=1;
 }
 function fade(duration,render){return new Promise(resolve=>{const start=performance.now();function step(now){const t=Math.min(1,(now-start)/duration);render(Math.floor(t*10)/10);if(t<1)requestAnimationFrame(step);else resolve();}requestAnimationFrame(step);});}
 if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){await fade(900,t=>draw(1-t));await fade(1400,t=>draw(0,t));}
 draw(0,1);canvas.setAttribute('aria-label','Golden plaque revealing the dragon’s true name: CHAZ');notify('prize');
 if(!integrated&&!animate)standaloneEnding.resume();
 if(!closingStarted){closingStarted=true;document.body.classList.add('closing');playClosingScene({muted:roomMuted,stopMusic:()=>{if(integrated)notify('credits-finished');else standaloneEnding.stop();}});}
}
function advanceDialogue(){
  if(!artReady||loadingArt||document.getElementById('room-menu').open)return;
  if(warmup.isActive()){warmup.strike();return;}
  if(dialogueIndex<dialogue.length-1){dialogueIndex++;showDialogue();}
  else warmup.start();
}
const warmup=setupDragonWarmup({showPose,message,prompt,action:advanceDialogue,onDefeat:()=>notify('banish'),onVictory:()=>{document.getElementById('dragon-gauge').hidden=true;if(integrated)notify('victory');else standaloneEnding.start();},onPrize:revealPrize,onMeter:showMeter,onMenu:()=>{if(integrated)notify('journal');}});
if(integrated)setupRoomControls({notify,prefix:'dragon-room',onAction:advanceDialogue});
showDialogue();
recoverArt(()=>Promise.all([
 loadImage(getRoomArt('dragon').url).then(image=>{roomImage=image;}),
 loadImage(getCharacterPose('dragon',12).url).then(image=>poseImages.set(12,image)),
 loadImage('./assets/ui/dragon-gauge-source.png').then(image=>{gaugeImage=image;showMeter(10);})
])).then(()=>{
 artReady=true;
 // Optional prefetch cannot block the opening or make one unused pose fatal.
 for(const number of [1,4,6,7,8,10,11,15,16,17,18,19,20,22,23,27,...Array.from({length:21},(_,i)=>i+38)]){
  loadImage(getCharacterPose('dragon',number).url).then(image=>poseImages.set(number,image)).catch(()=>{});
 }
 const params=new URLSearchParams(location.search);
 if(params.get('ending')==='earned')warmup.showEarned();
 else if(params.get('ending')==='victory'||params.get('playtest')==='ending')warmup.previewVictory();
 else if(params.get('playtest')==='final'){document.getElementById('dragon-gauge').hidden=false;warmup.previewFinal();}
 else showDialogue();
});

// Draw the frame on a two-screen-pixel grid so its ornaments stay crisp on resize.
function drawFrame(frame,canvas){
  if(!frame.clientWidth||!frame.clientHeight)return;
  const w=Math.floor(frame.clientWidth/2),h=Math.floor(frame.clientHeight/2);
  canvas.width=w;canvas.height=h;
  const ctx=canvas.getContext('2d');
  const rect=(x,y,width,height,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,width,height);};
  function outline(inset,color){
    rect(inset,inset,w-2*inset,1,color);rect(inset,h-inset-1,w-2*inset,1,color);
    rect(inset,inset,1,h-2*inset,color);rect(w-inset-1,inset,1,h-2*inset,color);
  }
  outline(0,'#6b656b');outline(1,'#27252a');outline(2,'#191419');outline(3,'#602b30');outline(5,'#8b6560');
  for(let x=20;x<w-18;x+=14){
    rect(x,1,6,1,'#65575e');rect(x+2,2,2,1,'#65575e');rect(x,h-3,6,1,'#65575e');
  }
  for(const [x,y,dx,dy] of [[0,0,1,1],[w,0,-1,1],[0,h,1,-1],[w,h,-1,-1]]){
    for(let step=0;step<3;step++){
      const px=x+dx*(1+step*2),py=y+dy*(1+step*2);
      rect(px-(dx<0?4:0),py-(dy<0?4:0),4,4,'#8e8286');
      rect(px-(dx<0?3:0),py-(dy<0?3:0),3,3,'#3d303a');
    }
    rect(x+dx*3-1,y+dy*3-1,2,2,'#a3534a');
  }
  const center=Math.floor(w/2);
  for(let row=0;row<7;row++){
    const half=3-Math.abs(row-3);
    rect(center-half,row,half*2+1,1,'#82656b');
  }
  rect(center,1,1,4,'#d76731');
}
document.querySelectorAll('.frame').forEach(frame=>{
  const canvas=document.createElement('canvas');canvas.className='forged-border';canvas.setAttribute('aria-hidden','true');
  frame.append(canvas);
  const resize=new ResizeObserver(()=>drawFrame(frame,canvas));resize.observe(frame);
});
window.addEventListener('keydown',event=>{
  if(!warmup.isActive()&&!document.getElementById('room-menu').open&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(event.code)){
    event.preventDefault();
    if(event.code==='Space'&&!event.repeat&&(event.target.tagName!=='BUTTON'||event.target.id==='space-action'))advanceDialogue();
  }
});
