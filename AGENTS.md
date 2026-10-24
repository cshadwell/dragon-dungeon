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
Full approved maze/start/placements, fog-of-war map, smooth movement, original gray stone/green floor/charcoal ceiling, three independent guardians and combined dragon challenge. Preserve Ogre snort reflex tutorial/trials, safe retreat, retained progress on recovery, one-time rewards, protected invalid saves, migrations/separate save keys, explicit New Game confirmation, and independent persistent name reveal. Keep Ogre gate entry optional and shared wide encounter layout; other themed gates remain pending. Do not replace TEST with a production name until physical lock constraints are confirmed. Do not reset saves to fix code.

## Change workflow
Make targeted edits in the existing compact ES-module style; separate pure rules from UI/timing. Preserve validated durable state and transient animation separation. Inspect and protect existing local work; never discard/reset/overwrite it. Before substantial changes run available checks and recommend a Git checkpoint. No destructive Git operations or automatic remote pushes. Architectural changes or replacement of working behavior require user approval.

Run appropriate tests after code edits, and inspect affected browser behavior for UI changes. Record exact verification and limitations; tests do not establish phone usability or fresh-player fairness. Update PROJECT_STATE.md when implementation changes, DECISIONS.md for significant decisions, and this file for persistent instructions. End substantial sessions with changes, tests, unresolved issues and next steps. Keep planned, implemented and tested work distinct. Do not deploy or change physical puzzle stages without authorization.
