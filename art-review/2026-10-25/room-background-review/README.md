# Room background comparison - 2026-10-25

Read-only audit; no source/background/character pixels or running game files were overwritten. Four generated room PNGs were compared with locked approved-v2 pose 1 for each character.

Forest, armory and wizard sources: 1922x818 (2.34963:1). Dragon source: 1921x819 (2.34554:1). All closely match the intended 2.35:1 encounter window. Locked characters have already been normalized per pose; do not change them to accommodate the rooms.

comparison.png shows current high-detail backgrounds displayed at 940x400 on the left, versus a non-production preview reduced to a common 470x200 logical grid and displayed at 2x nearest-neighbor on the right. Both use the same exact approved character pose at identical scale. Sprite positions are illustrative, not final gameplay staging. Source PNGs remain untouched; only this composite review artifact is saved.

Assessment: shared visual language and composition are suitable. Backgrounds retain more fine texture than characters, particularly foliage, books, lava and rock noise. Recommend common 470x200 logical normalization and nearest-neighbor display before considering a generative style change. Keep useful background detail; scenery does not need the same heavy outlines as actors. Ogre contrast is strong; elf may need subdued central foliage/window contrast; wizard central desk requires staging review; dragon red/orange character and bright lava may compete, so assess subtle background-only contrast reduction behind the actor. No such contrast edit or production normalization is performed here.

No game tests run for this audit because game source, approved art and behavior did not change. source-audit.json records original hashes/dimensions. This is a recommendation, not approval or installation of room art.

## Dragon contrast revision v1
User authorized central background darkening. dragon-darkened-v1.png is the separate edited empty room (1920x819), retaining the source's approximate 2.35:1 composition. Central lava/rocks/sky/floor are subdued while outer flames remain bright. Original Desktop background remains unchanged. dragon-contrast-before-after.png composites the exact same approved Dragon pose 1 at the same native pixel scale onto both versions for comparison; the character SHA was verified unchanged. Pixel-grid background previews are illustrative only. No game files or other room backgrounds changed. See dragon-darkening-audit.json for dimensions/source hashes and measured central luminance (61.88 original vs 30.06 revised at the sampled comparison region).
