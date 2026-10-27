# Current software state

Latest approved-art checkpoint 2026-10-25; initial audit 2026-10-23. Authoritative working folder: `dragon-dungeon/` under the White Elephant Gift local Project mirror. Local Git version control is now established in this folder, with the initial 60-file checkpoint titled `Baseline: verified Dragon Dungeon working version`. Private GitHub origin is configured at https://github.com/cshadwell/dragon-dungeon.git; baseline 03ef24b was pushed. The earlier audit preceded Git initialization. README links here; older milestone documents are historical evidence, not current configuration.

## Baseline and launch
- Native browser ES modules, CSS, HTML and original canvas/SVG art, edited directly in `dist/`. No framework, backend, accounts, third-party runtime packages or bundler. Node runs tests; Python 3 runs the local server.
- `npm start` stamps source and serves `dist/index.html` at http://127.0.0.1:4173/. Header: ENCOUNTER ROOMS / 12. Current asset release hash: `58ca7a61fdaa`; this is a content hash, not a commit or save version.
- `npm test`: **65 tests pass at the current checkpoint**. Existing server need not be restarted for docs. Source changes require `python3 tools/stamp-release.py` before testing/reloading.
- Local-only `?preview=ogre` starts at (35,32), facing north, for an isolated unsaved approach review; it cannot overwrite the adventure save, including after New Game.

## Implemented
- 59×46 supplied maze, 1,452 connected walkable cells; start (58,45), north. Up forward; Down backward without turning; Left/Right quarter turns. 180 ms steps, 320 ms turns, 30 fps cap; reduced motion skips interpolation. No queued navigation during transitions.
- Pixel gray stone, moss-green tiled floor, near-black charcoal ceiling; persistent explored-area map in maze view. Unvisited map cells/encounters concealed. Journal, map key and explicit reset.
- Ogre entry (35,30), one tile before the old (35,29) trigger: timber/iron door rendered on wall (35,28), visible down the corridor and during motion; enter or stay outside. Safe tutorial then directional blocks after a visible snort; flame redirection earns polished shield. Leaving retains progress. Gate is a side-room presentation on the existing tile, not a changed maze wall.
- Wizard (4,22): false mask statements, deduction/proof and lens demonstration; revealing lens reward. Elf queen (56,4): observation, space, consent and restraint; queen seal. Their distinct entrance gates are not yet implemented.
- All active encounters use a shared wide scene above, narrative lower left, actions lower right; map hidden inside, restored outside. Ogre entry prompt remains in maze layout.
- Dragon (0,0): requires all three rewards; combines reflection, timed tell response, false-claim reasoning and restraint. Early arrival safe; return passage after discovery. Independent tablet reveals persistent placeholder name TEST.
- Three health; dangerous mistakes give feedback; zero health restores three at start retaining exploration, items and lesson progress. No finite lives.

## Persistence/configuration
Live adapter `runtime.js`: schema 1; content `maze-encounters-1`; key `dragon-dungeon-maze-adventure-v1`. Valid navigation-only `dragon-dungeon-maze-image-v1` exploration imports with fresh encounters; older prototype key `dragon-dungeon-prototype-v1` stays separate. Gate-less older adventure saves normalize safely. Invalid adventure saves remain preserved until explicit New Game; denied storage permits session play. Browser/origin-specific localStorage; no cloud or cross-device sync.

`engine.js` default CONTENT `dragon-1` and small-world coordinates are retained test/prototype defaults, NOT the live configuration. Use runtime's WORLD for live actions/validation. Relative module imports, HTML entry and CSS must all use one stamped hash. Local server binds loopback and sends no-store.

## Verification and practical limits
Automated: grid reachability/collisions, placement triggers, six discovery orders, narrative outcomes/recovery, one-time rewards, saves/migrations/invalid storage, timing boundaries/suspension, camera interpolation/rendering, map concealment and release-graph consistency. See tests for exact cases; many branches are pure-state tests rather than browser playthroughs.

Earlier recorded browser checks: individual encounters, Ogre visible-snort tutorial/trials, gate entry/retreat, shared Ogre layout and updated gate palette. Actual Safari existing-save movement plus fresh-game/reload passed after cache fix (SAFARI-FIX.md); cause inferred from matching failure signature, cached source bytes not extracted. Current audit re-ran tests, not these historical browser checks.

