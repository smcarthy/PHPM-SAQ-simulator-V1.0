# Low-Risk Legacy Candidate vs Gold-Standard Corpus (Structure Comparison)

Gold-standard baseline checks: instruction verb populated=true, response constraints explicit=true, part taxonomy arrays complete=true.

| Canonical Question ID | Parts | Prompt form vs GS | Part metadata parity vs GS | Taxonomy completeness vs GS | Divergence requiring review |
|---|---:|---|---|---|---|
| PHPM_SAQ_LGC_0014 | 3 | Aligned directive-style prompts | Aligned (list/text with explicit constraints) | Complete arrays populated at question+part level | Includes manually adjudicated taxonomy overrides in approved scope. |
| PHPM_SAQ_LGC_0015 | 3 | Mostly aligned; one or more verbs unresolved | Aligned (list/text with explicit constraints) | Complete arrays populated at question+part level | Includes manually adjudicated taxonomy overrides in approved scope. |
| PHPM_SAQ_LGC_0019 | 4 | Mostly aligned; one or more verbs unresolved | Aligned (list/text with explicit constraints) | Complete arrays populated at question+part level | Includes manually adjudicated taxonomy overrides in approved scope. |
| PHPM_SAQ_LGC_0020 | 4 | Mostly aligned; one or more verbs unresolved | Aligned (list/text with explicit constraints) | Complete arrays populated at question+part level | Includes manually adjudicated taxonomy overrides in approved scope. |
| PHPM_SAQ_LGC_0025 | 2 | Aligned directive-style prompts | Aligned (list/text with explicit constraints) | Complete arrays populated at question+part level | Includes manually adjudicated taxonomy overrides in approved scope. |

## Mapping provenance summary

| Canonical Question ID | exact carry-forward parts | inferred parts (confidence) | manually adjudicated parts |
|---|---|---|---|
| PHPM_SAQ_LGC_0014 | PHPM_SAQ_LGC_0014_PA, PHPM_SAQ_LGC_0014_PB | None | PHPM_SAQ_LGC_0014_PC |
| PHPM_SAQ_LGC_0015 | PHPM_SAQ_LGC_0015_PA, PHPM_SAQ_LGC_0015_PC | None | PHPM_SAQ_LGC_0015_PB |
| PHPM_SAQ_LGC_0019 | PHPM_SAQ_LGC_0019_PA, PHPM_SAQ_LGC_0019_PC, PHPM_SAQ_LGC_0019_PD | None | PHPM_SAQ_LGC_0019_PB |
| PHPM_SAQ_LGC_0020 | PHPM_SAQ_LGC_0020_PA, PHPM_SAQ_LGC_0020_PB, PHPM_SAQ_LGC_0020_PC | None | PHPM_SAQ_LGC_0020_PD |
| PHPM_SAQ_LGC_0025 | PHPM_SAQ_LGC_0025_PA | None | PHPM_SAQ_LGC_0025_PB |
