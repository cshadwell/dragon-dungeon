# Wizard mind encounter — layout proposal

Static review only, 2026-10-30. No live game changes or mechanics implemented.

Confirmed discussion: match staff gem color to written color name; ignore lettering color. Seven spell colors: red, blue, green, orange, purple, white, yellow. Four unique choices, exactly one correct. Shuffle choices between spells. Intro4s, conflicting lettering3s, final challenge2s accepted as initial timing.

Proposed layout: existing470x200 logical room across top at2x nearest-neighbor; approved Wizard1 native dimensions, exact study background. Lower-left dialogue/lesson/pause/exit, wider lower-right2x2 neutral choice buttons with timer. User approved layout and rejected separate spell indicator. Revised mockup uses a large independent pixel spell burst centered on the staff gem, with an opaque colored core covering the default blue gem and stepped rays extending beyond the staff. No separate indicator. Red spell example: BLUE in yellow, RED in blue (correct), PURPLE in green, GREEN in purple. Gem color shown as separate temporary effect layer; original artwork unchanged. Pose assignment, reaction mapping, counts and scoring remain undecided.

Generate image with `node render.cjs` from this directory (uses local bundled canvas runtime).

User requested larger bold choice lettering: revised static example uses42px bold monospace within each261x85 button. Independent conflicting tile background colors are a proposed extra distraction for the dragon, not yet approved for implementation. Wizard retains neutral button backgrounds; truth remains spell color matched to written word.
