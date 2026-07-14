---
receipt_id: 2026-06-28b
date: 2026-06-28
author: both
supersedes: []
mode: Content
---

# Receipt 2026-06-28b — 1 Kings 13 Study published & graded ("The True Word in a False Mouth")

## STATE AT CLOSE  (authoritative — if this conflicts with the LOG below, THIS wins)
| Page (canonical filename) | Status | Grade (+ version it grades) | Open gates |
|---|---|---|---|
| the_true_word_in_a_false_mouth.html | published (Study · Critical) | **A+ 20/20** — grades the 2026-06-28 published text; 3 blind same-model subagent runs, all 5 dims 4/4; Fidelity F1 3 / F2 4 / F3 4 = 11/12 | different-model/human read (same-model ceiling); 2nd Tel Dan source; rule-22 on Cogan/Walsh only if ever quoted |
| a_hard_chapter_in_the_open.html | published (Marginalia · Method) | n/a (not graded) | site-wide nav `?v` bump still owed; companion link to the Study now LIVE |

## DURABLE  (must be promoted out of this receipt — a receipt is not a rule's home)
- [x] INVENTORY updated (Study row added; grade recorded). grades.jsonl: 3 rows appended (runs 1–3, A+ 20/20).
- [x] STANDING-CORRECTIONS: added a recent-corrections entry on the collaboration/over-agreement dynamic (the 1 Kings 13 pushback example) — see notes/collaboration_example_1kings13_pushback_2026-06-28.md.
- [ ] DEFINITIONS / SITE-STANDARDS update needed? N

## OPEN GATES — delta only (the full tracker is OPEN-GATES.md)
NEWLY OPENED:
- the_true_word_in_a_false_mouth.html — different-model or human read owed (same-model ceiling; 3 same-model runs cluster at A+ 20/20, which is the optimistic ceiling, not the real gate); 2nd Tel Dan archaeological source owed.
CLOSED THIS SESSION (cite the receipt that opened it):
- "1 Kings 13 Study still DRAFT" gate (opened receipt 2026-06-28a) — CLOSED: Study published, NRSVue verbatim pass DONE (BibleGateway-checked), graded A+ 20/20, wired; the Marginalia's "in preparation" references converted to live links.
STILL OPEN: site-wide nav `?v=13→14` cache-bust (~31 pages); see OPEN-GATES.md.

## LOG  (narrative; NON-authoritative; never edit a prior section — append a new receipt instead)
[Lee] Directed: publish the Study; add the manuscript "same day" finding as a brief margin sidebar (a useful distraction, not the main thread); remove the hex point-tags; grade and publish. Also: record the pushback/collaboration process somewhere durable — a good example of true collaboration, and the interesting point that the LXX v3 nuance is invisible at the study-commentary tier.

[Claude] Pushback (recorded, did not just agree): the v3 LXX divergence is NOT unknown to *critical* scholarship — the Greek of Kings (3 Reigns / 3 Kingdoms) is a major text-critical field and the Jeroboam material is among its most-discussed; Cogan engages the LXX and specialists (e.g., Trebolle Barrera) treat these divergences. Accurate framing: a nuance invisible at the study-Bible tier Lee normally reads, rediscovered live — not unknown to the academy. Flagged unverified specifics under rule 22.

[Claude] Build: rebuilt the Study draft as `published/the_true_word_in_a_false_mouth.html`. Changes vs. draft: 23 hex point-tags stripped; **all scripture converted to NRSVue verbatim, checked against BibleGateway NRSVue this session** (v1 "by the word of the LORD"; v2 "human bones shall be burned on you"; v8 "If you give me half your kingdom…"; v9 "thus I was commanded by the word of the LORD"; v12:31 "from among all the people, who were not Levites"; v18 "But he was deceiving him" + "I also am a prophet as you are…"; v21 "you have disobeyed the word of the LORD"; v30 "Alas, my brother!"; v32 "shall surely come to pass"; Gen 50:20 "Even though you intended to do harm to me, God intended it for good"); draft-banner removed; LXX v3 finding added as a purple `.aside` margin sidebar; NRSVue source attribution; cross-linked to the method Marginalia.

[Claude] Grade: per PROTOCOL.md, dispatched **3 fresh blind subagents** (read only the article; embedded rubric). All three returned **20/20, every dimension 4/4**, Fidelity **F1 3 / F2 4 / F3 4 = 11/12** (F1 capped at 3 — external sources unverifiable from the text + 2nd Tel Dan owed). Shared weakest point: the "death as witness" reading rests on an inference the chapter never states (already conceded in the second objection box). **Same-model ceiling stated on the page and here: a different-model or human read is the real gate.**

[Claude] Wiring: nav.js (Critical category) + sitemap + homepage (Passage Studies card) + INVENTORY row + grades.jsonl (3 rows) + this receipt. New page references `nav.js?v=14`; site-wide v13→v14 bump across ~31 pages still owed (deferred — bulk edits risky on this byte-dropping mount; verified all edits via the Read tool, not bash, after a bash `node --check` gave a false-corruption read of nav.js).
