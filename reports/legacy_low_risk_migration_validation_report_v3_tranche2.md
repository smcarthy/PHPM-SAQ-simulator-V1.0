# Low-Risk Migration Candidate Validation Report

- Candidate file: `content/candidates/legacy_low_risk_migration_candidate_v3_tranche2.json`
- Questions validated: 5
- Validation status: PASS_WITH_WARNINGS
- Error count: 0
- Warning count: 6

## Warnings
- PHPM_SAQ_LGC_0016_PB: taxonomy inferred from sibling parts due to missing legacy rc_classification/theme (confidence=medium)
- PHPM_SAQ_LGC_0017_PB: taxonomy inferred from sibling parts due to missing legacy rc_classification/theme (confidence=medium)
- PHPM_SAQ_LGC_0017_PC: taxonomy inferred from sibling parts due to missing legacy rc_classification/theme (confidence=medium)
- PHPM_SAQ_LGC_0021_PC: taxonomy inferred from sibling parts due to missing legacy rc_classification/theme (confidence=medium)
- PHPM_SAQ_LGC_0022_PB: taxonomy inferred from sibling parts due to missing legacy rc_classification/theme (confidence=medium)
- PHPM_SAQ_LGC_0022_PC: taxonomy inferred from sibling parts due to missing legacy rc_classification/theme (confidence=medium)

## Warning type counts
- inferred_from_question_context: 6

## Checks run
- Selected-question count in allowed range (3-5).
- Canonical ID format checks for questions and parts.
- Mandatory question-level and part-level taxonomy array checks.
- Allowed taxonomy code-set checks against locked taxonomy policy.
- List response constraints checks for faithful list_count carry-forward.
- Locked source provenance policy check (`source_profile=needs_full_source_review` for all migrated items).
- Locked question rollup policy check (ordered union of part primaries + blueprint counting code).
