import {test} from 'node:test';import assert from 'node:assert/strict';
import {fresh,act,valid,save,load,QUEEN} from '../dist/runtime.js';import {SEAL} from '../dist/queen.js';
function enter(){const s=fresh();s.pos=QUEEN;s.visited.push(QUEEN);return act(act(s,'interact'),'gate-enter');}
const memory=()=>({value:null,getItem(){return this.value;},setItem(k,v){this.value=v;}});
test('defence progress persists through retreat/re-entry and reload without early rewards',()=>{
 let s=act(enter(),'defence-progress-4');assert.equal(s.queen.defenceBlocks,4);assert.ok(valid(s));assert.ok(!s.items.includes(SEAL));
 s=act(s,'defence-complete');assert.ok(!s.items.includes(SEAL));s=act(s,'leave');s=act(act(s,'interact'),'gate-enter');assert.equal(s.queen.defenceBlocks,4);
 s=act(s,'defence-progress-2');assert.equal(s.queen.defenceBlocks,4);const storage=memory();save(storage,s);assert.equal(load(storage).state.queen.defenceBlocks,4);
});
test('nine defence blocks grant Queen seal once and preserve unchanged dragon prerequisites',()=>{
 let s=act(act(enter(),'defence-progress-9'),'defence-complete');assert.ok(valid(s));assert.equal(s.queen.phase,'done');assert.equal(s.queen.completed,true);assert.equal(s.items.filter(i=>i===SEAL).length,1);
 s=act(s,'defence-complete');assert.equal(s.items.filter(i=>i===SEAL).length,1);const storage=memory();save(storage,s);const restored=load(storage);assert.ok(restored.writable);assert.ok(valid(restored.state));assert.equal(restored.state.queen.completed,true);
 s=act(s,'leave');assert.equal(s.encounter,null);assert.equal(s.pos,QUEEN);
});
test('defence actions outside Queen encounter cannot grant progress or reward',()=>{for(const action of ['defence-progress-9','defence-complete'])assert.deepEqual(act(fresh(),action),fresh());});
