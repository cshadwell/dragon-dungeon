# Character style study — 25 October 2026

Status: user approved style-study-v2.png as the shared pixelation standard on 2026-10-25; batch generation authorized. No production artwork, game rules or source was replaced. User's priority is consistency, with character identities and approved poses preserved. The broader interaction redesign remains unspecified; do not implement new minigames from this art study.

## Inputs
17 PNG sheets in Desktop/Characters: Ogre (4), Wizard (4), Elf queen (4), Dragon (5). All contain an alpha channel with transparency. source-manifest.json fingerprints the four base references. Originals remain untouched. original-comparison.png is a review layout using source artwork; its resizing is presentation only, not a replacement asset.

## Observed discrepancies
Original Ogre Character2 has much coarser pixels than Ogre emotion/action sheets. Wizard is relatively cohesive but detail varies across sheets. Elf hair/costume shading is finer than Ogre. Dragon scales, wings and effects carry the greatest detail. Equal PNG dimensions do not imply equal sprite resolution: sheets hold different numbers of poses.

## Approved visual direction
- One shared logical pixel grid, visible at the same scale in all four characters. Start around 96–128 logical pixels for humanoid height, with a larger dragon at the same pixel scale; compare at actual display size before locking numbers.
- Black silhouette outline about one logical pixel thick, consistent corner treatment. No smooth edge interpolation.
- Three or four deliberate shading tones per material; broad color clusters instead of gradients/noisy microtexture.
- Preserve each character's identity, costume, equipment, colors and supplied pose repertoire. Do not standardize all bodies to the same size or alter expressive silhouettes.
- Consistent palette relationships and lighting, while retaining distinct signature colors.
- Anchor poses to a stable foot baseline and head/body scale. Keep effects separate and pixel-consistent; transparent backgrounds and pose isolation required.
- Source protection: new review derivatives only, no overwriting originals or replacing the live Ogre v2 assets until the user approves the sample.

## Review workflow
Compare four base poses at intended display scale; approve a small lineup, then standardize one character's complete pose family and inspect every pose. Test on the game background and at normal/reduced sizes before continuing to the next character. Do not apply unreviewed mass sheet generation.

style-study-v1.png is an initial generated study, not accepted: it retains excessive pixel-density differences, particularly coarse Ogre versus detailed dragon/elf. A second targeted study addresses a single coarse pixel grid. Generated samples are visual proposals, not certified production sprite sheets or mechanically grid-perfect outputs.

## Second sample assessment
style-study-v2.png is the user-approved direction: dragon scale noise is reduced, shading and stepped edges are closer across the lineup, with signature colors and key equipment retained. It is a generated interpretation, so costume microdetails and shapes still need fidelity review against originals. A mechanically uniform native pixel grid is not certified. The user subsequently authorized applying this visual direction to all 17 supplied sheets while preserving poses and identities. These are new library derivatives, not installed runtime replacements.

Game source and original character sheets were unchanged during this study. No runtime tests were rerun because only review artifacts and status documentation changed. Next decision: approve or adjust this visual density, then pilot one complete character pose family before touching the rest.
