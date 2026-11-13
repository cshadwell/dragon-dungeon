import {test} from 'node:test';
import assert from 'node:assert/strict';
import {exploredMap} from '../dist/explored-map.js';
import {fresh,cells,ENCOUNTER,WIZARD,QUEEN,DRAGON} from '../dist/runtime.js';
test('victory reveals full atlas and all four encounters without changing explored progress',()=>{
 const state=fresh(),before=structuredClone(state);state.dragon.victory=true;
 const svg=exploredMap(state);assert.equal((svg.match(/data-cell=/g)||[]).length,cells.size);
 for(const p of [ENCOUNTER,WIZARD,QUEEN,DRAGON])assert.ok(svg.includes(`data-cell="${p}"`));
 assert.match(svg,/Complete maze map/);assert.deepEqual(state.visited,before.visited);
});
test('fresh expeditions retain fog of war',()=>{
 const state=fresh(),svg=exploredMap(state);assert.equal((svg.match(/data-cell=/g)||[]).length,state.visited.length);assert.match(svg,/Unvisited rooms are concealed/);
});
