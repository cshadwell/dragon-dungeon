// Session-only playback state. No adventure save or storage dependencies.
export function createDungeonMusic(audio,onChange=()=>{}){
 let exploring=false,muted=false,disposed=false;
 audio.loop=true;audio.volume=.4;
 const status=()=>onChange({exploring,muted,playing:!audio.paused});
 async function retry(){if(disposed||!exploring||muted||!audio.paused)return;try{await audio.play();if(disposed||!exploring||muted)audio.pause();}catch{}status();}
 function reset(){audio.pause();audio.currentTime=0;}
 return {
  setExploring(next){if(disposed||next===exploring)return;exploring=next;reset();if(exploring)retry();status();},
  toggle(){if(muted){muted=false;retry();}else if(audio.paused)retry();else{muted=true;audio.pause();}status();},
  setMuted(value){muted=Boolean(value);if(muted)audio.pause();else retry();status();},
  retry,
  stop(){exploring=false;reset();status();},
  dispose(){disposed=true;exploring=false;reset();}
 };
}
