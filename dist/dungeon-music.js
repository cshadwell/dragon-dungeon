// Desired scene playback is separate from temporary browser interruptions.
export function createDungeonMusic(audio,onChange=()=>{}){
 let exploring=false,muted=false,disposed=false,suspended=false,generation=0,pending=null;
 audio.loop=true;audio.volume=.4;
 const status=()=>onChange({exploring,muted,playing:!audio.paused});
 async function retry(){
  if(disposed||!exploring||muted||suspended||!audio.paused||pending)return;
  const token=generation;
  let task;try{task=Promise.resolve(audio.play());}catch{status();return;}pending=task;
  try{await task;if(disposed||!exploring||muted||suspended||token!==generation)audio.pause();}catch{}
  finally{if(pending===task)pending=null;status();}
 }
 function reset(){generation++;pending=null;audio.pause();audio.currentTime=0;}
 return {
  setExploring(next){if(disposed||next===exploring)return;exploring=next;reset();if(exploring)retry();status();},
  toggle(){if(muted){muted=false;retry();}else if(audio.paused)retry();else{muted=true;generation++;audio.pause();}status();},
  setMuted(value){muted=Boolean(value);if(muted){generation++;audio.pause();}else retry();status();},
  setSuspended(value){if(suspended===Boolean(value))return;suspended=Boolean(value);generation++;pending=null;if(suspended)audio.pause();else retry();status();},
  retry,
  stop(){exploring=false;reset();status();},
  dispose(){disposed=true;exploring=false;reset();}
 };
}
