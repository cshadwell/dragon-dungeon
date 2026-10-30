import {getCharacterPose} from './character-art.js?v=9b095cd0d72d';
import {getRoomArt} from './room-art.js?v=9b095cd0d72d';
import {makeRound,judge,STAGES} from './wizard-mind-model.js?v=9b095cd0d72d';
import {chooseWizardSpellPose} from './wizard-spell-poses.js?v=9b095cd0d72d';
const params=new URLSearchParams(location.search),integrated=params.get('encounter')==='1'&&parent!==window;
const notify=(type,extra={})=>{if(integrated)parent.postMessage({type:'wizard-mind:'+type,...extra},location.origin);};
const savedCorrect=integrated?Math.max(0,Math.min(9,Number(params.get('correct'))||0)):0;
let reactionPose=2;
const directions=[{key:'ArrowUp',label:'↑',position:'up'},{key:'ArrowLeft',label:'←',position:'left'},{key:'ArrowRight',label:'→',position:'right'},{key:'ArrowDown',label:'↓',position:'down'}];
const $=id=>document.getElementById(id),ctx=$('room').getContext('2d');ctx.imageSmoothingEnabled=false;
const palette={red:'#ef454b',blue:'#6b9eff',green:'#69ce80',orange:'#ff9740',purple:'#c195ec',white:'#f5f2e8',yellow:'#f5d54c'};
let stage=0,hits=0,misses=0,round=null,phase='idle',resumePhase='active',elapsed=0,wait=0,last=0,ready=false;
function load(url){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=url;});}
let bg,wizard;const spellImages=new Map();
function draw(){if(!ready)return;ctx.clearRect(0,0,470,200);ctx.drawImage(bg,0,0,470,200);const id=phase==='active'||(phase==='feedback'&&stage===2)?round.pose:reactionPose;const pose=spellImages.get(id)||wizard;ctx.drawImage(pose,Math.round((470-pose.width)/2),192-pose.height);$('room').setAttribute('aria-label',`Wizard pose ${id} in his study`);}
function score(){$('score').textContent=`STAGE ${stage+1} / 3 · CORRECT ${hits} / 3 · MISSES ${misses}`;}
function disable(){for(const b of $('choices').children)b.disabled=phase!=='active';}
function next(){round=makeRound(stage,Math.random,round?.answer);round.pose=chooseWizardSpellPose(round.answer);elapsed=0;phase='active';$('choices').replaceChildren(...round.choices.map(({word,ink},i)=>{const b=document.createElement('button');const direction=directions[i];b.className=direction.position;b.setAttribute('aria-label',`${direction.position}: ${word.toUpperCase()}`);const arrow=document.createElement('span');arrow.className='direction';arrow.textContent=direction.label;arrow.setAttribute('aria-hidden','true');const name=document.createElement('span');name.className='color-word';name.style.setProperty('--letters',word.length);name.textContent=word.toUpperCase();name.style.color=palette[ink];b.append(name,arrow);b.onclick=()=>answer(word);return b;}));$('message').textContent=stage===0?'Watch the staff. Choose the matching written word.':'Trust the spell. Ignore the color of the lettering.';$('start').textContent='Pause';$('ready-cue').hidden=true;score();draw();}
function answer(word){if(phase!=='active')return;const result=judge(round,word,elapsed);phase='feedback';wait=stage===2?.18:1.3;reactionPose=result==='correct'?6:result==='timeout'?4:5;if(result==='correct'){hits++;notify('progress',{correct:stage*3+hits});$('message').textContent='Correct. You saw through the distraction.';}else{misses++;$('message').textContent=result==='timeout'?'Too slow. Stay focused and try the next spell.':`The spell was ${round.answer.toUpperCase()}. Read the word, not the ink.`;}
if(hits===3){if(stage===2){phase='done';reactionPose=9;notify('complete');$('message').textContent='Well done. Your mind stayed clear through every illusion.';$('start').textContent='Play again';}else{$('message').textContent=stage===0?'Now the ink will deceive you. Read the words. You have 3 seconds.':'Faster now. Keep your focus. You have 2 seconds.';reactionPose=3;wait=2;}}
disable();score();draw();}
$('start').onclick=()=>{if(phase==='idle'||phase==='done'){if(phase==='done'){stage=0;hits=0;misses=0;phase='idle';}begin();}else if(phase==='paused'){phase=resumePhase;$('start').textContent='Pause';disable();}else{resumePhase=phase;phase='paused';$('start').textContent='Resume';disable();}};
function begin(){if(stage===2)cue();else next();}
function cue(){phase='cue';wait=1.5;reactionPose=8;$('ready-cue').hidden=false;$('ready-cue').textContent='READY';$('start').textContent='Pause';disable();draw();}
function reset(){const progress=integrated?savedCorrect:0;stage=Math.min(2,Math.floor(progress/3));hits=progress===9?3:progress%3;misses=0;round=null;phase=progress===9?'done':'idle';elapsed=0;reactionPose=progress===9?9:2;$('ready-cue').hidden=true;$('choices').replaceChildren();$('message').textContent=progress===9?'Your focus lesson is complete. The revealing lens is yours.':'The dragon will try to distract you. Match the spell to the written word. Trust what you see, not the ink. Use the matching arrow key or click.';$('start').textContent=progress===9?'Practice again':'Begin practice';score();draw();}
$('reset').onclick=reset;
const heldArrows=new Set();
window.addEventListener('keydown',event=>{const index=directions.findIndex(d=>d.key===event.key);if(index<0||event.altKey||event.ctrlKey||event.metaKey)return;event.preventDefault();if(event.repeat||heldArrows.has(event.key))return;heldArrows.add(event.key);if(phase==='active')answer(round.choices[index].word);});
window.addEventListener('keyup',event=>heldArrows.delete(event.key));

function pause(){heldArrows.clear();if(phase==='active'||phase==='feedback'||phase==='cue'){resumePhase=phase;phase='paused';$('start').textContent='Resume';disable();}}
window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
function tick(now){const dt=last?Math.min((now-last)/1000,.1):0;last=now;if(phase==='active'){elapsed+=dt;if(elapsed>=round.seconds)answer(null);}else if(phase==='feedback'){wait-=dt;if(wait<=0){if(hits===3){stage++;hits=0;if(stage===2){cue();return requestAnimationFrame(tick);}}next();}}
if(phase==='cue'){wait-=dt;$('ready-cue').textContent=wait>.45?'READY':'GO';if(wait<=0)next();}
const remaining=Math.max(0,STAGES[stage].seconds-elapsed);$('timer').max=STAGES[stage].seconds;$('timer').value=remaining;$('time').textContent=remaining.toFixed(1)+' s';requestAnimationFrame(tick);}
Promise.all([load(getRoomArt('wizard').url),load(getCharacterPose('wizard',1).url),...Array.from({length:34},(_,i)=>load(getCharacterPose('wizard',i+1).url))]).then(images=>{[bg,wizard]=images;images.slice(2).forEach((image,i)=>spellImages.set(i+1,image));ready=true;reset();$('start').disabled=false;if(savedCorrect===9)notify('complete');requestAnimationFrame(tick);}).catch(()=>{$('message').textContent='Artwork could not load. Reload to try again.';});

if(integrated){document.body.classList.add('integrated');$('reset').textContent='Return to maze';$('reset').onclick=()=>notify('leave');}
