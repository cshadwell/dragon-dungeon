import {dragonSpellPoses} from './dragon-spell-art-data.js?v=6d789c038015';
export const DRAGON_SPELL_POSES=Object.freeze(Object.fromEntries(['blue','green','orange','purple','red','white','yellow'].map(color=>[color,Object.freeze(dragonSpellPoses.filter(p=>p.color===color).map(p=>p.number))])));
export function chooseDragonSpellPose(color,random=Math.random){const poses=DRAGON_SPELL_POSES[color];if(!poses)throw new RangeError('Unknown spell color: '+color);return poses[Math.floor(random()*poses.length)];}
