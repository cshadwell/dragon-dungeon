import {SHIELD} from './ogre.js?v=6d789c038015';import {LENS} from './wizard.js?v=6d789c038015';import {SEAL} from './queen.js?v=6d789c038015';
export const DRAGON='4,2';
// Approved final name from the supplied golden plaque.
export const NAME_CONFIG={name:'CHAZ',placeholder:false};
export const freshDragon=()=>({phase:'intro',discovered:false,victory:false,name:null,placeholder:null,returnTo:null,feedback:''});
export const missing=s=>[SHIELD,LENS,SEAL].filter(x=>!s.items.includes(x));
export function dragonAct(s,action){
 const d=s.dragon,p=d.phase;
 if(action==='leave'){s.encounter=null;s.message='You withdraw from the chamber. Your progress and the lantern passage remain available.';return s;}
 if(action==='d-return'){s.encounter=null;s.pos=s.checkpoint;s.facing=0;s.message='The lantern passage carries you safely back. It can return you to the dragon from here.';return s;}
 if(action==='d-begin'&&p==='intro'&&!missing(s).length)d.phase='aim';
 if(p==='aim'&&action==='d-right')d.phase='breath';
 if(p==='aim'&&['d-left','d-back'].includes(action)){d.phase='aim-feedback';d.feedback='The brazier stands on your right. The shield’s rightward reflection path reaches it; the other paths miss. Choose your aim before inviting the breath.';}
 if(action==='d-ack'&&p==='aim-feedback')d.phase='aim';
 if(p==='breath'&&['react-block','react-early','react-late','react-wrong'].includes(action)){
   if(action==='react-block'){d.phase='ward';s.message='Your high guard catches the breath and the prepared angle turns it into the brazier. The chamber ward breaks.';}
   else dragonHurt(s,'breath',{'react-early':'Too early. Wait until the nostrils flare and embers appear.','react-late':'Too late. Block as the embers flare.','react-wrong':'The breath comes straight at your upper body. Use the high guard (↑), with your shield already aimed at the right brazier.'}[action]);
 }
 if(p==='hurt'&&action==='d-ack'){d.phase=d.returnTo;d.returnTo=null;}
 if(p==='ward'&&action==='d-lens')d.phase='seals';
 if(p==='seals'&&action==='d-sun')d.phase='yielded';
 if(p==='seals'&&['d-moon','d-crown'].includes(action))dragonHurt(s,'seals','The false claim excludes that seal. Moon and crown are both excluded by the dragon’s two false statements. The binding is beneath sun.');
 if(p==='yielded'&&action==='d-press'){d.phase='restraint-feedback';d.feedback='The dragon recoils as you raise the shield again. Its wings were already folded, its head lowered, and its flame extinguished. The threat had ended. Lower your guard before using the seal.';}
 if(p==='restraint-feedback'&&action==='d-ack')d.phase='yielded';
 if(p==='yielded'&&action==='d-release'){
   d.phase='victory';d.victory=true;d.name=NAME_CONFIG.name;d.placeholder=NAME_CONFIG.placeholder;
   s.message='The binding falls away. Its stone tablet reveals the name independently of the dragon’s voice.';
 }
 return s;
}
function dragonHurt(s,returnTo,feedback){const d=s.dragon;d.phase='hurt';d.returnTo=returnTo;d.feedback=feedback;s.health--;s.message=feedback;
 if(s.health===0){s.health=3;s.pos=s.checkpoint;s.facing=0;s.encounter=null;s.message='The lantern restores your health. All discoveries and completed dragon phases are retained. Use Return to dragon to resume.';}}
