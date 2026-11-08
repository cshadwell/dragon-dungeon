import {test} from 'node:test';import assert from 'node:assert/strict';
import {DEFENCE_DEFAULTS,SPAWN_RADIUS,ORBIT,freshDefence,spawnAttack,stepDefence,angleDistance} from '../dist/elf-defence-model.js';
const settings={...DEFENCE_DEFAULTS,shieldSpeed:240,attackSpeed:100};
test('one shield rotates at a limited speed; opposing inputs cancel and release holds',()=>{
 const s=freshDefence(),r=stepDefence(s,.5,{right:true},settings);assert.equal(angleDistance(r.angle,s.angle),120);assert.equal(s.angle,270);
 assert.equal(stepDefence(s,1,{left:true,right:true},settings).angle,s.angle);assert.equal(stepDefence(s,1,{},settings).angle,s.angle);assert.equal(angleDistance(359,1),2);
});
test('shield intercepts once at the orbit and missed wisps reach the center',()=>{
 let s=spawnAttack(freshDefence(),270);s=stepDefence(s,.7,{},settings);assert.equal(s.blocks,1);assert.equal(s.projectile,null);assert.equal(s.misses,0);
 s=spawnAttack(freshDefence(),90);s=stepDefence(s,.7,{},settings);assert.ok(s.projectile.checked);assert.equal(s.blocks,0);s=stepDefence(s,.3,{},settings);assert.equal(s.misses,1);assert.equal(s.projectile,null);
});
test('shield size controls edge coverage and wrap-around hits',()=>{
 const s={...freshDefence(),angle:350};assert.equal(stepDefence(spawnAttack(s,10),.7,{},settings).blocks,1);
 const edge=spawnAttack({...s,angle:0},35);assert.equal(stepDefence(edge,.7,{},settings).blocks,0);assert.equal(stepDefence(edge,.7,{},{...settings,shieldSize:80}).blocks,1);
});
test('collision uses guard angle at impact rather than end of frame; already-passed attack cannot be caught',()=>{
 const s={...freshDefence(),angle:0},p=spawnAttack(s,30);p.projectile.radius=40;
 const result=stepDefence(p,.5,{right:true},{...settings,shieldSpeed:300,shieldSize:20});assert.equal(result.blocks,1);
 const missed=spawnAttack(s,180);missed.projectile={...missed.projectile,radius:20,checked:true};assert.equal(stepDefence(missed,.01,{right:true},settings).blocks,0);
});
test('attack and shield speed settings change travel and rotation independently',()=>{
 const s=spawnAttack(freshDefence(),90);const slow=stepDefence(s,.1,{right:true},{...settings,shieldSpeed:90,attackSpeed:15});const fast=stepDefence(s,.1,{right:true},{...settings,shieldSpeed:540,attackSpeed:100});assert.ok(slow.projectile.radius>fast.projectile.radius);assert.equal(angleDistance(slow.angle,270),9);assert.equal(angleDistance(fast.angle,270),54);
});

import {DEFENCE_STAGES,DEFENCE_STAGE_GOALS,defenceProgress} from '../dist/elf-defence-model.js';
test('Elf training advances through requested speeds and closes gaps without changing shield settings',()=>{
 assert.deepEqual(DEFENCE_DEFAULTS,{shieldSize:50,shieldSpeed:300,attackSpeed:60});assert.deepEqual(DEFENCE_STAGE_GOALS,[3,4,5]);
 assert.deepEqual(DEFENCE_STAGES.map(s=>s.attackSpeed),[60,65,70]);assert.ok(DEFENCE_STAGES[0].gap>DEFENCE_STAGES[1].gap);assert.ok(DEFENCE_STAGES[1].gap>DEFENCE_STAGES[2].gap);assert.deepEqual(DEFENCE_STAGES.map(s=>s.gap),[.9,.4,.2]);
 for(let blocks=0;blocks<=12;blocks++){
  const p=defenceProgress(blocks),stage=blocks<3?0:blocks<7?1:2;
  assert.equal(p.stage,stage);assert.equal(p.stageGoal,[3,4,5][stage]);
  assert.equal(p.stageBlocks,Math.min(p.stageGoal,blocks-[0,3,7][stage]));
  assert.equal(p.complete,blocks>=12);
 }
 // Even an opposite-side arrival is reachable at the fastest preset.
 assert.ok((SPAWN_RADIUS-ORBIT)/70>180/300);
});
