# Low-Risk Legacy Candidate vs Gold-Standard Corpus (Structure Comparison)

Gold-standard baseline checks: instruction verb populated=true, response constraints explicit=true, part taxonomy arrays complete=true.

| Canonical Question ID | Parts | Prompt form vs GS | Part metadata parity vs GS | Taxonomy completeness vs GS | Divergence requiring review |
|---|---:|---|---|---|---|
| PHPM_SAQ_LGC_0014 | 3 | Aligned directive-style prompts | Aligned (list/text with explicit constraints) | Complete arrays populated at question+part level | Includes inferred taxonomy with explicit confidence labels/rationales. |
| PHPM_SAQ_LGC_0015 | 3 | Mostly aligned; one or more verbs unresolved | Aligned (list/text with explicit constraints) | Complete arrays populated at question+part level | Includes inferred taxonomy with explicit confidence labels/rationales. |
| PHPM_SAQ_LGC_0019 | 4 | Mostly aligned; one or more verbs unresolved | Aligned (list/text with explicit constraints) | Complete arrays populated at question+part level | Includes inferred taxonomy with explicit confidence labels/rationales. |
| PHPM_SAQ_LGC_0020 | 4 | Mostly aligned; one or more verbs unresolved | Aligned (list/text with explicit constraints) | Complete arrays populated at question+part level | Includes inferred taxonomy with explicit confidence labels/rationales. |
| PHPM_SAQ_LGC_0025 | 2 | Aligned directive-style prompts | Aligned (list/text with explicit constraints) | Complete arrays populated at question+part level | Includes inferred taxonomy with explicit confidence labels/rationales. |

## Mapping provenance summary

| Canonical Question ID | exact carry-forward parts | inferred parts (confidence) |
|---|---|---|
| PHPM_SAQ_LGC_0014 | PHPM_SAQ_LGC_0014_PA, PHPM_SAQ_LGC_0014_PB | PHPM_SAQ_LGC_0014_PC (medium) |
| PHPM_SAQ_LGC_0015 | PHPM_SAQ_LGC_0015_PA, PHPM_SAQ_LGC_0015_PC | PHPM_SAQ_LGC_0015_PB (medium) |
| PHPM_SAQ_LGC_0019 | PHPM_SAQ_LGC_0019_PA, PHPM_SAQ_LGC_0019_PC, PHPM_SAQ_LGC_0019_PD | PHPM_SAQ_LGC_0019_PB (medium) |
| PHPM_SAQ_LGC_0020 | PHPM_SAQ_LGC_0020_PA, PHPM_SAQ_LGC_0020_PB, PHPM_SAQ_LGC_0020_PC | PHPM_SAQ_LGC_0020_PD (medium) |
| PHPM_SAQ_LGC_0025 | PHPM_SAQ_LGC_0025_PA | PHPM_SAQ_LGC_0025_PB (medium) |
