# Gold-Standard Taxonomy Adjudication Report

## Scope and method
- Reviewed all 6 official sample questions at **part level first**.
- Applied one primary written classification and one primary topic theme only where confidence was explicit and defensible.
- Preserved unresolved fields where confidence was insufficient.
- Added simulator tags only when directly supported by assigned official topic theme plus part content.

## Recurring taxonomy patterns observed

1. **Health protection pattern (HP) appears in operational public health control content**
   - Communicable disease control decisions (Hep A food handler) and environmental contamination response (well water/fecal coliform) strongly align with HP.

2. **Topic themes A/D/E/B were more defensible than written classification in some parts**
   - Theme mapping was clear for Hep A (A), well water (D), breastfeeding (E), and sodium/chronic disease context (B).
   - Written-classification mapping remained uncertain in parts where policy/program/system boundaries overlap.

3. **Management/program methods and intervention methods overlap in program-evaluation prompts**
   - Indicator design/evaluation prompts can reasonably map to either MPP or HPDP depending on blueprint interpretation.

4. **Some official sample prompts do not cleanly map to A–F themes**
   - Employee performance/discipline (Q1) and healthy worker effect methods (Q5) are not explicitly disease-theme anchored.

## Questions/parts spanning multiple plausible categories

- **Q4 part b (breastfeeding program indicators):**
  - Plausible written classifications: MPP (program planning/evaluation) or HPDP (promotion methods).
  - Candidate proposes MPP with medium confidence.

- **Q6 part a (primary concern of excess sodium):**
  - Plausible written classifications: HPDP or PH.
  - Candidate proposes HPDP with medium confidence.

- **Q6 part b and c (industry voluntary reduction and barriers):**
  - Plausible written classifications: HS, MPP, or HPDP.
  - Candidate keeps written classification unresolved pending human review.

## Why part-level classification is more reliable than forced question-level classification

- Multi-part questions combine different task types (knowledge recall, intervention design, program evaluation, policy/implementation reasoning).
- Forcing a single question-level written classification can hide meaningful heterogeneity and introduce false certainty.
- In this corpus, Q4 and Q6 demonstrate this directly:
  - Q4 includes intervention content (part a) plus evaluation-method content (part b).
  - Q6 includes NCD framing with mixed intervention/system-implementation sub-asks.
- Therefore, part-level assignments are treated as authoritative, and question-level uses **mixed_part_level_assignment** when parts differ.

## Remaining ambiguity and manual review priorities

1. Confirm blueprint intent for assigning **program indicator design** prompts (MPP vs HPDP).
2. Confirm whether **industry voluntary sodium reformulation** prompts should default to HS, MPP, or HPDP in your migration policy.
3. Confirm whether non-disease operational/epidemiologic method prompts should remain theme-unresolved under A–F.
