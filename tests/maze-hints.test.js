import {test} from 'node:test';import assert from 'node:assert/strict';
import {HINT_ZONE_ROWS} from '../dist/hint-zone-data.js';
import {mazeHint,ZONE_MESSAGES,DEFAULT_PASSAGE_MESSAGE} from '../dist/maze-hints.js';
import {fresh,act,cells,neighbor,START} from '../dist/runtime.js';
test('supplied map zones contain only maze paths and successful steps use the destination hint',()=>{
 const found=new Set(),exits=new Set();
 for(let y=0;y<HINT_ZONE_ROWS.length;y++)for(let x=0;x<HINT_ZONE_ROWS[y].length;x++){
  const zone=HINT_ZONE_ROWS[y][x],pos=`${x},${y}`;if(zone!=='.'){assert.ok(cells.has(pos));found.add(zone);}
  if(!cells.has(pos))continue;
  for(let facing=0;facing<4;facing++)for(const action of ['forward','back']){
   const dest=neighbor(pos,(facing+(action==='back'?2:0))%4);if(!cells.has(dest))continue;
   const s={...fresh(),pos,facing,visited:[START,pos],message:mazeHint(pos)},result=act(s,action);
   if(result.gate||result.encounter)continue;
   assert.equal(result.message,mazeHint(dest));
   if(zone!=='.'&&mazeHint(dest)===DEFAULT_PASSAGE_MESSAGE){exits.add(zone);assert.equal(result.message,DEFAULT_PASSAGE_MESSAGE);}
  }
 }
 assert.deepEqual([...found].sort(),['D','E','O','W']);assert.deepEqual([...exits].sort(),['D','E','O','W']);
});
test('turning keeps the zone hint and collisions retain useful wall feedback',()=>{
 const s={...fresh(),pos:'35,31',message:ZONE_MESSAGES.O};assert.equal(mazeHint(s.pos),ZONE_MESSAGES.O);
 assert.equal(act(s,'right').message,ZONE_MESSAGES.O);
 const wall={...s,facing:1};assert.equal(act(wall,'forward').message,'A stone wall blocks the way.');
});
