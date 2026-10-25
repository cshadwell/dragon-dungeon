# Approved room and character defaults

Approved 2026-10-25 after review in the actual encounter window. These four backgrounds and approved-v2 characters are the visual baseline for future gameplay scenes. Do not redraw, replace, recolor, darken, smooth, crop or otherwise edit approved image files without a new explicit user instruction. Preserve originals and use new versions for separately authorized revisions.

| Character | Approved background | Character library |
|---|---|---|
| Ogre | dist/assets/rooms/ogre-armory-v1.png | approved-v2, poses 1-15 |
| Wizard | dist/assets/rooms/wizard-study-v1.png | approved-v2, poses 1-13 |
| Elf queen | dist/assets/rooms/elf-shrine-v1.png | approved-v2, poses 1-13 |
| Dragon | dist/assets/rooms/dragon-lair-darkened-v1.png | approved-v2, poses 1-37 |

Use getRoomArt(character) from dist/room-art.js and getCharacterPose(character, number) from dist/character-art.js. Room defaults point to pose 1; scene-specific choices use the permanent pose numbers. The default dragon room is the darkened-center revision, never the original brighter lair. The approved files are unchanged from the accepted preview.

Rendering contract: background sampled on a 470x200 logical canvas; characters retain their approved native logical dimensions and aspect ratio. Use nearest-neighbor scaling, consistent pixel scale and independent character/background layers. Never auto-fit each pose to fill a box or resave the sprites at display resolution. Native room source images stay full-resolution, protected by hashes in dist/assets/rooms/catalog.json. Native character images are protected by their approved-v2 catalog.

Reference preview: http://127.0.0.1:4173/?preview=rooms&room=dragon (localhost only). All four room and numbered-pose controls work without reading or writing adventure saves. Normal maze and existing encounter mechanics remain intact; the preview is the visual specification for the forthcoming interaction redesign, not a newly implemented minigame or completed gameplay-art migration.

Tests verify all four background hashes/dimensions, darkened dragon default, valid locked character references, pose hashes and permanent numbering. Future scene integration must use this common registry instead of recreating artwork or choosing legacy assets.
