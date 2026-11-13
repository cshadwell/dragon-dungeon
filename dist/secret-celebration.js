// The supplied four-second recording has seven attacks at half-second intervals.
export const CANDLE_CUES=Object.freeze([0,.5,1,1.5,2,2.5,3]);
export const CANDLE_POSITIONS=Object.freeze([[12,77],[25,38],[38,50],[50,61],[63,77],[76,30],[89,38]].map(Object.freeze));
export const CANDLE_HOLD_SECONDS=3;
const recordingUrl=new URL('./assets/secret/correct.mp3',import.meta.url);
let recordingBytes=null;
function download(){if(!recordingBytes){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);recordingBytes=fetch(recordingUrl,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('Success recording unavailable');return r.arrayBuffer();}).catch(e=>{recordingBytes=null;throw e;}).finally(()=>clearTimeout(timer));}return recordingBytes;}
export function prefetchCandleCelebration(){download().catch(()=>{});}
export function createCandleTimeline(onCandle){
 let count=0,holdAt=null,done=false;
 return {get count(){return count;},tick(seconds,ended=false){if(done)return true;while(count<CANDLE_CUES.length&&(ended||seconds>=CANDLE_CUES[count]))onCandle(count++);if(ended&&holdAt===null)holdAt=seconds;if(holdAt!==null&&seconds-holdAt>=CANDLE_HOLD_SECONDS)done=true;return done;}};
}
export function startCandleCelebration({piano,onCandle,requestFrame=requestAnimationFrame,cancelFrame=cancelAnimationFrame,now=()=>performance.now()}){
 let active=true,frame=null,source=null,gain=null,context=null,ended=false,paused=false,origin=0,pauseStart=0,pausedMs=0,started=false,duration=4,lastElapsed=0,lastAdvance=now(),resolve;
 const timeline=createCandleTimeline(onCandle),finished=new Promise(r=>resolve=r);
 function cleanup(){if(frame!==null)cancelFrame(frame);frame=null;if(source){source.onended=null;try{source.stop();}catch{}piano.voices.delete(source);source.disconnect();source=null;}gain?.disconnect();gain=null;}
 function finish(ok){if(!active)return;active=false;cleanup();resolve(ok);}
 function tick(){if(!active)return;if(!paused){let elapsed=context?context.currentTime-origin:(now()-origin-pausedMs)/1000;if(Math.abs(elapsed-lastElapsed)>.01){lastElapsed=elapsed;lastAdvance=now();}else if(context&&now()-lastAdvance>8000){source.onended=null;try{source.stop();}catch{}context=null;origin=now()-lastElapsed*1000;pausedMs=0;elapsed=lastElapsed;}if(timeline.tick(elapsed,ended||elapsed>=duration+.15)){finish(true);return;}}frame=requestFrame(tick);}
 function setPaused(value){value=Boolean(value);if(paused===value)return;paused=value;if(value)pauseStart=now();else{lastAdvance=now();if(started&&!context)pausedMs+=now()-pauseStart;}}
 (async()=>{
  try{const bytes=await download();if(!active)return;context=await piano.audio();const buffer=await context.decodeAudioData(bytes.slice(0));if(!active)return;
   duration=buffer.duration;source=context.createBufferSource();gain=context.createGain();source.buffer=buffer;gain.gain.value=piano.muted?0:piano.settings.volume;source.connect(gain);gain.connect(context.destination);piano.voices.add(source);source.onended=()=>{ended=true;};origin=context.currentTime;started=true;lastAdvance=now();source.start();if(paused)context.suspend().catch(()=>{});
  }catch{context=null;origin=now();started=true;pausedMs=0;if(paused)pauseStart=now();}
  if(active)frame=requestFrame(tick);
 })();
 return {finished,cancel(){finish(false);},setPaused};
}
