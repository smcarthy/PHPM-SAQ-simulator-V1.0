# V4 Written SAQ examination integrity audit

Generated: 2026-10-24T15:53:28.198Z

## Executive result

- **Overall status:** FAIL
- **Scope:** Three default published forms plus the opt-in pilot compatibility
  form.
- **Hard failures:** 3
- **Warnings:** 13
- **Primary finding:** Every JSON-defined default form has a
  declared-versus-calculated point mismatch. No mismatch is caused by a missing
  or duplicate question reference.

## Dataset and grain

- **Live bank:** 36 questions, 92 parts, 207 total part points.
- **Published default forms:** 3
- **Pilot artifact:** 15 questions, 38 parts, 77 points.
- **Fallback parity:** Embedded bank and form data in script.js exactly match
  the JSON files.

## Live bank validity

- **max_score:** All 92 parts have finite, positive numeric max_score values.
- **Question references:** All 36 live questions are referenced by at least one
  default form.
- **Part IDs:** No duplicate part IDs were found.
- **Response types:** list=69, text=21, haddon_matrix=1,
  two_by_two_workspace=1. All are supported by current runtime branches.
- **Prompt/list-count warnings:** Q01/Q01_1a implies 5 but configures 4;
  Q01/Q01_1b implies 2 but configures 3; Q09/Q09_9a implies 4 but configures 3;
  Q17/Q17_17b implies 1 but configures 4.

## Taxonomy code legend

- **Written classifications:** PH Population Health; HS Health Systems; BS
  Basic Sciences of Public Health and Preventive Medicine; HPDP Intervention
  and Methods in Health Promotion and Disease Prevention; HP Intervention and
  Methods in Health Protection; MPP Management and Program Planning
- **Topic themes:** A Communicable Diseases; B Non-Communicable Diseases; C
  Mental Health and Substance Use; D Environmental Health; E Maternal and Child
  Health; F Injury: Voluntary and Involuntary; G Other

## Default published forms

### `EXAM_30` — FAIL

- **Duration:** 1800 seconds (30 minutes).
- **Points:** declared 24; calculated 30; delta calculated minus declared 6.
- **Composition:** 7 questions and 14 parts.
- **Question IDs:** Q4, Q1, Q7, Q3, Q6, Q2, Q5
- **Per-question points:** Q4=4, Q1=7, Q7=6.5, Q3=4, Q6=5, Q2=1.5, Q5=2
- **References:** All references resolve exactly once; no duplicate IDs in the
  form.
- **Response types:** list, text
- **Notice assessment:** Accurate as a legacy 30-minute label; it does not
  mention that EXAM_AHD_15 reuses four questions.
- **Taxonomy question coverage:** 6/7 (85.714%).
- **Written taxonomy coverage:** 11/14 parts and 23.5/30 points.
- **Written distribution:** PH: 0 parts / 0 points; HS: 2 parts / 4.5 points;
  BS: 1 part / 2 points; HPDP: 2 parts / 2.5 points; HP: 3 parts / 5.5 points;
  MPP: 3 parts / 9 points
- **Theme taxonomy coverage:** 11/14 parts and 23.5/30 points.
- **Theme distribution:** A: 1 part / 1.5 points; B: 3 parts / 5 points; C: 0
  parts / 0 points; D: 2 parts / 4 points; E: 2 parts / 4 points; F: 0 parts /
  0 points; G: 3 parts / 9 points

Hard failures:

- **DECLARED_TOTAL_MISMATCH:** Declared 24 points but summed part max_score is
  30 (delta 6).

Warnings:

- **AMBIGUOUS_NUMERIC_ID_NAMESPACE:** The form uses IDs that collide
  numerically with distinct bank IDs: Q01/Q1, Q02/Q2, Q03/Q3, Q04/Q4, Q05/Q5,
  Q06/Q6, Q07/Q7. Exact runtime lookup is safe, but normalized or manual lookup
  is not.
- **INCOMPLETE_CANONICAL_TAXONOMY:** Canonical part-level taxonomy is
  incomplete for this form; missing metadata was not inferred.
- **NOTICE_OMITS_FORM_OVERLAP:** The notice does not mention that EXAM_AHD_15
  reuses Q1, Q4, Q5, and Q6.

### `EXAM_AHD_15` — FAIL

- **Duration:** 900 seconds (15 minutes).
- **Points:** declared 24; calculated 18; delta calculated minus declared -6.
- **Composition:** 4 questions and 8 parts.
- **Question IDs:** Q1, Q4, Q5, Q6
- **Per-question points:** Q1=7, Q4=4, Q5=2, Q6=5
- **References:** All references resolve exactly once; no duplicate IDs in the
  form.
- **Response types:** list, text
- **Notice assessment:** Accurately identifies Q1, Q4, Q5, and Q6 as reused
  from EXAM_30.
