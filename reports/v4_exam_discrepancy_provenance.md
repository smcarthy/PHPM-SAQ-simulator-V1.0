# V4 Exam Discrepancy Provenance

Date: 2026-10-24

Repository ref examined: current `origin/main` / working branch ancestry

Method: exact-ID inspection of current files and all reachable Git history

## Scope and identity rule

The investigation covered:

- `exam_forms.json` and all reachable revisions;
- `question_bank.json` and its uploaded predecessor artifacts;
- embedded bank/form data in `script.js`;
- relevant migration/candidate artifacts;
- `CHANGELOG.md`;
- current integrity-audit outputs and validator behavior.

IDs were compared as exact strings. In particular, short-bank `Q1`-`Q7` objects and full-bank `Q01`-`Q29` objects remain distinct. No normalized matching was used.

## Source-object lineage

| Object | Commit/path | Git blob | Finding |
|---|---|---|---|
| Initial full form | `b98e6d9:exam_forms_EXAM_180_V1 (1).json` | `cb868f36e270e68cb1790e3f2b9ad2e9644d701a` | Declared 180; exact membership `Q01`-`Q29` |
| Generic full form | `5dce9e0:exam_forms.json` | `cb868f36e270e68cb1790e3f2b9ad2e9644d701a` | Byte-identical rename/copy of initial form |
| Initial full bank | `b98e6d9:question_bank_EXAM_180_V1 (1).json` | `fe4437a514a2f849f8a2aa9cfbd0cf3ecb49284e` | 66 form parts; 155.5 calculated points |
| Generic full bank | `5dce9e0:question_bank.json` | `fe4437a514a2f849f8a2aa9cfbd0cf3ecb49284e` | Byte-identical rename/copy of initial bank |

The filenames establish that the full form arrived as an uploaded JSON artifact. They do not identify the Word/PDF from which it was transcribed.

## Chronology

| Commit | Time | Relevant change | Declared/calculated consequence |
|---|---|---|---|
| `1c6f9a0` | Before form-layer introduction | Embedded short bank contains `Q1`-`Q7` with the current part caps; practice mode selects all seven and computes the displayed total | 30 computed; no `total_points` metadata |
| `b98e6d9` | 2026-02-28 | Uploads named full-form/full-bank artifacts | Full 180/155.5, 29 questions, 66 parts |
| `5dce9e0` | 2026-02-28 12:53:59 -05:00 | Adds byte-identical generic form/bank paths | Full remains 180/155.5 |
| `25333f4` | 2026-02-28 13:01:59 -05:00 | Combines short and full banks; introduces `EXAM_30` in file and embedded fallback | `EXAM_30` enters as 24/30 with `Q1`-`Q7`; full remains 180/155.5 |
| `0e1281b` | 2026-02-28 15:13:28 -05:00 | Expands/reshapes full questions, adding 12 parts worth 21.5 points | Full becomes 180/177, 78 parts |
| `ef6d3b5` | 2026-02-28 16:36:51 -05:00 | Locks/reorders both existing forms | Same member sets and totals: short 24/30; full 180/177 |
| `66ed5c6` | 2026-02-28 16:56:44 -05:00 | Reorders the full form again | Full remains 180/177 |
| `b829a45` | 2026-03-06 08:14:39 -05:00 | Introduces current AHD form in file and embedded fallback | AHD enters as 24/18 with `Q1`,`Q4`,`Q5`,`Q6` |

No later live-bank score change or form-membership change resolves any of the three mismatches.

## Short-form provenance

### `EXAM_30`

The exact line history places the first `total_points: 24.0` in `25333f4`. Its introduction diff also contains all seven IDs. At that commit the combined bank already calculates to 30.

The form order changed from:

```text
Q1,Q2,Q3,Q4,Q5,Q6,Q7
```

to:

```text
Q4,Q1,Q7,Q3,Q6,Q2,Q5
```

The exact member set did not change. `CHANGELOG.md` calls it the legacy seven-question 30-minute form, but does not explain 24.

The earliest embedded short bank predates `exam_forms.json` and uses the same scores. Its runtime computed and displayed 30 from part caps. This is direct evidence that 24 was introduced by the later form metadata rather than inherited from the working score calculation.

The separate 2025 Royal College non-runtime corpus preserves the exact `Q1`-`Q6` scores at 23.5 total. `Q7` adds 6.5 in the live bank. This corroborates 30 for the current seven-question data but does not decide form intent or replace review of the underlying official source.

### `EXAM_AHD_15`

Commit `b829a45` introduced all of the following together:

- exact membership `Q1,Q4,Q5,Q6`;
- 900-second duration;
- `total_points: 24`;
- notice identifying those questions as reused from `EXAM_30`;
- the identical embedded fallback form.

The four questions totalled 18 at that moment. No prior AHD object or repository decision record was found.

Two sibling feature-branch commits provide additional negative evidence:

