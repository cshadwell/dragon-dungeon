# P05-DRAGON — The keeper of the name

> Historical milestone record. See [PROJECT_STATE.md](PROJECT_STATE.md) for current placements, save configuration, layout and verification status.

Basic implementation, October 22, 2026, following approval to combine all three creature skills. Original synced reference material untouched. Content `dragon-1`, schema/save key unchanged. The geometric art and temporary map are functional prototypes, not final production assets.

## Experience and rules

Intended experience: combine attention, evidence and restraint to release a bound dragon’s hidden name. New chamber (4,2) branches from existing (3,2). The three inventory items are explicit prerequisites for starting; early arrival with none/some is safe and reports missing items. Discovering the room opens the lantern passage in both directions via buttons, preventing long retry walks. Existing cells remain unchanged.

Starting information: independent ancient inscription establishes that all spoken factual claims of the bound dragon are false, while observed actions and revealed stone are reliable. Dragon never speaks the name. A right-hand brazier, shield aim, breath tell and exposed seals are described in text as well as provisional SVG.

1. Ogre skill: plan reflection toward the right brazier, then start a timed attempt. Nostril flare and EMBERS cue signal the high block (↑ or touch button). Reuses the tested 700 ms reaction window, 1,150 ms slower option, varied windup, safe suspension/blur cancellation, and separate start/response controls. Aim mistakes give safe corrective feedback; early/late/wrong block costs one health.
2. Wizard skill: redirected fire breaks the ward. Lens reveals three seals and reliable text: exactly one binding, fixed location. Dragon falsely claims moon and crown. Sun follows by elimination. Wrong seal costs one health and explains the exclusion. This initial puzzle deliberately repeats the wizard's structure; a more varied transfer challenge can be developed after full-route review.
3. Queen skill: sun loosens chains; folded wings, lowered head, extinguished flame and relaxed claws show surrender. Stop pressing and apply queen’s seal. Demanding more submission is safe but receives corrective feedback before returning to the surrender choice.
4. Independent stone tablet reveals the name; victory/name persist. Prototype name is TEST and every display explicitly labels it as an unverified development placeholder. No final book combination selected or tested.

Private solution: prepare shield → aim right → start → ↑ after EMBERS → use lens → touch sun → lower shield/apply seal. No physical materials/electronics/fabrication are required for this digital prototype; physical book integration remains pending.

## State, recovery, hints and limitations

`dragon` stores phase, discovery, victory, earned name/placeholder status, feedback and retry target. Successful phases persist through retreat, reload and health recovery. Damage switches to an acknowledgment state so rapid repeated input cannot apply another penalty. At zero, restore three health at lantern, retaining all discoveries/items and current retry phase. Return to dragon resumes there. Active reaction clock is transient: reload returns to setup and never replays damage or grants a block. Menu/movement actions are blocked during encounters/attempts.

Victory can be reread from Earned name or journal during exploration. Saved earned name is retained rather than recomputed from configuration after a later code change. New game is still explicitly confirmed. Unknown/corrupt saves remain preserved under existing load behavior. Prior queen-1 and older known prototype content migrates without revoking valid earlier progress.

`NAME_CONFIG` in dist/dragon.js controls the four-letter answer and placeholder flag for future victories. Leave placeholder true until the exact name opens the actual physical book. No client-side secrecy/anti-cheat infrastructure; source inspection remains possible. No new real-world adventure stages. Difficulty/pacing unmeasured, responsive design not yet verified on physical phones. No deployment/QR or book-lock test claimed.

## Verification

35 automated tests passed locally. Seven dragon checks cover early arrival with no/some prerequisites, safe retreat/return, all six discovery orders through victory, unique outcomes, each reaction failure, health recovery with retained items/phases, wrong aim/seals, restraint retry, narrative save/retreat round trips, prior-save migration and invalid victory/phase rejection. Existing 28 checks for navigation, ogre timing, wizard and queen still pass. App and dragon module syntax checks passed.

Manual Codex in-app browser: prior queen-1 save upgraded; walked queen→lower/east loop→dragon; prepared right reflection; reacted with ↑ after rendered EMBERS using normal timing; ward broke; used lens; reload resumed seal puzzle; selected sun; inspected surrender view; applied seal; verified labelled TEST victory. Returned to lantern, reloaded and reopened Earned name successfully. Screenshot dragon-check.png records initial victory view.

Not yet verified: fresh-player full route/pacing; real phone rotation/touch/latency; exhaustive manual bad-choice paths and early arrival; every real-browser storage failure. Automated state checks do not establish real-device UX. Recommend master blueprint update after acceptance of this full route; no reference file was edited.
