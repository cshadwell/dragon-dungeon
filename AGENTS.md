# Dragon Dungeon development continuity

Browser dungeon for P05 of the White Elephant Puzzle Experience. This folder is authoritative for software implementation; the parent Project sources govern the wider physical adventure. Parent instructions still apply. Never edit synced `../sources/` or alter reference assets as part of routine game work.

## Start each session
Read this file, PROJECT_STATE.md, DECISIONS.md, then relevant current source/tests. Inspect Git status/history; local Git version control was established after the 2026-10-23 audit. Prefer inspected code and latest explicit user decisions over old conversation examples or historical docs. Identify discrepancies; ask about unresolved material conflicts before changing behavior. Never silently restore superseded functionality.

## Architecture and commands
- `dist/` is editable source, despite its name; no bundler/build output regeneration. HTML → app.js → runtime.js → engine.js with the large WORLD configuration. Engine defaults retain a small test world; do not substitute those coordinates into the live game.
- `maze-data.js`: world grid; `runtime.js`: live placements/save adapter/gate; `engine.js`: deterministic rules/validation. Character modules contain encounter logic/views; reaction.js timing; movement.js interpolation; corridor.js/textures.js rendering; explored-map.js map; app.js browser orchestration.
- From this folder: `npm start` (Python 3 server, 127.0.0.1:4173), `npm test` (Node ES modules, built-in test runner). No package dependencies/install step. Trace tool additionally requires Pillow and the reference maze image; do not regenerate the approved grid casually.
- After JS/CSS/HTML edits run `python3 tools/stamp-release.py` BEFORE tests/reload. This stamps the complete module graph with a content hash. Keep no-store serving and versioned imports; stale mixed modules caused Safari movement/save failures.

## Preserve
Full approved maze/start/placements, fog-of-war map, smooth movement, original gray stone/green floor/charcoal ceiling, three independent guardians and combined dragon challenge. Preserve safe retreat, retained progress on recovery, one-time rewards, protected invalid saves, migrations/separate save keys, explicit New Game confirmation, and independent persistent name reveal. Keep Ogre gate entry optional and shared wide encounter layout; all four themed gates use the supplied door library. Do not replace TEST with a production name until physical lock constraints are confirmed. Do not reset saves to fix code.

## Change workflow
Make targeted edits in the existing compact ES-module style; separate pure rules from UI/timing. Preserve validated durable state and transient animation separation. Inspect and protect existing local work; never discard/reset/overwrite it. Before substantial changes run available checks and recommend a Git checkpoint. No destructive Git operations or automatic remote pushes. Architectural changes or replacement of working behavior require user approval.

Run appropriate tests after code edits, and inspect affected browser behavior for UI changes. Record exact verification and limitations; tests do not establish phone usability or fresh-player fairness. Update PROJECT_STATE.md when implementation changes, DECISIONS.md for significant decisions, and this file for persistent instructions. End substantial sessions with changes, tests, unresolved issues and next steps. Keep planned, implemented and tested work distinct. Do not deploy or change physical puzzle stages without authorization.

## Approved character artwork: mandatory game-wide rule
Read CHARACTER_ART.md and the locked catalog before any character-art work. The user approved ALL 78 individually normalized poses on 2026-10-25 as the permanent base for every pose. Canonical assets: dist/assets/characters/approved-v2/. Use getCharacterPose(character, number) from dist/character-art.js. Counts: Ogre 1-15; Wizard 1-13; Elf queen 1-13; Dragon 1-37. IDs are stable, never renumbered or silently substituted.

DO NOT regenerate, redraw, restyle, recolor, smooth, white-key, trim or overwrite these approved sheets/poses without a new explicit user request. Numbers belong in separate guides, never on game sprites. Pose extraction preserves exact source RGBA; use nearest-neighbor display. Hash tests protect all approved sheets/poses. Old Ogre v2 runtime assets are legacy only until the interactions are rebuilt; they do not supersede this library. New character integration must select registered approved poses. Append future approved poses after current maximum; never reuse a retired ID.

