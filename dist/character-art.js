import {dragonSpellPoses} from './dragon-spell-art-data.js?v=6d789c038015';
// Stable character pose lookup. See CHARACTER_ART.md before changing this library.
import {characterPoseData} from './character-pose-data.js?v=6d789c038015';
import {wizardSpellPoses} from './wizard-spell-art-data.js?v=6d789c038015';
export const CHARACTER_POSE_COUNTS=Object.freeze({...characterPoseData.counts,wizard:34,dragon:58});
const names={'elf queen':'elf','elf-queen':'elf','elf_queen':'elf'};
const poses=[...characterPoseData.poses,...wizardSpellPoses,...dragonSpellPoses].map(p=>Object.freeze({...p,bounds:Object.freeze([...p.bounds]),url:new URL('assets/characters/approved-v2/'+p.file,import.meta.url).href}));
function characterKey(character){const input=String(character).trim().toLowerCase(),key=names[input]??input;if(!Object.hasOwn(CHARACTER_POSE_COUNTS,key))throw new RangeError('Unknown character: '+character);return key;}
export function getCharacterPose(character,number){const key=characterKey(character);if(!Number.isInteger(number)||number<1||number>CHARACTER_POSE_COUNTS[key])throw new RangeError('Unknown '+key+' pose: '+number);return poses.find(p=>p.character===key&&p.number===number);}
export function listCharacterPoses(character){const key=characterKey(character);return Object.freeze(poses.filter(p=>p.character===key));}
