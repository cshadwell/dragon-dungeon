import {DOOR_PIXELS} from './door-pixels.js?v=9b095cd0d72d';
export const MAZE_DOORS=Object.freeze([
 {character:'ogre',pos:'35,30',wallX:35,wallY:28,side:1,step:-1},
 {character:'wizard',pos:'3,22',wallX:5,wallY:22,side:0,step:1},
 {character:'queen',art:'elf',pos:'55,4',wallX:57,wallY:4,side:0,step:1},
 {character:'dragon',pos:'0,1',wallX:0,wallY:-1,side:1,step:-1}
].map(Object.freeze));
export function doorFace(x,y,side,step){return MAZE_DOORS.find(d=>d.wallX===x&&d.wallY===y&&d.side===side&&d.step===step);}
export function doorPixel(door,u,v){const pixel=DOOR_PIXELS[door.art||door.character][Math.min(127,Math.max(0,Math.floor(v)))*128+Math.min(127,Math.max(0,Math.floor(u)))];return pixel[3]?pixel.slice(0,3):null;}
