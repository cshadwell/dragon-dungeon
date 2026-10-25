# Cohesive character-sheet batch v1

Requested 2026-10-25 after approval of ../style-study-v2.png as the shared pixelation standard.

## Scope
17 original sheets, 78 poses: Ogre 15, wizard 13, elf queen 13, dragon 37. Preserve each sheet's original pose count, order, actions, expressions, equipment and signature colors. Target all output sheets at 1536x1024, transparent RGBA, following the approved lineup's pixel density, stepped outlines and simplified shading.

originals/ contains unchanged copies of the supplied Desktop/Characters PNGs. source-manifest.json fingerprints them. sheets/ contains new edited derivatives, never overwrites the source. The live game still uses its existing artwork and mechanics; this batch is a standalone library for the revised interactions, which are not yet specified.

Each original sheet is edited individually against the same approved style reference. No sheet or pose is intentionally removed. Single-pose and multi-pose sheets have different available cell sizes, so a common sheet canvas does not imply equal per-pose bounding boxes or final game scale. Runtime normalization/anchors will be needed when integrating.

A batch manifest records output files, actual dimensions and quality review. Review generated character details against original images before integration; generation is not a guarantee of pixel-identical poses or mechanically uniform grid structure. Effects, weapon reach, wing spread and silhouette can require fidelity corrections. Contact sheets are review aids; originals and final-size sheets are authoritative for inspection.

## Completed review
All 17 final PNGs are 1536x1024 with alpha transparency. Visual overview confirms the original pose counts and reading order (78 total); visible foreground does not touch the outer canvas borders. Six sheets received fidelity corrections to remove invented comic marks/spell flourishes. Elf defense received a final source-based correction retaining its original bottom-left contact sparkle. Check composited previews rather than hidden RGB values under alpha=0 when assessing backgrounds.

qa-manifest.json includes dimensions, transparency, visible bounds and hashes. review.html provides side-by-side originals/results with selectable backgrounds; batch-overview.png shows the full library. ../Dragon-Dungeon-Character-Sheets-v1.zip contains the 17 final sheets, overview, approved style reference, README and QA manifest. Original sources are preserved in originals/ and unchanged on Desktop.

These are generated style-normalized derivatives, not pixel-identical originals or guaranteed mechanically identical animation frames. Pose anchor/scale tuning and in-game integration remain future work. No running game code was changed, no new interaction design implemented, and no GitHub push performed for this art batch.

APPROVED AND LOCKED 2026-10-25. User accepted every sheet exactly as shown. Canonical runtime-ready copies and exact pose-cell crops are now in dist/assets/characters/approved-v1/. See CHARACTER_ART.md and numbered/index.html for the permanent numbering rule. All labels are outside approved artwork; no source pixels were changed. Future integration must use this locked catalog, not regenerate the library.
