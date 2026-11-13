// The secret wall has its own transition; ordinary door sounds remain untouched.
export const SECRET_ENTRY_TIMING=Object.freeze({shake:900,split:2600,darken:1250,reveal:950});
const soundFiles={rumble:new URL('./assets/secret/rumble.mp3',import.meta.url),steps:new URL('./assets/secret/footsteps-only.wav',import.meta.url)};
const downloads=new Map();
function download(url){if(!downloads.has(url)){const c=new AbortController(),timer=setTimeout(()=>c.abort(),8000);downloads.set(url,fetch(url,{signal:c.signal}).then(r=>{if(!r.ok)throw Error('Missing passage sound');return r.arrayBuffer();}).catch(e=>{downloads.delete(url);throw e;}).finally(()=>clearTimeout(timer)));}return downloads.get(url);}
export function prefetchSecretEntrance(){Object.values(soundFiles).forEach(url=>download(url).catch(()=>{}));}
export function openSecretEntrance({host,muted=false,revealChamber}){
 let cancelled=false,context=null,layer=null,black=null,rumble=null,steps=null;
 const animations=new Set(),paused=new Set(),visibleWaiters=new Set(),sources=new Set();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 // Resume from this actual eye gesture, not a delayed animation callback.
 try{context=new (window.AudioContext||window.webkitAudioContext)();}catch{}
 const audioReady=context?context.resume().then(()=>Promise.all(Object.values(soundFiles).map(url=>download(url).then(bytes=>context.decodeAudioData(bytes.slice(0)))))).catch(()=>null):Promise.resolve(null);
 const stop=()=>{for(const s of sources){try{s.stop();}catch{}}sources.clear();};
 function cancel(){if(cancelled)return;cancelled=true;for(const resolve of visibleWaiters)resolve();visibleWaiters.clear();for(const a of animations)a.cancel();stop();}
 function animate(el,frames,duration,easing='linear'){
  if(cancelled)return Promise.reject(Error('Passage cancelled'));
  const a=el.animate(frames,{duration:reduced?0:duration,easing,fill:'forwards'});animations.add(a);if(document.hidden){a.pause();paused.add(a);}a.finished.then(()=>paused.delete(a),()=>paused.delete(a));return a.finished;
 }
 function play(buffer,volume){
  if(!context||!buffer||cancelled||muted||context.state!=='running')return null;
  const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;gain.gain.value=volume;source.connect(gain);gain.connect(context.destination);sources.add(source);
  let timer,ended=false;const finished=new Promise(resolve=>{const done=()=>{if(ended)return;ended=true;clearInterval(timer);sources.delete(source);source.disconnect();gain.disconnect();resolve();};source.onended=done;let remaining=buffer.duration*1000+2000,last=performance.now();timer=setInterval(()=>{const now=performance.now();if(!document.hidden)remaining-=now-last;last=now;if(remaining<=0){try{source.stop();}catch{}done();}},250);});source.start();return {source,gain,finished};
 }
 function visibility(){if(document.hidden){for(const a of animations)if(a.playState==='running'){a.pause();paused.add(a);}context?.suspend().catch(()=>{});}else{for(const a of paused)a.play();paused.clear();context?.resume().catch(()=>{});for(const resolve of visibleWaiters)resolve();visibleWaiters.clear();}}
 function gesture(){context?.resume().catch(()=>{});}
 function resize(){if(!layer)return;for(const [i,canvas] of [...layer.querySelectorAll('canvas')].entries())Object.assign(canvas.style,{width:host.clientWidth+'px',height:host.clientHeight+'px',left:i?-host.clientWidth/2+'px':'0'});}
 const finished=(async()=>{
  try{
   const original=host.querySelector('canvas');if(!original)throw Error('Missing corridor');
   layer=document.createElement('div');layer.className='secret-wall-opening';layer.setAttribute('aria-hidden','true');
   const panels=[];for(let i=0;i<2;i++){const half=document.createElement('div');half.className='secret-wall-half';half.style.left=i?'50%':'0';const copy=document.createElement('canvas');copy.width=original.width;copy.height=original.height;copy.getContext('2d').drawImage(original,0,0);half.append(copy);layer.append(half);panels.push(half);}host.append(layer);resize();
   black=document.createElement('div');black.className='secret-entry-black';black.setAttribute('aria-hidden','true');document.body.append(black);
   document.addEventListener('visibilitychange',visibility);window.addEventListener('pagehide',cancel);window.addEventListener('resize',resize);window.addEventListener('pointerdown',gesture);
   const buffers=await audioReady;if(document.hidden&&!cancelled)await new Promise(resolve=>visibleWaiters.add(resolve));if(cancelled)return false;
   rumble=play(buffers?.[0],.65);
   const tremor=[{transform:'translate(0,0)'},{transform:'translate(-3px,2px)'},{transform:'translate(3px,-2px)'},{transform:'translate(-2px,-1px)'},{transform:'translate(2px,2px)'},{transform:'translate(0,0)'}];
   await animate(layer,tremor,SECRET_ENTRY_TIMING.shake,'steps(2, end)');
   await Promise.all(panels.map((half,i)=>animate(half,[{transform:'translateX(0)'},{transform:`translateX(${i?100:-100}%)`}],SECRET_ENTRY_TIMING.split,'ease-in-out')));
   if(rumble&&context){rumble.gain.gain.setValueAtTime(.65,context.currentTime);rumble.gain.gain.linearRampToValueAtTime(0,context.currentTime+SECRET_ENTRY_TIMING.darken/1000);}
   await animate(black,[{opacity:0},{opacity:1}],SECRET_ENTRY_TIMING.darken);
   if(cancelled)return false;if(rumble){try{rumble.source.stop();}catch{}}
   // Footsteps only, beginning after the entire screen is black.
   steps=play(buffers?.[1],.85);await steps?.finished;if(cancelled)return false;
   revealChamber();await animate(black,[{opacity:1},{opacity:0}],SECRET_ENTRY_TIMING.reveal);return !cancelled;
  }catch{return false;}
  finally{stop();for(const a of animations)a.cancel();layer?.remove();black?.remove();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',cancel);window.removeEventListener('resize',resize);window.removeEventListener('pointerdown',gesture);context?.close().catch(()=>{});}
 })();
 return {finished,cancel};
}
