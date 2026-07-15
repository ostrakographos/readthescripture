# Corrections Log — published pages

*Factual corrections made to pages after publication: what was wrong, what is right, and what settled it. Routine copyedits and design changes are not logged. The log was opened 2026-07-14 and backfills the significant corrections that predate it; from that date forward, every factual correction to a published page gets an entry when the fix ships.*

*A standing rule applies to every entry: a correction re-derives the whole citation from the primary record, not just the disputed part — a lesson this log itself records (see 2026-07-14, mercy_extended).*

---

**2026-07-14 — mercy_extended.html — Tall el-Hammam citation completed against the journal record.**
The page cites the 2021 *Scientific Reports* paper proposing a cosmic airburst at Tall el-Hammam. Two-stage correction: (1) on 2026-07-03 the page was updated to disclose that the paper was retracted (Retraction Note, *Sci Rep* 15:14291, 2025; eleven of the twenty-one authors disputed the findings) and to fix a lead-authorship error; (2) on 2026-07-14 the author string was re-derived from the journal's own pages, which showed the excavation's director is not among the paper's authors at all — the earlier fix had corrected the disputed element and left the rest unverified. Settled by: the journal's article and retraction pages, read directly.

**2026-07-14 — history_of_the_bible.html — manuscript and variant figures made precise.**
The Greek New Testament manuscript count was refined to the catalogued range (~5,100–5,300, per Peterson) and the textual-variant estimate restated as ~500,000 excluding spelling differences (per Gurry, whose per-book sums approach ~591,000); an adjacent claim about variants and doctrine was narrowed to what the cited scholarship supports. Settled by: the cited works, read directly.

**2026-07-05 — samaritan_woman_at_the_well.html — two citation fixes.**
An attribution to Jerome on the Sychar/Shechem identification had the position inverted; corrected against Jerome's Letter 108. A confession parallel resting on Matthew 27:54 was replaced with John 9:35–37, which actually carries the point. Settled by: the primary texts.

**2026-07-03 — when_the_answer_was_silence.html — Hebrews 5:7 was cited against its own content.**
The page had used the verse as an instance of unanswered prayer; the verse itself says the prayers "were heard." The citation was corrected and the surrounding argument adjusted. Settled by: the verse, read.

**2026-07-01 — relenting.html — Numbers 23:19 grammatical gloss corrected.**
The gloss on the Hebrew verb misstated its form; corrected to the Hitpael and re-verified against the text. Settled by: the Hebrew text and standard lexica.

**2026-07-01 — canaan_conquest.html — Strong's number for ḥērem corrected.**
The page cited H2763 (the verb *ḥāram*) where the noun *ḥērem* (H2764) was meant. Settled by: the concordance.

**2026-07-01 — hardening_pharaohs_heart.html — hardening-sequence table rebuilt.**
The Exodus hardening-sequence table was re-verified verb by verb against the Hebrew text, including stative forms the original table had flattened, and a sentence on the Romans 9 reception of the passage was added for balance. Settled by: the Hebrew text.

**2026-07-01 — lord_gods_and_the_satan.html — Deuteronomy 32:8 quotation aligned to the NRSVue.**
The quoted wording did not match the NRSVue's actual rendering; corrected to the edition's text. Settled by: the NRSVue, read directly.

**2026-06-29 — kjv_reader.html — six missing verses restored, four versification defects fixed.**
The reader's underlying KJV dataset (a widely-circulated digital lineage) was missing Matt 2:16, 22:1, 26:38, Mark 4:40, 7:11, and 8:8 entirely, and mis-versified 1 Sam 20:42, 1 Kgs 22:43, 3 John 1:14, and Rev 12:18/13:1. The page was rebuilt from a repaired dataset and re-verified. Settled by: chapter-by-chapter validation against independent KJV authorities.

**2026-06-16 — Joab study — a dictionary quotation replaced with the verified text.**
A condemnation of Joab attributed to Easton's Bible Dictionary did not appear in Easton's actual entry; the page's quotation was replaced with Easton's verified wording ("hoary conspirator … character is deeply stained"). A search-engine summary had "confirmed" the original wording; the primary text did not. Settled by: Easton's *Illustrated Bible Dictionary* (1897), fetched and read.

---

## Repository corrections (infrastructure, not a published page)

*The corrections above are about page content. This section logs errors in the repository's own machinery — the same "corrected in the open" commitment applied to the tooling that guards this record.*

**2026-07-15 — `tools/check_public.py` leaked the personal identifiers it exists to block, into its own public history.**
The boundary check's forbidden-token list hardcoded the exact tokens it was built to keep out of this repository (an account-linking identifier and the names of quarantined personal files), and the file exempted itself from its own scan. That made the one file violating the rule the one file excluded from enforcement. It had been present since this repository's initial commit. Fixed by externalizing the token list to a private sidecar file (outside this repository, read at commit-hook time — see the current `tools/check_public.py`, which now fails closed if the sidecar is missing) and rewriting this repository's git history to remove the tokens from every prior commit, then force-pushing the corrected history. Settled by: a full scan of every historical blob in this repository, confirmed clean after the rewrite.
