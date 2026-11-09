# Dragon Dungeon — current specification

This is the authoritative summary of the live game as of 2026-11-09. Older entries in PROJECT_STATE.md and DECISIONS.md are historical and may describe superseded mechanics.

## Adventure and presentation
- Title → stepped black fade → enlarged golden pixel prologue with opening.mp3 → Space/click → stepped black fade → dungeon reveal → scene music.
- Preserve approved 59×46 maze, southeast start, fog of war, smooth movement, four doors at earlier trigger tiles, gray walls/green floor/dark ceiling, and guardian hint zones. Completed lessons silence their hints.
- Keyboard and onscreen controls coexist. Arrow keys navigate; held keys repeat. Space confirms choices/advances dialogue/attacks. Elf uses left/right rotation and Space pause. Wizard uses directional choices and Space pause. Journal is an overlay; New Game requires confirmation.
- The player must complete all three guardian lessons before opening the dragon gate. Otherwise show: “You must find all the guardians before entering this chamber. You are NOT prepared.” Keep Stay in the maze available. Older unfinished, unprepared dragon saves return to this gate; preserve their lessons/exploration. Previously earned wins remain earned.

## Guardians
- Ogre: practice1500ms/20%, then1250ms/15%; challenge1000ms/10%,three hits within five attempts. Three crossings per attack. Misses are safe in training.
- Elf:50°shield,300°/s rotation;3blocks at60/.9s gap,4at65/.4s,5at70/.2s. Successes need not be consecutive.
- Wizard:3correct at4s,4at3s,5at2s. First two stages matching ink; final stage conflicting ink. Unique shuffled words/inks and no consecutive repeated spell color.
- Farewell and shared door/audio transition return to maze. Journal retains advice and safe refresher sessions. Guardian completion is durable and awards compatibility inventory fields exactly once.

## Dragon
- Existing Dragonforged interface, approved lair, pose library, spell assets, dialogue and music remain canonical.
- Round1:4attacks/6blocks/5colors.1250ms/15%,65/.4s defence,3s matching words.
- Round2:5attacks/8blocks/6colors.1000ms/10%/3crossings,70/.2s defence,2s conflicting ink.
- Round3:25successes:8attacks,8colors,3volleys of3blocks in shuffled order.850ms/7%/2crossings,75defence/zero gap on blocks,1.75s words/ink/background all different. First projectile in each volley is close to current shield. Difficulty unchanged.
- Meter10full→0empty. Each miss loses1point. A perfect attack immediately restores1point, capped at10. Ordinary successes do NOT heal; the previous three-success streak recovery is superseded. Perfect attacks still count as one progress success.
- Zero freezes play,shows pose27,then Space triggers defeat.wav/black transition and random one-of-five safe maze spawn. Keep guardian progress/exploration. Return message directs player back to dragon.
- Boss round/meter are intentionally transient: leaving/reloading restarts the entire fight. No intermediate boss checkpoints.
- Final success saves victory immediately. Save prizeRevealed=false until the plaque appears. Reload before reveal resumes the two victory lines without repeating the fight. CHAZ stays hidden from journal/name controls until prizeRevealed. Older victories without this flag count as already revealed.
- Victory.wav plays once,then ending.mp3. Pose17→pose4→dragon fade over original lair→exact CHAZ plaque. Name remains independent/durable.

## Reliability
- Shared challenge-pause.js freezes timers/input for menu,blur,hidden page and page-history interruptions. Pause reasons are independent; closing a menu cannot resume a hidden tab. Timer clocks reset on suspension/resumption to avoid elapsed-time jumps. Space pause remains available in defence/focus.
- Scene music preserves its position across temporary suspension, respects mute, and retries on genuine player gestures, including iframe gestures. Changing scenes still resets the appropriate track. Transition sounds have a bounded fallback.
- Prologue audio resumes across page/visibility restoration, offers blocked-playback retry, and falls back to silent scrolling after an error/stall. Preserve current scroll position, gold treatment and timing.
- Image loading has a10s timeout and retry UI. Dragon initial entry requires only its opening pose/background/gauge; optional poses prefetch without blocking. Missing poses pause play while loading; the plaque loads when needed. Exact approved bytes remain unchanged.

## Assets and release
- Original78approved-v2 poses stay locked. Stable additions: Wizard14–34 in wizard-spells-v2; Dragon38–58 in dragon-spells-v1. Never redraw/recolor/renumber silently. Always use catalog lookup and nearest-neighbor rendering.
- Four approved rooms,doors,shield,title and ending plaque retain exact supplied/canonical assets.
- dist/ is editable source. Run python3 tools/stamp-release.py after JS/CSS/HTML changes, before tests/reload.
- npm test: rule/save/art/audio/syntax regressions. npm run test:browser: Playwright browser smoke suite (npm ci and npx playwright install chromium required). CI runs both on push/PR. Do not treat a prepared workflow as an observed GitHub run.
- npm run package: unpublished lean copy under ignored build/, excluding historical approved-v1 artwork and opening-preview.html. Repository originals retained. Do not automatically deploy or push.
- Local preview server is 127.0.0.1:4173. Hosted-device testing and fresh-player fairness remain separate verification steps.


## 2026-11-09 — Shared dialogue sizing and locked gate copy
The unprepared dragon gate shows only the guardian warning and maze retreat choice. Maze and encounter narrative panes use centered VT323 text at one shared viewport-dependent size, measured against the opening dialogue corpus, maze introduction, door descriptions, farewells and complete journal sample. Continuation prompts retain reserved bottom space. Font size does not change between messages. Browser checks of the longest Wizard opening passage showed no text overflow at 1440×900 (43px), 1280×720 (38px), 1024×600 (31px), and 390×844 (32px). Approved artwork and challenge settings remain unchanged. Browser regression coverage was added; the automated browser runner was not executed locally.


## 2026-11-09 — Approved closing sequence integrated
After the CHAZ plaque reveal, keep the upper frame and exact plaque visible. Fade both lower panels over1.25seconds and scroll the approved congratulations/Dragon’s Book/Press ever onward text upward in the opening golden pixel style at half the original preview speed. After the final line clears, stop ending music and play supplied static.mp3 once. Large dark-red X-13 appears briefly and irregularly through mostly black gaps, then resolves steadily when audio ends. Visibility interruption pauses scrolling/static; blocked audio offers a retry. Saved earned-name re-entry also shows this ending. Standalone ending-preview.html remains available. No difficulty or approved art changes.


## 2026-11-09 — Approved audio entry integrated
User verified the standalone entry in three browsers and approved integration. Initial black screen now asks Press Space Bar or tap to begin. The gesture starts non-looping title music directly at40% before awaiting title art readiness, then reveals the unchanged animated title. Title Play/Mute button removed; in-game sound control retained. Second Space/click enters the existing prologue/dungeon sequence. Includes blocked-audio retry/silent fallback and visibility resume. Initial title is hidden in HTML to avoid a premature visual flash. No adventure storage read/write until entering the game, as before. Added Space/click browser coverage and generalized main-page stylesheet/module cache stamping so the new stylesheet shares the release ID.137local tests pass; final GitHub browser/deploy result recorded in workflow. Standalone audio preview excluded from release package.