Not yet established: complete manual large-maze playthrough, real-phone touch/rotation/timing, all four encounters in the new wide layout in browser, fresh-player fairness/pacing, exhaustive focus/storage failure UI cases, hosted QR/device behavior. No unresolved reproduced movement blocker is recorded; no claim of bug-free operation.

## Pending and larger-project dependencies
Other themed entrances; character/art and narrative refinement; navigation usability and hint testing; device/accessibility checks; full route testing. Timing/pacing remain provisional. Final four-letter name must match the actual tested book slider letters. Production hosting/URL/QR, physical lock fabrication/test and final release are open; no deployment occurred. Rune Match remains a separate project.

## Current Ogre presentation

Door is part of the raycast wall, with perspective/occlusion; arrival at (35,30) keeps the corridor/map visible for entry choice. Accepting enters the wide room; leaving retains progress. Previous active Ogre/gate saves at (35,29) relocate safely to the earlier trigger. Maze geometry unchanged.

All Ogre poses use the exact supplied transparent version-2 artwork. Four original sheets plus twelve isolated PNGs live in dist/assets/ogre/. tools/prepare-ogre-sprites.py requires Pillow for extraction only; retained RGBA pixels are verified against source, without background removal, resampling or recoloring. ogre-sprite-data.js stores dimensions/anchors. Runtime uses nearest-neighbor scaling. Attack preparation → steam/snort artwork → original swing. No on-screen SNORT cue word or generated overlay. Historical generated/opaque asset versions were discarded at user request.

Ogre chamber: original code-drawn red masonry inspired by the supplied watermarked preview, supplied cobblestone floor, exact transparent shield image hanging on the left wall. Assets in dist/assets/ogre-room/. Maze gray stone/green floor/charcoal ceiling remain unchanged. Side idle poses are available but unused.

## Latest verification and protection

57 tests pass, including doorway distance/face visibility and migration from the former close trigger. Recent browser checks verified integrated approach, earlier prompt, wide room, isolated poses, visual steam cue with successful tutorial block, transparent v2 assets and red-brick/cobblestone/shield presentation. All directions have source assets; exhaustive visual checking of every direction/device remains pending.

Baseline commit 03ef24b is preserved in history. This checkpoint records subsequent Ogre work; use git log for its commit ID. origin points to the private cshadwell/dragon-dungeon GitHub repository. No production hosting deployment has occurred. The sibling development-checkpoints/ archive preserves the pre-continuity baseline; browser localStorage is not included in Git or that archive. Synced Project Sources are unchanged.

## Character consistency review — 2026-10-25

User is reconsidering character interactions; replacement mechanics are not yet specified. Read-only review of 17 Desktop/Characters sheets identified inconsistent pixel density, notably original Ogre versus its newer poses and finer elf/dragon art. Four-character style samples and a proposed visual contract live under art-review/2026-10-25/. These are pending review; originals and production sprites/behavior remain unchanged. Consistency is the stated priority.

User approved the v2 lineup pixelation and authorized normalizing all 17 supplied sheets (78 source poses) together, preserving poses/identity on uniform 1536x1024 transparent canvases. New derivatives and original source copies are in art-review/2026-10-25/character-sheets-v1/. Runtime artwork and encounter logic remain unchanged; new interaction mechanics are not specified yet. See the batch QA manifest for completed outputs and fidelity review.

## Approved locked character catalog - 2026-10-25

User accepted all 17 normalized sheets unchanged as the game-wide base art. Canonical copies and 78 lossless pose crops are in dist/assets/characters/approved-v1/, with immutable-number policy in CHARACTER_ART.md / AGENTS.md. Counts: Ogre 15, wizard 13, elf queen 13, dragon 37. getCharacterPose(character, number) provides exact lookup; invalid IDs fail explicitly. Numbered guides have labels above each pose, outside approved image pixels. Retained foreground RGBA verified against approved source regions; sheet/pose hashes and stable numbering are now tested. 60 tests pass. Current release hash 830f4095e72a.

No encounter behavior or live character display was replaced by this catalog work; new interactions remain undecided. Existing runtime Ogre art is legacy pending intentional integration. No remote push for this art lock unless separately authorized.

## Individual pose pixel-density revision V2 - pending review

