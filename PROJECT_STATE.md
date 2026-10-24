# Current software state

Audited 2026-10-23. Authoritative working folder: `dragon-dungeon/` under the White Elephant Gift local Project mirror. Local Git version control is now established in this folder, with the initial 60-file checkpoint titled `Baseline: verified Dragon Dungeon working version`. No remote is configured. The earlier audit preceded Git initialization. README links here; older milestone documents are historical evidence, not current configuration.

## Baseline and launch
- Native browser ES modules, CSS, HTML and original canvas/SVG art, edited directly in `dist/`. No framework, backend, accounts, third-party runtime packages or bundler. Node runs tests; Python 3 runs the local server.
- `npm start` stamps source and serves `dist/index.html` at http://127.0.0.1:4173/. Header: ENCOUNTER ROOMS / 12. Asset release hash at audit: `0b62ecb75af7`; this is a content hash, not a commit or save version.
- `npm test`: **55 tests passed at this audit**. Existing server need not be restarted for docs. Source changes require `python3 tools/stamp-release.py` before testing/reloading.
- Local-only `?preview=ogre` is an isolated unsaved gate review; it cannot overwrite the adventure save, including after New Game.

## Implemented
- 59×46 supplied maze, 1,452 connected walkable cells; start (58,45), north. Up forward; Down backward without turning; Left/Right quarter turns. 180 ms steps, 320 ms turns, 30 fps cap; reduced motion skips interpolation. No queued navigation during transitions.
- Pixel gray stone, moss-green tiled floor, near-black charcoal ceiling; persistent explored-area map in maze view. Unvisited map cells/encounters concealed. Journal, map key and explicit reset.
- Ogre (35,29): timber/iron gate set in the same gray/green surfaces; enter or stay outside. Safe tutorial then directional blocks after a visible snort; flame redirection earns polished shield. Leaving retains progress. Gate is a side-room presentation on the existing tile, not a changed maze wall.
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

## Recent changes and protection
Small prototype → four skill encounters → retro layout/textures/motion → supplied large maze → approved placements → Safari coherent-cache fix → optional Ogre gate/shared room layout → gate palette alignment. See DECISIONS.md.

Pre-documentation snapshot: `../development-checkpoints/dragon-dungeon-2026-10-23-before-continuity.tar.gz`; companion code manifest verifies unchanged implementation. This is local backup only, excludes browser saves, and is not version control. The initial local Git baseline includes source, tests, tools, configuration, continuity documents and documented verification images. `.gitignore` excludes caches, temporary output, secrets and backups while retaining editable dist/ source. All 55 tests passed before the initial commit. Author identity is configured only for this repository using the user-supplied name/email. No remote connection or push; separate backup remains recommended.
