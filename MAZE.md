# Supplied-maze navigation study — October 23, 2026

> Historical milestone record. See [PROJECT_STATE.md](PROJECT_STATE.md) for current placements, save configuration, layout and verification status.

The user asked to use Desktop/maze.png, ignore its letters/symbols and focus on maze traversal from the red-dot entrance. Encounters are disabled in this review. Original adventure code and save remain intact.

## Trace

Source image dimensions: 833×650 pixels. Walls/corridors align to a 14-pixel lattice starting at image (4,4). Imported grid: 59 columns × 46 rows, zero-based coordinates. Red-dot entrance: (58,45), facing north. Each lattice tile becomes one world cell. White corridors are walkable; solid black tiles are walls. Dark pixel coverage across each tile distinguishes solid wall blocks from narrow printed glyphs; no letters, symbols, encounter positions, doors or gameplay meanings were imported. The red dot is treated as corridor. The image's outer black margin is outside the world, so open-looking boundary pixels do not lead off-map.

Trace: dist/maze-data.js (# walls, . corridors). tools/trace-maze.py reconstructs it using Pillow and produces maze-trace-check.png, a full organizer-only comparison image with all annotations removed. Every one of the 1,452 walkable cells is reachable from the entrance. Full trace visually compared with supplied image; fine annotation coverage falls below the wall threshold. No inaccessible regions detected.

## Runtime

New dist/runtime.js isolates maze-only navigation from dist/engine.js (the retained adventure). The current app, renderer and map use the maze runtime. Character interactions, chamber labels, inventory rewards, victory buttons and health display are inactive. Journal explains navigation-study mode. No final maze encounter placements or additional adventure stages approved by this import.

Current look, 180 ms steps, 320 ms turns, ceiling/floor/wall textures retained. Renderer ray traversal bound now fits the full grid. Explored map is fitted to fixed 59×46 bounds: unvisited cells stay black, visited corridors white, entrance red, player/facing gold, short dotted stubs at visible openings. No original glyphs appear. The very small initial map marker is expected at full-maze scale; future zoom/minimap changes remain optional.

Save key: dragon-dungeon-maze-image-v1, content maze-image-1. This is separate from dragon-dungeon-prototype-v1. Starting this mode does not reset or migrate old adventure progress. New game confirmation clears only this maze save. Reload restores position/facing/explored cells. Invalid maze saves are preserved until explicit reset. No cloud/cross-device save or deployment.

## Verification

43 automated tests passed locally, including full-maze reachability; every walkable tile's forward/back collisions for all four facings without encounter activation; separate-save preservation, restoration and malformed-data handling. Updated renderer/movement checks use valid cells in the new world; all retained adventure state tests continue to pass.

Browser: opened at red-dot entrance facing north; moved one cell forward into a long corridor; reloaded and observed restored position/exploration; stepped backward to entrance. Screenshot maze-play-check.png. Desktop visual inspected. Manual full-maze traversal, fresh-player navigation/pacing and physical phones are untested. Reachability/collision coverage is automated, not a claim of manually walking every path.
