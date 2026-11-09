import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,act,valid,save,load,banishDragon,BANISH_SPAWNS,DRAGON_RETURN_MESSAGE,cells,neighbor,START,DRAGON,ENCOUNTER,WIZARD,QUEEN} from '../dist/runtime.js';
function challenger(){
 let s=fresh();
 for(const [pos,begin,actions] of [[ENCOUNTER,'intro',['attack-practice-1','attack-practice-2','attack-complete']],[WIZARD,'wizard',['mind-progress-12','mind-complete']],[QUEEN,'queen',['defence-progress-12','defence-complete']]]){
  s={...s,pos,encounter:begin,visited:[...new Set([...s.visited,pos])]};for(const action of actions)s=act(s,action);
 }
 s={...s,pos:DRAGON,encounter:null,visited:[...new Set([...s.visited,DRAGON])]};s=act(s,'interact');return act(s,'gate-enter');
}
test('five banishment spots are walkable, distinct, connected, away from entry and doors, and face an opening',()=>{
 assert.equal(BANISH_SPAWNS.length,5);assert.equal(new Set(BANISH_SPAWNS.map(s=>s.pos)).size,5);
 const reached=new Set([DRAGON]),queue=[DRAGON];for(let n=0;n<queue.length;n++)for(let d=0;d<4;d++){const p=neighbor(queue[n],d);if(cells.has(p)&&!reached.has(p)){reached.add(p);queue.push(p);}}
 for(const spawn of BANISH_SPAWNS){assert.ok(reached.has(spawn.pos));assert.ok(cells.has(neighbor(spawn.pos,spawn.facing)));assert.ok(![START,DRAGON,ENCOUNTER,WIZARD,QUEEN].includes(spawn.pos));}
});
test('banishment preserves all guardians and exploration, clears the encounter, and saves the return journey',()=>{
 const original=challenger();assert.ok(valid(original));
 for(let i=0;i<5;i++){
  const s=banishDragon(original,()=>i/5+.01);assert.equal(s.pos,BANISH_SPAWNS[i].pos);assert.ok(valid(s));assert.equal(s.encounter,null);assert.equal(s.gate,null);assert.equal(s.dragonReturn,true);assert.equal(s.message,DRAGON_RETURN_MESSAGE);
  for(const key of ['items','knowledge','ogre','wizard','queen','completed','checkpoint'])assert.deepEqual(s[key],original[key]);
  assert.ok(original.visited.every(p=>s.visited.includes(p)));assert.ok(s.visited.includes(s.pos));
  const data=new Map(),storage={setItem:(k,v)=>data.set(k,v),getItem:k=>data.get(k)??null};assert.ok(save(storage,s));assert.deepEqual(load(storage).state,s);
  const moved=act(s,'forward');assert.equal(moved.message,DRAGON_RETURN_MESSAGE);assert.equal(moved.dragonReturn,true);
  const atDoor={...s,pos:DRAGON,gate:'dragon'};const entered=act(atDoor,'gate-enter');assert.equal(entered.dragonReturn,false);assert.equal(entered.encounter,'dragon');assert.equal(entered.dragon.phase,'intro');
 }
});
test('banishment cannot move a player outside the active dragon encounter',()=>{const s=fresh();assert.deepEqual(banishDragon(s),s);});
test('banishment never revokes a previously earned independent dragon name',()=>{
 const s=challenger();s.dragon={...s.dragon,phase:'victory',victory:true,name:'TEST',placeholder:true};assert.ok(valid(s));
 const next=banishDragon(s,()=>0);assert.deepEqual(next.dragon,s.dragon);assert.ok(valid(next));
});
