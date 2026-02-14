// PHPM SAQ Exam Simulator script
// This script handles loading the exam data, rendering questions, navigating
// between them, managing timer and autosave, and handling review and submission.

(function () {
  // Mapping of domain codes to their full descriptions for display
  const DOMAIN_INFO = {
    '2': 'Health Promotion, Chronic Diseases, Mental Health and Substance',
    '3': 'Communicable Diseases in Health Protection',
    '4': 'Environmental, Occupational, Built Environment and Injuries',
    '5': 'Health Systems, Policy, Law and Ethics',
    '6': 'Population Health, Epidemiology, Methods and Basic Sciences',
    '7': 'Management, Leadership and Program Planning',
    '8': 'Emergency Preparedness and Response',
    '9': 'Maternal and Child Health'
  };
  // Embedded exam data.  The prototype is designed to run locally without a server,
  // so fetching JSON from the file system (file://) would be blocked by the
  // browser.  Instead, we embed the question bank here.  Feel free to edit
  // this data or load it from a server in a future iteration.
  const embeddedExamData = {
    // Default total exam time in seconds for a full exam (3 hours). Specific durations are set at runtime
    total_time_sec: 10800,
    questions: [
      {
        id: 'Q1',
        number: 1,
        parts: [
          {
            id: 'Q1a',
            prompt: 'List FIVE steps in the progressive management approach to an underperforming employee.',
            max_score: 5,
            domain: '7',
            response_type: 'list',
            list_count: 5,
            rubric: [
              'Meet with the employee and/or supervisor to discuss the situation and gather facts.',
              'Clearly communicate performance expectations to the employee.',
              'Counsel the employee about performance gaps and ensure understanding of requirements.',
              'Identify any learning or coaching needs or personal issues contributing to poor performance.',
              'Address identified issues (e.g., training, employee assistance program).',
              'Set specific performance improvement objectives with specific time frames.',
              'Meet regularly with the employee/supervisor to monitor performance.'
            ]
          },
          {
            id: 'Q1b',
            prompt: 'List FOUR steps in the progressive discipline of an underperforming employee.',
            max_score: 2,
            domain: '7',
            response_type: 'list',
            list_count: 4,
            rubric: [
              'Provide a verbal warning regarding unresolved poor performance.',
              'Provide a written warning regarding continued poor performance.',
              'Suspend the employee without pay for an escalating number of days.',
              'End employment if performance does not improve.'
            ]
          }
        ]
      },
      {
        id: 'Q2',
        number: 2,
        parts: [
          {
            id: 'Q2a',
            prompt: 'List THREE questions for a hepatitis A infected food handler that impact immunoprophylaxis decisions.',
            max_score: 1.5,
            domain: '3',
            response_type: 'list',
            list_count: 3,
            rubric: [
              'Was the food handler infectious while working?',
              'Does the food handler handle foods that are not cooked or handle food after it is cooked?',
              'Does the food handler have poor hygiene?',
              'Did the food handler have diarrhoea while working?'
            ]
          }
        ]
      },
      {
        id: 'Q3',
        number: 3,
        parts: [
          {
            id: 'Q3a',
            prompt: 'List FOUR factors that may affect the quality of well water.',
            max_score: 2,
            domain: '4',
            response_type: 'list',
            list_count: 4,
            rubric: [
              'Depth of well (dug vs drilled).',
              'Amount of new water flowing into the area.',
              'Local land use activities (e.g., livestock, pesticides, gasoline storage).',
              'Meteorological factors (e.g., heavy rains).',
              'Natural quality of surrounding soil (e.g., elevated heavy metals).',
              'Surface water infiltration.',
              'Well and local hydrogeology (integrity of bedrock).',
              'Quality of well‑head construction (grouting/casing).',
              'Location/distance from sources of contamination (e.g., septic tank).'
            ]
          },
          {
            id: 'Q3b',
            prompt: 'If fecal coliforms are detected in well water, list TWO immediate recommendations you would give to the homeowner.',
            max_score: 2,
            domain: '4',
            response_type: 'list',
            list_count: 2,
            rubric: [
              'Stop using untreated well water for consumption (must have this point).',
              'Boil or disinfect the water before consuming.',
              'Investigate and correct well condition (e.g., disinfect with bleach and resample).'
            ]
          }
        ]
      },
      {
        id: 'Q4',
        number: 4,
        parts: [
          {
            id: 'Q4a',
            prompt: 'List FOUR benefits of breastfeeding for the child\'s health.',
            max_score: 2,
            domain: '9',
            response_type: 'list',
            list_count: 4,
            rubric: [
              'Reduced rate of infections (otitis media, respiratory, gastrointestinal).',
              'Reduced incidence of atopic diseases.',
              'Prevention of certain chronic diseases (e.g., diabetes, obesity, Crohn’s disease).',
              'Prevention of cognitive development abnormalities.',
              'Enhanced mother–child bonding.',
              'Transfer of immunoglobulins from mother to child.',
              'Decreased risk of childhood leukemia, SIDS and necrotising enterocolitis.',
              'Provides optimal nutrition.'
            ]
          },
          {
            id: 'Q4b',
            prompt: 'List TWO process indicators and TWO outcome indicators to evaluate a breastfeeding promotion and support program.',
            max_score: 2,
            domain: '7',
            response_type: 'list',
            list_count: 4,
            rubric: [
              'Process: number or proportion of staff trained to promote/support breastfeeding.',
              'Process: number or proportion of program participants.',
              'Process: duration of participation in the program.',
              'Process: number of service organisations favourable to breastfeeding (e.g., baby‑friendly hospitals).',
              'Outcome: participants’ knowledge/attitudes regarding benefits of breastfeeding.',
              'Outcome: staff knowledge/attitudes regarding importance of breastfeeding.',
              'Outcome: uptake of breastfeeding among participants (number/proportion).',
              'Outcome: duration of breastfeeding among participants (average, median).'
            ]
          }
        ]
      },
      {
        id: 'Q5',
        number: 5,
        parts: [
          {
            id: 'Q5a',
            prompt: 'List TWO types of biases that can cause the healthy worker effect in a cohort study design.',
            max_score: 2,
            domain: '6',
            response_type: 'list',
            list_count: 2,
            rubric: [
              'Healthy hire effect: selection bias at hiring resulting in entry of healthier workers into the workforce.',
              'Healthy worker survivor effect: healthier workers are more likely to remain employed.'
            ]
          }
        ]
      },
      {
        id: 'Q6',
        number: 6,
        parts: [
          {
            id: 'Q6a',
            prompt: 'List the PRIMARY health concern directly associated with excessive dietary sodium intake.',
            max_score: 0.5,
            domain: '2',
            response_type: 'text',
            rubric: [
              'Hypertension (other cardiovascular conditions are not acceptable).'
            ]
          },
          {
            id: 'Q6b',
            prompt: 'List THREE steps of a structured voluntary approach by industry to reach sodium reduction targets in processed foods.',
            max_score: 3,
            domain: '2',
            response_type: 'list',
            list_count: 3,
            rubric: [
              'Publication/establishment of sodium reduction targets for foods.',
              'Defined timelines for implementation.',
              'Mechanism for public commitment by industry to the targets.',
              'Plan for monitoring progress by an external body.',
              'Plan for independent evaluation of success with option for stronger regulatory action.'
            ]
          },
          {
            id: 'Q6c',
            prompt: 'List THREE reasons why the food industry is slow to reduce the salt content in processed foods.',
            max_score: 1.5,
            domain: '2',
            response_type: 'list',
            list_count: 3,
            rubric: [
              'Sodium is a preservative important for food safety and hard to replicate.',
              'Sodium is inexpensive and reformulation is costly.',
              'Consumers prefer salty foods.',
              'Sodium reduction is voluntary; early adopters may lose competitive advantage.',
              'Sodium increases thirst, boosting beverage sales.'
            ]
          }
        ]
      },
      {
        id: 'Q7',
        number: 7,
        parts: [
          {
            id: 'Q7a',
            prompt: 'List FOUR health benefits of optimally fluoridated community drinking water for children.',
            max_score: 2,
            domain: '2',
            response_type: 'list',
            list_count: 4,
            rubric: [
              'Reduced dental caries in primary baby teeth',
              'Reduced dental caries in permanent teeth',
              'Reduced severity/complications of caries in children (e.g., fewer cavities progressing to pain/infection, fewer extractions/restorations)',
              'Equitable, population‑wide preventive benefit: does not depend on individual behaviour or ability to access or afford dental care',
              'Promotes remineralization of enamel',
              'Inhibits demineralization of enamel',
              'Reduces cariogenic bacterial acid effects'
            ]
          },
          {
            id: 'Q7b',
            prompt: 'List FOUR health effects of excess fluoride intake in children.',
            max_score: 2,
            domain: '2',
            response_type: 'list',
            list_count: 4,
            rubric: [
              'Mild dental fluorosis: hypomineralization during enamel development that can appear as mottling/white flecks',
              'Severe dental fluorosis causing visible staining and pitting, which may cause aesthetic and psychological concern and affect tooth quality and function',
              'Acute fluoride toxicity: classically gastrointestinal upset such as nausea/vomiting/abdominal pain with large ingestion of fluoride',
              'Severe acute fluoride toxicity: e.g., electrolyte disturbances such as hypocalcemia with neurologic and cardiac effects in extreme ingestion',
              'Skeletal fluorosis with prolonged high exposure (rare in Canada at recommended CWF levels)',
              'Potential neurocognitive effects are being evaluated as an emerging endpoint; evidence and uncertainty remain, particularly at lower exposures'
            ]
          },
          {
            id: 'Q7c',
            prompt: 'The community‑wide fluoridation program aims to achieve the benefits of CWF while minimizing risk of excess fluoride exposure, especially in young children. List FIVE key program components required to do this safely and effectively.',
            max_score: 2.5,
            domain: '2',
            response_type: 'list',
            list_count: 5,
            rubric: [
              'Clear target and control: Maintain fluoride at the optimal level (commonly 0.7 mg/L) and ensure levels stay below the drinking water guideline maximum acceptable concentration (MAC) of 1.5 mg/L',
              'Routine monitoring of fluoride concentration with quality assurance/quality control, calibration, documentation, and rapid corrective action if levels drift',
              'Use certified fluoridation agents and equipment, and standard operating procedures at the treatment plant',
              'Defined governance: Roles and accountability across water utility and public health, with reporting and oversight arrangements',
              'Incident response plan for overfeed or underfeed: thresholds, mitigation steps, timely public notification, and after‑action review',
              'Risk communication for families to reduce total fluoride ingestion from other sources (e.g., appropriate toothpaste amount/supervision for children, avoid swallowing), focused on the most susceptible ages: 0‑36 months old (rice‑sized grain of toothpaste), 3‑6 years old (small pea sized amount of toothpaste)',
              'Evaluation/surveillance plan: track oral health outcomes (e.g. caries trends, service use) and monitor fluorosis, especially in cohorts exposed during early childhood'
            ]
          }
        ]
      }
    ]
  };

  // Keep a reference to the entire exam object (not just questions).  This
  // allows us to read total_time_sec and other metadata.
  let examDataFull = embeddedExamData;
  const landingSection = document.getElementById('landing');
  const examSection = document.getElementById('exam');
  const reviewSection = document.getElementById('review');
  const resultsSection = document.getElementById('results');

  // Grab references to start buttons for different exam modes
  const startFullBtn = document.getElementById('start-full');
  const startHalfBtn = document.getElementById('start-half');
  const startPracticeBtn = document.getElementById('start-practice');
  const timerDisplay = document.getElementById('timer');
  // Display of total available points. This element is shown near the timer.
  const pointsIndicator = document.getElementById('points-indicator');
  const reviewButton = document.getElementById('review-button');
  const questionListEl = document.getElementById('question-list');
  const questionContentEl = document.getElementById('question-content');
  const prevQuestionBtn = document.getElementById('prev-question');
  const nextQuestionBtn = document.getElementById('next-question');
  const flagQuestionBtn = document.getElementById('flag-question');
  const reviewListEl = document.getElementById('review-list');
  const backToExamBtn = document.getElementById('back-to-exam');
  const finalSubmitBtn = document.getElementById('final-submit');
  const resultsContainer = document.getElementById('results-container');

  // Scoring and instructions containers
  const scoringSection = document.getElementById('scoring-section');
  const instructionsSection = document.getElementById('instructions-section');

  // Track whether the timer is paused. When paused, the countdown is halted until resumed.
  let timerPaused = false;

  // Calculator elements. These will be assigned during initialisation on DOMContentLoaded.
  let calculatorIcon = null;
  let calculatorPanel = null;
  let calculatorDisplay = null;

  /**
   * Initialise the calculator controls after DOMContentLoaded. This assigns
   * references to the icon, panel and display, hides the calculator by default,
   * and attaches event listeners for toggling the panel and handling button input.
   */
  function initCalculator() {
    calculatorIcon = document.getElementById('calculator-icon');
    calculatorPanel = document.getElementById('calculator-panel');
    calculatorDisplay = document.getElementById('calc-display');
    if (!calculatorIcon || !calculatorPanel || !calculatorDisplay) return;
    // Hide icon and panel by default; they will be shown in the exam section
    calculatorIcon.style.display = 'none';
    calculatorPanel.style.display = 'none';
    // Use a delay when hiding the calculator to make button clicks easier.
    let hideTimeout;
    function showCalculator() {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
      calculatorPanel.style.display = 'block';
    }
    function hideCalculatorDelayed() {
      if (hideTimeout) clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        calculatorPanel.style.display = 'none';
        hideTimeout = null;
      }, 3000);
    }
    calculatorIcon.addEventListener('mouseenter', showCalculator);
    calculatorIcon.addEventListener('mouseleave', hideCalculatorDelayed);
    calculatorPanel.addEventListener('mouseenter', showCalculator);
    calculatorPanel.addEventListener('mouseleave', hideCalculatorDelayed);
    // Toggle on click for touch devices
    calculatorIcon.addEventListener('click', () => {
      if (calculatorPanel.style.display === 'block') {
        calculatorPanel.style.display = 'none';
      } else {
        calculatorPanel.style.display = 'block';
      }
    });
    // Add click handlers to calculator buttons
    const calcButtons = document.querySelectorAll('#calculator-panel .calc-btn');
    calcButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');
        handleCalcInput(val);
      });
    });
  }

  /**
   * Collapse/hide the calculator panel. Used when changing questions or sections.
   */
  function collapseCalculator() {
    if (calculatorPanel) {
      calculatorPanel.style.display = 'none';
    }
  }

  /**
   * Evaluate a mathematical expression entered by the user. Supports +, -, *, /,
   * parentheses, exponents (^), log() for base‑10 and ln() for natural logarithm.
   * @param {string} expr
   * @returns {number}
   */
  function evaluateExpression(expr) {
    // Polyfill for Math.log10 if not present
    if (!Math.log10) {
      Math.log10 = function (x) {
        return Math.log(x) / Math.LN10;
      };
    }
    // Replace operators and functions with JavaScript equivalents
    // Replace caret (^) with exponentiation operator
    let sanitized = expr.replace(/\^/g, '**');
    // Replace ln( with Math.log(
    sanitized = sanitized.replace(/ln\(/g, 'Math.log(');
    // Replace log( with Math.log10(
    sanitized = sanitized.replace(/log\(/g, 'Math.log10(');
    // Prevent evaluation of malicious code by allowing only safe characters
    // A simple check: only digits, operators, parentheses, decimal point and letters
    if (/[^0-9+\-*/().,\s^logn]/i.test(expr)) {
      throw new Error('Invalid characters in expression');
    }
    // Use Function constructor for evaluation in a safe manner
    // eslint-disable-next-line no-new-func
    return Function('return ' + sanitized)();
  }

  /**
   * Handle input from calculator buttons. Appends characters to the display or
   * performs clear/evaluation operations.
   * @param {string} val
   */
  function handleCalcInput(val) {
    if (!calculatorDisplay) return;
    if (val === 'C') {
      calculatorDisplay.value = '';
    } else if (val === '=') {
      try {
        const result = evaluateExpression(calculatorDisplay.value);
        calculatorDisplay.value = result;
      } catch (err) {
        calculatorDisplay.value = 'Error';
      }
    } else {
      calculatorDisplay.value += val;
    }
  }

  // State variables
  let examData = [];
  let activeQuestions = [];
  let currentIndex = 0;
  let timerInterval = null;
  let timeRemaining = 0;
  const warningTimes = [10 * 60, 1 * 60]; // 10 minutes and 1 minute

  // Additional state
  let examMode = 'full';
  let examDuration = 10800; // default full duration
  let startedAt = null;

  // Persistent keys for localStorage
  const STORAGE_KEY_ANSWERS = 'saq_answers';
  const STORAGE_KEY_FLAGS = 'saq_flags';
  const STORAGE_KEY_TIME = 'saq_time_remaining';
  const STORAGE_KEY_SELECTED = 'saq_selected_ids';
  const STORAGE_KEY_MODE = 'saq_mode';
  const STORAGE_KEY_STARTED_AT = 'saq_started_at';
  const STORAGE_KEY_SCORES = 'saq_awarded_scores';
  const STORAGE_KEY_LAST_TICK = 'saq_last_tick_epoch_ms';

  // Fetch exam data.  Because the page is loaded via file://, fetch() will
  // fail.  Instead, this function returns the embedded data immediately.
  async function loadExamData() {
    return examDataFull;
  }

  // Format seconds into HH:MM:SS
  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s]
      .map((v) => String(v).padStart(2, '0'))
      .join(':');
  }

  // Start timer
  function startTimer(totalSeconds) {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    timerPaused = false; // ensure timer is considered running
    timeRemaining = totalSeconds;
    localStorage.setItem(STORAGE_KEY_LAST_TICK, String(Date.now()));
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      timeRemaining -= 1;
      updateTimerDisplay();
      if (warningTimes.includes(timeRemaining)) {
        const minutes = Math.floor(timeRemaining / 60);
        alert(
          `Only ${minutes} minute${minutes === 1 ? '' : 's'} remaining! Please manage your time.`
        );
      }
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        submitExam();
      }
      // Save time remaining to localStorage for autosave
      localStorage.setItem(STORAGE_KEY_TIME, timeRemaining);
      localStorage.setItem(STORAGE_KEY_LAST_TICK, String(Date.now()));
    }, 1000);
  }

  function updateTimerDisplay() {
    // When paused, indicate paused status in timer display
    const formatted = 'Time Remaining: ' + formatTime(timeRemaining);
    timerDisplay.textContent = timerPaused ? formatted + ' (Paused)' : formatted;
  }

  // Initialise navigation list
  function renderQuestionList() {
    questionListEl.innerHTML = '';
    activeQuestions.forEach((q, idx) => {
      const li = document.createElement('li');
      li.textContent = `Q${q.number}`;
      li.dataset.index = idx;
      if (idx === currentIndex) li.classList.add('active');
      if (isFlagged(q.id)) li.classList.add('flagged');
      li.addEventListener('click', () => {
        saveCurrentAnswer();
        currentIndex = idx;
        renderQuestion();
      });
      const flagSpan = document.createElement('span');
      flagSpan.textContent = isFlagged(q.id) ? '★' : '';
      li.appendChild(flagSpan);
      questionListEl.appendChild(li);
    });
  }

  // Render current question
  function renderQuestion() {
    const q = activeQuestions[currentIndex];
    if (!q) return;
    // update nav list highlight
    Array.from(questionListEl.children).forEach((li) => {
      li.classList.toggle('active', Number(li.dataset.index) === currentIndex);
      const id = activeQuestions[Number(li.dataset.index)].id;
      li.classList.toggle('flagged', isFlagged(id));
      const flagSpan = li.querySelector('span');
      if (flagSpan) flagSpan.textContent = isFlagged(id) ? '★' : '';
    });

    // Build HTML for question parts
    const container = document.createElement('div');
    // Compute total marks for the current question (sum of part max scores)
    const totalMarks = q.parts.reduce((sum, part) => sum + (part.max_score || 0), 0);
    const heading = document.createElement('h3');
    heading.textContent = `Question ${q.number} (Total marks: ${totalMarks})`;
    container.appendChild(heading);
    q.parts.forEach((part, partIndex) => {
      const partDiv = document.createElement('div');
      partDiv.classList.add('question-part');
      const partHeader = document.createElement('h4');
      // Determine marks string according to Royal College style
      let marksString;
      if (part.response_type === 'list' && part.list_count && part.list_count > 0) {
        // For list responses, compute per‑item score and round to one decimal place.
        const perItem = part.max_score / part.list_count;
        const perItemRounded = Math.round(perItem * 10) / 10;
        const perItemStr = perItemRounded.toString();
        // Always use singular 'mark' for the per‑item description (e.g., '0.5 mark each')
        marksString = `${perItemStr} mark each, ${part.max_score} ${part.max_score === 1 ? 'mark' : 'marks'} total`;
      } else {
        // Non‑list responses just display the total marks
        marksString = `${part.max_score} ${part.max_score === 1 ? 'mark' : 'marks'} total`;
      }
      partHeader.textContent = `${String.fromCharCode(97 + partIndex)}) ${part.prompt} (${marksString})`;
      // Domain information is stored for scoring purposes only. It is not displayed
      // on the exam interface to keep the question text clear and uncluttered.
      partDiv.appendChild(partHeader);
      const answerDiv = document.createElement('div');
      answerDiv.classList.add('answer-area');
      // Attach metadata to answer area for saving logic
      answerDiv.dataset.qId = q.id;
      answerDiv.dataset.partId = part.id;
      answerDiv.dataset.responseType = part.response_type || 'text';
      if (part.response_type === 'list') {
        // Render multiple single-line inputs based on list_count
        const saved = getSavedAnswer(q.id, part.id);
        const items = saved ? saved.split('\n') : [];
        const count = part.list_count || 0;
        for (let i = 0; i < count; i++) {
          const input = document.createElement('input');
          input.type = 'text';
          input.classList.add('list-item-input');
          input.dataset.qId = q.id;
          input.dataset.partId = part.id;
          input.dataset.itemIndex = i;
          input.value = items[i] || '';
          answerDiv.appendChild(input);
        }
      } else {
        // Render a textarea for free-form answer
        const textarea = document.createElement('textarea');
        textarea.dataset.qId = q.id;
        textarea.dataset.partId = part.id;
        textarea.value = getSavedAnswer(q.id, part.id);
        answerDiv.appendChild(textarea);
      }
      partDiv.appendChild(answerDiv);
      container.appendChild(partDiv);
    });
    questionContentEl.innerHTML = '';
    questionContentEl.appendChild(container);

    // Update the label of the next button depending on whether this is the last question
    if (currentIndex >= activeQuestions.length - 1) {
      nextQuestionBtn.textContent = 'Review/Submit';
    } else {
      nextQuestionBtn.textContent = 'Next';
    }

    // Collapse the calculator when navigating to a new question
    collapseCalculator();
  }

  function getSavedAnswers() {
    const raw = localStorage.getItem(STORAGE_KEY_ANSWERS);
    return raw ? JSON.parse(raw) : {};
  }
  function getSavedFlags() {
    const raw = localStorage.getItem(STORAGE_KEY_FLAGS);
    return raw ? JSON.parse(raw) : {};
  }
  function getSavedAnswer(qId, partId) {
    const answers = getSavedAnswers();
    if (answers[qId] && answers[qId][partId]) return answers[qId][partId];
    return '';
  }
  function isFlagged(qId) {
    const flags = getSavedFlags();
    return !!flags[qId];
  }

  function toggleFlag(qId) {
    const flags = getSavedFlags();
    if (flags[qId]) {
      delete flags[qId];
    } else {
      flags[qId] = true;
    }
    localStorage.setItem(STORAGE_KEY_FLAGS, JSON.stringify(flags));
    renderQuestionList();
  }

  // Save current answer values to localStorage
  function saveCurrentAnswer() {
    const answers = getSavedAnswers();
    // Each answer area contains either multiple list inputs or a single textarea
    const answerAreas = questionContentEl.querySelectorAll('.answer-area');
    answerAreas.forEach((area) => {
      const qId = area.dataset.qId;
      const partId = area.dataset.partId;
      const responseType = area.dataset.responseType || 'text';
      if (!answers[qId]) answers[qId] = {};
      if (responseType === 'list') {
        const inputs = area.querySelectorAll('input');
        const lines = Array.from(inputs).map((inp) => inp.value.trim());
        answers[qId][partId] = lines.join('\n');
      } else {
        const textarea = area.querySelector('textarea');
        if (textarea) {
          answers[qId][partId] = textarea.value;
        }
      }
    });
    localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
  }

  // Render review list
  function renderReview() {
    reviewListEl.innerHTML = '';
    const answers = getSavedAnswers();
    const summaryDiv = document.getElementById('review-summary');
    let countUnanswered = 0;
    let countFlagged = 0;
    let countComplete = 0;
    activeQuestions.forEach((q, idx) => {
      const li = document.createElement('li');
      // Determine answer completeness and flag status
      let unanswered = false;
      q.parts.forEach((p) => {
        const ans = answers[q.id] ? answers[q.id][p.id] : '';
        if (p.response_type === 'list') {
          const expectedCount = p.list_count || 0;
          const provided = (ans || '')
            .split('\n')
            .slice(0, expectedCount)
            .filter((item) => item.trim().length > 0).length;
          if (provided < expectedCount) {
            unanswered = true;
          }
        } else if (!ans || ans.trim().length === 0) {
          unanswered = true;
        }
      });
      const flagged = isFlagged(q.id);
      // Determine status and assign classes
      let statusText = '';
      if (flagged) {
        // increment flagged count regardless of answer status
        countFlagged += 1;
      }
      if (unanswered) {
        statusText = 'Unanswered';
        li.classList.add('unanswered');
        countUnanswered += 1;
      } else if (flagged) {
        statusText = 'Flagged';
        li.classList.add('flagged');
        // Note: countFlagged already incremented above
      } else {
        statusText = 'Complete';
        li.classList.add('complete');
        countComplete += 1;
      }
      // Always apply flagged class if flagged, but unanswered takes precedence visually
      if (flagged) {
        li.classList.add('flagged');
      }
      // Label text
      li.textContent = `Question ${q.number} – ${statusText}`;
      // If a question is flagged and unanswered, append a badge
      if (flagged && unanswered) {
        const badge = document.createElement('span');
        badge.textContent = ' (Flagged)';
        li.appendChild(badge);
      }
      const goBtn = document.createElement('button');
      goBtn.textContent = 'Edit';
      goBtn.addEventListener('click', () => {
        // go back to exam and show this question
        currentIndex = idx;
        switchSection('exam');
        renderQuestion();
      });
      li.appendChild(goBtn);
      reviewListEl.appendChild(li);
    });
    // Update summary counts
    if (summaryDiv) {
      summaryDiv.innerHTML = `Unanswered: ${countUnanswered} | Flagged: ${countFlagged} | Complete: ${countComplete}`;
    }
  }

  // Submit exam and show results
  function submitExam() {
    // Stop timer if running
    if (timerInterval) clearInterval(timerInterval);
    // Save any current answers
    saveCurrentAnswer();
    // Capture remaining time for export
    const remaining = timeRemaining;
    // Export attempt JSON automatically
    exportAttemptJSON(remaining);
    // Build results display
    resultsContainer.innerHTML = '';
    const answers = getSavedAnswers();
    activeQuestions.forEach((q) => {
      const resultItem = document.createElement('div');
      resultItem.classList.add('result-item');
      const title = document.createElement('h3');
      title.textContent = `Question ${q.number}`;
      resultItem.appendChild(title);
      q.parts.forEach((p, idx) => {
        // User answer
        const partHeading = document.createElement('h4');
        partHeading.textContent = `${String.fromCharCode(97 + idx)}) Your answer:`;
        resultItem.appendChild(partHeading);
        const answerParagraph = document.createElement('pre');
        answerParagraph.textContent = (answers[q.id] && answers[q.id][p.id]) || '';
        answerParagraph.classList.add('user-answer');
        resultItem.appendChild(answerParagraph);
        // Model answer
        const rubricHeading = document.createElement('h4');
        rubricHeading.textContent = `${String.fromCharCode(97 + idx)}) Model answer:`;
        resultItem.appendChild(rubricHeading);
        const rubricParagraph = document.createElement('pre');
        rubricParagraph.textContent = p.rubric.join('\n');
        rubricParagraph.classList.add('model-answer');
        resultItem.appendChild(rubricParagraph);
      });
      resultsContainer.appendChild(resultItem);
    });
    // Render instructions for Custom GPT (placed before rubric section)
    renderInstructions();
    // Clear stored answers, flags, timer, selected questions and exam meta to avoid unintended resume
    localStorage.removeItem(STORAGE_KEY_ANSWERS);
    localStorage.removeItem(STORAGE_KEY_FLAGS);
    localStorage.removeItem(STORAGE_KEY_TIME);
    localStorage.removeItem(STORAGE_KEY_SELECTED);
    localStorage.removeItem(STORAGE_KEY_MODE);
    localStorage.removeItem(STORAGE_KEY_STARTED_AT);
    localStorage.removeItem(STORAGE_KEY_LAST_TICK);
    // Show results section
    switchSection('results');
  }

  // Switch between UI sections
  function switchSection(sectionId) {
    [landingSection, examSection, reviewSection, resultsSection].forEach((sec) => {
      sec.classList.add('hidden');
      sec.style.display = 'none';
    });
    let target;
    if (sectionId === 'landing') target = landingSection;
    if (sectionId === 'exam') target = examSection;
    if (sectionId === 'review') target = reviewSection;
    if (sectionId === 'results') target = resultsSection;
    if (target) {
      target.classList.remove('hidden');
      target.style.display = 'block';
    }

    // Show or hide calculator icon/panel based on section
    if (calculatorIcon && calculatorPanel) {
      if (sectionId === 'exam') {
        calculatorIcon.style.display = 'flex';
      } else {
        calculatorIcon.style.display = 'none';
        calculatorPanel.style.display = 'none';
      }
    }
  }

  /**
   * Export the exam attempt as a JSON file and trigger download. The exported
   * object includes metadata (mode, start/end times, duration) and the list
   * of questions with user answers and flagged status.
   *
   * @param {number} remainingSec - The number of seconds remaining when the exam was submitted.
   */
  function exportAttemptJSON(remainingSec) {
    const answers = getSavedAnswers();
    const flags = getSavedFlags();
    const payload = {
      version: '1.0',
      exam_mode: examMode,
      started_at: startedAt || localStorage.getItem(STORAGE_KEY_STARTED_AT) || new Date().toISOString(),
      submitted_at: new Date().toISOString(),
      total_time_sec: examDuration,
      remaining_time_sec: typeof remainingSec === 'number' ? remainingSec : 0,
      questions: activeQuestions.map((q) => {
        return {
          id: q.id,
          number: q.number,
          parts: q.parts.map((p) => {
            return {
              id: p.id,
              prompt: p.prompt,
              rubric: p.rubric,
              max_score: p.max_score,
              domain: p.domain,
              flagged: !!flags[q.id],
              answer_text: (answers[q.id] && answers[q.id][p.id]) || ''
            };
          })
        };
      })
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Generate a timestamp for filename
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.download = `saq_attempt_${examMode}_${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Retrieve the awarded scores object from localStorage. The structure is
   * {
   *   questionId: { partId: number }
   * }.
   *
   * @returns {Object} scores
   */
  function getAwardedScores() {
    const raw = localStorage.getItem(STORAGE_KEY_SCORES);
    return raw ? JSON.parse(raw) : {};
  }

  /**
   * Persist awarded scores to localStorage.
   *
   * @param {Object} scores
   */
  function saveAwardedScores(scores) {
    localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(scores));
  }

  /**
   * Render the scoring input controls and summary chart. Each part of each
   * question gets a numeric input for the user to enter the awarded score.
   */
  function renderScoring() {
    if (!scoringSection) return;
    scoringSection.innerHTML = '';
    const heading = document.createElement('h3');
    heading.textContent = 'Self/External Mark Entry and Summary';
    scoringSection.appendChild(heading);
    const scores = getAwardedScores();
    // Create score rows for each part
    activeQuestions.forEach((q) => {
      q.parts.forEach((p, idx) => {
        const row = document.createElement('div');
        row.classList.add('score-row');
        const label = document.createElement('label');
        label.textContent = `Q${q.number}${String.fromCharCode(97 + idx)} (max ${p.max_score}):`;
        row.appendChild(label);
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.step = 0.1;
        input.max = p.max_score;
        input.dataset.qId = q.id;
        input.dataset.partId = p.id;
        input.dataset.max = p.max_score;
        // Pre-populate value if previously scored
        const savedVal = scores[q.id] && scores[q.id][p.id];
        input.value = savedVal != null ? savedVal : '';
        input.addEventListener('input', (evt) => {
          const qId = evt.target.dataset.qId;
          const partId = evt.target.dataset.partId;
          const max = parseFloat(evt.target.dataset.max);
          let val = parseFloat(evt.target.value);
          if (isNaN(val) || val < 0) val = 0;
          if (val > max) val = max;
          evt.target.value = val;
          const allScores = getAwardedScores();
          if (!allScores[qId]) allScores[qId] = {};
          allScores[qId][partId] = val;
          saveAwardedScores(allScores);
          updateScoreSummary();
        });
        row.appendChild(input);
        scoringSection.appendChild(row);
      });
    });
    // Summary container
    const summaryDiv = document.createElement('div');
    summaryDiv.id = 'score-summary';
    scoringSection.appendChild(summaryDiv);
    // Bar chart container
    const chartDiv = document.createElement('div');
    chartDiv.id = 'score-chart';
    scoringSection.appendChild(chartDiv);
    // Download scored JSON button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'download-scored';
    dlBtn.textContent = 'Download scored attempt JSON';
    dlBtn.addEventListener('click', () => {
      downloadScoredAttempt();
    });
    scoringSection.appendChild(dlBtn);
    // Compute initial summary
    updateScoreSummary();
  }

  /**
   * Compute and update the scoring summary and bar chart based on awarded scores.
   */
  function updateScoreSummary() {
    const scores = getAwardedScores();
    let totalAwarded = 0;
    let totalMax = 0;
    const domainTotals = {};
    activeQuestions.forEach((q) => {
      q.parts.forEach((p) => {
        const qScores = scores[q.id] || {};
        const partVal = parseFloat(qScores[p.id]);
        const awarded = !isNaN(partVal) ? partVal : 0;
        totalAwarded += awarded;
        totalMax += p.max_score;
        if (!domainTotals[p.domain]) domainTotals[p.domain] = { awarded: 0, max: 0 };
        domainTotals[p.domain].awarded += awarded;
        domainTotals[p.domain].max += p.max_score;
      });
    });
    // Update summary text
    const summaryDiv = document.getElementById('score-summary');
    if (summaryDiv) {
      summaryDiv.innerHTML = '';
      const totalPercent = totalMax > 0 ? ((totalAwarded / totalMax) * 100).toFixed(1) : '0';
      const pTotal = document.createElement('p');
      pTotal.textContent = `Total Score: ${totalAwarded.toFixed(2)} / ${totalMax} (${totalPercent}% )`;
      summaryDiv.appendChild(pTotal);
      const list = document.createElement('ul');
      Object.keys(domainTotals).forEach((domain) => {
        const dt = domainTotals[domain];
        const percent = dt.max > 0 ? ((dt.awarded / dt.max) * 100).toFixed(1) : '0';
        const li = document.createElement('li');
        li.textContent = `${domain}: ${dt.awarded.toFixed(2)} / ${dt.max} (${percent}%)`;
        list.appendChild(li);
      });
      summaryDiv.appendChild(list);
    }
    // Update bar chart
    const chartDiv = document.getElementById('score-chart');
    if (chartDiv) {
      chartDiv.innerHTML = '';
      Object.keys(domainTotals).forEach((domain) => {
        const dt = domainTotals[domain];
        const percent = dt.max > 0 ? (dt.awarded / dt.max) * 100 : 0;
        const row = document.createElement('div');
        row.classList.add('bar-row');
        const label = document.createElement('span');
        label.classList.add('bar-label');
        label.textContent = domain;
        const wrapper = document.createElement('div');
        wrapper.classList.add('bar-wrapper');
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.width = `${percent}%`;
        wrapper.appendChild(bar);
        const percentLabel = document.createElement('span');
        percentLabel.classList.add('bar-percent');
        percentLabel.textContent = percent.toFixed(1) + '%';
        row.appendChild(label);
        row.appendChild(wrapper);
        row.appendChild(percentLabel);
        chartDiv.appendChild(row);
      });
    }
  }

  /**
   * Build a JSON object of the scored attempt and trigger its download.
   */
  function downloadScoredAttempt() {
    const answers = getSavedAnswers();
    const flags = getSavedFlags();
    const scores = getAwardedScores();
    const attempt = {
      version: '1.0',
      exam_mode: examMode,
      started_at: startedAt || localStorage.getItem(STORAGE_KEY_STARTED_AT) || new Date().toISOString(),
      scored_at: new Date().toISOString(),
      total_time_sec: examDuration,
      questions: activeQuestions.map((q) => {
        return {
          id: q.id,
          number: q.number,
          parts: q.parts.map((p) => {
            const qScores = scores[q.id] || {};
            return {
              id: p.id,
              max_score: p.max_score,
              domain: p.domain,
              flagged: !!flags[q.id],
              answer_text: (answers[q.id] && answers[q.id][p.id]) || '',
              awarded_score: qScores[p.id] != null ? qScores[p.id] : null
            };
          })
        };
      })
    };
    const blob = new Blob([JSON.stringify(attempt, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.download = `saq_scored_attempt_${examMode}_${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Render instructions for using Custom GPT to obtain feedback. Provides a
   * structured prompt and a copy-to-clipboard button. Uses the GPT link
   * provided by the client.
   */
  function renderInstructions() {
    if (!instructionsSection) return;
    instructionsSection.innerHTML = '';
    // Heading for next steps
    const heading = document.createElement('h3');
    heading.textContent = 'Next Steps for Automated Feedback';
    instructionsSection.appendChild(heading);
    // Introductory explanation
    const para = document.createElement('p');
    para.textContent =
      'To receive detailed scoring and feedback, you can use the Royal College Custom GPT bot. Simply upload the downloaded JSON file and copy/paste the prompt below into the chat. The Custom GPT will use the rubric to score your answers against model answers, provide an overall score and subject specific score, highlight borderline responses for user review, and suggest further areas of study.';
    instructionsSection.appendChild(para);
    // Ordered list of steps
    const list = document.createElement('ol');
    // Step 1: link to Custom GPT bot
    const li1 = document.createElement('li');
    const link = document.createElement('a');
    link.href =
      'https://chatgpt.com/g/g-6928d96e50108191b20927bd9b29f3bd-5-health-systems-policy-law-and-ethics';
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Open your Royal College Custom GPT and upload the downloaded JSON file';
    li1.appendChild(link);
    list.appendChild(li1);
    // Step 2: instruct to copy prompt and paste JSON
    const li2 = document.createElement('li');
    li2.textContent =
      'Copy the instructions below and paste them into the Custom GPT chat. Then paste the JSON contents after the prompt.';
    list.appendChild(li2);
    instructionsSection.appendChild(list);
    // Structured prompt for the Custom GPT
    const pre = document.createElement('pre');
    pre.id = 'custom-prompt';
    pre.textContent =
      'Please analyze my PHPM SAQ exam attempt using the provided rubric in the same file, which contains model answers. Provide an overall percentage score and domain-specific scores. Highlight any answers that are borderline or may merit partial credit where the user should provide input. Offer encouraging advice on what to study next. Here is my attempt JSON:\n\n{paste JSON here}';
    instructionsSection.appendChild(pre);
    // Button to copy prompt
    const copyBtn = document.createElement('button');
    copyBtn.id = 'copy-instructions';
    copyBtn.textContent = 'Copy instructions';
    copyBtn.addEventListener('click', () => {
      const textToCopy = pre.textContent;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          alert('Instructions copied to clipboard. Paste them into your Custom GPT along with your JSON file.');
        })
        .catch(() => {
          alert('Copy failed. You may need to manually select and copy the text.');
        });
    });
    instructionsSection.appendChild(copyBtn);
    // Advisory note about AI scoring
    const note = document.createElement('p');
    note.classList.add('note');
    note.textContent =
      'Note: AI-generated scoring is advisory and should be reviewed alongside the official rubric with human input and judgment.';
    instructionsSection.appendChild(note);
  }

  // Initialise exam session
  /**
   * Initialise and start an exam.
   *
   * @param {string} mode - 'full', 'half', or 'practice'
   */
  async function startExam(mode = 'full') {
    try {
      examDataFull = await loadExamData();
    } catch (err) {
      alert(err.message);
      return;
    }
    // Clear any previous state when starting a new exam
    localStorage.removeItem(STORAGE_KEY_ANSWERS);
    localStorage.removeItem(STORAGE_KEY_FLAGS);
    localStorage.removeItem(STORAGE_KEY_TIME);
    localStorage.removeItem(STORAGE_KEY_SELECTED);
    localStorage.removeItem(STORAGE_KEY_MODE);
    localStorage.removeItem(STORAGE_KEY_STARTED_AT);
    localStorage.removeItem(STORAGE_KEY_SCORES);
    localStorage.removeItem(STORAGE_KEY_LAST_TICK);

    examMode = mode;
    // Determine exam duration based on mode
    const fullDuration = examDataFull.total_time_sec || 10800;
    if (mode === 'full') {
      examDuration = fullDuration;
    } else if (mode === 'half') {
      examDuration = Math.floor(fullDuration / 2);
    } else if (mode === 'practice') {
      examDuration = Math.floor(fullDuration / 6);
    } else {
      examDuration = fullDuration;
    }
    // Choose questions based on mode
    const allQuestions = examDataFull.questions;
    let selected;
    if (mode === 'full') {
      selected = allQuestions;
    } else if (mode === 'half') {
      // Half exam not available yet; default to all questions
      selected = allQuestions;
    } else if (mode === 'practice') {
      // Practice exam uses all questions but randomises their order
      selected = [...allQuestions];
      selected.sort(() => Math.random() - 0.5);
    } else {
      selected = allQuestions;
    }
    // Save selected IDs and mode to localStorage for resume
    const selectedIds = selected.map((q) => q.id);
    localStorage.setItem(STORAGE_KEY_SELECTED, JSON.stringify(selectedIds));
    localStorage.setItem(STORAGE_KEY_MODE, examMode);
    // Set started time
    startedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_STARTED_AT, startedAt);
    // Deep copy questions to activeQuestions to avoid mutating original data
    activeQuestions = selected.map((q) => JSON.parse(JSON.stringify(q)));
    // Assign sequential numbers for display
    activeQuestions.forEach((q, idx) => {
      q.number = idx + 1;
    });
    // Calculate total points available in the selected exam and display it
    if (pointsIndicator) {
      const totalPoints = activeQuestions.reduce((sum, q) => {
        return sum + q.parts.reduce((partSum, part) => partSum + (part.max_score || 0), 0);
      }, 0);
      pointsIndicator.textContent = 'Total Points: ' + totalPoints;
    }
    currentIndex = 0;
    renderQuestionList();
    renderQuestion();
    // Start timer with full duration
    startTimer(examDuration);
    switchSection('exam');
  }

  // Event listeners
  // Start buttons for each exam mode
  startFullBtn.addEventListener('click', () => {
    startExam('full');
  });
  if (startHalfBtn) {
    startHalfBtn.addEventListener('click', () => {
      startExam('half');
    });
  }
  if (startPracticeBtn) {
    startPracticeBtn.addEventListener('click', () => {
      startExam('practice');
    });
  }
  prevQuestionBtn.addEventListener('click', () => {
    saveCurrentAnswer();
    if (currentIndex > 0) {
      currentIndex -= 1;
      renderQuestion();
    }
  });
  nextQuestionBtn.addEventListener('click', () => {
    saveCurrentAnswer();
    // If not on last question, move to next
    if (currentIndex < activeQuestions.length - 1) {
      currentIndex += 1;
      renderQuestion();
    } else {
      // On last question: go to review/submit
      renderReview();
      switchSection('review');
    }
  });
  flagQuestionBtn.addEventListener('click', () => {
    const q = activeQuestions[currentIndex];
    toggleFlag(q.id);
    renderQuestionList();
  });
  reviewButton.addEventListener('click', () => {
    saveCurrentAnswer();
    renderReview();
    switchSection('review');
  });
  backToExamBtn.addEventListener('click', () => {
    switchSection('exam');
    renderQuestion();
  });
  finalSubmitBtn.addEventListener('click', () => {
    const confirmSubmit = confirm(
      'Are you sure you want to submit? You will not be able to edit your answers afterwards.'
    );
    if (confirmSubmit) {
      submitExam();
    }
  });

  // Calculator initialization is now handled in initCalculator(), called on DOMContentLoaded.

  // Toggle timer pause/resume when the timer display is clicked
  timerDisplay.addEventListener('click', () => {
    // Only allow pausing/resuming during an active exam
    if (!examSection.classList.contains('hidden')) {
      if (!timerPaused) {
        // Pause: clear the interval and mark paused
        if (timerInterval) clearInterval(timerInterval);
        timerPaused = true;
        updateTimerDisplay();
        localStorage.removeItem(STORAGE_KEY_LAST_TICK);
        // Save the current time remaining (already in localStorage)
      } else {
        // Resume: start a new timer interval with the remaining time
        timerPaused = false;
        startTimer(timeRemaining);
      }
    }
  });

  // Return to landing page after submission when user clicks the return-home button
  const returnHomeBtn = document.getElementById('return-home');
  if (returnHomeBtn) {
    returnHomeBtn.addEventListener('click', () => {
      // On return, clear any leftover awarded scores
      localStorage.removeItem(STORAGE_KEY_SCORES);
      // Switch back to landing page
      switchSection('landing');
    });
  }

  // On load, check if there is a previous session to resume
  window.addEventListener('DOMContentLoaded', async () => {
    // Initialise the calculator once the DOM is ready
    initCalculator();
    // Preload exam data for later
    try {
      examData = await loadExamData();
    } catch (err) {
      console.error(err);
    }
    // Check if there is a saved session to resume
    const savedTime = localStorage.getItem(STORAGE_KEY_TIME);
    const savedMode = localStorage.getItem(STORAGE_KEY_MODE);
    const savedSelected = localStorage.getItem(STORAGE_KEY_SELECTED);
    const savedStarted = localStorage.getItem(STORAGE_KEY_STARTED_AT);
    if (savedTime && savedMode && savedSelected) {
      const resume = confirm('You have an unfinished exam. Would you like to resume?');
      if (resume) {
        examMode = savedMode;
        startedAt = savedStarted;
        // Compute exam duration based on saved mode
        const fullDur = examData.total_time_sec || 10800;
        if (savedMode === 'full') {
          examDuration = fullDur;
        } else if (savedMode === 'half') {
          examDuration = Math.floor(fullDur / 2);
        } else if (savedMode === 'practice') {
          examDuration = Math.floor(fullDur / 6);
        } else {
          examDuration = fullDur;
        }
        // Rebuild activeQuestions using saved selected ids
        const ids = JSON.parse(savedSelected);
        const questionById = {};
        examData.questions.forEach((q) => {
          questionById[q.id] = q;
        });
        activeQuestions = ids
          .map((id) => questionById[id])
          .filter(Boolean)
          .map((q) => JSON.parse(JSON.stringify(q)));
        // Assign sequential numbers
        activeQuestions.forEach((q, idx) => {
          q.number = idx + 1;
        });
        if (pointsIndicator) {
          const totalPoints = activeQuestions.reduce((sum, q) => {
            return sum + q.parts.reduce((partSum, part) => partSum + (part.max_score || 0), 0);
          }, 0);
          pointsIndicator.textContent = 'Total Points: ' + totalPoints;
        }

        const lastTickRaw = localStorage.getItem(STORAGE_KEY_LAST_TICK);
        let adjustedTime = parseInt(savedTime, 10);
        if (lastTickRaw) {
          const elapsedSec = Math.floor((Date.now() - parseInt(lastTickRaw, 10)) / 1000);
          if (!Number.isNaN(elapsedSec) && elapsedSec > 0) {
            adjustedTime = Math.max(0, adjustedTime - elapsedSec);
          }
        }
        currentIndex = 0;
        renderQuestionList();
        renderQuestion();
        startTimer(adjustedTime);
        switchSection('exam');
        return;
      } else {
        // Clear saved state if not resuming
        localStorage.removeItem(STORAGE_KEY_ANSWERS);
        localStorage.removeItem(STORAGE_KEY_FLAGS);
        localStorage.removeItem(STORAGE_KEY_TIME);
        localStorage.removeItem(STORAGE_KEY_SELECTED);
        localStorage.removeItem(STORAGE_KEY_MODE);
        localStorage.removeItem(STORAGE_KEY_STARTED_AT);
        localStorage.removeItem(STORAGE_KEY_SCORES);
        localStorage.removeItem(STORAGE_KEY_LAST_TICK);
      }
    }
    // Otherwise show landing page
    switchSection('landing');
  });
})();
