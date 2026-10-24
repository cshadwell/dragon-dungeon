# P05-QUEEN — The court beneath the roots

> Historical milestone record. See [PROJECT_STATE.md](PROJECT_STATE.md) for current placements, save configuration, layout and verification status.

Initial playable implementation, October 22, 2026. The user approved completing the third creature encounter based on the previously proposed trust/restraint concept. Artwork and exact wording remain a prototype for review. No dragon behavior or final name implemented. Synced source/reference files untouched.

## Puzzle record

Intended player experience: recognize fear beneath apparent aggression, offer help with consent, and stop exerting pressure when resistance ends. The queen observes the player's treatment of a living thorn guardian before giving her seal.

Starting materials: browser, thorn guardian guarding an injured branch, clean linen strips, queen beyond. Text describes all visual cues; no audio, time limit, equipment prerequisite, or physical fabrication/electronics. New temporary room (2,4) connects to (2,3), extending the existing loop without changing existing cells.

Required observations: outward/raised thorns track approaching hands; an injured branch is held close; distance lowers the thorns; an extended branch invites help. After mending: thorns fold, head lowers, guardian steps aside, path opens. Intended solution: observe → step back → offer linen → mend invited branch → lower hands and pass. Alternative routes allow stepping back first, waiting with open hands, or offering linen before giving space. Explicit instructions prevent dependence on mind reading or random social guessing.

Reward: Queen’s seal, plus notes covering body language, consent and surrender. Seal is described as able to release an ancient binding; its future dragon use remains unimplemented. No dependency on ogre or wizard. All six encounter orders remain possible.

Wrong choices: threats increase defensive posture but are recoverable without damage. Reaching through explicitly raised thorns costs one health, explains injury, and requires acknowledgment before another action. At zero health, lantern restores three health while all prior inventory/encounters and queen observations persist. An unnecessary demand after surrender produces corrective feedback; acknowledgment restores the surrendered state, retaining mending. Waiting after an invitation is safe and explains that help is now requested.

Hints: descriptive cues and contextual feedback throughout. Retreat/reentry and reload retain the exact encounter phase, observation flag and feedback. Completed encounter can be revisited; reward applied once. Potential unintended solution: selecting apparently kind options without reading can succeed; this version prioritizes clear behavior learning. Difficulty/fresh-player pacing not measured. No anti-cheat.

## Implementation and status

`dist/queen.js` holds dialogue, state transitions, reward/notes and provisional SVG illustration. `dist/engine.js` integrates movement, validation and save migration; `dist/app.js` renders encounters, room, map and journal. Content `queen-1`; save key and schema unchanged. Migration from wizard-1 preserves all valid prior progress. Earlier migration paths also initialize queen state. Invalid data retains prior protective behavior.

28 automated tests passed locally. Queen-specific checks include multiple peaceful routes, threatened/overreaching recovery, one-time health penalties, checkpoint recovery with shield/lens retained, all six character completion orders, reachable queen-state exploration with save/retreat round trips and paths to completion from every reached state, plus prior-save migration. Existing ogre/reflex/wizard tests still pass.

Manual Codex in-app browser: previous save upgraded retaining shield/lens/location; walked from wizard through east/lower loop to new court; observed → stepped back → offered linen; reload retained invitation; mended branch → surrender cues → peaceful passage awarded seal. Desktop surrender layout inspected. Screenshot queen-check.png records reward view.

Not tested: fresh players, physical phone layout/rotation/timing, exhaustive manual bad-choice branches, dragon integration. No deployment. Recommend master blueprint update after acceptance; none performed here.
