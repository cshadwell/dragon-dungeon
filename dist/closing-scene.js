// Approved closing sequence for the live dragon room.
export function playClosingScene({stopMusic=()=>{},onReturn=()=>{},muted=false}={}){
 const bottom=document.querySelector('.bottom');
 const lower=document.createElement('section');lower.className='closing-scene';lower.setAttribute('aria-label','Closing credits');
 const text=document.createElement('p');text.className='opening-copy closing-copy';
 const gold=document.createElement('span');gold.innerHTML="Congratulations on completing Dungeon of the Nameless Dragon. You now have what you need to open the Dragon's Book. You have done well to get to this point, but still have some distance to go.<br><br>Press ever onward as glory awaits you.";text.append(gold);
 const signal=document.createElement('div');signal.className='closing-signal';signal.textContent='X-13';signal.hidden=true;
 const retry=document.createElement('button');retry.className='closing-retry';retry.textContent='Resume audio';retry.hidden=true;
 const noise=new Audio('./assets/audio/static.mp3');noise.volume=.4;noise.muted=muted;noise.preload='auto';
 const returnButton=document.createElement('button');returnButton.className='closing-return';returnButton.textContent='-Press Space Bar-';returnButton.hidden=true;
 let returned=false;function returnToMaze(){if(mode!=='resolved'||returned)return;returned=true;returnButton.disabled=true;onReturn();}
 returnButton.onclick=returnToMaze;
 lower.append(text,signal,retry,returnButton);bottom.replaceWith(lower);lower.append(bottom);bottom.classList.add('closing-old-panels');requestAnimationFrame(()=>bottom.classList.add('closing-fade'));
 let mode='credits',elapsed=0,last=0,raf=0,next=0,visible=false,suspended=document.hidden;
 function position(){const travel=innerHeight/2+text.offsetHeight/2+24;const y=lower.clientHeight+24-Math.max(0,elapsed-1.25)*travel/25.13;text.style.transform=`translate(-50%,${Math.round(y)}px)`;return y+text.offsetHeight<0;}
 async function play(){try{await noise.play();retry.hidden=true;}catch{retry.hidden=false;}}
 function tick(now){if(!last)last=now;if(!suspended){elapsed+=(now-last)/1000;if(mode==='credits'&&position()){mode='static';stopMusic();text.hidden=true;bottom.remove();signal.hidden=false;signal.style.opacity='0';signal.classList.add('flickering');play();}
 if(mode==='static'&&!noise.paused&&noise.currentTime>=next){visible=!visible;signal.style.opacity=visible?String(.45+Math.random()*.55):'0';signal.style.transform=visible?`translateX(${Math.floor(Math.random()*5)-2}px)`:'none';next=noise.currentTime+(visible?.06+Math.random()*.10:.28+Math.random()*.57);}}
 last=now;if(mode!=='resolved')raf=requestAnimationFrame(tick);}
 noise.onended=()=>{mode='resolved';signal.style.opacity='';signal.style.transform='';signal.classList.remove('flickering');retry.hidden=true;returnButton.hidden=false;returnButton.focus({preventScroll:true});cancelAnimationFrame(raf);};
 noise.onerror=()=>{retry.textContent='Retry static audio';retry.hidden=false;};retry.onclick=play;
 function visibility(){suspended=document.hidden;last=0;if(suspended)noise.pause();else if(mode==='static')play();}
 document.addEventListener('visibilitychange',visibility);
 window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);noise.pause();},{once:true});
 window.addEventListener('message',event=>{if(event.source===parent&&event.origin===location.origin&&event.data?.type==='dragon-room:sound')noise.muted=event.data.muted;});
 window.addEventListener('keydown',event=>{if(event.code==='Space'&&mode==='resolved'){event.preventDefault();if(!event.repeat)returnToMaze();return;}if(event.code==='Space'&&!retry.hidden){event.preventDefault();play();}});
 position();raf=requestAnimationFrame(tick);
 return {setMuted(value){noise.muted=Boolean(value);}};
}
