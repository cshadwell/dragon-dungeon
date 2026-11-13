import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {openSecretEntrance,SECRET_ENTRY_TIMING} from '../dist/secret-entrance.js';
import {SECRET_APPROACH_MESSAGE} from '../dist/secret-passage-model.js';
function environment(){
 const calls=[],created=[];function element(tag){const el={tag,children:[],style:{},width:256,height:216,clientWidth:640,clientHeight:540,setAttribute(){},append(...els){this.children.push(...els);},remove(){this.removed=true;},getContext:()=>({drawImage(){}}),querySelectorAll(selector){return this.children.flatMap(c=>[...(c.tag===selector?[c]:[]),...c.querySelectorAll(selector)]);},animate(frames,options){calls.push({frames,...options,className:this.className});return {finished:Promise.resolve(),playState:'finished',cancel(){},pause(){},play(){}};}};created.push(el);return el;}
 const host=element('host'),canvas=element('canvas');host.querySelector=()=>canvas;
 const old={document:globalThis.document,window:globalThis.window,matchMedia:globalThis.matchMedia};
 globalThis.document={hidden:false,createElement:element,body:element('body'),addEventListener(){},removeEventListener(){}};globalThis.window={addEventListener(){},removeEventListener(){}};globalThis.matchMedia=()=>({matches:false});
 return {host,calls,created,restore(){Object.assign(globalThis,old);}};
}
test('secret wall shakes, splits two snapshot halves, blacks out, then reveals chamber',async()=>{
 const env=environment();try{let revealed=false;const run=openSecretEntrance({host:env.host,muted:true,revealChamber(){revealed=true;assert.equal(env.calls.at(-1).className,'secret-entry-black');assert.deepEqual(env.calls.at(-1).frames,[{opacity:0},{opacity:1}]);}});assert.equal(await run.finished,true);assert(revealed);
 assert.equal(env.calls[0].duration,SECRET_ENTRY_TIMING.shake);assert.deepEqual(env.calls.slice(1,3).map(c=>c.frames.at(-1).transform),['translateX(-100%)','translateX(100%)']);assert.deepEqual(env.calls.at(-1).frames,[{opacity:1},{opacity:0}]);assert(env.created.filter(e=>['secret-wall-opening','secret-entry-black'].includes(e.className)).every(e=>e.removed));
 }finally{env.restore();}
});
test('cancelling entry never opens the chamber or leaves a black layer',async()=>{const env=environment();try{let reveals=0;const run=openSecretEntrance({host:env.host,muted:true,revealChamber(){reveals++;}});run.cancel();assert.equal(await run.finished,false);assert.equal(reveals,0);assert(env.created.filter(e=>e.className==='secret-entry-black').every(e=>e.removed));}finally{env.restore();}});
test('secret approach text and footsteps-only sound are present',()=>{assert.equal(SECRET_APPROACH_MESSAGE,'A familiar eye stares back at you. You hear faint music playing from behind the wall. The urge to reach out and touch it is overpowering.');const wav=readFileSync(new URL('../dist/assets/secret/footsteps-only.wav',import.meta.url));assert.equal(wav.toString('ascii',0,4),'RIFF');assert(wav.length>500000&&wav.length<700000);});
