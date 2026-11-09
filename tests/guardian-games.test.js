import test from 'node:test';
import assert from 'node:assert/strict';
import {drawDefenceArena,updateAttackRail} from '../dist/guardian-games.js';
import {freshDefence,spawnAttack,DEFENCE_DEFAULTS} from '../dist/elf-defence-model.js';
function surface(){return {marks:[],fillStyle:'',fillRect(...rect){this.marks.push({rect,color:this.fillStyle});},fillText(...text){this.marks.push({text,color:this.fillStyle});}};}
test('dragon palette preserves every Elf arena pixel position, including shield and projectile',()=>{
 const state=spawnAttack(freshDefence(),35),elf=surface(),dragon=surface();
 drawDefenceArena(elf,state,DEFENCE_DEFAULTS,{running:false});
 drawDefenceArena(dragon,state,DEFENCE_DEFAULTS,{running:false,palette:{'#09110e':'#100b10','#526044':'#67515c'}});
 assert.deepEqual(elf.marks.map(({rect,text})=>({rect,text})),dragon.marks.map(({rect,text})=>({rect,text})));
 assert.equal(elf.marks[0].color,'#09110e');assert.equal(dragon.marks[0].color,'#100b10');
 assert.ok(elf.marks.length>400);assert.ok(elf.marks.some(m=>m.text?.[0]==='READY / PAUSED'));
});
test('Ogre and dragon attack rail share target and marker geometry',()=>{
 const parts={'.target':{style:{}},'.marker':{style:{}}},rail={querySelector:s=>parts[s]};
 updateAttackRail(rail,{targetCenter:.75,targetWidth:.15,position:.3});
 assert.equal(parts['.target'].style.left,'67.5%');assert.equal(parts['.target'].style.width,'15%');assert.equal(parts['.marker'].style.left,'30%');
});
