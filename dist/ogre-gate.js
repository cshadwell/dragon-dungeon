// Original pixel door sampled directly on the north wall of the Ogre entrance tile.
// Keep the approved maze geometry intact: wall (35,28), south-facing surface.
export const OGRE_DOOR={wallX:35,wallY:28,side:1,step:-1};
export function isOgreDoorFace(x,y,side,step){return x===OGRE_DOOR.wallX&&y===OGRE_DOOR.wallY&&side===OGRE_DOOR.side&&step===OGRE_DOOR.step;}
export function ogreDoorPixel(u,v){
 // Transparent outside the arch so the normal gray stone remains visible.
 const x=Math.floor(u),y=Math.floor(v),left=18,right=110;
 if(x<left||x>right||y<15||y>127)return null;
 const inset=y<37?Math.max(0,20-(y-15)):0;
 if(x<left+inset||x>right-inset)return null;
 const edge=x<left+7+inset||x>right-7-inset||y<22;
 if(edge)return (x+y)%7<2?[83,84,82]:[48,49,47];
 const band=(y>=49&&y<=58)||(y>=96&&y<=105);
 if(band){const rivet=[31,52,73,94].some(n=>Math.abs(x-n)<2)&&((y>=52&&y<=54)||(y>=99&&y<=101));return rivet?[164,166,158]:y===49||y===96?[102,105,100]:[45,48,46];}
 // Iron ring and mounting plate, placed to the right of the center seam.
 if(x>=78&&x<=85&&y>=68&&y<=76)return [58,62,58];
 const ring=Math.sqrt(((x-82)/1.0)**2+((y-81)/1.2)**2);
 if(ring>=5&&ring<=8)return x<82?[148,151,138]:[69,73,67];
 const plank=Math.floor((x-25)/12),grain=(x*7+y*3)%19;
 if((x-25)%12<2||x===64)return [42,29,17];
 const light=[0,12,-7,6,-3,10][((plank%6)+6)%6]+(grain<3?-10:grain>16?7:0);
 return [100+light,64+light*.65,30+light*.3];
}
