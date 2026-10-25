import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {getCharacterPose,listCharacterPoses,CHARACTER_POSE_COUNTS} from '../dist/character-art.js';
const root=new URL('../dist/assets/characters/approved-v1/',import.meta.url);
const catalog=JSON.parse(readFileSync(new URL('catalog.json',root)));
test('locked approved sheets and all isolated poses retain their exact registered bytes',()=>{
 for(const item of [...catalog.sheets,...catalog.poses])assert.equal(createHash('sha256').update(readFileSync(new URL(item.file,root))).digest('hex'),item.sha256,item.file+' changed from approved artwork');
});
test('stable character numbering covers every approved pose once, with safe exact lookup',()=>{
 assert.deepEqual(CHARACTER_POSE_COUNTS,{ogre:15,wizard:13,elf:13,dragon:37});assert.equal(catalog.poses.length,78);
 for(const [character,count] of Object.entries(CHARACTER_POSE_COUNTS)){
  const poses=listCharacterPoses(character);assert.deepEqual(poses.map(p=>p.number),Array.from({length:count},(_,i)=>i+1));
  for(const p of poses){assert.equal(getCharacterPose(character,p.number),p);assert.ok(Object.isFrozen(p));assert.equal(p.url,new URL(p.file,root).href);}
 }
 assert.equal(getCharacterPose('Dragon',3).sheet,'dragon-emotions');assert.equal(getCharacterPose('elf queen',13).id,'elf-013');
 assert.throws(()=>getCharacterPose('dragon',38),RangeError);assert.throws(()=>getCharacterPose('ogre',0),RangeError);assert.throws(()=>getCharacterPose('wizard',1.5),RangeError);assert.throws(()=>getCharacterPose('unknown',1),RangeError);
});
