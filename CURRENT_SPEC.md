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


## Local addition — 2026-11-12 (not published)
Secret musical passage added at supplied map tile 34,43, east wall. Independent sampled piano, explicit seven-note submissions, persistent unlock, and same-tab musical finale transition. See SECRET_PASSAGE.md for source provenance, pitch audit, behavior and testing limits. Existing gameplay/save key retained; live release remains unchanged.


## 2026-11-13 — Secret wall entrance treatment (local only)
The supplied gold/black eye copy is preserved separately and rendered with nearest-neighbor pixels, 25% larger than the initial marker. On tile 34,43, the narrative reads: “A familiar eye stares back at you. You hear faint music playing from behind the wall. The urge to reach out and touch it is overpowering.” Clicking starts the supplied rumble, 900ms shake, then 2600ms vertical two-panel stone opening over black. Fade the entire game to black over1250ms while fading the rumble; play a separate footsteps-only WAV trimmed from3.30s to the end of the existing6.74s door recording, then reveal the piano over950ms. Existing normal door audio remains unchanged. Input is locked during entry; cancellation and audio failure clean up safely; visibility suspends animations/audio. Reduced-motion preference removes movement/fades. No publication.


## 2026-11-13 — Approved recessed eye integrated (local only)
Replaced the flat marker with the approved preview's larger brass relief and recessed stone surround. Archived approved preview and derived169×160native-pixel transparent inset under art-review/2026-11-13/recessed-eye and dist/assets/secret/recessed-eye.png. Surrounding corridor bricks remain the existing procedural renderer; generated background bricks are excluded from the inset. Perspective sampling and click bounds share its enlarged UV placement. The same captured corridor canvas supplies both opening panels, so the complete medallion/retaining stones split with the wall. Opening sound, footsteps-only cut, fades, piano logic and saved state remain unchanged.151Node tests and185Pages references pass; Safari opening sequence and chamber return reviewed locally. No publication.


## 2026-11-13 — Quiet piano and automatic attempts (local only)
Latest user decision supersedes the introductory chamber picture/text, progress indicators, Clear and Play this melody controls. First entry shows only the empty black upper frame and sampled keyboard beneath it. Every seven deliberate notes automatically form one attempt; wait for the seventh sample's actual tail, then evaluate exact pitches/order without replaying the sequence. Incorrect attempts open a centered themed modal: “Hmmmm. That doesn't sound quite right.” with Try again and Return to the maze. Retry clears the attempt and stops old voices; return closes the chamber. Escape remains a keyboard exit. An already unlocked chamber retains Enter the studio. Correct attempts retain the durable unlock, two-second black fade and same-tab finale navigation. Audio/asset failures have a recovery modal, not permanent instructions. Original piano artwork, all25keys, samples, entry wall animation, saves and other encounters are unchanged.153Node tests pass, including actual controller callbacks for last-note gating, retry/return, obsolete note completions and one-time success navigation. Safari checked the minimal layout, automatic wrong-attempt modal, retry and automatic correct melody. No publication.


## 2026-11-13 — Two octaves and candle success sequence (local only)
Accept either complete E3–B3–A3–G3–E3–C4–B3 or E4–B4–A4–G4–E4–C5–B4 sequence; mixed octaves and longer/random fragments do not unlock. After the seventh note finishes, persist the existing unlock flag and play the supplied correct.mp3 through the piano's unlocked audio context. Seven transparent animated candles appear left to right at recording offsets 0, 0.5, 1, 1.5, 2, 2.5 and 3 seconds, in the user's staggered vertical pattern. Hold all seven for three seconds after the four-second recording finishes, then use the existing two-second fade and same-tab finale navigation. Input and repeated navigation are guarded throughout. Closing cancels audio/animation; visibility pauses the sequence. Reduced motion uses a still candle.

Use the supplied APNG, retaining all 121 frames and transparency, cropped to its shared alpha bounds and nearest-neighbor reduced to 80×130. Original files remain unchanged. Preparation and hashes: tools/prepare-secret-candle.py and art-review/2026-11-13/candle-celebration/asset-record.json. No runtime WebM dependency. The chamber remains blank before success; wrong-attempt behavior is unchanged.

Validation: 157 automated tests pass; 186 Pages asset references pass. Safari manually verified the lower-octave success, seven candles in the supplied arrangement, and same-tab arrival at The Maker's Last Echo entry screen. Both complete octaves, rejection of mixed octaves, candle/audio clock timing, hold duration and cancellation have automated coverage. Physical touch and other browsers remain unverified manually for this addition. No push or publication.


2026-11-13 release verification: 157 Node tests pass; six browser regressions passed in the full run and the gate regression passed on targeted rerun after adding the existing 230ms startup cooldown to that test (no gameplay change). Lean Pages package validates 171 references and CHAZ. Current secret passage and candle version approved for commit/push.


## 2026-11-13 — Return after X-13
After the closing static finishes and X-13 resolves, show a clickable -Press Space Bar- prompt. A fresh Space press or click sends one guarded return request to the parent game. Return to START facing north, clear encounter/gate, stop ending audio, restore maze music/controls, and preserve victory, CHAZ reveal, guardian progress, exploration and musical passage unlock. No New Game/reset is performed. Prompt is unavailable during credits/static. Local validation: 157 Node tests, 186 asset references, and the end-to-end browser test covering credits/static, keyboard return, entrance position and retained victory/reveal all pass. Not yet pushed.


## 2026-11-13 — Title New Game / Resume Game (local)
Replace the title start control with New Game and Resume Game. Resume is available only for a readable existing adventure and resumes directly without opening credits. New Game replays the prologue and creates a fresh adventure; existing progress requires confirmation before replacement. Cancelling leaves the save and title unchanged. Both controls retain the pixel/iron-brass theme, click and focused Space activation; the initial audio-unlock gesture remains. Verification: 157 Node tests, three targeted browser tests (fresh start/prologue, audio entry/save preservation, resume and cancelled/confirmed reset), and 187 Pages references pass. Not pushed.


2026-11-13 publication verification: New Game / Resume Game and post-X-13 maze return approved for publication. Final complete run: 157 Node tests and all 8 browser tests pass; 187 asset references pass; CHAZ confirmed.


## 2026-11-13 — Completed adventure map
A saved dragon victory reveals the full maze atlas and all three guardian/dragon landmarks when viewing the maze, including after X-13 return or Resume Game. Rendering does not rewrite visited cells or reset any progress; older completed saves gain this automatically. New Game retains fog of war. Secret entrance receives no map marker. 159 Node tests pass, including full-atlas/landmark visibility, preserved visited cells and new-game fog; 187 Pages references pass. Local only, not pushed.


## 2026-11-13 — Candle reset removed
The supplied candle animation now plays once and holds its final frame rather than looping back into its zoom. Only the APNG animation control/play count and CRC changed; all 121 frame pixels, alpha, timing and size remain unchanged. Preparation tool reproduces play_count=1; hashes updated. Candle asset URL is versioned to avoid cached looping artwork. Melody cues, three-second hold and fade/navigation remain unchanged. 159 tests pass, including an explicit APNG play-count regression. Local only; not pushed.
