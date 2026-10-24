# Dragon Dungeon — Full maze with approved encounters

**Current baseline:** [PROJECT_STATE.md](PROJECT_STATE.md) · [Development instructions](AGENTS.md) · [Decisions](DECISIONS.md) · [Larger Project handoff](PROJECT_HANDOFF.md). Audited 2026-10-23: 55 tests pass; release hash `0b62ecb75af7`. Run `npm start` / `npm test` from this folder. Local Git baseline established. No remote or production deployment. Subsequent sections record milestones; their counts and prior configuration are historical.

Historical prototype notes begin below. The live content version is `maze-encounters-1` (schema 1); `dragon-1` is the retained engine default. The user approved replacing the earlier untimed guard trials with a safe tutorial followed by timed reactions. This supersedes the reference blueprint's no-reflex baseline for this encounter. Reference files remain unchanged; recommend updating the master blueprint after review.

## Safari cache fix — October 23, 2026

Mixed cached engine/runtime files could render an open corridor while movement and save validation used the former small maze. All assets/imports now carry a consistent content hash; npm start uses a no-store local server. **53 tests pass**, including release-graph consistency/hash freshness and the small-world/large-world mismatch regression. Actual Safari existing-save movement, fresh New game movement and reload verified. No save clearing required. [Diagnosis and evidence](SAFARI-FIX.md).

Start with `npm start`. After editing source while the server runs: `python3 tools/stamp-release.py`, then `npm test`, then reload the browser. Release tests enforce re-stamping if source content changes.

## Current mode: full maze encounters — October 23, 2026

All four encounters are active at the map2.png dots: orange ogre (35,29), blue wizard (4,22), green queen (56,4), purple dragon (0,0). Start remains southeast (58,45). Map markers reveal only after visiting. Existing explored maze paths import with fresh encounter progress. Both older saves remain separate and untouched. Current key: dragon-dungeon-maze-adventure-v1. All **51 tests passed**, including navigation to all triggers and six discovery orders through victory. Browser import/presentation checked; full manual route and real-phone testing pending.

[Placement and verification record](PLACEMENTS.md) · [Full placement comparison](encounter-placement-check.png)

## Previous navigation-only study — October 23, 2026

The live app now runs the supplied 59×46 maze with 1,452 walkable cells. Start at the lower-right red dot, facing north. At that earlier milestone, encounters were disabled for navigation review; the original adventure source/save is preserved separately. Current textures and smooth movement retained. The map fills only as you explore. Use New game to reset this maze, not the earlier adventure.

[Trace, source and verification record](MAZE.md). [Full trace comparison](maze-trace-check.png). `dist/runtime.js` was the maze-only adapter and now supplies the live adventure world; `dist/maze-data.js` is the editable grid. All **43 tests passed**, including full connectivity and collision checks. Browser first-step/reload/return checks passed. Full manual traversal and real-phone testing remain pending.

Earlier sections below record prior milestones; the current mode above supersedes the navigation-only pause on encounters.

## Stone and moss surfaces — October 23, 2026

Gray chipped/beveled pixel stone walls, moss-green square floor tiles, and a faintly mottled near-black charcoal ceiling now replace the earlier surface palette. `dist/textures.js` builds original repeatable 128×128 texture samples once, following the supplied watermarked stock previews as style references; no preview pixels were imported or watermarks removed. The ceiling retains the earlier small-grain pattern with a neutral dark-gray palette. The renderer samples surfaces in world coordinates, including intermediate movement poses. Geometry, timing, encounters, and save data unchanged.

All 40 existing tests passed. Browser screenshot inspected for stone detail, green floor joints and visible-but-dark ceiling; proof: stone-moss-check.png. No new real-phone or full-route manual tests claimed for this aesthetic change.

## Motion study — October 23, 2026

Forward/back steps now interpolate through one cell; left/right turns sweep through a quarter turn before settling. Initial timings based on the attached recording: 180 ms steps, 320 ms turns, 30 fps presentation cap, fixed camera height. Adjust MOTION in `dist/movement.js`. Menus/input lock until completion; collisions remain stationary and encounters appear after arrival. Reduced-motion setting uses immediate transitions. Reload or suspension settles at a valid saved destination. No save migration required.

40 automated tests passed, plus browser movement/turn/encounter-arrival checks. See [movement and research record](MOVEMENT.md) for recording observations, source-search findings and verification limits. No verified original Double Dungeons source/disassembly located; this is an original visual approximation, not a confirmed reuse of the original rendering method.

## Visual study — October 23, 2026

Layout follows Collin's Photoshop reference: first-person scene upper left, permanent explored map upper right, text/choices lower left, movement/menu buttons lower right. Original procedural 256×216 canvas corridor renderer uses gray brick, teal ceiling and rust floor with nearest-neighbor enlargement. No game screenshots or external textures are bundled. Current maze geometry remains the existing small prototype; reference map layout was not copied.

