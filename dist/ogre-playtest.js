import {getCharacterPose} from './character-art.js?v=642c1f189ebb';
import {getRoomArt} from './room-art.js?v=642c1f189ebb';
import {ATTACK_DEFAULTS,PRACTICE_NEXT,targetForAttempt,attackPosition,judgeAttack,reactionPose} from './ogre-attack-model.js?v=642c1f189ebb';
const encounterParams=new URLSearchParams(location.search),integrated=encounterParams.get('encounter')==='1'&&window.parent!==window;
const notify=type=>{if(integrated)window.parent.postMessage({type:'ogre-attack:'+type},location.origin);};
const $=id=>document.getElementById(id),canvas=$('room'),ctx=canvas.getContext('2d'),images=new Map();
let mode='practice',phase='loading',attempt=0,hits=0,perfects=0,elapsed=0,lastTime=null,readyMs=0,resultMs=0,pose=1,config={...ATTACK_DEFAULTS.practice},frame=null,practiceStage=0,advancePractice=false,practiceDone=false,readyDelay=650,targetCenter=.5;
function draw(number){pose=number;const p=getCharacterPose('ogre',number);ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,470,200);ctx.drawImage(images.get('room'),0,0,470,200);ctx.drawImage(images.get(number),Math.round((470-p.width)/2),192-p.height,p.width,p.height);$('pose-label').textContent='OGRE · POSE '+number;canvas.setAttribute('aria-label',`The Ogre’s armory, approved Ogre pose ${number}`);}
function tuning(){config={passMs:Number($('speed').value),targetWidth:Number($('width').value)/100,targetCenter};$('speed-value').textContent=(config.passMs/1000).toFixed(2)+' s';$('width-value').textContent=Math.round(config.targetWidth*100)+'%';$('target').style.left=(targetCenter*100-config.targetWidth*50)+'%';$('target').style.width=config.targetWidth*100+'%';}
function progress(){ $('progress').textContent=mode==='practice'?`PRACTICE ${practiceStage+1} / 2 · ${hits} HITS · ${perfects} PERFECT`:`CHALLENGE · ${['ready','running'].includes(phase)?attempt+1:attempt} / 5 · ${hits} HITS`; }
function lock(value){for(const id of ['speed','width','defaults','challenge','practice'])$(id).disabled=value;}
function setMode(next){mode=next;practiceStage=0;advancePractice=practiceDone=false;targetCenter=.5;phase='idle';attempt=hits=perfects=elapsed=0;draw(1);$('outcome').hidden=true;$('rail').parentElement.classList.remove('last');$('pass').textContent='READY';$('marker').style.left='0%';$('direction').textContent='→ FIRST PASS';$('attack').textContent=next==='practice'?'Begin practice':'Start challenge';$('practice').hidden=next==='practice';$('challenge').hidden=next==='challenge';$('message').textContent=next==='practice'?'“Be quick. Be precise. Strike in the gold. A dragon won’t wait forever.”':'“Three good hits in five attempts. One second per crossing. Stay on your toes!”';$('instruction').textContent='“The opening won’t always be in the middle. Watch the gold: it shifts between attempts, sometimes right, sometimes left. Never hesitate.”';const d=ATTACK_DEFAULTS[next];$('speed').value=d.passMs;$('width').value=d.targetWidth*100;tuning();lock(false);progress();}
function begin(automatic=false){
 if(advancePractice){practiceStage=1;advancePractice=false;$('speed').value=PRACTICE_NEXT.passMs;$('width').value=PRACTICE_NEXT.targetWidth*100;}
 targetCenter=targetForAttempt(attempt);tuning();phase='ready';progress();readyDelay=automatic?350:650;readyMs=0;elapsed=0;draw(1);$('outcome').hidden=true;$('pass').textContent='GET READY';$('direction').textContent='→ FIRST PASS';$('marker').style.left='0%';$('rail').parentElement.classList.remove('last');$('attack').textContent='Get ready…';$('attack').disabled=true;lock(true);$('message').textContent='“Find the gold. One strike. Make it count.”';$('instruction').textContent=mode==='challenge'?'The target has shifted. Three crossings; the next attempt follows automatically.':'Watch the new target position. Strike in gold before the third pass ends.';
}
function finish(result){phase='result';resultMs=0;attempt++;if(['hit','perfect'].includes(result)){hits++;if(result==='perfect')perfects++;}draw(reactionPose(mode,result,attempt));const labels={hit:'HIT',perfect:'PERFECT HIT',miss:'MISS',hesitation:'TOO SLOW'};$('outcome').textContent=labels[result];$('outcome').hidden=false;$('pass').textContent=labels[result];
 const words={hit:'“Good strike. Now find that opening again.”',perfect:'“Right on the mark! That’s how you strike a dragon.”',miss:'“You missed your opening. Watch where you stop the marker.”',hesitation:'“Too slow. That would have cost you a face full of dragon fire. Again.”'};$('message').textContent=words[result];$('instruction').textContent=result==='hesitation'?'All three passes expired. Training is safe; the dragon will punish hesitation.':result==='miss'?'The stopped marker shows where you struck. Aim inside the gold zone.':'The stopped marker shows your timing. Bright center = perfect.';
 if(mode==='practice'&&['hit','perfect'].includes(result)){
 if(practiceStage===0){notify('practice1');advancePractice=true;$('message').textContent='“Good! We’ll try this next: a quicker crossing and a smaller opening.”';$('instruction').textContent='Next lesson: 1.25 seconds per crossing, 15% target. Watch for the gold to shift away from the middle.';}
 else{notify('practice2');practiceDone=true;$('message').textContent='“You’ve got it. Now let’s see what you can really do.”';$('instruction').textContent='Challenge: 1 second per crossing, 10% target. Attempts follow automatically; the opening shifts each time.';}
 }
 $('attack').disabled=true;$('attack').textContent=mode==='challenge'?'Next opening coming…':'Watch the result…';progress();
}
function trigger(){if(phase==='running'){const sample=judgeAttack(elapsed+Math.max(0,performance.now()-(lastTime??performance.now())),config);$('marker').style.left=sample.position*100+'%';finish(sample.result);}else if(phase==='practice-done'){setMode('challenge');begin();}else if(['idle','result-ready'].includes(phase))begin();else if(phase==='complete')setMode(mode);}
function tick(now){const dt=lastTime===null?0:now-lastTime;lastTime=now;
 if(!document.hidden){if(phase==='ready'){readyMs+=dt;if(readyMs>=readyDelay){phase='running';elapsed=0;$('attack').disabled=false;$('attack').textContent='ATTACK';$('pass').textContent='PASS 1 OF 3';}}
 else if(phase==='running'){elapsed+=dt;const s=attackPosition(elapsed,config.passMs);$('marker').style.left=s.position*100+'%';$('pass').textContent=s.pass===3?'! LAST OPENING · PASS 3 OF 3':`PASS ${s.pass} OF 3`;$('direction').textContent=s.pass===2?'← RETURN PASS':s.pass===3?'→ FINAL PASS':'→ FIRST PASS';$('rail').parentElement.classList.toggle('last',s.pass===3);if(s.expired)finish('hesitation');}
 else if(phase==='result'){resultMs+=dt;if(resultMs>=1500){draw(1);
 if(mode==='challenge'){
  if(hits>=3||attempt>=5){phase='complete';if(hits>=3)notify('complete');lock(false);$('attack').disabled=false;$('attack').textContent='Try challenge again';$('message').textContent=hits>=3?'“You’ve proved your worth. Remember: quick and accurate. Never hesitate.”':'“Not yet. Practice your timing, then face me again.”';$('instruction').textContent=`${hits} hits in ${attempt} attempts · ${perfects} perfect. ${integrated?(hits>=3?'Polished shield earned. Your progress is saved.':'Practice and try again whenever you’re ready.'):'This playtest grants no game rewards.'}`;}
  else begin(true);
 }else{lock(false);$('attack').disabled=false;phase=practiceDone?'practice-done':'result-ready';$('attack').textContent=practiceDone?'Start Ogre challenge':advancePractice?'Try next lesson':'Practice again';}
 }}}

 frame=requestAnimationFrame(tick);
}
$('attack').addEventListener('pointerdown',e=>{if(e.button!==0||$('attack').disabled)return;e.preventDefault();trigger();});
$('attack').addEventListener('click',e=>{if(e.detail===0)trigger();});
let held=false;document.addEventListener('keydown',e=>{if(!['Space','Enter'].includes(e.code)||['INPUT','SUMMARY'].includes(e.target.tagName)||(e.target.tagName==='BUTTON'&&e.target.id!=='attack'))return;e.preventDefault();if(e.repeat||held)return;held=true;trigger();});document.addEventListener('keyup',e=>{if(['Space','Enter'].includes(e.code))held=false;});
document.addEventListener('visibilitychange',()=>{lastTime=null;held=false;$('instruction').textContent=document.hidden?'Paused while this tab is hidden.':'Three crossings. Strike in gold before the final pass ends.';});window.addEventListener('blur',()=>{held=false;});
$('challenge').onclick=()=>setMode('challenge');$('practice').onclick=()=>setMode('practice');$('speed').oninput=tuning;$('width').oninput=tuning;$('defaults').onclick=()=>{const d=mode==='practice'&&practiceStage===1?PRACTICE_NEXT:ATTACK_DEFAULTS[mode];$('speed').value=d.passMs;$('width').value=d.targetWidth*100;tuning();};
function load(key,url){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{images.set(key,im);resolve();};im.onerror=()=>reject(Error('Artwork unavailable'));im.src=url;});}
Promise.all([load('room',getRoomArt('ogre').url),...[1,4,5,6,7,9,11,12,13,14,15].map(n=>load(n,getCharacterPose('ogre',n).url))]).then(()=>{setMode('practice');
 if(integrated){
  document.querySelector('.tuning').hidden=true;
  document.querySelector('footer').textContent='THE OGRE’S ARMORY · ATTACK TRAINING';
  const leave=document.createElement('button');leave.className='secondary';leave.textContent='Return to the maze';leave.onclick=()=>notify('leave');document.querySelector('.controls').append(leave);
  const stage=Number(encounterParams.get('practice'));
  if(stage===1){practiceStage=1;$('speed').value=PRACTICE_NEXT.passMs;$('width').value=PRACTICE_NEXT.targetWidth*100;tuning();progress();$('message').textContent='“Welcome back. Let’s try that quicker, smaller opening.”';}
  if(stage>=2){practiceDone=true;phase='practice-done';$('attack').textContent='Start Ogre challenge';$('message').textContent='“You know the lesson. Ready to prove your worth?”';}
  if(encounterParams.get('completed')==='true'){$('message').textContent='“You’ve already proved your worth. Your polished shield is yours to keep. Care for more practice?”';}
 }
 $('attack').disabled=false;frame=requestAnimationFrame(tick);}).catch(()=>{$('message').textContent='The approved artwork could not load. Please reload this page.';});
