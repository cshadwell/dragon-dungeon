import {test,expect} from '@playwright/test';
import {fresh,DRAGON} from '../dist/runtime.js';
async function approachDoor(page){
 await expect(page.locator('body')).not.toHaveClass(/title-open/);
 await page.waitForTimeout(230); // First input also observes the boot-time cooldown.
 // Review starts two tiles before the trigger. Wait for each actual movement,
 // then respect the game's input cooldown before taking the next step.
 for(let i=0;i<2;i++){
  await page.getByRole('button',{name:'Move forward',exact:true}).click();
  await expect(page.locator('#scene')).not.toHaveAttribute('aria-busy','true');
  await page.waitForTimeout(230);
 }
 await expect(page.getByRole('button',{name:'Open the door and enter',exact:true})).toBeVisible();
}
test('Space starts opening, credits hold, and dungeon music waits until reveal',async({page})=>{
 await page.goto('/');await expect(page.locator('#title-status')).toContainText('Press Space Bar');await page.keyboard.press('Space');
 await expect(page.locator('#opening-music')).toBeAttached();await expect(page.locator('#dungeon-music')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'-Press Space Bar-',exact:true})).toBeVisible({timeout:25000});
 await page.keyboard.press('Space');await expect(page.locator('.opening-scene')).toHaveCount(0);await expect(page.locator('body')).not.toHaveClass(/boot-transition/);
 await expect(page.getByRole('button',{name:'Move forward',exact:true})).toBeVisible();await expect.poll(()=>page.locator('#dungeon-music').evaluate(a=>a.paused)).toBe(false);
});
test('incomplete expedition cannot open the dragon gate',async({page})=>{
 const state=fresh();state.pos=DRAGON;state.visited.push(DRAGON);state.dragon.discovered=true;state.gate='dragon';
 await page.addInitScript(s=>localStorage.setItem('dragon-dungeon-maze-adventure-v1',JSON.stringify(s)),state);
 await page.goto('/?preview=audit');await expect(page.locator('#door-intro')).toContainText('You are NOT prepared.');
 await expect(page.getByRole('button',{name:'Open the door and enter'})).toHaveCount(0);await page.getByRole('button',{name:'Stay in the maze',exact:true}).click();await expect(page.locator('#modal')).not.toBeVisible();
});
test('Ogre timer freezes while Journal is open and resumes when closed',async({page})=>{
 await page.goto('/?preview=doors&door=ogre');await approachDoor(page);
 await page.getByRole('button',{name:'Open the door and enter',exact:true}).click();const frame=page.frameLocator('#ogre-attack-encounter');
 await expect(frame.locator('#message')).toContainText('Greetings friend');await expect(page.locator('#door-fade')).not.toBeVisible({timeout:15000});
 await frame.locator('#space-action').focus();for(let i=0;i<6;i++)await page.keyboard.press('Space');
 await frame.getByRole('button',{name:'JOURNAL',exact:true}).click();await expect(frame.locator('#room-menu')).toBeVisible();
 const before=await frame.locator('#pass').textContent();await page.waitForTimeout(5500);await expect(frame.locator('#pass')).toHaveText(before);
 await frame.getByRole('button',{name:'Close',exact:true}).click();await expect.poll(()=>frame.locator('#pass').textContent()).not.toBe(before);
});
test('saved victory resumes reveal dialogue rather than replaying the boss',async({page})=>{
 const state=fresh();state.pos=DRAGON;state.visited.push(DRAGON);state.encounter='dragon';state.dragon={phase:'victory',discovered:true,victory:true,trialCompleted:true,name:'CHAZ',placeholder:false,prizeRevealed:false,returnTo:null,feedback:''};
 await page.addInitScript(s=>localStorage.setItem('dragon-dungeon-maze-adventure-v1',JSON.stringify(s)),state);await page.goto('/?preview=audit');
 const frame=page.frameLocator('#dragon-room-encounter');await expect(frame.locator('#message')).toContainText('DEFEAT!');await frame.locator('#space-action').click();await expect(frame.locator('#message')).toContainText('worthy to know my true name');await frame.locator('#space-action').click();await expect(frame.locator('#room')).toHaveAttribute('aria-label',/Golden plaque/);await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dragon-dungeon-maze-adventure-v1')).dragon.prizeRevealed)).toBe(true);
});
test('largest dialogue stays centered, same-size and scroll-free across viewport sizes',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/?preview=doors&door=wizard');await approachDoor(page);await page.getByRole('button',{name:'Open the door and enter',exact:true}).click();
 const frame=page.frameLocator('#wizard-mind-encounter');await expect(page.locator('#door-fade')).not.toBeVisible({timeout:15000});await expect(frame.locator('#message')).toContainText('Salutations');await frame.locator('#space-action').focus();for(let i=0;i<3;i++)await page.keyboard.press('Space');await expect(frame.locator('#message')).toContainText('Observe this spell');
 for(const size of [{width:1440,height:900},{width:1280,height:720},{width:1024,height:600},{width:390,height:844}]){
  await page.setViewportSize(size);await expect.poll(async()=>await frame.locator('html').getAttribute('data-dialogue-size')===await page.locator('html').getAttribute('data-dialogue-size')).toBe(true);
  await expect.poll(()=>frame.locator('#message').evaluate(el=>el.scrollHeight<=el.clientHeight+1&&el.scrollWidth<=el.clientWidth+1)).toBe(true);
  await expect(frame.locator('#message')).toHaveCSS('text-align','center');
  const panel=await frame.locator('.narrative').boundingBox(),prompt=await frame.locator('#dialogue-continue').boundingBox();expect(prompt.y+prompt.height).toBeLessThanOrEqual(panel.y+panel.height);
 }
});

test('earned name runs closing credits and resolves X-13 after static',async({page})=>{
 test.setTimeout(90000);
 const state=fresh();state.pos=DRAGON;state.visited.push(DRAGON);state.encounter='dragon';state.dragon={phase:'victory',discovered:true,victory:true,trialCompleted:true,name:'CHAZ',placeholder:false,prizeRevealed:true,returnTo:null,feedback:''};
 await page.addInitScript(s=>localStorage.setItem('dragon-dungeon-maze-adventure-v1',JSON.stringify(s)),state);await page.goto('/?preview=audit');
 const frame=page.frameLocator('#dragon-room-encounter');await expect(frame.locator('.closing-scene')).toBeVisible();await expect(frame.locator('#room')).toHaveAttribute('aria-label',/Golden plaque/);await frame.locator('#room').click();
 await expect(frame.locator('.closing-signal')).toBeVisible({timeout:70000});await expect(frame.locator('.closing-signal')).not.toHaveClass(/flickering/,{timeout:15000});await expect(page.locator('#ending-music')).toHaveJSProperty('paused',true);
});
