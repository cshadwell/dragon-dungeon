import {load,fresh,save,SAVE_KEY} from './runtime.js?v=351d764579df';
import {installDialogueLayout} from './dialogue-layout.js?v=351d764579df';
import {createScreenFade} from './screen-fade.js?v=351d764579df';
import {playOpeningScene} from './opening-scene.js?v=351d764579df';
import {animateTitle} from './title-effects.js?v=351d764579df';
installDialogueLayout();
// Title view reads save availability; only confirmed New Game replaces progress.
const title=document.getElementById('title-screen'),enter=document.getElementById('title-enter'),resume=document.getElementById('title-resume');
let storage,hasSave=false,canResume=false;
try{storage=window.localStorage;hasSave=storage.getItem(SAVE_KEY)!==null;canResume=hasSave&&load(storage).writable;}catch{}
resume.disabled=!canResume;
let titleMusic=null,titleMusicActive=false,stopTitleEffects=()=>{},openingComplete=false;
function stopTitleMusic(){titleMusicActive=false;if(titleMusic){titleMusic.pause();titleMusic.currentTime=0;}}
const preview=['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).has('preview');
let starting=false,titleRevealed=preview,unlockTitle=()=>{};
function titleKeys(e){
 if(starting){e.preventDefault();e.stopImmediatePropagation();return;}
 if(e.code==='Space'){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat){if(titleRevealed){if(e.target===enter)start('new');else if(e.target===resume){if(canResume)start('resume');}else start(canResume?'resume':'new');}else unlockTitle();}}
}
async function start(mode='resume'){
 if(starting||!titleRevealed)return;if(mode==='new'&&hasSave&&!window.confirm('Start a new game? This will replace the saved adventure on this browser.'))return;
 if(mode==='new'&&!preview){if(!save(storage,fresh())){document.getElementById('title-status').textContent='Progress could not be saved. Your existing adventure has not been replaced.';return;}}
 starting=true;enter.disabled=resume.disabled=true;stopTitleMusic();
 const fade=preview?null:createScreenFade();
 try{
  if(!preview){document.body.classList.add('boot-transition');title.inert=true;await fade.darken();stopTitleEffects();}
  if(!preview&&mode==='new'&&!openingComplete){
   const opening=playOpeningScene({beforeFinish:()=>fade.darken()});fade.hide();
   // The opening owns Space while its music/text are active.
   window.removeEventListener('keydown',titleKeys,true);
   await opening;openingComplete=true;
   window.addEventListener('keydown',titleKeys,true);
  }
  await import('./app.js?v=351d764579df');
  document.body.classList.remove('title-open');title.remove();
  if(fade)await fade.reveal();
  document.body.classList.remove('boot-transition');
  window.dispatchEvent(new Event('dungeon:ready'));
  window.removeEventListener('keydown',titleKeys,true);
  document.querySelector('[data-action="forward"]')?.focus({preventScroll:true});
 }catch(error){starting=false;title.inert=false;enter.disabled=false;resume.disabled=!canResume;document.body.classList.remove('boot-transition');document.getElementById('title-status').textContent='The dungeon could not load. Please try again.';console.error(error);}
 finally{fade?.remove();}
}
if(preview){start();}else{
 const canvas=document.getElementById('title-art'),ctx=canvas.getContext('2d'),art=new Image();
 ctx.imageSmoothingEnabled=false;title.hidden=true;
 const artwork=new Promise((resolve,reject)=>{art.onload=resolve;art.onerror=()=>reject(Error('Title artwork unavailable'));});
 artwork.catch(()=>{});art.src='./assets/title/nameless-dragon.png';
 titleMusic=new Audio('./assets/audio/title-screen.mp3');titleMusic.id='title-audio';titleMusic.loop=false;titleMusic.volume=.4;titleMusic.preload='auto';titleMusic.hidden=true;title.append(titleMusic);
 const entry=document.createElement('section');entry.id='audio-entry';entry.setAttribute('aria-label','Begin the adventure');
 const begin=document.createElement('button');begin.textContent='Press Space Bar or tap to begin';
 const status=document.createElement('p');status.setAttribute('role','status');
 const silent=document.createElement('button');silent.textContent='Continue without sound';silent.hidden=true;
 entry.append(begin,status,silent);document.body.append(entry);
 let unlocking=false;
 unlockTitle=async(withoutSound=false)=>{
  if(unlocking||titleRevealed)return;unlocking=true;status.textContent='';
  // Invoke play in the actual Space/click handler, before awaiting art or fades.
  const playback=withoutSound?Promise.resolve():titleMusic.play();
  try{
   await Promise.all([playback,artwork]);titleRevealed=true;titleMusicActive=true;title.hidden=false;entry.remove();
   stopTitleEffects=animateTitle(canvas,art);(canResume?resume:enter).focus({preventScroll:true});
  }catch{titleMusic.pause();status.textContent='Sound could not start. Press Space Bar or tap to try again.';silent.hidden=false;}
  finally{unlocking=false;}
 };
 begin.onclick=()=>unlockTitle();silent.onclick=()=>unlockTitle(true);
 async function playTitleMusic(){try{await titleMusic.play();if(!titleMusicActive)titleMusic.pause();}catch{}}
 let titleWasPlaying=false;
 function suspendTitle(){if(starting||!titleMusicActive)return;titleWasPlaying=titleMusicActive&&!titleMusic.paused;titleMusicActive=false;titleMusic.pause();stopTitleEffects();}
 function resumeTitle(){if(starting||!titleRevealed||!title.isConnected||document.hidden)return;titleMusicActive=true;if(titleWasPlaying)playTitleMusic();if(art.complete&&art.naturalWidth){stopTitleEffects();stopTitleEffects=animateTitle(canvas,art);}}
 window.addEventListener('pagehide',suspendTitle);window.addEventListener('pageshow',resumeTitle);
 document.addEventListener('visibilitychange',()=>document.hidden?suspendTitle():resumeTitle());
 window.addEventListener('keydown',titleKeys,true);
 enter.addEventListener('click',()=>start('new'));resume.addEventListener('click',()=>start('resume'));begin.focus({preventScroll:true});
}
