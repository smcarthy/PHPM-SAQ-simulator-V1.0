# PHPM Exam Hub V4 implementation roadmap

Status: approved planning summary based on the PHPM Exam Hub Project Charter,
Version 4.0, dated October 24, 2026. The approved charter remains authoritative
if this summary and the charter differ.

## Phase 1 — October 2026 NRC release

The immediate objective is a coherent, reliable release for the 2026 PHPM
National Review Course within the approved 12-hour project-lead time box.

1. **Examination integrity**
   - Validate bank schemas, identifiers, form membership, durations, point
     totals, response formats, and rubrics.
   - Resolve discrepancies or document an explicit release decision.
2. **Remaining three Applied GPT/plugin assistants**
   - Complete All PHPM Topics and Hot Topics, Emergency Preparedness and
     Response, and Maternal and Child Health.
   - Use shared examiner guidance, topic-specific instructions, versioning,
     reproducible evaluation cases, and functioning or clearly disabled links.
3. **90-minute written form**
   - Assemble a balanced form from reviewed existing material.
   - Clearly distinguish it from an independent examination made entirely of
     new questions.
4. **Visual refinement**
   - Improve navigation, responsive card layout, typography, imagery, and
     visual consistency while preserving accessibility, performance, and the
     distraction-minimized written exam.
5. **Dynamic Canadian public health updates**
   - Pilot deterministic ingestion from approved institutional sources into
     static GitHub Pages content.
   - Show source, title, publication date, original link, and last successful
     refresh; never fabricate summaries, citations, or dates.
6. **Submission and feedback mechanism**
   - Provide clear hosted-form pathways for original practice material,
     corrections, and technical feedback.
   - Keep submissions out of the public repository until editorial, permission,
     privacy, provenance, and educational review are complete.
7. **Figure-interpretation proof of concept**
   - Demonstrate an attributed or appropriately licensed figure linked to an
     Applied Exam prompt and suitable assistant.
8. **Integrated testing and NRC demonstration**
   - Verify written modes, navigation, autosave, explicit resume, review,
     submission, export, launcher states, Applied Hub interactions,
     responsiveness, source links, and delivery of feedback records.
   - Existing tests must pass, or failures must have documented release
     decisions and a stable demonstration path.

## Phase 2 — November 2026

Subject to a separate approved architecture and privacy task:

- introduce optional authentication while preserving anonymous practice;
- evaluate managed secure persistence rather than custom password management;
- add versioned SAQ attempt histories and user-controlled export and deletion;
  and
- develop private personal analytics and recommendations based on reviewed
  classification tags and valid measures.

This work must define consent, retention, access control, privacy defaults, and
the boundary between website data and private external assistant conversations.

## Later phases

- Expand to a larger, rigorously reviewed question bank and additional
  independent written forms.
- Broaden source-linked figure interpretation and Applied Exam cases.
- Consider aggregate benchmarking only after validity, consent, comparability,
  sample-size, reliability, training-level, and selection-bias review.
- Conduct educational evaluation of usability, resident experience, learning
  behaviour, and outcomes under appropriate governance.

## Phase gates requiring project-lead approval

- Educational selection and blueprint balance for the 90-minute form.
- Final instructions, evaluation cases, naming, and destinations for Applied
  GPT/plugin assistants.
- Approved public health feeds, contributor-form destinations, and submission
  privacy language.
- Any account, persistence, analytics, recommendation, benchmarking, or
  research functionality.