User identified remaining per-pose density differences and explicitly authorized normalization of the existing 78 poses using Elf1 as the benchmark, not another generative redraw. Candidate PNGs, stable IDs, calibrated scale metadata, fixed-integer-zoom gallery and comparison previews are in art-review/2026-10-25/pose-density-v2/. Direct nearest-neighbor RGBA sampling preserves source colors/alpha without interpolation. 78/78 asset checks pass. User review is required before any promotion; approved-v1 and runtime lookup remain untouched.

## V2 baseline approved and promoted - 2026-10-25

User approved all 78 individual density-normalized poses exactly as reviewed. Canonical library and getCharacterPose lookup now point to dist/assets/characters/approved-v2/. Counts/IDs unchanged: Ogre 1-15, wizard 1-13, elf queen 1-13, dragon 1-37. Files were copied byte-for-byte; no artwork regenerated, resized or recolored during promotion. V1 remains archived and protected. V2 generator has an APPROVED.lock guard. Numbered V2 guide is the future reference. 60 tests pass, including PNG hashes/native dimensions and cross-version ID stability. No encounter mechanics or on-screen character assignments were changed; future scene integration must use the approved V2 lookup. Local checkpoint only; no push authorized in this turn.

## In-game room-art preview

Local /?preview=rooms&room=dragon displays the four new room backgrounds and approved-v2 character poses inside the actual encounter layout. Switch among ogre, wizard, elf and dragon; previous/next pose keeps stable IDs. Common native 470x200 canvas, nearest-neighbor background sampling and unchanged native character pixels. Dragon uses the center-darkened lair. Preview is isolated before save loading and never reads/writes localStorage; normal gameplay remains unchanged. Browser checked all four rooms, Elf pose 2 switching, and normal maze restored-save view. Screenshots room-*-preview-check.png. 60 tests pass; source graph stamped cdfda601c2e2. Normal encounter art replacement awaits deliberate integration; this is a visual review mode.

## Current approved visual baseline - 2026-10-25

User accepted all four room backgrounds with the approved-v2 character library in the actual encounter window. Defaults now registered in dist/room-art.js, with exact image hashes/source dimensions in dist/assets/rooms/catalog.json. See ROOM_ART.md. The dragon default is the darkened-center lair. All 78 character images and pose numbers remain unchanged. New background hash/default-reference test brings total to 61 passing tests. Release e5525698eaf8.

The local rooms preview is the accepted visual reference. Existing normal maze/encounter behavior is retained; no new minigame design or full legacy encounter-art migration is claimed. Source files, artwork, scripts, guides, screenshots and continuity docs are included in this Git checkpoint for the user's requested private GitHub backup. The local unpacked review ZIP is a duplicate export and ignored; canonical images and guides are tracked, not deleted.

## Four supplied maze doors - 2026-10-25
User requested all four supplied doors integrated into the corridor wall with one-tile-back entry prompts. Isolated original artwork, removed only edge-connected near-white backdrop, normalized to 112px artwork height in a 128px transparent wall tile using nearest-neighbor sampling. Original preserved; no generative redraw. Perspective, wall occlusion and distance shading shared with stone renderer. Ogre wall (35,28)/trigger (35,30); wizard wall (5,22)/trigger (3,22); queen wall (57,4)/trigger (55,4); dragon wall (0,-1)/trigger (0,1). Maze geometry unchanged. Enter/stay choice for all four; only accepting opens existing wide encounter. Older active guardian saves migrate safely, retaining progress. 63 automated tests pass. Browser inspected all four approaches and Ogre prompt while corridor/map remain visible. Character and room baselines untouched. No GitHub push in this turn.

## Corridor distance darkness - 2026-10-25
Strengthened shared depth shading for walls, integrated doors, floor and ceiling. Nearby surfaces retain the previous brightness through one tile; a quadratic falloff increasingly darkens distant passages toward black. Pixel sampling, texture assets, movement and saves unchanged. Browser inspected Ogre approach; screenshot corridor-depth-check.png. Existing 63 tests pass; release 990b975e4fa5.

## Map-defined proximity hints - 2026-10-25
Traced supplied map2 copy.png at 10px per maze cell; source retained in art-review/2026-10-25/hint-zones/source.png. Walkable zone counts: Ogre 118, wizard 176, elf 115, dragon 130. hint-zone-data.js stores irregular tile boundaries; maze-hints.js stores exact user wording. Successful forward/back exploration steps select destination text; leaving a zone restores the footsteps default. Gate prompts, active encounter feedback, blocked movement and turns retain their established behavior. No save schema or maze geometry changes. Tests exhaustively check movement across zone boundaries in both directions and all four exits, plus collision/turn behavior: 65 pass. Browser verified exact Ogre hint (maze-hint-check.png). Release 58ca7a61fdaa. No remote push.

