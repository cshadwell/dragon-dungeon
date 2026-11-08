// Isolated visual review inside the actual encounter UI. Never reads/writes saves.
import {getCharacterPose,CHARACTER_POSE_COUNTS} from './character-art.js?v=9b2f8bc9e7ff';
import {ROOM_ART} from './room-art.js?v=9b2f8bc9e7ff';
export const ROOM_PREVIEWS=ROOM_ART;
export function showRoomPreview(){
 const $=id=>document.getElementById(id),params=new URLSearchParams(location.search);
 let room=Object.hasOwn(ROOM_PREVIEWS,params.get('room'))?params.get('room'):'ogre',number=1,revision=0;
 document.body.classList.add('encounter-room','room-preview');$('modal').close();$('encounter-controls').hidden=false;
 $('health').textContent='♥ ♥ ♥';$('health').setAttribute('aria-label','3 of 3 health - visual preview');
 const canvas=document.createElement('canvas');canvas.width=470;canvas.height=200;canvas.setAttribute('role','img');$('scene').replaceChildren(canvas);const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
 const heading=document.createElement('h2');$('message').before(heading);
 const controls=$('encounter-controls'),rooms=document.createElement('div');rooms.className='choices room-switches';controls.append(rooms);
 const switches={};for(const [key,config] of Object.entries(ROOM_PREVIEWS)){const b=document.createElement('button');b.textContent=config.title;b.onclick=()=>{room=key;number=1;render();};switches[key]=b;rooms.append(b);}
 const poseLabel=document.createElement('p');poseLabel.className='selection';controls.append(poseLabel);
 const poseButtons=document.createElement('div');poseButtons.className='guards';controls.append(poseButtons);
 for(const [label,step] of [['Previous pose',-1],['Next pose',1]]){const b=document.createElement('button');b.textContent=label;b.onclick=()=>{number=(number-1+step+CHARACTER_POSE_COUNTS[room])%CHARACTER_POSE_COUNTS[room]+1;render();};poseButtons.append(b);}
 const exit=document.createElement('a');exit.href='./';exit.textContent='Return to the maze';exit.className='room-exit';controls.append(exit);
 const cache=new Map();function image(url){if(!cache.has(url))cache.set(url,new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Image unavailable'));im.src=url;}));return cache.get(url);}
 async function render(){const token=++revision,config=ROOM_PREVIEWS[room],pose=getCharacterPose(room,number);
  $('location').textContent='CHARACTER CHAMBER';heading.textContent=config.title;$('message').textContent=config.description;$('direction').textContent=config.title.toUpperCase();poseLabel.textContent=`${room==='elf'?'Elf queen':room[0].toUpperCase()+room.slice(1)} pose ${number} / ${CHARACTER_POSE_COUNTS[room]}`;
  for(const [key,b] of Object.entries(switches))b.setAttribute('aria-pressed',String(key===room));
  const url=new URL(location.href);url.searchParams.set('room',room);history.replaceState(null,'',url);canvas.setAttribute('aria-label',`${config.title}, approved ${room} pose ${number}.`);
  try{const [bg,character]=await Promise.all([image(new URL('assets/rooms/'+config.background,import.meta.url).href),image(pose.url)]);if(token!==revision)return;ctx.clearRect(0,0,470,200);ctx.imageSmoothingEnabled=false;ctx.drawImage(bg,0,0,470,200);ctx.drawImage(character,Math.round((470-pose.width)/2),192-pose.height,pose.width,pose.height);}
  catch{if(token===revision)$('message').textContent='The room artwork could not load. Reload the preview.';}
 }
 render();
}
