// Victory stinger followed by the ending song. No adventure-state dependencies.
export function createEndingAudio(victory,ending){
 let active=false,phase='idle',generation=0,muted=false,finish=null;
 victory.loop=false;ending.loop=true;ending.volume=.4;
 function cleanup(){if(finish){victory.removeEventListener('ended',finish);victory.removeEventListener('error',finish);finish=null;}}
 function play(audio,token){
  Promise.resolve(audio.play()).then(()=>{if(!active||token!==generation)audio.pause();}).catch(()=>{if(audio===victory&&active&&token===generation)music(token);});
 }
 function music(token){
  if(!active||token!==generation||phase==='ending')return;
  cleanup();phase='ending';ending.currentTime=0;play(ending,token);
 }
 return {
  start(){if(active)return;active=true;phase='victory';const token=++generation;cleanup();ending.pause();ending.currentTime=0;victory.currentTime=0;victory.muted=ending.muted=muted;finish=()=>music(token);victory.addEventListener('ended',finish);victory.addEventListener('error',finish);play(victory,token);},
  resume(){if(active)return;active=true;phase='idle';victory.muted=ending.muted=muted;music(++generation);},
  setMuted(value){muted=Boolean(value);victory.muted=ending.muted=muted;},
  retry(){if(active){const audio=phase==='victory'?victory:ending;if(audio.paused)play(audio,generation);}},
  stop(){active=false;generation++;cleanup();victory.pause();ending.pause();victory.currentTime=ending.currentTime=0;phase='idle';}
 };
}
