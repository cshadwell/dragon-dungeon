# Safari false wall / unreadable save — October 23, 2026

Reported symptom: Safari rendered an open corridor at the new southeast start but every forward attempt reported a wall; saved data was reported unreadable.

Diagnosis: mixed cached module revisions, consistent with the former small-world engine being used by the newer large-maze runtime. That older engine ignored the supplied world argument, so a large-maze position had no valid neighbors in the small world and failed small-world validation. A regression now reproduces that exact signature by calling the default small engine with a large-world state: save invalid, forward blocked; supplying the large world validates and moves correctly.

Evidence: inspected the failing Safari window, applied release-version URLs, then reloaded without clearing/resetting that tab's save. The same save immediately loaded normally; the same previously blocked forward button advanced into the visible corridor. Actual cached source bytes were not extracted from Web Inspector, so the particular cached revision is inferred from the matching signature and successful coherent refresh.

Fix: tools/stamp-release.py calculates a content hash across all JS/CSS/HTML, stamps the same version on the HTML entry point, stylesheet and every relative module import. No transitive dependency can keep an unversioned stale engine. npm start stamps automatically and starts tools/serve.py, whose JS/HTML responses send Cache-Control: no-store, max-age=0. The existing preview server was replaced at the same port; URL unchanged. A regression test checks both consistency and hash freshness, so future source edits require re-stamping. During development with the server already running, run python3 tools/stamp-release.py after source changes, then npm test and reload.

Verification: 53 tests passed. Header request to versioned engine.js returned 200 and no-store. Real Safari original 127.0.0.1 tab restored the existing save and moved west successfully. A new localhost tab had no preexisting save, then New game → confirm → forward moved north from the southeast entrance; reload retained that position with a normal restored-save message. That test tab was closed and the original Safari tab retained. Earlier saves were not cleared. Screenshot safari-movement-check.png records the successful fresh-game/reload check.

No maze wall/start coordinates, encounter logic, or saved-progress reset was needed. Unrelated Safari sites/data/settings were not modified. No production deployment.
