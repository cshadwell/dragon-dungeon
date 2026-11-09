# Dragon Dungeon development continuity

This directory is the authoritative software project for the wider White Elephant adventure. Parent instructions apply. Never edit synced ../sources/ or alter reference assets as routine cleanup.

## Start here
Read CURRENT_SPEC.md, then current code/tests and relevant art documentation. CURRENT_SPEC.md is the present specification; PROJECT_STATE.md and DECISIONS.md retain dated historical entries that may be superseded. Inspect git status and preserve all local work. Prefer inspected code and latest explicit user decisions over old examples. Do not restore retired mechanics.

## Commands and architecture
- dist/ is editable source, not generated output. No runtime build/dependency step is required.
- index.html → boot.js → opening-scene.js → app.js. Boot defers saves and dungeon music until the opening/reveal finishes. Development preview routes bypass prologue.
- runtime.js adapts engine.js to maze-data.js,live placements,save migrations and guardian/dragon rewards. Engine legacy rules stay for compatibility; do not substitute its small-world coordinates into live navigation.
- npm start starts localhost4173 and stamps release imports. After JS/CSS/HTML edits run python3 tools/stamp-release.py BEFORE npm test or browser reload. Preserve no-store serving/versioned module imports to avoid Safari mixed-version bugs.
- npm test runs Node rules/save/audio/art/syntax tests. Playwright is a development-only dependency; npm ci and npx playwright install chromium precede npm run test:browser. Report actual runs, not assumed CI results.
- npm run package creates a lean unpublished build/ copy, retaining originals in Git. No automatic deploy/push,destructive Git operations,or save reset.

## Preserve
Approved full maze/start/placements,fog of war,smooth movement,gray wall/green floor/charcoal ceiling,independent guardians,shared encounter controls and Dragonforged boss. Doors stay visible down corridors and prompt on earlier trigger tiles. Keep invalid saves protected,old saves migrated,lessons/rewards one-time,and New Game confirmed. Player storage and editor previews must remain separate.

## Current rules
- All three completed guardian lessons are required for dragon entry; visits alone are insufficient. Show the exact CURRENT_SPEC warning and allow maze retreat. Preserve already-earned old wins.
- Dragon meter loses1per miss and gains1ONLY on perfect attacks, capped at10. Remove any assumption of three-success healing. Keep current difficulties/goals and full-fight restarts; no boss checkpoints.
- Save victory at final success,then save prizeRevealed on actual plaque reveal. Resume victory dialogue after reload without replaying the fight. CHAZ is the confirmed name, superseding TEST placeholder. Do not expose it in journal before reveal.
- Shared challenge-pause.js guards menu,focus/visibility and page interruptions across all four challenges. Independent reasons must not clear one another. Preserve onscreen/keyboard parity and clear held input across interruption.
- All scene audio must recover from interruptions,retain mute,and stop/reset on deliberate scene changes. Prologue has resumable playback and bounded silent fallback. Fades use door-equivalent1250/950ms ten-step opacity without incidental door SFX on startup.
- Shared guardian-games.js/css supplies attack rail,defence arena and color choices; boss changes palette only. Keep gameplay text minimal.

## Locked artwork
Read CHARACTER_ART.md and ROOM_ART.md for art changes. Original78approved-v2 poses are canonical (Ogre1–15,Wizard1–13,Elf1–13,Dragon1–37). Wizard spell additions14–34 use wizard-spells-v2; Dragon38–58 use dragon-spells-v1. Stable IDs and exact reviewed RGBA bytes are mandatory. Use getCharacterPose/getRoomArt; never redraw,recolor,smooth,white-key,trim,overwrite or renumber without new explicit authorization. Numbers belong in guides,not sprites. Preserve native dimensions,transparent padding and nearest-neighbor display. Room logical rendering470×200 remains approved.

Four room backgrounds,door library,title,shield and supplied CHAZ plaque retain exact canonical images. Keep historical sources/approved-v1 in repository,not the lean release package. Asset timeouts/retry/prefetch must not change image pixels. Hash tests must pass.

## Verification and reporting
Make targeted changes rather than rewriting working legacy code. Separate transient timing/animation from durable state. Run relevant tests and browser checks; tests do not establish fresh-player fairness or phone usability. Record changes,current settings,actual verification and limitations in CURRENT_SPEC.md/PROJECT_STATE.md; record significant decisions in DECISIONS.md. Never claim a push,deployment,test run or document update that did not happen.
