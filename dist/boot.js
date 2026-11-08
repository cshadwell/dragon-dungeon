import {animateTitle} from './title-effects.js?v=9b2f8bc9e7ff';
// Title view precedes app initialization: opening it never loads or writes a save.
const title=document.getElementById('title-screen'),enter=document.getElementById('title-enter');
let titleMusic=null,titleMusicActive=false,stopTitleEffects=()=>{};
function stopTitleMusic(){titleMusicActive=false;if(titleMusic){titleMusic.pause();titleMusic.currentTime=0;}}
const preview=['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).has('preview');
async function start(){
 enter.disabled=true;stopTitleMusic();stopTitleEffects();
 try{
  await import('./app.js?v=9b2f8bc9e7ff');
  document.body.classList.remove('title-open');title.remove();
  document.querySelector('[data-action="forward"]')?.focus({preventScroll:true});
 }catch(error){enter.disabled=false;document.getElementById('title-status').textContent='The dungeon could not load. Please try again.';console.error(error);}
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
 enter.addEventListener('click',start);enter.focus({preventScroll:true});
}
