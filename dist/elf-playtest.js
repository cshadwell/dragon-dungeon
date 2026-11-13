import {installDialogueLayout} from './dialogue-layout.js?v=351d764579df';
import {ELF_OPENING} from './dialogue-copy.js?v=351d764579df';
import {createImageLoader,recoverArtwork} from './image-loader.js?v=351d764579df';
import {installChallengePause} from './challenge-pause.js?v=351d764579df';
import {drawDefenceArena} from './guardian-games.js?v=351d764579df';
import {setupRoomControls} from './encounter-console.js?v=351d764579df';
import {ELF_DEFENCE_POSES} from './elf-defence-poses.js?v=351d764579df';
import {getCharacterPose} from './character-art.js?v=351d764579df';
import {getRoomArt} from './room-art.js?v=351d764579df';
import {DEFENCE_DEFAULTS,DEFENCE_STAGES,DEFENCE_GOAL,defenceProgress,ORBIT,SPAWN_RADIUS,freshDefence,spawnAttack,stepDefence} from './elf-defence-model.js?v=351d764579df';
installDialogueLayout();
const params=new URLSearchParams(location.search),integrated=params.get('encounter')==='1'&&parent!==window;
if(integrated)document.body.classList.add('elf-intro');
const notify=(type,extra={})=>{if(integrated)parent.postMessage({type:'elf-defence:'+type,...extra},location.origin);};
const artCache=new Map();let teaching=-1,reactionTime=0,poseNumber=1;
const $=id=>document.getElementById(id),canvas=$('arena'),ctx=canvas.getContext('2d'),keys=new Set(),pointers=new Map();
let settings={...DEFENCE_DEFAULTS},state=freshDefence(),running=false,loaded=false,last=null,nextAttack=0,attackNumber=0,flash=null,flashTime=0,stage=0,completed=false;
const openingDialogue=ELF_OPENING;
let dialogueIndex=null,spaceHeld=false,farewell=false;
const suspension=installChallengePause(()=>{last=null;spaceHeld=false;clearInputs();});
function showOpeningDialogue(){
 const [pose,text]=openingDialogue[dialogueIndex];
 showPose(pose);$('message').textContent=text;
 if(dialogueIndex===3){
   document.body.classList.add('elf-defending');
   const main=document.querySelector('main'),strip=document.querySelector('.railbox');
   main.append(strip);
   strip.append(document.querySelector('.movement-pad'));
   document.querySelector('.arena-panel').hidden=false;
 }
}
function roomAction(){
 if(!loaded||$('room-menu').open)return;
 if(farewell){loaded=false;notify('leave');return;}
 if(dialogueIndex!==null){
   if(dialogueIndex<openingDialogue.length-1){dialogueIndex++;showOpeningDialogue();}
   else{dialogueIndex=null;$('start').click();$('dialogue-continue').textContent='-Space Bar to pause-';}
 }else{
   $('start').click();
   $('dialogue-continue').textContent=running?'-Space Bar to pause-':'-Press Space Bar-';
 }
}
function showPose(number){poseNumber=number;const pose=getCharacterPose('elf',number),c=$('room').getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,470,200);c.drawImage(artCache.get('room'),0,0,470,200);c.drawImage(artCache.get(number),Math.round((470-pose.width)/2),192-pose.height,pose.width,pose.height);$('room').setAttribute('aria-label','Elf Queen pose '+number+' in her shrine');}
const lessons=[
 '“The dragon attacks from every side. Defence begins with watching where danger approaches.”',
 '“You have one shield. Hold left or right to rotate it; release to keep your guard in place.”',
 '“Meet each wisp before it reaches you. Both directions together hold your shield still; they do not guard every side.”',
 '“Speed will rise from 60 to 65 to 70. Block three slow attacks, four medium attacks, then five fast attacks. At the end, the next attack comes almost at once. Stay ready.”'
];
function explain(){pause();teaching=0;reactionTime=0;showLesson();}
function showLesson(){showPose(ELF_DEFENCE_POSES.defenceExplanation[teaching]);$('message').textContent=lessons[teaching];$('start').textContent=teaching===3?'Ready to defend':'Next lesson';}
const rad=a=>a*Math.PI/180;
function inputs(){return {left:keys.has('ArrowLeft')||keys.has('KeyA')||[...pointers.values()].includes('left'),right:keys.has('ArrowRight')||keys.has('KeyD')||[...pointers.values()].includes('right')};}
function updateControls(){const input=inputs();$('left').setAttribute('aria-pressed',String(input.left));$('right').setAttribute('aria-pressed',String(input.right));}
function clearInputs(){keys.clear();pointers.clear();updateControls();}
function scores(){const progress=defenceProgress(state.blocks);$('score').textContent=completed?`TRAINING COMPLETE · ${state.blocks} BLOCKS · ${state.misses} MISSES`:`STAGE ${stage+1} / 3 · BLOCKS ${progress.stageBlocks} / ${progress.stageGoal} · MISSES ${state.misses}`;}
function tune(){settings={shieldSize:Number($('size').value),shieldSpeed:Number($('shield-speed').value),attackSpeed:Number($('attack-speed').value)};$('size-value').textContent=settings.shieldSize+'°';$('shield-speed-value').textContent=settings.shieldSpeed+'°/s';$('attack-speed-value').textContent=settings.attackSpeed+' px/s';const flight=(SPAWN_RADIUS-ORBIT)/settings.attackSpeed,turn=180/settings.shieldSpeed;$('timing').textContent=`Time to shield: ${flight.toFixed(2)}s · Half-turn: ${turn.toFixed(2)}s. `+(flight<turn?'Fast attacks may require anticipating the next direction.':`Next wisp: ${DEFENCE_STAGES[stage].gap.toFixed(2)}s after result. Changes apply immediately.`);}
function pause(message){running=false;clearInputs();last=null;$('start').textContent='Resume practice';if(message)$('message').textContent=message;}
function reset(){teaching=-1;reactionTime=0;if(loaded)showPose(1);stage=0;completed=false;$('size').value=DEFENCE_DEFAULTS.shieldSize;$('shield-speed').value=DEFENCE_DEFAULTS.shieldSpeed;$('attack-speed').value=DEFENCE_DEFAULTS.attackSpeed;tune();state=freshDefence();running=false;attackNumber=0;nextAttack=0;flash=null;flashTime=0;last=null;clearInputs();scores();$('start').textContent='Begin practice';$('message').textContent='“Watch what approaches, then move your shield to meet it.”';draw();}
function dot(x,y,w,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,w);}
function ring(radius,color,step=2){for(let deg=0;deg<360;deg+=step)dot(100+Math.cos(rad(deg))*radius,100+Math.sin(rad(deg))*radius,1,color);}
function draw(){drawDefenceArena(ctx,state,settings,{flash,running,loaded,completed});}
function tick(now){const dt=last===null?0:Math.min(.05,(now-last)/1000);last=now;
 if(running&&!document.hidden&&!suspension.paused){if(!state.projectile){nextAttack-=dt;if(nextAttack<=0){const angle=attackNumber===0?270:Math.random()*360;state=spawnAttack(state,angle);attackNumber++;}}
 state=stepDefence(state,dt,inputs(),settings);
 if(state.result){
 flash=state.result;flashTime=.3;notify('progress',{blocks:state.blocks});
 const progress=defenceProgress(state.blocks),previousStage=stage;stage=progress.stage;
 if(stage!==previousStage){$('attack-speed').value=DEFENCE_STAGES[stage].attackSpeed;tune();}
 nextAttack=DEFENCE_STAGES[stage].gap;
 $('message').textContent=stage!==previousStage?(stage===1?'“Good. A little faster now. Keep your guard moving.”':'“Now stay on your toes. The next attack follows straight after your block.”'):state.result==='block'?'“Well guarded. Watch for the next approach.”':'“That slipped past. Find the next attack; your successful blocks still count.”';
 reactionTime=stage!==previousStage?.8:.55;showPose(stage!==previousStage?ELF_DEFENCE_POSES.stageCompleted[0]:state.result==='block'?ELF_DEFENCE_POSES.successfulBlock[0]:ELF_DEFENCE_POSES.miss[state.misses%2]);
 if(progress.complete){notify('complete');showPose(ELF_DEFENCE_POSES.challengeCompleted[1]);reactionTime=0;completed=true;running=false;clearInputs();$('start').textContent='Try training again';$('message').textContent='“You have shown your skill. One shield, clear eyes, and a steady guard.”';
 if(integrated){farewell=true;showPose(2);$('message').textContent="Well done! You are light of foot and strong of heart. The dragon will be swift with his attacks but you show true courage. Farewell!";$('dialogue-continue').textContent='-Press Space Bar-';}}
 scores();
 }
 }
 if(!suspension.paused&&reactionTime>0){reactionTime-=dt;if(reactionTime<=0&&teaching<0&&!completed)showPose(ELF_DEFENCE_POSES.readyTeaching[0]);}
 if(!suspension.paused&&flashTime>0){flashTime-=dt;if(flashTime<=0)flash=null;}draw();requestAnimationFrame(tick);
}
function bindShieldButton(direction){const button=$(direction);button.setAttribute('aria-pressed','false');button.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();button.setPointerCapture(e.pointerId);pointers.set(e.pointerId,direction);updateControls();});for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,e=>{pointers.delete(e.pointerId);updateControls();});button.addEventListener('contextmenu',e=>e.preventDefault());}
for(const direction of ['left','right'])bindShieldButton(direction);
document.addEventListener('keydown',e=>{
 if(integrated){
   if($('room-menu').open||suspension.paused)return;
   if(e.code==='Space'){e.preventDefault();if(!e.repeat&&!spaceHeld){spaceHeld=true;roomAction();}return;}
   if(e.code==='Escape'){e.preventDefault();$('journal').click();return;}
   if(dialogueIndex!==null||farewell)return;
 }if(e.target.tagName==='INPUT'||!['ArrowLeft','ArrowRight','KeyA','KeyD'].includes(e.code))return;e.preventDefault();keys.add(e.code);updateControls();});document.addEventListener('keyup',e=>{if(e.code==='Space')spaceHeld=false;keys.delete(e.code);updateControls();});

