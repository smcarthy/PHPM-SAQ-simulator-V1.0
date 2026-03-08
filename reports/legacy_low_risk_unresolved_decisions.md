# Low-Risk Migration Candidate: Unresolved Decisions Log

## Items requiring human review
1. Confirm RC numeric codebook mapping used in this batch (`1->PH`, `2->HS`, `3->BS`, `4->HPDP`, `5->HP`, `6->MPP`).
2. Confirm inferred part taxonomy for parts that lacked legacy `rc_classification` and/or `theme` in source.
3. Confirm whether question-level rollup should remain union-of-part primaries or be constrained to one primary code for blueprint counting.
4. Confirm source provenance policy and whether `source_profile=legacy_bank_internal_unverified` is the preferred conservative label.

## Part-level inferred taxonomy decisions in this batch

- PHPM_SAQ_LGC_0014 / PHPM_SAQ_LGC_0014_PC (legacy part Q14_14c): inferred written=MPP, theme=C from sibling parts.
- PHPM_SAQ_LGC_0015 / PHPM_SAQ_LGC_0015_PB (legacy part Q15_15b): inferred written=PH, theme=D from sibling parts.
- PHPM_SAQ_LGC_0019 / PHPM_SAQ_LGC_0019_PB (legacy part Q19_19b): inferred written=HP, theme=A from sibling parts.
- PHPM_SAQ_LGC_0020 / PHPM_SAQ_LGC_0020_PD (legacy part Q20_20d): inferred written=HP, theme=A from sibling parts.
- PHPM_SAQ_LGC_0025 / PHPM_SAQ_LGC_0025_PB (legacy part Q25_25b): inferred written=HP, theme=E from sibling parts.
