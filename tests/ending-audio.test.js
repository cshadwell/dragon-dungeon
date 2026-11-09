import test from 'node:test';
import assert from 'node:assert/strict';
import {createEndingAudio} from '../dist/ending-audio.js';
import {fresh,completeDragon,valid,save,load,DRAGON} from '../dist/runtime.js';
class Audio extends EventTarget {
 paused=true;currentTime=0;plays=0;
 async play(){this.plays++;this.paused=false;}
 pause(){this.paused=true;}
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('victory plays once then hands off to looping ending at 40 percent',async()=>{
 const victory=new Audio(),ending=new Audio(),player=createEndingAudio(victory,ending);
 player.start();player.start();await flush();assert.equal(victory.plays,1);assert.equal(ending.plays,0);assert.equal(victory.loop,false);
 victory.dispatchEvent(new Event('ended'));await flush();assert.equal(ending.plays,1);assert.equal(ending.loop,true);assert.equal(ending.volume,.4);
 ending.currentTime=12;player.resume();assert.equal(ending.currentTime,12);player.setMuted(true);assert.equal(ending.muted,true);player.stop();assert.ok(ending.paused);assert.equal(ending.currentTime,0);
 victory.dispatchEvent(new Event('ended'));assert.equal(ending.plays,1);
});
test('earned ending skips stinger, and failed stinger does not block ending music',async()=>{
 const v=new Audio(),e=new Audio(),p=createEndingAudio(v,e);p.resume();await flush();assert.equal(v.plays,0);assert.equal(e.plays,1);p.stop();
 v.play=async()=>{throw Error('blocked');};p.start();await flush();assert.equal(e.plays,2);p.stop();
});
test('late playback promises cannot continue audio after cleanup',async()=>{
 const v=new Audio(),e=new Audio();let finish;v.play=()=>new Promise(resolve=>{finish=()=>{v.paused=false;resolve();};});const p=createEndingAudio(v,e);p.start();p.stop();finish();await flush();assert.ok(v.paused);assert.equal(e.plays,0);
});
test('live dragon victory saves CHAZ independently without fabricating guardian rewards',()=>{
 const start=fresh();assert.deepEqual(completeDragon(start),start);
 const s={...start,pos:DRAGON,encounter:'dragon',visited:[...start.visited,DRAGON]};const won=completeDragon(s);assert.ok(valid(won));assert.equal(won.dragon.name,'CHAZ');assert.equal(won.dragon.placeholder,false);assert.deepEqual(won.items,start.items);
 const store=new Map(),storage={setItem:(k,v)=>store.set(k,v),getItem:k=>store.get(k)??null};assert.ok(save(storage,won));assert.deepEqual(load(storage).state,won);
});