## Approved maze update checkpoint - 2026-10-25
User accepted the integrated four doors, distance darkness and map-defined proximity hints as the new maze baseline and authorized this GitHub backup. Current release 58ca7a61fdaa, 65 tests passing. Includes supplied door/zone references, prepared assets, source, tests, tools and visual checks. Approved characters and room backgrounds remain unchanged.

## Working title screen - 2026-10-25
Added supplied Dungeon of the Nameless Dragon artwork as a full-viewport opening view, with gold/green Enter the Dungeon button. Original PNG preserved in dist/assets/title/nameless-dragon.png; canvas samples at 480x360 with nearest-neighbor display, 4:3 containment avoids cropping, black letterboxing where needed. No generative changes to supplied art. boot.js waits for button activation before importing app.js and loading the adventure; native button supports keyboard/touch. Reload shows title again, then restores existing save normally. Local preview URLs bypass title. Updated release stamping and cache-coherence test to include boot entry and dynamic imports. 65 tests pass; browser checked title composition and Enter-key saved-game restoration. Source release 7c4a9c91868d. Screenshot title-screen-check.png. No remote push.

## Isolated Ogre attack playtest - 2026-10-26
User approved the attack timing-rail layout and authorized a standalone testable model before game integration. URL /ogre-playtest.html. Practice: repeatable, default crossing 1.8s and 24% target; challenge provisional 3 hits within 5 attempts, 1.3s crossing/16% target. Three crossings (out/back/final), final-opening warning, timeout teaches dragon fire without applying damage. One strike per attempt; stopped marker plus one reaction held 1.2s, then ready pose. Practice hit9/perfect11; challenge miss4-7/hit12-15, single pose selected by attempt rotation; hesitation/unspecified practice miss use ready1. Exact approved-v2 images and armory registry; shared native 470x200 scene. No adventure imports/storage/rewards/integration. Space/Enter or pointer-down Attack; auto-repeat ignored; tab hiding pauses timing. Between-round speed/width tuning and mode/reset controls. Pure timing/pose tests added: 68 total tests pass. Browser verified practice hit9, challenge miss4, timeout warning, tuning controls; screenshot ogre-attack-playtest-check.png. Pixel assets unchanged. Existing title work retained uncommitted. Release 7abfa0708b4a. No push.

## Graduated Ogre attack playtest - 2026-10-26
Updated at user request: practice 1.50s/20%, successful hit unlocks practice 1.25s/15%; second success offers challenge 1.00s/10%. Ogre explains shifting openings. Target centers cycle middle/right/left/offsets between attempts, stationary within each attempt; judging uses actual center. Challenge attempts advance automatically after 1.5s result hold + 0.35s ready cue; first attempt has 0.65s ready cue. Both misses and timeouts advance, with existing provisional 3 hits/5 attempts. Practice remains manually advanced to permit reading instruction. Single approved reaction poses unchanged. No adventure integration or save changes. 69 tests pass, including shifted target timing on all crossings. Browser verified two-step practice success, challenge hit12, automatic subsequent attempts. Screenshot ogre-continuous-playtest-check.png. No push.

## Ogre attack encounter integrated - 2026-10-26
User accepted the revised playtest and authorized integration into the current game; conversation refinement deferred. Existing Ogre gate opens the shared attack encounter in a same-origin frame, using exact approved room/pose assets and current three-pass timing. Gameplay version hides tuning and standalone footer, provides Return to the maze anytime. Main parent owns state/save/reward; frame sends typed practice, victory and leave events, checked against active source and origin. Each successful practice lesson persists ogre.attackPractice (0-2, optional for old saves); re-entry resumes the next lesson. In-progress challenge restarts on retreat/reload; completed reward retained. Victory grants polished shield once, normalizes legacy Ogre completion fields and retains required legacy journal knowledge for the unchanged dragon/save validator. Old completed Ogre saves retain rewards; legacy stages now open attack training. Dragon and other guardians remain unchanged pending redesign. Standalone playtest still has no save/reward effects. Tests cover practice retreat/re-entry/load, one-time reward, valid old-compatible save and non-Ogre reward rejection: 72 tests passing. Browser verified door entry, practice hit9, retreat, and resuming stage2 via isolated unsaved approach. No push in this turn.

