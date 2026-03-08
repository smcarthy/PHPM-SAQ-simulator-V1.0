# Gold-Standard Corpus Diff Report

This report summarizes, for each of the 6 official sample questions, the mapping from official sample structure (as represented in the transition source) to canonical encoded structure.

## Q1
| Dimension | Official sample structure | Canonical encoded structure | Interpretation notes |
|---|---|---|---|
| Question ID | Sample Question 1 | `PHPM_SAQ_GS_0001` | Locked GS convention applied. |
| Parts | a, b | `PHPM_SAQ_GS_0001_PA`, `PHPM_SAQ_GS_0001_PB` | Exact multipart carry-forward. |
| Directive verbs | List / List | `instruction_verb: list` for both parts | Exact carry-forward. |
| Marking | a=5, b=2 | `max_score` preserved at part level | Exact carry-forward from transition source. |
| Response constraints | list counts (5, 4) | `response_type: list`, `list_count_required` set | Exact count carry-forward. |
| Taxonomy fields | Not explicit in source extract | set to manual-review placeholders | Conservative default. |

## Q2
| Dimension | Official sample structure | Canonical encoded structure | Interpretation notes |
|---|---|---|---|
| Question ID | Sample Question 2 | `PHPM_SAQ_GS_0002` | Locked GS convention applied. |
| Parts | a only | `PHPM_SAQ_GS_0002_PA` | Exact carry-forward. |
| Directive verb | List | `instruction_verb: list` | Exact carry-forward. |
| Marking | a=1.5 | `max_score: 1.5` | Exact carry-forward from transition source. |
| Response constraints | list 3 questions | `list_count_required: 3` | Exact carry-forward. |
| Taxonomy fields | Not explicit in source extract | manual-review placeholders | Conservative default. |

## Q3
| Dimension | Official sample structure | Canonical encoded structure | Interpretation notes |
|---|---|---|---|
| Question ID | Sample Question 3 | `PHPM_SAQ_GS_0003` | Locked GS convention applied. |
| Parts | a, b | `..._PA`, `..._PB` | Exact carry-forward. |
| Directive verbs | List / If ... list | `instruction_verb: list` for both | For part b, verb normalized from mixed clause. |
| Marking | a=2, b=2 | `max_score` preserved | Exact carry-forward from transition source. |
| Must-have logic | Explicit must-have in part b | `must_have_elements` populated in part b | Exact intent carry-forward. |
| Taxonomy fields | Not explicit in source extract | manual-review placeholders | Conservative default. |

## Q4
| Dimension | Official sample structure | Canonical encoded structure | Interpretation notes |
|---|---|---|---|
| Question ID | Sample Question 4 | `PHPM_SAQ_GS_0004` | Locked GS convention applied. |
| Parts | a, b | `..._PA`, `..._PB` | Exact carry-forward. |
| Directive verbs | List / List | `instruction_verb: list` | Exact carry-forward. |
| Marking | a=2, b=2 | `max_score` preserved | Exact carry-forward from transition source. |
| Response constraints | list 4 + list 4 (2 process + 2 outcome) | `list_count_required: 4` on both parts | The split between process/outcome retained in prompt text, not separately tokenized. |
| Taxonomy fields | Not explicit in source extract | manual-review placeholders | Conservative default. |

## Q5
| Dimension | Official sample structure | Canonical encoded structure | Interpretation notes |
|---|---|---|---|
| Question ID | Sample Question 5 | `PHPM_SAQ_GS_0005` | Locked GS convention applied. |
| Parts | a only | `..._PA` | Exact carry-forward. |
| Directive verb | List | `instruction_verb: list` | Exact carry-forward. |
| Marking | a=2 | `max_score: 2` | Exact carry-forward from transition source. |
| Response constraints | list 2 | `list_count_required: 2` | Exact carry-forward. |
| Taxonomy fields | Not explicit in source extract | manual-review placeholders | Conservative default. |

## Q6
| Dimension | Official sample structure | Canonical encoded structure | Interpretation notes |
|---|---|---|---|
| Question ID | Sample Question 6 | `PHPM_SAQ_GS_0006` | Locked GS convention applied. |
| Parts | a, b, c | `..._PA`, `..._PB`, `..._PC` | Exact carry-forward. |
| Directive verbs | List / List / List | `instruction_verb: list` | Exact carry-forward. |
| Marking | a=0.5, b=3, c=1.5 | `max_score` preserved | Exact carry-forward from transition source. |
| Response constraints | short single-answer + list 3 + list 3 | `response_type` distinguishes short_text vs list | Conservative normalization of non-list part a to `short_text`. |
| Not-acceptable notes | Explicit exclusion note for part a | `not_acceptable_notes` populated | Exact intent carry-forward. |
| Taxonomy fields | Not explicit in source extract | manual-review placeholders | Conservative default. |

## Global conservative interpretations
- Official written classification and official topic theme were left in manual-review state where direct, high-confidence assignment was not provable from the transition source alone.
- `instruction_verb` was normalized to lowercase tokens for deterministic parsing.
- Part-level `scoring_notes` were standardized for machine readability without changing score caps.
