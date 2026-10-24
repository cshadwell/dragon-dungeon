# Current Ogre entrance and room

Updated 2026-10-23; supersedes earlier separate-gate/atlas experiments.

Door: original pixel wood/iron artwork sampled on wall (35,28), south face, through the corridor renderer. Visible down the hall, scales with motion, occluded by walls. Entry prompt triggers at (35,30), one tile earlier than the original trigger to retain the full doorway view. Corridor/map remain visible until entry accepted. Active old gate/Ogre saves migrate safely. No maze geometry edits.

Room: wide scene above, narrative below left, actions below right, map hidden. Gray/green maze surfaces remain outside. Inside: red chipped brick (original code artwork based on reference palette), supplied cobblestone floor and exact supplied transparent shield hanging on the left rear wall.

Ogre artwork: four supplied transparent v2 sheets, twelve isolated poses; originals and cutouts in dist/assets/ogre/. No generated redraws, white-background removal or smoothing. tools/prepare-ogre-sprites.py (Pillow) preserves source RGBA and verifies retained pixels. Runtime nearest-neighbor scaling. Sequence is preparation → original steam/snort pose → original follow-through. No flashing SNORT text or synthetic steam overlay. Side idle poses reserved.

Existing safe tutorial, directional trials, timing, rewards, retreat and retained progress remain intact. Localhost ?preview=ogre starts two forward steps from the new trigger and never writes adventure saves.

57 tests pass. Browser verified approach/prompt/entry, original-art tutorial block after visible steam, transparent edges and chamber background/shield. Real phone performance, all directions/animations visually, fresh-player timing/fairness and full route remain pending. Current screenshots: ogre-door-entry-check.png, ogre-transparent-v2-check.png, ogre-red-chamber-check.png; earlier proof images are historical.
