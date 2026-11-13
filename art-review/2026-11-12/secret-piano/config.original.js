// Creative placeholders: approve the tag melody, octave, reference policy and pacing before fabrication.
export const config = {
  storageKey: 'white-elephant.makers-musical-finale.v1',
  notes: [{letter:'C',midi:60},{letter:'D',midi:62},{letter:'E',midi:64},{letter:'F',midi:65},{letter:'G',midi:67},{letter:'A',midi:69},{letter:'B',midi:71}],
  entryMelody: ['C','E','G','E','D','C'], // DEVELOPMENT ONLY: not approved for Winston's tag.
  words: ['A','FADED','AGE','DEFACED'],
  timing: {note:0.52,gap:0.24,wordGap:1.15},
  reference: 'revealable',
  challenge: {
    storageKey: 'white-elephant.makers-stanzas.v1',
    parchmentImage: 'aged-parchment.png',
    poemStanzas: [
      ['I once had love in youthful days', 'We found our joy in simple ways', 'A life for us to share'],
      ['Then came a dream, a single spark', 'Its promise drew me to the dark', 'With none beside me there'],
      ['I gave my life to wood and stone', 'and lost the hands that held my own', 'No glory had replaced.'],
      ['I swore to hold the years at bay,', 'Yet carved the heart of life away'],
    ],
    stanzaGapMs: 250,
    // Measured final note decay below -60 dBFS, plus 0.20 seconds of release.
    // Playback endpoints leave the original recordings available in full.
    piano: {
      blackKeysEnabled: true,
      recordedNotes: 25, // Correct_Piano.mp3, then Last_Five.mp3: ascending white and black keys.
      volume: 0.85,
      whiteEdges: [57, 197, 339, 479, 617, 756, 893, 1029, 1165, 1304, 1438, 1574, 1712, 1853, 1992, 2116],
      blackBounds: [[143,242],[298,399],[558,657],[706,804],[854,954],[1107,1206],[1261,1361],[1514,1613],[1665,1765],[1816,1915]],
      artworkWidth: 2172,
      artworkHeight: 724,
      keyTop: 66,
      whiteBottom: 674,
      blackBottom: 440,
    },
    pianoImage: 'Antique Handcrafted Piano Keyboard.png',
    stanzas: [
      {audio: 'Stanza1.mp3', endAt: 16.86, sharp: 'Cozy cottage hearth with sleeping basset.png', blurred: 'Cozy cottage hearth with sleeping basset copy2.png'},
      {audio: 'Stanza2.mp3', endAt: 16.12, sharp: "The Maker's First Spark.png", blurred: "The Maker's First Spark copy2.png"},
      {audio: 'Stanza3fix.mp3', endAt: 16.43, sharp: 'Carved hands, empty chair.png', blurred: 'Carved hands, empty chair copy2.png'},
      {audio: 'Stanza4.mp3', endAt: 19.40, sharp: 'The maker’s unwritten ending.png', blurred: 'The maker’s unwritten ending copy2.png'},
    ],
  },
  prologueClips: ['assets/1.mp3', 'assets/2.mp3', 'assets/3.mp3'],
  visuals: {
    image: './assets/final-room.png',
    dustDensity: 144, // Dense fine dust, with a few blurred foreground motes.
    particleVisibility: 0.82,
    glowStrength: 0.60,
    beamOpacity: 0.34,
    hazeOpacity: 0.23,
    entranceSwirlSeconds: 9,
    entranceSeconds: 5,
    puzzleAtmosphere: 0.38, // Relative intensity after the piano becomes available.
    doorway: {left: 11, top: 20, width: 22, height: 61}, // Percent of the original image.
  },
  workbenchVisuals: {
    workbench: true,
    dustDensity: 104,
    particleVisibility: 0.92,
    glowStrength: 0.46,
    beamOpacity: 0.34,
    entranceSeconds: 2,
    entranceSwirlSeconds: 0,
    puzzleAtmosphere: 0.38,
  },
  writingVisuals: {
    workbench: true,
    writing: true,
    candleVariation: 1.6,
    puzzleAtmosphere: 0.38,
    dustDensity: 28,
    particleVisibility: 1.1,
    glowStrength: 0.82,
    beamOpacity: 0,
    entranceSeconds: 2,
    entranceSwirlSeconds: 0,
  },
  completion: 'The last echo settles. You have heard what time concealed. Your journey is complete. Leave your name, and the Maker may place the gift in your hands.',
};
