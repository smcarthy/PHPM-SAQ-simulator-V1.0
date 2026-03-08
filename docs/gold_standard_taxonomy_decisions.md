# Gold-Standard Taxonomy Decisions (Proposed Candidate Set)

Scope: non-runtime adjudication for the 6-question Royal College PHPM gold-standard SAQ corpus at authoritative **part level**.

## A) Exact or highly defensible assignments

| Question ID | Part ID | Proposed official written classification | Proposed official topic theme | Proposed simulator tags | Confidence | Short rationale |
|---|---|---|---|---|---|---|
| PHPM_SAQ_GS_0001 | PHPM_SAQ_GS_0001_PA | MPP (Management and Program Planning) | unresolved | [] | high (written), unresolved (theme) | Progressive employee management is a management/HR function; no explicit mapping to official topic themes A–F. |
| PHPM_SAQ_GS_0001 | PHPM_SAQ_GS_0001_PB | MPP (Management and Program Planning) | unresolved | [] | high (written), unresolved (theme) | Progressive discipline workflow is a management/HR process; no clear disease-theme anchor. |
| PHPM_SAQ_GS_0002 | PHPM_SAQ_GS_0002_PA | HP (Intervention and Methods in Health Protection) | A (Communicable Diseases) | [communicable_diseases] | high (written), exact (theme) | Hepatitis A infected food handler + immunoprophylaxis decisions are core communicable disease health-protection practice. |
| PHPM_SAQ_GS_0003 | PHPM_SAQ_GS_0003_PA | HP (Intervention and Methods in Health Protection) | D (Environmental Health) | [environmental_health] | high | Well-water quality determinants align with environmental health protection. |
| PHPM_SAQ_GS_0003 | PHPM_SAQ_GS_0003_PB | HP (Intervention and Methods in Health Protection) | D (Environmental Health) | [environmental_health] | high | Immediate recommendations after fecal coliform detection are direct environmental health protection actions. |
| PHPM_SAQ_GS_0004 | PHPM_SAQ_GS_0004_PA | HPDP (Intervention and Methods in Health Promotion and Disease Prevention) | E (Maternal and Child Health) | [maternal_child_health] | high | Breastfeeding benefits for child health are maternal-child prevention/promotion content. |
| PHPM_SAQ_GS_0005 | PHPM_SAQ_GS_0005_PA | BS (Basic Sciences of Public Health and Preventive Medicine) | unresolved | [] | high (written), unresolved (theme) | Healthy worker effect bias types are foundational epidemiologic methods/basic science rather than a specific A–F disease theme. |

## B) Conservative but reviewable assignments

| Question ID | Part ID | Proposed official written classification | Proposed official topic theme | Proposed simulator tags | Confidence | Short rationale |
|---|---|---|---|---|---|---|
| PHPM_SAQ_GS_0004 | PHPM_SAQ_GS_0004_PB | MPP (Management and Program Planning) | E (Maternal and Child Health) | [maternal_child_health] | medium (written), high (theme) | Indicator selection for program evaluation can be read as MPP (planning/evaluation methods), but HPDP is also plausible. |
| PHPM_SAQ_GS_0006 | PHPM_SAQ_GS_0006_PA | HPDP (Intervention and Methods in Health Promotion and Disease Prevention) | B (Non-Communicable Diseases) | [non_communicable_diseases] | medium (written), high (theme) | Excess sodium links to NCD prevention framing; written-classification overlap with PH/HS remains plausible. |

## C) Unresolved assignments requiring human review

| Question ID | Part ID | Proposed official written classification | Proposed official topic theme | Proposed simulator tags | Confidence | Short rationale |
|---|---|---|---|---|---|---|
| PHPM_SAQ_GS_0006 | PHPM_SAQ_GS_0006_PB | unresolved | B (Non-Communicable Diseases) | [non_communicable_diseases] | unresolved (written), high (theme) | Structured voluntary industry sodium reduction can map to HS/MPP/HPDP depending on blueprint interpretation. |
| PHPM_SAQ_GS_0006 | PHPM_SAQ_GS_0006_PC | unresolved | B (Non-Communicable Diseases) | [non_communicable_diseases] | unresolved (written), high (theme) | Reasons for slow industry reformulation are policy/system/implementation-adjacent with no single clearly dominant written classification. |

## Question-level rollup status (derived from part-level authority)

- **PHPM_SAQ_GS_0001**: written classification inherited as **MPP**; topic theme remains unresolved.
- **PHPM_SAQ_GS_0002**: written/theme inherited as **HP / A**.
- **PHPM_SAQ_GS_0003**: written/theme inherited as **HP / D**.
- **PHPM_SAQ_GS_0004**: written set to **mixed_part_level_assignment** (HPDP + MPP across parts); theme inherited as **E**.
- **PHPM_SAQ_GS_0005**: written inherited as **BS**; topic theme remains unresolved.
- **PHPM_SAQ_GS_0006**: written set to **mixed_part_level_assignment** (HPDP + unresolved across parts); theme inherited as **B**.
