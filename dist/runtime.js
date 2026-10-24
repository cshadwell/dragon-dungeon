// Supplied maze + user-approved encounter locations. The small prototype remains intact.
import * as adventure from './engine.js?v=94a4c0988f32';
import {MAZE_ROWS,MAZE_START,MAZE_WIDTH,MAZE_HEIGHT} from './maze-data.js?v=94a4c0988f32';
export const MAZE_ONLY=false;
export const WORLD_WIDTH=MAZE_WIDTH,WORLD_HEIGHT=MAZE_HEIGHT;
export const START=MAZE_START,ENCOUNTER='35,30',WIZARD='4,22',QUEEN='56,4',DRAGON='0,0',DIRS=adventure.DIRS;
export const cells=new Set(MAZE_ROWS.flatMap((row,y)=>Array.from(row).flatMap((c,x)=>c==='.'?[`${x},${y}`]:[])));
export const WORLD={START,ENCOUNTER,WIZARD,QUEEN,DRAGON,cells,CONTENT:'maze-encounters-1'};
export const neighbor=adventure.neighbor;
export const SAVE_KEY='dragon-dungeon-maze-adventure-v1';
const EXPLORATION_KEY='dragon-dungeon-maze-image-v1';
export function fresh(){return {...adventure.fresh(),content:WORLD.CONTENT,gate:null,pos:START,checkpoint:START,facing:0,visited:[START],message:'You stand at the southeast entrance. Seek the three guardians, then confront the dragon. Their locations appear on the map only after discovery.'};}
export function act(s,a){
 if(s.gate==='ogre'){
   if(a==='gate-enter'){const next=adventure.act({...s,gate:null},'interact',WORLD);next.message='You pass through the iron-braced gate into the ogre’s hall.';return next;}
   if(a==='gate-decline')return {...s,gate:null,message:'You remain outside the ogre’s gate. You may continue exploring or enter later.'};
   return structuredClone(s);
 }
 if(a==='interact'&&s.pos===ENCOUNTER&&!s.encounter)return {...s,gate:'ogre'};
 const next=adventure.act(s,a,WORLD);
 if(!s.encounter&&['forward','back'].includes(a)&&next.pos!==s.pos&&next.pos===ENCOUNTER){next.encounter=null;next.gate='ogre';next.message='A heavy wood-and-iron gate bars the entrance to the ogre’s hall. Enter?';}
 return next;
}
export const valid=s=>adventure.valid(s,WORLD)&&([undefined,null].includes(s.gate)||(s.gate==='ogre'&&s.pos===ENCOUNTER&&s.encounter===null));
function explorationValid(s){return s&&s.content==='maze-image-1'&&cells.has(s.pos)&&Number.isInteger(s.facing)&&s.facing>=0&&s.facing<4&&Array.isArray(s.visited)&&s.visited.every(p=>cells.has(p))&&s.visited.includes(s.pos)&&s.visited.includes(START);}
export function load(storage){try{
 const raw=storage.getItem(SAVE_KEY);
 if(raw!==null){try{let s=JSON.parse(raw);if(s.pos==='35,29'&&(s.gate==='ogre'||(s.encounter&&!['wizard','queen','dragon'].includes(s.encounter)))&&adventure.valid(s,{...WORLD,ENCOUNTER:'35,29'})){s={...s,pos:ENCOUNTER,visited:[...new Set([...s.visited,ENCOUNTER])]};}if(valid(s))return {state:{...s,gate:s.gate??null},writable:true,notice:'Maze adventure restored. Earlier saves kept separate.'};}catch{}return {state:fresh(),writable:false,notice:'Unreadable adventure save preserved. New game can replace it.'};}
 const previous=storage.getItem(EXPLORATION_KEY);
 if(previous){try{const old=JSON.parse(previous);if(explorationValid(old)){
   let s={...fresh(),pos:old.pos,facing:old.facing,visited:[...new Set(old.visited)],message:'Your explored paths are retained. The four marked encounters are now active; this maze has fresh encounter progress.'};
   if([ENCOUNTER,WIZARD,QUEEN,DRAGON].includes(s.pos))s=act(s,'interact');
   return {state:s,writable:true,notice:'Exploration imported; encounters active. Earlier saves preserved.'};
 }}catch{}}
 return {state:fresh(),writable:true,notice:'Maze adventure saves separately on this browser.'};
}catch{return {state:fresh(),writable:false,notice:'Storage unavailable. Progress lasts for this session.'};}}
export function save(storage,s){return adventure.save({setItem:(unused,value)=>storage.setItem(SAVE_KEY,value)},s);}
