import {PRACTICE_NEXT} from './ogre-attack-model.js?v=a06f70034131';
import {DEFENCE_DEFAULTS,DEFENCE_STAGES} from './elf-defence-model.js?v=a06f70034131';
import {STAGES,shuffle,makeRound,COLORS} from './wizard-mind-model.js?v=a06f70034131';
export const DRAGON_ROUNDS=Object.freeze([
 Object.freeze({goals:Object.freeze([4,6,5]),attack:PRACTICE_NEXT,defence:Object.freeze({...DEFENCE_DEFAULTS,...DEFENCE_STAGES[1]}),mind:STAGES[1],mindStage:1}),
 Object.freeze({goals:Object.freeze([5,8,6]),attack:Object.freeze({passMs:1000,targetWidth:.10}),defence:Object.freeze({...DEFENCE_DEFAULTS,...DEFENCE_STAGES[2]}),mind:STAGES[2],mindStage:2}),
 Object.freeze({goal:25,attack:Object.freeze({passMs:850,targetWidth:.07,passes:2}),defence:Object.freeze({...DEFENCE_DEFAULTS,attackSpeed:75,gap:0}),mind:Object.freeze({seconds:1.75,conflict:true,backgrounds:true}),mindStage:2})
]);
export const WARMUP=DRAGON_ROUNDS[0];
export function warmupProgress(successes,roundIndex=0){
 const goals=DRAGON_ROUNDS[roundIndex].goals,total=goals.reduce((a,b)=>a+b,0),count=Math.max(0,Math.min(total,successes));
 const stage=count<goals[0]?0:count<goals[0]+goals[1]?1:2;
 const start=stage===0?0:stage===1?goals[0]:goals[0]+goals[1];
 return {phase:['attack','defence','mind'][stage],hits:Math.min(goals[stage],count-start),goal:goals[stage],complete:count===total};
}

export const DRAGON_REACTIONS=Object.freeze({hit:Object.freeze([16,18,19]),miss:Object.freeze([15,6,20])});
export function chooseDragonReaction(correct,random=Math.random){const poses=DRAGON_REACTIONS[correct?'hit':'miss'];return poses[Math.floor(random()*poses.length)];}
export function freshDragonMeter(){return {level:10,streak:0};}
export function updateDragonMeter(meter,outcome){
 const miss=outcome===false||outcome==='miss';
 return {level:Math.max(0,Math.min(10,meter.level+(miss?-1:outcome==='perfect'?1:0))),streak:0};
}
// Full10 through empty0 now uses every supplied illustration.
export function dragonGaugeFrame(level){return 10-Math.max(0,Math.min(10,level));}

// Shuffle complete defense volleys as units, never splitting their three blocks.
export function makeFinalSchedule(random=Math.random){
 const units=[...Array(8).fill('attack'),...Array(8).fill('mind'),...Array(3).fill('defence')];
 let ordered;
 for(let attempt=0;attempt<100;attempt++){
  ordered=shuffle(units,random);
  if(ordered.every((kind,i)=>(kind!=='defence'||ordered[i-1]!=='defence')&&!(i>1&&kind===ordered[i-1]&&kind===ordered[i-2])))break;
  ordered=null;
 }
 if(!ordered){ordered=Array.from({length:16},(_,i)=>i%2?'mind':'attack');for(const index of [14,8,2])ordered.splice(index,0,'defence');}
 return ordered.flatMap(kind=>kind==='defence'?[kind,kind,kind]:[kind]);
}
export function finalProgress(successes,schedule){
 const count=Math.max(0,Math.min(25,successes));
 return {phase:schedule[Math.min(24,count)],hits:count,goal:25,complete:count===25};
}
export function finalDefenceAngle(shield,attempt,random=Math.random){return attempt===1?(shield+(random()-.5)*20+360)%360:random()*360;}
export function makeFinalMindRound(random=Math.random,previousColor=null){
 const round=makeRound(2,random,previousColor),used=new Set();
 return {...round,seconds:1.75,choices:round.choices.map(choice=>{
  const available=COLORS.filter(c=>c!==choice.word&&c!==choice.ink&&!used.has(c));
  const background=available[Math.floor(random()*available.length)];used.add(background);return {...choice,background};
 })};
}
