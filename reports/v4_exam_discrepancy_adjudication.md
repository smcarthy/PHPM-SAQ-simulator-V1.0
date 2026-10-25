# V4 Exam Discrepancy Adjudication Packet

Date: 2026-10-24

Scope: `EXAM_AHD_15`, `EXAM_30`, and `EXAM_180_V1`

Decision status: Evidence packet only; no live values were changed

## Executive determination

| Form | Declared | Calculated | Delta (calculated - declared) | Repository determination |
|---|---:|---:|---:|---|
| `EXAM_AHD_15` | 24 | 18 | -6 | The current form was introduced as 24/18. No repository version supports 24 marks for its current membership. The strongest explanation is copied or stale metadata. |
| `EXAM_30` | 24 | 30 | +6 | The form was introduced as 24/30. The same seven questions had already totalled 30 in the earliest embedded bank and the pre-form runtime displayed the computed value. The strongest explanation is stale metadata. |
| `EXAM_180_V1` | 180 | 177 | -3 | No missing reference or membership omission was found. Five inherited rubric/score conflicts and one additional internally inconsistent rubric provide possible score clues, but Git cannot establish educational intent. The missing three marks are plausibly, but not conclusively, localized. |

All IDs in this packet are exact. `Q1` is not treated as `Q01`, and no padded/unpadded normalization was used.

## Evidence standard

Git establishes what values existed, when they entered the repository, and whether later commits changed them. It does not establish that a declared total, part score, or rubric statement was educationally correct. Candidate and canonical artifacts that merely copy legacy values are corroboration of lineage, not independent scoring authority.

The complete 78-row full-exam reconciliation is in
[`v4_exam_180_mark_reconciliation.csv`](v4_exam_180_mark_reconciliation.csv).

## `EXAM_AHD_15`: 24 declared versus 18 calculated

### Current composition

| Question | Part | Current `max_score` | Question subtotal |
|---|---|---:|---:|
| `Q1` | `Q1a` | 5 | 7 |
| `Q1` | `Q1b` | 2 | 7 |
| `Q4` | `Q4a` | 2 | 4 |
| `Q4` | `Q4b` | 2 | 4 |
| `Q5` | `Q5a` | 2 | 2 |
| `Q6` | `Q6a` | 0.5 | 5 |
| `Q6` | `Q6b` | 3 | 5 |
| `Q6` | `Q6c` | 1.5 | 5 |
| **Form total** | **8 parts** |  | **18** |

### Origin and interpretation

- Commit `b829a4594410fb7aff696bb29b683dd77523d44a` introduced the form on 2026-03-06 with the current exact membership (`Q1`, `Q4`, `Q5`, `Q6`) and `total_points: 24` in both `exam_forms.json` and the embedded `script.js` fallback.
- At introduction, the referenced parts already summed to 18. No later live membership or score change created the mismatch.
- The notice accurately describes the current form as a subset of `EXAM_30`.
- Two later feature-branch compositions (`77ea510` and `51acb6c`) retained 24 while using `Q2`, `Q3`, `Q6`, and `Q4`, which sum to 14.5. Their merge results retained the current 18-point membership. This persistence of 24 across different, non-24-point memberships is evidence of copied/static metadata, not evidence for a 24-mark educational target.
- The separate non-runtime Royal College gold-standard corpus preserves the current `Q1`, `Q4`, `Q5`, and `Q6` part caps. Those caps sum to 18 for this subset; the repository does not include the underlying official source document for independent verification in this audit.

**Finding:** Repository evidence supports 18 as the current membership's calculated score. It does not support 24 as the score of this membership. Calling 24 stale metadata is the strongest repository-based explanation, but Stephen must approve any published-total change.

## `EXAM_30`: 24 declared versus 30 calculated

### Current composition

