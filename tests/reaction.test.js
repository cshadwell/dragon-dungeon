import {test} from 'node:test';import assert from 'node:assert/strict';
import {createAttempt,tick,respond} from '../dist/reaction.js';
function snort(options={}){const a=createAttempt('left',0,{random:()=>0,...options});for(let t=100;t<=1100;t+=100)tick(a,t);return a;}
test('windup cannot be blocked early, even in correct direction',()=>{const a=createAttempt('high',0);assert.equal(respond(a,'high',10),'early');assert.equal(respond(a,'high',20),null);});
test('snort starts window on displayed frame; correct, wrong, and late',()=>{let a=snort();assert.equal(a.phase,'snort');assert.equal(a.deadline,1800);assert.equal(respond(a,'left',1400),'block');a=snort();assert.equal(respond(a,'right',1400),'wrong');a=snort();assert.equal(respond(a,'left',1801),'late');a=snort();for(let t=1200;t<=1900;t+=100){const r=tick(a,t);if(r==='late')assert.equal(t,1900);}assert.ok(a.done);});
test('inclusive boundary, safe practice, slow option and varied windup',()=>{assert.equal(respond(snort(),'left',1800),'block');assert.equal(snort({practice:true}).window,1400);assert.equal(snort({slow:true}).window,1150);assert.equal(createAttempt('high',0,{random:()=>1}).snortAt,2300);});
test('suspended frames pause without turning into missed blocks',()=>{const a=snort();assert.equal(tick(a,1500),'paused');assert.equal(respond(a,'left',1501),null);});
