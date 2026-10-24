export const WIZARD='2,0';
export const LENS='Revealing lens';
export const wizardNotes=[
 'The wizard’s enchanted mask makes only false factual statements. A false claim rules out what it names; one remaining alternative is certain only when every other possibility is excluded.',
 'Use the revealing lens to expose hidden inscriptions. Revealed writing is physical evidence, independent of a speaker’s claims.'
];
export const freshWizard=()=>({phase:'intro',completed:false,returnTo:null});
export function wizardAct(s,action){
 const w=s.wizard,p=w.phase;
 if(action==='leave'){s.encounter=null;s.message='The wizard returns to his notes. Your deductions are retained.';return s;}
 if(action==='w-begin' && p==='intro')w.phase='one';
 if(action==='w-more' && p==='one'){w.phase='two';s.message='“Exactly. Not moon leaves TWO possibilities. Ask for evidence, not permission to guess.”';}
 if(action==='w-ack' && p==='uncertain')w.phase='one';
 if(action==='w-ack' && p==='error'){w.phase=w.returnTo;w.returnTo=null;}
 if(action==='w-ack' && p==='reason-error')w.phase='reason';
 if(p==='one' && ['w-moon','w-crown','w-sun'].includes(action)){
   w.phase='uncertain';s.message=action==='w-moon'?'The mask’s claim is false, so the key cannot be in the moon compartment.':'That might be right, but the evidence does not prove it. Both sun and crown are still possible.';
 }
 if(p==='two' && action==='w-sun')w.phase='reason';
 if(p==='two' && ['w-moon','w-crown'].includes(action)){
   w.phase='error';w.returnTo='two';s.health--;s.message='The seal gives your fingers a sharp magical sting. Both mask statements are false: moon is excluded, and crown is excluded. Only sun remains.';
   if(s.health===0){s.health=3;s.pos=s.checkpoint;s.facing=0;s.encounter=null;s.message='The lantern restores your health. Your items, map, ogre training, and wizard deductions are retained.';}
 }
 if(p==='reason' && action==='w-proof')w.phase='lens';
 if(p==='reason' && ['w-opposite','w-lucky'].includes(action)){w.phase='reason-error';s.message='“A lie has no single opposite when there are three choices. The two separate false claims exclude moon and crown. That leaves sun.”';}
 if(p==='lens' && action==='w-look')w.phase='reveal';
 if(p==='reveal' && action==='w-read'){
   w.completed=true;w.phase='done';s.items=[...new Set([...s.items,LENS])];s.knowledge=[...new Set([...s.knowledge,...wizardNotes])];s.message='Revealing lens earned. The wizard’s deductions are recorded in your journal.';
 }
 return s;
}
export function wizardView(s){
 const p=s.wizard.phase;
 const retreat=['Return to the passages','leave'];
 const pick=[['Open moon','w-moon'],['Open crown','w-crown'],['Open sun','w-sun']];
 const rules='Exactly one brass key is hidden in one of three compartments: moon, crown, or sun. The key stays in place throughout this test. Every factual statement spoken by the enchanted mask is false. The wizard and the written rules are reliable.';
 const views={
 intro:{title:'A most inconvenient truth.',text:'A wizard polishes a lens beside a floating mask. “My assistant is incapable of telling the truth. Remarkably useful, once you stop expecting it to be helpful.” He gestures at three sealed compartments. “Prove you know what a lie actually tells you, and this lens is yours.”',choices:[['Examine the test','w-begin'],retreat]},
 one:{title:'One lie. Two possibilities.',text:rules,claim:'“The key is in the moon compartment.”',choices:[...pick,['There isn’t enough evidence. Ask for another statement.','w-more'],retreat]},
 uncertain:{title:'Possible is not proven.',text:s.message+' The wizard leaves the compartments sealed. No health is lost for exploring the logic.',choices:[['Reconsider the evidence','w-ack'],retreat]},
 two:{title:'Now follow the evidence.',text:rules+' The mask adds a second claim. Both statements remain available below.',claim:'“The key is in the moon compartment.”\n“The key is in the crown compartment.”',choices:[...pick,retreat]},
 reason:{title:'The sun seal opens.',text:'A brass key rests inside. The wizard holds up a finger. “Before you take the lens: why was that conclusion certain?”',choices:[['Both false claims exclude moon and crown; only sun remains.','w-proof'],['Sun is always the opposite of moon.','w-opposite'],['A lucky guess is as good as a proof.','w-lucky'],retreat]},
 'reason-error':{title:'Explain what you know.',text:s.message+' There is no health penalty for discussing your reasoning.',choices:[['Try the explanation again','w-ack'],retreat]},
 error:{title:'The seal resists.',text:s.message+' One health lost. The wizard keeps your evidence on the table.',choices:[['Review the two claims','w-ack'],retreat]},
 lens:{title:'Evidence beyond words.',text:'The wizard lends you his lens. “One final demonstration. This plaque looks blank. Glass does not make the mask truthful; it lets you examine something the mask cannot talk away.” Raise the lens over the plaque.',choices:[['Look through the lens','w-look'],retreat]},
 reveal:{title:'The inscription appears.',text:'Through the lens, lettering emerges from the blank stone. Read the revealed inscription to finish the lesson.',inscription:'TRUST WHAT THE EVIDENCE PROVES.',choices:[['Read the inscription and accept the lens','w-read'],retreat]},
 done:{title:'A clearer view.',text:'“Take it. And remember: a false answer may leave more than one possibility.” The revealing lens is yours. Your journal records the rules of the mask and how to reveal hidden writing.',choices:[retreat]}
 };
 return views[p];
}
export function wizardArt(s){
 const reveal=['reveal','done'].includes(s.wizard.phase);
 return `<svg class="wizard-art" viewBox="0 0 480 240" role="img" aria-label="Wizard in violet robes, a floating enchanted mask, and moon, crown and sun compartments. ${reveal?'A lens reveals writing on a stone plaque.':''}">
 <defs><radialGradient id="wglow"><stop stop-color="#4e4165"/><stop offset="1" stop-color="#141c1b"/></radialGradient></defs><rect width="480" height="240" fill="url(#wglow)"/>
 <path d="M36 217L66 103H135L165 217Z" fill="#685a87" stroke="#b4a1cb"/><path d="M56 74L104 12L143 79Z" fill="#7a679a" stroke="#b4a1cb"/><path d="M55 77H145" stroke="#c5b191" stroke-width="7"/><ellipse cx="101" cy="100" rx="30" ry="29" fill="#b9ac88"/><path d="M75 111L101 164L129 110" fill="#ded6bd"/><path d="M82 94H94M108 94H120" stroke="#3f3549" stroke-width="4"/><circle cx="142" cy="169" r="24" fill="#b4d5ca" fill-opacity=".4" stroke="#d8c296" stroke-width="5"/><path d="M126 190L111 214" stroke="#d8c296" stroke-width="7"/>
 <path d="M328 25Q366 9 401 26L394 75Q365 107 336 75Z" fill="#b5a879" stroke="#e1d5ab" stroke-width="2"/><path d="M341 46L353 41M374 41L387 46" stroke="#3b304b" stroke-width="4"/><path d="M348 76Q365 56 382 76" fill="none" stroke="#4b3d56" stroke-width="3"/>
 <path d="M188 211H456" stroke="#b4a075" stroke-width="4"/>
 ${['☾','♛','☼'].map((x,i)=>`<rect x="${193+i*86}" y="130" width="72" height="76" rx="5" fill="#302c3d" stroke="#9b8aac"/><text x="${229+i*86}" y="168" text-anchor="middle" fill="#e7d5a6" font-size="28">${x}</text><text x="${229+i*86}" y="192" text-anchor="middle" fill="#d3cdbb" font-size="10">${['MOON','CROWN','SUN'][i]}</text>`).join('')}
 ${['lens','reveal','done'].includes(s.wizard.phase)?`<rect x="185" y="55" width="118" height="49" fill="#33423c" stroke="#afbea0"/><text x="244" y="83" text-anchor="middle" fill="#e4d9b1" font-size="12">${reveal?'EVIDENCE':'BLANK STONE'}</text>`:''}</svg>`;
}
