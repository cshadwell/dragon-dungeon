# Step and turn transitions — October 23, 2026

User request: use attached Double Dungeons TurboGrafx-16 recording as the visual reference for transitions, and research original source if available.

## Reference inspection and research

Inspected the supplied 17.083-second recording locally with AVFoundation. First produced 0.25-second contact frames, then exact-tolerance frames at 30 samples/second over 7.9–9.9 seconds. Inspection files are temporary in /private/tmp/dragon-video. Sandbox video decoding initially produced empty extraction; authorized local decoder execution succeeded. No recording uploaded to a third party or bundled into the game.

Observed: fixed-height first-person view, discrete grid steps with brief perspective progression and settling, and quarter-turn sweeps through angled views. In the inspected region, rapid forward progression occurs around 8.50–8.63 seconds; an angled turn sequence appears around 8.83–9.20 seconds. These are approximate visual estimates, not source timings or input-to-frame measurements. The current 180 ms step and 320 ms turn are initial tuning values; frame-for-frame equivalence is not claimed.

Searched for Double Dungeons source code, disassembly, disasm, decompilation, rendering/engine and GitHub repositories. No verified original source release or game-specific disassembly located. Search hits included game metadata rather than a rendering implementation. In particular, the MAME software catalogue entry is ROM metadata, not the game engine source: https://sources.debian.org/src/mame/0.251%2Bdfsg.1-1/hash/pce.xml . An original manual scan is available at https://www.tg-16.com/contributors/bernie/Double_Dungeons/Double_Dungeons.pdf ; it was not used as evidence for renderer internals. Do not attribute our interpolation technique to the original developers. No ROM, proprietary source, original textures or original intermediate frames were imported.

## Implementation

`dist/movement.js`: tunable MOTION values, pure position/heading interpolation, explicit left/right quarter-turn wrap. Current settings: step 180 ms, turn 320 ms, maximum 30 rendered frames/second. Linear progress, no bob, blur, zoom-only shortcut or camera shake. `dist/corridor.js`: accepts continuous camera pose and raycasts from its actual in-cell position, retaining pixel resolution and repeating textures. Reuses the canvas across frames.

`dist/app.js`: commits/saves the validated destination once, locks all input/menus for the transition, renders intermediate poses and reveals arrival map/compass/encounter at completion. Extra input is ignored, not queued. Wall bumps remain stationary. Entering a creature cell completes the visual step before showing the creature and choices. Teleport shortcuts/recovery are still instant. Reduced-motion preference skips the transition. Tab suspension/window blur finishes at the valid destination; reloading mid-transition restores the saved destination, never a fractional position. No save schema or world logic change.

## Verification and limits

40 automated tests passed. Added tests cover forward/backward half/end poses, no-op wall collision classification, all cardinal left/right wrap cases, and distinct intermediate frames across a cell boundary. Existing route, save, reaction and map tests still pass. App syntax check passed.

Browser: observed an intermediate angled turn frame with locked controls; confirmed compass settled East and controls unlocked; stepped into dragon chamber and saw encounter only after arrival; used return passage to checkpoint; further turn completed normally. Screenshot movement-check.png records the presentation. Existing save/rewards retained.

Still pending: user comparison of feel against recording, real-phone frame pacing/latency, manual reduced-motion/background/reload testing during transitions, and a full fresh-player route test. Original game's exact implementation remains unverified. Recommend tuning durations first after play review, then assessing whether projection/art adjustments are needed for closer visual matching.
