export function pianoKeyRegions(settings) {
  const {whiteEdges, blackBounds, artworkWidth, artworkHeight, keyTop, whiteBottom, blackBottom} = settings;
  const region = (color, index, left, right, bottom) => ({
    id: `${color}-${String(index + 1).padStart(2, '0')}`,
    color,
    index,
    left: left / artworkWidth * 100,
    width: (right - left) / artworkWidth * 100,
    top: keyTop / artworkHeight * 100,
    height: (bottom - keyTop) / artworkHeight * 100,
  });
  const white = whiteEdges.slice(0, -1).map((left, index) => region('white', index, left, whiteEdges[index + 1], whiteBottom));
  const black = settings.blackKeysEnabled
    ? blackBounds.map(([left, right], index) => region('black', index, left, right, blackBottom))
    : [];
  return [...white, ...black].sort((a, b) => (a.left + a.width / 2) - (b.left + b.width / 2))
    .map((key, index) => ({...key, available: index < settings.recordedNotes}));
}

import {SECRET_PITCHES} from './secret-pitches.js?v=351d764579df';
const pitchById=new Map(SECRET_PITCHES.map(p=>[p.id,p]));
const sampleUrl=id=>new URL(`assets/secret/piano/${id}.wav`,import.meta.url).href;
// Adapted from Maker's SamplePiano; independent local assets, same regions/mixer.
export class SamplePiano {
 constructor({root,settings,onNote=()=>true,onNotePlayed=()=>{},onNoteError=()=>{},status=document.getElementById('piano-status')}){
  Object.assign(this,{root,settings,onNote,onNotePlayed,onNoteError,status});this.pressSerial=0;this.enabled=false;this.generation=0;this.voices=new Set();this.buffers=new Map();this.downloads=new Map();this.keys=[];
  for(const region of pianoKeyRegions(settings)){
   const key=document.createElement('button');key.type='button';key.className=`sample-key sample-key-${region.color}`;key.dataset.sample=region.id;key.dataset.available=String(region.available);key.setAttribute('aria-label',pitchById.get(region.id).pitch+' piano key');
   for(const p of ['left','width','top','height'])key.style[p]=region[p]+'%';key.disabled=true;
   let lastPointer=-Infinity,held=false;const pointers=new Set();
   const activate=()=>{if(!this.enabled)return;const pitch=pitchById.get(region.id).pitch;const serial=++this.pressSerial,generation=this.generation;if(this.onNote(pitch,serial)===false)return;this.play(region.id).then(completed=>{if(completed!==false)this.onNotePlayed(pitch,serial);}).catch(()=>{if(generation!==this.generation)return;this.error();this.onNoteError(serial);});};
   key.addEventListener('pointerdown',e=>{if(e.button!==0||pointers.has(e.pointerId))return;e.preventDefault();lastPointer=performance.now();pointers.add(e.pointerId);key.setPointerCapture?.(e.pointerId);activate();});
   const release=e=>pointers.delete(e.pointerId);key.addEventListener('pointerup',release);key.addEventListener('pointercancel',release);key.addEventListener('lostpointercapture',release);
   key.addEventListener('click',e=>{if(e.detail===0&&performance.now()-lastPointer>700&&!held)activate();});
   key.addEventListener('keydown',e=>{if(!['Space','Enter'].includes(e.code))return;e.preventDefault();if(!held&&!e.repeat){held=true;activate();}});key.addEventListener('keyup',e=>{if(['Space','Enter'].includes(e.code)){e.preventDefault();held=false;}});key.addEventListener('blur',()=>{held=false;pointers.clear();});
   root.append(key);this.keys.push(key);if(region.available)this.download(region.id).catch(()=>{});
  }
 }
 error(){this.status.hidden=false;this.status.textContent='That piano sound could not play. Clear the melody and try again.';}
 download(id){if(!pitchById.has(id))return Promise.reject(Error('Unknown sample'));if(!this.downloads.has(id)){
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
  this.downloads.set(id,fetch(sampleUrl(id),{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('Piano sample unavailable');return r.arrayBuffer();}).catch(e=>{this.downloads.delete(id);throw e;}).finally(()=>clearTimeout(timeout)));
 }return this.downloads.get(id);}
 async audio(){this.context??=new (window.AudioContext||window.webkitAudioContext)();await this.context.resume();if(this.context.state!=='running')throw Error('Audio paused');return this.context;}
 async buffer(id){if(!this.buffers.has(id)){const promise=this.download(id).then(bytes=>this.context.decodeAudioData(bytes.slice(0))).catch(e=>{this.buffers.delete(id);throw e;});this.buffers.set(id,promise);}return this.buffers.get(id);}
 voice(id,buffer,when=this.context.currentTime){
  const source=this.context.createBufferSource(),gain=this.context.createGain();source.buffer=buffer;source.playbackRate.value=pitchById.get(id).rate;gain.gain.value=this.muted?0:this.settings.volume;source.connect(gain);gain.connect(this.context.destination);this.voices.add(source);
  const finished=new Promise(resolve=>{source.onended=()=>{this.voices.delete(source);source.disconnect();gain.disconnect();resolve();};});
  if(this.voices.size>12){const oldest=this.voices.values().next().value;oldest.stop();}
  source.start(when);return finished;
 }
 async play(id){const token=this.generation;await this.audio();const buffer=await this.buffer(id);if(token!==this.generation)return false;this.status.hidden=true;await this.voice(id,buffer);return token===this.generation;}
 async playSequence(pitches){
  this.stop();const token=this.generation;await this.audio();const ids=pitches.map(p=>SECRET_PITCHES.find(n=>n.pitch===p)?.id);const buffers=await Promise.all(ids.map(id=>this.buffer(id)));if(token!==this.generation)return false;
  const now=this.context.currentTime+.03;await Promise.all(ids.map((id,i)=>this.voice(id,buffers[i],now+i*.46)));return token===this.generation;
 }
 setEnabled(enabled,{stop=true}={}){this.enabled=enabled;this.keys.forEach(k=>{k.disabled=!enabled||k.dataset.available!=='true';});if(!enabled&&stop)this.stop();}
 stop(){this.generation++;for(const voice of this.voices){try{voice.stop();}catch{}}this.voices.clear();}
 setMuted(value){this.muted=value;}
 suspend(){this.context?.suspend().catch(()=>{});}
 resume(){return this.context?.resume();}
 dispose(){this.setEnabled(false);this.context?.close().catch(()=>{});}
}
