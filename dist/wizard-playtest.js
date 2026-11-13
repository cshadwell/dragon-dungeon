import {installDialogueLayout} from './dialogue-layout.js?v=a06f70034131';
import {WIZARD_OPENING} from './dialogue-copy.js?v=a06f70034131';
import {createImageLoader,recoverArtwork} from './image-loader.js?v=a06f70034131';
import {installChallengePause} from './challenge-pause.js?v=a06f70034131';
import {createColorChoices} from './guardian-games.js?v=a06f70034131';
import {setupRoomControls} from './encounter-console.js?v=a06f70034131';
import {getCharacterPose} from './character-art.js?v=a06f70034131';
import {getRoomArt} from './room-art.js?v=a06f70034131';
import {makeRound,judge,STAGES,MIND_GOAL,mindProgress} from './wizard-mind-model.js?v=a06f70034131';
import {chooseWizardSpellPose,WIZARD_SPELL_POSES} from './wizard-spell-poses.js?v=a06f70034131';
installDialogueLayout();
const params=new URLSearchParams(location.search),integrated=params.get('encounter')==='1'&&parent!==window;
if(integrated)document.body.classList.add('wizard-intro');
const notify=(type,extra={})=>{if(integrated)parent.postMessage({type:'wizard-mind:'+type,...extra},location.origin);};
const savedCorrect=integrated&&params.get('refresher')!=='1'?Math.max(0,Math.min(MIND_GOAL,Number(params.get('correct'))||0)):0;
let reactionPose=5,dialogueIndex=null,spaceHeld=false;
const directions=[{key:'ArrowUp',label:'↑',position:'up'},{key:'ArrowLeft',label:'←',position:'left'},{key:'ArrowRight',label:'→',position:'right'},{key:'ArrowDown',label:'↓',position:'down'}];
const $=id=>document.getElementById(id),ctx=$('room').getContext('2d');ctx.imageSmoothingEnabled=false;
const palette={red:'#ef454b',blue:'#6b9eff',green:'#69ce80',orange:'#ff9740',purple:'#c195ec',white:'#f5f2e8',yellow:'#f5d54c'};
const suspension=installChallengePause(()=>{last=0;spaceHeld=false;heldArrows.clear();});
let stage=0,hits=0,misses=0,round=null,phase='idle',resumePhase='active',elapsed=0,wait=0,last=0,ready=false;
const openingDialogue=WIZARD_OPENING;
function showOpeningDialogue(){
 reactionPose=openingDialogue[dialogueIndex][0];$('message').textContent=openingDialogue[dialogueIndex][1];
 if(dialogueIndex===3){
   revealChallenge();
   round={answer:'blue',seconds:4,choices:['red','blue','green','yellow'].map(word=>({word,ink:word}))};
   renderChoices();
 }
 draw();
}
function revealChallenge(){
 document.body.classList.add('wizard-playing');
 document.querySelector('.challenge').hidden=false;
}
function roomAction(){
 if(!ready||$('room-menu').open)return;
 if(phase==='farewell'){ready=false;notify('leave');return;}
 if(dialogueIndex!==null){
   if(dialogueIndex<openingDialogue.length-1){dialogueIndex++;showOpeningDialogue();}
   else{dialogueIndex=null;if(mindProgress(savedCorrect).complete){stage=0;hits=0;}phase='idle';document.body.classList.add('wizard-training');begin();$('dialogue-continue').textContent='-Space Bar to pause-';}
 }else{
   $('start').click();$('dialogue-continue').textContent=phase==='paused'?'-Press Space Bar-':'-Space Bar to pause-';
 }
}
const load=createImageLoader();
let bg,wizard;const spellImages=new Map();
function draw(){if(!ready)return;ctx.clearRect(0,0,470,200);ctx.drawImage(bg,0,0,470,200);const id=phase==='active'||(phase==='feedback'&&stage===2)?round.pose:reactionPose;const pose=spellImages.get(id)||wizard;ctx.drawImage(pose,Math.round((470-pose.width)/2),192-pose.height);$('room').setAttribute('aria-label',`Wizard pose ${id} in his study`);}
function score(){$('score').textContent=`STAGE ${stage+1} / 3 · CORRECT ${hits} / ${STAGES[stage].hits} · MISSES ${misses}`;}
function disable(){for(const b of $('choices').children)b.disabled=phase!=='active';}
function renderChoices(){$('choices').replaceChildren(...createColorChoices(round,answer,palette));disable();}
function next(){round=makeRound(stage,Math.random,round?.answer);round.pose=chooseWizardSpellPose(round.answer);elapsed=0;phase='active';renderChoices();$('message').textContent=stage<2?'Watch the staff. Choose the matching written word.':'Trust the spell. Ignore the color of the lettering.';$('start').textContent='Pause';$('ready-cue').hidden=true;score();draw();}
function answer(word){if(suspension.paused||phase!=='active')return;const result=judge(round,word,elapsed);phase='feedback';wait=stage===2?.18:1.3;reactionPose=result==='correct'?6:result==='timeout'?4:5;if(result==='correct'){hits++;notify('progress',{correct:[0,3,7][stage]+hits});$('message').textContent='Correct. You saw through the distraction.';}else{misses++;$('message').textContent=result==='timeout'?'Too slow. Stay focused and try the next spell.':`The spell was ${round.answer.toUpperCase()}. Read the word, not the ink.`;}
if(hits===STAGES[stage].hits){if(stage===2){phase=integrated?'farewell':'done';reactionPose=3;notify('complete');$('message').textContent='Huzzah! You are indeed keen of mind. The dragon will surely test your intellect further, but stay focused and you will prevail. Fare thee well!';if(integrated)$('dialogue-continue').textContent='-Press Space Bar-';$('start').textContent='Play again';}else{$('message').textContent=stage===0?'Well done. Stay focused as the spells get faster. You have 3 seconds.':'Faster now. Keep your focus. You have 2 seconds.';reactionPose=3;wait=2;}}
disable();score();draw();}
$('start').onclick=()=>{if(phase==='idle'||phase==='done'){if(phase==='done'){stage=0;hits=0;misses=0;phase='idle';}begin();}else if(phase==='paused'){phase=resumePhase;$('start').textContent='Pause';disable();}else{resumePhase=phase;phase='paused';$('start').textContent='Resume';disable();}};
function begin(){if(stage===2)cue();else next();}
function cue(){phase='cue';wait=1.5;reactionPose=8;$('ready-cue').hidden=false;$('ready-cue').textContent='READY';$('start').textContent='Pause';disable();draw();}
function reset(){const progress=integrated?savedCorrect:0;const saved=mindProgress(progress);stage=saved.stage;hits=saved.hits;misses=0;round=null;phase=progress>=MIND_GOAL?'done':'idle';elapsed=0;reactionPose=progress>=MIND_GOAL?9:2;$('ready-cue').hidden=true;$('choices').replaceChildren();$('message').textContent=progress>=MIND_GOAL?'Your focus lesson is complete. The revealing lens is yours.':'The dragon will try to distract you. Match the spell to the written word. Trust what you see, not the ink. Use the matching arrow key or click.';$('start').textContent=progress>=MIND_GOAL?'Practice again':'Begin practice';score();draw();}
$('reset').onclick=reset;
const heldArrows=new Set();
window.addEventListener('keydown',event=>{
 if(integrated){
   if($('room-menu').open||suspension.paused)return;
   if(event.code==='Space'){event.preventDefault();if(!event.repeat&&!spaceHeld){spaceHeld=true;roomAction();}return;}
   if(event.key==='Escape'){event.preventDefault();$('journal').click();return;}
   if(dialogueIndex!==null||phase==='farewell')return;
 }
 const index=directions.findIndex(d=>d.key===event.key);if(index<0||event.altKey||event.ctrlKey||event.metaKey)return;event.preventDefault();if(event.repeat||heldArrows.has(event.key))return;heldArrows.add(event.key);if(phase==='active')answer(round.choices[index].word);});
