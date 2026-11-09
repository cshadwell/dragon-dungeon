function drawFrame(frame,canvas){
  if(!frame.clientWidth||!frame.clientHeight)return;
  const w=Math.floor(frame.clientWidth/2),h=Math.floor(frame.clientHeight/2);
  canvas.width=w;canvas.height=h;
  const ctx=canvas.getContext('2d');
  const rect=(x,y,width,height,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,width,height);};
  function outline(inset,color){
    rect(inset,inset,w-2*inset,1,color);rect(inset,h-inset-1,w-2*inset,1,color);
    rect(inset,inset,1,h-2*inset,color);rect(w-inset-1,inset,1,h-2*inset,color);
  }
  outline(0,'#6b656b');outline(1,'#27252a');outline(2,'#191419');outline(3,'#602b30');outline(5,'#8b6560');
  for(let x=20;x<w-18;x+=14){
    rect(x,1,6,1,'#65575e');rect(x+2,2,2,1,'#65575e');rect(x,h-3,6,1,'#65575e');
  }
  for(const [x,y,dx,dy] of [[0,0,1,1],[w,0,-1,1],[0,h,1,-1],[w,h,-1,-1]]){
    for(let step=0;step<3;step++){
      const px=x+dx*(1+step*2),py=y+dy*(1+step*2);
      rect(px-(dx<0?4:0),py-(dy<0?4:0),4,4,'#8e8286');
      rect(px-(dx<0?3:0),py-(dy<0?3:0),3,3,'#3d303a');
    }
    rect(x+dx*3-1,y+dy*3-1,2,2,'#a3534a');
  }
  const center=Math.floor(w/2);
  for(let row=0;row<7;row++){
    const half=3-Math.abs(row-3);
    rect(center-half,row,half*2+1,1,'#82656b');
  }
  rect(center,1,1,4,'#d76731');
}
document.querySelectorAll('.frame').forEach(frame=>{
  const canvas=document.createElement('canvas');canvas.className='forged-border';canvas.setAttribute('aria-hidden','true');
  frame.append(canvas);
  const resize=new ResizeObserver(()=>drawFrame(frame,canvas));resize.observe(frame);
});

const $=id=>document.getElementById(id),music=$('music'),noise=$('static'),text=$('credits'),signal=$('signal');
music.volume=.4;noise.volume=.4;
let mode='ready',elapsed=0,last=0,raf=0,muted=false;
let nextSignalChange=0,signalVisible=false;
function resetSignal(){nextSignalChange=0;signalVisible=false;signal.style.opacity='';signal.style.transform='';}
// Audio time keeps the irregular attempts frozen when playback is interrupted.
// Brief appearances (60–160ms) separated by much longer black gaps (280–850ms).
function updateSignal(){
 if(noise.paused||noise.currentTime<nextSignalChange)return;
 signalVisible=!signalVisible;
 signal.style.opacity=signalVisible?String(.45+Math.random()*.55):'0';
 signal.style.transform=signalVisible?`translateX(${Math.floor(Math.random()*5)-2}px)`:'none';
 nextSignalChange=noise.currentTime+(signalVisible?.06+Math.random()*.10:.28+Math.random()*.57);
}
function position(){const lower=$('lower');const openingTravel=innerHeight/2+text.offsetHeight/2+24;const speed=openingTravel/25.13;const y=lower.clientHeight+24-Math.max(0,elapsed-1.25)*speed;text.style.transform=`translate(-50%,${Math.round(y)}px)`;return y+text.offsetHeight<0;}
async function play(audio){try{await audio.play();$('retry').hidden=true;}catch{$('retry').hidden=false;}}
function tick(now){if(!last)last=now;if(!document.hidden){elapsed+=(now-last)/1000;if(mode==='credits'&&position()){mode='static';music.pause();music.currentTime=0;text.style.visibility='hidden';signal.hidden=false;resetSignal();signal.style.opacity='0';signal.classList.add('flickering');play(noise);}if(mode==='static')updateSignal();}last=now;raf=requestAnimationFrame(tick);}
function start(){cancelAnimationFrame(raf);music.pause();noise.pause();music.currentTime=0;noise.currentTime=0;elapsed=0;last=0;mode='credits';resetSignal();signal.hidden=true;signal.classList.remove('flickering');$('start-screen').hidden=true;document.body.classList.add('running');text.style.visibility='visible';position();play(music);raf=requestAnimationFrame(tick);}
noise.onended=()=>{mode='resolved';resetSignal();signal.classList.remove('flickering');$('retry').hidden=true;cancelAnimationFrame(raf);};
noise.onerror=()=>{$('retry').hidden=false;$('retry').textContent='Retry static audio';};
$('start').onclick=start;$('retry').onclick=()=>play(mode==='static'?noise:music);
window.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();if(!e.repeat&&mode==='ready')start();else if(!$('retry').hidden)play(mode==='static'?noise:music);}if(e.code==='KeyR'&&!e.repeat)start();if(e.code==='KeyM'&&!e.repeat){muted=!muted;music.muted=noise.muted=muted;}});
document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden){music.pause();noise.pause();}else if(mode==='credits'||mode==='static')play(mode==='static'?noise:music);});
window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);music.pause();noise.pause();});
