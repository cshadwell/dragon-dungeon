import test from 'node:test';
import assert from 'node:assert/strict';
import {WARMUP,DRAGON_ROUNDS,warmupProgress} from '../dist/dragon-warmup-model.js';
test('dragon warm-up uses each guardian medium preset',()=>{
 assert.deepEqual(WARMUP.attack,{passMs:1250,targetWidth:.15});
 assert.equal(WARMUP.defence.shieldSize,50);assert.equal(WARMUP.defence.shieldSpeed,300);
 assert.equal(WARMUP.defence.attackSpeed,65);assert.equal(WARMUP.defence.gap,.4);
 assert.equal(WARMUP.mind.seconds,3);assert.equal(WARMUP.mind.conflict,false);
});
test('dragon easy round requires four attacks, six blocks and five colors',()=>{
 for(let n=0;n<15;n++){
  const p=warmupProgress(n);const stage=n<4?0:n<10?1:2;
  assert.equal(p.phase,['attack','defence','mind'][stage]);assert.equal(p.hits,n-[0,4,10][stage]);assert.equal(p.goal,[4,6,5][stage]);assert.equal(p.complete,false);
 }
 assert.deepEqual(warmupProgress(15),{phase:'mind',hits:5,goal:5,complete:true});
});
test('dragon next round requires five attacks, eight blocks and six misleading colors',()=>{
 const r=DRAGON_ROUNDS[1];assert.deepEqual(r.goals,[5,8,6]);assert.deepEqual(r.attack,{passMs:1000,targetWidth:.10});assert.equal(r.defence.attackSpeed,70);assert.equal(r.defence.gap,.2);assert.equal(r.mind.seconds,2);assert.equal(r.mind.conflict,true);
 for(let n=0;n<19;n++){
  const p=warmupProgress(n,1),stage=n<5?0:n<13?1:2;
  assert.equal(p.phase,['attack','defence','mind'][stage]);assert.equal(p.hits,n-[0,5,13][stage]);assert.equal(p.complete,false);
 }
 assert.deepEqual(warmupProgress(19,1),{phase:'mind',hits:6,goal:6,complete:true});
});


import {chooseDragonSpellPose,DRAGON_SPELL_POSES} from '../dist/dragon-spell-poses.js';
import {getCharacterPose} from '../dist/character-art.js';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {makeRound} from '../dist/wizard-mind-model.js';
test('dragon supplied spells register all 21 poses without changing baseline IDs',()=>{
 const catalog=JSON.parse(readFileSync(new URL('../dist/assets/characters/dragon-spells-v1/catalog.json',import.meta.url)));
 assert.equal(catalog.poses.length,21);
 for(const p of catalog.poses){const actual=getCharacterPose('dragon',p.number);assert.equal(actual.color,p.color);assert.equal(actual.scale,.46);const bytes=readFileSync(actual.url.replace('file://',''));assert.equal(createHash('sha256').update(bytes).digest('hex'),p.sha256);assert.equal(bytes.readUInt32BE(16),p.width);assert.equal(bytes.readUInt32BE(20),p.height);}
 for(const [color,ids] of Object.entries(DRAGON_SPELL_POSES)){
  assert.equal(ids.length,3);for(const [sample,index] of [[0,0],[.4,1],[.99,2]])assert.equal(chooseDragonSpellPose(color,()=>sample),ids[index]);
 }
});
test('dragon colors follow wizard rules: no consecutive spell color and unique shuffled answers',()=>{
 let previous=null;const slots=new Set();
 for(let i=0;i<100;i++){
  const r=makeRound(1,Math.random,previous);assert.notEqual(r.answer,previous);previous=r.answer;
  assert.equal(new Set(r.choices.map(c=>c.word)).size,4);assert.equal(new Set(r.choices.map(c=>c.ink)).size,4);
  assert.ok(r.choices.every(c=>c.word===c.ink));slots.add(r.choices.findIndex(c=>c.word===r.answer));
 }
 assert.equal(slots.size,4);
});

