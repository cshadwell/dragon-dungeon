// Audio-clock prologue with resumable interruptions and a bounded silent fallback.
export function createOpeningPlayback(audio,{now=()=>performance.now(),onChange=()=>{}}={}){
 let mode='idle',generation=0,silent=false,silentTime=0,silentStart=0,lastPosition=0,lastAdvance=now();
 const duration=()=>Number.isFinite(audio.duration)&&audio.duration>0?audio.duration:12.565;
 const progress=()=>mode==='holding'?1:Math.min(1,silent?(silentTime+(mode==='playing'?(now()-silentStart)/1000:0))/duration():audio.currentTime/duration());
 function set(next){mode=next;onChange(next);}
 function hold(){if(['done','holding'].includes(mode))return;generation++;audio.pause();set('holding');}
 function fallback(){if(['done','holding'].includes(mode))return;const suspended=mode==='suspended';silentTime=progress()*duration();silent=true;silentStart=now();generation++;audio.pause();set(suspended?'suspended':'playing');}
 async function play(){
  if(['done','holding'].includes(mode))return;
  const token=++generation;lastAdvance=now();lastPosition=audio.currentTime;set('playing');
  if(silent){silentStart=now();return;}
  try{await audio.play();if(token!==generation||mode!=='playing')audio.pause();}catch{if(token===generation&&mode==='playing')set('blocked');}
 }
 function pause(){if(!['playing','blocked'].includes(mode))return;if(silent&&mode==='playing')silentTime+=(now()-silentStart)/1000;generation++;audio.pause();set('suspended');}
 function tick(){
  if(mode!=='playing')return progress();
  if(silent){if(progress()>=1)hold();}
  else if(audio.ended)hold();
  else if(audio.currentTime>lastPosition){lastPosition=audio.currentTime;lastAdvance=now();}
  else if(now()-lastAdvance>=8000)fallback();
  return mode==='holding'?1:progress();
 }
 audio.addEventListener('ended',hold);audio.addEventListener('error',fallback);
 return {get mode(){return mode;},progress,play,pause,tick,continueSilent:fallback,
  resume(){if(mode==='suspended')return play();},
  stop(){generation++;set('done');audio.pause();audio.removeEventListener('ended',hold);audio.removeEventListener('error',fallback);}
 };
}
