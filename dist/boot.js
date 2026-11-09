import {createScreenFade} from './screen-fade.js?v=6d789c038015';
import {playOpeningScene} from './opening-scene.js?v=6d789c038015';
import {animateTitle} from './title-effects.js?v=6d789c038015';
// Title view precedes app initialization: opening it never loads or writes a save.
const title=document.getElementById('title-screen'),enter=document.getElementById('title-enter');
let titleMusic=null,titleMusicActive=false,stopTitleEffects=()=>{},openingComplete=false;
function stopTitleMusic(){titleMusicActive=false;if(titleMusic){titleMusic.pause();titleMusic.currentTime=0;}}
const preview=['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).has('preview');
let starting=false;
function titleKeys(e){
 if(starting){e.preventDefault();e.stopImmediatePropagation();return;}
 if(e.code==='Space'){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)start();}
}
async function start(){
 if(starting)return;starting=true;enter.disabled=true;stopTitleMusic();
 const fade=preview?null:createScreenFade();
 try{
  if(!preview){document.body.classList.add('boot-transition');title.inert=true;await fade.darken();stopTitleEffects();}
  if(!preview&&!openingComplete){
   const opening=playOpeningScene({beforeFinish:()=>fade.darken()});fade.hide();
   // The opening owns Space while its music/text are active.
   window.removeEventListener('keydown',titleKeys,true);
   await opening;openingComplete=true;
   window.addEventListener('keydown',titleKeys,true);
  }
  await import('./app.js?v=6d789c038015');
  document.body.classList.remove('title-open');title.remove();
  if(fade)await fade.reveal();
  document.body.classList.remove('boot-transition');
  window.dispatchEvent(new Event('dungeon:ready'));
  window.removeEventListener('keydown',titleKeys,true);
  document.querySelector('[data-action="forward"]')?.focus({preventScroll:true});
 }catch(error){starting=false;title.inert=false;enter.disabled=false;document.body.classList.remove('boot-transition');document.getElementById('title-status').textContent='The dungeon could not load. Please try again.';console.error(error);}
 finally{fade?.remove();}
}
if(preview){start();}else{
 const canvas=document.getElementById('title-art'),ctx=canvas.getContext('2d'),art=new Image();
 ctx.imageSmoothingEnabled=false;
 art.onload=()=>{if(title.isConnected&&!enter.disabled)stopTitleEffects=animateTitle(canvas,art);};
 art.onerror=()=>{document.getElementById('title-status').textContent='Dungeon of the Nameless Dragon';};
 art.src='./assets/title/nameless-dragon.png';
 titleMusic=new Audio('./assets/audio/title-screen.mp3');titleMusic.loop=false;titleMusic.volume=0.4;titleMusic.preload='auto';titleMusicActive=true;titleMusic.hidden=true;title.append(titleMusic);
 const musicButton=document.createElement('button');musicButton.id='title-music';musicButton.textContent='Play title music';musicButton.setAttribute('aria-pressed','false');title.append(musicButton);
 function musicState(playing){musicButton.textContent=playing?'Mute title music':'Play title music';musicButton.setAttribute('aria-pressed',String(playing));}
 async function playTitleMusic(){
  try{await titleMusic.play();if(!titleMusicActive){titleMusic.pause();return;}musicState(true);}
  catch{if(titleMusicActive)musicState(false);}
 }
 musicButton.addEventListener('click',()=>{if(!titleMusic.paused){titleMusic.pause();musicState(false);}else playTitleMusic();});
 titleMusic.addEventListener('ended',()=>{musicButton.textContent='Title music finished';musicButton.disabled=true;musicButton.setAttribute('aria-pressed','false');});
 titleMusic.addEventListener('error',()=>{musicButton.textContent='Title music unavailable';musicButton.disabled=true;});
 window.addEventListener('pagehide',()=>{stopTitleMusic();stopTitleEffects();});
 playTitleMusic();
 window.addEventListener('keydown',titleKeys,true);
 enter.addEventListener('click',start);enter.focus({preventScroll:true});
}
