// Match the door transition's ten-step fade and timings, without door audio.
export function createScreenFade(){
 const cover=document.createElement('div');cover.setAttribute('aria-hidden','true');
 Object.assign(cover.style,{position:'fixed',inset:'0',zIndex:'20000',background:'#000',opacity:'0',pointerEvents:'auto'});document.body.append(cover);
 let animation;
 async function fade(from,to,duration){
  cover.hidden=false;animation?.cancel();cover.style.opacity=String(to);
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){animation=cover.animate([{opacity:from},{opacity:to}],{duration,easing:'steps(10, end)',fill:'both'});await animation.finished;}
 }
 return {darken:()=>fade(0,1,1250),reveal:()=>fade(1,0,950),hide(){cover.hidden=true;},remove(){animation?.cancel();cover.remove();}};
}
