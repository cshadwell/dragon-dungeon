// Independent pause reasons prevent closing a menu from resuming a hidden tab.
export function createPauseState(onChange=()=>{}){
 const reasons=new Set();
 return {get paused(){return reasons.size>0;},set(reason,active){const before=reasons.size>0;if(active)reasons.add(reason);else reasons.delete(reason);if(before!==(reasons.size>0))onChange(reasons.size>0);}};
}
export function installChallengePause(onChange=()=>{}){
 const state=createPauseState(onChange);
 window.addEventListener('encounter:pause',e=>state.set(e.detail.reason,e.detail.active));
 window.addEventListener('blur',()=>state.set('focus',true));window.addEventListener('focus',()=>state.set('focus',false));
 document.addEventListener('visibilitychange',()=>state.set('hidden',document.hidden));
 window.addEventListener('pagehide',()=>state.set('page',true));window.addEventListener('pageshow',()=>state.set('page',false));
 return state;
}
