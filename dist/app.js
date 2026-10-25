import {MAZE_ONLY,DRAGON,QUEEN,WIZARD} from './runtime.js?v=830f4095e72a';
import {MOTION,navigationChanged,transitionPose,motionDuration} from './movement.js?v=830f4095e72a';
import {drawCorridor} from './corridor.js?v=830f4095e72a';
import {exploredMap} from './explored-map.js?v=830f4095e72a';
import {dragonView,dragonArt} from './dragon.js?v=830f4095e72a';
import {queenView,queenArt} from './queen.js?v=830f4095e72a';
import {wizardView,wizardArt} from './wizard.js?v=830f4095e72a';
import {createAttempt,tick,respond} from './reaction.js?v=830f4095e72a';
import {lessons} from './ogre.js?v=830f4095e72a';
import {ogreView} from './ogre.js?v=830f4095e72a';
import {ogreArt,flameDiagram} from './ogre-art.js?v=830f4095e72a';
import {act,fresh,load,save,SAVE_KEY,cells,neighbor,START,ENCOUNTER} from './runtime.js?v=830f4095e72a';
const $=id=>document.getElementById(id), modal=$('modal');
let storage;try{storage=window.localStorage;}catch{}
let loaded=load(storage), state=loaded.state, writable=loaded.writable, panel=null, lastInput=0;
$('storage').textContent=loaded.notice;
// Local, isolated review link; never writes over the player's adventure save.
const previewMode=['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).get('preview')==='ogre';
if(previewMode){state={...fresh(),pos:'35,32',facing:0,visited:[START,'35,32'],gate:null,message:'An iron-bound wooden door stands at the end of the corridor.'};writable=false;$('storage').textContent='Ogre approach preview — progress is not saved.';}

let attempt=null, reactionFrame=null, slowReaction=false, motion=null;
const names=['NORTH','EAST','SOUTH','WEST'];
function persist(){if(writable&&!save(storage,state)){writable=false;$('storage').textContent='Saving failed. Progress lasts only for this open session.';}}
function scene(){drawCorridor($('scene'),state);}
function render(){
  $('direction').textContent=names[state.facing];$('health').textContent='♥ '.repeat(state.health)+'♡ '.repeat(3-state.health);
  $('health').setAttribute('aria-label',`${state.health} of 3 health`);
  $('location').textContent=state.pos===START?'LANTERN CHECKPOINT':state.pos===ENCOUNTER?'THE OGRE’S HALL':state.pos===WIZARD?'THE WIZARD’S STUDY':state.pos===QUEEN?'THE ROOT COURT':state.pos===DRAGON?'THE BOUND CHAMBER':'STONE PASSAGE';
  $('message').textContent=state.message;$('interact').hidden=![ENCOUNTER,WIZARD,QUEEN,DRAGON].includes(state.pos);$('interact').textContent=state.pos===WIZARD?'Speak to the wizard':state.pos===QUEEN?'Speak to the elf queen':state.pos===DRAGON?'Approach the dragon':'Approach the ogre’s gate';
  $('dragon-return').hidden=state.pos!==START||!state.dragon.discovered;$('earned-name').hidden=!state.dragon.victory;
  if(MAZE_ONLY){$('location').textContent=state.pos===START?'SOUTHEAST ENTRANCE':'DUNGEON PASSAGE';$('health').hidden=true;$('interact').hidden=true;}
  $('live-map').innerHTML=exploredMap(state);
  scene();if(state.encounter)openPanel('encounter');else if(state.gate)openPanel('gate');else syncPanels();
}
function syncPanels(){
  const inside=Boolean(state.encounter);
  document.body.classList.toggle('encounter-room',inside);
  const controls=$('encounter-controls');controls.replaceChildren();controls.hidden=!inside;
  if(inside){for(const node of [...$('modal-body').children])if(node.matches('.choices,.guards,.angles,.ready,.selection,#reaction-start,#reaction-slow'))controls.append(node);}
  $('message').hidden=modal.open;
  $('interact').disabled=modal.open;$('interact').hidden=MAZE_ONLY||modal.open||![ENCOUNTER,WIZARD,QUEEN,DRAGON].includes(state.pos);
  document.querySelectorAll('[data-action]').forEach(b=>b.disabled=modal.open);
  for(const id of ['map','journal','reset','earned-name','dragon-return'])$(id).disabled=Boolean(state.encounter||state.gate);
  if(panel==='encounter'){
    const art=$('modal-body').querySelector('.ogre-art,.wizard-art,.queen-art,.dragon-art');
    if(art)$('scene').replaceChildren(art);
  }
}
function openPanel(type){
  if(motion)return;
  panel=type;updatePanel();if(!modal.open)modal.show();
  syncPanels();
}
function choice(label,action){const b=document.createElement('button');b.textContent=label;b.onclick=()=>perform(action);return b;}
function updatePanel(){
  modal.classList.remove('reaction-active');document.body.classList.remove('in-reaction');
  const body=$('modal-body');body.replaceChildren();$('close').hidden=panel==='encounter'||panel==='gate';
  $('modal-label').textContent=panel==='encounter'?(state.encounter==='wizard'?'THE WIZARD’S STUDY · ':state.encounter==='queen'?'THE ROOT COURT · ':state.encounter==='dragon'?'THE BOUND CHAMBER · ':'THE SHIELD KEEPER · ')+state.health+' / 3 HEALTH':'FIELD NOTES';
  if(panel==='gate'){
    $('modal-label').textContent='OUTSIDE THE OGRE’S HALL';$('modal-title').textContent='A gate of oak and iron.';
    const text=document.createElement('p');text.textContent='Heavy wooden planks are bound with riveted iron. From beyond the gate comes a deliberate, rumbling snort. Do you wish to enter?';body.append(text);
    const choices=document.createElement('div');choices.className='choices';choices.append(choice('Open the gate and enter','gate-enter'),choice('Stay in the maze','gate-decline'));body.append(choices);
  }else if(panel==='map'){
    $('modal-title').textContent='The passages you know.';
    body.innerHTML=exploredMap(state)+'<p>▲ Position and facing · Red square: entrance · Gold arrow: facing · O/W/Q/D: discovered guardians</p><p>Dotted stubs mark visible openings into unvisited rooms. Black areas remain concealed.</p>'+(state.dragon.discovered?'<p>The lantern passage links your checkpoint and the dragon chamber.</p>':'');
  }else if(panel==='journal'){
    if(MAZE_ONLY){$('modal-title').textContent='Maze exploration';body.innerHTML='<p>Encounters are disabled for this navigation test. Follow the corridors, return to the entrance, and watch the map fill in as you explore.</p>';return;}
    $('modal-title').textContent='What you carry.';body.innerHTML='<h3>Inventory</h3>';const items=document.createElement('p');items.textContent=state.items.join(', ')||'Nothing yet.';body.append(items);const h=document.createElement('h3');h.textContent='Discoveries';body.append(h);const k=document.createElement('p');k.textContent=state.knowledge.join(' ')||'Seek the ogre. Watch his stance before committing your guard.';body.append(k);
    const count=Number(state.completed)+Number(state.wizard.completed)+Number(state.queen.completed);
    if(count){const p=document.createElement('p');p.className='note';p.textContent=count===3?'All three discoveries earned: shield, lens, and queen’s seal. Seek the dragon in the eastern chamber.':`${count} of 3 discoveries earned. The ogre, wizard, and queen may be visited in any order.`;body.append(p);}
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
    if(state.encounter==='queen'){
      const view=queenView(state);$('modal-title').textContent=view.title;
      const art=document.createElement('div');art.innerHTML=queenArt(state);body.append(art);
      const text=document.createElement('p');text.textContent=view.text;body.append(text);
      const choices=document.createElement('div');choices.className='choices';for(const [label,action]of view.choices)choices.append(choice(label,action));body.append(choices);return;
    }
    if(state.encounter==='wizard'){
      const view=wizardView(state);$('modal-title').textContent=view.title;
      const art=document.createElement('div');art.innerHTML=wizardArt(state);body.append(art);
      const text=document.createElement('p');text.textContent=view.text;body.append(text);
      if(view.claim){const claim=document.createElement('blockquote');claim.className='mask-claim';claim.textContent=view.claim;body.append(claim);}
      if(view.inscription){const inscription=document.createElement('p');inscription.className='revealed-inscription';inscription.textContent=view.inscription;body.append(inscription);}
      const choices=document.createElement('div');choices.className='choices';for(const [label,action]of view.choices)choices.append(choice(label,action));body.append(choices);return;
    }
    const view=state.encounter==='dragon'?dragonView(state):ogreView(state);
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
window.addEventListener('blur',()=>{cancelReaction();finishMotion();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelReaction();finishMotion();}});
function finishMotion(){
  if(!motion)return;
  cancelAnimationFrame(motion.frame);motion=null;$('scene').removeAttribute('aria-busy');render();
}
function animateNavigation(from,to,action){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){render();return;}
  const duration=motionDuration(action),start=performance.now();
  motion={frame:null,last:-Infinity};$('scene').setAttribute('aria-busy','true');
  document.querySelectorAll('[data-action],.toolbar button,#interact').forEach(b=>b.disabled=true);
  const frame=now=>{
    if(!motion)return;
    const t=Math.min(1,(now-start)/duration);
    if(t>=1){finishMotion();return;}
    if(now-motion.last>=1000/MOTION.fps){drawCorridor($('scene'),from,transitionPose(from,to,action,t));motion.last=now;}
    motion.frame=requestAnimationFrame(frame);
  };
  motion.frame=requestAnimationFrame(frame);
}
function perform(action){
  if(attempt||motion)return;
  if(action==='show-name'&&state.dragon.victory){openPanel('victory');return;}
  const now=performance.now();if(now-lastInput<220)return;lastInput=now;
  if(action==='reset'){state=fresh();writable=!previewMode;persist();$('storage').textContent=writable?'New expedition. Progress saves on this browser.':'Storage unavailable. Session only.';panel=null;modal.close();render();return;}
  if(panel&&panel!=='encounter'&&panel!=='gate')return;
  const before=state;
  state=act(state,action);persist();
  if(['forward','back','left','right'].includes(action)&&navigationChanged(before,state)){
    animateNavigation(before,state,action);return;
  }
  if(!state.encounter&&modal.open){panel=null;modal.close();}render();
}
$('map').onclick=()=>openPanel('map');$('journal').onclick=()=>openPanel('journal');$('reset').onclick=()=>openPanel('reset');$('close').onclick=close;
$('interact').onclick=()=>perform('interact');
$('dragon-return').onclick=()=>perform('dragon-shortcut');$('earned-name').onclick=()=>openPanel('victory');
modal.addEventListener('cancel',e=>{e.preventDefault();if(panel!=='encounter'&&panel!=='gate')close();});
document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>perform(b.dataset.action));
window.addEventListener('keydown',e=>{
  if(e.repeat){if(e.key.startsWith('Arrow'))e.preventDefault();return;}
  if(motion){if(e.key.startsWith('Arrow'))e.preventDefault();return;}
  if(e.key==='Escape'&&modal.open&&panel!=='encounter'){e.preventDefault();close();return;}
  const action={ArrowUp:'forward',ArrowDown:'back',ArrowLeft:'left',ArrowRight:'right'}[e.key];
  if(action){e.preventDefault();if(attempt){const guard={ArrowLeft:'left',ArrowUp:'high',ArrowRight:'right'}[e.key];if(guard)react(guard);}else if(!modal.open)perform(action);return;}
  if(['m','j'].includes(e.key.toLowerCase())){if(['BUTTON','INPUT','TEXTAREA'].includes(e.target.tagName)&&e.key===' ')return;e.preventDefault();if(modal.open){if(panel!=='encounter'&&panel!=='gate')close();}else openPanel(e.key.toLowerCase()==='m'?'map':'journal');}
});render();