$('start').onclick=()=>{if(!loaded)return;if(teaching>=0){teaching++;if(teaching<4){showLesson();return;}teaching=-1;showPose(2);$('message').textContent='“Ready? Watch the first approach.”';$('start').textContent='Begin practice';return;}if(completed)reset();if(running)pause('“Take a breath. Resume when you are ready.”');else{clearInputs();running=true;last=null;$('start').textContent='Pause practice';$('message').textContent='“One shield. Watch the wisp and rotate into its path.”';}};$('reset').onclick=reset;
for(const id of ['size','shield-speed','attack-speed'])$(id).oninput=tune;$('defaults').onclick=()=>{$('size').value=DEFENCE_DEFAULTS.shieldSize;$('shield-speed').value=DEFENCE_DEFAULTS.shieldSpeed;$('attack-speed').value=DEFENCE_STAGES[stage].attackSpeed;tune();};
const image=createImageLoader();
tune();scores();draw();
recoverArtwork(()=>Promise.all([image(getRoomArt('elf').url).then(im=>artCache.set('room',im)),...Array.from({length:13},(_,i)=>i+1).map(n=>image(getCharacterPose('elf',n).url).then(im=>artCache.set(n,im)))]),{message:$('message')}).then(()=>{
 loaded=true;showPose(1);$('start').disabled=false;$('start').textContent='Begin practice';
 const lessonButton=document.createElement('button');lessonButton.className='secondary';lessonButton.textContent='Defence lesson';lessonButton.onclick=explain;document.querySelector('.actions').append(lessonButton);
 if(integrated){
  document.querySelector('.tuning').hidden=true;$('reset').hidden=true;document.querySelector('footer').textContent='THE ELF QUEEN’S SHRINE · DEFENCE TRAINING';
  const saved=Number(params.get('blocks'));if(Number.isInteger(saved)&&saved>=0&&saved<=DEFENCE_GOAL){state.blocks=saved;stage=defenceProgress(saved).stage;$('attack-speed').value=DEFENCE_STAGES[stage].attackSpeed;tune();scores();}

  if(params.get('completed')==='true'||state.blocks>=DEFENCE_GOAL){if(state.blocks>=DEFENCE_GOAL&&params.get('completed')!=='true')notify('complete');completed=true;showPose(6);$('start').textContent='Try training again';$('message').textContent='“Your seal is yours to keep. You may train again whenever you wish.”';scores();}
  else if(!state.blocks)explain();else $('message').textContent='“Welcome back. Your successful blocks are remembered.”';
 }
 if(integrated){
   teaching=-1;reactionTime=0;running=false;clearInputs();showPose(1);
   const room=$('room'),scene=document.createElement('div');scene.className='stage';
   room.parentElement.insertBefore(scene,room);scene.append(room);
   const strip=document.createElement('div');strip.className='railbox';scene.parentElement.append(strip);
   const bottom=document.createElement('div');bottom.className='bottom';
   const guidance=document.querySelector('.guidance');guidance.classList.add('narrative');
   const controls=document.createElement('section');controls.className='frame controls';
   bottom.append(guidance,controls);document.querySelector('main').append(bottom);
   $('reset').id='trial-reset';
   $('message').textContent='';
   setupRoomControls({notify,prefix:'elf-room',onAction:roomAction});
   const prompt=document.createElement('p');prompt.id='dialogue-continue';prompt.textContent='-Press Space Bar-';guidance.append(prompt);
   const arenaPanel=document.querySelector('.arena-panel');arenaPanel.hidden=true;document.querySelector('main').append(arenaPanel);
   for(const direction of ['left','right']){
     $(direction).id='legacy-'+direction;
     const button=controls.querySelector('[data-action="'+direction+'"]');
     button.id=direction;
     button.setAttribute('aria-label',direction==='left'?'Rotate shield counterclockwise':'Rotate shield clockwise');
     bindShieldButton(direction);
   }
   if(params.get('refresher')==='1'){
     reset();dialogueIndex=3;showOpeningDialogue();dialogueIndex=null;showPose(1);
     $('message').textContent='Watch each incoming attack and move your shield into its path. Ready?';
   }else{dialogueIndex=0;showOpeningDialogue();}
 }
 requestAnimationFrame(tick);
}).catch(()=>{$('message').textContent='The approved artwork could not load. Reload to try again.';});
