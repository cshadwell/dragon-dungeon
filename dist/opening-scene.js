const OPENING_TEXT='You embark upon a great quest. You seek something simple, a name. One word that will allow you to continue your journey. It will not be easy and you will need help along the way. Good luck and may fortune favor you.';
// Resolve only after the music has ended and the player explicitly continues.
export function playOpeningScene({beforeFinish=async()=>{}}={}){
 return new Promise(resolve=>{
  const scene=document.createElement('section');scene.className='opening-scene';scene.setAttribute('aria-label','Opening quest');
  const text=document.createElement('p');text.className='opening-copy';const gold=document.createElement('span');gold.textContent=OPENING_TEXT;text.append(gold);
  const controls=document.createElement('div');controls.className='opening-continue';const button=document.createElement('button');button.textContent='-Press Space Bar-';controls.append(button);controls.hidden=true;
  const audio=new Audio('./assets/audio/opening.mp3');audio.id='opening-music';audio.volume=.4;audio.loop=false;audio.preload='auto';scene.append(text,controls,audio);document.body.append(scene);
  let mode='playing',frame=0,fallbackStart=null;
  function fit(){text.style.fontSize='';let size=parseFloat(getComputedStyle(text).fontSize);while(text.offsetHeight>innerHeight*.76&&size>10){size--;text.style.fontSize=size+'px';}}
  function progress(){return fallbackStart===null?Math.min(1,audio.currentTime/(audio.duration||12.565)):Math.min(1,(performance.now()-fallbackStart)/12565);}
  function place(p){const end=(innerHeight-text.offsetHeight)/2;const y=Math.round(innerHeight+24+(end-innerHeight-24)*p);text.style.transform=`translate(-50%,${y}px)`;}
  function hold(){if(mode!=='playing')return;mode='holding';cancelAnimationFrame(frame);place(1);button.textContent='-Press Space Bar-';controls.hidden=false;}
  function tick(){if(mode!=='playing')return;place(progress());if(fallbackStart!==null&&progress()>=1)hold();else frame=requestAnimationFrame(tick);}
  async function finish(){if(mode!=='holding')return;mode='leaving';button.disabled=true;cancelAnimationFrame(frame);audio.pause();await beforeFinish();mode='done';window.removeEventListener('keydown',key,true);window.removeEventListener('resize',resize);window.removeEventListener('pagehide',pause);scene.remove();resolve();}
  function key(e){if(e.code!=='Space')return;e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;if(mode==='holding')finish();else if(mode==='blocked')play();}
  function resize(){fit();place(mode==='holding'?1:progress());}
  function pause(){audio.pause();}
  async function play(){mode='playing';controls.hidden=true;try{await audio.play();if(mode!=='playing')return;cancelAnimationFrame(frame);tick();}catch{if(fallbackStart!==null)return;mode='blocked';button.textContent='-Press Space Bar to play-';controls.hidden=false;}}
  button.onclick=()=>mode==='holding'?finish():play();
  audio.addEventListener('ended',hold);audio.addEventListener('error',()=>{if(mode==='done')return;fallbackStart=performance.now();mode='playing';controls.hidden=true;cancelAnimationFrame(frame);tick();});
  window.addEventListener('keydown',key,true);window.addEventListener('resize',resize);window.addEventListener('pagehide',pause);
  fit();place(0);document.fonts.ready.then(()=>{if(mode!=='done')resize();});play();
 });
}
