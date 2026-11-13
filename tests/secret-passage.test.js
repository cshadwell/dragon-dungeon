import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createMelodyEntry,canEnterSecret,SECRET_ENTRANCE,unlockMusicalPassage} from '../dist/secret-passage-model.js';
import {fresh,load,save,SAVE_KEY,cells,act,completeDragon} from '../dist/runtime.js';
import {SECRET_PITCHES} from '../dist/secret-pitches.js';
import {PIANO_SETTINGS} from '../dist/secret-piano-settings.js';
import {SamplePiano,pianoKeyRegions} from '../dist/secret-sample-piano.js';
import {eyePixel,eyeScreenBounds} from '../dist/secret-eye.js';
const melody=['E4','B4','A4','G4','E4','C5','B4'];
const enter=notes=>{const m=createMelodyEntry();notes.forEach(n=>m.add(n));return m;};
test('secret melody requires seven deliberate entries and explicit submission',()=>{
 const m=enter(melody.slice(0,6));assert.equal(m.ready,false);assert.equal(m.submit(),null);assert.equal(m.complete(0),null);
 m.add('B4');assert.equal(m.phase,'entry');assert.equal(m.ready,true);assert.equal(m.add('C4'),false);
 const attempt=m.submit();assert.deepEqual(attempt.notes,melody);assert.equal(m.submit(),null);assert.equal(m.add('E4'),false);assert.equal(m.clear(),false);
 assert.equal(m.complete(attempt.token+1),null);assert.equal(m.complete(attempt.token),true);assert.equal(m.complete(attempt.token),null);
});
test('wrong pitch, octave, order, and matching fragments never unlock',()=>{
 for(const notes of [['C#4',...melody],['E3',...melody.slice(1)],['B4','E4',...melody.slice(2)]]){
  const m=enter(notes),a=m.submit();assert.equal(m.complete(a.token),false);assert.deepEqual(m.notes,[]);assert.equal(m.phase,'entry');
  melody.forEach(n=>m.add(n));assert.equal(m.complete(m.submit().token),true);
 }
});
test('clear, cancelled playback, and obsolete completion cannot unlock',()=>{
 const m=enter(melody);assert.equal(m.clear(),true);assert.deepEqual(m.notes,[]);melody.forEach(n=>m.add(n));const a=m.submit();m.cancel();assert.equal(m.complete(a.token),null);assert.equal(m.add('E4'),false);
 const retry=enter(melody),b=retry.submit();retry.retry(b.token);assert.deepEqual(retry.notes,[]);assert.equal(retry.phase,'entry');assert.equal(retry.complete(b.token),null);
});
test('secret marker uses supplied dead-end east wall only',()=>{
 const s={...fresh(),pos:SECRET_ENTRANCE.pos,facing:1};assert(cells.has(s.pos));assert(!cells.has('35,43'));assert(cells.has('33,43'));
 assert(canEnterSecret(s));for(const facing of [0,2,3])assert.equal(canEnterSecret({...s,facing}),false);
 assert.equal(canEnterSecret({...s,pos:'33,43'}),false);assert.equal(canEnterSecret({...s,encounter:'dragon'}),false);
 const b=eyeScreenBounds(s);assert(b.width>0&&b.height>0&&b.x>0&&b.y>0);assert.equal(eyeScreenBounds({...s,facing:3}),null);
 let visible=0;for(let u=56;u<72;u+=.25)for(let v=49;v<63;v+=.25)if(eyePixel(35,43,0,1,u,v))visible++;
 assert(visible>1000);assert.equal(eyePixel(35,43,0,-1,64,56),null);assert.equal(eyePixel(35,42,0,1,64,56),null);
});
test('unlock and legacy save migration preserve every existing progress field',()=>{
 const old=fresh();delete old.musicalPassageUnlocked;old.visited.push('34,43');old.pos='34,43';old.facing=1;
 const storage={value:JSON.stringify(old),getItem(k){return k===SAVE_KEY?this.value:null;},setItem(k,v){assert.equal(k,SAVE_KEY);this.value=v;}};
 const restored=load(storage);assert.equal(restored.writable,true);assert.deepEqual(restored.state,{...old,musicalPassageUnlocked:false});
 const unlocked=unlockMusicalPassage(restored.state);assert.equal(restored.state.musicalPassageUnlocked,false);assert.deepEqual(unlocked,{...restored.state,musicalPassageUnlocked:true});
 save(storage,unlocked);assert.deepEqual(load(storage).state,unlocked);assert.equal(act(unlocked,'left').musicalPassageUnlocked,true);
 storage.value=JSON.stringify({...old,musicalPassageUnlocked:'yes'});assert.equal(load(storage).writable,false);
});
test('all 25 recorded keys align with source artwork and cover C4 through C5',()=>{
 const regions=pianoKeyRegions(PIANO_SETTINGS);assert.equal(regions.length,25);assert(regions.every(r=>r.available));assert.equal(regions.filter(r=>r.color==='black').length,10);
 assert.deepEqual(regions.map(r=>r.id),SECRET_PITCHES.map(p=>p.id));assert.equal(SECRET_PITCHES[0].pitch,'C3');assert.equal(SECRET_PITCHES.at(-1).pitch,'C5');
 for(let midi=60;midi<=72;midi++)assert(SECRET_PITCHES.some(p=>p.midi===midi));
 for(const p of SECRET_PITCHES){assert(Math.abs(p.measuredHz*p.rate-440*2**((p.midi-69)/12))<.001);const wav=readFileSync(new URL(`../dist/assets/secret/piano/${p.id}.wav`,import.meta.url));assert.equal(wav.toString('ascii',0,4),'RIFF');assert(wav.length>10000);}
 const original=readFileSync(new URL('../art-review/2026-11-12/secret-piano/sample-piano.original.js',import.meta.url),'utf8');
 assert(original.includes('export function pianoKeyRegions(settings)'));assert.equal(regions[0].left,57/2172*100);
});
function fakeKey(){return {dataset:{},style:{},listeners:{},setAttribute(){},setPointerCapture(){},addEventListener(type,fn){this.listeners[type]=fn;},fire(type,extra={}){this.listeners[type]?.({button:0,pointerId:1,detail:0,preventDefault(){},...extra});}};}
test('pointer/touch compatibility events and held keyboard repeats record once',async()=>{
 const previous=globalThis.document;globalThis.document={createElement:fakeKey};
 const originalDownload=SamplePiano.prototype.download;SamplePiano.prototype.download=()=>Promise.resolve(new ArrayBuffer(1));
 try{const root={append(){}},notes=[],p=new SamplePiano({root,settings:PIANO_SETTINGS,status:{},onNote:n=>notes.push(n)});p.play=async()=>{};p.setEnabled(true);const k=p.keys[1];
 k.fire('pointerdown',{pointerType:'touch'});k.fire('pointerdown',{pointerType:'touch'});k.fire('pointerup');k.fire('click');assert.equal(notes.length,1);assert.equal(notes[0],'C#3');
 const other=p.keys[2];other.fire('keydown',{code:'Space',repeat:false});other.fire('keydown',{code:'Space',repeat:true});other.fire('click');assert.equal(notes.length,2);other.fire('keyup',{code:'Space'});other.fire('keydown',{code:'Space',repeat:false});assert.equal(notes.length,3);
 p.setEnabled(false);other.fire('pointerdown',{pointerId:5});assert.equal(notes.length,3);
 }finally{globalThis.document=previous;SamplePiano.prototype.download=originalDownload;}
});
test('submitted playback waits for actual final sample tail and cancellation invalidates it',async()=>{
 const p=Object.create(SamplePiano.prototype);Object.assign(p,{generation:0,voices:new Set(),context:{currentTime:0}});p.audio=async()=>p.context;p.buffer=async()=>({});const endings=[];p.voice=()=>new Promise(resolve=>endings.push(resolve));
 let settled=false;const playback=p.playSequence(melody).then(v=>{settled=true;return v;});await new Promise(setImmediate);assert.equal(endings.length,7);endings.slice(0,6).forEach(f=>f());await new Promise(setImmediate);assert.equal(settled,false);endings[6]();assert.equal(await playback,true);
 const next=p.playSequence(melody);await new Promise(setImmediate);p.stop();endings.slice(7).forEach(f=>f());assert.equal(await next,false);
});
test('vendored assets remain byte-identical to the reviewed local copies',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../art-review/2026-11-12/secret-piano/asset-sha256.json',import.meta.url)));
 for(const [path,hash] of Object.entries(manifest))assert.equal(createHash('sha256').update(readFileSync(new URL('../'+path,import.meta.url))).digest('hex'),hash,path);
});
test('completed guardians, inventory, CHAZ reveal, and map survive musical unlocking',()=>{
 let s=fresh();for(const [pos,encounter,actions] of [['35,30','intro',['attack-complete']],['3,22','wizard',['mind-progress-12','mind-complete']],['55,4','queen',['defence-progress-12','defence-complete']]]){
  s={...s,pos,encounter,visited:[...new Set([...s.visited,pos])]};for(const action of actions)s=act(s,action);
 }
 s=completeDragon({...s,pos:'0,1',encounter:'dragon',visited:[...new Set([...s.visited,'0,1'])]},true);assert.equal(s.dragon.name,'CHAZ');assert.equal(s.dragon.prizeRevealed,true);
 s={...s,pos:'34,43',encounter:null,visited:[...new Set([...s.visited,'34,43'])]};delete s.musicalPassageUnlocked;
 const storage={getItem:k=>k===SAVE_KEY?JSON.stringify(s):null,setItem(k,v){this.getItem=name=>name===SAVE_KEY?v:null;}};
 const before=load(storage);assert.equal(before.writable,true);assert(before.state.completed&&before.state.wizard.completed&&before.state.queen.completed);assert.equal(before.state.items.length,3);
 save(storage,unlockMusicalPassage(before.state));assert.deepEqual(load(storage).state,{...before.state,musicalPassageUnlocked:true});
});
test('approved recessed eye uses native pixels with transparent surroundings and larger hit bounds',async()=>{
 const {EYE_PIXELS,EYE_WIDTH,EYE_HEIGHT}=await import('../dist/secret-eye-pixels.js');
 assert.equal(EYE_PIXELS.length,EYE_WIDTH*EYE_HEIGHT*4);assert.equal(EYE_WIDTH,169);assert.equal(EYE_HEIGHT,160);
 assert.equal(EYE_PIXELS[3],0);assert(EYE_PIXELS.some((v,i)=>i%4===3&&v===255));
 const bounds=eyeScreenBounds({...fresh(),pos:'34,43',facing:1});assert(Math.abs(bounds.width-169)<.01);assert(Math.abs(bounds.height-160)<.01);
 const hashes=JSON.parse(readFileSync(new URL('../art-review/2026-11-13/recessed-eye/asset-sha256.json',import.meta.url)));
 for(const [path,hash] of Object.entries(hashes))assert.equal(createHash('sha256').update(readFileSync(new URL('../'+path,import.meta.url))).digest('hex'),hash);
});
