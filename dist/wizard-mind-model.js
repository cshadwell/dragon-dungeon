export const COLORS=Object.freeze(['red','blue','green','orange','purple','white','yellow']);
export const STAGES=Object.freeze([{seconds:4,conflict:false,hits:3},{seconds:3,conflict:false,hits:4},{seconds:2,conflict:true,hits:5}].map(Object.freeze));
export const MIND_GOAL=12;
export function mindProgress(correct){
 const stage=correct<3?0:correct<7?1:2;
 return {stage,hits:Math.min(STAGES[stage].hits,correct-[0,3,7][stage]),complete:correct>=MIND_GOAL};
}
export function shuffle(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function makeRound(stage,random=Math.random,previousColor=null){
 const availableColors=COLORS.filter(color=>color!==previousColor);
 const answer=availableColors[Math.floor(random()*availableColors.length)];
 const words=shuffle([answer,...shuffle(COLORS.filter(c=>c!==answer),random).slice(0,3)],random);
 const used=new Set();
 const choices=words.map(word=>{const available=COLORS.filter(c=>c!==word&&!used.has(c));const ink=STAGES[stage].conflict?available[Math.floor(random()*available.length)]:word;used.add(ink);return {word,ink};});
 return {answer,seconds:STAGES[stage].seconds,choices};
}
export function judge(round,word,elapsed){return elapsed>=round.seconds?'timeout':word===round.answer?'correct':'wrong';}
