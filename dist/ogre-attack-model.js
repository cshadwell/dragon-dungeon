// Isolated playtest rules. No maze state, inventory, or persistence dependencies.
export const ATTACK_DEFAULTS=Object.freeze({practice:Object.freeze({passMs:1500,targetWidth:.20}),challenge:Object.freeze({passMs:1000,targetWidth:.10})});
export const PRACTICE_NEXT=Object.freeze({passMs:1250,targetWidth:.15});
export function targetForAttempt(attempt){return [.5,.75,.25,.65,.35][attempt%5];}
export function attackPosition(elapsed,passMs,passes=3){const travel=Math.max(0,Math.min(passes,elapsed/passMs)),whole=Math.floor(travel),fraction=travel-whole,pass=Math.min(passes,whole+1);return {position:travel>=passes?passes%2:whole%2===0?fraction:1-fraction,pass,expired:travel>=passes};}
export function judgeAttack(elapsed,{passMs,targetWidth,targetCenter=.5,passes=3}){const sample=attackPosition(elapsed,passMs,passes);if(sample.expired)return {...sample,result:'hesitation'};const distance=Math.abs(sample.position-targetCenter),epsilon=1e-9;return {...sample,result:distance<=targetWidth/6+epsilon?'perfect':distance<=targetWidth/2+epsilon?'hit':'miss'};}

export function reactionPose(mode,result,attempt){if(mode==='practice')return result==='perfect'?11:9;return result==='hit'||result==='perfect'?12+(attempt-1)%4:result==='miss'?4+(attempt-1)%4:9;}
