# Applied Exam page manual QA checklist (MVP stabilization)

Use this quick pass before merging or publishing.

## Navigation and layout
- [ ] `applied-exam.html` loads without JS errors.
- [ ] The six sub-tabs render in the expected order.
- [ ] Sub-tabs switch panels correctly by click.
- [ ] Sub-tabs switch panels correctly by keyboard (`ArrowLeft`, `ArrowRight`, `Home`, `End`).
- [ ] Written SAQ page (`index.html`) remains unchanged.

## Intro and links
- [ ] Intro copy is clear and concise.
- [ ] Royal College sample/exam link opens in a new tab.
- [ ] Scope note confirms static/local-only constraints.

## Section 1: Start Practising
- [ ] All nine topic launcher cards render with canonical topic wording and correct icons.
- [ ] Each card opens the expected GPT URL from centralized launcher data.

## Section 2: Challenge Scenarios
- [ ] Cards show title + context in compact mode.
- [ ] Hover preview appears on desktop.
- [ ] Click/tap expands and collapses details.
- [ ] Expanded view shows official topic labels.
- [ ] "Copy prompt" copies the exact prompt text and shows feedback status.
- [ ] "Open Recommended GPT" points to the scenario's mapped launcher URL.

## Section 3: Build a Station Prompt
- [ ] All selector controls populate correctly.
- [ ] Prompt output updates when any selector changes.
- [ ] Recommended GPT label updates with topic mapping.
- [ ] "Open Recommended GPT" points to the mapped launcher URL.
- [ ] "Copy Prompt" copies generated prompt and shows feedback status.

## Section 4–6 content readability
- [ ] What the Exam Tests cards read clearly and consistently.
- [ ] Hot Topics cards are concise and exam-relevant.
- [ ] Study Planner + self-debrief content is readable and actionable.

## URL wiring check (finalization step)
- [ ] Final custom GPT URLs are updated in `GPT_URLS` in `applied-exam.js`.
- [ ] Any final Royal College direct sample PDF URL is applied in `applied-exam.html`.
