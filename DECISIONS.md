# Decisions and superseded approaches

**Current authority:** See [CURRENT_SPEC.md](CURRENT_SPEC.md). The dated entries below preserve development history; earlier conflicting mechanics are superseded by the current specification.

Recorded from inspected code, current user requests and existing milestone evidence on 2026-10-23. Implementation dates below follow those records; reasons are limited to what is established.

| Decision | Basis / reason | Replaces / consequence |
|---|---|---|
| Plain static ES modules with separated rules/content/rendering/persistence | Current implementation; handoff recommends a small maintainable static app | No framework/backend selected; dist is editable source |
| Three independent guardians: Ogre, wizard, elf queen, then combined dragon | User selected characters to teach skills and grant equipment/advice | Generic placeholder encounters replaced; discovery order remains flexible |
| Safe Ogre tutorial, directional input after snort; tell teaches timing | Explicit user request for skill and creature tells | Supersedes initial handoff no-reflex rule/untimed choices; preserve slower option and safe practice |
| Dragon applies reflection, tell response, deduction and restraint | User requested combining three learned skills | Name comes from independent evidence; TEST stays a development placeholder pending book lock |
| Retro first-person console with always-visible explored map | User Photoshop layout and Double Dungeons visual reference | Supersedes map-only-on-demand presentation; fog of war retained |
| Smooth interpolated steps/turns, original renderer | User recording reference; no verified original game source found (MOVEMENT.md) | Replaces jump transitions; do not claim original engine or frame-exact equivalence |
| Original code-drawn gray stone, green tiles, charcoal ceiling | Latest explicit user palette references | Replaces earlier surface colors; stock preview pixels/watermarks not used |
| Supplied 59×46 maze with southeast start | User maze.png, ignore letters/symbols | Replaces compact prototype in live runtime; prototype defaults/tests retained |
| Ogre/wizard/queen/dragon at map2 dot coordinates | Explicit user placements | Supersedes prototype placements; see PROJECT_STATE.md for live coordinates |
| Navigation-only phase ended; four encounters active | Subsequent user placement request implemented | MAZE.md describes historical study, not current mode |
| Separate live save key and configured WORLD | Preserve earlier saves while moving to large maze | Old small-world state not blindly loaded; import exploration deliberately, preserve invalid saves |
| Coherent hashed module graph + no-store local serving | Safari false-wall/save symptom resolved with coherent refresh | Prevent mixed cached revisions; stamp after every source edit (SAFARI-FIX.md) |
| Optional Ogre wood/metal gate; shared wide encounter screen | Latest user mockup: enter prompt, no map inside, text left/actions right | Replaces automatic Ogre interaction on arrival; other themed gate designs pending; no grid changes |
| Gate surrounds use same gray stone/green floor | Latest explicit user instruction | Replaces plain gate backdrop; wood/iron gate retained |
| Software truth lives here; wider puzzle truth in Project references | User continuity request, 2026-10-23 | Current-state docs supersede stale milestone claims; synced sources remain untouched |

Future changes: record decision, established reason, superseded behavior and consequences here. Do not invent retrospective reasons or treat suggestions as approved.

## Local version control — 2026-10-23

User authorized Git initialization in dragon-dungeon and an initial verified baseline commit. Track editable dist source, tests, tools, configuration, documentation and referenced verification images; ignore local secrets, caches, backups and temporary/generated test reports. This replaces unversioned-only development. Keep the existing snapshot; do not configure a remote or push without authorization.

## Integrated doorway — 2026-10-23

User reference requires the door to exist on the maze wall and be visible before arrival. Replace the full gate-scene swap with pixel sampling on the existing north end wall of the Ogre corridor; preserve geometry and entry tile. Only accepting entry switches to the wide room. Door renders with the same perspective, shading and occlusion as stone.

User requested the Ogre trigger one tile earlier because the final approach was too close. Trigger moved to (35,30); wall/maze unchanged. Existing active close-up saves migrate to the new trigger.

User selected the supplied Ogre Character, Attack and Swing artwork as the interaction basis. Replace geometric placeholder with a transparent derivative atlas, preserve original references, and map pose changes to existing reaction phases without changing timing or outcomes.

Original-art fidelity update: all displayed Ogre poses now use isolated cutouts of the supplied Character, Attack, Snorting Ogre Attacks and Swing sheets. No generated atlas is referenced at runtime. Preparation → original steam/snort pose → original follow-through uses existing timing; on-screen SNORT word/overlay removed. Pixel colors preserved in retained foreground, no resampling during extraction, nearest-neighbor display. Browser safe practice succeeded using the visual steam cue.

