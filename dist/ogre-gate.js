// Compatibility helpers for the original Ogre doorway API.
import {MAZE_DOORS,doorFace,doorPixel} from './maze-doors.js?v=a06f70034131';
export const OGRE_DOOR=MAZE_DOORS[0];
export function isOgreDoorFace(x,y,side,step){return doorFace(x,y,side,step)===OGRE_DOOR;}
export function ogreDoorPixel(u,v){return doorPixel(OGRE_DOOR,u,v);}
