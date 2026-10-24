# Approved encounter placement — October 23, 2026

> Historical milestone record. See [PROJECT_STATE.md](PROJECT_STATE.md) for current placements, save configuration, layout and verification status.

User supplied map2.png and requested orange=ogre, blue=wizard, green=elf queen, purple=dragon. Marked reference is 590×460 pixels, exactly the clean 59×46 traced maze at 10 pixels/cell. Dot centers were detected by color and mapped to zero-based cells; all four are walkable. No wall, corridor, or start change.

| Encounter | Dot | Cell x,y | Shortest path from start (steps) |
|---|---|---|---|
| Ogre | Orange | 35,29 | 93 |
| Wizard | Blue | 4,22 | 127 |
| Elf queen | Green | 56,4 | 115 |
| Dragon | Purple | 0,0 | 135 |

Start stays (58,45), facing north. Full comparison image encounter-placement-check.png reproduces the clean grid and approved dot positions. Distances are graph calculations, not observed play time or recommended solve order. Encounters may be approached in any order; leaving a dialogue permits continued maze movement. Early dragon arrival remains safe and reports missing prerequisites; first discovery opens its checkpoint return passage.

## Implementation

The existing engine accepts a world configuration with cells, start, encounter coordinates and content version. Its default small world and tests remain intact. dist/runtime.js supplies the large maze and these approved coordinates, using the same tested rules rather than duplicate narrative logic. Existing UI/scene labels and map now use runtime coordinates rather than old module defaults. Character art, lessons, health/recovery and victory behavior retained. Map shows colored O/W/Q/D markers only for visited cells, with completion checks; undiscovered markers remain concealed. User dot colors are preserved. New placement does not approve new story/physical stages or a final book name.

Full-maze adventure save: dragon-dungeon-maze-adventure-v1, content maze-encounters-1. On first run, valid navigation-only maze progress is imported (position, facing, visited cells), with fresh creature progress. Both earlier keys are untouched: dragon-dungeon-maze-image-v1 and dragon-dungeon-prototype-v1. Old prototype testing rewards are not automatically granted in the relocated adventure. Current adventure save validation uses the large world's locations/checkpoint. Invalid saves remain protected until explicit reset.

## Verification

51 automated tests passed. Walked computed actual grid routes from entrance to each placement via navigation actions and asserted correct encounter trigger/valid state. Exhaustive corridor collision checks updated for only the four approved triggers. Re-ran all six discovery orders through dragon victory using large-world state transitions, recovery, retreat/return and save round trips. Protected-key import test confirms earlier navigation/prototype saves not overwritten. Renderer/map/motion and old small-world tests continue to pass.

Browser: opened updated build, saw navigation exploration imported, full health and active-adventure message, no undiscovered encounter markers exposed. No manual 93–135-step walks to every encounter claimed; trigger walks and full encounter/order checks above are automated. Fresh-player full-route pacing, real phone usability and exhaustive manual interactions at relocated positions remain pending. No deployment or physical-book test performed. Name remains TEST, labelled development placeholder.

Recommend updating the master blueprint after acceptance of these approved locations. Synced references were not edited.