User supplied transparent v2 Ogre sheets and requested discarding all earlier artwork versions. Use supplied alpha directly; isolate poses without background heuristics or redrawing. Supersedes white-keying/extraction and generated-atlas approaches.

User chose red brick walls and cobblestone floor specifically for the Ogre chamber, with exact supplied shield hanging behind him on the left. Maze palette stays gray/green. Stock wall preview is style reference only; original red-brick rendering avoids importing its watermark.

## Cohesive character library — 2026-10-25

User approved art-review/2026-10-25/style-study-v2.png pixelation across all four characters, then requested one coordinated batch of all 17 supplied character sheets. Preserve every original pose/identity and use common 1536x1024 transparent canvases. Produce new derivatives alongside unchanged source copies; no unapproved new actions or effects. This authorizes style normalization for the revised library, superseding exact-pixel fidelity only for these new derivatives; existing runtime assets remain intact pending interaction redesign/integration.

## All character sheets locked with permanent pose numbers - 2026-10-25

User accepted the entire normalized set exactly as it appears and requested a game-wide rule against changing the art. Preserve the 17 approved PNG sheets byte-for-byte. Number poses globally per character in fixed sheet order, then reading order within each sheet. Ogre 1-15; wizard 1-13; elf queen 1-13; dragon 1-37. Guides display numbers above poses; sprites stay unlabelled. Extract only lossless source-cell crops, record hashes, and require explicit new user instruction before modifying art. No renumbering; new poses append. Canonical lookup replaces filename guessing for future scene integration. This supersedes earlier original-Ogre-v2 fidelity as the reference for new gameplay art; current runtime remains unchanged until deliberate integration.

User clarified that sheet size is not the relevant standard: normalize all 78 individual poses to comparable native pixel density/character scale, using Elf pose1 as benchmark. Variable aspect ratios allowed; keep identities, source designs and permanent numbering. Deterministic nearest-neighbor candidates are separate from the old baseline and await review before promotion. This is an explicit authorization for resolution normalization, not redraw/restyling.

## Final individual-pose baseline V2 accepted - 2026-10-25

User explicitly approved the 78 reviewed individual pixel-density revision poses and requested locking their corresponding numbers. Promote byte-identical PNGs to approved-v2 and switch canonical lookup to V2. Keep every ID unchanged and retain V1 historically. This supersedes the prior sheet-based baseline and pending-review status. Prohibit further image normalization, redraws, palette changes, smoothing or replacement without explicit user instruction. Preserve native pixel scale in display rather than auto-fitting every pose to an identical box.

## Four room backgrounds accepted as defaults - 2026-10-25

After reviewing each room with approved characters in the game encounter frame, user approved the four displayed backgrounds and V2 character library as the default visual baseline and authorized pushing all current work to private GitHub. Preserve exact room files, use darkened dragon lair, retain pose IDs and use a shared room/pose registry for future scene integration. This locks the presented art, not an unplanned minigame redesign. Protect room images with hashes and keep 470x200 logical nearest-neighbor rendering.

## Four supplied maze doors - 2026-10-25
User requested all four supplied doors integrated into the corridor wall with one-tile-back entry prompts. Isolated original artwork, removed only edge-connected near-white backdrop, normalized to 112px artwork height in a 128px transparent wall tile using nearest-neighbor sampling. Original preserved; no generative redraw. Perspective, wall occlusion and distance shading shared with stone renderer. Ogre wall (35,28)/trigger (35,30); wizard wall (5,22)/trigger (3,22); queen wall (57,4)/trigger (55,4); dragon wall (0,-1)/trigger (0,1). Maze geometry unchanged. Enter/stay choice for all four; only accepting opens existing wide encounter. Older active guardian saves migrate safely, retaining progress. 63 automated tests pass. Browser inspected all four approaches and Ogre prompt while corridor/map remain visible. Character and room baselines untouched. No GitHub push in this turn.

## Corridor distance darkness - 2026-10-25
Strengthened shared depth shading for walls, integrated doors, floor and ceiling. Nearby surfaces retain the previous brightness through one tile; a quadratic falloff increasingly darkens distant passages toward black. Pixel sampling, texture assets, movement and saves unchanged. Browser inspected Ogre approach; screenshot corridor-depth-check.png. Existing 63 tests pass; release 990b975e4fa5.

