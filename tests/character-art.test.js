import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {getCharacterPose,listCharacterPoses,CHARACTER_POSE_COUNTS} from '../dist/character-art.js';
const root=new URL('../dist/assets/characters/approved-v2/',import.meta.url);
const catalog=JSON.parse(readFileSync(new URL('catalog.json',root)));
test('locked approved V2 poses retain their exact reviewed bytes',()=>{
 for(const item of [...catalog.sheets,...catalog.poses])assert.equal(createHash('sha256').update(readFileSync(new URL(item.file,root))).digest('hex'),item.sha256,item.file+' changed from approved artwork');
});
test('stable character numbering covers every approved pose once, with safe exact lookup',()=>{
 assert.deepEqual(CHARACTER_POSE_COUNTS,{ogre:15,wizard:34,elf:13,dragon:58});assert.equal(catalog.poses.length,78);
 for(const [character,count] of Object.entries(CHARACTER_POSE_COUNTS)){
  const poses=listCharacterPoses(character);assert.deepEqual(poses.map(p=>p.number),Array.from({length:count},(_,i)=>i+1));
  for(const p of poses){assert.equal(getCharacterPose(character,p.number),p);assert.ok(Object.isFrozen(p));assert.equal(p.url,new URL(p.file,root).href);}
 }
 assert.equal(getCharacterPose('Dragon',3).sheet,'dragon-emotions');assert.equal(getCharacterPose('elf queen',13).id,'elf-013');
 assert.throws(()=>getCharacterPose('dragon',59),RangeError);assert.throws(()=>getCharacterPose('ogre',0),RangeError);assert.throws(()=>getCharacterPose('wizard',1.5),RangeError);assert.throws(()=>getCharacterPose('unknown',1),RangeError);
});

test('V2 promotion preserves every V1 pose ID and the reviewed native image dimensions',()=>{
 const previous=JSON.parse(readFileSync(new URL('../dist/assets/characters/approved-v1/catalog.json',import.meta.url)));
 assert.equal(catalog.version,'approved-v2');assert.deepEqual(catalog.poses.map(p=>[p.id,p.number,p.character]),previous.poses.map(p=>[p.id,p.number,p.character]));
 for(const p of catalog.poses){const png=readFileSync(new URL(p.file,root));assert.equal(png.readUInt32BE(16),p.width);assert.equal(png.readUInt32BE(20),p.height);}
});

test('new wizard spell additions have stable IDs, transparent PNGs and recorded hashes',()=>{const extra=JSON.parse(readFileSync(new URL('../dist/assets/characters/wizard-spells-v2/catalog.json',import.meta.url)));assert.equal(extra.poses.length,21);for(const p of extra.poses){const registered=getCharacterPose('wizard',p.number);assert.equal(registered.color,p.color);assert.equal(registered.sha256,p.sha256);const bytes=readFileSync(new URL(p.file,root));assert.equal(createHash('sha256').update(bytes).digest('hex'),p.sha256);assert.equal(bytes.readUInt32BE(16),p.width);assert.equal(bytes.readUInt32BE(20),p.height);assert.equal(bytes[25],6);}for(const color of ['blue','green','orange','purple','red','white','yellow'])assert.equal(extra.poses.filter(p=>p.color===color).length,3);});
