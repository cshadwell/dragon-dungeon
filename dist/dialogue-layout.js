import {STORY_SAMPLES,DOOR_DESCRIPTIONS,GUARDIAN_WARNING,JOURNAL_SAMPLE} from './dialogue-copy.js?v=a06f70034131';
export function largestFittingFont(maximum,fits){
 let lo=10,hi=Math.floor(maximum),best=10;
 while(lo<=hi){const size=Math.floor((lo+hi)/2);if(fits(size)){best=size;lo=size+1;}else hi=size-1;}
 return best;
}
// Size against the complete dialogue corpus, not the current message. Every room
// uses the same viewport-based geometry so changing pose/line never changes font.
export function installDialogueLayout(){
 if(document.documentElement.dataset.dialogueLayout)return;
 document.documentElement.dataset.dialogueLayout='shared';
 const probe=document.createElement('div');probe.setAttribute('aria-hidden','true');
 Object.assign(probe.style,{position:'fixed',left:'-10000px',top:'0',visibility:'hidden',pointerEvents:'none',fontFamily:'VT323, monospace',lineHeight:'1.08',whiteSpace:'normal',overflowWrap:'normal'});document.body.append(probe);
 function resize(){
  const w=innerWidth,h=innerHeight;
  const gutter=Math.max(10,Math.min(24,w*.02)),gap=Math.max(8,Math.min(18,w*.012)),padding=Math.max(10,Math.min(18,w*.012));
  const row=Math.max(280,Math.min(420,h*.39));
  const width=(w>=651?(w-2*gutter-gap)/2:w-2*gutter)-2*padding-6;
  const textHeight=row-2*padding-6-38; // bottom continuation prompt + breathing room
  const menuWidth=Math.min(760,w-32)-2*Math.max(16,Math.min(28,w*.02))-6;
  function measure(text,size,width){probe.style.fontSize=size+'px';probe.style.width=Math.max(80,width)+'px';probe.textContent=text;return probe.getBoundingClientRect().height;}
  const font=largestFittingFont(Math.max(32,Math.min(56,w*.032)),size=>{
   if(STORY_SAMPLES.some(text=>measure(text,size,width)>textHeight))return false;
   const intro='You stand in front of a door in the passage.';
   if(Object.values(DOOR_DESCRIPTIONS).some(text=>measure(intro,size,width)+measure(text,size,width)+14+64>row-2*padding-6))return false;
   if(measure(GUARDIAN_WARNING,size,width)+64>row-2*padding-6)return false;
   // The complete journal fits too; action buttons form two compact rows.
   if(measure(JOURNAL_SAMPLE,size,menuWidth)+184>h-32)return false;
   return true;
  });
  document.documentElement.style.setProperty('--dialogue-size',font+'px');
  document.documentElement.dataset.dialogueSize=String(font);
 }
 window.addEventListener('resize',resize);resize();document.fonts.ready.then(resize);
}