## Map-defined proximity hints - 2026-10-25
Traced supplied map2 copy.png at 10px per maze cell; source retained in art-review/2026-10-25/hint-zones/source.png. Walkable zone counts: Ogre 118, wizard 176, elf 115, dragon 130. hint-zone-data.js stores irregular tile boundaries; maze-hints.js stores exact user wording. Successful forward/back exploration steps select destination text; leaving a zone restores the footsteps default. Gate prompts, active encounter feedback, blocked movement and turns retain their established behavior. No save schema or maze geometry changes. Tests exhaustively check movement across zone boundaries in both directions and all four exits, plus collision/turn behavior: 65 pass. Browser verified exact Ogre hint (maze-hint-check.png). Release 58ca7a61fdaa. No remote push.

## Maze update accepted - 2026-10-25
User approved doors, depth shading and exact map-zone hint behavior as the current maze baseline and requested committing/pushing it to the existing private GitHub repository.

## Working title screen - 2026-10-25
Added supplied Dungeon of the Nameless Dragon artwork as a full-viewport opening view, with gold/green Enter the Dungeon button. Original PNG preserved in dist/assets/title/nameless-dragon.png; canvas samples at 480x360 with nearest-neighbor display, 4:3 containment avoids cropping, black letterboxing where needed. No generative changes to supplied art. boot.js waits for button activation before importing app.js and loading the adventure; native button supports keyboard/touch. Reload shows title again, then restores existing save normally. Local preview URLs bypass title. Updated release stamping and cache-coherence test to include boot entry and dynamic imports. 65 tests pass; browser checked title composition and Enter-key saved-game restoration. Source release 7c4a9c91868d. Screenshot title-screen-check.png. No remote push.

## Isolated Ogre attack playtest - 2026-10-26
User approved the attack timing-rail layout and authorized a standalone testable model before game integration. URL /ogre-playtest.html. Practice: repeatable, default crossing 1.8s and 24% target; challenge provisional 3 hits within 5 attempts, 1.3s crossing/16% target. Three crossings (out/back/final), final-opening warning, timeout teaches dragon fire without applying damage. One strike per attempt; stopped marker plus one reaction held 1.2s, then ready pose. Practice hit9/perfect11; challenge miss4-7/hit12-15, single pose selected by attempt rotation; hesitation/unspecified practice miss use ready1. Exact approved-v2 images and armory registry; shared native 470x200 scene. No adventure imports/storage/rewards/integration. Space/Enter or pointer-down Attack; auto-repeat ignored; tab hiding pauses timing. Between-round speed/width tuning and mode/reset controls. Pure timing/pose tests added: 68 total tests pass. Browser verified practice hit9, challenge miss4, timeout warning, tuning controls; screenshot ogre-attack-playtest-check.png. Pixel assets unchanged. Existing title work retained uncommitted. Release 7abfa0708b4a. No push.

## Graduated Ogre attack playtest - 2026-10-26
Updated at user request: practice 1.50s/20%, successful hit unlocks practice 1.25s/15%; second success offers challenge 1.00s/10%. Ogre explains shifting openings. Target centers cycle middle/right/left/offsets between attempts, stationary within each attempt; judging uses actual center. Challenge attempts advance automatically after 1.5s result hold + 0.35s ready cue; first attempt has 0.65s ready cue. Both misses and timeouts advance, with existing provisional 3 hits/5 attempts. Practice remains manually advanced to permit reading instruction. Single approved reaction poses unchanged. No adventure integration or save changes. 69 tests pass, including shifted target timing on all crossings. Browser verified two-step practice success, challenge hit12, automatic subsequent attempts. Screenshot ogre-continuous-playtest-check.png. No push.

## Ogre attack encounter integrated - 2026-10-26
User accepted the revised playtest and authorized integration into the current game; conversation refinement deferred. Existing Ogre gate opens the shared attack encounter in a same-origin frame, using exact approved room/pose assets and current three-pass timing. Gameplay version hides tuning and standalone footer, provides Return to the maze anytime. Main parent owns state/save/reward; frame sends typed practice, victory and leave events, checked against active source and origin. Each successful practice lesson persists ogre.attackPractice (0-2, optional for old saves); re-entry resumes the next lesson. In-progress challenge restarts on retreat/reload; completed reward retained. Victory grants polished shield once, normalizes legacy Ogre completion fields and retains required legacy journal knowledge for the unchanged dragon/save validator. Old completed Ogre saves retain rewards; legacy stages now open attack training. Dragon and other guardians remain unchanged pending redesign. Standalone playtest still has no save/reward effects. Tests cover practice retreat/re-entry/load, one-time reward, valid old-compatible save and non-Ogre reward rejection: 72 tests passing. Browser verified door entry, practice hit9, retreat, and resuming stage2 via isolated unsaved approach. No push in this turn.

