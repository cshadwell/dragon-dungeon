import {test} from 'node:test';import assert from 'node:assert/strict';import {createDungeonMusic} from '../dist/dungeon-music.js';
function fake(){return {paused:true,currentTime:17,plays:0,async play(){this.plays++;this.paused=false;},pause(){this.paused=true;}};}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('exploration loops at 40%; renders do not restart; rooms stop and return restarts from zero',async()=>{
 const audio=fake(),music=createDungeonMusic(audio);assert.equal(audio.loop,true);assert.equal(audio.volume,.4);
 music.setExploring(true);await flush();assert.equal(audio.paused,false);assert.equal(audio.currentTime,0);audio.currentTime=51;
 music.setExploring(true);assert.equal(audio.currentTime,51);assert.equal(audio.plays,1);
 music.setExploring(false);assert.equal(audio.paused,true);assert.equal(audio.currentTime,0);await music.retry();assert.equal(audio.plays,1);
 music.setExploring(true);await flush();assert.equal(audio.plays,2);assert.equal(audio.currentTime,0);
});
test('muting persists across rooms, and blocked playback can be retried with the music button',async()=>{
 const audio=fake(),music=createDungeonMusic(audio);audio.play=async()=>{throw Error('NotAllowedError');};music.setExploring(true);await flush();assert.ok(audio.paused);
 audio.play=async()=>{audio.paused=false;};music.toggle();await flush();assert.equal(audio.paused,false);music.toggle();assert.equal(audio.paused,true);
 music.setExploring(false);music.setExploring(true);await flush();assert.equal(audio.paused,true);music.toggle();await flush();assert.equal(audio.paused,false);
});
test('late play promise cannot leak audio into a room or after cleanup',async()=>{
 const audio=fake();let finish;audio.play=()=>new Promise(resolve=>{finish=()=>{audio.paused=false;resolve();};});const music=createDungeonMusic(audio);music.setExploring(true);music.setExploring(false);finish();await flush();assert.equal(audio.paused,true);
 music.setExploring(true);music.dispose();finish();await flush();assert.equal(audio.paused,true);
});
test('browser interruption preserves position and mute; scene changes still restart',async()=>{
 const a=fake(),p=createDungeonMusic(a);p.setExploring(true);await flush();a.currentTime=23;p.setSuspended(true);assert.ok(a.paused);assert.equal(a.currentTime,23);await p.retry();assert.ok(a.paused);p.setSuspended(false);await flush();assert.equal(a.currentTime,23);assert.ok(!a.paused);p.setMuted(true);p.setSuspended(true);p.setSuspended(false);await flush();assert.ok(a.paused);p.setExploring(false);assert.equal(a.currentTime,0);
});
