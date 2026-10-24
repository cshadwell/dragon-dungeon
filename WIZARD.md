# P05-WIZARD — A most inconvenient truth

> Historical milestone record. See [PROJECT_STATE.md](PROJECT_STATE.md) for current placements, save configuration, layout and verification status.

Implemented October 22, 2026 after approval to proceed with the proposed wizard encounter. Content/illustrations are an initial playable version for review. The elf queen and dragon have not been implemented. Original project reference files remain unchanged.

## Experience and puzzle record

The wizard uses a floating enchanted mask to teach elimination and limits of inference. He is amused by the mask's unhelpfulness but values careful reasoning. Physical setup: browser only, three sealed compartments labelled MOON, CROWN and SUN, one brass key, mask, wizard and blank stone plaque. No fabrication/electronics requirements.

Explicit reliable rules: exactly one key, exactly one compartment, key stays put, every factual mask statement false. Wizard/written instructions remain trustworthy. This avoids liar paradoxes or shifting truths.

First claim: key in moon. The player should ask for more evidence because crown and sun are both possible. Attempting a compartment here produces safe explanatory feedback; compartments remain sealed. Second claim: key in crown. Now moon and crown are excluded, leaving sun. Wrong sealed compartments at this stage cost one health and give explicit corrective feedback, with acknowledgment before retry. Third step asks why the conclusion follows; poor explanations have safe feedback. Finally use the borrowed lens to expose a plaque inscription, read it and accept the lens.

Private walkthrough: Examine test → Ask for another statement → Open sun → Both false claims exclude moon and crown → Look through lens → Read inscription and accept lens.

Reward: Revealing lens, plus two journal entries recording false-claim reasoning and independent written evidence. Key is a demonstration object, not an additional inventory requirement or later stage. Lens effect is a click demonstration, not a pointer precision/reflex challenge.

Dependency: no ogre prerequisite. Location (2,0), existing north alcove. All work in this encounter is untimed. Estimated difficulty intentionally introductory and unmeasured; current wording explicitly teaches the method. Source inspection/guessing remain possible; explanation gate reinforces the intended deduction without anti-cheat infrastructure. The wizard only establishes his mask's rule here; the final dragon's truth rule still needs explicit in-game establishment when that encounter is authored.

## Recovery and persistence

`wizard.phase` stores intro, first claim, safe uncertainty feedback, second claim, proof, proof feedback, penalty feedback, lens, reveal or done. Retreat and reload resume the same phase. At zero health, return to lantern with three health; map, inventory, ogre progress and wizard phase persist. Acknowledging the penalty on return cannot reapply damage. Correct completion grants lens/notes once. Completed encounter can be revisited.

Content `wizard-1` migrates prior `ogre-2`, `ogre-1` and original prototype saves without revoking valid earned ogre progress. Unknown/malformed data remains protected by existing load behavior. No cross-device sync or deployment.

## Verification

22 automated tests passed locally, including six wizard-specific checks covering premature guesses, proof gate, correct/wrong outcomes, no repeated penalties, zero-health recovery retaining shield, both character completion orders, unique rewards, all wizard narrative save round trips, retreat/reentry and ogre-2 save upgrade. Earlier movement/map/reaction/persistence checks still pass. App JS syntax check passed.

Manual Codex in-app browser: existing save retained shield/location; navigated into study; first claim → second claim; reload retained second claim; sun → valid proof → lens → revealed writing → lens reward. Layout reviewed on desktop with clear labelled compartments and claims. Screenshot: wizard-check.png.

Not yet verified: fresh-player fairness and pacing, actual phones/rotation, exhaustive manual wrong-choice branches, final dragon integration. Geometric SVG artwork is provisional. Recommend master blueprint update after encounter acceptance; none was changed here.