| Question | Part | Current `max_score` | Question subtotal |
|---|---|---:|---:|
| `Q4` | `Q4a` | 2 | 4 |
| `Q4` | `Q4b` | 2 | 4 |
| `Q1` | `Q1a` | 5 | 7 |
| `Q1` | `Q1b` | 2 | 7 |
| `Q7` | `Q7a` | 2 | 6.5 |
| `Q7` | `Q7b` | 2 | 6.5 |
| `Q7` | `Q7c` | 2.5 | 6.5 |
| `Q3` | `Q3a` | 2 | 4 |
| `Q3` | `Q3b` | 2 | 4 |
| `Q6` | `Q6a` | 0.5 | 5 |
| `Q6` | `Q6b` | 3 | 5 |
| `Q6` | `Q6c` | 1.5 | 5 |
| `Q2` | `Q2a` | 1.5 | 1.5 |
| `Q5` | `Q5a` | 2 | 2 |
| **Form total** | **14 parts** |  | **30** |

### Origin and interpretation

- Commit `25333f4594e4ca249777d4af09cd57c0229cd730` introduced `EXAM_30` on 2026-02-28 with `Q1` through `Q7` and `total_points: 24.0`. Those parts summed to 30 at introduction.
- The earliest embedded bank in commit `1c6f9a0` already used the current part caps for `Q1` through `Q7`, totalling 30. Before form metadata existed, the runtime selected all seven practice questions and displayed their computed 30-point total.
- Commit `ef6d3b5c` changed only the order to the current sequence. The member set and 30-point calculation did not change.
- The separate official-sample reference artifact preserves `Q1` through `Q6` at 23.5 points. Adding `Q7` contributes 6.5, producing 30. Neither the six-question subtotal nor the seven-question total is 24; the artifact is repository corroboration, not a substitute for the underlying official document.
- `CHANGELOG.md` documents a seven-question fixed form but gives no basis for 24.

**Finding:** Repository history directly supports 30 for the current seven-question form. No reachable version shows the current membership totalling 24. The strongest explanation is stale metadata introduced with the form layer.

## `EXAM_180_V1`: 180 declared versus 177 calculated

### Per-question reconciliation

| Question | Parts | Current subtotal |
|---|---:|---:|
| `Q24` | 4 | 9.5 |
| `Q11` | 5 | 10 |
| `Q03` | 2 | 3.5 |
| `Q28` | 4 | 12.5 |
| `Q17` | 3 | 6 |
| `Q06` | 3 | 4.5 |
| `Q25` | 2 | 6 |
| `Q13` | 2 | 6 |
| `Q20` | 4 | 6.5 |
| `Q08` | 1 | 4 |
| `Q02` | 1 | 1.5 |
| `Q16` | 2 | 5 |
| `Q27` | 3 | 9.5 |
| `Q29` | 2 | 6 |
| `Q15` | 3 | 5.5 |
| `Q21` | 3 | 5 |
| `Q09` | 3 | 5 |
| `Q04` | 1 | 4.5 |
| `Q10` | 2 | 4 |
| `Q22` | 3 | 4.5 |
| `Q18` | 3 | 7 |
| `Q07` | 2 | 3 |
| `Q19` | 4 | 8.5 |
| `Q12` | 3 | 5 |
| `Q05` | 3 | 5.5 |
| `Q26` | 2 | 8 |
| `Q23` | 3 | 11 |
| `Q14` | 3 | 6.5 |
| `Q01` | 2 | 3.5 |
| **Total** | **78** | **177** |

### Membership and score history

- The initial uploaded blobs in `b98e6d9` and their identically hashed generic copies in `5dce9e0` declared 180, referenced every exact ID `Q01` through `Q29`, and calculated to 155.5 across 66 parts.
- Commit `0e1281b` added 12 full-exam parts worth 21.5 points, bringing the form to 78 parts and 177 points. It did not change the declared 180.
- Later commits reordered the same 29 exact IDs. No question was removed from or added to the set, and no later commit brought the part sum to 180.
- All 29 current references resolve exactly once. There is no repository evidence of an omitted full-exam question.

### Rubric/score conflicts relevant to adjudication

