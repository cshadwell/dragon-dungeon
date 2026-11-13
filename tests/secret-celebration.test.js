import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {createMelodyEntry,matchesSecretMelody} from '../dist/secret-passage-model.js';
import {createCandleTimeline,startCandleCelebration,CANDLE_CUES,CANDLE_POSITIONS} from '../dist/secret-celebration.js';
const flush=()=>new Promise(setImmediate);
test('both complete piano octaves unlock; mixed octaves and wrong notes do not',()=>{
 for(const notes of [['E3','B3','A3','G3','E3','C4','B3'],['E4','B4','A4','G4','E4','C5','B4']]){assert(matchesSecretMelody(notes));const m=createMelodyEntry();notes.forEach(n=>m.add(n));assert.equal(m.complete(m.submit().token),true);}
 for(const notes of [['E3','B4','A3','G3','E3','C4','B3'],['E3','B3','A3','G3','E3','C4','A3'],['E3','B3','A3']])assert.equal(matchesSecretMelody(notes),false);
});
test('candles reveal one per recorded beat, left to right, then hold three seconds after sound ends',()=>{
 const visible=[],t=createCandleTimeline(i=>visible.push(i));assert.equal(t.tick(0),false);assert.deepEqual(visible,[0]);t.tick(.49);assert.equal(visible.length,1);t.tick(.5);assert.deepEqual(visible,[0,1]);t.tick(2.6);assert.deepEqual(visible,[0,1,2,3,4,5]);t.tick(3);assert.equal(visible.length,7);assert.equal(t.tick(4,true),false);assert.equal(t.tick(6.99,true),false);assert.equal(t.tick(7,true),true);assert.equal(t.tick(8,true),true);assert.equal(visible.length,7);
 assert.deepEqual(CANDLE_CUES,[0,.5,1,1.5,2,2.5,3]);assert(CANDLE_POSITIONS.every((p,i)=>!i||p[0]>CANDLE_POSITIONS[i-1][0]));assert.equal(CANDLE_POSITIONS[0][1],CANDLE_POSITIONS[4][1]);assert(CANDLE_POSITIONS[5][1]<CANDLE_POSITIONS[1][1]);
});
test('success playback follows audio time and cannot finish early or continue after cancellation',async()=>{
 const oldFetch=globalThis.fetch;globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(4)});
 try{let clock=0;const queue=[],visible=[],source={connect(){},disconnect(){},start(){},stop(){}},gain={gain:{value:1},connect(){},disconnect(){}};
 const context={currentTime:0,decodeAudioData:async()=>({duration:4}),createBufferSource:()=>source,createGain:()=>gain,destination:{}};
 const piano={voices:new Set(),audio:async()=>context,settings:{volume:.85},muted:true};const run=startCandleCelebration({piano,onCandle:i=>visible.push(i),requestFrame:fn=>(queue.push(fn),queue.length),cancelFrame(){},now:()=>clock});let done=false;run.finished.then(()=>done=true);await flush();const frame=()=>queue.shift()();frame();assert.deepEqual(visible,[0]);assert.equal(gain.gain.value,0);
 context.currentTime=3;clock=3000;frame();assert.equal(visible.length,7);context.currentTime=4;clock=4000;source.onended();frame();await flush();assert.equal(done,false);context.currentTime=6.9;clock=6900;frame();await flush();assert.equal(done,false);context.currentTime=7;clock=7000;frame();assert.equal(await run.finished,true);assert.equal(piano.voices.size,0);
 const next=startCandleCelebration({piano,onCandle(){throw Error('Cancelled celebration must not light candles');},requestFrame:fn=>(queue.push(fn),queue.length),cancelFrame(){},now:()=>clock});next.cancel();assert.equal(await next.finished,false);await flush();
 }finally{globalThis.fetch=oldFetch;}
});
test('cropped candle retains animation and transparency, and the supplied success recording is local',()=>{
 const record=JSON.parse(readFileSync(new URL('../art-review/2026-11-13/candle-celebration/asset-record.json',import.meta.url)));assert.equal(record.frames,121);assert.deepEqual(record.size,[80,130]);const apng=readFileSync(new URL('../dist/assets/secret/candle.apng',import.meta.url));assert(apng.includes(Buffer.from('acTL')));assert.equal(apng.readUInt32BE(16),80);assert.equal(apng.readUInt32BE(20),130);assert.equal(apng[25],6);const mp3=readFileSync(new URL('../dist/assets/secret/correct.mp3',import.meta.url));assert(mp3.length>100000);
});
