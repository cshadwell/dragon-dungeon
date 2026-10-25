# Decisions and superseded approaches

Recorded from inspected code, current user requests and existing milestone evidence on 2026-10-23. Implementation dates below follow those records; reasons are limited to what is established.

| Decision | Basis / reason | Replaces / consequence |
|---|---|---|
| Plain static ES modules with separated rules/content/rendering/persistence | Current implementation; handoff recommends a small maintainable static app | No framework/backend selected; dist is editable source |
| Three independent guardians: Ogre, wizard, elf queen, then combined dragon | User selected characters to teach skills and grant equipment/advice | Generic placeholder encounters replaced; discovery order remains flexible |
| Safe Ogre tutorial, directional input after snort; tell teaches timing | Explicit user request for skill and creature tells | Supersedes initial handoff no-reflex rule/untimed choices; preserve slower option and safe practice |
| Dragon applies reflection, tell response, deduction and restraint | User requested combining three learned skills | Name comes from independent evidence; TEST stays a development placeholder pending book lock |
| Retro first-person console with always-visible explored map | User Photoshop layout and Double Dungeons visual reference | Supersedes map-only-on-demand presentation; fog of war retained |
| Smooth interpolated steps/turns, original renderer | User recording reference; no verified original game source found (MOVEMENT.md) | Replaces jump transitions; do not claim original engine or frame-exact equivalence |
| Original code-drawn gray stone, green tiles, charcoal ceiling | Latest explicit user palette references | Replaces earlier surface colors; stock preview pixels/watermarks not used |
| Supplied 59×46 maze with southeast start | User maze.png, ignore letters/symbols | Replaces compact prototype in live runtime; prototype defaults/tests retained |
| Ogre/wizard/queen/dragon at map2 dot coordinates | Explicit user placements | Supersedes prototype placements; see PROJECT_STATE.md for live coordinates |
| Navigation-only phase ended; four encounters active | Subsequent user placement request implemented | MAZE.md describes historical study, not current mode |
| Separate live save key and configured WORLD | Preserve earlier saves while moving to large maze | Old small-world state not blindly loaded; import exploration deliberately, preserve invalid saves |
| Coherent hashed module graph + no-store local serving | Safari false-wall/save symptom resolved with coherent refresh | Prevent mixed cached revisions; stamp after every source edit (SAFARI-FIX.md) |
| Optional Ogre wood/metal gate; shared wide encounter screen | Latest user mockup: enter prompt, no map inside, text left/actions right | Replaces automatic Ogre interaction on arrival; other themed gate designs pending; no grid changes |
| Gate surrounds use same gray stone/green floor | Latest explicit user instruction | Replaces plain gate backdrop; wood/iron gate retained |
| Software truth lives here; wider puzzle truth in Project references | User continuity request, 2026-10-23 | Current-state docs supersede stale milestone claims; synced sources remain untouched |

Future changes: record decision, established reason, superseded behavior and consequences here. Do not invent retrospective reasons or treat suggestions as approved.

## Local version control — 2026-10-23

User authorized Git initialization in dragon-dungeon and an initial verified baseline commit. Track editable dist source, tests, tools, configuration, documentation and referenced verification images; ignore local secrets, caches, backups and temporary/generated test reports. This replaces unversioned-only development. Keep the existing snapshot; do not configure a remote or push without authorization.

## Integrated doorway — 2026-10-23

User reference requires the door to exist on the maze wall and be visible before arrival. Replace the full gate-scene swap with pixel sampling on the existing north end wall of the Ogre corridor; preserve geometry and entry tile. Only accepting entry switches to the wide room. Door renders with the same perspective, shading and occlusion as stone.

User requested the Ogre trigger one tile earlier because the final approach was too close. Trigger moved to (35,30); wall/maze unchanged. Existing active close-up saves migrate to the new trigger.

User selected the supplied Ogre Character, Attack and Swing artwork as the interaction basis. Replace geometric placeholder with a transparent derivative atlas, preserve original references, and map pose changes to existing reaction phases without changing timing or outcomes.

Original-art fidelity update: all displayed Ogre poses now use isolated cutouts of the supplied Character, Attack, Snorting Ogre Attacks and Swing sheets. No generated atlas is referenced at runtime. Preparation → original steam/snort pose → original follow-through uses existing timing; on-screen SNORT word/overlay removed. Pixel colors preserved in retained foreground, no resampling during extraction, nearest-neighbor display. Browser safe practice succeeded using the visual steam cue.

User supplied transparent v2 Ogre sheets and requested discarding all earlier artwork versions. Use supplied alpha directly; isolate poses without background heuristics or redrawing. Supersedes white-keying/extraction and generated-atlas approaches.

User chose red brick walls and cobblestone floor specifically for the Ogre chamber, with exact supplied shield hanging behind him on the left. Maze palette stays gray/green. Stock wall preview is style reference only; original red-brick rendering avoids importing its watermark.

## Cohesive character library — 2026-10-25

User approved art-review/2026-10-25/style-study-v2.png pixelation across all four characters, then requested one coordinated batch of all 17 supplied character sheets. Preserve every original pose/identity and use common 1536x1024 transparent canvases. Produce new derivatives alongside unchanged source copies; no unapproved new actions or effects. This authorizes style normalization for the revised library, superseding exact-pixel fidelity only for these new derivatives; existing runtime assets remain intact pending interaction redesign/integration.

## All character sheets locked with permanent pose numbers - 2026-10-25

User accepted the entire normalized set exactly as it appears and requested a game-wide rule against changing the art. Preserve the 17 approved PNG sheets byte-for-byte. Number poses globally per character in fixed sheet order, then reading order within each sheet. Ogre 1-15; wizard 1-13; elf queen 1-13; dragon 1-37. Guides display numbers above poses; sprites stay unlabelled. Extract only lossless source-cell crops, record hashes, and require explicit new user instruction before modifying art. No renumbering; new poses append. Canonical lookup replaces filename guessing for future scene integration. This supersedes earlier original-Ogre-v2 fidelity as the reference for new gameplay art; current runtime remains unchanged until deliberate integration.

User clarified that sheet size is not the relevant standard: normalize all 78 individual poses to comparable native pixel density/character scale, using Elf pose1 as benchmark. Variable aspect ratios allowed; keep identities, source designs and permanent numbering. Deterministic nearest-neighbor candidates are separate from the old baseline and await review before promotion. This is an explicit authorization for resolution normalization, not redraw/restyling.

## Final individual-pose baseline V2 accepted - 2026-10-25

User explicitly approved the 78 reviewed individual pixel-density revision poses and requested locking their corresponding numbers. Promote byte-identical PNGs to approved-v2 and switch canonical lookup to V2. Keep every ID unchanged and retain V1 historically. This supersedes the prior sheet-based baseline and pending-review status. Prohibit further image normalization, redraws, palette changes, smoothing or replacement without explicit user instruction. Preserve native pixel scale in display rather than auto-fitting every pose to an identical box.
