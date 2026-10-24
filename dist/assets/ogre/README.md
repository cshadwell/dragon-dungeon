# Original transparent Ogre artwork, version 2

source-character-v2.png, source-attack-v2.png, source-snort-v2.png and source-swing-v2.png are unchanged copies of the four transparent PNG sheets supplied by the user. They replace all previous opaque references, generated atlas and extracted poses, which have been removed from this asset directory at the user's request. Desktop originals are untouched.

tools/prepare-ogre-sprites.py isolates the three connected figures per sheet into twelve pose PNGs. It preserves supplied RGBA values exactly, including eyes, steam and transparency; no background keying, generation, recoloring, smoothing or resampling. Pixel equality is checked during extraction. Runtime ogre-sprite-data.js records dimensions and positioning. Nearest-neighbor display keeps pixel edges sharp. Sequence: attack → snort → swing.
