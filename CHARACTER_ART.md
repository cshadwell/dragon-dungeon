# Approved character artwork and stable pose IDs

V2 locked by user approval on 2026-10-25. This is the authoritative game-wide character-art baseline.

**Do not redraw, regenerate, restyle, recolor, smooth, white-key, trim, overwrite or replace these approved images without a new explicit user instruction.** Pose extractions preserve original foreground pixels; only reference guides carry numbering. Keep poses separate and render with nearest-neighbor scaling.

Canonical assets: dist/assets/characters/approved-v2/. The 78 individual PNGs are byte-identical copies of the reviewed pose-density-v2 outputs. Each pose has its approved native logical resolution, transparent padding and natural aspect ratio; Elf pose 1 is the pixel-density benchmark. Do not resize and resave them, change their palette, smooth them, or regenerate them. Use only nearest-neighbor display scaling, with a shared pixel scale rather than stretching every sprite to fill a box. catalog.json records exact PNG hashes, dimensions and IDs. approved-v1 remains an archived superseded baseline, not the reference for future scene work.

## Stable numbering

Numbers are global within each character, not restarted on each sheet. Sheet order is fixed below; within a sheet use left-to-right, top-to-bottom. Existing IDs NEVER change, including if new poses are added: append new numbers after the current maximum.

| Character | Sheet | Pose numbers |
|---|---|---|
| Ogre | ogre-base | 1-3 |
| Ogre | ogre-dodge | 4-7 |
| Ogre | ogre-emotions | 8-11 |
| Ogre | ogre-hit | 12-15 |
| Wizard | wizard-base | 1-1 |
| Wizard | wizard-emotions | 2-5 |
| Wizard | wizard-response | 6-9 |
| Wizard | wizard-spells | 10-13 |
| Elf | elf-base | 1-1 |
| Elf | elf-emote | 2-5 |
| Elf | elf-emotions | 6-9 |
| Elf | elf-defense | 10-13 |
| Dragon | dragon-base | 1-1 |
| Dragon | dragon-emotions | 2-13 |
| Dragon | dragon-damage | 14-22 |
| Dragon | dragon-fire | 23-28 |
| Dragon | dragon-spells | 29-37 |

## Lookup and review

getCharacterPose("dragon", 3) in dist/character-art.js returns Dragon 3, its exact image URL, approved sheet/cell and native crop dimensions. listCharacterPoses(character) lists registered poses. Invalid IDs throw; never silently substitute another pose. Elf queen aliases resolve to elf.

Canonical numbered HTML guide: art-review/2026-10-25/pose-density-v2/index.html. Four character-specific numbered V2 PNG guides are alongside it. Printed numbers live outside sprite pixels.

The guide refers to exact poses; it does not select new gameplay mechanics. Current live encounters retain earlier assets until connected to these IDs; no encounter logic changed by locking this library. Future character integration MUST use these registered images; older runtime assets are legacy and must not become the reference for new art.

Verification: The earlier lock-character-library.py is a V1 extraction tool and must not be used to regenerate V2. The V2 review generator is guarded by APPROVED.lock. Tests verify every canonical PNG hash, native dimensions, exact lookup, invalid IDs and unchanged V1-to-V2 numbering. Keep a Git checkpoint; no automatic remote push.