## Integrated Ogre baseline accepted - 2026-10-26
User explicitly approved the current integrated attack encounter as the new baseline and authorized a private GitHub push. Preserve the tested mechanics and pose assignments; dialogue refinements remain deferred.

## Title music - 2026-10-26
Added exact supplied Title_Screen.mp3 as dist/assets/audio/title-screen.mp3 (~50.52 seconds). Title attempts playback once, no loop; when autoplay is blocked, Play title music button starts it on user gesture. Control permits pausing while on title. Natural end disables replay; Enter the Dungeon immediately pauses/resets music before app import, with late-play race guard. Local preview modes create no audio. Browser confirmed user-gesture playback (paused=false, loop=false, readyState=4) and title/audio removal on game entry. 72 tests pass; release 6680956784b3. Screenshot title-music-check.png. No push.

## Title animation overlays - 2026-10-26
User requested simple themed torch flicker, rising embers, dragon eye blink/glow and hot title backglow. Added title-effects.js: overlays on existing 480x360 pixel grid, stepped warm light near six torch positions, three staggered sparks per foreground brazier, green-eye-only slow blink about every 10s, narrow amber halo around lettering pulsing slowly. Exact title PNG unchanged. 30fps cap, skip hidden tabs, static original for prefers-reduced-motion, cancel animation on entry/pagehide. Title music remains at 40% with no looping. 72 tests pass; offline renderer smoke check confirms different frames and static reduced-motion output. Browser checked rendering/no errors and saved-game entry. Screenshot title-effects-check.png; release 13b42b83ae85. No push.

## More visible title effects - 2026-10-26
User supplied GIF motion references and requested stronger flame movement, eye blinks every 4-5s and sparse sparkle effects replacing title halo. Reworked title-effects.js with flame-color cutouts sampled from unchanged title art; separate working background covers original fire pixels and scanline sway/height variation at 10 poses/sec moves flame tongues while keeping brazier anchors. Existing ember accents retained. Eye blink period4.6s. Three short gold/ivory cross glints per10s on lettering; prior halo removed. All effects use 480x360 nearest-neighbor grid; reduced motion shows exact original image; original PNG untouched. Browser render checked without console errors, screenshot title-flames-sparkles-check.png. 72 tests pass; release097373737680. No push.

## Foreground flame anchor and eye closure correction - 2026-10-26
Expanded foreground flame regions upward and replaced yellow-only selection with connected warm-fire silhouette plus one-pixel border. Working background removes full original flame; original PNG unchanged. Bottom eight flame rows stay fixed to brazier rim; upper scanline deformation meets that anchor without a gap. Hallway torch behavior/title sparkles retained. Blink now covers entire eye area including yellow cores, fully black hold0.18s within4.6s cycle. Offline renderer confirmed closed-eye region RGB entirely zero and inspected fixed flame frame. Browser opened corrected title, screenshot title-flame-anchor-check.png. 72 tests pass; release a0fa9ee3d4a3. No push.

## Clean foreground fire masks - 2026-10-26
Constrained connected-color fire segmentation to hand-bounded flame geometry, removed mask dilation that could include orange-lit masonry, and removed broad rectangular flicker washes. Eye blink and sparkles unchanged. Offline renderer verified wall sample strips near both foreground braziers remain pixel-identical between animation frames. 72 tests pass; browser opened revised title. Screenshot title-clean-masks-check.png; release642c1f189ebb. No push.

## Title refinements accepted - 2026-10-27
User approved the newest title music and animation revision and explicitly authorized a private GitHub checkpoint/push.

## Standalone Elf defence playtest - 2026-10-28
User approved layout for an isolated test, requested adjustable shield size, shield speed and attack speed. Added /elf-playtest.html, elf-playtest.js/CSS, pure elf-defence-model.js. Uses approved shrine and Elf pose1 unchanged, native470x200 top scene; square200x200 pixel arena lower-left, instructions/buttons/live tuning lower-right. One shield rotates clockwise/counterclockwise via held arrows/A-D or captured pointer buttons; opposite inputs cancel, releasing holds. Defaults60deg arc,240deg/s rotation,35 logicalpx/s attack; sliders20-120deg,90-540deg/s,15-100px/s. Endless practice, one radial wisp at a time, random subsequent angles,0.9s interval after result. Block/miss counts, pause/resume, reset and restore-defaults; blur/hidden pauses and clears held input. Collision interpolates shield angle at orbit crossing, missed attack cannot be caught later. No adventure imports/saves/rewards or integration. 77 tests pass. Browser verified initial block, later misses, pause, all three slider updates and restoring defaults/reset. Screenshot elf-defence-playtest-check.png. Release f7694a17ea24. Pending user feel/control review; no remote push. Previous title commit716e566 is still pending GitHub push after prior DNS failure.

