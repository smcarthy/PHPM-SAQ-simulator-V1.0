# Gold-Standard Taxonomy Decisions (Constitution-Aligned Candidate)

Scope: non-runtime adjudication for the 6-question Royal College PHPM gold-standard SAQ corpus, with **part-level taxonomy as authoritative**.

## Policy applied
- Every part assigned at least one written classification (`PH/HS/BS/HPDP/HP/MPP`).
- Every part assigned at least one theme (`A–G`).
- Primary/secondary labels used where overlap is plausible.
- `G = Other` used only at theme layer.
- First primary written classification is default blueprint counting classification.

## Part-level decisions

| Question ID | Part ID | Primary written | Secondary written | Primary theme | Secondary theme | Confidence | Notes |
|---|---|---|---|---|---|---|---|
| PHPM_SAQ_GS_0001 | PHPM_SAQ_GS_0001_PA | MPP | — | G | — | high | Workforce performance management/discipline not cleanly in A–F themes. |
| PHPM_SAQ_GS_0001 | PHPM_SAQ_GS_0001_PB | MPP | — | G | — | high | As above; retained at theme `G`. |
| PHPM_SAQ_GS_0002 | PHPM_SAQ_GS_0002_PA | HP | — | A | — | high | Hep A public-health control scenario. |
| PHPM_SAQ_GS_0003 | PHPM_SAQ_GS_0003_PA | HP | — | D | — | high | Environmental contamination/water quality framing. |
| PHPM_SAQ_GS_0003 | PHPM_SAQ_GS_0003_PB | HP | — | D | — | high | Environmental health protection actions. |
| PHPM_SAQ_GS_0004 | PHPM_SAQ_GS_0004_PA | HPDP | — | E | — | high | Breastfeeding benefits/prevention framing. |
| PHPM_SAQ_GS_0004 | PHPM_SAQ_GS_0004_PB | MPP | HPDP | E | — | medium (written), high (theme) | Program-indicator design straddles program planning and intervention methods. |
| PHPM_SAQ_GS_0005 | PHPM_SAQ_GS_0005_PA | BS | — | G | — | high | Epidemiologic bias methods content not cleanly in A–F themes. |
| PHPM_SAQ_GS_0006 | PHPM_SAQ_GS_0006_PA | HPDP | PH | B | — | medium (written), high (theme) | NCD prevention prompt with population-health overlap. |
| PHPM_SAQ_GS_0006 | PHPM_SAQ_GS_0006_PB | HS | MPP, HPDP | B | — | medium (written), high (theme) | Industry voluntary target-setting sits at policy/system/program boundary. |
| PHPM_SAQ_GS_0006 | PHPM_SAQ_GS_0006_PC | HS | MPP, HPDP | B | — | medium (written), high (theme) | Industry implementation barriers remain boundary-crossing content. |

## Question-level rollup status
- **PHPM_SAQ_GS_0001**: primary written inherited as `MPP`; primary theme inherited as `G`.
- **PHPM_SAQ_GS_0002**: inherited as `HP` / `A`.
- **PHPM_SAQ_GS_0003**: inherited as `HP` / `D`.
- **PHPM_SAQ_GS_0004**: written = `mixed_part_level_assignment` (HPDP + MPP primary across parts); theme inherited as `E`.
- **PHPM_SAQ_GS_0005**: inherited as `BS` / `G`.
- **PHPM_SAQ_GS_0006**: written = `mixed_part_level_assignment` (HPDP + HS primary across parts); theme inherited as `B`.

## Remaining manual-review items
No part remains taxonomy-unassigned. Manual review is limited to **priority ordering and blueprint preference** for parts with multi-label written overlap (Q4b, Q6a, Q6b, Q6c).
