# Current software state

Audited 2026-10-23. Authoritative working folder: `dragon-dungeon/` under the White Elephant Gift local Project mirror. Local Git version control is now established in this folder, with the initial 60-file checkpoint titled `Baseline: verified Dragon Dungeon working version`. Private GitHub origin is configured at https://github.com/cshadwell/dragon-dungeon.git; baseline 03ef24b was pushed. The earlier audit preceded Git initialization. README links here; older milestone documents are historical evidence, not current configuration.

## Baseline and launch
- Native browser ES modules, CSS, HTML and original canvas/SVG art, edited directly in `dist/`. No framework, backend, accounts, third-party runtime packages or bundler. Node runs tests; Python 3 runs the local server.
- `npm start` stamps source and serves `dist/index.html` at http://127.0.0.1:4173/. Header: ENCOUNTER ROOMS / 12. Current asset release hash: `94a4c0988f32`; this is a content hash, not a commit or save version.
- `npm test`: **57 tests pass at this checkpoint**. Existing server need not be restarted for docs. Source changes require `python3 tools/stamp-release.py` before testing/reloading.
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