## Dungeon exploration music - 2026-10-28
Added supplied GamePlaySong.mp3 byte-for-byte as dist/assets/audio/dungeon-exploration.mp3. Loops during maze exploration at40% (matching current title music). Same-exploration renders/movement do not restart playback. Accepted room entry pauses and rewinds; returning starts from zero. Gate entry prompt/journal remain exploration. All rooms silent pending user-selected tracks. Toolbar music control supports mute/unmute and blocked-autoplay retry; mute persists only during current session. Delayed play promises cannot leak music into rooms; pagehide stops audio. Main app only: standalone Elf/Ogre playtests and room-art preview remain silent. No save changes/Elf integration. 80 tests pass, including transition, mute, autoplay retry and race checks. Browser verified loop playback, room pause at time0, and resumed maze track from ~0.1s. Screenshot dungeon-music-check.png. No push.

## Held maze navigation - 2026-10-28
User requested continuous held-key travel and silent wall bumps. Arrow keys now repeat through a frame-driven held-key loop, respecting existing movement interpolation/cooldown; latest held direction takes precedence. Release, blur/hidden, gate/encounter or opening panels clears movement. No movement queue across doors. Live runtime wall collisions preserve previous narrative/hint instead of overwriting it; blocked held moves avoid repeated save/render work. Legacy small-world engine retained. Updated maze hint collision expectation; 80 tests pass. Browser held Up1s traversed two tiles and stopped at Ogre gate; held Up against side wall preserved previous text. Screenshot held-navigation-check.png. No push.

## Elf staged defence tuning - 2026-10-29
User requested50deg shield,300deg/s rotation, attack progression65/70/75 and nearly back-to-back final attacks. Standalone playtest updated with these defaults, three successful blocks per stage (provisional count stated to user), stage gaps0.9/0.4/0.08s. Misses do not erase successes; nine blocks complete the trial. Target directions vary, one projectile active at a time; stages advance automatically without pausing. Sliders retained; new-stage attack speed selects next preset. Reset trial restores starting preset; restore-defaults uses current stage. Pure progression and reachability test added;81 total pass. Browser verified initial settings, first successful65-speed block, pause/reset. Screenshot elf-stages-check.png. Still isolated from live Queen encounter/saves/rewards; no push.

## Elf defence pose mapping approved - 2026-10-29
User explicitly accepted proposed role grouping including poses10-13 for explaining defence against the dragon. Locked role pools in dist/elf-defence-poses.js and ELF_DEFENCE_ART.md: ready/teaching1,2; block3; miss5,9; stage6; entire challenge3,6; explanation10-13. Multiple options remain approved pools, not animation sequences. Exact approved-v2 artwork/IDs untouched. This approval records assignments; reaction display and live Queen integration remain pending.

## Elf defence integrated - 2026-10-29
User authorized live integration and environment verification. Queen door now opens shared defence room in same-origin iframe. Original shrine, role-map poses: explanation10-13, ready1/2, block3, miss5/9, stage6, victory6. Three stages50deg/300deg/s with65/70/75 attacks,3blocks each,0.9/0.4/0.08s gaps. Tuning/reset hidden in live room; pause, lesson replay and return always available. Parent validates source/origin, persists monotonic queen.defenceBlocks0-9; nine blocks grants Queen seal once, retaining legacy completion/journal fields required by unchanged dragon validator. Prior Queen rewards retained. Interrupted completion at saved9 re-notifies parent. Standalone playtest remains save/reward-free. Browser through unsaved maze preview verified door, all4instruction poses, block3, return and resumed stage2 with3blocks. Automated tests cover persistence/re-entry/load, no early/out-of-room rewards, one-time seal and save validity;84tests pass. Dragon/Wizard redesign unchanged. No push.

Elf defence stage tuning revised at user request: attack speed/gap 60/0.9s,65/0.4s,70/0.2s. Shared live encounter and standalone model use identical presets. Shield stays50deg at300deg/s; three blocks/stage unchanged.

