// Stable supplied spell-pose IDs; all three options share the indicated spell color.
export const WIZARD_SPELL_POSES=Object.freeze(Object.fromEntries(Object.entries({blue:[14,15,16],green:[17,18,19],orange:[20,21,22],purple:[23,24,25],red:[26,27,28],white:[29,30,31],yellow:[32,33,34]}).map(([color,ids])=>[color,Object.freeze(ids)])));
export function chooseWizardSpellPose(color,random=Math.random){const poses=WIZARD_SPELL_POSES[color];if(!poses)throw new RangeError('Unknown spell color: '+color);return poses[Math.floor(random()*poses.length)];}