Keep exact supplied shield on the left rear wall; chamber red masonry/cobblestone differs deliberately from gray/green maze. Current entry wall (35,28), trigger (35,30). Pixel library generators require Pillow only when preparing assets; ordinary launch/tests do not. The lock generator refuses to overwrite an existing approved catalog.

V2 is the final user-approved individual-pose density baseline (Elf pose 1 benchmark), superseding V1 sheet-based normalization. Preserve native logical resolution, variable aspect ratio and transparent padding. Use integer nearest-neighbor scaling in game/review; never fit each pose independently to fill a standard box. No automatic renormalization or palette changes. V1 stays historical only.

## Approved room/background defaults
Read ROOM_ART.md before scene work. The exact four images in dist/assets/rooms/ are user-approved defaults: armory/ogre, study/wizard, shrine/elf, center-darkened lair/dragon. Use getRoomArt(character) and getCharacterPose(character, number); no legacy or regenerated substitutions. Do not change image pixels, background contrast or sprite resolution without new explicit authorization. Preserve common 470x200 logical rendering and nearest-neighbor scaling. Room and character hash tests must pass. Room preview is the accepted visual specification; upcoming interaction redesign must integrate this library while preserving existing gameplay until deliberately changed.

## Four maze doorways
Supplied Doors.png is preserved in art-review/2026-10-25/doors/source.png. Four isolated nearest-neighbor 128x128 wall-grid assets live in dist/assets/doors; maze-doors.js defines their wall faces and earlier trigger tiles. All entry prompts retain the corridor/map until accepted. Wizard trigger (3,22), queen (55,4), dragon (0,1), Ogre (35,30). Preserve migrations for older close-tile saves and discovered-dragon visited state. Local ?preview=doors&door=ogre|wizard|elf|dragon is unsaved approach testing.

Title entry: index.html loads boot.js; normal launch shows supplied title art before app.js is dynamically imported. Preserve delayed save initialization and local preview bypass. Release stamping covers dynamic imports as well as static imports.

Ogre attack training is now integrated through the existing door using the shared ogre-playtest.html / ogre-playtest.js / ogre-attack-model.js module. Standalone playtest remains available. The parent owns saves/rewards; accept only messages from the active same-origin encounter frame. Preserve practice-stage persistence and one-time shield reward compatibility. Old snort tutorial code remains historical/test support, not the live Ogre UI. Dragon/other guardian redesign remains pending.

Elf defence is integrated through her existing maze door using the shared elf-playtest.html and pure elf-defence-model.js. Parent owns saved queen.defenceBlocks and one-time Queen seal reward. Standalone URL remains isolated. Frame messages must match active frame source and same origin. Preserve approved role poses and shrine artwork.

Elf defence reaction roles are user-approved in ELF_DEFENCE_ART.md and dist/elf-defence-poses.js. Preserve those role pools and use exact approved-v2 IDs; poses10-13 are for her defence-against-dragon explanation.

Wizard additions2026-10-30: gallery lookup now includes Wizard14–34 from separate wizard-spells-v1 catalog (seven colors × three poses). Original approved-v2 Wizard1–13 and all78baseline assets remain unchanged. See CHARACTER_ART.md and art-review/2026-10-30/wizard-spell-poses/index.html; new additions await visual approval before being called a new locked baseline.

Wizard mind encounter now uses wizard-playtest iframe through existing door. Parent owns wizard.mindCorrect0–9 and one-time lens; validate active source/origin as other encounters. Four arrow-key/click compass choices, unique words/inks,4/3/2s stages. Final READY/GO then0.18s gaps without reaction poses; earlier reactions6/5/4,stage3,victory9,welcome2. Original spell assets now wizard-spells-v2 (white correction), IDs14–34 unchanged. Preserve earlier approved-v2 assets. Dragon remains legacy pending redesign.