export function dragonView(s){
 const d=s.dragon,p=d.phase,retreat=['Use the lantern passage to retreat','d-return'];
 const views={
 intro:{title:'The keeper of the name.',text:'An iron-bound dragon coils around a stone tablet. A lantern passage opens behind you, linking this chamber to your checkpoint. An ancient inscription reads: “The bound dragon’s every spoken factual claim is false. Trust observed actions and revealed stone.” This rule comes from the inscription, not the dragon.',claim:'“Your shield cannot turn my fire.”',choices:missing(s).length?[retreat]:[['Prepare the polished shield','d-begin'],retreat]},
 aim:{title:'Turn its strength aside.',text:'A warded brazier stands to YOUR RIGHT. Recall the ogre’s flame lesson. Set the reflection path before confronting the breath. This preparation is untimed.',choices:[['Aim the reflected flame left','d-left'],['Aim the reflected flame right, into the brazier','d-right'],['Reflect it back toward the dragon','d-back'],retreat]},
 'aim-feedback':{title:'Follow the reflection path.',text:d.feedback,choices:[['Reconsider the shield angle','d-ack'],retreat]},
 breath:{title:'Watch for its tell.',text:'The shield is angled toward the right brazier. The dragon draws a breath. An inscription beside a scorched shield shows the tell: nostrils flare, then embers spill out before fire follows. Start when ready. Wait for EMBERS, then press ↑ or tap Guard high. The prepared angle will redirect the breath.',reaction:true,dragon:true,choices:[retreat]},
 hurt:{title:'The binding lashes back.',text:d.feedback+' One health lost. Your completed phases remain intact.',choices:[['Study this phase again','d-ack'],retreat]},
 ward:{title:'The ward breaks.',text:'The redirected flame fills the brazier. The dragon’s protective ward fractures, exposing a blank stone band with three faint outlines. Use the wizard’s lens to examine it.',choices:[['Look through the revealing lens','d-lens'],retreat]},
 seals:{title:'Two lies. One binding.',text:'The lens reveals moon, crown and sun seals. The stone states that exactly one holds the binding, and it stays in place. Both claims below are spoken by the dragon; both are false.',claim:'“The binding is beneath the moon.”\n“The binding is beneath the crown.”',choices:[['Touch the moon seal','d-moon'],['Touch the crown seal','d-crown'],['Touch the sun seal','d-sun'],retreat]},
 yielded:{title:'It has yielded.',text:'The sun seal loosens the chains. The dragon folds its wings, lowers its head, and lets the last flame die. Its claws uncurl away from the tablet. The binding is exposed. Remember the queen: once resistance ends, stop pressing. Her seal can now release the remaining bond.',choices:[['Lower the shield and apply the queen’s seal','d-release'],['Raise the shield and demand further submission','d-press'],retreat]},
 'restraint-feedback':{title:'Recognize what changed.',text:d.feedback,choices:[['Acknowledge its surrender','d-ack'],retreat]},
 victory:{title:'The name beneath the binding.',text:'The queen’s seal releases the bond. Letters emerge on the stone tablet, independent of anything the dragon says. This discovery is saved and can be reopened from the Earned name button or your journal.',choices:[['Return to the lantern','d-return']]}
 };
 const view={...views[p]};if(p==='intro'&&missing(s).length)view.text+=' You still need: '+missing(s).join(', ')+'. Explore and return when prepared. No health is lost for arriving early.';
 return view;
}
export function dragonArt(s){
 const d=s.dragon,yielded=['yielded','restraint-feedback','victory'].includes(d.phase);
 return `<svg class="dragon-art ${yielded?'yielded':''}" viewBox="0 0 480 240" role="img" aria-label="Iron-bound dragon. ${yielded?'Wings folded, head lowered, claws relaxed and flame extinguished.':'Its nostrils show the tell before its breath attack.'}"><rect width="480" height="240" fill="#201b1b"/><path d="M24 219Q230 184 454 219" fill="none" stroke="#63513d" stroke-width="8"/>
 <path d="M175 163L58 43L77 161L159 198M295 163L422 43L400 164L308 198" fill="${yielded?'#524736':'#724a3b'}" stroke="#a1805d" stroke-width="4" transform="${yielded?'translate(0 48) scale(1 .75)':''}"/>
 <ellipse cx="240" cy="174" rx="84" ry="43" fill="#7b7250"/><path d="M176 191Q92 228 72 184" fill="none" stroke="#8e8054" stroke-width="18"/>
 <g transform="${yielded?'translate(0 34)':''}"><path d="M195 80L181 43L215 64L261 64L296 43L282 87L278 128Q237 158 198 127Z" fill="#a39765" stroke="#564d35" stroke-width="3"/><path d="M210 93L225 98M252 98L268 93" stroke="#efcc7d" stroke-width="5"/>
 <g class="ogre-nose"><ellipse cx="239" cy="119" rx="25" ry="13" fill="#897a4e"/><ellipse cx="229" cy="119" rx="4" ry="3" fill="#31291d"/><ellipse cx="250" cy="119" rx="4" ry="3" fill="#31291d"/></g>
 <g class="snort-breath" fill="#e6b966"><circle cx="211" cy="139" r="7"/><circle cx="267" cy="139" r="7"/><text x="240" y="163" text-anchor="middle" font-size="18" font-weight="bold">EMBERS!</text></g></g>
 <path d="M185 171L293 193M183 193L296 170" stroke="#b0aaa0" stroke-width="5" stroke-dasharray="9 5" opacity="${yielded?.2:.8}"/><rect x="207" y="199" width="66" height="31" fill="#5a5b4b" stroke="#c5b88d"/><text x="240" y="220" text-anchor="middle" fill="#e4d6aa" font-size="12">${d.victory?'NAME':'BOUND'}</text></svg>`;
}
