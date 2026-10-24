# Ogre gate and encounter screen

Implemented 23 October 2026. The existing Ogre tile (35,29) serves as a side-room entrance. Original SVG timber planks, iron braces, rivets and a ring handle appear in the maze view. Arrival asks whether to enter. Declining permits continued exploration; the entrance can be approached again. No maze walls or encounter placements changed.

Entering starts or resumes the Ogre lesson. The shared encounter layout expands the main scene across the top, hides the map, places text below left, and moves encounter actions below right. Existing reflex keyboard/button inputs and rewards remain available. Leaving restores maze navigation and preserves training progress. The other encounters share the layout, but their themed entrance art and entry prompts are not implemented yet.

Runtime gate state is validated and saved. Older adventure saves without a gate field remain accepted; active saved Ogre lessons resume inside. The localhost-only `?preview=ogre` route starts at the gate and never writes adventure progress.

Validation: 55 Node tests passed; browser verified gate prompt, enter, tutorial block after the visible snort, retreat and restored map. Screenshots: ogre-gate-check.png and ogre-room-check.png. Real phone/touch timing and fresh-player difficulty still require testing. Character artwork remains provisional.

Palette follow-up: gate walls and floor now reuse wallPixel/floorPixel from textures.js, matching the gray stone and moss-green maze palette. Verified in browser; 55 tests passed.