## Current game checkpoint approved - 2026-10-29
User approved latest integrated Elf tuning and authorized committing/pushing all current game progress to the existing private GitHub repository.

## Wizard mind standalone test — 2026-10-30
User approved layout with large bold choices and a visible spell overlay completely covering original blue staff gem; separate spell indicator rejected. Authorized isolated playtest, no live integration. Match spell color to written name; shuffle four unique choices each spell from seven colors. Initial4s matching ink,3s conflicting ink,2s faster conflicting ink. Provisional three successes/stage for tuning, safe retries. Conflicting tile backgrounds reserved as a possible dragon complication, not implemented.

## Wizard integration approved — 2026-10-30
User approved supplied spell poses and reaction roles and authorized live integration. Final trial prioritizes back-to-back casting over per-answer reactions, with READY/GO cue before trial. Implemented0.18s final gap as initial tuning;4/3/2s answer windows retained. Push deferred until user tests/accepts. Legacy lens/notes maintained for save and dragon compatibility; new story/journal wording remains future refinement.

## 8-bit Iron & Brass interface
The user selected Iron & Brass and approved the pixel treatment. Use warm dark panels, stepped brass borders, beveled buttons, Press Start 2P for short interface labels, and VT323 for longer text. Exploration uses two columns at desktop widths and stacks at narrow widths. Keep approved pixel artwork at its original proportions and keep wizard choices black with readable color lettering.

## Dragonforged final chamber interface — 2026-11-08
User selected Dragonforged for the final dragon chamber. Keep the wide upper scene and two lower panels. Use dark steel borders, crimson insets, pixel claw corner brackets, small center crests and pale rose/ivory type. Initial screen uses approved volcanic lair and Dragon1, blank dialogue and default controls. Final boss rules remain under discussion.

## Dragon introduction and gauge — 2026-11-08
Eight-line opening approved with assigned permanent poses12,11,7,6,4,6,8,10. Supplied vertical red gauge belongs at upper right and is introduced when discussed. Gauge consequences, recovery and final boss minigames will be designed separately.

## Dragon warm-up tuning — 2026-11-08
First round uses three attacks,three defenses,three color choices at the guardians medium practice presets. Interpreted as three successes each,consistent with the lessons,with safe retries while health behavior is deferred. Later medium/final rounds await user testing. Dragon remains centered within equal side lanes,smaller gauge at right.

## Dragon uses guardian arrangements — 2026-11-08
User requested exact guardian interaction arrangements for each boss skill: Ogre horizontal attack window beneath scene,Elf circular arena lower right with controls above text,Wizard compass choices. Gameplay instruction text is removed. Seven supplied color sheets replace synthetic spell cue and use the Wizard shuffle policy.

## Reuse guardian graphics literally — 2026-11-08
User requested source-level reuse of guardian windows,not visual approximations. Share rendering/DOM helpers and matching CSS. Dragon variants change palette and ornamental frames only. Preserve guardian gameplay and approved artwork.

## Dragon meter prototype — 2026-11-08
User set ten levels:10full,1empty. Every miss costs one;every three consecutive correct results restores one up to full. Empty consequences deferred. Use dragon hit reactions16/18/19and player-miss reactions15/6/20. Meter/reaction changes apply to each individual attack,block or color answer. Ten levels use evenly sampled supplied art across the eleven-image sheet.

## Second dragon round — 2026-11-08
User increased easy requirements to4attack/6defence/5mind successes. Pose22says: “You clearly have some skills, but I was just warming up. Let's see if you survive this next round.” Default console/Space continuation. Next round requires5attack/8defence/6mind at guardian final settings:1s crossing,10%target,three passes per target;70attack speed/0.2sgap defense;2s conflicting ink spells. Life meter and streak continue,empty mechanic still deferred. Interpreted “three attempts” as the existing three crossings per strike opportunity,consistent with requiring five successful attacks.

## Final mixed round — 2026-11-08
User requested pose4final-intro dialogue,smaller/faster attack with two passes,immediate subsequent defence shots,and faster colors with distinct word/ink/tile background. Implemented initial tuning850ms/7%,75defence speed/0block gap,1.75s colors.25successes are a shuffled mix of8attacks,8spells,and9blocks organized into3unbroken volleys. Each volley starts near current shield,then arbitrary angles. Misses retain successes and affect existing life meter. Final reward/name reveal and empty-life consequences remain for later design. Unsaved final-round shortcut supports tuning without replaying earlier rounds.

