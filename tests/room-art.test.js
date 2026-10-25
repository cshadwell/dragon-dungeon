import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {ROOM_ART,ROOM_CANVAS,getRoomArt} from '../dist/room-art.js';import {getCharacterPose} from '../dist/character-art.js';
const root=new URL('../dist/assets/rooms/',import.meta.url),catalog=JSON.parse(readFileSync(new URL('catalog.json',root)));
test('approved room background bytes and locked character defaults remain unchanged',()=>{
 assert.equal(catalog.characterLibrary,'approved-v2');assert.deepEqual(ROOM_CANVAS,[470,200]);assert.deepEqual(Object.keys(ROOM_ART),['ogre','wizard','elf','dragon']);
 for(const [key,room] of Object.entries(ROOM_ART)){const png=readFileSync(new URL(room.background,root));assert.equal(createHash('sha256').update(png).digest('hex'),catalog.rooms[key].sha256,key+' background changed');assert.equal(png.readUInt32BE(16),room.width);assert.equal(png.readUInt32BE(20),room.height);assert.equal(getRoomArt(key),room);assert.equal(getCharacterPose(room.character,room.defaultPose).character,key);assert.ok(Object.isFrozen(room));}
 assert.equal(getRoomArt('dragon').background,'dragon-lair-darkened-v1.png');assert.equal(getRoomArt('Elf Queen').character,'elf');assert.throws(()=>getRoomArt('unknown'),RangeError);
});
