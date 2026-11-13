import {openSecretEntrance,prefetchSecretEntrance} from './secret-entrance.js?v=351d764579df';
import {openSecretChamber} from './secret-chamber.js?v=351d764579df';
import {canEnterSecret,unlockMusicalPassage,SECRET_APPROACH_MESSAGE} from './secret-passage-model.js?v=351d764579df';
import {DOOR_DESCRIPTIONS as doorDescriptions} from './dialogue-copy.js?v=351d764579df';
import {createEndingAudio} from './ending-audio.js?v=351d764579df';
import {createDungeonMusic} from './dungeon-music.js?v=351d764579df';
import {showRoomPreview} from './room-preview.js?v=351d764579df';
import {MAZE_ONLY,DRAGON,QUEEN,WIZARD} from './runtime.js?v=351d764579df';
import {MOTION,navigationChanged,transitionPose,motionDuration} from './movement.js?v=351d764579df';
import {drawCorridor} from './corridor.js?v=351d764579df';
import {exploredMap} from './explored-map.js?v=351d764579df';
import {dragonView,dragonArt} from './dragon.js?v=351d764579df';
import {queenView,queenArt,queenNotes as legacyQueenNotes} from './queen.js?v=351d764579df';
import {wizardView,wizardArt,wizardNotes as legacyWizardNotes} from './wizard.js?v=351d764579df';
import {createAttempt,tick,respond} from './reaction.js?v=351d764579df';
import {lessons,notes as legacyOgreNotes} from './ogre.js?v=351d764579df';
import {ogreView} from './ogre.js?v=351d764579df';
import {ogreArt,flameDiagram} from './ogre-art.js?v=351d764579df';
import {act,fresh,load,save,SAVE_KEY,cells,neighbor,START,ENCOUNTER,banishDragon,completeDragon,guardiansReady,GUARDIAN_WARNING} from './runtime.js?v=351d764579df';
if(['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).get('preview')==='rooms'){showRoomPreview();}else{
const $=id=>document.getElementById(id), modal=$('modal');
let storage;try{storage=window.localStorage;}catch{}
let loaded=load(storage), state=loaded.state, writable=loaded.writable, panel=null, lastInput=0, secretRoom=null;
function showStorageWarning(message=''){
  const status=$('storage');
  status.textContent=message;
  status.parentElement.hidden=!message;
}
showStorageWarning(writable?undefined:loaded.notice);
// Local, isolated review link; never writes over the player's adventure save.
const previewMode=['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).get('preview')==='ogre'||(['localhost','127.0.0.1'].includes(location.hostname)&&['doors','secret'].includes(new URLSearchParams(location.search).get('preview')));
if(previewMode){state={...fresh(),pos:'35,32',facing:0,visited:[START,'35,32'],gate:null,message:'An iron-bound wooden door stands at the end of the corridor.'};writable=false;showStorageWarning();}

if(previewMode&&new URLSearchParams(location.search).get('preview')==='doors'){const door=new URLSearchParams(location.search).get('door')||'ogre';const views={ogre:['35,32',0],wizard:['1,22',1],elf:['53,4',1],dragon:['0,3',0]};const [pos,facing]=views[door]||views.ogre;state={...fresh(),pos,facing,visited:[START,pos],message:'A door stands ahead.'};}

if(previewMode&&new URLSearchParams(location.search).get('preview')==='secret'){state={...fresh(),pos:'34,43',facing:1,visited:[START,'34,43'],musicalPassageUnlocked:new URLSearchParams(location.search).get('unlocked')==='1',message:'Your footsteps echo through the passage.'};}

if(previewMode&&new URLSearchParams(location.search).get('door')==='dragon'&&new URLSearchParams(location.search).get('prepared')!=='0'){
 const original=state;
 for(const [pos,encounter,actions] of [[ENCOUNTER,'intro',['attack-complete']],[WIZARD,'wizard',['mind-progress-12','mind-complete']],[QUEEN,'queen',['defence-progress-12','defence-complete']]]){
  state={...state,pos,encounter,visited:[...new Set([...state.visited,pos])]};for(const action of actions)state=act(state,action);
 }
 state={...state,pos:original.pos,facing:original.facing,encounter:null,gate:null,message:original.message};
}

const explorationAudio=new Audio('./assets/audio/dungeon-exploration.mp3');explorationAudio.id='dungeon-music';explorationAudio.preload='metadata';explorationAudio.hidden=true;document.body.append(explorationAudio);
const doorAudio=new Audio('./assets/audio/door-creaks-open-footsteps.mp3');
doorAudio.preload='auto';
const defeatAudio=new Audio('./assets/audio/defeat.wav');defeatAudio.id='defeat-sound';defeatAudio.preload='auto';defeatAudio.hidden=true;document.body.append(defeatAudio);
const ogreAudio=new Audio('./assets/audio/ogre-chamber.mp3');
ogreAudio.id='ogre-music';ogreAudio.preload='metadata';ogreAudio.hidden=true;document.body.append(ogreAudio);
const ogreMusic=createDungeonMusic(ogreAudio);
const elfAudio=new Audio('./assets/audio/elf-chamber.mp3');
elfAudio.id='elf-music';elfAudio.preload='metadata';elfAudio.hidden=true;document.body.append(elfAudio);
const elfMusic=createDungeonMusic(elfAudio);
const wizardAudio=new Audio('./assets/audio/wizard-chamber.mp3');
wizardAudio.id='wizard-music';wizardAudio.preload='metadata';wizardAudio.hidden=true;document.body.append(wizardAudio);
const wizardMusic=createDungeonMusic(wizardAudio);
const dragonAudio=new Audio('./assets/audio/dragon-chamber.mp3');
dragonAudio.id='dragon-music';dragonAudio.preload='metadata';dragonAudio.hidden=true;document.body.append(dragonAudio);
const dragonMusic=createDungeonMusic(dragonAudio);
const victoryAudio=new Audio('./assets/audio/victory.wav');victoryAudio.id='victory-sound';victoryAudio.preload='auto';victoryAudio.hidden=true;document.body.append(victoryAudio);
const endingAudio=new Audio('./assets/audio/ending.mp3');endingAudio.id='ending-music';endingAudio.preload='metadata';endingAudio.hidden=true;document.body.append(endingAudio);
const endingPlayback=createEndingAudio(victoryAudio,endingAudio);
let dragonEnding=false,dragonVictoryReady=false,dragonVictoryPending=false;
function beginDragonVictory(){
 if(dragonEnding)return;dragonEnding=true;dragonVictoryReady=true;dragonVictoryPending=false;
 dungeonMusic.stop();ogreMusic.stop();elfMusic.stop();wizardMusic.stop();dragonMusic.stop();endingPlayback.setMuted(soundMuted);endingPlayback.start();
}
const musicControl=$('dungeon-music-toggle');
let soundMuted=false;
const dungeonMusic=createDungeonMusic(explorationAudio,status=>{
  soundMuted=status.muted;
  const playing=status.playing&&!status.muted;
  musicControl.textContent=playing?'Sound Off':'Sound On';
  musicControl.setAttribute('aria-pressed',String(playing));
});
musicControl.onclick=()=>{dungeonMusic.setMuted(!soundMuted);syncRoomMusic();};
// All active tracks can recover on a player gesture, including chamber music.
const musicPlayers=[dungeonMusic,ogreMusic,elfMusic,wizardMusic,dragonMusic];
function retryAudio(){for(const player of musicPlayers)player.retry();if(dragonEnding)endingPlayback.retry();}
window.addEventListener('pointerdown',retryAudio,{capture:true});window.addEventListener('keydown',retryAudio,{capture:true});
function suspendAudio(value){for(const player of musicPlayers)player.setSuspended(value);endingPlayback.setSuspended(value);}
window.addEventListener('pagehide',()=>{suspendAudio(true);doorAudio.pause();defeatAudio.pause();});
window.addEventListener('pageshow',()=>{suspendAudio(document.hidden);syncPanels();});
document.addEventListener('visibilitychange',()=>suspendAudio(document.hidden));
suspendAudio(document.hidden);
function syncRoomMusic(){
 if(document.body.classList.contains('boot-transition'))return;
 endingPlayback.setMuted(soundMuted);
 if(state.encounter==='dragon'&&state.dragon.victory&&state.dragon.name==='CHAZ'&&!enteringDoor){dragonEnding=true;dragonVictoryReady=true;}
 if(dragonEnding&&!enteringDoor)endingPlayback.resume();
  const insideOgre=ogreRefresher||Boolean(state.encounter&&!['wizard','queen','dragon'].includes(state.encounter));
  ogreMusic.setExploring(insideOgre&&!enteringDoor&&!soundMuted);
  elfMusic.setExploring((elfRefresher||state.encounter==='queen')&&!enteringDoor&&!soundMuted);
  wizardMusic.setExploring((wizardRefresher||state.encounter==='wizard')&&!enteringDoor&&!soundMuted);
  dragonMusic.setExploring(state.encounter==='dragon'&&!enteringDoor&&!soundMuted&&!dragonEnding);
}
let attempt=null, reactionFrame=null, slowReaction=false, motion=null, enteringDoor=false,dragonBanished=false;

const names=['NORTH','EAST','SOUTH','WEST'];
const navigationKeys={ArrowUp:'forward',ArrowDown:'back',ArrowLeft:'left',ArrowRight:'right'};
const heldNavigation=new Set();let heldFrame=null;
function stopHeldMovement(){heldNavigation.clear();if(heldFrame!==null)cancelAnimationFrame(heldFrame);heldFrame=null;}
function repeatMovement(){heldFrame=null;if(secretRoom||document.hidden||modal.open||state.encounter||state.gate){stopHeldMovement();return;}const key=[...heldNavigation].at(-1);if(!key)return;perform(navigationKeys[key]);if(heldNavigation.size)heldFrame=requestAnimationFrame(repeatMovement);}

function journalKnowledge(){
  const discoveries=state.knowledge.filter(note=>!legacyOgreNotes.includes(note)&&!legacyQueenNotes.includes(note)&&!legacyWizardNotes.includes(note));
  if(state.completed)discoveries.unshift('The Ogre’s advice: Be fast and accurate when you attack.');
  if(state.queen.completed)discoveries.push('The Elf Queen’s advice: Stay aware, keep moving, and react quickly to block incoming attacks.');
  if(state.wizard.completed)discoveries.push('The Wizard’s advice: Stay focused and concentrate. Match the spell’s color to its written name, and ignore distractions.');
  if(state.dragon.victory&&state.dragon.prizeRevealed!==false)discoveries.push('The dragon’s true name: '+state.dragon.name+'.');
  return discoveries.join(' ');
}
function persist(){if(writable&&!save(storage,state)){writable=false;showStorageWarning('Saving failed. Progress lasts only for this open session.');}}
async function openMusicalPassage(){
 if(secretRoom||motion||enteringDoor||modal.open||!canEnterSecret(state))return;
 stopHeldMovement();document.querySelector('main.console').inert=true;enteringDoor=true;dungeonMusic.setExploring(false);
 const transition=openSecretEntrance({host:$('scene'),muted:soundMuted,revealChamber:()=>{
 secretRoom=openSecretChamber({unlocked:state.musicalPassageUnlocked===true,muted:soundMuted,onUnlock:()=>{state=unlockMusicalPassage(state);persist();return writable;},onMute:value=>{dungeonMusic.setMuted(value);syncRoomMusic();},onClose:()=>{secretRoom=null;document.querySelector('main.console').inert=false;render();document.querySelector('.secret-eye-hit')?.focus({preventScroll:true});}});
 }});
 try{await transition.finished;}finally{enteringDoor=false;if(!secretRoom){document.querySelector('main.console').inert=false;render();}syncRoomMusic();}
}
prefetchSecretEntrance();
function scene(){drawCorridor($('scene'),state,null,openMusicalPassage);}
function render(){
  $('direction').textContent=names[state.facing];$('health').textContent='♥ '.repeat(state.health)+'♡ '.repeat(3-state.health);
  $('health').setAttribute('aria-label',`${state.health} of 3 health`);
  $('message').textContent=state.pos==='34,43'&&!state.encounter&&!state.gate?SECRET_APPROACH_MESSAGE:state.message;
  $('dragon-return').hidden=state.pos!==START||!state.dragon.discovered;$('earned-name').hidden=!state.dragon.victory||state.dragon.prizeRevealed===false;
  if(MAZE_ONLY)$('health').hidden=true;
  $('live-map').innerHTML=exploredMap(state);
  scene();if(state.encounter)openPanel('encounter');else if(state.gate)openPanel('gate');else syncPanels();
}
let ogreFrame=null,elfFrame=null,wizardFrame=null,dragonFrame=null,ogreRefresher=false,elfRefresher=false,wizardRefresher=false;
window.addEventListener('message',event=>{
 if(dragonFrame&&event.source===dragonFrame.contentWindow&&event.origin===location.origin){
   if(handleRoomMenu(event,dragonFrame,'dragon-room','dragon-room'))return;
   if(event.data?.type==='dragon-room:victory'&&state.encounter==='dragon'){
    state=completeDragon(state);persist();
    if(enteringDoor)dragonVictoryPending=true;else beginDragonVictory();return;
   }
   if(event.data?.type==='dragon-room:prize'&&state.encounter==='dragon'&&(dragonVictoryReady||state.dragon.victory)){
    state=completeDragon(state,true);persist();render();return;
   }
   if(event.data?.type==='dragon-room:return-maze'&&state.encounter==='dragon'&&state.dragon.victory&&state.dragon.prizeRevealed){
    stopHeldMovement();endingPlayback.stop();dragonEnding=false;dragonVictoryReady=false;dragonVictoryPending=false;
    state={...state,pos:START,facing:0,encounter:null,gate:null,visited:[...new Set([...state.visited,START])],message:'Your footsteps echo through the passage.'};persist();
    panel=null;if(modal.open)modal.close();render();window.focus();return;
   }
   if(event.data?.type==='dragon-room:credits-finished'&&state.encounter==='dragon'&&state.dragon.victory){endingPlayback.stop();return;}
   if(event.data?.type==='dragon-room:banish'&&state.encounter==='dragon'&&!enteringDoor){
    stopHeldMovement();enterThroughDoor(()=>{
     dragonBanished=true;state=banishDragon(state);persist();
     if(modal.open){panel=null;modal.close();}render();
    },defeatAudio);return;
   }
   if(event.data?.type==='dragon-room:leave'&&!enteringDoor)enterThroughDoor(()=>{
     endingPlayback.stop();dragonEnding=false;dragonVictoryReady=false;dragonVictoryPending=false;
     state=act(state,'leave');persist();
     if(modal.open){panel=null;modal.close();}
     render();
   });
   return;
 }
 if(wizardFrame&&event.source===wizardFrame.contentWindow&&event.origin===location.origin){
  if(handleRoomMenu(event,wizardFrame,'wizard-mind','wizard-room'))return;
  if(event.data?.type==='wizard-mind:leave'){
    if(!enteringDoor)enterThroughDoor(()=>{
      if(wizardRefresher)wizardRefresher=false;else{state=act(state,'leave');persist();}
      if(modal.open){panel=null;modal.close();}
      render();
    });
    return;
  }
  if(wizardRefresher)return;
  const type=event.data?.type;let action=null;
  if(type==='wizard-mind:progress'&&Number.isInteger(event.data.correct)&&event.data.correct>=0&&event.data.correct<=12)action='mind-progress-'+event.data.correct;
  if(type==='wizard-mind:complete')action='mind-complete';if(type==='wizard-mind:leave')action='leave';
  if(action){state=act(state,action);persist();if(!state.encounter&&modal.open){panel=null;modal.close();}render();}return;
 }

 if(elfFrame&&event.source===elfFrame.contentWindow&&event.origin===location.origin){
  if(handleRoomMenu(event,elfFrame,'elf-defence','elf-room'))return;
  if(event.data?.type==='elf-defence:leave'){
    if(!enteringDoor)enterThroughDoor(()=>{
      if(elfRefresher)elfRefresher=false;else{state=act(state,'leave');persist();}
      if(modal.open){panel=null;modal.close();}
      render();
    });
    return;
  }
  if(elfRefresher)return;
  const type=event.data?.type;let action=null;
  if(type==='elf-defence:progress'&&Number.isInteger(event.data.blocks)&&event.data.blocks>=0&&event.data.blocks<=12)action='defence-progress-'+event.data.blocks;
  if(type==='elf-defence:complete')action='defence-complete';if(type==='elf-defence:leave')action='leave';
  if(action){state=act(state,action);persist();if(!state.encounter&&modal.open){panel=null;modal.close();}render();}return;
 }

 if(!ogreFrame||event.source!==ogreFrame.contentWindow||event.origin!==location.origin)return;
 const menuType=event.data?.type;
 if(handleRoomMenu(event,ogreFrame,'ogre-attack','ogre-room'))return;
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
function handleRoomMenu(event,frame,requestPrefix,responsePrefix){
 const type=event.data?.type;
 if(type===requestPrefix+':audio-gesture'){retryAudio();return true;}
 if(type===requestPrefix+':journal'){
   frame.contentWindow.postMessage({type:responsePrefix+':journal',text:journalKnowledge()||'Seek the three guardians and learn their lessons.'},location.origin);return true;
 }
 if(type===requestPrefix+':reset'){perform('reset');return true;}
 if(type===requestPrefix+':sound'||type===requestPrefix+':sound-status'){
   if(type===requestPrefix+':sound'){dungeonMusic.setMuted(!soundMuted);syncRoomMusic();}
   frame.contentWindow.postMessage({type:responsePrefix+':sound',muted:soundMuted},location.origin);return true;
 }
 return false;
}
window.addEventListener('dungeon:ready',()=>syncPanels());
function syncPanels(){
 syncRoomMusic();
 dungeonMusic.setExploring(!secretRoom&&!document.body.classList.contains('boot-transition')&&!state.encounter&&!ogreRefresher&&!elfRefresher&&!wizardRefresher&&!enteringDoor);
 const attackRoom=ogreRefresher||Boolean(state.encounter&&!['wizard','queen','dragon'].includes(state.encounter));
 const defenceRoom=elfRefresher||state.encounter==='queen';
 const mindRoom=wizardRefresher||state.encounter==='wizard';
 const dragonRoom=state.encounter==='dragon';
 document.body.classList.toggle('ogre-attack-room',attackRoom||defenceRoom||mindRoom||dragonRoom);
 if(dragonRoom&&!dragonFrame){
   dragonFrame=document.createElement('iframe');dragonFrame.id='dragon-room-encounter';dragonFrame.title='The Nameless Dragon chamber';
   const dragonPreview=new URLSearchParams(location.search);
   const dragonMode=state.dragon.victory&&state.dragon.name==='CHAZ'?(state.dragon.prizeRevealed===false?'?ending=victory':'?ending=earned'):dragonPreview.get('preview')==='doors'&&dragonPreview.get('door')==='dragon'&&['final','ending'].includes(dragonPreview.get('round'))&&!dragonBanished?'?playtest='+dragonPreview.get('round'):'';
   dragonFrame.src='./dragon-room.html'+dragonMode;document.body.append(dragonFrame);
 }else if(!dragonRoom&&dragonFrame){dragonFrame.remove();dragonFrame=null;}
 if(mindRoom&&!wizardFrame){wizardFrame=document.createElement('iframe');wizardFrame.id='wizard-mind-encounter';wizardFrame.title='Wizard mind training';wizardFrame.src='./wizard-playtest.html?'+new URLSearchParams({encounter:'1',correct:String(state.wizard.mindCorrect??0),completed:String(state.wizard.completed),refresher:String(Number(wizardRefresher))});document.body.append(wizardFrame);}
 else if(!mindRoom&&wizardFrame){wizardFrame.remove();wizardFrame=null;}

 if(defenceRoom&&!elfFrame){elfFrame=document.createElement('iframe');elfFrame.id='elf-defence-encounter';elfFrame.title='Elf Queen defence training';elfFrame.src='./elf-playtest.html?'+new URLSearchParams({encounter:'1',blocks:String(state.queen.defenceBlocks??0),completed:String(state.queen.completed),refresher:String(Number(elfRefresher))});document.body.append(elfFrame);}
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
    const locked=state.gate==='dragon'&&!guardiansReady(state)&&!state.dragon.victory;
    const intro=document.createElement('p');intro.id='door-intro';intro.textContent=locked?GUARDIAN_WARNING:'You stand in front of a door in the passage.';
    const description=document.createElement('p');description.textContent=doorDescriptions[state.gate];
    const choices=document.createElement('div');choices.className='choices';if(state.gate!=='dragon'||guardiansReady(state)||state.dragon.victory)choices.append(choice('Open the door and enter','gate-enter'));choices.append(choice('Stay in the maze','gate-decline'));
    body.append(intro);if(!locked)body.append(description);body.append(choices);
  }else if(panel==='journal'){
    $('modal-label').textContent='';
    $('modal-title').textContent='Journal';
    const advice=document.createElement('p');
    advice.textContent=journalKnowledge()||'Seek the three guardians and learn their lessons.';
    body.append(advice);
    if(state.completed)body.append(choice('Practice attacking','ogre-refresher'));
    if(state.queen.completed)body.append(choice('Practice defending','elf-refresher'));
    if(state.wizard.completed)body.append(choice('Practice focusing','wizard-refresher'));
    if(state.dragon.victory&&state.dragon.prizeRevealed!==false)body.append(choice('Read the earned name','show-name'));
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
  const label=document.createElement('p');label.className='note';label.textContent=state.dragon.placeholder?'DEVELOPMENT PLACEHOLDER — not the verified book combination.':'The dragon’s true name.';body.append(label);
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
function playTransitionSound(audio=doorAudio){
  if(soundMuted)return Promise.resolve();
  return new Promise(resolve=>{
    // Unavailable or stalled audio should never strand the player on black.
    const timeout=setTimeout(done,9000);
    audio.addEventListener('ended',done,{once:true});
    audio.addEventListener('error',done,{once:true});
    audio.addEventListener('pause',done,{once:true});
    function done(){
      clearTimeout(timeout);
      audio.removeEventListener('ended',done);
      audio.removeEventListener('error',done);
      audio.removeEventListener('pause',done);
      audio.pause();
      resolve();
    }
    audio.currentTime=0;
    audio.play().catch(done);
  });
}
async function enterThroughDoor(changeScene=enterChamber,transitionAudio=doorAudio){
  if(document.hidden){changeScene();return;}
  enteringDoor=true;
  dungeonMusic.setExploring(false);
  ogreMusic.stop();elfMusic.stop();wizardMusic.stop();dragonMusic.stop();
  const currentFrame=ogreFrame||elfFrame||wizardFrame||dragonFrame;
  if(currentFrame)currentFrame.inert=true;
  // Start playback directly from the entry click for browsers that require a gesture.
  const soundFinished=playTransitionSound(transitionAudio);
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
    frame=ogreFrame||elfFrame||wizardFrame||dragonFrame;
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
    if(elfFrame&&!soundMuted)elfMusic.setExploring(true);
    if(wizardFrame&&!soundMuted)wizardMusic.setExploring(true);
    if(dragonFrame&&!soundMuted&&!dragonEnding&&!dragonVictoryPending)dragonMusic.setExploring(true);
    if(!state.encounter&&!ogreRefresher&&!elfRefresher&&!wizardRefresher)dungeonMusic.setExploring(true);
    if(!reducedMotion){
      const reveal=playFade(1,0,950);
      try{await reveal.finished;}finally{reveal.cancel();}
    }
  }finally{
    if(frame){frame.inert=false;frame.contentWindow.focus();}
    fade.hidden=true;darken?.cancel();enteringDoor=false;syncRoomMusic();if(dragonVictoryPending)beginDragonVictory();
  }
}
function perform(action){
  if(secretRoom)return;
  if(attempt||motion||enteringDoor)return;
  if(action==='wizard-refresher'&&state.wizard.completed){
    panel=null;modal.close();wizardRefresher=true;syncPanels();wizardFrame.contentWindow.focus();return;
  }
  if(action==='elf-refresher'&&state.queen.completed){
    panel=null;modal.close();elfRefresher=true;syncPanels();elfFrame.contentWindow.focus();return;
  }
  if(action==='ogre-refresher'&&state.completed){
    panel=null;modal.close();ogreRefresher=true;syncPanels();ogreFrame.contentWindow.focus();return;
  }
  if(action==='show-name'&&state.dragon.victory){openPanel('victory');return;}
  const now=performance.now();if(now-lastInput<220)return;lastInput=now;
  if(action==='reset'){endingPlayback.stop();dragonEnding=false;dragonVictoryReady=false;dragonVictoryPending=false;ogreRefresher=false;elfRefresher=false;wizardRefresher=false;state=fresh();writable=!previewMode;showStorageWarning();persist();panel=null;modal.close();render();return;}
  if(panel&&panel!=='encounter'&&panel!=='gate')return;
  if(action==='gate-enter'&&state.gate){if(state.gate==='dragon'&&!guardiansReady(state)&&!state.dragon.victory){state=act(state,action);render();return;}enterThroughDoor();return;}
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
  if(secretRoom)return;
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