## Zero-life banishment — 2026-11-08
User supplied Defeat.wav and pose27dialogue: “I thought you worthy. Clearly you are no match for me. I banish you!” Space triggers sound-synchronized black fade and random return to one of5maze locations,never entrance. No door/footsteps effect for this transition. Guardian lessons remain;dragon attempt restarts on return. Quest ambience persists on journey back. Zero is now empty,superseding previous1-empty prototype,and every supplied gauge image maps directly to10..0.


## Dragon victory and name reveal — 2026-11-08
Final challenge completion freezes gameplay, hides the gauge, stops dragon music and plays supplied victory.wav once. Pose17 shows “DEFEAT! I have been bested by a true warrior.” Space advances to pose4 and the supplied prize invitation. Victory audio ended triggers ending.mp3 at40%, looping through the ending; mute and cleanup remain supported. Space on the second line fades pose4 out over the unchanged approved lair (900ms), then fades the exact supplied CHAZ plaque background in (1400ms), with stepped opacity and nearest-neighbor rendering. Reduced motion reveals immediately. CHAZ is now the confirmed name, superseding TEST placeholder. Prize completion persists trialCompleted/victory/name without fabricating guardian rewards; reopened earned encounters show the plaque and resume ending music. Legacy placeholder victories migrate to CHAZ. Supplied assets remain exact copies. Standalone unsaved preview: dragon-room.html?playtest=ending; integrated door preview: ?preview=doors&door=dragon&round=ending. Browser verified pose17 → pose4 → plaque. All123tests pass. No push requested.

2026-11-08: Approved enlarged golden opening prologue integrated between title Start and gameplay. Preserve exact supplied wording,black background,existing pixel font,metallic gold sheen,and scroll synchronized to opening.mp3. Hold centered after music ends until Space/click. Initialize dungeon/save only after prologue; local encounter previews bypass it.

2026-11-08: Opening flow uses Space/click, stepped title-to-black before opening music, and credits-to-black then dungeon reveal before dungeon music. Reuse door fade timing/stepping without door SFX. Preserve development preview bypass.

2026-11-09 — Approved reliability pass and rule clarification:
- Perfect dragon attack restores1life immediately,capped at10;ordinary successes no longer trigger three-in-a-row healing.
- All three guardian lessons must be completed before dragon entry;use exact approved unprepared warning and keep maze retreat available.
- Preserve existing difficulty and full-fight restarts;no boss checkpoints.
- Pause all live challenges consistently through menus/focus/page interruptions;recover interrupted audio and artwork without changing approved art.
- Persist boss victory immediately while delaying visible name reveal until plaque.
- Consolidate current specification,prepare lean release and automated checks. No automatic publishing/push.


## 2026-11-09 — Shared dialogue sizing and locked gate copy
The unprepared dragon gate shows only the guardian warning and maze retreat choice. Maze and encounter narrative panes use centered VT323 text at one shared viewport-dependent size, measured against the opening dialogue corpus, maze introduction, door descriptions, farewells and complete journal sample. Continuation prompts retain reserved bottom space. Font size does not change between messages. Browser checks of the longest Wizard opening passage showed no text overflow at 1440×900 (43px), 1280×720 (38px), 1024×600 (31px), and 390×844 (32px). Approved artwork and challenge settings remain unchanged. Browser regression coverage was added; the automated browser runner was not executed locally.


## 2026-11-09 — Approved closing sequence integrated
After the CHAZ plaque reveal, keep the upper frame and exact plaque visible. Fade both lower panels over1.25seconds and scroll the approved congratulations/Dragon’s Book/Press ever onward text upward in the opening golden pixel style at half the original preview speed. After the final line clears, stop ending music and play supplied static.mp3 once. Large dark-red X-13 appears briefly and irregularly through mostly black gaps, then resolves steadily when audio ends. Visibility interruption pauses scrolling/static; blocked audio offers a retry. Saved earned-name re-entry also shows this ending. Standalone ending-preview.html remains available. No difficulty or approved art changes.


## 2026-11-09 — Approved audio entry integrated
User verified the standalone entry in three browsers and approved integration. Initial black screen now asks Press Space Bar or tap to begin. The gesture starts non-looping title music directly at40% before awaiting title art readiness, then reveals the unchanged animated title. Title Play/Mute button removed; in-game sound control retained. Second Space/click enters the existing prologue/dungeon sequence. Includes blocked-audio retry/silent fallback and visibility resume. Initial title is hidden in HTML to avoid a premature visual flash. No adventure storage read/write until entering the game, as before. Added Space/click browser coverage and generalized main-page stylesheet/module cache stamping so the new stylesheet shares the release ID.137local tests pass; final GitHub browser/deploy result recorded in workflow. Standalone audio preview excluded from release package.


