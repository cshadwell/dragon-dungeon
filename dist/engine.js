import {DRAGON,freshDragon,dragonAct,missing,NAME_CONFIG} from './dragon.js?v=6f08161e9101';
import {QUEEN,SEAL,queenNotes,freshQueen,queenAct} from './queen.js?v=6f08161e9101';
import {WIZARD,LENS,wizardNotes,freshWizard,wizardAct} from './wizard.js?v=6f08161e9101';
import {SHIELD,lessons,notes} from './ogre.js?v=6f08161e9101';
export const VERSION = 1;
export const CONTENT = 'dragon-1';
export const DIRS = [[0,-1],[1,0],[0,1],[-1,0]];
export const START = '1,3', ENCOUNTER = '3,1';
export const cells = new Set(['1,3','1,2','1,1','2,1','3,1','3,2','3,3','2,3','2,0','2,4','4,2']);
const DEFAULT_WORLD={START,ENCOUNTER,WIZARD,QUEEN,DRAGON,cells,CONTENT};
export const key = (x,y) => `${x},${y}`;
export function neighbor(pos, direction) {
  const [x,y] = pos.split(',').map(Number), [dx,dy] = DIRS[direction];
  return key(x+dx,y+dy);
}
export function fresh() { return {version:VERSION,content:CONTENT,pos:START,facing:0,health:3,checkpoint:START,visited:[START],items:[],knowledge:[],completed:false,wizard:freshWizard(),queen:freshQueen(),dragon:freshDragon(),ogre:{round:0,guard:null,angle:null,taught:false},encounter:null,message:'The blue lantern marks your checkpoint. Explore the passage ahead.'}; }
export function act(state, action, world=DEFAULT_WORLD) {
  const s = structuredClone(state);
  if(s.encounter==='dragon')return dragonAct(s,action);
  if(s.encounter==='queen')return queenAct(s,action);
  if(s.encounter==='wizard')return wizardAct(s,action);
  if (s.encounter) {
    const o=s.ogre, stage=s.encounter;
    if(action==='leave'){s.encounter=null;o.guard=null;o.angle=null;s.message=s.completed?'The ogre nods. “Keep your eyes open.”':'The ogre waits. Your training progress is safe.';return s;}
    if(action==='begin' && stage==='intro')s.encounter=o.round===3?'flame':o.taught?'brief':'tutorial';
    if(action==='study' && ['brief','hint'].includes(stage))s.encounter='stance';
    if(action==='hint' && stage==='stance')s.encounter='hint';
    if(action==='retry' && stage==='hurt')s.encounter='stance';
    if(action==='continue' && stage==='success')s.encounter=o.round===3?'flame':'brief';
    if(action==='flame-hint' && stage==='flame')s.encounter='flame-hint';
    if(action==='flame-back' && ['flame-hint','flame-miss'].includes(stage))s.encounter='flame';
    if(action==='practice' && stage==='practice-result')s.encounter='tutorial';
    if(action==='trials' && stage==='practice-result' && o.taught)s.encounter='brief';
    if(stage==='flame' && ['angle-left','angle-right','angle-back'].includes(action))o.angle=action.slice(6);
    if(['stance','tutorial'].includes(stage) && ['react-block','react-early','react-late','react-wrong'].includes(action)){
      const result=action.slice(6),practice=stage==='tutorial';
      const feedback={early:'Too early — you raised your guard before the snort. Wait for the nose flare and white breath.',late:'Too late — the swing reached you. Block as soon as the nose flares and SNORT appears.',wrong:'Right moment, wrong direction. Match your guard to the club’s stance.'};
      if(practice){if(result==='block')o.taught=true;s.message=result==='block'?'Your high guard catches the padded club. “That’s it! Stance for where. Snort for when.”':feedback[result];s.encounter='practice-result';}
      else if(result==='block'){s.message=lessons[o.round].reply;o.round++;s.encounter='success';}
      else {s.health--;s.message=feedback[result]+' '+lessons[o.round].tip;s.encounter='hurt';
        if(s.health===0){s.health=3;s.pos=s.checkpoint;s.facing=0;s.encounter=null;s.message='The lantern draws you back. Health restored; map, inventory, and ogre training retained.';}}
    }
    if(action==='ready' && stage==='flame' && o.angle){
      if(o.angle==='right'){s.completed=true;s.items=[...new Set([...s.items,SHIELD])];s.knowledge=[...new Set([...s.knowledge,...notes])];s.encounter='reward';s.message='Polished shield earned. The ogre’s lessons are in your journal.';}
      else{s.encounter='flame-miss';s.message=o.angle==='left'?'The flame travels left, past an empty stone wall.':'The flame returns toward the nozzle, which safely catches it.';}
      o.angle=null;
    }
    return s;
  }
  if(action==='dragon-shortcut'&&s.pos===world.START&&s.dragon.discovered){s.pos=world.DRAGON;s.encounter='dragon';return s;}
  if(action==='interact'&&s.pos===world.DRAGON){s.dragon.discovered=true;s.encounter='dragon';return s;}
  if(action==='interact' && s.pos===world.QUEEN){s.encounter='queen';return s;}
  if(action==='interact' && s.pos===world.WIZARD){s.encounter='wizard';return s;}
  if(action==='interact' && s.pos===world.ENCOUNTER){s.encounter=s.completed?'reward':'intro';return s;}
  if(action === 'left') s.facing=(s.facing+3)%4;
  if(action === 'right') s.facing=(s.facing+1)%4;
  if(action === 'forward' || action === 'back') {
    const next=neighbor(s.pos,(s.facing+(action==='back'?2:0))%4);
    if(!world.cells.has(next)) {s.message='A stone wall blocks the way.';return s;}
    s.pos=next;if(!s.visited.includes(next))s.visited.push(next);
    s.message=next===world.START?'The checkpoint lantern burns steadily.':'Your footsteps echo through the passage.';
    if(next===world.DRAGON){s.dragon.discovered=true;s.encounter='dragon';}
    if(next===world.QUEEN && !s.queen.completed)s.encounter='queen';
    if(next===world.WIZARD && !s.wizard.completed)s.encounter='wizard';
    if(next===world.ENCOUNTER && !s.completed) s.encounter='intro';
  }
  return s;
}
export function valid(s, world=DEFAULT_WORLD) {
  const stages=[null,'intro','brief','stance','hint','success','hurt','flame','flame-hint','flame-miss','reward','tutorial','practice-result','wizard','queen','dragon'];
  if(!(s && s.version===VERSION && s.content===world.CONTENT && world.cells.has(s.pos) && s.checkpoint===world.START && Number.isInteger(s.facing) && s.facing>=0 && s.facing<4 && Number.isInteger(s.health) && s.health>=1 && s.health<=3 && Array.isArray(s.visited) && s.visited.every(p=>world.cells.has(p)) && s.visited.includes(s.pos) && Array.isArray(s.items) && s.items.every(x=>[SHIELD,LENS,SEAL].includes(x)) && new Set(s.items).size===s.items.length && Array.isArray(s.knowledge) && s.knowledge.every(x=>[...notes,...wizardNotes,...queenNotes].includes(x)) && typeof s.completed==='boolean' && s.completed===s.items.includes(SHIELD) && stages.includes(s.encounter) && (!s.encounter || s.pos===(s.encounter==='wizard'?world.WIZARD:s.encounter==='queen'?world.QUEEN:s.encounter==='dragon'?world.DRAGON:world.ENCOUNTER))))return false;
  const d=s.dragon;
  if(!d||!['intro','aim','aim-feedback','breath','ward','seals','yielded','restraint-feedback','hurt','victory'].includes(d.phase)||typeof d.discovered!=='boolean'||typeof d.victory!=='boolean'||typeof d.feedback!=='string'||![null,'breath','seals'].includes(d.returnTo))return false;
  if((d.phase==='hurt')!==(d.returnTo!==null)||d.victory!==(d.phase==='victory'))return false;
  if(d.discovered&&!s.visited.includes(world.DRAGON))return false;
  if(s.encounter==='dragon'&&!d.discovered)return false;
  if(![undefined,false,true].includes(d.trialCompleted)||![undefined,false,true].includes(d.prizeRevealed))return false;
  if(d.prizeRevealed&&!d.victory)return false;
  if(d.trialCompleted&&(!d.victory||d.name!==NAME_CONFIG.name||d.placeholder!==false))return false;
  if(d.phase!=='intro'&&(!d.discovered||(missing(s).length&&!d.trialCompleted)))return false;
  if(d.victory ? !(typeof d.name==='string'&&/^[A-Z]{4}$/.test(d.name)&&typeof d.placeholder==='boolean') : !(d.name===null&&d.placeholder===null))return false;
  const q=s.queen;
  if(!q || !['intro','guarded','observed','threatened','calm','calm-observed','offer-wait','invited','waiting','hurt','yielded','overreach','done'].includes(q.phase) || typeof q.completed!=='boolean' || typeof q.observed!=='boolean' || typeof q.feedback!=='string' || ![null,'observed'].includes(q.returnTo))return false;
  if(q.completed!==s.items.includes(SEAL) || q.completed!==(q.phase==='done') || (q.phase==='hurt')!==(q.returnTo==='observed'))return false;
  if(q.completed && !queenNotes.every(n=>s.knowledge.includes(n)))return false;
  const w=s.wizard;
  if(!w || !['intro','one','uncertain','two','reason','reason-error','error','lens','reveal','done'].includes(w.phase) || typeof w.completed!=='boolean' || ![null,'two'].includes(w.returnTo))return false;
  if(w.completed!==s.items.includes(LENS) || w.completed!==(w.phase==='done') || (w.phase==='error')!==(w.returnTo==='two'))return false;
  if(w.completed && !wizardNotes.every(n=>s.knowledge.includes(n)))return false;
  const o=s.ogre;
  if(!o || typeof o.taught!=='boolean' || !Number.isInteger(o.round) || o.round<0 || o.round>3 || ![null,'high','left','right'].includes(o.guard) || ![null,'left','right','back'].includes(o.angle))return false;
  if(o.round>0 && !o.taught)return false;
  if(['tutorial','practice-result'].includes(s.encounter) && o.round!==0)return false;
  if(s.completed && (o.round!==3 || !notes.every(n=>s.knowledge.includes(n))))return false;
  if(s.encounter==='reward' && !s.completed)return false;
  if(['brief','stance','hint','hurt'].includes(s.encounter) && o.round===3)return false;
  if(['flame','flame-hint','flame-miss'].includes(s.encounter) && o.round!==3)return false;
  if(s.encounter==='success' && o.round===0)return false;
  return true;
}
export const SAVE_KEY='dragon-dungeon-prototype-v1';
export function load(storage) {
  try {
    const raw=storage.getItem(SAVE_KEY);
    if(raw===null)return {state:fresh(),notice:'Progress saves on this browser and device.',writable:true};
    try {let state=JSON.parse(raw);
      if(state?.version===1 && state?.content==='prototype-1' && cells.has(state.pos) && Array.isArray(state.visited) && state.visited.every(p=>cells.has(p)) && state.visited.includes(state.pos) && Number.isInteger(state.facing) && state.facing>=0 && state.facing<4 && Number.isInteger(state.health) && state.health>=1 && state.health<=3){
        state={...fresh(),pos:state.pos,facing:state.facing,health:state.health,visited:state.visited,message:'The ogre encounter is now available. Your explored map and position were retained; the old trial token has been retired.'};
        if(state.pos===ENCOUNTER)state.encounter='intro';
        return {state,notice:'Prototype save upgraded: map and position retained. Visit the ogre to earn the shield.',writable:true};
      }
      if(state?.content==='ogre-1'){
        const candidate=structuredClone(state);candidate.content=CONTENT;candidate.wizard=freshWizard();candidate.queen=freshQueen();candidate.dragon=freshDragon();candidate.ogre={...candidate.ogre,taught:candidate.ogre?.round>0};
        if(candidate.completed)candidate.knowledge=[...notes];
        if(valid(candidate)){state=candidate;if(state.encounter==='stance'){state.encounter='brief';state.ogre.guard=null;}return {state,notice:'Ogre challenge updated. Map, shield, and completed trials retained. New attempts use the visible snort cue.',writable:true};}
      }
      if(state?.content==='ogre-2'){
        const candidate={...state,content:CONTENT,wizard:freshWizard(),queen:freshQueen(),dragon:freshDragon()};
        if(valid(candidate))return {state:candidate,notice:'Wizard added. Your map, health, shield, and ogre training are retained.',writable:true};
      }
      if(state?.content==='wizard-1'){
        const candidate={...state,content:CONTENT,queen:freshQueen(),dragon:freshDragon()};
        if(valid(candidate))return {state:candidate,notice:'Elf queen added. Your map, items, and previous encounter progress are retained.',writable:true};
      }
      if(state?.content==='queen-1'){
        const candidate={...state,content:CONTENT,dragon:freshDragon()};
        if(valid(candidate))return {state:candidate,notice:'Dragon added. Your map, items, and creature progress are retained.',writable:true};
      }
      if(valid(state))return {state,notice:'Progress restored on this device.',writable:true};}catch{}
    return {state:fresh(),notice:'Saved data could not be read. It has been preserved. This session will not overwrite it; use New game to replace it.',writable:false};
  }catch{return {state:fresh(),notice:'Browser storage is unavailable. Progress lasts only for this open session.',writable:false};}
}
export function save(storage,state){try{storage.setItem(SAVE_KEY,JSON.stringify(state));return true;}catch{return false;}}
