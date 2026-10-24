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
