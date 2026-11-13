import test from 'node:test';import assert from 'node:assert/strict';
import {openSecretChamber,WRONG_MELODY_MESSAGE} from '../dist/secret-chamber.js';
import {readFileSync} from 'node:fs';
const pianoImport=readFileSync(new URL('../dist/secret-chamber.js',import.meta.url),'utf8').match(/from '(\.\/secret-sample-piano\.js[^']*)'/)[1];
const {SamplePiano}=await import(new URL('../dist/'+pianoImport.slice(2),import.meta.url));
const flush=()=>new Promise(setImmediate);
function setup(){
 const original={document:globalThis.document,window:globalThis.window,matchMedia:globalThis.matchMedia,download:SamplePiano.prototype.download,play:SamplePiano.prototype.play};let overlay;const notes=[],ends=[];
 function el(){return {children:[],dataset:{},style:{},listeners:{},hidden:false,open:false,setAttribute(){},focus(){},append(x){this.children.push(x);},remove(){this.removed=true;},setPointerCapture(){},addEventListener(k,fn){this.listeners[k]=fn;},showModal(){this.open=true;},close(){this.open=false;}};}
 globalThis.document={body:{append(x){overlay=x;}},createElement:el,addEventListener(){},removeEventListener(){},hidden:false};globalThis.window={addEventListener(){},removeEventListener(){}};globalThis.matchMedia=()=>({matches:false});
 const queries=new Map();const baseCreate=document.createElement;document.createElement=()=>{const node=baseCreate();node.querySelector=s=>{if(!queries.has(s))queries.set(s,el());return queries.get(s);};node.animate=()=>({finished:Promise.resolve(),cancel(){}});return node;};
 SamplePiano.prototype.download=()=>Promise.resolve(new ArrayBuffer(1));SamplePiano.prototype.play=id=>{notes.push(id);return new Promise(resolve=>ends.push(resolve));};
 const click=pitch=>{const key=queries.get('#future-key-regions').children.find(k=>k.label===pitch+' piano key');assert(key&&!key.disabled);key.listeners.click({detail:0});};
 // Labels are set by the real SamplePiano while constructing the keyboard.
 document.createElement=()=>{const node=baseCreate();node.setAttribute=(k,v)=>{if(k==='aria-label')node.label=v;};node.querySelector=s=>{if(!queries.has(s))queries.set(s,el());return queries.get(s);};node.animate=()=>({finished:Promise.resolve(),cancel(){}});return node;};
 return {queries,notes,ends,click,get overlay(){return overlay;},restore(){globalThis.document=original.document;globalThis.window=original.window;globalThis.matchMedia=original.matchMedia;SamplePiano.prototype.download=original.download;SamplePiano.prototype.play=original.play;}};
}
test('minimal chamber checks seven notes automatically after final note finishes, then offers retry',async()=>{
 const env=setup();try{let closes=0,unlocks=0;const room=openSecretChamber({onClose(){closes++;},onUnlock(){unlocks++;}});
 assert(!env.overlay.innerHTML.includes('Play this melody'));assert(!env.overlay.innerHTML.includes('secret-progress'));assert(!env.overlay.innerHTML.includes('small handmade piano waits'));assert(!env.overlay.innerHTML.includes('<canvas'));
 for(const n of ['C3','D3','E3','F3','G3','A3'])env.click(n);assert.equal(env.queries.get('.secret-result').open,false);env.click('B3');assert.equal(env.queries.get('.secret-result').open,false);
 assert(env.queries.get('#future-key-regions').children.every(k=>k.disabled));env.ends[0]();await flush();assert.equal(env.queries.get('.secret-result').open,false);
 env.ends[6]();await flush();assert.equal(env.queries.get('.secret-result').open,true);assert.equal(env.queries.get('#secret-result-message').textContent,"Hmmmm. That doesn't sound quite right.");assert.equal(WRONG_MELODY_MESSAGE,"Hmmmm. That doesn't sound quite right.");assert.equal(unlocks,0);
 env.queries.get('[data-action="retry"]').onclick();assert.equal(env.queries.get('.secret-result').open,false);env.click('C#4');assert.equal(env.notes.length,8);
 env.queries.get('[data-action="leave"]').onclick();assert.equal(closes,1);room.close();assert.equal(closes,1);
 }finally{env.restore();}
});
test('automatic correct sequence unlocks and navigates once; older note tails do not trigger success',async()=>{
 const env=setup();try{let unlocks=0,finishCelebration;const destinations=[];const room=openSecretChamber({onUnlock(){unlocks++;},navigate:url=>destinations.push(url),celebrationFactory:({onCandle})=>{for(let i=0;i<7;i++)onCandle(i);return {finished:new Promise(resolve=>finishCelebration=resolve),cancel(){},setPaused(){}};}});
 ['E4','B4','A4','G4','E4','C5','B4'].forEach(env.click);env.ends[5]();await flush();assert.equal(unlocks,0);env.ends[6]();await flush();assert.equal(unlocks,1);assert.deepEqual(destinations,[]);assert.equal(env.queries.get('.secret-room').children.length,7);finishCelebration(true);await flush();assert.deepEqual(destinations,['https://cshadwell.github.io/makers-last-echo/']);env.ends.slice(0,5).forEach(f=>f());await flush();assert.equal(destinations.length,1);room.close();
 }finally{env.restore();}
});
