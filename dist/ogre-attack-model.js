// Isolated playtest rules. No maze state, inventory, or persistence dependencies.
export const ATTACK_DEFAULTS=Object.freeze({practice:Object.freeze({passMs:1500,targetWidth:.20}),challenge:Object.freeze({passMs:1000,targetWidth:.10})});
export const PRACTICE_NEXT=Object.freeze({passMs:1250,targetWidth:.15});
export function targetForAttempt(attempt){return [.5,.75,.25,.65,.35][attempt%5];}
export function attackPosition(elapsed,passMs){const travel=Math.max(0,Math.min(3,elapsed/passMs)),pass=Math.min(3,Math.floor(travel)+1);return {position:travel>=3?1:pass===2?2-travel:travel-(pass-1),pass,expired:travel>=3};}
export function judgeAttack(elapsed,{passMs,targetWidth,targetCenter=.5}){const sample=attackPosition(elapsed,passMs);if(sample.expired)return {...sample,result:'hesitation'};const distance=Math.abs(sample.position-targetCenter),epsilon=1e-9;return {...sample,result:distance<=targetWidth/6+epsilon?'perfect':distance<=targetWidth/2+epsilon?'hit':'miss'};}
export function reactionPose(mode,result,attempt){if(mode==='practice')return result==='perfect'?11:9;return result==='hit'||result==='perfect'?12+(attempt-1)%4:result==='miss'?4+(attempt-1)%4:9;}
