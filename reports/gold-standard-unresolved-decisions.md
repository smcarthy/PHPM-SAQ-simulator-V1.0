# Gold-Standard Corpus: Unresolved Decisions

## 1) Exact carry-forwards (no interpretation change)
- Six-question scope preserved (Questions 1–6).
- Multipart structure preserved (`a`, `b`, `c` where present).
- Part prompts carried forward verbatim from transition source.
- Part mark values (`max_score`) carried forward exactly from transition source.
- Model-answer bullet lists carried forward as `answer_key`.
- Explicit must-have requirement preserved for Q3 part b.
- Explicit not-acceptable exclusion preserved for Q6 part a.
- Source profile set to `royal_college_official_sample` for all encoded items.
- `gold_standard_alignment_status` set to `gold_standard_reference` for all encoded items.

## 2) Conservative defaults applied
- Official written classification fields were not guessed; set to `requires_manual_classification`.
- Official topic/theme fields were not guessed; set to `requires_manual_theme_assignment`.
- Simulator tags were left empty unless directly inferable with high confidence.
- `instruction_verb` normalized from prompt text to lowercase deterministic token (e.g., `list`).
- Non-list prompt (Q6a) encoded as `response_type: short_text` with `single_line: true`.
- Standardized `scoring_notes` text added to each part to preserve cap-based scoring behavior.

## 3) Manual decisions still needed

### A. Taxonomy assignments requiring review
- `official_written_classification_code` / label for all questions and parts.
- `official_topic_theme_code` / label for all questions and parts.
- `simulator_topic_tags` once classification/theme mapping is approved.

### B. Response-constraint interpretations requiring review
- Confirm whether Q6a should remain `short_text` or be normalized to a dedicated constrained-single-item response type.
- Confirm whether mixed prompts like “List TWO process indicators and TWO outcome indicators” should remain one list constraint (`list_count_required=4`) or gain typed sub-constraints.
- Confirm whether part-level scoring notes should include point-per-item formulas where official source explicitly states them.

### C. Source verification checkpoint
- Confirm against the official PDF that all punctuation/capitalization and any formatting nuances are captured exactly in canonical text fields.
- Confirm no omitted examiner notes exist outside the transition-source extract.
