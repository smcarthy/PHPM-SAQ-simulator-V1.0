# Low-Risk Legacy Candidate vs Gold-Standard Corpus (Structure Comparison)

Gold-standard baseline checks: instruction verb populated=true, response constraints explicit=true, part taxonomy arrays complete=true.

| Canonical Question ID | Parts | Prompt form vs GS | Part metadata parity vs GS | Taxonomy completeness vs GS | Divergence requiring review |
|---|---:|---|---|---|---|
| PHPM_SAQ_LGC_0016 | 2 | Mostly aligned; one or more verbs unresolved | Aligned (list/text with explicit constraints) | Complete arrays populated at question+part level | Includes inferred taxonomy with explicit confidence labels/rationales. |
| PHPM_SAQ_LGC_0017 | 3 | Mostly aligned; one or more verbs unresolved | Aligned (list/text with explicit constraints) | Complete arrays populated at question+part level | Includes inferred taxonomy with explicit confidence labels/rationales. |
| PHPM_SAQ_LGC_0018 | 3 | Mostly aligned; one or more verbs unresolved | Aligned (list/text with explicit constraints) | Complete arrays populated at question+part level | No structural divergence beyond source provenance review requirement. |
| PHPM_SAQ_LGC_0021 | 3 | Aligned directive-style prompts | Aligned (list/text with explicit constraints) | Complete arrays populated at question+part level | Includes inferred taxonomy with explicit confidence labels/rationales. |
| PHPM_SAQ_LGC_0022 | 3 | Mostly aligned; one or more verbs unresolved | Aligned (list/text with explicit constraints) | Complete arrays populated at question+part level | Includes inferred taxonomy with explicit confidence labels/rationales. |

## Mapping provenance summary

| Canonical Question ID | exact carry-forward parts | inferred parts (confidence) | manually adjudicated parts |
|---|---|---|---|
| PHPM_SAQ_LGC_0016 | PHPM_SAQ_LGC_0016_PA | PHPM_SAQ_LGC_0016_PB (medium) | None |
| PHPM_SAQ_LGC_0017 | PHPM_SAQ_LGC_0017_PA | PHPM_SAQ_LGC_0017_PB (medium), PHPM_SAQ_LGC_0017_PC (medium) | None |
| PHPM_SAQ_LGC_0018 | PHPM_SAQ_LGC_0018_PA, PHPM_SAQ_LGC_0018_PB, PHPM_SAQ_LGC_0018_PC | None | None |
| PHPM_SAQ_LGC_0021 | PHPM_SAQ_LGC_0021_PA, PHPM_SAQ_LGC_0021_PB | PHPM_SAQ_LGC_0021_PC (medium) | None |
| PHPM_SAQ_LGC_0022 | PHPM_SAQ_LGC_0022_PA | PHPM_SAQ_LGC_0022_PB (medium), PHPM_SAQ_LGC_0022_PC (medium) | None |