The persistent map uses the same visited cells and world adjacency as movement. It shows only visited rooms/landmarks and short visible opening stubs. Map key (M) explains symbols; it is no longer needed to see the map. Existing saved exploration remains revealed; New game gives a fresh black map after confirmation.

Encounters display existing provisional character illustrations in the main viewport and narrative/choices in the panel below. Menus also use that panel. Close menu with its X, Escape, or M/J. Movement and menu buttons lock during encounters; timed cues now target the illustration in the main viewport. The map stays visible during encounters, including phone-width layout. At narrow widths the top two panels remain side by side, with narrative and controls stacked below. Real-phone usability still unverified.

Source additions: `dist/corridor.js`, `dist/explored-map.js`; presentation changes in index.html, style.css, app.js. No engine/save schema/content migration change. **37 automated tests passed**, including new renderer determinism/facing checks and map fog/landmark concealment, alongside existing route/recovery/reaction coverage. Browser inspected new desktop corridor, live map and panels; completed an ogre timed right block using the moved visual cue. Menu close/movement checked in browser. No fresh-player, physical-phone or full manual route retest claimed for this presentation iteration. Screenshot: retro-layout-check.png.

## Dragon addition

Basic start-to-finish route is playable, including early dragon arrival/retreat and all three discoveries in any order. The new dragon room (4,2) branches east from (3,2), midway down the east side of the loop. D marks the discovered chamber. First discovery opens a lantern passage: retreat to the checkpoint from any idle dragon phase, and Return to dragon at the lantern. The map shows only visited rooms and explains the passage after discovery.

Dragon sequence: prepare rightward flame reflection → start attempt → wait for visible nostril/ember tell → block high with ↑ → use lens → deduce binding from two false claims → recognize surrender → apply queen’s seal → independent tablet reveal. See [dragon record](DRAGON.md) for full solution and test evidence.

The saved victory can be reopened through Earned name or journal at any time during exploration. Development answer **TEST** is explicitly marked as a placeholder and does not claim to open the physical book. Configuration: `NAME_CONFIG` in `dist/dragon.js`. Replace only after checking the actual lock. Prior queen-1 saves retain all valid progress; dragon starts undiscovered. No deployment or physical lock test performed.

## Elf queen addition

All three creature encounters are playable. The queen occupies a new one-cell branch at (2,4), south of the lower loop midpoint. Follow the lower corridor from the lantern one cell east, then turn south into the court. Q marks the discovered queen location; the map canvas was enlarged to include this branch without revealing unvisited cells.

Her untimed encounter teaches observation, trust and restraint. Several helpful approaches succeed. Raised thorns warn against reaching; folded thorns, lowered head and open path signal surrender. Reward: Queen’s seal and two journal notes. See [queen record](QUEEN.md) for solution/recovery/testing details. Prior `wizard-1` saves retain shield, lens and all previous progress, adding only fresh queen state. No reset needed.

## Wizard addition

The wizard lives in the north alcove at (2,0), already part of the temporary map. Ogre and wizard can be completed in either order. Visit the wizard by following the north corridor from the lantern, turning east at the wall, moving one cell, turning north and entering the alcove. Interact button revisits completed encounters. The map marks discovered wizard location with W, completion with ✓.

Wizard source: `dist/wizard.js`; UI and scene/map integration in `dist/app.js`; durable state and migrations in `dist/engine.js`; tests in `tests/wizard.test.js`. See [wizard encounter record](WIZARD.md) for walkthrough and test details.

`ogre-2` saves upgrade with position, health, explored map, shield and ogre progress retained; wizard starts uncompleted. No automatic reset. Reward inventory supports both items. Wizard evidence/phase survives retreat, reload and checkpoint recovery.

## Run and play

1. From this directory run `npm start` and open http://127.0.0.1:4173 . No dependencies/build step. Checks: `npm test` with Node 18+.
2. Find the ogre at the northeast corner of the temporary loop. Arrows navigate; M map, J journal.
3. Start safe practice. His overhead/left/right stance signals the required guard. Wait for flared nostrils, white breath and SNORT text; then press ↑/←/→ or tap a block button. Practice mistakes cost no health.
4. Pass three trials, then complete the untimed flame-reflection lesson to earn the shield. Each attempt starts explicitly. Slower timing is available before attempts. Completed trials survive retreat and checkpoint recovery.

Existing preview progress may be completed. Use confirmed New game to start over. Old saves preserve map/health/position and earned shield; completed old guard trials are honored rather than revoked. A separate localhost origin was used for fresh browser checks, leaving the original 127.0.0.1 save separate.

## Encounter P05-OGRE — The shield keeper

