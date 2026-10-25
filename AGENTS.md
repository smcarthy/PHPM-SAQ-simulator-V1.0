# PHPM Exam Hub contributor guardrails

## Governing authority

- The approved **PHPM Exam Hub Project Charter, Version 4.0** dated
  October 24, 2026 is the project-wide source of truth.
- The project lead retains final authority over educational requirements,
  release priorities, clinical and public health content, and public-facing
  changes.
- Official Royal College documentation and verified expert review take
  precedence over AI-generated content.
- Codex may propose alternatives, but must not independently revise educational
  requirements, expand scope, or move work between phases.

## Purpose and October 2026 baseline

The project is a free PHPM Exam Hub with two complementary experiences:

- a Written SAQ Exam for timed, rubric-informed written practice; and
- an Applied Exam Practice Hub for oral-exam practice, topic assistants,
  scenarios, station building, resident guidance, hot topics, and study
  planning.

The current baseline includes 15-, 30-, and 180-minute written modes, local
attempt saving and export, existing banks and forms, and a separate Applied
Exam Hub with nine topic launcher cards, six configured destinations, curated
challenges, and a deterministic station builder. The immediate release builds
on this repository and GitHub Pages architecture; it is not a wholesale
rewrite.

## Current phase: October 2026 NRC release

Keep current work within the approved 12-hour National Review Course release:

- validate examination integrity, form composition, scoring metadata, and
  question-bank consistency;
- complete and test the three remaining Applied GPT/plugin assistants;
- add a reviewed, balanced 90-minute written form that is clearly distinguished
  from an independent exam made entirely of new questions;
- make targeted visual and responsive refinements without regressions;
- pilot source-attributed Canadian public health updates;
- add reviewed submission and feedback mechanisms;
- produce a figure-interpretation proof of concept; and
- complete integrated testing and prepare a stable NRC demonstration.

If priorities compete, preserve assessment integrity, reliable core behaviour,
and the three outstanding Applied assistants before optional engagement work.

## Later phases

Optional resident authentication, secure persistence, attempt histories,
personal analytics, and tailored recommendations are permitted only through an
explicitly authorized later-phase task. They are not part of the current NRC
release. Anonymous use must remain available.

Benchmarking or exam-readiness claims require adequate consent, comparable and
valid data, sufficient sample size, and explicit educational and governance
review. Unvalidated measures must not be presented as predictors of Royal
College examination success.

## Safety, content, and repository rules

- Preserve the existing Written SAQ runtime and exam flow unless a task
  explicitly authorizes runtime changes.
- Treat all AI-generated educational content as provisional until factual,
  source, curricular, and examination-fidelity review is complete.
- Never commit secrets, identifiable patient information, confidential Royal
  College examination material, or unreviewed user submissions to the public
  repository.
- Require source attribution and human review for public health, clinical,
  rubric, and high-stakes educational content.
- Keep contributor submissions outside the public content set until editorial
  review confirms permission, provenance, privacy, and educational suitability.
- Do not imply Royal College or university endorsement.

## Task and validation practice

- Use narrow implementation tasks with a problem statement, intended behaviour,
  excluded changes, acceptance criteria, and required testing evidence.
- Do not add adjacent features, dependencies, data collection, or architectural
  changes without explicit approval.
- Validate every change in proportion to its risk. A feature is complete only
  after resident-facing behaviour is verified, not merely when code is written.
- Run relevant automated and browser checks. Document any outstanding failure
  and its release decision rather than hiding or disabling it.
- For documentation-only work, validate Markdown, inspect the final diff, and
  verify that runtime and educational-content files were not changed.
