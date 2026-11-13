import {startCandleCelebration,prefetchCandleCelebration,CANDLE_POSITIONS} from './secret-celebration.js?v=a06f70034131';
import {SamplePiano} from './secret-sample-piano.js?v=a06f70034131';
import {PIANO_SETTINGS} from './secret-piano-settings.js?v=a06f70034131';
import {createMelodyEntry,FINALE_URL} from './secret-passage-model.js?v=a06f70034131';
export const WRONG_MELODY_MESSAGE="Hmmmm. That doesn't sound quite right.";
export function openSecretChamber({unlocked=false,muted=false,onUnlock=()=>true,onClose=()=>{},navigate=url=>location.assign(url),celebrationFactory=startCandleCelebration}={}){
 const overlay=document.createElement('section');overlay.className='secret-chamber';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Hidden piano chamber');
 overlay.innerHTML=`<div class="secret-room" aria-hidden="true"></div><div class="secret-piano-panel"><div class="keyboard-art" id="keyboard-art"><img id="keyboard-image" src="./assets/secret/keyboard.png" alt="Antique handcrafted piano keyboard"><div id="future-key-regions"></div></div><p id="piano-status" role="status" hidden></p><button class="secret-studio" hidden>Enter the studio</button></div><dialog class="secret-result" aria-labelledby="secret-result-message"><p id="secret-result-message"></p><div class="secret-result-actions"><button data-action="retry">Try again</button><button data-action="leave">Return to the maze</button></div></dialog>`;
 document.body.append(overlay);const q=s=>overlay.querySelector(s),model=createMelodyEntry(),result=q('.secret-result');let active=true,transitioning=false,generation=0,leftPage=false,animation=null,pending=null,celebrating=false,celebration=null;
 const piano=new SamplePiano({root:q('#future-key-regions'),settings:PIANO_SETTINGS,status:q('#piano-status'),onNote:(pitch,serial)=>{
  if(unlocked)return true;if(!model.add(pitch))return false;if(model.ready)pending={...model.submit(),serial};render();return true;
 },onNotePlayed:(_pitch,serial)=>{
  if(!active||transitioning||pending?.serial!==serial)return;const correct=model.complete(pending.token);pending=null;
  if(correct){unlocked=true;onUnlock();celebrate();}else if(correct===false)showResult(WRONG_MELODY_MESSAGE);
 },onNoteError:()=>{
  if(!active||transitioning)return;if(pending)model.retry(pending.token);else model.clear();pending=null;piano.stop();q('#piano-status').hidden=true;showResult('The piano could not play. Please try again.');
 }});piano.setMuted(muted);
 function render(){q('.secret-studio').hidden=!unlocked||celebrating;piano.setEnabled(!transitioning&&!celebrating&&!result.open&&(unlocked||model.phase==='entry'&&model.notes.length<7),{stop:false});}
 function showResult(text){q('#secret-result-message').textContent=text;if(!result.open)result.showModal();render();q('[data-action="retry"]').focus({preventScroll:true});}
 function retry(){if(!active||transitioning)return;result.close();if(pending)model.retry(pending.token);model.clear();pending=null;piano.stop();q('#piano-status').hidden=true;render();piano.keys[0]?.focus({preventScroll:true});}
 function close(){if(!active)return;active=false;generation++;pending=null;celebration?.cancel();animation?.cancel();model.cancel();piano.dispose();if(result.open)result.close();overlay.remove();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',pagehide);window.removeEventListener('pageshow',pageshow);window.removeEventListener('keydown',keys,true);onClose();}
 async function celebrate(){
  if(!active||celebrating||transitioning)return;celebrating=true;render();piano.stop();const token=generation;
  const room=q('.secret-room'),candlePath=matchMedia('(prefers-reduced-motion: reduce)').matches?'./assets/secret/candle-still.png':'./assets/secret/candle.apng';
  celebration=celebrationFactory({piano,onCandle:index=>{if(!active)return;const candle=document.createElement('img');candle.className='secret-candle';candle.src=candlePath;candle.alt='';candle.draggable=false;const [x,y]=CANDLE_POSITIONS[index];Object.assign(candle.style,{left:x+'%',top:y+'%'});room.append(candle);}});
  celebration.setPaused(document.hidden);const completed=await celebration.finished;if(completed&&active&&!leftPage&&token===generation)enterStudio();
 }
 async function enterStudio(){if(!active||transitioning)return;transitioning=true;generation++;const token=generation;piano.setEnabled(false);q('.secret-studio').disabled=true;
  const blackout=document.createElement('div');blackout.setAttribute('aria-hidden','true');Object.assign(blackout.style,{position:'absolute',inset:'0',background:'#000',zIndex:'10',pointerEvents:'none',opacity:'0'});overlay.append(blackout);
  try{animation=blackout.animate([{opacity:0},{opacity:1}],{duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:2000,easing:'linear',fill:'forwards'});await animation.finished;if(active&&!leftPage&&token===generation)navigate(FINALE_URL);}catch{}
 }
 q('[data-action="retry"]').onclick=retry;q('[data-action="leave"]').onclick=close;q('.secret-studio').onclick=enterStudio;
 function keys(e){if(!active)return;if(e.code==='Escape'&&!transitioning){e.preventDefault();e.stopImmediatePropagation();close();}}
 function visibility(){celebration?.setPaused(document.hidden);if(document.hidden)piano.suspend();else piano.resume()?.catch(()=>{if(active&&!celebrating&&!transitioning){if(pending)model.retry(pending.token);else model.clear();pending=null;piano.stop();showResult('The piano could not play. Please try again.');}});}
 function pagehide(){leftPage=true;generation++;pending=null;celebration?.cancel();piano.stop();piano.suspend();}
 function pageshow(){if(leftPage)close();}
 window.addEventListener('keydown',keys,true);window.addEventListener('pagehide',pagehide);window.addEventListener('pageshow',pageshow);document.addEventListener('visibilitychange',visibility);
 q('#keyboard-image').onerror=()=>{if(active)showResult('The piano could not load. Please try again.');};
 prefetchCandleCelebration();const candlePreload=document.createElement('img');candlePreload.hidden=true;candlePreload.src='./assets/secret/candle.apng';candlePreload.alt='';overlay.append(candlePreload);
 render();piano.keys[0]?.focus({preventScroll:true});return {close};
}
