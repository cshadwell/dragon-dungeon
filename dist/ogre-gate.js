// Compatibility helpers for the original Ogre doorway API.
import {MAZE_DOORS,doorFace,doorPixel} from './maze-doors.js?v=9b2f8bc9e7ff';
export const OGRE_DOOR=MAZE_DOORS[0];
export function isOgreDoorFace(x,y,side,step){return doorFace(x,y,side,step)===OGRE_DOOR;}
export function ogreDoorPixel(u,v){return doorPixel(OGRE_DOOR,u,v);}