- **Taxonomy question coverage:** 4/4 (100%).
- **Written taxonomy coverage:** 8/8 parts and 18/18 points.
- **Written distribution:** PH: 0 parts / 0 points; HS: 2 parts / 4.5 points;
  BS: 1 part / 2 points; HPDP: 2 parts / 2.5 points; HP: 0 parts / 0 points;
  MPP: 3 parts / 9 points
- **Theme taxonomy coverage:** 8/8 parts and 18/18 points.
- **Theme distribution:** A: 0 parts / 0 points; B: 3 parts / 5 points; C: 0
  parts / 0 points; D: 0 parts / 0 points; E: 2 parts / 4 points; F: 0 parts /
  0 points; G: 3 parts / 9 points

Hard failures:

- **DECLARED_TOTAL_MISMATCH:** Declared 24 points but summed part max_score is
  18 (delta -6).

Warnings:

- **AMBIGUOUS_NUMERIC_ID_NAMESPACE:** The form uses IDs that collide
  numerically with distinct bank IDs: Q01/Q1, Q04/Q4, Q05/Q5, Q06/Q6. Exact
  runtime lookup is safe, but normalized or manual lookup is not.

### `EXAM_180_V1` — FAIL

- **Duration:** 10800 seconds (180 minutes).
- **Points:** declared 180; calculated 177; delta calculated minus declared -3.
- **Composition:** 29 questions and 78 parts.
- **Question IDs:** Q24, Q11, Q03, Q28, Q17, Q06, Q25, Q13, Q20, Q08, Q02, Q16,
  Q27, Q29, Q15, Q21, Q09, Q04, Q10, Q22, Q18, Q07, Q19, Q12, Q05, Q26, Q23,
  Q14, Q01
- **Per-question points:** Q24=9.5, Q11=10, Q03=3.5, Q28=12.5, Q17=6, Q06=4.5,
  Q25=6, Q13=6, Q20=6.5, Q08=4, Q02=1.5, Q16=5, Q27=9.5, Q29=6, Q15=5.5, Q21=5,
  Q09=5, Q04=4.5, Q10=4, Q22=4.5, Q18=7, Q07=3, Q19=8.5, Q12=5, Q05=5.5, Q26=8,
  Q23=11, Q14=6.5, Q01=3.5
- **References:** All references resolve exactly once; no duplicate IDs in the
  form.
- **Response types:** haddon_matrix, list, text, two_by_two_workspace;
  specialized but supported: haddon_matrix, two_by_two_workspace
- **Notice assessment:** Empty notice; no exact question IDs overlap the
  shorter forms.
- **Taxonomy question coverage:** 9/29 (31.034%).
- **Written taxonomy coverage:** 27/78 parts and 53.5/177 points.
- **Written distribution:** PH: 2 parts / 3.5 points; HS: 2 parts / 4 points;
  BS: 2 parts / 2.5 points; HPDP: 0 parts / 0 points; HP: 17 parts / 35 points;
  MPP: 4 parts / 8.5 points
- **Theme taxonomy coverage:** 27/78 parts and 53.5/177 points.
- **Theme distribution:** A: 16 parts / 30.5 points; B: 0 parts / 0 points; C:
  2 parts / 4.5 points; D: 7 parts / 13.5 points; E: 1 part / 3 points; F: 0
  parts / 0 points; G: 1 part / 2 points

Hard failures:

- **DECLARED_TOTAL_MISMATCH:** Declared 180 points but summed part max_score is
  177 (delta -3).

Warnings:

- **AMBIGUOUS_NUMERIC_ID_NAMESPACE:** The form uses IDs that collide
  numerically with distinct bank IDs: Q01/Q1, Q02/Q2, Q03/Q3, Q04/Q4, Q05/Q5,
  Q06/Q6, Q07/Q7. Exact runtime lookup is safe, but normalized or manual lookup
  is not.
- **INCOMPLETE_CANONICAL_TAXONOMY:** Canonical part-level taxonomy is
  incomplete for this form; missing metadata was not inferred.

## Opt-in pilot compatibility form

- **Status:** PASS_WITH_WARNINGS
- **Identity:** Data mode pilot; runtime form ID EXAM_180_V1.
- **Duration:** 10800 seconds (180 minutes).
- **Points:** runtime-declared 77; calculated 77; delta 0.
- **Composition:** 15 questions and 38 parts.
- **Response types:** list, short_text, text; short_text is explicitly adapted
  to text.
- **Taxonomy:** All pilot parts have primary written and theme codes, but all
  assignments remain candidate metadata and nine migrated questions still
  require full source review.
- **Written distribution:** PH: 2 parts / 3.5 points; HS: 4 parts / 8.5 points;
  BS: 3 parts / 4.5 points; HPDP: 2 parts / 2.5 points; HP: 20 parts / 40.5
  points; MPP: 7 parts / 17.5 points
- **Theme distribution:** A: 17 parts / 32 points; B: 3 parts / 5 points; C: 2
  parts / 4.5 points; D: 9 parts / 17.5 points; E: 3 parts / 7 points; F: 0
  parts / 0 points; G: 4 parts / 11 points
