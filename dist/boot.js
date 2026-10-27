// Title view precedes app initialization: opening it never loads or writes a save.
const title=document.getElementById('title-screen'),enter=document.getElementById('title-enter');
const preview=['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).has('preview');
async function start(){
 enter.disabled=true;
 try{
  await import('./app.js?v=dc674bfe9cf8');
  document.body.classList.remove('title-open');title.remove();
  document.querySelector('[data-action="forward"]')?.focus({preventScroll:true});
 }catch(error){enter.disabled=false;document.getElementById('title-status').textContent='The dungeon could not load. Please try again.';console.error(error);}
}
if(preview){start();}else{
 const canvas=document.getElementById('title-art'),ctx=canvas.getContext('2d'),art=new Image();
 ctx.imageSmoothingEnabled=false;
 art.onload=()=>ctx.drawImage(art,0,0,canvas.width,canvas.height);
 art.onerror=()=>{document.getElementById('title-status').textContent='Dungeon of the Nameless Dragon';};
 art.src='./assets/title/nameless-dragon.png';
 enter.addEventListener('click',start);enter.focus({preventScroll:true});
}