window.addEventListener('keyup',event=>{if(event.code==='Space')spaceHeld=false;heldArrows.delete(event.key);});

function pause(){spaceHeld=false;heldArrows.clear();if(phase==='active'||phase==='feedback'||phase==='cue'){resumePhase=phase;phase='paused';$('start').textContent='Resume';disable();}}

function tick(now){const dt=last?Math.min((now-last)/1000,.1):0;last=now;if(!suspension.paused&&phase==='active'){elapsed+=dt;if(elapsed>=round.seconds)answer(null);}else if(!suspension.paused&&phase==='feedback'){wait-=dt;if(wait<=0){if(hits===STAGES[stage].hits){stage++;hits=0;if(stage===2){cue();return requestAnimationFrame(tick);}}next();}}
if(!suspension.paused&&phase==='cue'){wait-=dt;$('ready-cue').textContent=wait>.45?'READY':'GO';if(wait<=0)next();}
const remaining=Math.max(0,STAGES[stage].seconds-elapsed);$('timer').max=STAGES[stage].seconds;$('timer').value=remaining;$('time').textContent=remaining.toFixed(1)+' s';requestAnimationFrame(tick);}
recoverArtwork(()=>Promise.all([load(getRoomArt('wizard').url),load(getCharacterPose('wizard',1).url),...Array.from({length:34},(_,i)=>load(getCharacterPose('wizard',i+1).url))]),{message:$('message')}).then(images=>{[bg,wizard]=images;images.slice(2).forEach((image,i)=>spellImages.set(i+1,image));ready=true;reset();$('start').disabled=false;if(savedCorrect>=MIND_GOAL)notify('complete');
 if(integrated){
   const room=$('room'),scene=document.createElement('div');scene.className='stage';
   room.parentElement.insertBefore(scene,room);scene.append(room);
   const bottom=document.createElement('div');bottom.className='bottom';
   const guidance=document.querySelector('.guidance');guidance.classList.add('narrative');
   const controls=document.createElement('section');controls.className='frame controls';
   bottom.append(guidance,controls);document.querySelector('main').append(bottom);
   $('reset').id='trial-reset';$('message').textContent='';
   setupRoomControls({notify,prefix:'wizard-room',onAction:roomAction});
   const prompt=document.createElement('p');prompt.id='dialogue-continue';prompt.textContent='-Press Space Bar-';guidance.append(prompt);
   const challenge=document.querySelector('.challenge');challenge.hidden=true;bottom.append(challenge);
   if(params.get('refresher')==='1'){
     revealChallenge();document.body.classList.add('wizard-training');
     $('message').textContent='Match the spell color to its written name. Keep your focus. Ready?';
   }else{dialogueIndex=0;phase='intro';showOpeningDialogue();}
 }
 requestAnimationFrame(tick);}).catch(()=>{$('message').textContent='Artwork could not load. Reload to try again.';});

if(integrated){document.body.classList.add('integrated');$('reset').textContent='Return to maze';$('reset').onclick=()=>notify('leave');}
