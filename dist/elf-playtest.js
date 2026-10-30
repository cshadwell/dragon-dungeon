import {ELF_DEFENCE_POSES} from './elf-defence-poses.js?v=9b095cd0d72d';
import {getCharacterPose} from './character-art.js?v=9b095cd0d72d';
import {getRoomArt} from './room-art.js?v=9b095cd0d72d';
import {DEFENCE_DEFAULTS,DEFENCE_STAGES,BLOCKS_PER_STAGE,defenceProgress,ORBIT,SPAWN_RADIUS,freshDefence,spawnAttack,stepDefence} from './elf-defence-model.js?v=9b095cd0d72d';
const params=new URLSearchParams(location.search),integrated=params.get('encounter')==='1'&&parent!==window;
const notify=(type,extra={})=>{if(integrated)parent.postMessage({type:'elf-defence:'+type,...extra},location.origin);};
const artCache=new Map();let teaching=-1,reactionTime=0,poseNumber=1;
const $=id=>document.getElementById(id),canvas=$('arena'),ctx=canvas.getContext('2d'),keys=new Set(),pointers=new Map();
let settings={...DEFENCE_DEFAULTS},state=freshDefence(),running=false,loaded=false,last=null,nextAttack=0,attackNumber=0,flash=null,flashTime=0,stage=0,completed=false;
function showPose(number){poseNumber=number;const pose=getCharacterPose('elf',number),c=$('room').getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,470,200);c.drawImage(artCache.get('room'),0,0,470,200);c.drawImage(artCache.get(number),Math.round((470-pose.width)/2),192-pose.height,pose.width,pose.height);$('room').setAttribute('aria-label','Elf Queen pose '+number+' in her shrine');}
const lessons=[
 '“The dragon attacks from every side. Defence begins with watching where danger approaches.”',
 '“You have one shield. Hold left or right to rotate it; release to keep your guard in place.”',
 '“Meet each wisp before it reaches you. Both directions together hold your shield still; they do not guard every side.”',
 '“Speed will rise from 60 to 65 to 70. Block three in each stage. At the end, the next attack comes almost at once. Stay ready.”'
];
function explain(){pause();teaching=0;reactionTime=0;showLesson();}
function showLesson(){showPose(ELF_DEFENCE_POSES.defenceExplanation[teaching]);$('message').textContent=lessons[teaching];$('start').textContent=teaching===3?'Ready to defend':'Next lesson';}
const rad=a=>a*Math.PI/180;
function inputs(){return {left:keys.has('ArrowLeft')||keys.has('KeyA')||[...pointers.values()].includes('left'),right:keys.has('ArrowRight')||keys.has('KeyD')||[...pointers.values()].includes('right')};}
function updateControls(){const input=inputs();$('left').setAttribute('aria-pressed',String(input.left));$('right').setAttribute('aria-pressed',String(input.right));}
function clearInputs(){keys.clear();pointers.clear();updateControls();}
function scores(){const progress=defenceProgress(state.blocks);$('score').textContent=completed?`TRAINING COMPLETE · ${state.blocks} BLOCKS · ${state.misses} MISSES`:`STAGE ${stage+1} / 3 · BLOCKS ${progress.stageBlocks} / ${BLOCKS_PER_STAGE} · MISSES ${state.misses}`;}
function tune(){settings={shieldSize:Number($('size').value),shieldSpeed:Number($('shield-speed').value),attackSpeed:Number($('attack-speed').value)};$('size-value').textContent=settings.shieldSize+'°';$('shield-speed-value').textContent=settings.shieldSpeed+'°/s';$('attack-speed-value').textContent=settings.attackSpeed+' px/s';const flight=(SPAWN_RADIUS-ORBIT)/settings.attackSpeed,turn=180/settings.shieldSpeed;$('timing').textContent=`Time to shield: ${flight.toFixed(2)}s · Half-turn: ${turn.toFixed(2)}s. `+(flight<turn?'Fast attacks may require anticipating the next direction.':`Next wisp: ${DEFENCE_STAGES[stage].gap.toFixed(2)}s after result. Changes apply immediately.`);}
function pause(message){running=false;clearInputs();last=null;$('start').textContent='Resume practice';if(message)$('message').textContent=message;}
function reset(){teaching=-1;reactionTime=0;if(loaded)showPose(1);stage=0;completed=false;$('size').value=DEFENCE_DEFAULTS.shieldSize;$('shield-speed').value=DEFENCE_DEFAULTS.shieldSpeed;$('attack-speed').value=DEFENCE_DEFAULTS.attackSpeed;tune();state=freshDefence();running=false;attackNumber=0;nextAttack=0;flash=null;flashTime=0;last=null;clearInputs();scores();$('start').textContent='Begin practice';$('message').textContent='“Watch what approaches, then move your shield to meet it.”';draw();}
function dot(x,y,w,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,w);}
function ring(radius,color,step=2){for(let deg=0;deg<360;deg+=step)dot(100+Math.cos(rad(deg))*radius,100+Math.sin(rad(deg))*radius,1,color);}
function draw(){ctx.imageSmoothingEnabled=false;ctx.fillStyle='#09110e';ctx.fillRect(0,0,200,200);ring(91,'#526044');ring(89,'#273c2b');for(let deg=0;deg<360;deg+=15)dot(99+Math.cos(rad(deg))*91,99+Math.sin(rad(deg))*91,3,'#a99c62');ring(ORBIT,'#354637',9);
 // A single physical arc. No separate shields or instant directional snapping.
 for(let offset=-settings.shieldSize/2;offset<=settings.shieldSize/2;offset+=1.5){const a=rad(state.angle+offset);dot(99+Math.cos(a)*ORBIT,99+Math.sin(a)*ORBIT,3,flash==='block'?'#fff0bb':'#b5c2af');dot(100+Math.cos(a)*(ORBIT-2),100+Math.sin(a)*(ORBIT-2),2,'#5e8c65');}
 const hurt=flash==='miss';ctx.fillStyle=hurt?'#c0654c':'#806b35';ctx.fillRect(97,94,7,13);ctx.fillRect(94,97,13,7);ctx.fillStyle=hurt?'#ffa575':'#edcd77';ctx.fillRect(98,96,5,9);ctx.fillRect(96,98,9,5);dot(99,99,3,'#fff0bc');
 if(state.projectile){const p=state.projectile,a=rad(p.angle),x=100+Math.cos(a)*p.radius,y=100+Math.sin(a)*p.radius;for(let n=1;n<=4;n++)dot(x+Math.cos(a)*n*3-1,y+Math.sin(a)*n*3-1,2,['','#b4a4e6','#8474b6','#554969','#302e40'][n]);ctx.fillStyle='#d6caff';ctx.fillRect(Math.round(x)-3,Math.round(y)-2,7,5);ctx.fillRect(Math.round(x)-2,Math.round(y)-3,5,7);dot(x-1,y-1,3,'#fff0d0');}
 if(!running){ctx.fillStyle='#09110ec9';ctx.fillRect(51,162,98,18);ctx.fillStyle='#d8c98e';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(completed?'WELL DEFENDED':loaded?'READY / PAUSED':'LOADING…',100,174);}
}
function tick(now){const dt=last===null?0:Math.min(.05,(now-last)/1000);last=now;
 if(running&&!document.hidden){if(!state.projectile){nextAttack-=dt;if(nextAttack<=0){const angle=attackNumber===0?270:Math.random()*360;state=spawnAttack(state,angle);attackNumber++;}}
 state=stepDefence(state,dt,inputs(),settings);
 if(state.result){
 flash=state.result;flashTime=.3;notify('progress',{blocks:state.blocks});
 const progress=defenceProgress(state.blocks),previousStage=stage;stage=progress.stage;
 if(stage!==previousStage){$('attack-speed').value=DEFENCE_STAGES[stage].attackSpeed;tune();}
 nextAttack=DEFENCE_STAGES[stage].gap;
 $('message').textContent=stage!==previousStage?(stage===1?'“Good. A little faster now. Keep your guard moving.”':'“Now stay on your toes. The next attack follows straight after your block.”'):state.result==='block'?'“Well guarded. Watch for the next approach.”':'“That slipped past. Find the next attack; your successful blocks still count.”';
 reactionTime=stage!==previousStage?.8:.55;showPose(stage!==previousStage?ELF_DEFENCE_POSES.stageCompleted[0]:state.result==='block'?ELF_DEFENCE_POSES.successfulBlock[0]:ELF_DEFENCE_POSES.miss[state.misses%2]);
 if(progress.complete){notify('complete');showPose(ELF_DEFENCE_POSES.challengeCompleted[1]);reactionTime=0;completed=true;running=false;clearInputs();$('start').textContent='Try training again';$('message').textContent='“You have shown your skill. One shield, clear eyes, and a steady guard.”';}
 scores();
 }
 }
 if(reactionTime>0){reactionTime-=dt;if(reactionTime<=0&&teaching<0&&!completed)showPose(ELF_DEFENCE_POSES.readyTeaching[0]);}
 if(flashTime>0){flashTime-=dt;if(flashTime<=0)flash=null;}draw();requestAnimationFrame(tick);
}
for(const direction of ['left','right']){const button=$(direction);button.setAttribute('aria-pressed','false');button.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();button.setPointerCapture(e.pointerId);pointers.set(e.pointerId,direction);updateControls();});for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,e=>{pointers.delete(e.pointerId);updateControls();});button.addEventListener('contextmenu',e=>e.preventDefault());}
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||!['ArrowLeft','ArrowRight','KeyA','KeyD'].includes(e.code))return;e.preventDefault();keys.add(e.code);updateControls();});document.addEventListener('keyup',e=>{keys.delete(e.code);updateControls();});
window.addEventListener('blur',()=>{if(running)pause('Practice paused. Resume when you’re ready.');else clearInputs();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)pause('Practice paused while you were away.');last=null;});
$('start').onclick=()=>{if(!loaded)return;if(teaching>=0){teaching++;if(teaching<4){showLesson();return;}teaching=-1;showPose(2);$('message').textContent='“Ready? Watch the first approach.”';$('start').textContent='Begin practice';return;}if(completed)reset();if(running)pause('“Take a breath. Resume when you are ready.”');else{clearInputs();running=true;last=null;$('start').textContent='Pause practice';$('message').textContent='“One shield. Watch the wisp and rotate into its path.”';}};$('reset').onclick=reset;
for(const id of ['size','shield-speed','attack-speed'])$(id).oninput=tune;$('defaults').onclick=()=>{$('size').value=DEFENCE_DEFAULTS.shieldSize;$('shield-speed').value=DEFENCE_DEFAULTS.shieldSpeed;$('attack-speed').value=DEFENCE_STAGES[stage].attackSpeed;tune();};
function image(url){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=url;});}
tune();scores();draw();
Promise.all([image(getRoomArt('elf').url).then(im=>artCache.set('room',im)),...Array.from({length:13},(_,i)=>i+1).map(n=>image(getCharacterPose('elf',n).url).then(im=>artCache.set(n,im)))]).then(()=>{
 loaded=true;showPose(1);$('start').disabled=false;$('start').textContent='Begin practice';
 const lessonButton=document.createElement('button');lessonButton.className='secondary';lessonButton.textContent='Defence lesson';lessonButton.onclick=explain;document.querySelector('.actions').append(lessonButton);
 if(integrated){
  document.querySelector('.tuning').hidden=true;$('reset').hidden=true;document.querySelector('footer').textContent='THE ELF QUEEN’S SHRINE · DEFENCE TRAINING';
  const saved=Number(params.get('blocks'));if(Number.isInteger(saved)&&saved>=0&&saved<=9){state.blocks=saved;stage=defenceProgress(saved).stage;$('attack-speed').value=DEFENCE_STAGES[stage].attackSpeed;tune();scores();}
  const leave=document.createElement('button');leave.className='secondary';leave.textContent='Return to the maze';leave.onclick=()=>notify('leave');document.querySelector('.actions').append(leave);
  if(params.get('completed')==='true'||state.blocks>=9){if(state.blocks>=9&&params.get('completed')!=='true')notify('complete');completed=true;showPose(6);$('start').textContent='Try training again';$('message').textContent='“Your seal is yours to keep. You may train again whenever you wish.”';scores();}
  else if(!state.blocks)explain();else $('message').textContent='“Welcome back. Your successful blocks are remembered.”';
 }
 requestAnimationFrame(tick);
}).catch(()=>{$('message').textContent='The approved artwork could not load. Reload to try again.';});
