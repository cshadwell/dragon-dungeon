# Individual pose pixel-density revision V2

Status: APPROVED by the user on 2026-10-25; canonical game-wide baseline V2. 78 individual transparent PNGs, same IDs and source designs as approved-v1. Originals, locked sheets and runtime are untouched. No new image generation or pose interpretation.

Benchmark: Elf pose 1, normalized to 104 logical artwork pixels high before padding. Each output pixel is one logical pixel; previews use identical integer enlargement, never individual fit-to-card scaling. Transparent padding is 8 logical pixels minimum, and canvas dimensions vary naturally with pose aspect ratio. No sheet packaging constraint.

Scale calibration: Elf poses use measured face-height anchors relative to Elf1; Ogre uses green head-width anchors, with side/base poses sharing source scale. Wizard and dragon use manually calibrated base/action scale groups based on source head/body comparisons. This retains source-relative crouch, lean, raised staff and wing/fire reach rather than stretching every bounding box to a common height. Larger dragon reference is approximately 143 logical pixels high. This is an initial review calibration, not a promise of anatomically identical head sizes across differently drawn expressions. Per-pose scale overrides can be adjusted without regenerating art.

Sampling is direct nearest neighbor of original RGBA pixels: no interpolation, smoothing, redraw, recoloring or palette replacement. This removes the resolution discrepancy mechanically; existing shading/design differences in the source are not repainted. Every retained output pixel is verified to be the exact sampled source pixel. Padding alone is newly transparent.

Files: catalog.json records native dimensions, scale, source/output hashes and stable IDs. poses/ holds all 78 PNGs. index.html is the fixed-zoom numbered gallery with before/after comparisons. Four numbered PNG previews use the same 3x enlargement throughout; elf-1-vs-2.png uses 4x. verify.cjs checks exact sampling, transparent padding, hashes and numbering. normalize.cjs / analyze-heads.cjs record reproducible preparation; their local sharp/canvas paths may need updating on another machine.

Promotion complete: canonical copies and lookup now use dist/assets/characters/approved-v2/. V1 remains archived. No approved image pixels or pose numbers changed during promotion. APPROVED.lock prevents accidental regeneration; further changes require a new explicit user instruction and a new review version.

Benchmark calibration: the previous Elf1 silhouette has a dominant 9-source-pixel edge step at its 906px artwork height. 104 native artwork pixels is close to that effective pixel density. All character scale calibrations are reduced by the same 104/128 factor to keep the common logical pixel unit.