- **PILOT_SOURCE_REVIEW_PENDING:** 9 migrated pilot questions retain
  needs_full_source_review provenance.
- **PILOT_TAXONOMY_PROVISIONAL:** 38 pilot parts use proposed candidate
  taxonomy assignments.

## Exact mismatch causes

- **EXAM_30:** The seven referenced questions sum to 30 points, not 24. The AHD
  subset contributes 18 points and Q7, Q3, and Q2 add 12 points.
- **EXAM_AHD_15:** Q1, Q4, Q5, and Q6 sum to 18 points, not 24. The notice
  accurately identifies the four-question subset of EXAM_30.
- **EXAM_180_V1:** All 29 references resolve and their 78 parts sum to 177
  points, not 180. The data do not identify whether the intended repair is a
  declaration, membership, or educational scoring change.

## Question-ID integrity

- **Exact duplicate live question IDs:** none
- **Numeric collision groups:** Q01 / Q1, Q02 / Q2, Q03 / Q3, Q04 / Q4, Q05 /
  Q5, Q06 / Q6, Q07 / Q7
- **Interpretation:** Q1 through Q7 collide numerically with Q01 through Q07.
  They are distinct exact-string records with different content and are
  assigned to different forms. Runtime lookup uses exact strings, but human or
  future normalized-ID workflows can conflate them.

## Runtime scoring and export behaviour

- **Exam points display:** startExam and resume prefer non-zero
  form.total_points over the computed sum, so the UI displays 24, 24, and 180
  for the three default forms despite computed totals of 30, 18, and 177.
- **Scoring denominator:** updateScoreSummary sums active part max_score
  values, so scoring denominators are 30, 18, and 177. This conflicts with the
  points indicator for every default form.
- **Attempt export:** Attempt and scored exports include exam_form_id,
  duration, and per-part max_score values, but no declared or computed form
  total. A consumer must sum parts and will obtain the computed totals.
- **Pilot total:** createPilotExamForms computes total_points from adapted
  pilot parts at runtime, so its declared and computed values both equal 77.
- **ID lookup:** resolveQuestionsForForm indexes exact string IDs. Q1 and Q01
  do not collide at runtime, although normalization or manual review can
  conflate them.

## Taxonomy limitations

- **PARTIAL_LIVE_BANK_COVERAGE:** Approved canonical/pilot traceability covers
  Q1-Q6 and Q14, Q15, Q16, Q17, Q19, Q20, Q21, Q22, and Q25 only. Other live
  questions remain unmapped in this audit.
- **NO_SILENT_INFERENCE:** Legacy numeric domain or rc_classification values
  were not converted to canonical codes unless an explicit approved-pilot
  mapping existed.
- **PROVISIONAL_ASSIGNMENTS:** All 38 pilot parts carry proposed candidate
  taxonomy status; this audit reports those labels but does not treat them as
  final expert review.
- **SOURCE_REVIEW_PENDING:** Nine migrated pilot questions retain
  needs_full_source_review and should not be treated as fully reviewed
  educational content.
- **COUNTING_POLICY:** Coverage distributions use the taxonomy policy’s first
  primary part-level code. Secondary labels are not double-counted.

## Safe automation versus educational review

Safe follow-up automation:

- Run this validator in CI and preserve its JSON output as release evidence.
- Add regression tests for exact references, duplicate references, duration,
  declared-versus-computed totals, response support, and embedded-data parity.
- Add explicit test fixtures for Q1/Q01 collisions without renaming live IDs.
- Update form-overlap documentation after the authoritative form decisions are
  approved.

Requires Stephen’s educational review:

- Changing any form total_points value, question membership, part max_score,
  rubric, or notice that describes educational intent.
- Deciding whether EXAM_180_V1 should become 177 points or gain/reweight
  content to reach 180 points.
- Deciding whether EXAM_30 should be 30 points and EXAM_AHD_15 should be 18
  points, or whether their memberships or scoring were intended to differ.
- Resolving or renaming Q1/Q01 through Q7/Q07 identifier namespaces.
- Approving missing taxonomy, source provenance, blueprint balance, and the
  educational suitability of candidate questions.

## Recommendation for a 90-minute candidate form

1. Do not publish EXAM_90 until Stephen resolves the three current point-total
   mismatches and approves the intended score target for a 90-minute form.
2. Create a candidate artifact outside exam_forms.json using exact live IDs and
   never include both members of a Qn/Q0n collision without explicit review.
3. Select only reviewed questions with valid part scores, supported response
   types, acceptable provenance, and explicitly approved canonical taxonomy.
4. Use first-primary part-level taxonomy codes to measure draft blueprint
   coverage, show all missing metadata, and obtain educational approval for
   classification and theme balance rather than filling gaps by inference.
5. Require calculated points to equal the approved declared total, document all
   overlap with existing forms, and add form-specific data and browser tests
   before making the candidate live.
