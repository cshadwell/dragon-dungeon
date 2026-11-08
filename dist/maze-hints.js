import {HINT_ZONE_ROWS} from './hint-zone-data.js?v=65931cb8ac8a';
export const DEFAULT_PASSAGE_MESSAGE='Your footsteps echo through the passage.';
export const ZONE_MESSAGES=Object.freeze({
 O:'The corridors begin to fill with the sounds of banging metal. Something is near.',
 W:'The corridors begin to shimmer with mystical aura. Something is near.',
 E:'The corridors begin to echo with the sounds of the deep woods. Something is near.',
 D:'The corridors begin to tremble and the air becomes thick with sulfurous fumes. Something is near.'
});
export function mazeHint(pos,completed={}){
 const [x,y]=pos.split(',').map(Number),zone=HINT_ZONE_ROWS[y]?.[x];
 return completed[zone]?DEFAULT_PASSAGE_MESSAGE:ZONE_MESSAGES[zone]??DEFAULT_PASSAGE_MESSAGE;
}