Intended experience: learn that every creature has a tell. Ogre stance reveals direction; a snort reveals timing. All directions use the player's viewpoint. Temporary geometric art provides raised club poses, enlarged nose, breath puffs and a visible SNORT cue. Short swing/impact feedback follows the response; reduced-motion mode preserves all essential static cues. No sound required or currently included.

The ogre supplies a practice shield and explains the tell. Safe practice uses an overhead blow and 1,400 ms response window. A successful practice unlocks three trials (high, left, right). Each begins with a varied 1,100–2,300 ms windup. The visible snort starts the 700 ms block window, or 1,150 ms with Slower timing enabled. Values are initial tuning choices, not established accessibility or difficulty targets. Timing option applies to this open page; it is not saved across reloads.

Early input, wrong direction and late/no response have distinct feedback. The first response resolves the attempt once. Repeated held keys do not produce repeated blocks. Wrong trial response costs one health; zero returns to the lantern with three health, retained map and completed trials. Practice mistakes and flame mistakes are safe. Retreat is available between attempts; during an active attempt the menus are locked. Switching away, losing window focus or a frame gap over 300 ms cancels the attempt without damage. Active layout hides explanatory text and keeps the nose/cue/buttons together.

World, inventory and narrative state save after meaningful actions. Attempt timing is transient: reloading restarts the current setup without another penalty or consuming a success. Correct trials persist. Pure timing rules live in `dist/reaction.js`; requestAnimationFrame uses a monotonic browser clock, starting the response window when the snort is rendered. A delayed/suspended frame cannot silently skip the cue.

Private walkthrough: complete safe high block; high, left, right trial blocks after their snorts; reflect right into the brazier. Reward: Polished shield and journal notes about tells, stances and flame redirection. No other encounter prerequisites. Potential bypass: guessing/source inspection; no anti-cheat. Final production name, hosting and physical integration remain open. Difficulty/pacing are unmeasured. No physical materials, fabrication or electronics required.

## Source and persistence

- `dist/ogre.js`: editable narrative, lesson directions, reward/knowledge.
- `dist/reaction.js`: pure timing creation, ticking and response classification.
- `dist/engine.js`: deterministic durable outcomes, world, save validation/migration.
- `dist/app.js`: browser timing lifecycle, keyboard/touch buttons, map/journal/UI.
- `dist/ogre-art.js`: original SVG stances, snort and reflection diagrams.
- `dist/index.html`, `dist/style.css`: responsive layout, animation/reduced-motion rules.
- `tests/`: engine/persistence tests and pure timing boundary tests.

Historical small-prototype save key `dragon-dungeon-prototype-v1`, schema 1, content `dragon-1` (not the live adventure key). `prototype-1` saves retain geography and retire the temporary token; `ogre-1` saves retain completed trials/shield and update journal text. Invalid saves remain unmodified until explicit reset. Storage failure allows session play with a warning. Origin, browser profile, private browsing and clearing-data limitations apply; no cross-device synchronization. Copy the single localStorage key before resetting a suspect save. No deployment occurred.

## Test evidence

35 automated tests passed locally (Node v24.15.0): movement/world, tutorial safety and gating, trial outcomes, retained recovery progress, one-time rewards, flame choices, narrative save round trips, both prior content migrations, invalid/denied storage, early/wrong/late blocks, exact response boundary, practice/slower timing, varied windup and suspended-frame pause.

Manual Codex in-app browser on separate localhost save: tutorial high block after visible snort succeeded; normal 700 ms high trial succeeded; deliberately early left block cost exactly one health with specific feedback; retry retained first trial; slower left block after visible snort succeeded. Snort screenshot visually inspected: nose/breath, direction and touch controls appear together. Reload during setup retained tutorial progress. Final engine guard/progression and unchanged flame/reward behavior are covered automatically; the prior untimed build also had full browser route verification.

Not yet verified: fresh-player fairness/difficulty, physical phones and rotation, touch timing on real hardware, all timed stages in browser, real browser denied storage, exhaustive background/blur/reload timing cases. Frame timing tests do not replace device testing. Production QR and physical book/name integration remain open.


## Encounter rooms milestone (23 October 2026)

The Ogre now has an oak-and-iron gate at the established maze location. Arrival asks whether to enter; declining keeps the player in the maze. Entering opens the shared encounter layout: wide scene above, narrative lower left, actions lower right, with the map hidden. Leaving restores the map and retains lesson progress. Other character-specific gate designs are still pending.

55 automated tests pass, including gate entry/decline/re-entry and save round trips. Browser checks confirmed entry, the wide layout, a successful timed tutorial block, and returning to the maze. Local `?preview=ogre` opens an isolated, unsaved gate preview without replacing adventure progress. See OGRE-ROOM.md for implementation notes.
