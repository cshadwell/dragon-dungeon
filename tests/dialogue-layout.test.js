import test from 'node:test';import assert from 'node:assert/strict';
import {largestFittingFont} from '../dist/dialogue-layout.js';
import {OGRE_OPENING,ELF_OPENING,WIZARD_OPENING,DRAGON_OPENING,STORY_SAMPLES,MAZE_INTRO,JOURNAL_SAMPLE} from '../dist/dialogue-copy.js';
test('one fitting size is selected from a fixed corpus rather than resizing individual lines',()=>{
 assert.equal(largestFittingFont(56,size=>size<=43),43);assert.equal(largestFittingFont(32,()=>true),32);assert.equal(largestFittingFont(56,size=>size<=18),18);
});
test('fitting corpus includes every approved opening, longest spell explanation, maze intro and farewells',()=>{
 assert.deepEqual([OGRE_OPENING.length,ELF_OPENING.length,WIZARD_OPENING.length,DRAGON_OPENING.length],[6,6,6,8]);
 for(const lines of [OGRE_OPENING,ELF_OPENING,WIZARD_OPENING,DRAGON_OPENING])for(const [,text] of lines)assert.ok(STORY_SAMPLES.includes(text));
 assert.ok(STORY_SAMPLES.includes(MAZE_INTRO));assert.equal(WIZARD_OPENING[3][1].split(/\s+/).length,33);assert.ok(STORY_SAMPLES.some(s=>s.startsWith('Great job!')));assert.ok(STORY_SAMPLES.some(s=>s.startsWith('Huzzah!')));assert.ok(JOURNAL_SAMPLE.includes('The Elf Queen’s advice:'));
});
