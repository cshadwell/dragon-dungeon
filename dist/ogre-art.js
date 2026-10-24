// Original geometric study; player-relative stance and paths are also described in text.
export function ogreArt(s){
 const phase=s.encounter,round=s.ogre.round,training=['brief','stance','hint','hurt','tutorial'].includes(phase),stance=phase==='tutorial'?'high':phase==='success'?['high','left','right'][Math.max(0,round-1)]:training?['high','left','right'][round]:'rest';
 const club=stance==='high'?'<path d="M167 32 L252 32"/>':stance==='left'?'<path d="M145 163 L65 110"/>':stance==='right'?'<path d="M275 163 L355 110"/>':'<path d="M286 174 L318 241"/>';
 const flame=phase.startsWith('flame')||phase==='reward';
 return `<svg class="ogre-art stance-${stance}" viewBox="0 0 420 290" role="img" aria-label="${training?`Ogre holding a padded club ${stance==='high'?'overhead':'on your '+stance}.`:'A broad green ogre with a padded club and polished shield.'}">
 <defs><radialGradient id="oglow"><stop stop-color="#71633b"/><stop offset="1" stop-color="#17201b"/></radialGradient><linearGradient id="metal"><stop stop-color="#a5b7ad"/><stop offset=".5" stop-color="#e5e6c6"/><stop offset="1" stop-color="#768b84"/></linearGradient></defs>
 <rect width="420" height="290" fill="#111b17"/><path d="M30 270V95Q30 20 110 20H310Q390 20 390 95V270" fill="url(#oglow)" stroke="#3e493b" stroke-width="8"/>
 <path d="M25 254H395M50 70H125M295 70H370M45 152H98M323 152H375" stroke="#72704b" opacity=".3"/>
 <ellipse cx="210" cy="265" rx="95" ry="12" fill="#0b120e"/>
 <path d="M163 220L153 264H190L203 228M222 228L229 264H267L254 218" fill="#596c45" stroke="#15251a" stroke-width="3"/>
 <path d="M150 124Q114 132 118 183L155 210H265L301 183Q306 132 268 124Z" fill="#738557" stroke="#263824" stroke-width="3"/>
 <path d="M158 127L166 192H254L262 127L243 139H181Z" fill="#544832"/>
 <path d="M154 185L144 235H276L264 185Z" fill="#443e2e" stroke="#83724b" stroke-width="2"/>
 <path d="M159 201H263" stroke="#c4a867" stroke-width="8"/><rect x="199" y="192" width="24" height="18" rx="3" fill="#b7a06c"/>
 <path d="M170 62Q210 42 249 65L257 107Q251 140 212 143Q172 140 165 109Z" fill="#8c9d68" stroke="#263824" stroke-width="3"/>
 <path d="M170 80L150 75L163 102M249 80L272 75L259 103" fill="#879761" stroke="#263824" stroke-width="3"/>
 <path d="M179 83L196 79M225 79L243 84" stroke="#35422a" stroke-width="5"/>
 <ellipse cx="190" cy="91" rx="4" ry="5" fill="#e9dba4"/><ellipse cx="233" cy="91" rx="4" ry="5" fill="#e9dba4"/>
 <g class="ogre-nose"><path d="M207 96L198 111Q211 117 224 111L217 96Z" fill="#8b9d65" stroke="#415030" stroke-width="2"/><ellipse cx="204" cy="109" rx="3" ry="2" fill="#293522"/><ellipse cx="217" cy="109" rx="3" ry="2" fill="#293522"/></g><g class="snort-breath" fill="#e5ead6"><ellipse cx="184" cy="119" rx="16" ry="7"/><ellipse cx="238" cy="119" rx="16" ry="7"/><text x="210" y="165" text-anchor="middle" font-size="19" font-weight="bold" letter-spacing="3">SNORT!</text></g><path d="M186 119Q211 ${phase==='hurt'?120:136} 239 117" fill="none" stroke="#31412b" stroke-width="3"/>
 <path d="M184 121L185 108L194 124M230 124L240 108L239 121" fill="#e6dcaf"/>
 ${stance==='high'?'<path d="M135 160L143 74L168 43M285 160L278 74L252 43" fill="none" stroke="#80945d" stroke-width="24" stroke-linecap="round"/>':stance==='left'?'<path d="M133 169L125 145L104 138" fill="none" stroke="#80945d" stroke-width="22" stroke-linecap="round"/>':stance==='right'?'<path d="M285 169L295 145L318 138" fill="none" stroke="#80945d" stroke-width="22" stroke-linecap="round"/>':''}
 <g class="ogre-club" fill="none" stroke="#b4aa86" stroke-width="23" stroke-linecap="round">${club}</g><g fill="none" stroke="#e0d6ad" stroke-width="2" stroke-dasharray="4 7">${club}</g>
 ${flame?'<path d="M50 237H105L96 259H59Z" fill="#b7a16a"/><path d="M326 237H380L370 259H337Z" fill="#b7a16a"/>'+ (phase==='reward'?'<path d="M341 236Q330 215 351 201Q346 218 363 223L361 237Z" fill="#e9bb65"/>':''):'<path d="M45 205L78 194L110 205V235Q95 256 78 263Q58 253 45 235Z" fill="url(#metal)" stroke="#e0d5a8" stroke-width="3"/>'}
 <text x="210" y="283" text-anchor="middle" fill="#b5b497" font-size="10" letter-spacing="3">${training?'YOUR VIEW · '+(stance==='high'?'OVERHEAD':'CLUB ON YOUR '+stance.toUpperCase()):'THE SHIELD KEEPER'}</text></svg>`;
}
export function flameDiagram(angle){
 const path=angle==='left'?'M110 14V48L28 90':angle==='right'?'M110 14V48L192 90':'M110 14V48L114 17';
 return `<svg viewBox="0 0 220 112" role="img" aria-label="Flame reflected ${angle==='back'?'back to the nozzle':angle}; brazier on your right"><path d="M110 14V48" stroke="#d9ad61" stroke-width="3"/><path d="${path}" fill="none" stroke="#f1cd80" stroke-width="3"/><path d="M87 63L${angle==='left'?'130 39':angle==='right'?'130 84':'133 63'}" stroke="#d7e5dd" stroke-width="8"/><circle cx="110" cy="10" r="7" fill="#a7b7a4"/><path d="M175 94H207L200 107H182Z" fill="#b3a179"/><text x="24" y="109" fill="#a7b1a4" font-size="11">LEFT</text><text x="170" y="87" fill="#d9bc79" font-size="10">TARGET</text></svg>`;
}
