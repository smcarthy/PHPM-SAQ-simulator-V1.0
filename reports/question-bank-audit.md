# Question Bank Migration Audit

Generated: 2026-03-08T01:17:29.211Z

## Scope
- Inputs: `question_bank.json`, `exam_forms.json`
- Questions inventoried: 36
- Forms inspected: 3 (EXAM_30, EXAM_AHD_15, EXAM_180_V1)

## Migration Risk Summary
- Low risk: 9
- Medium risk: 14
- High risk: 13

## Global Inconsistency Flags
- mixed_id_conventions: true
- mixed_number_usage: true
- mixed_domain_usage: true
- mixed_rc_classification_usage: true
- mixed_theme_usage: true
- mixed_response_types: true
- unsupported_or_unclear_response_structures: haddon_matrix, two_by_two_workspace

## Issue Counts
- missing_source_metadata: 36
- missing_question_number: 29
- missing_legacy_domain: 19
- ambiguous_numeric_id_collision: 14
- missing_rc_classification: 7
- missing_theme: 7
- contains_nonstandard_response_type: 2
- multiple_legacy_domain_values_within_question: 1

## Per-Question Inventory
| id | number | legacy_domain | rc_classification | theme | points | parts | response_types | stem_image | source_metadata | forms | risk | key_issues |
|---|---:|---|---|---|---:|---:|---|---|---|---|---|---|
| Q01 | — | — | 3,2 | A,B | 3.5 | 2 | list | no | no | EXAM_180_V1 | high | missing_question_number, ambiguous_numeric_id_collision, missing_legacy_domain, missing_source_metadata |
| Q1 | 1 | 7 | — | — | 7 | 2 | list | no | no | EXAM_30,EXAM_AHD_15 | high | ambiguous_numeric_id_collision, missing_rc_classification, missing_theme, missing_source_metadata |
| Q02 | — | — | 1 | E | 1.5 | 1 | list | no | no | EXAM_180_V1 | high | missing_question_number, ambiguous_numeric_id_collision, missing_legacy_domain, missing_source_metadata |
| Q2 | 2 | 3 | — | — | 1.5 | 1 | list | no | no | EXAM_30 | high | ambiguous_numeric_id_collision, missing_rc_classification, missing_theme, missing_source_metadata |
| Q03 | — | — | 1 | C | 3.5 | 2 | list,text | no | no | EXAM_180_V1 | high | missing_question_number, ambiguous_numeric_id_collision, missing_legacy_domain, missing_source_metadata |
| Q3 | 3 | 4 | — | — | 4 | 2 | list | no | no | EXAM_30 | high | ambiguous_numeric_id_collision, missing_rc_classification, missing_theme, missing_source_metadata |
| Q04 | — | — | 4 | F | 4.5 | 1 | haddon_matrix | no | no | EXAM_180_V1 | high | missing_question_number, ambiguous_numeric_id_collision, missing_legacy_domain, missing_source_metadata, contains_nonstandard_response_type |
| Q4 | 4 | 9,7 | — | — | 4 | 2 | list | no | no | EXAM_30,EXAM_AHD_15 | high | ambiguous_numeric_id_collision, missing_rc_classification, missing_theme, multiple_legacy_domain_values_within_question, missing_source_metadata |
| Q05 | — | — | 5,6 | D | 5.5 | 3 | list | no | no | EXAM_180_V1 | high | missing_question_number, ambiguous_numeric_id_collision, missing_legacy_domain, missing_source_metadata |
| Q5 | 5 | 6 | — | — | 2 | 1 | list | no | no | EXAM_30,EXAM_AHD_15 | high | ambiguous_numeric_id_collision, missing_rc_classification, missing_theme, missing_source_metadata |
| Q06 | — | — | 3 | B | 4.5 | 3 | text | no | no | EXAM_180_V1 | high | missing_question_number, ambiguous_numeric_id_collision, missing_legacy_domain, missing_source_metadata |
| Q6 | 6 | 2 | — | — | 5 | 3 | list,text | no | no | EXAM_30,EXAM_AHD_15 | high | ambiguous_numeric_id_collision, missing_rc_classification, missing_theme, missing_source_metadata |
| Q07 | — | 5 | 4 | B | 3 | 2 | list | no | no | EXAM_180_V1 | medium | missing_question_number, ambiguous_numeric_id_collision, missing_source_metadata |
| Q7 | 7 | 2 | — | — | 6.5 | 3 | list | no | no | EXAM_30 | high | ambiguous_numeric_id_collision, missing_rc_classification, missing_theme, missing_source_metadata |
| Q08 | — | — | 2 | B | 4 | 1 | list | no | no | EXAM_180_V1 | medium | missing_question_number, missing_legacy_domain, missing_source_metadata |
| Q09 | — | — | 5 | A | 5 | 3 | list | no | no | EXAM_180_V1 | medium | missing_question_number, missing_legacy_domain, missing_source_metadata |
| Q10 | — | — | 5 | D | 4 | 2 | list | no | no | EXAM_180_V1 | medium | missing_question_number, missing_legacy_domain, missing_source_metadata |
| Q11 | — | — | 3 | F | 10 | 5 | text | yes | no | EXAM_180_V1 | medium | missing_question_number, missing_legacy_domain, missing_source_metadata |
| Q12 | — | — | 3,5,6 | A | 5 | 3 | list,text | no | no | EXAM_180_V1 | medium | missing_question_number, missing_legacy_domain, missing_source_metadata |
| Q13 | — | — | 6 | A | 6 | 2 | list | no | no | EXAM_180_V1 | medium | missing_question_number, missing_legacy_domain, missing_source_metadata |
| Q14 | — | 7 | 6 | C | 6.5 | 3 | list | no | no | EXAM_180_V1 | low | missing_question_number, missing_source_metadata |
| Q15 | — | 4 | 1,5 | D | 5.5 | 3 | list,text | no | no | EXAM_180_V1 | low | missing_question_number, missing_source_metadata |
| Q16 | — | 4 | 5 | D | 5 | 2 | list | no | no | EXAM_180_V1 | low | missing_question_number, missing_source_metadata |
| Q17 | — | 8 | 6 | A | 6 | 3 | list | no | no | EXAM_180_V1 | low | missing_question_number, missing_source_metadata |
| Q18 | — | — | 3,5 | A | 7 | 3 | list,text | no | no | EXAM_180_V1 | medium | missing_question_number, missing_legacy_domain, missing_source_metadata |
| Q19 | — | 3 | 5 | A | 8.5 | 4 | list | no | no | EXAM_180_V1 | low | missing_question_number, missing_source_metadata |
| Q20 | — | 5 | 5 | A | 6.5 | 4 | list,text | no | no | EXAM_180_V1 | low | missing_question_number, missing_source_metadata |
| Q21 | — | 3 | 5 | A | 5 | 3 | list,text | no | no | EXAM_180_V1 | low | missing_question_number, missing_source_metadata |
| Q22 | — | 3 | 5 | A | 4.5 | 3 | list,text | no | no | EXAM_180_V1 | low | missing_question_number, missing_source_metadata |
| Q23 | — | — | 5,4 | E | 11 | 3 | list | no | no | EXAM_180_V1 | medium | missing_question_number, missing_legacy_domain, missing_source_metadata |
| Q24 | — | — | 5 | E | 9.5 | 4 | list | no | no | EXAM_180_V1 | medium | missing_question_number, missing_legacy_domain, missing_source_metadata |
| Q25 | — | 9 | 5 | E | 6 | 2 | list | no | no | EXAM_180_V1 | low | missing_question_number, missing_source_metadata |
| Q26 | — | — | 1,4 | E | 8 | 2 | list | no | no | EXAM_180_V1 | medium | missing_question_number, missing_legacy_domain, missing_source_metadata |
| Q27 | — | — | 4,2,3 | B | 9.5 | 3 | list | no | no | EXAM_180_V1 | medium | missing_question_number, missing_legacy_domain, missing_source_metadata |
| Q28 | — | — | 3 | A | 12.5 | 4 | text,two_by_two_workspace | no | no | EXAM_180_V1 | medium | missing_question_number, missing_legacy_domain, missing_source_metadata, contains_nonstandard_response_type |
| Q29 | — | — | 1,4 | C | 6 | 2 | list | no | no | EXAM_180_V1 | medium | missing_question_number, missing_legacy_domain, missing_source_metadata |