| Part | Current `max_score` | Explicit rubric evidence | Assessment |
|---|---:|---|---|
| `Q15_15c` | 2 | “3 marks total”; three one-mark elements | Direct disagreement; potential +1. The prompt asks for a definition and one example, while the rubric adds a public-health implication not requested by the prompt. |
| `Q17_17a` | 2 | “2 marks total,” but listed allocations are 0.5 + 0.5 + 1 + 1 = 3 | Internally contradictory; potential +1 only if allocations, rather than the stated total, are authoritative. |
| `Q18_18a` | 1 | “1 mark total,” followed by “Key window (2 marks)” | Internally contradictory; potential +1 only if the inner value is authoritative. |
| `Q19_19c` | 2 | “0.5 mark each, 1.5 marks total” | Direct disagreement; aligning to rubric would subtract 0.5. |
| `Q19_19d` | 1.5 | “1 mark each, 2 marks total” | Direct disagreement; aligning to rubric would add 0.5. |
| `Q13_13b` | 3 | Header says 3 marks, but the retained rubric describes allocations totalling 8 and no longer matches the revised prompt cleanly | Additional rubric-quality conflict, but not a credible isolated explanation of the three-mark form gap. |

These conflicts were not newly introduced by candidate migration. The relevant score/rubric combinations trace to the initial uploaded JSON, and the approved pilot artifacts deliberately carry them forward without semantic reinterpretation. Their `source_profile` remains `needs_full_source_review`; `source_list` is empty. `Q18` was explicitly removed from the low-risk pilot path and returned to medium-risk review.

### Can the missing three marks be localized?

**Plausible candidate localization, not confirmed fact:**

```text
current calculated total                         177
Q15_15c: 2 -> rubric's 3                         +1
Q17_17a: 2 -> component allocation sum of 3      +1
Q18_18a: 1 -> inner rubric statement of 2        +1
Q19_19c: 2 -> rubric's 1.5                     -0.5
Q19_19d: 1.5 -> rubric's 2                     +0.5
candidate reconciled total                        180
```

This arithmetic exactly reaches 180 and identifies `Q15_15c`, `Q17_17a`, and `Q18_18a` as the three positive one-mark candidates. However, it is not a safe automatic correction:

- `Q17_17a` and `Q18_18a` each contain a rubric headline that agrees with the current `max_score` and a subordinate statement that does not.
- `Q15_15c` contains a third rubric element that is not requested by the prompt.
- The `Q19` disagreements cancel numerically but remain educational defects.
- The same contradictions existed in the initial source JSON, so Git cannot identify which side of each contradiction is authoritative.

**Conclusion:** The three-mark gap is localized to a credible candidate set, but not adjudicated. It cannot be resolved from repository provenance alone.

## Ranked correction options

### `EXAM_AHD_15`

| Rank | Option | Evidence supporting | Evidence against | Educational/runtime impact | Stephen adjudication |
|---:|---|---|---|---|---|
| 1 | **A. Metadata-only: 24 -> 18** | Exact current parts total 18; current form was born 24/18; gold-standard caps corroborate the subset scores; 24 persisted across unrelated memberships | No repository decision record explicitly says the published target should be 18 | Changes displayed form total and form metadata; does not change membership, part caps, or scoring denominator | **Required** before changing a published total |
| 2 | **D. Review original source/decision record** | Best way to confirm whether 24 was a target rather than a copied value | The repository contains no identified AHD source document, so review requires an external artifact | No runtime impact while pending | **Required** |
| 3 | **B. Membership correction to reach 24** | Could preserve the declared total | No historical AHD membership totals 24; changing membership alters the assessment | Changes questions, time burden, content coverage, and score denominator | **Required; educational review** |
| 4 | **C. Question/part score correction totalling +6** | Could preserve the declared total | No rubric or history evidence supports adding six marks to these parts | Reweights official/sample content and changes scoring | **Required; educational review** |

**Recommendation, distinguished from fact:** After Stephen confirms that current membership is intended, correct metadata to 18. The confirmed fact is only that current membership calculates to 18 and has never calculated to 24 in repository history.

### `EXAM_30`