| Commit | Membership | Calculated | Declared | Mainline merge outcome |
|---|---|---:|---:|---|
| `77ea510` | `Q2,Q3,Q6,Q4` | 14.5 | 24 | Subsequent merge result retained the original current membership |
| `51acb6c` | `Q3,Q2,Q6,Q4` | 14.5 | 24 | PR merge result retained the original current membership |

Thus, 24 persisted while candidate membership changed from 18 points to 14.5 points. This is consistent with static/copied metadata. It is not affirmative evidence of an intended 24-mark composition.

## Full-form provenance

### Membership

The initial and current full forms contain the same exact set of 29 IDs, `Q01` through `Q29`. Commits `ef6d3b5` and `66ed5c6` changed order only. All current references resolve exactly once. There is no historical membership deletion that accounts for three marks.

### Part expansion in `0e1281b`

The initial 66-part full bank calculated to 155.5. Commit `0e1281b` added 12 semantic parts with 21.5 total points:

```text
Q07_7b       2
Q14_14c      2
Q15_15b      1
Q16_16b      2
Q17_17b      2
Q17_17c      2
Q19_19b      2
Q20_20d      1
Q21_21c      1.5
Q22_22b      2
Q22_22c      1
Q25_25b      3
total       21.5
```

It also shifted legacy semantic parts to new exact IDs while preserving their score/rubric combinations:

- the syndemic part moved from `Q15_15b` to `Q15_15c`;
- the immune-globulin priority part moved from `Q19_19b` to `Q19_19c`;
- the measles-immunity part moved from `Q19_19c` to `Q19_19d`.

This yields 155.5 + 21.5 = 177. The declared 180 was left unchanged. Later commits did not add the remaining three points.

### Inherited scoring contradictions

The source JSON already contained the material conflicts now seen at:

- `Q15_15c`: score 2 versus rubric total 3;
- `Q17_17a`: score/header 2 versus component allocations totalling 3;
- `Q18_18a`: score/header 1 versus inner “2 marks” statement;
- `Q19_19c`: score 2 versus rubric total 1.5;
- `Q19_19d`: score 1.5 versus rubric total 2.

The last two semantic parts had different exact IDs in the initial upload, but the conflict followed the prompt/rubric content during re-ID. Their possible corrections have a net-zero effect. The first three each expose a possible positive one-mark difference, which is why they form an exact—but unconfirmed—candidate reconciliation to 180.

`Q13_13b` is a separate inherited rubric-quality problem: the current 3-point score agrees with the rubric headline, but the retained detailed allocations describe eight points and the prompt was revised without a corresponding clean rubric rewrite. It does not explain the isolated three-mark gap.

## Candidate and migration artifacts

The migration policy explicitly preserves `max_score` and rubric/answer-key content without semantic reinterpretation. Therefore, copied values in candidate artifacts are lineage evidence only.

The approved pilot contains migrated `Q14`, `Q15`, `Q16`, `Q17`, `Q19`, `Q20`, `Q21`, `Q22`, and `Q25`. For these questions:

- legacy scores and answer keys are carried forward;
- `source_profile` is `needs_full_source_review`;
- `source_list` is empty.

The approved-pilot validation report explicitly excludes `Q18`; it was returned to the medium-risk queue. These artifacts do not adjudicate the full-form mark discrepancy.

## Embedded runtime data and behavior

Current `script.js` embeds the same three forms and declared totals as `exam_forms.json`. The integrity validator confirms that the embedded and file-backed data match.

Runtime behavior makes the discrepancy visible in two different ways:

- the points indicator prefers non-zero `form.total_points`, displaying 24, 24, and 180;
- scoring summaries add part `max_score`, producing denominators of 30, 18, and 177;
- exports retain per-part `max_score` values.

This behavior does not determine which value is educationally correct. It does mean a metadata-only correction changes the displayed total while leaving the current scoring denominator intact.

## CHANGELOG and decision-record search

`CHANGELOG.md` records the dual-form workflow, exact seven-question `EXAM_30`, exact 29-question `EXAM_180_V1`, fixed ordering, and data fallback. It contains no rationale for 24 or 180 and no mark reconciliation. No migration report supplies an original mark blueprint.

## Provenance limits and required external source

Git contains the initial JSON upload but no original Word/PDF source bank, examiner blueprint, or signed mark adjudication. The exact external filename cannot be determined from GitHub.

Stephen should review the original question-and-answer document used to create:

```text
question_bank_EXAM_180_V1 (1).json
exam_forms_EXAM_180_V1 (1).json
```

The source review should compare the exact prompts, rubric allocations, and marks for `Q15_15c`, `Q17_17a`, `Q18_18a`, `Q19_19c`, `Q19_19d`, and `Q13_13b`. For the short forms, an original AHD/practice form blueprint or explicit product decision is needed if Stephen believes 24 was an intentional target rather than stale metadata.

## Reproducibility notes

The history reconstruction used exact-object inspection (`git show`), line attribution (`git blame`), string-introduction searches (`git log -S`), blob identity (`git ls-tree`), and calculated sums from each commit's contemporaneous bank and form files. All calculations used numeric `parts[].max_score` values and exact question IDs.
