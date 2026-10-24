import {wallPixel,floorPixel} from './textures.js?v=0b62ecb75af7';
// Original vector/pixel-style gate illustration; the gate is a side-room entrance.
function surface(id,pixel){
 let cells='';
 for(let y=0;y<128;y+=2)for(let x=0;x<128;x+=2){const c=pixel(x,y);cells+=`<rect x="${x}" y="${y}" width="2" height="2" fill="rgb(${c.join(',')})"/>`;}
 return `<pattern id="${id}" width="128" height="128" patternUnits="userSpaceOnUse">${cells}</pattern>`;
}
const surfaces=`<defs>${surface('gate-stone',wallPixel)}${surface('gate-floor',floorPixel)}</defs>`;
export function ogreGateArt(){
 let boards='';for(let i=0;i<8;i++){const x=112+i*32;boards+=`<rect x="${x}" y="35" width="31" height="235" fill="${['#634526','#795430','#6d4828','#825b32'][i%4]}" stroke="#322b20" stroke-width="2"/><path d="M${x+7} 43V253M${x+23} 51V260M${x+14} 72V182" stroke="#a67b42" stroke-opacity=".4" stroke-width="2"/>`;}
 return `<svg class="gate-art" viewBox="0 0 480 300" role="img" aria-label="Ogre’s gate: heavy timber planks with dark iron braces, rivets and a ring handle, set in gray stone walls above a moss-green tiled floor.">${surfaces}<rect width="480" height="300" fill="url(#gate-stone)"/><rect width="480" height="300" fill="#000" opacity=".23"/><path d="M0 0H480L402 22H78Z" fill="#1c1c1c"/><path d="M0 300L80 260H400L480 300Z" fill="url(#gate-floor)"/><path d="M80 280V60Q80 9 130 9H350Q401 9 401 60V280" fill="url(#gate-stone)" stroke="#777777" stroke-width="20"/><path d="M95 280V57Q95 24 129 24H351Q385 24 385 57V280" fill="#141414" stroke="#303030" stroke-width="8"/>${boards}<path d="M111 71H369M111 226H369M122 242L358 57" stroke="#292e2a" stroke-width="18"/><path d="M111 65H369M111 220H369" stroke="#798079" stroke-width="2"/>${[125,164,204,244,284,324,356].map(x=>`<circle cx="${x}" cy="71" r="3" fill="#8d9187"/><circle cx="${x}" cy="226" r="3" fill="#8d9187"/>`).join('')}<path d="M240 34V270" stroke="#26291f" stroke-width="4"/><rect x="254" y="132" width="22" height="37" fill="#282d27" stroke="#7b7e6c"/><circle cx="265" cy="154" r="10" fill="none" stroke="#a5a58a" stroke-width="4"/><text x="240" y="292" text-anchor="middle" fill="#bdb18c" font-family="monospace" font-size="10" letter-spacing="3">THE SHIELD KEEPER’S GATE</text></svg>`;
}
