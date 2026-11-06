import {LENS,wizardNotes} from './wizard.js?v=5770abe5927f';
import {SEAL,queenNotes} from './queen.js?v=5770abe5927f';
import {SHIELD,notes} from './ogre.js?v=5770abe5927f';
import {mazeHint} from './maze-hints.js?v=5770abe5927f';
// Supplied maze + user-approved encounter locations. The small prototype remains intact.
import * as adventure from './engine.js?v=5770abe5927f';
import {MAZE_ROWS,MAZE_START,MAZE_WIDTH,MAZE_HEIGHT} from './maze-data.js?v=5770abe5927f';
export const MAZE_ONLY=false;
export const WORLD_WIDTH=MAZE_WIDTH,WORLD_HEIGHT=MAZE_HEIGHT;
export const START=MAZE_START,ENCOUNTER='35,30',WIZARD='3,22',QUEEN='55,4',DRAGON='0,1',DIRS=adventure.DIRS;
export const cells=new Set(MAZE_ROWS.flatMap((row,y)=>Array.from(row).flatMap((c,x)=>c==='.'?[`${x},${y}`]:[])));
export const WORLD={START,ENCOUNTER,WIZARD,QUEEN,DRAGON,cells,CONTENT:'maze-encounters-1'};
export const neighbor=adventure.neighbor;
export const SAVE_KEY='dragon-dungeon-maze-adventure-v1';
const EXPLORATION_KEY='dragon-dungeon-maze-image-v1';
export function fresh(){return {...adventure.fresh(),content:WORLD.CONTENT,gate:null,pos:START,checkpoint:START,facing:0,visited:[START],message:'You stand at the southeast entrance. Seek the three guardians, then confront the dragon. Their locations appear on the map only after discovery.'};}
export function act(s,a){
 if(s.pos===WIZARD&&s.encounter==='wizard'&&(a==='mind-complete'||/^mind-progress-[0-9]$/.test(a))){
  const next=structuredClone(s),w=next.wizard;
  if(a.startsWith('mind-progress-'))w.mindCorrect=Math.max(w.mindCorrect??0,Number(a.slice(-1)));
  if(a==='mind-complete'&&(w.mindCorrect??0)>=9){w.completed=true;w.phase='done';w.returnTo=null;next.items=[...new Set([...next.items,LENS])];next.knowledge=[...new Set([...next.knowledge,...wizardNotes])];next.message='Focus mastered. The wizard’s revealing lens is yours.';}
  return next;
 }

 // The attack encounter replaces the live Ogre UI; retain legacy save/reward fields
 // until the remaining guardians and dragon are deliberately redesigned.
 if(s.pos===QUEEN&&s.encounter==='queen'&&(a==='defence-complete'||/^defence-progress-[0-9]$/.test(a))){
  const next=structuredClone(s),q=next.queen;
  if(a.startsWith('defence-progress-'))q.defenceBlocks=Math.max(q.defenceBlocks??0,Number(a.slice(-1)));
  if(a==='defence-complete'&&(q.defenceBlocks??0)>=9){q.completed=true;q.phase='done';q.observed=true;q.returnTo=null;q.feedback='';next.items=[...new Set([...next.items,SEAL])];next.knowledge=[...new Set([...next.knowledge,...queenNotes])];next.message='Defence mastered. The Elf Queen’s seal is yours.';}
  return next;
 }
 const inOgre=s.pos===ENCOUNTER&&s.encounter&&!['wizard','queen','dragon'].includes(s.encounter);
 if(inOgre&&['attack-practice-1','attack-practice-2','attack-complete'].includes(a)){
  const next=structuredClone(s);
  if(a==='attack-complete'){
   next.completed=true;next.items=[...new Set([...next.items,SHIELD])];next.knowledge=[...new Set([...next.knowledge,...notes])];
   next.ogre={...next.ogre,attackPractice:2,round:3,taught:true,guard:null,angle:null};next.encounter='reward';next.message='You proved your timing and accuracy. The Ogre’s polished shield is yours.';
  }else next.ogre.attackPractice=Math.max(next.ogre.attackPractice??0,Number(a.slice(-1)));
  return next;
 }
 const entries={ogre:ENCOUNTER,wizard:WIZARD,queen:QUEEN,dragon:DRAGON};
 const character=Object.keys(entries).find(k=>entries[k]===s.pos);
 if(s.gate){
   if(a==='gate-enter'){const next=adventure.act({...s,gate:null},'interact',WORLD);next.message='You enter the '+s.gate+' chamber.';return next;}
   if(a==='gate-decline')return {...s,gate:null,message:'You remain outside the chamber. You may continue exploring or enter later.'};
   return structuredClone(s);
 }
 if(a==='interact'&&character&&!s.encounter)return {...s,gate:character};
 const next=adventure.act(s,a,WORLD);
 if(s.encounter==='wizard'&&a==='leave')next.message='The wizard waits in his study. Your focus training progress is retained.';
 if(s.encounter==='queen'&&a==='leave')next.message='The Elf Queen waits in her shrine. Your defence training progress is retained.';
 if(!s.encounter&&['forward','back'].includes(a)&&next.pos===s.pos)next.message=s.message;
 // Only successful exploration steps replace ambient text; gate/encounter feedback wins.
 if(!s.encounter&&['forward','back'].includes(a)&&next.pos!==s.pos&&!next.encounter)next.message=mazeHint(next.pos);
 if(!s.encounter&&['forward','back'].includes(a)&&next.pos!==s.pos&&Object.values(entries).includes(next.pos)){next.encounter=null;next.gate=Object.keys(entries).find(k=>entries[k]===next.pos);next.message='You stand in front of a door in the passage.';}
 return next;
}
export const valid=s=>adventure.valid(s,WORLD)&&(s.wizard.mindCorrect===undefined||(Number.isInteger(s.wizard.mindCorrect)&&s.wizard.mindCorrect>=0&&s.wizard.mindCorrect<=9))&&(s.queen.defenceBlocks===undefined||(Number.isInteger(s.queen.defenceBlocks)&&s.queen.defenceBlocks>=0&&s.queen.defenceBlocks<=9))&&(s.ogre.attackPractice===undefined||(Number.isInteger(s.ogre.attackPractice)&&s.ogre.attackPractice>=0&&s.ogre.attackPractice<=2))&&([undefined,null].includes(s.gate)||(['ogre','wizard','queen','dragon'].includes(s.gate)&&s.pos===({ogre:ENCOUNTER,wizard:WIZARD,queen:QUEEN,dragon:DRAGON}[s.gate])&&s.encounter===null));
function explorationValid(s){return s&&s.content==='maze-image-1'&&cells.has(s.pos)&&Number.isInteger(s.facing)&&s.facing>=0&&s.facing<4&&Array.isArray(s.visited)&&s.visited.every(p=>cells.has(p))&&s.visited.includes(s.pos)&&s.visited.includes(START);}
export function load(storage){try{
 const raw=storage.getItem(SAVE_KEY);
 if(raw!==null){try{let s=JSON.parse(raw);if(s.pos==='35,29'&&(s.gate==='ogre'||(s.encounter&&!['wizard','queen','dragon'].includes(s.encounter)))&&adventure.valid(s,{...WORLD,ENCOUNTER:'35,29'})){s={...s,pos:ENCOUNTER,visited:[...new Set([...s.visited,ENCOUNTER])]};}if(['4,22','56,4','0,0'].includes(s.pos)){const oldWorld={...WORLD,WIZARD:'4,22',QUEEN:'56,4',DRAGON:'0,0'};if(adventure.valid(s,oldWorld)){s={...s,pos:({'4,22':WIZARD,'56,4':QUEEN,'0,0':DRAGON}[s.pos])};s.visited=[...new Set([...s.visited,s.pos])];}}if(s.dragon?.discovered&&s.visited?.includes('0,0')&&!s.visited.includes(DRAGON))s={...s,visited:[...s.visited,DRAGON]};if(valid(s))return {state:{...s,gate:s.gate??null},writable:true,notice:'Maze adventure restored. Earlier saves kept separate.'};}catch{}return {state:fresh(),writable:false,notice:'Unreadable adventure save preserved. New game can replace it.'};}
 const previous=storage.getItem(EXPLORATION_KEY);
 if(previous){try{const old=JSON.parse(previous);if(explorationValid(old)){
   let s={...fresh(),pos:old.pos,facing:old.facing,visited:[...new Set(old.visited)],message:'Your explored paths are retained. The four marked encounters are now active; this maze has fresh encounter progress.'};
   if([ENCOUNTER,WIZARD,QUEEN,DRAGON].includes(s.pos))s=act(s,'interact');
   return {state:s,writable:true,notice:'Exploration imported; encounters active. Earlier saves preserved.'};
 }}catch{}}
 return {state:fresh(),writable:true,notice:'Maze adventure saves separately on this browser.'};
}catch{return {state:fresh(),writable:false,notice:'Storage unavailable. Progress lasts for this session.'};}}
export function save(storage,s){return adventure.save({setItem:(unused,value)=>storage.setItem(SAVE_KEY,value)},s);}
