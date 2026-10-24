// Initial timings estimated from the user's Double Dungeons recording, not original code.
export const MOTION={stepMs:180,turnMs:320,fps:30};
export function navigationChanged(a,b){return a.pos!==b.pos||a.facing!==b.facing;}
export function transitionPose(from,to,action,progress){
 const t=Math.max(0,Math.min(1,progress));
 const [x,y]=from.pos.split(',').map(Number),[nx,ny]=to.pos.split(',').map(Number);
 // Keep the commanded direction at 0/3 wrap, rather than spinning 270 degrees.
 const turn=action==='left'?-1:action==='right'?1:0;
 return {x:x+.5+(nx-x)*t,y:y+.5+(ny-y)*t,angle:(from.facing+turn*t)*Math.PI/2};
}
export function motionDuration(action){return action==='left'||action==='right'?MOTION.turnMs:MOTION.stepMs;}
