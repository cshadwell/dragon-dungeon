import {ogreSprites} from './ogre-sprite-data.js?v=dc674bfe9cf8';
// Original supplied transparent Ogre sprites over the chamber scene.
// Original code-drawn chipped red masonry, using the supplied stock preview as palette/style reference.
function redBricks(){
 let stones='';
 for(let row=0;row<8;row++)for(let col=-1;col<8;col++){
  const x=col*64+(row%2)*32,y=row*32,n=((row+5)*173+(col+7)*89)%23;
  const colors=['#641324','#74182b','#81192d','#58101e'];
  stones+=`<path d="M${x+3} ${y+2}h54l5 5v19l-5 4H${x+5}l-4-5V7Z" fill="${colors[(row+col+8)%4]}"/><path d="M${x+4} ${y+4}h47l-8 5-18-2-8 7-13 3Z" fill="#a02a3d" opacity=".65"/><path d="M${x+9} ${y+25}l16-8 8 4 20-6 7 9-9 4H${x+12}Z" fill="#330b17" opacity=".65"/><path d="M${x+14+n} ${y+3}l-4 7 6 4-7 8" stroke="#390b17" stroke-width="2" fill="none"/>`;
 }
 return stones;
}
const redMasonry=redBricks();
export function ogreArt(s){
 const phase=s.encounter,round=s.ogre.round,training=['brief','stance','hint','hurt','tutorial','success'].includes(phase);
 const stance=phase==='tutorial'?'high':phase==='success'?['high','left','right'][Math.max(0,round-1)]:training?['high','left','right'][Math.min(round,2)]:'rest';
 const col=stance==='left'?0:stance==='right'?2:1;
 const frame=(pose,column,kind)=>{
  const sprite=ogreSprites[`${pose}-${column}`],scale=sprite.scale;
  return `<image class="ogre-frame ${kind}" href="assets/ogre/${sprite.file}" x="${210-sprite.anchor*scale}" y="${264-sprite.h*scale}" width="${sprite.w*scale}" height="${sprite.h*scale}" style="image-rendering:pixelated"/>`;
 };
 return `<svg class="ogre-art ogre-sprites stance-${stance}" viewBox="0 0 420 290" role="img" aria-label="Armored green ogre ${stance==='rest'?'holding his club':stance==='high'?'raising his club overhead':'preparing a swing on your '+stance}. Watch his nose for the snort.">
 <defs><radialGradient id="ogre-room-light"><stop stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#090507" stop-opacity=".48"/></radialGradient><pattern id="ogre-red-brick" width="420" height="256" patternUnits="userSpaceOnUse"><rect width="420" height="256" fill="#19060c"/>${redMasonry}</pattern><pattern id="ogre-cobbles" width="128" height="64" patternUnits="userSpaceOnUse"><image href="assets/ogre-room/cobblestone-v1.png" width="128" height="64" preserveAspectRatio="none" style="image-rendering:pixelated"/></pattern></defs>
 <rect width="420" height="225" fill="url(#ogre-red-brick)"/><path d="M0 225H420V290H0Z" fill="url(#ogre-cobbles)"/><path d="M0 225H420" stroke="#160b0d" stroke-width="4"/><rect width="420" height="290" fill="url(#ogre-room-light)"/><path d="M76 61v12" stroke="#1b1315" stroke-width="4"/><image href="assets/ogre-room/shield-v1.png" x="43" y="70" width="68" height="69" style="image-rendering:pixelated" role="img" aria-label="Round iron shield hanging on the left wall"/><ellipse cx="210" cy="264" rx="95" ry="8" fill="#080607" opacity=".7"/>
 ${frame('idle',0,'ogre-idle')}${frame('attack',col,'ogre-preparation')}${frame('snort',col,'ogre-snort')}${frame('swing',col,'ogre-follow-through')}

 <text x="210" y="285" text-anchor="middle" fill="#d1ccb2" font-family="monospace" font-size="9" letter-spacing="2">${training?'WATCH THE NOSE · '+(stance==='high'?'OVERHEAD':stance.toUpperCase()):'THE SHIELD KEEPER'}</text></svg>`;
}
export function flameDiagram(angle){
 const path=angle==='left'?'M110 14V48L28 90':angle==='right'?'M110 14V48L192 90':'M110 14V48L114 17';
 return `<svg viewBox="0 0 220 112" role="img" aria-label="Flame reflected ${angle==='back'?'back to the nozzle':angle}; brazier on your right"><path d="M110 14V48" stroke="#d9ad61" stroke-width="3"/><path d="${path}" fill="none" stroke="#f1cd80" stroke-width="3"/><path d="M87 63L${angle==='left'?'130 39':angle==='right'?'130 84':'133 63'}" stroke="#d7e5dd" stroke-width="8"/><circle cx="110" cy="10" r="7" fill="#a7b7a4"/><path d="M175 94H207L200 107H182Z" fill="#b3a179"/><text x="24" y="109" fill="#a7b1a4" font-size="11">LEFT</text><text x="170" y="87" fill="#d9bc79" font-size="10">TARGET</text></svg>`;
}
