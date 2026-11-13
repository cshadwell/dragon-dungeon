import {animateTitle} from './title-effects.js?v=a06f70034131';
const $=id=>document.getElementById(id),music=$('entry-music'),canvas=$('title-art'),art=new Image();
music.volume=.4;music.loop=false;
let mode='entry',busy=false,stopEffects=()=>{},wasPlaying=false;
const artwork=new Promise((resolve,reject)=>{art.onload=resolve;art.onerror=()=>reject(Error('Title artwork unavailable'));});
// Preload the original art while the black entry screen is visible.
art.src='./assets/title/nameless-dragon.png';artwork.catch(()=>{});
function updateSound(){const playing=!music.paused;$('title-music').textContent=playing?'Mute title music':'Play title music';$('title-music').setAttribute('aria-pressed',String(playing));}
async function begin(silent=false){
 if(busy||mode!=='entry')return;busy=true;$('entry-status').textContent='';
 // Start playback directly inside the click/Space handler, before any await.
 const playback=silent?Promise.resolve():music.play();
 try{await Promise.all([playback,artwork]);mode='title';$('audio-entry').hidden=true;$('title-screen').hidden=false;stopEffects=animateTitle(canvas,art);updateSound();$('title-enter').focus({preventScroll:true});}
 catch{music.pause();$('entry-status').textContent='Sound could not start. Press Space Bar or tap to try again.';$('silent').hidden=false;}
 finally{busy=false;}
}
function finish(){if(mode!=='title')return;mode='done';music.pause();music.currentTime=0;stopEffects();$('title-screen').hidden=true;$('preview-end').hidden=false;$('replay').focus();}
$('begin').onclick=()=>begin();$('silent').onclick=()=>begin(true);$('title-enter').onclick=finish;
$('title-music').onclick=async()=>{if(!music.paused)music.pause();else try{await music.play();}catch{}updateSound();};
$('replay').onclick=()=>{mode='entry';$('preview-end').hidden=true;$('audio-entry').hidden=false;$('entry-status').textContent='';$('begin').focus();};
music.onended=()=>{$('title-music').textContent='Title music finished';$('title-music').setAttribute('aria-pressed','false');};
window.addEventListener('keydown',e=>{if(e.code!=='Space'||mode==='done')return;if(e.target===$('title-music')||e.target===$('silent'))return;e.preventDefault();e.stopImmediatePropagation();if(!e.repeat){if(mode==='entry')begin();else finish();}},true);
function suspend(){wasPlaying=mode==='title'&&!music.paused;music.pause();stopEffects();}
function resume(){if(mode!=='title'||document.hidden)return;stopEffects();stopEffects=animateTitle(canvas,art);if(wasPlaying)music.play().then(updateSound).catch(updateSound);}
document.addEventListener('visibilitychange',()=>document.hidden?suspend():resume());window.addEventListener('pagehide',suspend);window.addEventListener('pageshow',resume);
$('begin').focus();
