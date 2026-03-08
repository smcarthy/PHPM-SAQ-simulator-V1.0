# Gold-Standard Corpus: Royal College PHPM Sample SAQs (2025)

## Purpose
This corpus is a **non-runtime reference artifact** that encodes the 6 official Royal College PHPM sample SAQ questions and model answers in canonical schema form.

It is intended to be the anchor for:
- future question writing
- legacy-bank migration
- validation checks that detect drift from official SAQ style and rubric structure

## Anchor policy
The 6 official sample questions are the **style/rubric anchor** for this simulator transition.

For this corpus:
- `source_profile` is locked to `royal_college_official_sample`
- `gold_standard_alignment_status` is locked to `gold_standard_reference`
- IDs are locked as `PHPM_SAQ_GS_0001` through `PHPM_SAQ_GS_0006`

## Recurring structural features observed in the official sample set
The sample questions consistently use:
- **directive verbs** (`List`, `If ... list`, etc.)
- **multipart structure** (a, b, c subsections)
- **explicit part-level marks** with capped scoring
- **list-style prompts** with required counts (e.g., list 2, list 3, list 4)
- **must-have scoring logic** in selected parts (e.g., explicit required point)
- **not-acceptable constraints** where specific alternatives are disallowed
- **concise model-answer bullets** that define acceptable response domains without overlong narrative

## How to use this corpus to reduce drift
When adding or migrating custom questions, compare candidate items against this corpus across the following checks:

1. **Prompt form check**
   - Uses a clear directive verb.
   - Required response count is explicit when applicable.

2. **Part granularity check**
   - Each subsection has independent metadata (`instruction_verb`, `max_score`, `response_constraints`, rubric).

3. **Rubric specificity check**
   - Answer key provides enough bullet-level specificity for deterministic scoring.
   - Must-have and not-acceptable elements are explicit where relevant.

4. **Scoring coherence check**
   - Part marks align with expected breadth/depth and preserve mark caps.
   - Partial-credit behavior is stated where list-style responses are used.

5. **Conservative taxonomy check**
   - Every part must include at least one official written classification and at least one theme code.
   - Use primary/secondary arrays when overlap is legitimate.
   - Use `G` at the theme layer when A–F do not fit cleanly; do not use `G` as a written classification.

## Non-goals in this step
- No runtime wiring to `script.js`.
- No edits to `question_bank.json` or `exam_forms.json`.
- No behavior changes in exam flow, scoring UI, storage, export, or rendering.