2026-11-13: Secret piano entrance uses supplied gold/black eye and rumble; stone wall splits vertically into black, then isolated footsteps and piano fade-in. Normal doors and existing progress remain unchanged. Local review only.


2026-11-13: User approved recessed-eye preview and authorized integration/testing. Use the approved inset with original procedural corridor around it; preserve native pixel resolution and split the complete stone mechanism with the existing opening panels. Local only.


2026-11-13: User requested an instruction-free black upper window with only the piano below. Seven notes now automatically check after the final note ends; wrong entry opens exact feedback and Retry/Return choices. Supersedes the prior explicit-submit/progress UI. Preserve previously unlocked studio access.


## 2026-11-13 — Two octaves and candle success sequence (local only)
Accept either complete E3–B3–A3–G3–E3–C4–B3 or E4–B4–A4–G4–E4–C5–B4 sequence; mixed octaves and longer/random fragments do not unlock. After the seventh note finishes, persist the existing unlock flag and play the supplied correct.mp3 through the piano's unlocked audio context. Seven transparent animated candles appear left to right at recording offsets 0, 0.5, 1, 1.5, 2, 2.5 and 3 seconds, in the user's staggered vertical pattern. Hold all seven for three seconds after the four-second recording finishes, then use the existing two-second fade and same-tab finale navigation. Input and repeated navigation are guarded throughout. Closing cancels audio/animation; visibility pauses the sequence. Reduced motion uses a still candle.

Use the supplied APNG, retaining all 121 frames and transparency, cropped to its shared alpha bounds and nearest-neighbor reduced to 80×130. Original files remain unchanged. Preparation and hashes: tools/prepare-secret-candle.py and art-review/2026-11-13/candle-celebration/asset-record.json. No runtime WebM dependency. The chamber remains blank before success; wrong-attempt behavior is unchanged.

Validation: 157 automated tests pass; 186 Pages asset references pass. Safari manually verified the lower-octave success, seven candles in the supplied arrangement, and same-tab arrival at The Maker's Last Echo entry screen. Both complete octaves, rejection of mixed octaves, candle/audio clock timing, hold duration and cancellation have automated coverage. Physical touch and other browsers remain unverified manually for this addition. No push or publication.


## 2026-11-13 — Return after X-13
After the closing static finishes and X-13 resolves, show a clickable -Press Space Bar- prompt. A fresh Space press or click sends one guarded return request to the parent game. Return to START facing north, clear encounter/gate, stop ending audio, restore maze music/controls, and preserve victory, CHAZ reveal, guardian progress, exploration and musical passage unlock. No New Game/reset is performed. Prompt is unavailable during credits/static. Local validation: 157 Node tests, 186 asset references, and the end-to-end browser test covering credits/static, keyboard return, entrance position and retained victory/reveal all pass. Not yet pushed.


## 2026-11-13 — Title New Game / Resume Game (local)
Replace the title start control with New Game and Resume Game. Resume is available only for a readable existing adventure and resumes directly without opening credits. New Game replays the prologue and creates a fresh adventure; existing progress requires confirmation before replacement. Cancelling leaves the save and title unchanged. Both controls retain the pixel/iron-brass theme, click and focused Space activation; the initial audio-unlock gesture remains. Verification: 157 Node tests, three targeted browser tests (fresh start/prologue, audio entry/save preservation, resume and cancelled/confirmed reset), and 187 Pages references pass. Not pushed.


## 2026-11-13 — Completed adventure map
A saved dragon victory reveals the full maze atlas and all three guardian/dragon landmarks when viewing the maze, including after X-13 return or Resume Game. Rendering does not rewrite visited cells or reset any progress; older completed saves gain this automatically. New Game retains fog of war. Secret entrance receives no map marker. 159 Node tests pass, including full-atlas/landmark visibility, preserved visited cells and new-game fog; 187 Pages references pass. Local only, not pushed.


## 2026-11-13 — Candle reset removed
The supplied candle animation now plays once and holds its final frame rather than looping back into its zoom. Only the APNG animation control/play count and CRC changed; all 121 frame pixels, alpha, timing and size remain unchanged. Preparation tool reproduces play_count=1; hashes updated. Candle asset URL is versioned to avoid cached looping artwork. Melody cues, three-second hold and fade/navigation remain unchanged. 159 tests pass, including an explicit APNG play-count regression. Local only; not pushed.
