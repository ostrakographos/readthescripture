# readthescripture.com — the public record

A model for reading Scripture: read the text first, separate what it says from what traditions claim it must mean, and name what is unknown. This repository is the public record behind [readthescripture.com](https://readthescripture.com) — the method, editorial standards, grading rubrics, logged grades, and corrections behind every published page.

## What is here

| Path | Contents |
|---|---|
| [`published/`](published/) | Mirror of the deployed site — every page, as served |
| [`images/`](images/) | Site image assets |
| [`METHOD.md`](METHOD.md) | The reading method and the editorial standards every page is held to |
| [`GRADING.md`](GRADING.md) | How pages are graded: the rubrics, the blind procedure, and what a grade does and does not mean |
| [`grading/grades.jsonl`](grading/grades.jsonl) | The complete grade log, one row per grading run, published verbatim |
| [`CORRECTIONS.md`](CORRECTIONS.md) | Factual corrections made to published pages, with what was wrong and what settled it |
| [`exhibits/`](exhibits/) | Workbench pieces on display — working documents shown as specimens, ungraded and uncorrected (see the gallery guide inside) |
| [`tools/check_public.py`](tools/check_public.py) | The boundary check this repository runs before every commit |
| [`LICENSE.md`](LICENSE.md) | CC BY-NC-ND 4.0, with scripture and code riders |

## What this repository is

The site claims a working discipline: quotations verified against the named edition, scholars' positions confirmed against their own texts, pages graded blind by instances that did not write them, errors corrected in the open. A claim like that invites the question *where is the record?* This repository is the answer. The grade log and the corrections log are published in full — including the runs that came back mediocre and the errors that reached live pages before being caught. (The log's one publish-time transform is disclosed in `GRADING.md`.)

## What this repository is not

It is not the workbench. Drafts, rejected pieces, research notes, working transcripts, and the editorial back-and-forth that precedes publication stay private — the same boundary any publication draws between its archive and its pressroom — with one deliberate, labeled exception: [`exhibits/`](exhibits/) displays selected workbench pieces as specimens, exact copies where possible and visibly redacted where necessary, under the rules in its own README. Outside `exhibits/`, nothing here is redacted from a private original; public documents are authored for this record. The boundary is stated rather than hidden, and the record grows from its start date (2026-07-14) forward; `CORRECTIONS.md` additionally backfills the significant corrections that predate it.

## Authorship

The site is written and edited by Lee Sadler in collaboration with Claude (Anthropic). Prose on published pages is composed by Claude under Lee's direction and editorial control; every page carries this byline. Grading is performed by fresh model instances that did not write the piece, and periodically by different labs' models — see `GRADING.md` for what that does and does not guarantee.

## Contact

`lee.sadler@readthescripture.com` · [readthescripture.com/about.html](https://readthescripture.com/about.html)
