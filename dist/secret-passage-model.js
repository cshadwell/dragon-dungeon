export const SECRET_ENTRANCE=Object.freeze({pos:'34,43',facing:1,wallX:35,wallY:43,side:0,step:1});
export const FINALE_URL='https://cshadwell.github.io/makers-last-echo/';
export const SECRET_APPROACH_MESSAGE='A familiar eye stares back at you. You hear faint music playing from behind the wall. The urge to reach out and touch it is overpowering.';
const MELODY=Object.freeze(['E4','B4','A4','G4','E4','C5','B4']);
const LOWER_MELODY=Object.freeze(['E3','B3','A3','G3','E3','C4','B3']);
export const matchesSecretMelody=notes=>notes.length===7&&[MELODY,LOWER_MELODY].some(sequence=>notes.every((note,i)=>note===sequence[i]));
export function canEnterSecret(state){return state.pos===SECRET_ENTRANCE.pos&&state.facing===SECRET_ENTRANCE.facing&&!state.encounter&&!state.gate;}
export function unlockMusicalPassage(state){return {...structuredClone(state),musicalPassageUnlocked:true};}
export function createMelodyEntry(){
 let notes=[],phase='entry',generation=0;
 return {
  get notes(){return [...notes];},get phase(){return phase;},get ready(){return phase==='entry'&&notes.length===7;},
  add(pitch){if(phase!=='entry'||notes.length>=7)return false;notes.push(pitch);return true;},
  clear(){if(phase!=='entry')return false;notes=[];return true;},
  submit(){if(phase!=='entry'||notes.length!==7)return null;phase='playback';return {notes:[...notes],token:++generation};},
  complete(token){if(phase!=='playback'||token!==generation)return null;const correct=matchesSecretMelody(notes);phase=correct?'unlocked':'entry';if(!correct)notes=[];return correct;},
  retry(token){if(phase==='playback'&&token===generation){phase='entry';notes=[];}},
  cancel(){generation++;phase='closed';notes=[];}
 };
}
