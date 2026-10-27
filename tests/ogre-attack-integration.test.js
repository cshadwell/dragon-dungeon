import {test} from 'node:test';import assert from 'node:assert/strict';
import {fresh,act,valid,save,load,ENCOUNTER} from '../dist/runtime.js';
import {SHIELD} from '../dist/ogre.js';
function enter(){const s=fresh();s.pos=ENCOUNTER;s.visited.push(ENCOUNTER);return act(act(s,'interact'),'gate-enter');}
test('attack practice progress survives retreat and reload without granting a reward',()=>{
 let s=act(enter(),'attack-practice-1');assert.equal(s.ogre.attackPractice,1);assert.ok(valid(s));assert.ok(!s.items.includes(SHIELD));
 s=act(s,'leave');assert.equal(s.pos,ENCOUNTER);s=act(act(s,'interact'),'gate-enter');assert.equal(s.ogre.attackPractice,1);
 s=act(s,'attack-practice-2');s=act(s,'attack-practice-1');assert.equal(s.ogre.attackPractice,2);
 const mem={getItem(){return this.value??null;},setItem(k,v){this.value=v;}};save(mem,s);assert.equal(load(mem).state.ogre.attackPractice,2);
});
test('attack victory grants existing dragon prerequisite once and remains valid after reload',()=>{
 let s=act(enter(),'attack-complete');assert.equal(s.completed,true);assert.equal(s.ogre.attackPractice,2);assert.equal(s.encounter,'reward');assert.ok(valid(s));
 const before=[...s.knowledge];s=act(s,'attack-complete');assert.equal(s.items.filter(i=>i===SHIELD).length,1);assert.deepEqual(s.knowledge,before);
 const mem={getItem(){return this.value??null;},setItem(k,v){this.value=v;}};save(mem,s);const restored=load(mem);assert.ok(restored.writable);assert.ok(valid(restored.state));assert.equal(restored.state.completed,true);
 s=act(s,'leave');assert.equal(s.encounter,null);assert.equal(s.health,3);
});
test('attack reward actions outside the active Ogre encounter do not grant items',()=>{for(const action of ['attack-complete','attack-practice-1','attack-practice-2'])assert.deepEqual(act(fresh(),action),fresh());});
