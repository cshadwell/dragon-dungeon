import {createDungeonMusic} from './dungeon-music.js?v=f2edf2fe212f';
import {showRoomPreview} from './room-preview.js?v=f2edf2fe212f';
import {MAZE_ONLY,DRAGON,QUEEN,WIZARD} from './runtime.js?v=f2edf2fe212f';
import {MOTION,navigationChanged,transitionPose,motionDuration} from './movement.js?v=f2edf2fe212f';
import {drawCorridor} from './corridor.js?v=f2edf2fe212f';
import {exploredMap} from './explored-map.js?v=f2edf2fe212f';
import {dragonView,dragonArt} from './dragon.js?v=f2edf2fe212f';
import {queenView,queenArt} from './queen.js?v=f2edf2fe212f';
import {wizardView,wizardArt} from './wizard.js?v=f2edf2fe212f';
import {createAttempt,tick,respond} from './reaction.js?v=f2edf2fe212f';
import {lessons,notes as legacyOgreNotes} from './ogre.js?v=f2edf2fe212f';
import {ogreView} from './ogre.js?v=f2edf2fe212f';
import {ogreArt,flameDiagram} from './ogre-art.js?v=f2edf2fe212f';
import {act,fresh,load,save,SAVE_KEY,cells,neighbor,START,ENCOUNTER} from './runtime.js?v=f2edf2fe212f';
if(['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).get('preview')==='rooms'){showRoomPreview();}else{
const $=id=>document.getElementById(id), modal=$('modal');
let storage;try{storage=window.localStorage;}catch{}
let loaded=load(storage), state=loaded.state, writable=loaded.writable, panel=null, lastInput=0;
function showStorageWarning(message=''){
  const status=$('storage');
  status.textContent=message;
  status.parentElement.hidden=!message;
}
showStorageWarning(writable?undefined:loaded.notice);
// Local, isolated review link; never writes over the player's adventure save.
const previewMode=['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).get('preview')==='ogre'||(['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).get('preview')==='doors');
if(previewMode){state={...fresh(),pos:'35,32',facing:0,visited:[START,'35,32'],gate:null,message:'An iron-bound wooden door stands at the end of the corridor.'};writable=false;showStorageWarning();}

if(previewMode&&new URLSearchParams(location.search).get('preview')==='doors'){const door=new URLSearchParams(location.search).get('door')||'ogre';const views={ogre:['35,32',0],wizard:['1,22',1],elf:['53,4',1],dragon:['0,3',0]};const [pos,facing]=views[door]||views.ogre;state={...fresh(),pos,facing,visited:[START,pos],message:'A door stands ahead.'};}

const explorationAudio=new Audio('./assets/audio/dungeon-exploration.mp3');explorationAudio.id='dungeon-music';explorationAudio.preload='metadata';explorationAudio.hidden=true;document.body.append(explorationAudio);
const doorAudio=new Audio('./assets/audio/door-creaks-open-footsteps.mp3');
doorAudio.preload='auto';
const ogreAudio=new Audio('./assets/audio/ogre-chamber.mp3');
ogreAudio.id='ogre-music';ogreAudio.preload='metadata';ogreAudio.hidden=true;document.body.append(ogreAudio);
const ogreMusic=createDungeonMusic(ogreAudio);
const musicControl=$('dungeon-music-toggle');
let soundMuted=false;
const dungeonMusic=createDungeonMusic(explorationAudio,status=>{
  soundMuted=status.muted;
  const playing=status.playing&&!status.muted;
  musicControl.textContent=playing?'Sound Off':'Sound On';
  musicControl.setAttribute('aria-pressed',String(playing));
});
musicControl.onclick=()=>dungeonMusic.toggle();
// Retry only on a real player gesture if the browser blocked initial playback.
window.addEventListener('pointerdown',e=>{if(!e.target.closest('#dungeon-music-toggle'))dungeonMusic.retry();},{capture:true});window.addEventListener('keydown',e=>{if(!e.target.closest('#dungeon-music-toggle'))dungeonMusic.retry();},{capture:true});
window.addEventListener('pagehide',()=>{dungeonMusic.stop();ogreMusic.stop();doorAudio.pause();});
window.addEventListener('pageshow',()=>{dungeonMusic.setExploring(!state.encounter&&!ogreRefresher&&!enteringDoor);syncOgreMusic();});
function syncOgreMusic(){
  const insideOgre=ogreRefresher||Boolean(state.encounter&&!['wizard','queen','dragon'].includes(state.encounter));
  ogreMusic.setExploring(insideOgre&&!enteringDoor&&!soundMuted);
}
let attempt=null, reactionFrame=null, slowReaction=false, motion=null, enteringDoor=false;
const doorDescriptions={
  ogre:'Its hinges are strong and its timber is aged but sturdy.',
  wizard:'Ancient runes shine from its surface in languages long forgotten.',
  queen:'Its frame seems to grow and twist from the ground itself.',
  dragon:'Its carvings are made of glowing metals you’ve never seen before.'
};
const names=['NORTH','EAST','SOUTH','WEST'];
const navigationKeys={ArrowUp:'forward',ArrowDown:'back',ArrowLeft:'left',ArrowRight:'right'};
const heldNavigation=new Set();let heldFrame=null;
function stopHeldMovement(){heldNavigation.clear();if(heldFrame!==null)cancelAnimationFrame(heldFrame);heldFrame=null;}
function repeatMovement(){heldFrame=null;if(document.hidden||modal.open||state.encounter||state.gate){stopHeldMovement();return;}const key=[...heldNavigation].at(-1);if(!key)return;perform(navigationKeys[key]);if(heldNavigation.size)heldFrame=requestAnimationFrame(repeatMovement);}

function journalKnowledge(){
  const discoveries=state.knowledge.filter(note=>!legacyOgreNotes.includes(note));
  if(state.completed)discoveries.unshift('The Ogre’s advice: Be fast and accurate when you attack.');
  return discoveries.join(' ');
}
function persist(){if(writable&&!save(storage,state)){writable=false;showStorageWarning('Saving failed. Progress lasts only for this open session.');}}
function scene(){drawCorridor($('scene'),state);}
function render(){
  $('direction').textContent=names[state.facing];$('health').textContent='♥ '.repeat(state.health)+'♡ '.repeat(3-state.health);
  $('health').setAttribute('aria-label',`${state.health} of 3 health`);
  $('message').textContent=state.message;
  $('dragon-return').hidden=state.pos!==START||!state.dragon.discovered;$('earned-name').hidden=!state.dragon.victory;
  if(MAZE_ONLY)$('health').hidden=true;
  $('live-map').innerHTML=exploredMap(state);
  scene();if(state.encounter)openPanel('encounter');else if(state.gate)openPanel('gate');else syncPanels();
}
let ogreFrame=null,elfFrame=null,wizardFrame=null,ogreRefresher=false;
window.addEventListener('message',event=>{
 if(wizardFrame&&event.source===wizardFrame.contentWindow&&event.origin===location.origin){
  const type=event.data?.type;let action=null;
  if(type==='wizard-mind:progress'&&Number.isInteger(event.data.correct)&&event.data.correct>=0&&event.data.correct<=9)action='mind-progress-'+event.data.correct;
  if(type==='wizard-mind:complete')action='mind-complete';if(type==='wizard-mind:leave')action='leave';
  if(action){state=act(state,action);persist();if(!state.encounter&&modal.open){panel=null;modal.close();}render();}return;
 }

 if(elfFrame&&event.source===elfFrame.contentWindow&&event.origin===location.origin){
  const type=event.data?.type;let action=null;
  if(type==='elf-defence:progress'&&Number.isInteger(event.data.blocks)&&event.data.blocks>=0&&event.data.blocks<=9)action='defence-progress-'+event.data.blocks;
  if(type==='elf-defence:complete')action='defence-complete';if(type==='elf-defence:leave')action='leave';
  if(action){state=act(state,action);persist();if(!state.encounter&&modal.open){panel=null;modal.close();}render();}return;
 }

 if(!ogreFrame||event.source!==ogreFrame.contentWindow||event.origin!==location.origin)return;
 const menuType=event.data?.type;
 if(menuType==='ogre-attack:journal'){
   ogreFrame.contentWindow.postMessage({type:'ogre-room:journal',text:journalKnowledge()||'Seek the three guardians and learn their lessons.'},location.origin);return;
 }
 if(menuType==='ogre-attack:reset'){perform('reset');return;}
 if(menuType==='ogre-attack:sound'||menuType==='ogre-attack:sound-status'){
   if(menuType==='ogre-attack:sound'){
     dungeonMusic.setMuted(!soundMuted);
     syncOgreMusic();
   }
   ogreFrame.contentWindow.postMessage({type:'ogre-room:sound',muted:soundMuted},location.origin);return;
 }
 if(menuType==='ogre-attack:leave'){
   if(!enteringDoor)enterThroughDoor(()=>{
     if(ogreRefresher)ogreRefresher=false;
     else{state=act(state,'leave');persist();}
     if(modal.open){panel=null;modal.close();}
     render();
   });
   return;
 }
 if(ogreRefresher)return;
 const actions={'ogre-attack:practice1':'attack-practice-1','ogre-attack:practice2':'attack-practice-2','ogre-attack:complete':'attack-complete','ogre-attack:leave':'leave'};
 const action=actions[event.data?.type];if(!action)return;
 state=act(state,action);persist();if(!state.encounter&&modal.open){panel=null;modal.close();}render();
});
function syncPanels(){
 syncOgreMusic();
 dungeonMusic.setExploring(!state.encounter&&!ogreRefresher&&!enteringDoor);
 const attackRoom=ogreRefresher||Boolean(state.encounter&&!['wizard','queen','dragon'].includes(state.encounter));
 const defenceRoom=state.encounter==='queen';
 const mindRoom=state.encounter==='wizard';
 document.body.classList.toggle('ogre-attack-room',attackRoom||defenceRoom||mindRoom);
 if(mindRoom&&!wizardFrame){wizardFrame=document.createElement('iframe');wizardFrame.id='wizard-mind-encounter';wizardFrame.title='Wizard mind training';wizardFrame.src='./wizard-playtest.html?'+new URLSearchParams({encounter:'1',correct:String(state.wizard.mindCorrect??0),completed:String(state.wizard.completed)});document.body.append(wizardFrame);}
 else if(!mindRoom&&wizardFrame){wizardFrame.remove();wizardFrame=null;}

 if(defenceRoom&&!elfFrame){elfFrame=document.createElement('iframe');elfFrame.id='elf-defence-encounter';elfFrame.title='Elf Queen defence training';elfFrame.src='./elf-playtest.html?'+new URLSearchParams({encounter:'1',blocks:String(state.queen.defenceBlocks??0),completed:String(state.queen.completed)});document.body.append(elfFrame);}
 else if(!defenceRoom&&elfFrame){elfFrame.remove();elfFrame=null;}

 if(attackRoom&&!ogreFrame){
  ogreFrame=document.createElement('iframe');ogreFrame.id='ogre-attack-encounter';ogreFrame.title='Ogre attack training';
  const params=new URLSearchParams({encounter:'1',practice:String(state.ogre.attackPractice??0),completed:String(state.completed),refresher:String(Number(ogreRefresher))});
  ogreFrame.src='./ogre-playtest.html?'+params;document.body.append(ogreFrame);
 }else if(!attackRoom&&ogreFrame){ogreFrame.remove();ogreFrame=null;}

  const inside=Boolean(state.encounter);
  document.body.classList.toggle('encounter-room',inside);
  const controls=$('encounter-controls');controls.replaceChildren();controls.hidden=!inside;
  if(inside){for(const node of [...$('modal-body').children])if(node.matches('.choices,.guards,.angles,.ready,.selection,#reaction-start,#reaction-slow'))controls.append(node);}
  $('message').hidden=modal.open&&panel!=='journal';
  if(panel==='encounter'){
    const art=$('modal-body').querySelector('.ogre-art,.wizard-art,.queen-art,.dragon-art');
    if(art)$('scene').replaceChildren(art);
  }
}
function openPanel(type){
  if(motion)return;
  stopHeldMovement();
  if(modal.open&&panel!==type)modal.close();
  panel=type;updatePanel();if(!modal.open){if(type==='journal')modal.showModal();else modal.show();}
  syncPanels();
}
function choice(label,action){
 const b=document.createElement('button');b.textContent=label;b.onclick=()=>perform(action);
 b.onfocus=()=>{modal.querySelectorAll('.choice-selected').forEach(button=>button.classList.remove('choice-selected'));b.classList.add('choice-selected');};
 return b;
}
function moveChoice(action){
 const choices=[...$('modal-body').querySelectorAll('button:not(:disabled)')];
 if(!choices.length)return;
 const selected=choices.findIndex(button=>button.classList.contains('choice-selected')||button===document.activeElement);
 const step=['left','forward'].includes(action)?-1:1;
 choices[(Math.max(0,selected)+step+choices.length)%choices.length].focus();
}
function confirmChoice(){
 const choices=[...$('modal-body').querySelectorAll('button:not(:disabled)')];
 const selected=choices.find(button=>button.classList.contains('choice-selected'))||choices[0];
 selected?.click();
}
function updatePanel(){
  modal.classList.remove('reaction-active');document.body.classList.remove('in-reaction');
  const atDoor=panel==='gate';
  modal.classList.toggle('door-prompt',atDoor);
  modal.classList.toggle('journal-overlay',panel==='journal');
  modal.setAttribute('aria-labelledby',atDoor?'door-intro':'modal-title');
  const body=$('modal-body');body.replaceChildren();$('close').hidden=panel==='encounter'||panel==='gate';
  $('modal-label').textContent=panel==='encounter'?(state.encounter==='wizard'?'THE WIZARD’S STUDY · ':state.encounter==='queen'?'THE ROOT COURT · ':state.encounter==='dragon'?'THE BOUND CHAMBER · ':'THE SHIELD KEEPER · ')+state.health+' / 3 HEALTH':'FIELD NOTES';
  if(panel==='gate'){
    const intro=document.createElement('p');intro.id='door-intro';intro.textContent='You stand in front of a door in the passage.';
    const description=document.createElement('p');description.textContent=doorDescriptions[state.gate];
    const choices=document.createElement('div');choices.className='choices';choices.append(choice('Open the door and enter','gate-enter'),choice('Stay in the maze','gate-decline'));
    body.append(intro,description,choices);
  }else if(panel==='journal'){
    $('modal-label').textContent='';
    $('modal-title').textContent='Journal';
    const advice=document.createElement('p');
    advice.textContent=journalKnowledge()||'Seek the three guardians and learn their lessons.';
    body.append(advice);
    if(state.completed)body.append(choice('Practice attacking','ogre-refresher'));
    if(state.dragon.victory)body.append(choice('Read the earned name','show-name'));
  }else if(panel==='victory'){renderVictory(body);
  }else if(panel==='reset'){
    $('modal-title').textContent='Begin again?';body.innerHTML=MAZE_ONLY?'<p>Start this maze again at the red-dot entrance? This replaces only the maze exploration save. Your earlier adventure save is kept separately.</p>':'<p>This replaces this prototype’s saved progress on this browser. Your explored map, items, ogre training, wizard deductions, queen’s trust, and current position will be cleared.</p>';const b=choice('Replace progress and begin again','reset');body.append(b);
  }else{
    if(state.encounter==='dragon'&&state.dragon.phase!=='breath'){
      const view=dragonView(state);$('modal-title').textContent=view.title;
      const art=document.createElement('div');art.innerHTML=dragonArt(state);body.append(art);
      const text=document.createElement('p');text.textContent=view.text;body.append(text);
      if(view.claim){const claim=document.createElement('blockquote');claim.className='mask-claim';claim.textContent=view.claim;body.append(claim);}
      if(state.dragon.victory)namePlate(body);
      const choices=document.createElement('div');choices.className='choices';for(const [label,action]of view.choices)choices.append(choice(label,action));body.append(choices);return;
    }
    if(state.encounter==='queen'){$('modal-title').textContent='The Elf Queen’s Shrine';return;}
    if(state.encounter==='wizard'){$('modal-title').textContent='The Wizard’s Study';return;}
    if(!['wizard','queen','dragon'].includes(state.encounter)){$('modal-title').textContent='The Ogre’s Armory';return;}
    const view=dragonView(state);
    $('modal-title').textContent=view.title;
    const art=document.createElement('div');art.innerHTML=view.dragon?dragonArt(state):ogreArt(state);body.append(art);
    const text=document.createElement('p');text.textContent=view.text;body.append(text);
    if(view.reaction){
      const tell=document.createElement('p');tell.id='tell';tell.className='tell';tell.setAttribute('role','status');tell.textContent=view.dragon?'Shield aimed right. Wait for embers, then block high.':'Read the stance. Start when you’re ready.';body.append(tell);
      const row=document.createElement('div');row.className='guards';
      for(const [guard,label]of [['left','← Guard left'],['high','↑ Guard high'],['right','→ Guard right']]){const b=document.createElement('button');b.textContent=label;b.disabled=true;b.dataset.reactionGuard=guard;b.onpointerdown=e=>{e.preventDefault();react(guard);};b.onclick=e=>{if(e.detail===0)react(guard);};row.append(b);}body.append(row);
      const ready=document.createElement('button');ready.id='reaction-start';ready.className='ready';ready.textContent=view.dragon?'Ready — watch for embers':view.practice?'Start safe practice':'Ready — watch for the snort';ready.onclick=startReaction;body.append(ready);
      const slow=document.createElement('button');slow.id='reaction-slow';slow.className='quiet';slow.textContent=slowReaction?'Slower timing: on':'Slower timing: off';slow.setAttribute('aria-pressed',String(slowReaction));slow.onclick=()=>{slowReaction=!slowReaction;slow.textContent=slowReaction?'Slower timing: on':'Slower timing: off';slow.setAttribute('aria-pressed',String(slowReaction));};body.append(slow);
    }
    if(view.guard || view.flame){
      const row=document.createElement('div');row.className=view.flame?'angles':'guards';row.setAttribute('role','group');row.setAttribute('aria-label',view.flame?'Shield reflection path':'Guard position');
      const selected=view.guard?state.ogre.guard:state.ogre.angle;
      const options=view.guard?[['left','Guard left'],['high','Guard high'],['right','Guard right']]:[['left','Reflect left'],['back','Reflect back'],['right','Reflect right']];
      for(const [id,label] of options){const b=choice(label,(view.guard?'guard-':'angle-')+id);b.setAttribute('aria-pressed',String(selected===id));
        if(view.flame){b.innerHTML=flameDiagram(id);const labelNode=document.createElement('span');labelNode.textContent=label;b.append(labelNode);b.setAttribute('aria-label',label);}
        row.append(b);
      }body.append(row);
      const ready=choice(view.guard?'Ready — take the blow':'Ready — release the training flame','ready');ready.className='ready';ready.disabled=!selected;body.append(ready);
      const status=document.createElement('p');status.className='selection';status.setAttribute('role','status');status.textContent=selected?'Selected: '+options.find(o=>o[0]===selected)[1]+'. Change it or press Ready.':'Choose a position above. There is no timer.';body.append(status);
    }
    const choices=document.createElement('div');choices.className='choices';for(const [label,action]of view.choices)choices.append(choice(label,action));body.append(choices);
  }
}
function namePlate(body){
  const label=document.createElement('p');label.className='note';label.textContent=state.dragon.placeholder?'DEVELOPMENT PLACEHOLDER — not the verified book combination.':'The dragon’s true name, revealed on stone.';body.append(label);
  const name=document.createElement('p');name.className='earned-name';name.textContent=state.dragon.name;body.append(name);
}
function renderVictory(body){$('modal-title').textContent='The name beneath the binding.';namePlate(body);const text=document.createElement('p');text.textContent='Your victory and this earned name are saved on this browser and device.';body.append(text);}
function close(){if(panel==='encounter'||panel==='gate')return;panel=null;modal.close();scene();syncPanels();}
function cancelReaction(message='Attempt paused. Start again when ready; no health lost.'){
  if(!attempt)return;
  attempt.done=true;attempt=null;cancelAnimationFrame(reactionFrame);reactionFrame=null;
  updatePanel();syncPanels();$('tell').textContent=message;
}
function resolveReaction(result){
  attempt=null;cancelAnimationFrame(reactionFrame);reactionFrame=null;
  // The rendered swing is feedback only; the decision has already resolved once.
  state=act(state,'react-'+result);persist();
  if(!state.encounter&&modal.open){panel=null;modal.close();}render();
  $('scene').querySelector('.ogre-art,.dragon-art')?.classList.add(result==='block'?'block-impact':'swing-impact');
}
function react(guard){
  if(!attempt)return;
  const now=performance.now();
  if(now-attempt.last>300){cancelReaction();return;}
  const result=respond(attempt,guard,now);if(result)resolveReaction(result);
}
function startReaction(){
  if(attempt || !(['tutorial','stance'].includes(state.encounter)||(state.encounter==='dragon'&&state.dragon.phase==='breath')))return;
  const practice=state.encounter==='tutorial',dragon=state.encounter==='dragon';
  attempt=createAttempt(dragon||practice?'high':lessons[state.ogre.round].guard,performance.now(),{practice,slow:slowReaction});
  modal.classList.add('reaction-active');document.body.classList.add('in-reaction');
  $('reaction-start').disabled=true;$('reaction-slow').disabled=true;
  $('encounter-controls').querySelectorAll('.choices button').forEach(b=>b.disabled=true);
  $('encounter-controls').querySelectorAll('[data-reaction-guard]').forEach(b=>b.disabled=false);
  $('tell').textContent=dragon?'The dragon draws breath… wait for the embers.':'He draws back the club… wait for the snort.';
  $('scene').querySelector('.ogre-art,.dragon-art')?.classList.add('winding');
  // Ensure nose and touch controls are in view before the windup begins.
  $('scene').scrollIntoView({block:'nearest'});
  const frame=now=>{
    if(!attempt)return;
    const change=tick(attempt,now);
    if(change==='paused'){cancelReaction();return;}
    if(change==='late'){resolveReaction('late');return;}
    if(change==='snort'){
      $('scene').querySelector('.ogre-art,.dragon-art')?.classList.add('snorting');
      if(dragon){$('tell').classList.add('snort-cue');$('tell').textContent='EMBERS! Block high now — ↑';}else{$('tell').textContent='Watch his nose.';}
    }
    reactionFrame=requestAnimationFrame(frame);
  };
  reactionFrame=requestAnimationFrame(frame);
}
window.addEventListener('blur',()=>{stopHeldMovement();cancelReaction();finishMotion();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopHeldMovement();cancelReaction();finishMotion();}});
function finishMotion(){
  if(!motion)return;
  cancelAnimationFrame(motion.frame);motion=null;$('scene').removeAttribute('aria-busy');render();
}
function animateNavigation(from,to,action){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){render();return;}
  const duration=motionDuration(action),start=performance.now();
  motion={frame:null,last:-Infinity};$('scene').setAttribute('aria-busy','true');
  const frame=now=>{
    if(!motion)return;
    const t=Math.min(1,(now-start)/duration);
    if(t>=1){finishMotion();return;}
    if(now-motion.last>=1000/MOTION.fps){drawCorridor($('scene'),from,transitionPose(from,to,action,t));motion.last=now;}
    motion.frame=requestAnimationFrame(frame);
  };
  motion.frame=requestAnimationFrame(frame);
}
function enterChamber(){
  state=act(state,'gate-enter');persist();render();
}
function playDoorSound(){
  if(soundMuted)return Promise.resolve();
  return new Promise(resolve=>{
    // Unavailable or stalled audio should never strand the player on black.
    const timeout=setTimeout(done,9000);
    doorAudio.addEventListener('ended',done,{once:true});
    doorAudio.addEventListener('error',done,{once:true});
    doorAudio.addEventListener('pause',done,{once:true});
    function done(){
      clearTimeout(timeout);
      doorAudio.removeEventListener('ended',done);
      doorAudio.removeEventListener('error',done);
      doorAudio.removeEventListener('pause',done);
      doorAudio.pause();
      resolve();
    }
    doorAudio.currentTime=0;
    doorAudio.play().catch(done);
  });
}
async function enterThroughDoor(changeScene=enterChamber){
  if(document.hidden){changeScene();return;}
  enteringDoor=true;
  dungeonMusic.setExploring(false);
  ogreMusic.stop();
  if(ogreFrame)ogreFrame.inert=true;
  // Start playback directly from the entry click for browsers that require a gesture.
  const soundFinished=playDoorSound();
  const fade=$('door-fade');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  fade.hidden=false;
  const playFade=(from,to,duration)=>fade.animate([{opacity:from},{opacity:to}],{
    duration,easing:'steps(10, end)',fill:'both'
  });
  const darken=reducedMotion?null:playFade(0,1,1250);
  let frame;
  try{
    await darken?.finished;
    changeScene();
    frame=ogreFrame||elfFrame||wizardFrame;
    if(frame){
      frame.inert=true;
      await new Promise(resolve=>{
        const timeout=setTimeout(done,700);
        frame.addEventListener('load',done,{once:true});
        function done(){clearTimeout(timeout);frame.removeEventListener('load',done);resolve();}
      });
    }
    await soundFinished;
    if(ogreFrame&&!soundMuted)ogreMusic.setExploring(true);
    if(!state.encounter&&!ogreRefresher)dungeonMusic.setExploring(true);
    if(!reducedMotion){
      const reveal=playFade(1,0,950);
      try{await reveal.finished;}finally{reveal.cancel();}
    }
  }finally{
    if(frame){frame.inert=false;frame.contentWindow.focus();}
    fade.hidden=true;darken?.cancel();enteringDoor=false;
  }
}
function perform(action){
  if(attempt||motion||enteringDoor)return;
  if(action==='ogre-refresher'&&state.completed){
    panel=null;modal.close();ogreRefresher=true;syncPanels();ogreFrame.contentWindow.focus();return;
  }
  if(action==='show-name'&&state.dragon.victory){openPanel('victory');return;}
  const now=performance.now();if(now-lastInput<220)return;lastInput=now;
  if(action==='reset'){ogreRefresher=false;state=fresh();writable=!previewMode;showStorageWarning();persist();panel=null;modal.close();render();return;}
  if(panel&&panel!=='encounter'&&panel!=='gate')return;
  if(action==='gate-enter'&&state.gate){enterThroughDoor();return;}
  const before=state;
  state=act(state,action);
  if(['forward','back'].includes(action)&&state.pos===before.pos&&!before.encounter&&!before.gate)return;
  persist();
  if(['forward','back','left','right'].includes(action)&&navigationChanged(before,state)){
    animateNavigation(before,state,action);return;
  }
  if(!state.encounter&&modal.open){panel=null;modal.close();}render();
}
function explorationMenu(action){
  return ()=>{
    if(!motion&&!state.encounter&&!state.gate)action();
  };
}
$('journal').onclick=explorationMenu(()=>openPanel('journal'));
$('reset').onclick=explorationMenu(()=>openPanel('reset'));
$('close').onclick=close;
$('space-action').onclick=()=>{
  if(modal.open){confirmChoice();return;}
  if(!MAZE_ONLY&&!modal.open&&[ENCOUNTER,WIZARD,QUEEN,DRAGON].includes(state.pos))perform('interact');
};
$('dragon-return').onclick=explorationMenu(()=>perform('dragon-shortcut'));
$('earned-name').onclick=explorationMenu(()=>openPanel('victory'));
modal.addEventListener('cancel',e=>{e.preventDefault();if(panel!=='encounter'&&panel!=='gate')close();});
document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{if(modal.open)moveChoice(b.dataset.action);else perform(b.dataset.action);});
window.addEventListener('keydown',e=>{
  if(enteringDoor){e.preventDefault();return;}
  if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)||e.target.isContentEditable)return;
  if(e.repeat){if(navigationKeys[e.key]||e.code==='Space')e.preventDefault();return;}
  if(e.key==='Escape'&&modal.open&&panel!=='encounter'){e.preventDefault();close();return;}
  const action=navigationKeys[e.key];
  if(modal.open&&!attempt){
    if(action){e.preventDefault();moveChoice(action);return;}
    if(e.code==='Space'&&e.target!==$('close')){e.preventDefault();confirmChoice();return;}
  }
  if(action){e.preventDefault();if(attempt){const guard={ArrowLeft:'left',ArrowUp:'high',ArrowRight:'right'}[e.key];if(guard)react(guard);}else if(!modal.open&&!state.encounter&&!state.gate){heldNavigation.delete(e.key);heldNavigation.add(e.key);if(heldFrame===null)repeatMovement();}return;}
  if(e.key.toLowerCase()==='j'){e.preventDefault();if(modal.open){if(panel!=='encounter'&&panel!=='gate')close();}else openPanel('journal');}
});
window.addEventListener('keyup',e=>{if(navigationKeys[e.key]){heldNavigation.delete(e.key);if(!heldNavigation.size)stopHeldMovement();}});
render();

}