| Rank | Option | Evidence supporting | Evidence against | Educational/runtime impact | Stephen adjudication |
|---:|---|---|---|---|---|
| 1 | **A. Metadata-only: 24 -> 30** | Seven questions have always summed to 30; pre-form runtime displayed computed 30; form was born 24/30; current order change did not affect total | No commit message explicitly labels 24 a typo | Changes displayed form total and metadata; does not change membership, part caps, or scoring denominator | **Required** before changing a published total |
| 2 | **D. Review original practice-form decision/source** | Can confirm whether the seven-question form or a 24-mark target was intended | No such source is present in Git; the official six-question corpus totals 23.5, not 24 | No runtime impact while pending | **Required** if the 24-mark target remains plausible to the owner |
| 3 | **B. Membership correction to reach 24** | Could preserve 24 | No historical seven-question composition totals 24; no exact subset is identified by a decision record | Changes form content and coverage | **Required; educational review** |
| 4 | **C. Question/part score correction totalling -6** | Could preserve 24 with seven questions | Contradicts long-lived part caps and the official-sample reference for `Q1`-`Q6` | Reweights questions and scoring | **Required; educational review** |

**Recommendation, distinguished from fact:** After Stephen confirms that all seven current questions are intended, correct metadata to 30. The confirmed facts are the exact 30-point calculation and its continuity since the earliest embedded bank.

### `EXAM_180_V1`

| Rank | Option | Evidence supporting | Evidence against | Educational/runtime impact | Stephen adjudication |
|---:|---|---|---|---|---|
| 1 | **D. Review the original full-exam source bank** | Required to resolve contradictory inherited score/rubric statements; candidate artifacts themselves require full source review | The original Word/PDF is not in Git | No runtime impact while pending | **Required** |
| 2 | **A. Metadata-only: 180 -> 177** | Exact current membership is complete and totals 177; no historical version reaches 180; current scoring denominator is 177 | The form has always declared 180; an exact three-mark rubric-based candidate reconciliation exists | Changes displayed total and published metadata, not questions or scoring caps | **Required** |
| 3 | **C. Correct implicated part scores/rubrics** | `Q15_15c`, `Q17_17a`, and `Q18_18a` can supply +3; `Q19_19c`/`Q19_19d` can be reconciled with net zero | Rubric statements conflict internally or with prompts; Git cannot establish authoritative values | Changes educational weighting, denominator, exports, and feedback | **Required; original-source educational review** |
| 4 | **B. Membership correction** | Could theoretically add three marks | Initial and current forms contain the same complete `Q01`-`Q29` set; no omitted exact ID was found | Adds/removes assessed content and changes timing/coverage | **Required; no repository support** |

**Recommendation, distinguished from fact:** Do not alter the full form until Stephen reviews the original source. If that source cannot be recovered, metadata-only 177 is the least inferential correction because it describes the existing assessment; it still requires explicit approval. Do not implement the candidate +3 score changes solely because their arithmetic reaches 180.

## Information unavailable from Git

The repository does not contain the original Word/PDF used to create `question_bank_EXAM_180_V1 (1).json`, nor a mark blueprint or adjudication record explaining the intended 180 marks. Stephen should locate and review the original full-exam question-and-answer source, focusing on:

- the syndemic part now identified as `Q15_15c`;
- the emergency-management phases part `Q17_17a`;
- the mumps communicability part `Q18_18a`;
- the measles immune-globulin and immunity parts `Q19_19c` and `Q19_19d`;
- the change-management part `Q13_13b` because its prompt and retained rubric diverge.

For the short forms, Git does not contain an AHD form blueprint or a decision record defining a 24-mark target. The repository's Royal College 2025 sample corpus can verify the existing `Q1`-`Q6` caps, but it cannot establish the intended membership or declared total of `EXAM_AHD_15` or `EXAM_30`. The V4 charter is a governance source and does not adjudicate these part marks.

## Safe automation boundary

No educational repair is safe to apply automatically without approval. After Stephen chooses a correction, the following implementation work is mechanical: update the approved form metadata and its embedded fallback together, regenerate integrity reports, and add equality tests. Membership, prompts, rubrics, and `max_score` values require explicit educational review.
