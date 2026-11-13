# Secret musical passage — local implementation, not published

The supplied marked map (590 × 460, ten pixels per cell) places the new purple marker at cell **34,43**, using zero-based coordinates. The screenshots face east at that dead end: the marked wall is **35,43, east-facing approach**. The eye is rendered on that wall's near face, within one brick, with a transparent click/touch target only when standing at the entrance facing east. No map cells, encounter placements, or ordinary movement rules were changed.

The original supplied eye file is retained as `dist/assets/secret/eye-original.png`. Its current Desktop/DD copy is a transparent brass medallion; its 64 × 56 nearest-neighbor display lookup is separate from the original. The chamber uses existing stone pixels, a dim light, and a simple handmade wooden piano. It is an isolated overlay; exiting restores the same dungeon location and facing and stops all piano voices.

## Independent piano

Source: https://github.com/cshadwell/makers-last-echo, inspected on 2026-11-12. Inspected sample-piano.js, config.js, style.css, index.html, challenge.js, samples.json and piano tests. Archived source module/config/tests in art-review/2026-11-12/secret-piano. The musical finale repository was not changed.

The dungeon vendors the keyboard artwork, all 15 white and 10 black WAV recordings, and samples.json. Geometry, key layering, volume and sample mixer approach are adapted from SamplePiano. All 25 keys play. There are no third-party dependencies, synthesized tones, or runtime requests to the musical game's scripts or assets. Asset SHA-256 hashes are recorded alongside the source archive.

**Pitch audit:** filenames do not document pitch. Spectral inspection found a chromatic F3–F5 recording series, with strong overtones that can obscure the lower fundamentals. The dungeon maps the physical C-pattern keyboard to C3–C5 and tunes each unchanged recording using Web Audio playbackRate. Measured frequencies and tuning ratios are in secret-pitches.js and the archived pitch-verification.json. `python3 tools/verify-secret-pitches.py` rechecks lower fundamental bands and confirms tuned pitches within three cents. It does not infer pitches solely from sample filenames or select the strongest overtone.

Required sequence: E4 → B4 → A4 → G4 → E4 → C5 → B4. These map to white-10, white-14, white-13, white-12, white-10, white-15, white-14 after tuning. This sequence and destination are never printed in player-facing messages.

Each accepted gesture records once, synchronously, before asynchronous sound loading. Pointer compatibility clicks and held keyboard repeats are suppressed. Seven notes cap the entry; black/wrong notes consume entries. Submission plays the complete submitted sequence and awaits the actual final audio tail before evaluating. Incorrect attempts reset without penalty. Clear resets and stops voices. Playback, closing, and navigation have separate guards against duplicate or obsolete actions.

Correct entry adds only `musicalPassageUnlocked: true` to the existing save, retaining the established save key and all other fields. Missing flags in older saves default to false. Unreadable saves retain the existing protection. Already unlocked chambers show Enter the studio. The whole chamber and light fade over two seconds (instant with reduced-motion preference), then location.assign navigates in the same tab to https://cshadwell.github.io/makers-last-echo/. That destination's normal entry/prologue owns its audio permission. Returning through browser history removes a restored black chamber overlay.

## Local checks

Run release stamping before the normal test suite. `npm test` includes melody, sample geometry/tuning/assets, input duplicate suppression, audio-tail/cancellation, wall orientation, and legacy save preservation tests. `python3 tools/check-pages.py dist` validates local references under repository paths.

Manual Safari checks completed: eye entry, black key counting, Clear, wrong seven-note submission/playback/retry, exact correct sequence, same-tab finale entry screen, browser Back, unlocked re-entry, chamber exit, and facing away/back. No actual dungeon save was reset: the local preview does not write game progress.

Local review: http://127.0.0.1:4173/?preview=secret (unsaved entrance); append &unlocked=1 for bypass review. Preview only works on localhost/127.0.0.1. Normal gameplay persists the flag.

Remaining manual coverage: physical touch devices and other browsers; the new passage was not used to replay every existing guardian/endgame path. Existing automated regression checks pass. No publication or push is authorized for this change yet.


