// Standalone defence rules. Angles are degrees clockwise from the right.
export const DEFENCE_DEFAULTS=Object.freeze({shieldSize:50,shieldSpeed:300,attackSpeed:60});
export const DEFENCE_STAGES=Object.freeze([
 Object.freeze({attackSpeed:60,gap:.9}),Object.freeze({attackSpeed:65,gap:.4}),Object.freeze({attackSpeed:70,gap:.2})
]);
export const BLOCKS_PER_STAGE=3;
export function defenceProgress(blocks){const stage=Math.min(2,Math.floor(blocks/BLOCKS_PER_STAGE));return {stage,stageBlocks:blocks>=9?3:blocks%BLOCKS_PER_STAGE,complete:blocks>=9};}
export const ORBIT=30,SPAWN_RADIUS=91,PLAYER_RADIUS=7;
export const normalizeAngle=a=>((a%360)+360)%360;
export const angleDistance=(a,b)=>Math.abs(((normalizeAngle(a)-normalizeAngle(b)+540)%360)-180);
export function freshDefence(){return {angle:270,projectile:null,blocks:0,misses:0,result:null};}
export function spawnAttack(state,angle){return {...state,projectile:{angle:normalizeAngle(angle),radius:SPAWN_RADIUS,checked:false},result:null};}
export function stepDefence(state,seconds,input,settings){
 const direction=Number(Boolean(input.right))-Number(Boolean(input.left)),turn=direction*settings.shieldSpeed*seconds;
 const next={...state,angle:normalizeAngle(state.angle+turn),result:null};
 if(!state.projectile)return next;
 const p={...state.projectile},distance=settings.attackSpeed*seconds,previous=p.radius;p.radius=Math.max(0,p.radius-distance);
 if(!p.checked&&previous>=ORBIT&&p.radius<=ORBIT){
  p.checked=true;
  // Judge at the instant the projectile crosses the guard, not at frame end.
  const fraction=distance===0?0:(previous-ORBIT)/distance,guard=normalizeAngle(state.angle+turn*fraction);
  if(angleDistance(guard,p.angle)<=settings.shieldSize/2+1e-9){next.projectile=null;next.blocks++;next.result='block';return next;}
 }
 if(p.radius<=PLAYER_RADIUS){next.projectile=null;next.misses++;next.result='miss';return next;}
 next.projectile=p;return next;
}
