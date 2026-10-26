import {test} from 'node:test';import assert from 'node:assert/strict';
import {fresh,act,valid,ENCOUNTER,cells,neighbor,save,load} from '../dist/runtime.js';
function approach(){for(let d=0;d<4;d++){const p=neighbor(ENCOUNTER,(d+2)%4);if(cells.has(p)){const s={...fresh(),pos:p,facing:d,visited:[...new Set([fresh().pos,p])]};return act(s,'forward');}}throw Error('No gate approach');}
test('arrival asks before entering; decline allows maze movement and re-entry',()=>{let s=approach();assert.equal(s.pos,ENCOUNTER);assert.equal(s.encounter,null);assert.equal(s.gate,'ogre');assert.deepEqual(act(s,'forward'),s);s=act(s,'gate-decline');assert.equal(s.gate,null);assert.equal(s.encounter,null);assert.ok(valid(s));s=act(s,'interact');assert.equal(s.gate,'ogre');s=act(s,'gate-enter');assert.equal(s.gate,null);assert.equal(s.encounter,'intro');assert.ok(valid(s));});
test('gate and inside lesson save independently; leaving retains learning and room position',()=>{let s=approach();const mem={value:null,getItem(){return this.value;},setItem(k,v){this.value=v;}};save(mem,s);assert.equal(load(mem).state.gate,'ogre');s=act(s,'gate-enter');s=act(act(s,'begin'),'react-block');s=act(s,'leave');assert.equal(s.pos,ENCOUNTER);assert.ok(s.ogre.taught);s=act(act(s,'interact'),'gate-enter');s=act(s,'begin');assert.equal(s.encounter,'brief');save(mem,s);assert.equal(load(mem).state.encounter,'brief');assert.ok(valid(s));});

import {corridorPixels} from '../dist/corridor.js';
import {isOgreDoorFace} from '../dist/ogre-gate.js';
test('Ogre door is visible down its corridor, projects larger nearby, and stays on its wall face',()=>{
 const brown=p=>{let n=0;for(let i=0;i<p.length;i+=4)if(p[i]>p[i+1]*1.3&&p[i+1]>p[i+2]*1.3)n++;return n;};
 const view=(pos,facing=0)=>brown(corridorPixels({...fresh(),pos,facing},128,108));
 assert.ok(view('35,32')>0);assert.ok(view('35,30')>view('35,32'));assert.equal(ENCOUNTER,'35,30');assert.ok(view(ENCOUNTER)>view('35,32'));
 assert.equal(view('35,32',2),0);assert.equal(view('35,27',2),0);
 assert.ok(isOgreDoorFace(35,28,1,-1));assert.ok(!isOgreDoorFace(35,28,1,1));
});

test('previous close-up gate save resumes one tile back without losing training',()=>{const s={...fresh(),pos:'35,29',visited:[fresh().pos,'35,29'],gate:'ogre'};s.ogre.taught=true;const storage={getItem(){return JSON.stringify(s);}};const loaded=load(storage);assert.equal(loaded.state.pos,'35,30');assert.equal(loaded.state.gate,'ogre');assert.ok(loaded.state.ogre.taught);assert.ok(loaded.writable);assert.ok(valid(loaded.state));});

import {MAZE_DOORS,doorFace,doorPixel} from '../dist/maze-doors.js';
test('all four wall doors prompt at the earlier tile, preserve saves, and enter only on acceptance',()=>{
 for(const d of MAZE_DOORS){
  const facing=d.side?(d.step<0?0:2):(d.step>0?1:3),before=neighbor(d.pos,(facing+2)%4);
  let s={...fresh(),pos:before,facing,visited:[fresh().pos,before]};s=act(s,'forward');
  assert.equal(s.pos,d.pos);assert.equal(s.gate,d.character);assert.equal(s.encounter,null);assert.ok(valid(s));
  assert.equal(Math.abs(Number(d.pos.split(',')[0])-d.wallX)+Math.abs(Number(d.pos.split(',')[1])-d.wallY),2);
  assert.equal(doorFace(d.wallX,d.wallY,d.side,d.step),d);assert.equal(doorFace(d.wallX,d.wallY,d.side,-d.step),undefined);assert.ok(doorPixel(d,64,80));assert.equal(doorPixel(d,0,0),null);
  const mem={value:null,getItem(){return this.value;},setItem(k,v){this.value=v;}};save(mem,s);assert.equal(load(mem).state.gate,d.character);
  const outside=act(s,'gate-decline');assert.equal(outside.encounter,null);assert.equal(outside.gate,null);
  s=act(s,'gate-enter');assert.equal(s.encounter,d.character==='ogre'?'intro':d.character);assert.ok(valid(s));
 }
});
test('older active guardian saves migrate from the close tile with progress intact',()=>{
 for(const [oldPos,encounter] of [['4,22','wizard'],['56,4','queen'],['0,0','dragon']]){
  const s={...fresh(),pos:oldPos,visited:[fresh().pos,oldPos],encounter};
  if(encounter==='dragon')s.dragon.discovered=true;
  const result=load({getItem(){return JSON.stringify(s);}});assert.ok(result.writable);assert.equal(result.state.encounter,encounter);assert.ok(valid(result.state));assert.notEqual(result.state.pos,oldPos);
 }
});
