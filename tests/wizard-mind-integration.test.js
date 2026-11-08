import {test} from 'node:test';import assert from 'node:assert/strict';
import {fresh,act,valid,save,load,WIZARD} from '../dist/runtime.js';import {LENS} from '../dist/wizard.js';
function enter(){const s=fresh();s.pos=WIZARD;s.visited.push(WIZARD);return act(act(s,'interact'),'gate-enter');}
test('mind progress survives retreat and save; no reward before twelve successes',()=>{let s=act(enter(),'mind-progress-4');s=act(s,'mind-complete');assert.ok(!s.items.includes(LENS));s=act(s,'leave');s=act(act(s,'interact'),'gate-enter');assert.equal(s.wizard.mindCorrect,4);s=act(s,'mind-progress-2');assert.equal(s.wizard.mindCorrect,4);const storage={value:null,getItem(){return this.value;},setItem(k,v){this.value=v;}};save(storage,s);assert.equal(load(storage).state.wizard.mindCorrect,4);assert.ok(valid(s));});
test('mind completion grants lens once and retains compatible legacy fields',()=>{let s=act(act(enter(),'mind-progress-12'),'mind-complete');assert.ok(valid(s));assert.equal(s.wizard.phase,'done');assert.equal(s.wizard.completed,true);s=act(s,'mind-complete');assert.equal(s.items.filter(i=>i===LENS).length,1);assert.ok(valid(act(s,'leave')));});
test('mind progress outside wizard room cannot grant reward; invalid counts rejected',()=>{assert.deepEqual(act(fresh(),'mind-progress-9'),fresh());assert.deepEqual(act(fresh(),'mind-complete'),fresh());const s=enter();s.wizard.mindCorrect=13;assert.equal(valid(s),false);});

test('wizard double-digit progress resumes without early reward and old completed saves load',()=>{
 let s=enter();
 for(const correct of [3,7,9,10,11]){
  s=act(act(s,'mind-progress-'+correct),'mind-complete');
  assert.equal(s.wizard.mindCorrect,correct);assert.equal(s.wizard.completed,false);assert.ok(valid(s));assert.ok(!s.items.includes(LENS));
 }
 s=act(act(s,'mind-progress-12'),'mind-complete');assert.equal(s.wizard.completed,true);
 s.wizard.mindCorrect=9;
 const storage={value:null,getItem(){return this.value;},setItem(k,v){this.value=v;}};
 save(storage,s);assert.equal(load(storage).state.wizard.completed,true);
});
