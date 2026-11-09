import {createOpeningPlayback} from './opening-playback.js?v=6f08161e9101';
const OPENING_TEXT='You embark upon a great quest. You seek something simple, a name. One word that will allow you to continue your journey. It will not be easy and you will need help along the way. Good luck and may fortune favor you.';
export function playOpeningScene({beforeFinish=async()=>{}}={}){
 return new Promise(resolve=>{
  const scene=document.createElement('section');scene.className='opening-scene';scene.setAttribute('aria-label','Opening quest');
  const text=document.createElement('p');text.className='opening-copy';const gold=document.createElement('span');gold.textContent=OPENING_TEXT;text.append(gold);
  const controls=document.createElement('div');controls.className='opening-continue';const button=document.createElement('button');button.textContent='-Press Space Bar-';const silentButton=document.createElement('button');silentButton.textContent='Continue without music';silentButton.hidden=true;controls.append(button,silentButton);controls.hidden=true;
  const audio=new Audio('./assets/audio/opening.mp3');audio.id='opening-music';audio.volume=.4;audio.loop=false;audio.preload='auto';scene.append(text,controls,audio);document.body.append(scene);
  let frame=0,leaving=false,done=false;
  const playback=createOpeningPlayback(audio,{onChange:mode=>{
   if(leaving||done)return;silentButton.hidden=mode!=='blocked';controls.hidden=!['holding','blocked','suspended'].includes(mode);
   button.textContent=mode==='holding'?'-Press Space Bar-':'-Press Space Bar to resume-';
  }});
  function fit(){text.style.fontSize='';let size=parseFloat(getComputedStyle(text).fontSize);while(text.offsetHeight>innerHeight*.76&&size>10){size--;text.style.fontSize=size+'px';}}
  function place(p){const end=(innerHeight-text.offsetHeight)/2;const y=Math.round(innerHeight+24+(end-innerHeight-24)*p);text.style.transform=`translate(-50%,${y}px)`;}
  function tick(){if(done)return;if(!leaving)place(playback.tick());frame=requestAnimationFrame(tick);}
  async function finish(){
   if(playback.mode!=='holding'||leaving)return;leaving=true;button.disabled=true;
   try{await beforeFinish();}catch{leaving=false;button.disabled=false;return;}
   done=true;cancelAnimationFrame(frame);playback.stop();
   window.removeEventListener('keydown',key,true);window.removeEventListener('resize',resize);window.removeEventListener('pagehide',pause);window.removeEventListener('pageshow',resume);document.removeEventListener('visibilitychange',visibility);
   scene.remove();resolve();
  }
  function proceed(){if(leaving)return;if(playback.mode==='holding')finish();else if(['blocked','suspended'].includes(playback.mode))playback.play();}
  function key(e){if(e.code!=='Space')return;e.preventDefault();e.stopImmediatePropagation();if(!e.repeat){if(e.target===silentButton)playback.continueSilent();else proceed();}}
  function resize(){fit();place(playback.mode==='holding'?1:playback.progress());}
  function pause(){playback.pause();}
  function resume(){if(!document.hidden&&!leaving)playback.resume();}
  function visibility(){if(document.hidden)pause();else resume();}
  button.onclick=proceed;silentButton.onclick=()=>playback.continueSilent();
  window.addEventListener('keydown',key,true);window.addEventListener('resize',resize);window.addEventListener('pagehide',pause);window.addEventListener('pageshow',resume);document.addEventListener('visibilitychange',visibility);
  fit();place(0);document.fonts.ready.then(()=>{if(!done)resize();});playback.play();tick();
 });
}
