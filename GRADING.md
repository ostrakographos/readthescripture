# How Pages Are Graded

*The grading system behind the grade block on every Study, and behind every row in `grading/grades.jsonl`. The log is published verbatim — including low runs, disagreements between graders, and grades that later went stale when a page changed.*

## The design in one paragraph

A page is never graded by the instance that wrote it. Grading runs are performed **blind** by fresh model instances whose inputs are restricted to the rubric and the one page — no project history, no prior grades, no knowledge of the author's preference. Runs are logged individually; a publishable grade requires a panel of at least three runs against the same version of the text, plus an actual read of the piece by whoever records the result. Periodically, pages are also graded by different labs' models, which is the only check that escapes the blind spots a single model family shares with itself.

## What a grade is bound to

A grade is not a property of the text alone. It is a property of **text-version × grader × reading** (the rubric plus the verbatim grader prompt). Invariants:

1. **Every grade is bound to three keys** — the file version (hash or date), the grader (model and lab family), and the reading. Two grades are comparable only if all three match.
2. **A run is evidence, not a verdict.** Runs within one batch (same version, same reading) may be summarized; grades spanning a *change to the text* are never aggregated — a grade dies with the version it scored.
3. **When a panel crosses a letter boundary, the range is reported, not a point.** Instability is itself a finding.
4. **A single run is never published as a grade.**
5. **Cross-model runs measure agreement, not a better number.** Convergence across labs raises confidence; divergence is a dispute to adjudicate, never to average away. Model families carry measurable scoring offsets against each other on identical text.
6. **A fix does not license an upward re-grade.** The whole piece is re-graded on the new version.
7. **After any substantive edit, the prior grade is stale** until the page is re-run.

### Panel spread → what gets published

| Panel spread (same version) | On-page result |
|---|---|
| Within one letter band | Batch summary to a point; band citable |
| Crosses one letter boundary | Range reported; adjudicated to a defensible point with the driving dimension named |
| Spans two or more bands | Instability is the finding; no single number unless a documented read resolves why the outlier is wrong |

## Blinding — restrict inputs, don't request amnesia

"Pretend you don't know who wrote it" is the weakest blind; style leaks authorship. Real blinding restricts what the grader can read: the rubric files and the one page, nothing else — no project records, no prior grades, no other pages, and no statement from the requester about the desired outcome. If a self-reported grade appears inside the page being graded, the grader ignores it.

The grader prompt is fixed and versioned; any edit to it or to the rubric creates a new "reading" version, breaking comparability with prior rows — so it does not get edited casually, and never in response to a specific low grade. (In the working copy the blinding rules name internal files; they are generalized here.)

## The reasoning rubric (D1–D5, /20)

Five dimensions, 0–4 each, scored independently.

**D1 — Claim Precision.** *Is the claim stated clearly enough to be wrong?* 0 = too vague to evaluate; 2 = clear but with slippage in key terms; 4 = precisely bounded, quantified where appropriate, falsifiable in formulation. Precision is not complexity: a simple claim stated precisely scores 4.

**D2 — Evidence Grounding.** *Supported, or asserted?* 0 = bare assertion; 2 = examples with incomplete connecting reasoning; 4 = varied evidence with a stated logical chain from evidence to conclusion. An analogy illustrates; it does not ground.

**D3 — Epistemic Honesty.** *Does the argument know what it doesn't know?* 0 = opinion as fact, assumptions invisible; 2 = acknowledges obvious limits only; 4 = marks confidence levels, names its own weakest points unprompted, states what evidence would change the conclusion.

**D4 — Internal Consistency.** *Does it contradict itself?* 0 = direct contradiction; 2 = one unresolved tension; 3 = tensions named and held open honestly; 4 = apparent tensions resolved or explicitly preserved as open questions. Checks include: a standard of evidence applied to opponents but not to one's own view; a word used in two senses without acknowledgment.

**D5 — Scope Appropriateness.** *Does the conclusion match the weight of the evidence?* 0 = conclusion dramatically exceeds (or falls short of) the evidence; 2 = roughly calibrated; 4 = exactly as strong as the evidence permits, with what is shown distinguished from what is implied.

Letter bands: 18–20 A+, 16–17 A, 14–15 B+, 12–13 B, 10–11 C+, 8–9 C, below 8 D/F.

## The fidelity rubric (F1–F3, /12)

Scored as a separate block — never folded into the /20 — because a valid argument can still rest on a misquoted source or impose a reading on the text.

**F1 — Source Fidelity** *(guards the fabrication failure mode)*

| Score | Criteria |
|---|---|
| 0 | A cited source is fabricated, misattributed, or made to say the opposite of what it says. Any invented citation caps this dimension at 0. |
| 1 | Sources named but represented loosely; a reader checking them would find the paraphrase materially off. Position labels missing or wrong. |
| 2 | Sources real and broadly fair, but at least one stretched beyond what it supports, or a label imprecise. |
| 3 | Sources real, fairly represented, position-labeled. A skeptical reader checking them finds them as described. |
| 4 | Sources real, precisely represented, position-labeled, and the strongest available. Quotations exact; scope of each source's authority stated. |

**F2 — Exegesis vs. Eisegesis** *(the site's core methodological claim)*

| Score | Criteria |
|---|---|
| 0 | The conclusion is read into the text; the reading would not occur to someone without the prior. |
| 1 | Mostly imposed; some textual hooks, but the weight comes from outside the passage, unacknowledged. |
| 2 | Mixed; a competing reading is equally available and the choice is driven by prior commitment. |
| 3 | Grounded in the text's language, context, and genre; where a prior shapes the reading, that is named. |
| 4 | The reading demonstrably arises from the text — lexical, grammatical, contextual, generic evidence converge — and the piece distinguishes what the text yields from what tradition adds. |

**F3 — Counter-evidence Coverage**

| Score | Criteria |
|---|---|
| 0 | No opposition acknowledged, or only a weak version chosen to be knocked down. |
| 1 | Opposition mentioned but minimized or distorted. |
| 2 | A real objection engaged, but the single strongest one missing or underdeveloped. |
| 3 | The strongest opposing reading stated fairly and engaged on its merits. |
| 4 | The strongest opposing reading stated as its own proponents would state it, engaged, and its residual force conceded honestly. |

## The log

`grading/grades.jsonl` — one JSON row per run: date, page, run number, grader, blind flag, file version, five dimension scores, total, letter, and the run's one-sentence note (plus `f1`–`f3` where the fidelity pass ran). It is append-only. Every score, date, version tag, grader identity, and finding is published unedited; the one transform applied at publish time is that a handful of note fields referencing private workbench file paths have those references normalized to "recorded in the workbench" (four rows as of 2026-07-14). Nothing numeric or evaluative is touched.

## What a grade does not mean

Stated here because overselling a grade would itself fail D3:

- **The same-model ceiling.** A blind instance of the same model that wrote the piece shares that model's blind spots. Blindness removes motivated reasoning; it does not manufacture independence. That is what the different-lab runs are for — and even those are model judgment, not truth.
- **Coherence is not truth.** The rubrics score grounding, reasoning quality, and honesty. A page can score well and still be wrong; the grade measures whether it argues honestly from real sources, not whether its conclusion is correct.
- **A grade is an audit trail, not an endorsement.** The purpose of publishing the log is that anyone can check whether the numbers on the pages match the runs that produced them.