## Approved Ogre integration checkpoint - 2026-10-26
User accepted the integrated Ogre attack encounter and requested locking/pushing the current game. This checkpoint includes the title screen, approved layout study, standalone playtest, integrated door entry, practice progression, shifting target, automatic challenge attempts, approved reactions, saved lesson progress and one-time existing shield reward. Conversation remains provisional; other guardians and dragon await their own redesign. Release dc674bfe9cf8; 72 tests pass. This is the current implementation baseline.

## Title music - 2026-10-26
Added exact supplied Title_Screen.mp3 as dist/assets/audio/title-screen.mp3 (~50.52 seconds). Title attempts playback once, no loop; when autoplay is blocked, Play title music button starts it on user gesture. Control permits pausing while on title. Natural end disables replay; Enter the Dungeon immediately pauses/resets music before app import, with late-play race guard. Local preview modes create no audio. Browser confirmed user-gesture playback (paused=false, loop=false, readyState=4) and title/audio removal on game entry. 72 tests pass; release 6680956784b3. Screenshot title-music-check.png. No push.

Title music playback volume set to 40% at user request; original MP3 unchanged.

## Title animation overlays - 2026-10-26
User requested simple themed torch flicker, rising embers, dragon eye blink/glow and hot title backglow. Added title-effects.js: overlays on existing 480x360 pixel grid, stepped warm light near six torch positions, three staggered sparks per foreground brazier, green-eye-only slow blink about every 10s, narrow amber halo around lettering pulsing slowly. Exact title PNG unchanged. 30fps cap, skip hidden tabs, static original for prefers-reduced-motion, cancel animation on entry/pagehide. Title music remains at 40% with no looping. 72 tests pass; offline renderer smoke check confirms different frames and static reduced-motion output. Browser checked rendering/no errors and saved-game entry. Screenshot title-effects-check.png; release 13b42b83ae85. No push.

## More visible title effects - 2026-10-26
User supplied GIF motion references and requested stronger flame movement, eye blinks every 4-5s and sparse sparkle effects replacing title halo. Reworked title-effects.js with flame-color cutouts sampled from unchanged title art; separate working background covers original fire pixels and scanline sway/height variation at 10 poses/sec moves flame tongues while keeping brazier anchors. Existing ember accents retained. Eye blink period4.6s. Three short gold/ivory cross glints per10s on lettering; prior halo removed. All effects use 480x360 nearest-neighbor grid; reduced motion shows exact original image; original PNG untouched. Browser render checked without console errors, screenshot title-flames-sparkles-check.png. 72 tests pass; release097373737680. No push.

## Foreground flame anchor and eye closure correction - 2026-10-26
Expanded foreground flame regions upward and replaced yellow-only selection with connected warm-fire silhouette plus one-pixel border. Working background removes full original flame; original PNG unchanged. Bottom eight flame rows stay fixed to brazier rim; upper scanline deformation meets that anchor without a gap. Hallway torch behavior/title sparkles retained. Blink now covers entire eye area including yellow cores, fully black hold0.18s within4.6s cycle. Offline renderer confirmed closed-eye region RGB entirely zero and inspected fixed flame frame. Browser opened corrected title, screenshot title-flame-anchor-check.png. 72 tests pass; release a0fa9ee3d4a3. No push.

## Clean foreground fire masks - 2026-10-26
Constrained connected-color fire segmentation to hand-bounded flame geometry, removed mask dilation that could include orange-lit masonry, and removed broad rectangular flicker washes. Eye blink and sparkles unchanged. Offline renderer verified wall sample strips near both foreground braziers remain pixel-identical between animation frames. 72 tests pass; browser opened revised title. Screenshot title-clean-masks-check.png; release642c1f189ebb. No push.

## Approved title audio/animation checkpoint - 2026-10-27
User accepted the cleaned foreground flame masks and approved saving/pushing current progress before proceeding to the next encounter. Current title baseline includes one-shot supplied music at40%, autoplay fallback, anchored animated fire with clean masks, complete eye blinks every4.6s and sparse gold glints. Original title artwork preserved; reduced-motion/static and cleanup behavior retained. 72 tests pass; release642c1f189ebb. Ogre attack baseline remains intact; next encounter design has not begun.
