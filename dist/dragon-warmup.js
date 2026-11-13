import {installChallengePause} from './challenge-pause.js?v=a06f70034131';
import {drawDefenceArena,updateAttackRail,createColorChoices} from './guardian-games.js?v=a06f70034131';
import {chooseDragonSpellPose} from './dragon-spell-poses.js?v=a06f70034131';
import {DRAGON_ROUNDS,WARMUP,warmupProgress,chooseDragonReaction,freshDragonMeter,updateDragonMeter,makeFinalSchedule,finalProgress,finalDefenceAngle,makeFinalMindRound} from './dragon-warmup-model.js?v=a06f70034131';
import {attackPosition,judgeAttack,targetForAttempt} from './ogre-attack-model.js?v=a06f70034131';
import {freshDefence,spawnAttack,stepDefence,ORBIT} from './elf-defence-model.js?v=a06f70034131';
import {makeRound,judge} from './wizard-mind-model.js?v=a06f70034131';
export const SPELL_COLORS={red:'#ef454b',blue:'#3984ff',green:'#49d665',orange:'#ff8c22',purple:'#b669ee',white:'#ffffff',yellow:'#ffe040'};
export function setupDragonWarmup({showPose,message,prompt,action,onMenu,onMeter,onDefeat,onVictory,onPrize}){
 const host=document.createElement('div');host.id='boss-game';host.hidden=true;
 host.innerHTML='<p id="boss-status" role="status"></p><button id="boss-menu">JOURNAL</button><div class="boss-arena"><canvas id="boss-canvas" width="400" height="90" role="img"></canvas><div id="boss-choices" class="guardian-choices"></div></div><div class="boss-inputs"><button id="boss-left" data-action="left" aria-label="Rotate shield left"><span class="pad-arrow" aria-hidden="true"></span></button><button id="boss-action">SPACE BAR</button><button id="boss-right" data-action="right" aria-label="Rotate shield right"><span class="pad-arrow" aria-hidden="true"></span></button></div>';
 document.querySelector('.controls').prepend(host);
 const rail=document.createElement('section');rail.id='boss-rail';rail.className='frame';rail.hidden=true;rail.setAttribute('aria-label','Challenge controls');document.querySelector('main').insertBefore(rail,document.querySelector('.bottom'));
 const attackRail=document.createElement('div');attackRail.className='rail';attackRail.id='boss-attack-rail';attackRail.setAttribute('role','img');
 attackRail.innerHTML='<div class="target"><div class="perfect"></div></div><div class="marker"></div>';rail.append(attackRail);
 const timer=document.createElement('progress');timer.id='boss-timer';timer.max=WARMUP.mind.seconds;timer.setAttribute('aria-label','Time remaining');host.prepend(timer);
 const inputs=host.querySelector('.boss-inputs');inputs.classList.add('movement-pad');
 const arena=host.querySelector('.boss-arena');
 const canvas=host.querySelector('canvas'),ctx=canvas.getContext('2d'),choices=host.querySelector('#boss-choices'),status=host.querySelector('#boss-status');
 let finalOnly=false;
 let meter=freshDragonMeter(),roundIndex=0,finalSchedule=[],attackAttempt=0;
 const settings=()=>DRAGON_ROUNDS[roundIndex];
 const progress=()=>roundIndex===2?finalProgress(successes,finalSchedule):warmupProgress(successes,roundIndex);
 let active=false,mode='cue',successes=0,attempt=0,elapsed=0,wait=1.2,last=null,round=null,defence=freshDefence(),left=false,right=false,paused=false,previousColor=null;
 const phase=()=>progress().phase;
 const held=new Set();
 const suspension=installChallengePause(()=>{last=null;clearInput();});
 function clearInput(){held.clear();left=false;right=false;}
 function updateStatus(){const p=progress();status.textContent=p.complete?'WARM-UP COMPLETE':`${p.phase==='mind'?'FOCUS':p.phase.toUpperCase()} · ${p.hits} / ${p.goal}`;}
 function prepare(){
  timer.max=settings().mind.seconds;
  mode='cue';wait=roundIndex===2?(phase()==='defence'?.7:.35):1.2;elapsed=0;clearInput();choices.replaceChildren();choices.hidden=true;
  canvas.hidden=phase()!=='defence';canvas.width=200;canvas.height=200;attackRail.hidden=phase()!=='attack';timer.hidden=phase()!=='mind';
  host.dataset.phase=phase();document.body.dataset.bossPhase=phase();document.body.dataset.bossRound=roundIndex;
  rail.hidden=phase()==='mind';host.hidden=phase()==='attack';
  if(phase()==='attack'){host.append(inputs);}
  else {arena.prepend(canvas);if(phase()==='defence')rail.append(inputs);else host.append(inputs);}
  for(const side of ['left','right']){
   const original=document.querySelector('.controls .movement-pad [data-action="'+side+'"]');
   if(original)inputs.querySelector('#boss-'+side).innerHTML=original.innerHTML;
  }
  inputs.hidden=phase()==='mind';
  inputs.querySelector('#boss-left').hidden=inputs.querySelector('#boss-right').hidden=phase()!=='defence';
  message.textContent='';
  prompt.textContent='';showPose(phase()==='attack'?10:phase()==='defence'?23:1);updateStatus();draw();
 }
 function next(){
  mode='active';elapsed=0;attempt++;if(phase()==='attack')attackAttempt++;
  if(phase()==='defence')defence=spawnAttack({...defence,result:null},roundIndex===2?finalDefenceAngle(defence.angle,attempt):attempt===1?270:Math.random()*360);
  if(phase()==='mind'){
   round=roundIndex===2?makeFinalMindRound(Math.random,previousColor):makeRound(settings().mindStage,Math.random,previousColor);previousColor=round.answer;
   showPose(chooseDragonSpellPose(round.answer),SPELL_COLORS[round.answer],round.answer);canvas.hidden=true;choices.hidden=false;
   choices.replaceChildren(...createColorChoices(round,answer,SPELL_COLORS));
  }else showPose(phase()==='attack'?10:23);
  draw();
 }
 function result(ok,text,perfect=false){
  mode='feedback';wait=roundIndex===2?(phase()==='defence'?(ok?0:.15):.25):phase()==='defence'?settings().defence.gap:1.2;
  if(ok)successes++;
  meter=updateDragonMeter(meter,ok?(perfect?'perfect':'hit'):'miss');onMeter(meter.level);
  if(meter.level===0){
   mode='defeated';paused=false;clearInput();rail.hidden=true;timer.hidden=true;host.hidden=true;canvas.hidden=true;choices.hidden=true;
   document.body.classList.remove('boss-playing');delete document.body.dataset.bossPhase;
   const journal=document.getElementById('journal');if(journal)journal.onclick=()=>{};
   message.textContent='I thought you worthy. Clearly you are no match for me. I banish you!';prompt.textContent='-Press Space Bar-';showPose(27);return;
  }
  if(roundIndex===2&&progress().complete){beginVictory();return;}
  message.textContent='';showPose(chooseDragonReaction(ok));updateStatus();choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-disabled','true'));
 }
 function strike(){
  if(suspension.paused)return;
  if(!active){action();return;}
  if(mode==='defeated'){mode='banishing';prompt.textContent='';onDefeat();return;}
  if(['banishing','prize-reveal','prize'].includes(mode))return;
  if(mode==='victory-first'){mode='victory-second';message.textContent='I never thought this day would come. You are worthy to know my true name. Proceed to accept your prize.';showPose(4);return;}
  if(mode==='victory-second'){mode='prize-reveal';message.textContent='';prompt.textContent='';Promise.resolve(onPrize(true)).then(()=>{mode='prize';}).catch(()=>{mode='victory-second';message.textContent='The prize could not be displayed. Press Space Bar to try again.';prompt.textContent='-Press Space Bar-';});return;}
  if(mode==='done'){if(finalOnly)previewFinal();else start();return;}
  if(mode==='interlude'){roundIndex++;if(roundIndex===2)finalSchedule=makeFinalSchedule();successes=0;attempt=0;attackAttempt=0;elapsed=0;round=null;defence=freshDefence();paused=false;document.body.classList.add('boss-playing');prepare();return;}
  if(phase()==='defence'){paused=!paused;inputs.querySelector('#boss-action').textContent=paused?'RESUME':'SPACE BAR';return;}
  if(mode!=='active'||paused||phase()!=='attack')return;
  const verdict=judgeAttack(elapsed*1000,{...settings().attack,targetCenter:targetForAttempt(Math.max(0,attackAttempt-1))});
  result(['hit','perfect'].includes(verdict.result),verdict.result==='perfect'?'Perfect strike!':verdict.result==='hit'?'A solid hit.':'You missed. Watch the next opening.',verdict.result==='perfect');draw();
 }
 function answer(word){if(!suspension.paused&&active&&mode==='active'&&phase()==='mind'&&!paused){const ok=judge(round,word,elapsed)==='correct';result(ok,ok?'Spell countered. Stay focused.':'The spell fooled you. Try the next color.');}}
 function draw(){
  if(!active||['interlude','defeated','banishing','victory-first','victory-second','prize-reveal','prize'].includes(mode))return;
  if(host.dataset.phase==='attack'){
   const center=targetForAttempt(Math.max(0,attackAttempt-1)),sample=attackPosition(elapsed*1000,settings().attack.passMs,settings().attack.passes);
   updateAttackRail(attackRail,{targetCenter:center,targetWidth:settings().attack.targetWidth,position:sample.position});
   attackRail.setAttribute('aria-label',`Attack bar ${Math.round(sample.position*100)} percent, target ${center*100} percent. ${mode==='active'&&Math.abs(sample.position-center)<settings().attack.targetWidth*.4?'Strike now.':''}`);
  }else if(host.dataset.phase==='defence'){
   canvas.setAttribute('aria-label',`Shield angle ${Math.round(defence.angle)} degrees${defence.projectile?', incoming attack '+Math.round(defence.projectile.angle)+' degrees':''}`);
   drawDefenceArena(ctx,defence,settings().defence,{flash:defence.result,running:!paused&&mode!=='cue',palette:{
    '#09110e':'#100b10','#526044':'#67515c','#273c2b':'#322530','#a99c62':'#b68c87','#354637':'#4b3544',
    '#b5c2af':'#e0c9cd','#5e8c65':'#9d6c80','#d8c98e':'#edc2c4','#09110ec9':'#100b10c9',
    '#b4a4e6':'#e59b85','#8474b6':'#bd6456','#554969':'#773d45','#302e40':'#38232e','#d6caff':'#ffd0ba'
   }});
  }
  if(phase()==='mind'&&round)timer.value=Math.max(0,round.seconds-elapsed);
 }

 function clearChallenge(){
  paused=false;clearInput();rail.hidden=true;timer.hidden=true;host.hidden=true;canvas.hidden=true;choices.hidden=true;
  document.body.classList.remove('boss-playing');delete document.body.dataset.bossPhase;
 }
 function beginVictory(){
  mode='victory-first';clearChallenge();message.textContent='DEFEAT! I have been bested by a true warrior.';prompt.textContent='-Press Space Bar-';showPose(17);onVictory();
 }
 function previewVictory(){active=true;beginVictory();}
 function showEarned(){active=true;mode='prize';clearChallenge();message.textContent='';prompt.textContent='';onPrize(false);}
 function showInterlude(){
       mode='interlude';clearInput();rail.hidden=true;timer.hidden=true;host.hidden=true;canvas.hidden=true;choices.hidden=true;
       document.body.classList.remove('boss-playing');delete document.body.dataset.bossPhase;
       message.textContent=roundIndex===0?"You clearly have some skills, but I was just warming up. Let's see if you survive this next round.":"Finally, a competent challenger. Perhaps I've finally found someone worthy of my name. This last round will test your true measure!";
       prompt.textContent='-Press Space Bar-';showPose(roundIndex===0?22:4);
 }
 function previewFinal(){finalOnly=true;active=true;roundIndex=1;successes=19;meter=freshDragonMeter();onMeter(meter.level);showInterlude();}
 function start(){roundIndex=0;finalSchedule=[];attackAttempt=0;meter=freshDragonMeter();onMeter(meter.level);active=true;successes=0;attempt=0;round=null;previousColor=null;defence=freshDefence();paused=false;host.hidden=false;document.body.classList.add('boss-playing');inputs.querySelector('#boss-action').textContent='SPACE BAR';prepare();}
 inputs.querySelector('#boss-action').onclick=strike;
 host.querySelector('#boss-menu').onclick=()=>{clearInput();onMenu();};
 attackRail.onclick=()=>{if(phase()==='attack')strike();};
 canvas.onclick=()=>{if(phase()==='attack')strike();};
 for(const side of ['left','right']){
  const b=inputs.querySelector('#boss-'+side);
  b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(side==='left')left=true;else right=true;};
  b.onpointerup=b.onpointercancel=()=>{if(side==='left')left=false;else right=false;};
 }
 window.addEventListener('keydown',e=>{
  if(!active||suspension.paused||document.getElementById('room-menu').open)return;
  if(['defeated','banishing'].includes(mode)&&e.code!=='Space'){e.preventDefault();return;}
  if(e.code==='Escape'){e.preventDefault();clearInput();onMenu();return;}
  if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))return;
  e.preventDefault();
  if(phase()==='defence'){held.add(e.code);if(e.code==='Space'&&!e.repeat)strike();}
  else if(!e.repeat){if(e.code==='Space')strike();else if(phase()==='mind'){const i=['ArrowUp','ArrowLeft','ArrowRight','ArrowDown'].indexOf(e.code);if(round)answer(round.choices[i].word);}}
 });
 window.addEventListener('keyup',e=>held.delete(e.code));window.addEventListener('blur',clearInput);document.addEventListener('visibilitychange',clearInput);
 function tick(now){
  const dt=last===null?0:Math.min(.05,(now-last)/1000);last=now;
  if(active&&!paused&&!suspension.paused&&!document.hidden&&!document.getElementById('room-menu').open){
   if(mode==='cue'||mode==='feedback'){
    wait-=dt;
    if(wait<=0){
     if(progress().complete){
      if(roundIndex<2){
       showInterlude();
      }else{
       beginVictory();
      }
     }
     else if(mode==='feedback'&&host.dataset.phase!==phase()){attempt=0;defence={...freshDefence(),angle:roundIndex===2?defence.angle:270};prepare();}
     else next();
    }
   }else if(mode==='active'){
    elapsed+=dt;
    if(phase()==='attack'&&attackPosition(elapsed*1000,settings().attack.passMs,settings().attack.passes).expired)result(false,'You hesitated. Be ready for the next opening.');
    else if(phase()==='defence'){
     defence=stepDefence(defence,dt,{left:left||held.has('ArrowLeft'),right:right||held.has('ArrowRight')},settings().defence);
     if(defence.result)result(defence.result==='block',defence.result==='block'?'Blocked. Keep your guard moving.':'That attack slipped through. Find the next one.');
    }else if(phase()==='mind'){
     status.textContent=`FOCUS · ${progress().hits} / ${progress().goal} · ${Math.max(0,round.seconds-elapsed).toFixed(1)}s`;
     if(elapsed>=round.seconds)result(false,'Too slow. Counter the next spell.');
    }
   }
   draw();
  }
  requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
 return {start,strike,previewFinal,previewVictory,showEarned,isActive:()=>active};
}
