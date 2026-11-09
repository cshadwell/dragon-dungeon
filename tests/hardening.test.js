import test from 'node:test';import assert from 'node:assert/strict';
import {createPauseState} from '../dist/challenge-pause.js';
import {createOpeningPlayback} from '../dist/opening-playback.js';
import {createImageLoader} from '../dist/image-loader.js';
import {fresh,act,load,save,valid,DRAGON,ENCOUNTER,WIZARD,QUEEN,guardiansReady,GUARDIAN_WARNING,completeDragon} from '../dist/runtime.js';
class Audio extends EventTarget{currentTime=0;duration=12.5;paused=true;ended=false;async play(){this.paused=false;}pause(){this.paused=true;}}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('menu, focus and page interruptions pause independently and repeated close cannot clear other reasons',()=>{
 const changes=[],p=createPauseState(value=>changes.push(value));p.set('menu',true);p.set('hidden',true);p.set('menu',false);assert.ok(p.paused);p.set('menu',false);assert.ok(p.paused);p.set('hidden',false);assert.ok(!p.paused);assert.deepEqual(changes,[true,false]);
});
test('opening resumes at the same music position after page restoration and waits for genuine end',async()=>{
 let clock=0;const a=new Audio(),p=createOpeningPlayback(a,{now:()=>clock});await p.play();a.currentTime=4;assert.equal(p.tick(),.32);p.pause();clock=30000;assert.equal(p.tick(),.32);assert.ok(a.paused);await p.resume();assert.ok(!a.paused);assert.equal(p.progress(),.32);a.currentTime=12.5;a.ended=true;a.dispatchEvent(new Event('ended'));assert.equal(p.mode,'holding');assert.equal(p.tick(),1);p.stop();
});
test('blocked opening is retryable and a stalled track falls back without restarting the scroll',async()=>{
 let clock=0;const a=new Audio(),p=createOpeningPlayback(a,{now:()=>clock});a.play=async()=>{throw Error('NotAllowed');};await p.play();assert.equal(p.mode,'blocked');a.play=async()=>{a.paused=false;};await p.play();a.currentTime=5;p.tick();clock=8001;p.tick();assert.equal(p.mode,'playing');assert.ok(a.paused);assert.equal(p.progress(),.4);clock+=7500;assert.equal(p.tick(),1);assert.equal(p.tick(),1);assert.equal(p.mode,'holding');p.stop();
});
test('silent fallback retains its place while suspended and cleans up its audio listeners',async()=>{
 let clock=0;const a=new Audio(),p=createOpeningPlayback(a,{now:()=>clock});await p.play();a.dispatchEvent(new Event('error'));clock=4000;p.tick();p.pause();clock=50000;assert.equal(p.tick(),.32);await p.resume();clock+=8500;assert.equal(p.tick(),1);p.stop();a.dispatchEvent(new Event('error'));assert.equal(p.mode,'done');
});
test('image failures/timeouts are retryable while successful loads remain cached',async()=>{
 const instances=[];class Image{constructor(){instances.push(this);}set src(value){this.url=value;}}
 const load=createImageLoader({ImageClass:Image,timeoutMs:10});const first=load('pose');instances[0].onerror();await assert.rejects(first);const second=load('pose');instances[1].onload();const image=await second;assert.equal(await load('pose'),image);assert.equal(instances.length,2);await assert.rejects(load('stalled'),/timed out/);const retry=load('stalled');instances[3].onload();await retry;
});
function prepared(mask=7){let s=fresh();for(const [index,pos,encounter,actions] of [[0,ENCOUNTER,'intro',['attack-complete']],[1,WIZARD,'wizard',['mind-progress-12','mind-complete']],[2,QUEEN,'queen',['defence-progress-12','defence-complete']]])if(mask&(1<<index)){s={...s,pos,encounter,visited:[...new Set([...s.visited,pos])]};for(const action of actions)s=act(s,action);}return {...s,pos:DRAGON,encounter:null,visited:[...new Set([...s.visited,DRAGON])]};}
test('every incomplete guardian combination is blocked at dragon gate without losing lessons or navigation',()=>{
 for(let mask=0;mask<8;mask++){let s=act(prepared(mask),'interact');const entered=act(s,'gate-enter');assert.equal(guardiansReady(entered),mask===7);assert.ok(valid(entered));if(mask===7)assert.equal(entered.encounter,'dragon');else{assert.equal(entered.encounter,null);assert.equal(entered.gate,'dragon');assert.equal(entered.message,GUARDIAN_WARNING);assert.deepEqual(entered.items,s.items);assert.equal(act(entered,'gate-decline').gate,null);}}
});
test('winning persists before reveal and can reveal later without replaying the fight or revoking old victories',()=>{
 const won=completeDragon(act(act(prepared(),'interact'),'gate-enter'));assert.ok(valid(won));assert.ok(won.dragon.victory);assert.equal(won.dragon.prizeRevealed,false);
 const data=new Map(),storage={setItem:(k,v)=>data.set(k,v),getItem:k=>data.get(k)??null};save(storage,won);const restored=load(storage).state;assert.ok(restored.dragon.victory);assert.equal(restored.dragon.prizeRevealed,false);const shown=completeDragon(restored,true);assert.equal(shown.dragon.prizeRevealed,true);assert.deepEqual(shown.items,won.items);assert.equal(completeDragon(shown).dragon.prizeRevealed,true);
});
test('an opening audio error while hidden keeps the silent fallback suspended until return',async()=>{
 let clock=0;const a=new Audio(),p=createOpeningPlayback(a,{now:()=>clock});await p.play();a.currentTime=3;p.pause();a.dispatchEvent(new Event('error'));clock=50000;assert.equal(p.mode,'suspended');assert.equal(p.tick(),.24);await p.resume();clock+=9500;assert.equal(p.tick(),1);p.stop();
});
test('permanently blocked opening audio can be bypassed with an explicit silent continuation',async()=>{
 let clock=0;const a=new Audio(),p=createOpeningPlayback(a,{now:()=>clock});a.play=async()=>{throw Error('NotAllowed');};await p.play();assert.equal(p.mode,'blocked');p.continueSilent();clock=12500;assert.equal(p.tick(),1);assert.equal(p.mode,'holding');p.stop();
});
