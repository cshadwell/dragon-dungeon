# Dungeon of the Nameless Dragon

A pixel-art maze adventure with three guardian lessons and a three-round dragon challenge.

The authoritative rules, approved artwork and current behavior are in [CURRENT_SPEC.md](CURRENT_SPEC.md). [AGENTS.md](AGENTS.md) contains development instructions. [PROJECT_STATE.md](PROJECT_STATE.md), [DECISIONS.md](DECISIONS.md) and [README_HISTORY.md](README_HISTORY.md) preserve history; older mechanics are superseded.

## Run locally

From this directory, use Node24 and Python3:

```sh
npm start
```

Open http://127.0.0.1:4173/. Runtime has no package dependencies or build step. `dist/` is editable source. Saves remain local to this browser; New Game requires confirmation.

## Verify changes

After editing JavaScript/CSS/HTML:

```sh
python3 tools/stamp-release.py
npm test
```

Development-only browser tests:

```sh
npm ci
npx playwright install chromium
npm run test:browser
```

The GitHub workflow runs core and browser checks on pushes and pull requests. A prepared workflow is not an observed GitHub run. Current testing limits are recorded in PROJECT_STATE.md.

## Prepare a release

```sh
npm run package
```

This creates an **unpublished** copy in ignored `build/`, omitting historical approved-v1 character art and the standalone opening preview. Original assets remain in the repository. It does not host, deploy or push anything.

## Development previews

- `/?preview=doors&door=ogre` (also wizard/elf/dragon)
- `/?preview=doors&door=dragon&prepared=0` reviews the locked gate warning
- `/opening-preview.html` is the original standalone opening design
- `/dragon-room.html?playtest=ending` reviews the victory reveal

Main-app development previews do not write to player saves. The prepared dragon preview seeds completed lessons only in its isolated in-memory state.

Approved assets must retain their reviewed bytes,pose numbers and native pixel density. See [CHARACTER_ART.md](CHARACTER_ART.md) and [ROOM_ART.md](ROOM_ART.md).