## 2026-11-13 — Secret wall entrance treatment (local only)
The supplied gold/black eye copy is preserved separately and rendered with nearest-neighbor pixels, 25% larger than the initial marker. On tile 34,43, the narrative reads: “A familiar eye stares back at you. You hear faint music playing from behind the wall. The urge to reach out and touch it is overpowering.” Clicking starts the supplied rumble, 900ms shake, then 2600ms vertical two-panel stone opening over black. Fade the entire game to black over1250ms while fading the rumble; play a separate footsteps-only WAV trimmed from3.30s to the end of the existing6.74s door recording, then reveal the piano over950ms. Existing normal door audio remains unchanged. Input is locked during entry; cancellation and audio failure clean up safely; visibility suspends animations/audio. Reduced-motion preference removes movement/fades. No publication.


## 2026-11-13 — Approved recessed eye integrated (local only)
Replaced the flat marker with the approved preview's larger brass relief and recessed stone surround. Archived approved preview and derived169×160native-pixel transparent inset under art-review/2026-11-13/recessed-eye and dist/assets/secret/recessed-eye.png. Surrounding corridor bricks remain the existing procedural renderer; generated background bricks are excluded from the inset. Perspective sampling and click bounds share its enlarged UV placement. The same captured corridor canvas supplies both opening panels, so the complete medallion/retaining stones split with the wall. Opening sound, footsteps-only cut, fades, piano logic and saved state remain unchanged.151Node tests and185Pages references pass; Safari opening sequence and chamber return reviewed locally. No publication.


## 2026-11-13 — Quiet piano and automatic attempts (local only)
Latest user decision supersedes the introductory chamber picture/text, progress indicators, Clear and Play this melody controls. First entry shows only the empty black upper frame and sampled keyboard beneath it. Every seven deliberate notes automatically form one attempt; wait for the seventh sample's actual tail, then evaluate exact pitches/order without replaying the sequence. Incorrect attempts open a centered themed modal: “Hmmmm. That doesn't sound quite right.” with Try again and Return to the maze. Retry clears the attempt and stops old voices; return closes the chamber. Escape remains a keyboard exit. An already unlocked chamber retains Enter the studio. Correct attempts retain the durable unlock, two-second black fade and same-tab finale navigation. Audio/asset failures have a recovery modal, not permanent instructions. Original piano artwork, all25keys, samples, entry wall animation, saves and other encounters are unchanged.153Node tests pass, including actual controller callbacks for last-note gating, retry/return, obsolete note completions and one-time success navigation. Safari checked the minimal layout, automatic wrong-attempt modal, retry and automatic correct melody. No publication.


## 2026-11-13 — Two octaves and candle success sequence (local only)
Accept either complete E3–B3–A3–G3–E3–C4–B3 or E4–B4–A4–G4–E4–C5–B4 sequence; mixed octaves and longer/random fragments do not unlock. After the seventh note finishes, persist the existing unlock flag and play the supplied correct.mp3 through the piano's unlocked audio context. Seven transparent animated candles appear left to right at recording offsets 0, 0.5, 1, 1.5, 2, 2.5 and 3 seconds, in the user's staggered vertical pattern. Hold all seven for three seconds after the four-second recording finishes, then use the existing two-second fade and same-tab finale navigation. Input and repeated navigation are guarded throughout. Closing cancels audio/animation; visibility pauses the sequence. Reduced motion uses a still candle.

Use the supplied APNG, retaining all 121 frames and transparency, cropped to its shared alpha bounds and nearest-neighbor reduced to 80×130. Original files remain unchanged. Preparation and hashes: tools/prepare-secret-candle.py and art-review/2026-11-13/candle-celebration/asset-record.json. No runtime WebM dependency. The chamber remains blank before success; wrong-attempt behavior is unchanged.

Validation: 157 automated tests pass; 186 Pages asset references pass. Safari manually verified the lower-octave success, seven candles in the supplied arrangement, and same-tab arrival at The Maker's Last Echo entry screen. Both complete octaves, rejection of mixed octaves, candle/audio clock timing, hold duration and cancellation have automated coverage. Physical touch and other browsers remain unverified manually for this addition. No push or publication.