import {freshDragonMeter,updateDragonMeter,dragonGaugeFrame,chooseDragonReaction} from '../dist/dragon-warmup-model.js';
test('life meter drops once per miss, resets streaks, and stops at empty without failure',()=>{
 let meter=freshDragonMeter();assert.deepEqual(meter,{level:10,streak:0});
 meter=updateDragonMeter(meter,true);meter=updateDragonMeter(meter,true);meter=updateDragonMeter(meter,false);
 assert.deepEqual(meter,{level:9,streak:0});
 for(let n=0;n<15;n++)meter=updateDragonMeter(meter,false);
 assert.deepEqual(meter,{level:0,streak:0});
});
test('only perfect strikes heal immediately; ordinary successes never heal and full life is capped',()=>{
 let meter={level:7,streak:2};
 for(let n=0;n<12;n++)meter=updateDragonMeter(meter,'hit');assert.deepEqual(meter,{level:7,streak:0});
 meter=updateDragonMeter(meter,'perfect');assert.equal(meter.level,8);
 meter=updateDragonMeter(meter,'miss');assert.equal(meter.level,7);
 for(let n=0;n<8;n++)meter=updateDragonMeter(meter,'perfect');assert.equal(meter.level,10);
});
test('eleven gauge frames span level zero through full without reversing or repeating frames',()=>{
 const frames=Array.from({length:11},(_,n)=>dragonGaugeFrame(n));
 assert.equal(frames[0],10);assert.equal(frames[10],0);assert.equal(new Set(frames).size,11);
 assert.ok(frames.every((f,i)=>i===0||f<frames[i-1]));
});
test('dragon outcome reactions use only the requested hit and miss pose pools',()=>{
 for(const [sample,index] of [[0,0],[.4,1],[.99,2]]){
  assert.equal(chooseDragonReaction(true,()=>sample),[16,18,19][index]);
  assert.equal(chooseDragonReaction(false,()=>sample),[15,6,20][index]);
 }
});

import {attackPosition,targetForAttempt} from '../dist/ogre-attack-model.js';
test('second-round attack allows three one-second crossings and shifts the smaller target',()=>{
 const attack=DRAGON_ROUNDS[1].attack;
 assert.equal(attackPosition(2999,attack.passMs).expired,false);assert.equal(attackPosition(3000,attack.passMs).expired,true);
 assert.equal(attackPosition(500,attack.passMs).pass,1);assert.equal(attackPosition(1500,attack.passMs).pass,2);assert.equal(attackPosition(2500,attack.passMs).pass,3);
 for(let n=1;n<10;n++)assert.notEqual(targetForAttempt(n),targetForAttempt(n-1));
});
test('second-round color choices use unique misleading ink with no repeated spell color',()=>{
 let previous=null;
 for(let n=0;n<50;n++){
  const r=makeRound(DRAGON_ROUNDS[1].mindStage,Math.random,previous);assert.notEqual(r.answer,previous);previous=r.answer;
  assert.equal(r.seconds,2);assert.ok(r.choices.every(c=>c.word!==c.ink));assert.equal(new Set(r.choices.map(c=>c.ink)).size,4);
 }
});

import {makeFinalSchedule,finalProgress,finalDefenceAngle,makeFinalMindRound} from '../dist/dragon-warmup-model.js';
test('final round mixes exactly 25 successes and keeps defenses in three-block volleys',()=>{
 for(let seed=1;seed<=40;seed++){
  let state=seed;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
  const schedule=makeFinalSchedule(random);assert.equal(schedule.length,25);
  assert.equal(schedule.filter(p=>p==='attack').length,8);assert.equal(schedule.filter(p=>p==='mind').length,8);assert.equal(schedule.filter(p=>p==='defence').length,9);
  for(let i=0;i<25;i++)if(schedule[i]==='defence'){assert.deepEqual(schedule.slice(i,i+3),['defence','defence','defence']);assert.notEqual(schedule[i+3],'defence');i+=2;}
  assert.equal(finalProgress(24,schedule).complete,false);assert.equal(finalProgress(25,schedule).complete,true);
 }
 assert.equal(makeFinalSchedule(()=>0).length,25);
});
test('final attack has only an outward and return pass, with a smaller faster target',()=>{
 const settings=DRAGON_ROUNDS[2];assert.deepEqual(settings.attack,{passMs:850,targetWidth:.07,passes:2});
 assert.equal(attackPosition(1699,850,2).expired,false);assert.deepEqual(attackPosition(1700,850,2),{position:0,pass:2,expired:true});
 assert.equal(settings.defence.attackSpeed,75);assert.equal(settings.defence.gap,0);
});
test('each final defense volley starts near the current shield, later projectiles cover the circle',()=>{
 for(const shield of [0,90,180,270,355])for(const r of [0,.5,.999]){
  const angle=finalDefenceAngle(shield,1,()=>r);const difference=Math.abs(((angle-shield+540)%360)-180);assert.ok(difference<=10);
 }
 assert.equal(finalDefenceAngle(270,2,()=>0),0);assert.equal(finalDefenceAngle(270,3,()=>.5),180);
});
test('final spell word, ink and background are all different, with unique shuffled palettes',()=>{
 let previous=null;
 for(let i=0;i<100;i++){
  const r=makeFinalMindRound(Math.random,previous);assert.notEqual(r.answer,previous);previous=r.answer;assert.equal(r.seconds,1.75);
  assert.ok(r.choices.every(c=>new Set([c.word,c.ink,c.background]).size===3));
  for(const key of ['word','ink','background'])assert.equal(new Set(r.choices.map(c=>c[key])).size,4);
  assert.equal(r.choices.filter(c=>c.word===r.answer).length,1);
 }
});
