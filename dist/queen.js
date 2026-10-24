export const QUEEN='2,4', SEAL='Queen’s seal';
export const queenNotes=[
 'Observe before approaching. Raised thorns and a guarded injury signal fear; distance and an open hand can earn trust. Help only once the creature invites it.',
 'Recognize surrender: thorns folded, head lowered, path opened. Stop pressing once resistance ends. The queen’s seal can release an ancient binding.'
];
export const freshQueen=()=>({phase:'intro',completed:false,observed:false,returnTo:null,feedback:''});
export function queenAct(s,action){
 const q=s.queen,p=q.phase;
 if(action==='leave'){s.encounter=null;s.message='The queen waits beneath the roots. Your discoveries and the creature’s trust are retained.';return s;}
 if(p==='intro'&&action==='q-begin')q.phase='guarded';
 if(['guarded','threatened'].includes(p)&&action==='q-observe'){q.observed=true;q.phase='observed';}
 if(['guarded','observed','threatened'].includes(p)&&action==='q-step-back')q.phase='calm';
 if(['guarded','observed','calm'].includes(p)&&action==='q-threaten'){q.phase='threatened';q.feedback='The creature curls around its damaged branch. Every thorn lifts toward you. Threatening it has made it more defensive.';}
 if(['guarded','observed','threatened'].includes(p)&&action==='q-reach'){
   q.phase='hurt';q.returnTo='observed';q.observed=true;q.feedback='You reach past the raised thorns. They lash your hand. The creature is shielding a split branch, not inviting touch.';s.health--;
   if(s.health===0){s.health=3;s.pos=s.checkpoint;s.facing=0;s.encounter=null;s.message='The lantern restores your health. All items, creature encounters, and discoveries are retained.';}
 }
 if(p==='hurt'&&action==='q-ack'){q.phase=q.returnTo;q.returnTo=null;}
 if(p==='calm'&&action==='q-observe'){q.observed=true;q.phase='calm-observed';}
 if(p==='calm'&&action==='q-offer'){q.observed=true;q.phase='invited';}
 if(['observed','calm-observed'].includes(p)&&action==='q-offer'){q.phase=p==='observed'?'offer-wait':'invited';}
 if(p==='offer-wait'&&action==='q-step-back')q.phase='invited';
 if(['calm','calm-observed'].includes(p)&&action==='q-wait'){q.observed=true;q.phase='invited';}
 if(p==='invited'&&action==='q-mend')q.phase='yielded';
 if(p==='invited'&&action==='q-wait'){q.feedback='The creature holds its branch toward you. It is asking for help; waiting longer will not mend the split.';q.phase='waiting';}
 if(p==='waiting'&&action==='q-return')q.phase='invited';
 if(p==='yielded'&&action==='q-restraint'){
   q.phase='done';q.completed=true;s.items=[...new Set([...s.items,SEAL])];s.knowledge=[...new Set([...s.knowledge,...queenNotes])];s.message='Queen’s seal earned. The lesson of restraint is recorded in your journal.';
 }
 if(p==='yielded'&&action==='q-press'){q.phase='overreach';q.feedback='The creature flinches and draws its mended branch back. The queen raises a hand. “It had already yielded. Look at what changed before you demand more.”';}
 if(p==='overreach'&&action==='q-apologize')q.phase='yielded';
 return s;
}
export function queenView(s){
 const q=s.queen,p=q.phase,leave=['Return to the passages','leave'];
 const observe=['Observe the creature','q-observe'],back=['Step back and lower your hands','q-step-back'],reach=['Reach through the raised thorns','q-reach'];
 const views={
 intro:{title:'The court beneath the roots.',text:'The elf queen waits beyond a creature woven from living branches. Its thorns bar the path. Beside it lie clean linen strips. “You have come for my seal,” she says. “First, show me how you meet resistance.”',choices:[['Approach the thorn guardian','q-begin'],leave]},
 guarded:{title:'A wall of thorns.',text:'The creature huddles low. Its thorns point outward, tracking your hands. Each time you move closer, it draws one branch tight against its body.',choices:[observe,back,['Threaten it into moving','q-threaten'],reach,leave]},
 observed:{title:'What it protects.',text:'A deep split runs through the branch it is guarding. Its thorns rise whenever your hand nears the injury. It watches you with fear. The clean linen could support the split, if it allowed you close.',choices:[back,['Offer the linen without approaching','q-offer'],reach,leave]},
 threatened:{title:'Fear answers force.',text:q.feedback+' It has not yielded. The queen remains silent, watching your next choice.',choices:[observe,back,reach,leave]},
 calm:{title:'Room to breathe.',text:'With space between you, the outer thorns settle. The creature loosens its grip on a branch with a visible split. Its eyes follow the clean linen strips beside the roots.',choices:[observe,['Hold out the linen and let it choose','q-offer'],['Wait with open hands','q-wait'],['Demand that it clear the path','q-threaten'],leave]},
 'calm-observed':{title:'An invitation takes patience.',text:'You can now see the split clearly. The creature glances between your open hand and the linen. Its thorns are settling, but it has not yet offered the injured branch.',choices:[['Offer the linen without approaching','q-offer'],['Wait with open hands','q-wait'],leave]},
 'offer-wait':{title:'Help at a distance.',text:'It watches the linen, but its thorns remain raised. You have offered something useful; it still needs space to choose whether to trust you.',choices:[back,leave]},
 invited:{title:'The branch comes to you.',text:'The creature unfolds its thorns away from your hands and gently extends the split branch. It holds still beside the linen. This is an invitation to help.',choices:[['Support the split with the linen','q-mend'],['Keep waiting','q-wait'],leave]},
 waiting:{title:'A request, not a threat.',text:q.feedback,choices:[['Return to the offered branch','q-return'],leave]},
 hurt:{title:'Too close, too soon.',text:q.feedback+' One health lost. Give it space before approaching again.',choices:[['Reconsider the injury','q-ack'],leave]},
 yielded:{title:'The way is open.',text:'You bind the split gently. The creature folds every thorn against its body, lowers its head, and steps aside. The path to the queen is open. Nothing bars your way now.',choices:[['Lower your hands and pass peacefully','q-restraint'],['Demand that it kneel as well','q-press'],leave]},
 overreach:{title:'It had already yielded.',text:q.feedback+' No health is lost; the mending remains intact.',choices:[['Step back and acknowledge its surrender','q-apologize'],leave]},
 done:{title:'The strength to stop.',text:'“You saw the fear beneath the thorns, and knew when resistance had ended.” The queen places her seal in your hand. “It can release an ancient binding. Remember: once the way is open, you need not force it wider.”',choices:[leave]}
 };
 return views[p];
}
export function queenArt(s){
 const p=s.queen.phase,calm=['calm','calm-observed','invited','waiting','yielded','overreach','done'].includes(p),yielded=['yielded','overreach','done'].includes(p);
 return `<svg class="queen-art" viewBox="0 0 480 240" role="img" aria-label="Elf queen beneath tree roots and a thorn guardian. ${yielded?'Its branch is mended, thorns folded, head lowered and path open.':calm?'Its thorns are settling; a split branch is visible.':'Raised thorns protect a split branch.'}"><rect width="480" height="240" fill="#15241f"/><path d="M15 0Q65 90 22 240M465 0Q390 100 459 240M20 25Q200 -5 460 30" fill="none" stroke="#465a3b" stroke-width="25"/><path d="M48 226Q180 188 430 224" fill="none" stroke="#6b7751" stroke-width="9"/>
 <path d="M69 213L91 96H136L161 213Z" fill="#527b65" stroke="#b4c99e"/><ellipse cx="114" cy="80" rx="23" ry="28" fill="#d0bd93"/><path d="M89 67L80 40L103 51L114 29L125 51L148 40L139 67Z" fill="#c0ad70"/><path d="M90 80L77 71L90 92M137 80L151 71L136 92" fill="#d0bd93"/><path d="M100 80H105M123 80H128" stroke="#354536" stroke-width="3"/>
 <path d="M260 210L276 157L326 133L367 165L387 211M277 160L252 123L270 90M327 138L319 93L342 69M367 165L398 132L393 106" fill="none" stroke="#88996b" stroke-width="13" stroke-linecap="round"/>
 <circle cx="320" cy="${yielded?166:133}" r="28" fill="#657c53"/><circle cx="310" cy="${yielded?167:130}" r="3" fill="#d5d6a2"/><circle cx="330" cy="${yielded?167:130}" r="3" fill="#d5d6a2"/>
 ${calm?'':'<path d="M257 136L232 120L252 151M337 94L357 83L338 111M381 152L414 153L391 169" fill="#b5bb89"/>'}
 <path d="M278 158L302 188L284 196" fill="none" stroke="#b4a373" stroke-width="7"/>
 ${yielded?'<path d="M279 174L299 169M284 181L303 177M288 188L305 184" stroke="#e4dcc0" stroke-width="6"/>':'<path d="M284 170L291 178L284 185" fill="none" stroke="#e4c69b" stroke-width="3"/>'}
 <path d="M198 206H230M199 212H231" stroke="#e4dcc0" stroke-width="6"/><text x="240" y="234" text-anchor="middle" fill="#bdc7a6" font-size="10" letter-spacing="2">${yielded?'THORNS FOLDED · PATH OPEN':calm?'THORNS SETTLING':'THORNS RAISED'}</text></svg>`;
}
