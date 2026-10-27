import {test} from 'node:test';import assert from 'node:assert/strict';
import {attackPosition,judgeAttack,reactionPose,ATTACK_DEFAULTS} from '../dist/ogre-attack-model.js';
test('attack makes exactly three crossings, reverses at ends and expires at final edge',()=>{
 const ms=1000;for(const [time,pos,pass] of [[0,0,1],[500,.5,1],[1000,1,2],[1500,.5,2],[2000,0,3],[2500,.5,3],[3000,1,3]]){const s=attackPosition(time,ms);assert.equal(s.position,pos);assert.equal(s.pass,pass);assert.equal(s.expired,time===3000);}assert.ok(attackPosition(9000,ms).expired);
});
test('timing judgment is symmetric on all three passes; narrow target and speed affect accuracy',()=>{
 const c={passMs:1000,targetWidth:.24};for(const center of [500,1500,2500]){assert.equal(judgeAttack(center,c).result,'perfect');assert.equal(judgeAttack(center-100,c).result,'hit');assert.equal(judgeAttack(center+100,c).result,'hit');assert.equal(judgeAttack(center+150,c).result,'miss');}
 assert.equal(judgeAttack(3000,c).result,'hesitation');assert.equal(judgeAttack(620,c).result,'hit');assert.equal(judgeAttack(620,{...c,targetWidth:.16}).result,'miss');assert.equal(judgeAttack(500,{...c,passMs:700}).result,'miss');assert.ok(ATTACK_DEFAULTS.practice.passMs>ATTACK_DEFAULTS.challenge.passMs);
});
test('one registered reaction per outcome preserves agreed pose assignments',()=>{
 assert.equal(reactionPose('practice','hit',1),9);assert.equal(reactionPose('practice','perfect',1),11);assert.equal(reactionPose('practice','miss',1),1);assert.equal(reactionPose('challenge','hesitation',1),1);
 for(let n=1;n<=12;n++){assert.ok([4,5,6,7].includes(reactionPose('challenge','miss',n)));for(const result of ['hit','perfect'])assert.ok([12,13,14,15].includes(reactionPose('challenge',result,n)));}
});

import {PRACTICE_NEXT,targetForAttempt} from '../dist/ogre-attack-model.js';
test('graduated lessons and challenge use requested timings and moving target scoring',()=>{
 assert.deepEqual(ATTACK_DEFAULTS.practice,{passMs:1500,targetWidth:.20});assert.deepEqual(PRACTICE_NEXT,{passMs:1250,targetWidth:.15});assert.deepEqual(ATTACK_DEFAULTS.challenge,{passMs:1000,targetWidth:.10});
 for(let i=0;i<15;i++){
  const center=targetForAttempt(i),c={...ATTACK_DEFAULTS.challenge,targetCenter:center};
  assert.ok(center-.05>=0&&center+.05<=1);assert.notEqual(center,targetForAttempt(i+1));
  for(const time of [center*1000,(2-center)*1000,(2+center)*1000])assert.equal(judgeAttack(time,c).result,'perfect');
  if(center!==.5)assert.equal(judgeAttack(500,c).result,'miss');
 }
});
