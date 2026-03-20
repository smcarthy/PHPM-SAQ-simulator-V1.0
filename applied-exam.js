(function () {
  const TOPIC_META = {
    all: {
      id: 'all',
      label: 'All PHPM Topics and Hot Topics',
      iconPath: 'assets/applied/icons/all-phpm-topics-and-hot-topics.png',
      color: '#c9a227'
    },
    'health-promotion': {
      id: 'health-promotion',
      label: 'Health Promotion, Chronic Diseases, Mental Health and Substance Use',
      iconPath: 'assets/applied/icons/health-promotion-chronic-diseases-mental-health-and-substance-use.png',
      color: '#d97706'
    },
    communicable: {
      id: 'communicable',
      label: 'Communicable Diseases in Health Protection',
      iconPath: 'assets/applied/icons/communicable-diseases-in-health-protection.png',
      color: '#2563eb'
    },
    environment: {
      id: 'environment',
      label: 'Environmental, Occupational, Built Environment and Injuries',
      iconPath: 'assets/applied/icons/environmental-occupational-built-environment-and-injuries.png',
      color: '#2f855a'
    },
    systems: {
      id: 'systems',
      label: 'Health Systems, Policy, Law and Ethics',
      iconPath: 'assets/applied/icons/health-systems-health-systems-policy-law-and-ethics.png',
      color: '#9ca3af'
    },
    methods: {
      id: 'methods',
      label: 'Population Health, Epidemiology, Methods and Basic Sciences',
      iconPath: 'assets/applied/icons/population-health-epidemiology-methods-and-basic-sciences.png',
      color: '#b87333'
    },
    management: {
      id: 'management',
      label: 'Management, Leadership and Program Planning',
      iconPath: 'assets/applied/icons/management-leadership-and-program-planning.png',
      color: '#1f2937'
    },
    emergency: {
      id: 'emergency',
      label: 'Emergency Preparedness and Response',
      iconPath: 'assets/applied/icons/emergency-preparedness-and-response.png',
      color: '#dc2626'
    },
    maternal: {
      id: 'maternal',
      label: 'Maternal and Child Health',
      iconPath: 'assets/applied/icons/maternal-and-child-health.png',
      color: '#7c3aed'
    }
  };

  const GPT_URLS = {
    'gpt-1': '',
    'gpt-2': 'https://chatgpt.com/g/g-69b8961572188191a201157e775c1410-2-hpcd-mental-health-and-substance-use',
    'gpt-3': 'https://chatgpt.com/g/g-CP2Ch11qQ-3-communicable-diseases-in-health-protection',
    'gpt-4': 'https://chatgpt.com/g/g-69115c1954708191b542275310c4787c-4-e-oh-built-environment-and-injuries',
    'gpt-5': 'https://chatgpt.com/g/g-6928d96e50108191b20927bd9b29f3bd-5-health-systems-policy-law-and-ethics',
    'gpt-6': 'https://chatgpt.com/g/g-69b89e9bc1fc8191900a9cf3b5fb20c4-6-pop-health-epi-methods-and-basic-sciences',
    'gpt-7': 'https://chatgpt.com/g/g-69b8a993d4f88191b49486e4657689dd-7-management-leadership-and-program-planning',
    'gpt-8': '',
    'gpt-9': ''
  };

  const CANONICAL_LAUNCHER_TITLES = Object.values(TOPIC_META).map((topic) => topic.label);

  const GPT_LAUNCHERS = [
    {
      id: 'gpt-all',
      title: 'All PHPM Topics and Hot Topics',
      descriptor: 'Broad mixed rehearsal across all domains.',
      url: GPT_URLS['gpt-1'],
      iconPath: TOPIC_META.all.iconPath,
      topicColorKey: 'all',
      topicId: 'all'
    },
    {
      id: 'gpt-health-promotion',
      title: 'Health Promotion, Chronic Diseases, Mental Health and Substance Use',
      descriptor: 'Prevention and chronic disease oral station practice.',
      url: GPT_URLS['gpt-2'],
      iconPath: TOPIC_META['health-promotion'].iconPath,
      topicColorKey: 'health-promotion',
      topicId: 'health-promotion'
    },
    {
      id: 'gpt-communicable',
      title: 'Communicable Diseases in Health Protection',
      descriptor: 'Outbreak control and communicable disease response drills.',
      url: GPT_URLS['gpt-3'],
      iconPath: TOPIC_META.communicable.iconPath,
      topicColorKey: 'communicable',
      topicId: 'communicable'
    },
    {
      id: 'gpt-environment',
      title: 'Environmental, Occupational, Built Environment and Injuries',
      descriptor: 'Environmental hazards and injury prevention framing.',
      url: GPT_URLS['gpt-4'],
      iconPath: TOPIC_META.environment.iconPath,
      topicColorKey: 'environment',
      topicId: 'environment'
    },
    {
      id: 'gpt-systems',
      title: 'Health Systems, Policy, Law and Ethics',
      descriptor: 'Policy, law and ethics argument practice.',
      url: GPT_URLS['gpt-5'],
      iconPath: TOPIC_META.systems.iconPath,
      topicColorKey: 'systems',
      topicId: 'systems'
    },
    {
      id: 'gpt-methods',
      title: 'Population Health, Epidemiology, Methods and Basic Sciences',
      descriptor: 'Methods-heavy interpretation and epidemiology reasoning.',
      url: GPT_URLS['gpt-6'],
      iconPath: TOPIC_META.methods.iconPath,
      topicColorKey: 'methods',
      topicId: 'methods'
    },
    {
      id: 'gpt-management',
      title: 'Management, Leadership and Program Planning',
      descriptor: 'Leadership and implementation planning stations.',
      url: GPT_URLS['gpt-7'],
      iconPath: TOPIC_META.management.iconPath,
      topicColorKey: 'management',
      topicId: 'management'
    },
    {
      id: 'gpt-emergency',
      title: 'Emergency Preparedness and Response',
      descriptor: 'Incident command and emergency planning simulation.',
      url: GPT_URLS['gpt-8'],
      iconPath: TOPIC_META.emergency.iconPath,
      topicColorKey: 'emergency',
      topicId: 'emergency'
    },
    {
      id: 'gpt-maternal',
      title: 'Maternal and Child Health',
      descriptor: 'Maternal-child health interventions and policy drills.',
      url: GPT_URLS['gpt-9'],
      iconPath: TOPIC_META.maternal.iconPath,
      topicColorKey: 'maternal',
      topicId: 'maternal'
    }
  ];

  const CHALLENGE_SCENARIOS = [
    { title: 'Long-term care respiratory outbreak escalation', context: 'Cases rise over 48 hours with staffing pressure.', topicIds: ['communicable', 'management'], recommendedGptId: 'gpt-communicable', prompt: 'You are the on-call PHPM resident. In 8 minutes, outline your first-hour response to an escalating respiratory outbreak in a long-term care home.' },
    { title: 'Measles exposure at a mass gathering', context: 'A confirmed case attended a multijurisdictional festival.', topicIds: ['communicable', 'systems'], recommendedGptId: 'gpt-communicable', prompt: 'Present a structured measles exposure response plan including contact prioritization, prophylaxis, legal authority, and communication.' },
    { title: 'Boil-water advisory in a remote community', context: 'Treatment failure with prolonged disruption risk.', topicIds: ['environment', 'emergency'], recommendedGptId: 'gpt-environment', prompt: 'Lead the public health response to a boil-water advisory, including culturally safe communication, risk mitigation, and coordination.' },
    { title: 'Heat wave mortality prevention plan', context: 'Five-day extreme heat forecast above historical thresholds.', topicIds: ['environment', 'health-promotion'], recommendedGptId: 'gpt-environment', prompt: 'Develop a rapid heat response plan identifying priority populations, intervention triggers, and monitoring indicators.' },
    { title: 'Needle-sharing HIV cluster in an urban core', context: 'Cluster signal with housing instability concerns.', topicIds: ['health-promotion', 'systems'], recommendedGptId: 'gpt-health-promotion', prompt: 'Propose a 30-day action plan for a suspected HIV cluster, balancing rapid intervention, stigma reduction, and partnerships.' },
    { title: 'School refusal of routine immunization campaign', context: 'Coordinated refusal and misinformation spread.', topicIds: ['communicable', 'health-promotion'], recommendedGptId: 'gpt-communicable', prompt: 'Manage declining school immunization uptake with a strategy on communication, service support, and monitoring metrics.' },
    { title: 'Opioid overdose spike after toxic supply change', context: 'Emergency departments report sudden severe toxicity.', topicIds: ['health-promotion', 'emergency'], recommendedGptId: 'gpt-health-promotion', prompt: 'Deliver an urgent interagency response plan that combines harm reduction, surveillance, and public communication.' },
    { title: 'Wildfire smoke event affecting urban children', context: 'Two-week poor air quality with school disruption.', topicIds: ['environment', 'maternal'], recommendedGptId: 'gpt-environment', prompt: 'Prioritize immediate and medium-term actions for child respiratory protection, school guidance, and equity-focused outreach.' },
    { title: 'Hospital hallway medicine and discharge bottlenecks', context: 'System strain leads to delayed flow and safety incidents.', topicIds: ['systems', 'management'], recommendedGptId: 'gpt-systems', prompt: 'Frame a practical public-health-facing recommendation balancing evidence, political constraints, and near-term feasibility.' },
    { title: 'Avian influenza risk communication briefing', context: 'Public anxiety rises while evidence remains uncertain.', topicIds: ['communicable', 'methods'], recommendedGptId: 'gpt-communicable', prompt: 'Provide a concise risk communication approach for media, clinicians, and community partners while uncertainty evolves.' },
    { title: 'Indigenous community partnership reset after trust rupture', context: 'Past decisions reduced local confidence in health authorities.', topicIds: ['systems', 'management'], recommendedGptId: 'gpt-systems', prompt: 'Outline a culturally safe and relationship-centered path forward with shared governance, accountability, and realistic next steps.' }
  ];

  const EXAM_TEST_ITEMS = [
    { title: 'Organization and logic', detail: 'Use a clear structure: issue framing, priorities, recommendation, and follow-through.' },
    { title: 'Communication clarity', detail: 'Deliver concise key messages that would work in a real oral station under time pressure.' },
    { title: 'Stakeholder awareness', detail: 'Show who matters, who is affected, and who must be engaged now versus later.' },
    { title: 'Public health judgment', detail: 'Make defensible decisions under uncertainty using risk, evidence, and practical context.' },
    { title: 'Feasibility and next steps', detail: 'Recommend actions that are implementable in real systems with immediate and near-term steps.' },
    { title: 'Equity, ethics, and practical reasoning', detail: 'Integrate fairness, cultural safety, legal/ethical considerations, and unintended consequences.' }
  ];

  const HOT_TOPICS = [
    {
      title: 'COVID-19 recovery, trust, and health equity',
      why: 'Recovery planning still tests credibility, trust repair, and equitable access decisions.',
      angles: ['Rebuild confidence after policy fatigue', 'Target outreach to communities with worse outcomes', 'Balance surveillance with practical service delivery'],
      labels: ['Health Promotion, Chronic Diseases, Mental Health and Substance Use', 'Health Systems, Policy, Law and Ethics']
    },
    {
      title: 'Climate change, heat, and wildfire smoke',
      why: 'Extreme weather now demands rapid intersectoral planning and risk communication.',
      angles: ['Heat action triggers and vulnerable populations', 'School and workplace smoke guidance', 'Cross-jurisdiction incident coordination'],
      labels: ['Environmental, Occupational, Built Environment and Injuries', 'Emergency Preparedness and Response']
    },
    {
      title: 'Emergency preparedness and resilient communities',
      why: 'Residents are expected to operationalize response systems, not just describe frameworks.',
      angles: ['First 24-hour priority setting', 'Decision-making with incomplete situational awareness', 'Recovery and resilience planning after acute response'],
      labels: ['Emergency Preparedness and Response', 'Management, Leadership and Program Planning']
    },
    {
      title: 'Immunization confidence and measles',
      why: 'Resurgent measles risk challenges communication, legal tools, and service access.',
      angles: ['Exposure response and contact prioritization', 'Address misinformation without increasing polarization', 'Plan practical catch-up vaccination operations'],
      labels: ['Communicable Diseases in Health Protection', 'Health Promotion, Chronic Diseases, Mental Health and Substance Use']
    },
    {
      title: 'Toxic drug crisis and harm reduction',
      why: 'Oral stations often probe high-stakes decisions where stigma and urgency collide.',
      angles: ['Rapid overdose spike response', 'Partnering with lived-experience organizations', 'Communication to media and elected leaders'],
      labels: ['Health Promotion, Chronic Diseases, Mental Health and Substance Use', 'Health Systems, Policy, Law and Ethics']
    },
    {
      title: 'Avian influenza and emerging infectious threats',
      why: 'Residents must show structured reasoning when evidence is changing quickly.',
      angles: ['Precautionary planning under uncertainty', 'Healthcare and community risk communication', 'Surveillance, testing, and interagency updates'],
      labels: ['Communicable Diseases in Health Protection', 'Population Health, Epidemiology, Methods and Basic Sciences']
    },
    {
      title: 'Health-system strain and public health reform',
      why: 'System stress requires practical policy judgment and implementation thinking.',
      angles: ['Prioritize feasible reforms versus ideal reforms', 'Navigate accountability across institutions', 'Frame near-term wins and longer-term change'],
      labels: ['Health Systems, Policy, Law and Ethics', 'Management, Leadership and Program Planning']
    },
    {
      title: 'Indigenous health, equity, and culturally safe partnerships',
      why: 'Applied stations expect trust-centered, partnership-based, and culturally safe approaches.',
      angles: ['Shared decision-making with Indigenous partners', 'Address structural inequities in service design', 'Build accountability and continuity over time'],
      labels: ['Health Systems, Policy, Law and Ethics', 'Management, Leadership and Program Planning']
    }
  ];

  const STUDY_PLAN = [
    {
      week: 'Week 1',
      focus: 'Breadth and answer structure',
      actions: ['Run one short station from each major topic area', 'Use one repeatable answer scaffold: issue, stakeholders, recommendation, next steps', 'Practise concise key messages in 30- to 45-second summaries']
    },
    {
      week: 'Week 2',
      focus: 'Role-play and difficult conversations',
      actions: ['Do partner role-play with skeptical media/public/elected stakeholder prompts', 'Practise clarity under interruption and ambiguity', 'Refine language for trust, uncertainty, and accountability']
    },
    {
      week: 'Week 3',
      focus: 'Weak spots plus hot topics',
      actions: ['Review debrief notes and target two recurring weak areas', 'Run focused stations on high-yield hot topics', 'Keep responses decision-oriented rather than detail-heavy']
    },
    {
      week: 'Week 4',
      focus: 'Timed simulation and refinement',
      actions: ['Run full timed mock blocks to mimic in-person station cadence', 'Tighten opening structure and closing recommendation', 'Finish each station with one concise key message and one concrete next step']
    }
  ];

  const SELF_DEBRIEF_CHECKLIST = ['What was the issue?', 'Who mattered?', 'What was my structure?', 'What was my recommendation?', 'What did I miss?'];

  const FRAMEWORKS_OF_THE_DAY = [
    {
      name: 'PDSA cycle',
      meaning: 'Rapid quality-improvement loop: plan, do, study, act.',
      whenToUse: 'When you need to test and refine an intervention quickly.',
      mockOralUse: 'State one small test, measurable outcome, and next-cycle adjustment.',
      commonMistake: 'Launching a full program before piloting and feedback.'
    },
    {
      name: 'RE-AIM',
      meaning: 'Framework for Reach, Effectiveness, Adoption, Implementation, and Maintenance.',
      whenToUse: 'When judging whether a program can scale and sustain impact.',
      mockOralUse: 'Briefly walk through each RE-AIM domain to justify your recommendation.',
      commonMistake: 'Only discussing effectiveness while ignoring implementation feasibility.'
    },
    {
      name: 'Health Equity Impact Assessment (HEIA)',
      meaning: 'Structured check for differential effects across populations.',
      whenToUse: 'When policies may create or worsen inequities.',
      mockOralUse: 'Identify who may be disproportionately harmed and one mitigation.',
      commonMistake: 'Naming equity as a value without operational mitigation steps.'
    },
    {
      name: 'Incident Command System (ICS)',
      meaning: 'Standardized emergency response structure with clear roles.',
      whenToUse: 'In acute incidents requiring coordinated multi-partner actions.',
      mockOralUse: 'Define command, operations, planning, and your first operational priorities.',
      commonMistake: 'Skipping role clarity and causing communication duplication.'
    },
    {
      name: 'One Health',
      meaning: 'Integrated human-animal-environment approach to risk management.',
      whenToUse: 'For zoonotic, food, or environmental health threats.',
      mockOralUse: 'Name key sectors and one shared surveillance or control action.',
      commonMistake: 'Keeping response siloed inside one sector.'
    },
    {
      name: 'Precautionary principle',
      meaning: 'Act protectively when credible risk exists despite uncertainty.',
      whenToUse: 'When delayed action could cause significant preventable harm.',
      mockOralUse: 'Justify proportionate early action while you collect better evidence.',
      commonMistake: 'Treating uncertainty as a reason for inaction.'
    },
    {
      name: 'Risk communication (CERC style)',
      meaning: 'Crisis communication emphasizing empathy, clarity, and action guidance.',
      whenToUse: 'When trust and behavior change are critical during uncertainty.',
      mockOralUse: 'Give one key message, one uncertainty statement, and one call to action.',
      commonMistake: 'Overloading with technical detail and unclear next steps.'
    },
    {
      name: 'Logic model',
      meaning: 'Map of inputs, activities, outputs, and outcomes.',
      whenToUse: 'When designing or evaluating a policy or program option.',
      mockOralUse: 'Describe the intervention pathway and where to monitor progress.',
      commonMistake: 'Confusing activities with meaningful outcomes.'
    }
  ];

  const STATION_BUILDER_CONFIG = {
    topics: Object.values(TOPIC_META),
    formats: [
      { id: 'briefing', label: 'Medical Officer briefing to leadership' },
      { id: 'media', label: 'Media communication and Q&A' },
      { id: 'stakeholder', label: 'Stakeholder negotiation conversation' },
      { id: 'clinical-ops', label: 'Clinical-public health interface decision' }
    ],
    settings: [
      { id: 'urban', label: 'Large urban public health unit' },
      { id: 'rural', label: 'Rural or remote regional setting' },
      { id: 'provincial', label: 'Provincial policy and implementation context' },
      { id: 'multi-jurisdiction', label: 'Multi-jurisdiction coordination setting' }
    ],
    challenges: [
      { id: 'escalating-signal', label: 'Escalating risk signal with limited data' },
      { id: 'high-visibility', label: 'High-visibility decision under media pressure' },
      { id: 'equity-tradeoff', label: 'Equity and feasibility trade-off' },
      { id: 'partnership-friction', label: 'Partnership conflict and trust repair' }
    ],
    difficulties: [
      { id: 'core', label: 'Core', timeBox: '8-minute station style', complexityNote: 'single dominant issue' },
      { id: 'integrated', label: 'Integrated', timeBox: '8-minute station style', complexityNote: 'two linked pressures' },
      { id: 'stress-test', label: 'Stress test', timeBox: '8-minute station style', complexityNote: 'uncertainty + conflicting priorities' }
    ]
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildLauncherMap() {
    return GPT_LAUNCHERS.reduce((acc, launcher) => {
      acc[launcher.id] = launcher;
      return acc;
    }, {});
  }

  function getTopicForLauncher(launcher) {
    return TOPIC_META[launcher.topicColorKey] || TOPIC_META[launcher.topicId] || TOPIC_META.all;
  }

  function validateLauncherConfiguration() {
    const expectedCount = 9;
    if (GPT_LAUNCHERS.length !== expectedCount) {
      console.warn(`Expected ${expectedCount} launchers, found ${GPT_LAUNCHERS.length}.`);
    }

    GPT_LAUNCHERS.forEach((launcher) => {
      const topic = getTopicForLauncher(launcher);
      const hasCanonicalTitle = CANONICAL_LAUNCHER_TITLES.includes(launcher.title);
      if (!hasCanonicalTitle) {
        console.warn(`Non-canonical launcher title detected: ${launcher.title}`);
      }

      if (!launcher.iconPath.startsWith('assets/applied/icons/')) {
        console.warn(`Launcher icon path should be under assets/applied/icons/: ${launcher.iconPath}`);
      }

      if (launcher.iconPath !== topic.iconPath) {
        console.warn(`Launcher icon mismatch for ${launcher.id}. Expected ${topic.iconPath}.`);
      }
    });
  }

  function renderTopicTags(topicIds) {
    return topicIds
      .map((topicId) => {
        const topic = TOPIC_META[topicId];
        if (!topic) {
          return '';
        }
        return `<li class="topic-tag" style="--topic-color:${topic.color}">${escapeHtml(topic.label)}</li>`;
      })
      .join('');
  }

  function renderGptLaunchers() {
    const grid = document.getElementById('gpt-launcher-grid');
    if (!grid) {
      return;
    }

    grid.innerHTML = GPT_LAUNCHERS.map((launcher) => {
      const topic = getTopicForLauncher(launcher);
      const hasUrl = Boolean(launcher.url);
      const actionMarkup = hasUrl
        ? `<a class="gpt-launcher-card" href="${launcher.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(launcher.title)}">`
        : `<div class="gpt-launcher-card gpt-launcher-card-disabled" role="group" aria-label="${escapeHtml(launcher.title)} link coming soon">`;
      const actionCloseMarkup = hasUrl ? '</a>' : '</div>';

      return `
        <article class="gpt-launcher-item" data-topic-id="${escapeHtml(launcher.topicId)}" style="--topic-color:${topic.color}">
          ${actionMarkup}
            <img src="${launcher.iconPath}" alt="${escapeHtml(launcher.title)} icon" class="gpt-launcher-icon" loading="lazy" />
            <div class="gpt-launcher-copy">
              <span class="gpt-launcher-title">${escapeHtml(launcher.title)}</span>
              <p class="gpt-launcher-descriptor">${escapeHtml(launcher.descriptor)}</p>
              <span class="gpt-launcher-cta">${hasUrl ? 'Launch now ↗' : 'Link coming soon'}</span>
            </div>
          ${actionCloseMarkup}
        </article>
      `;
    }).join('');
  }

  function renderChallengeScenarios() {
    const list = document.getElementById('challenge-scenarios-list');
    if (!list) {
      return;
    }

    const launchersById = buildLauncherMap();

    list.innerHTML = CHALLENGE_SCENARIOS.map((scenario, index) => {
      const launcher = launchersById[scenario.recommendedGptId] || launchersById['gpt-all'];
      const recommendedTopic = TOPIC_META[launcher.topicId];

      return `
        <article class="challenge-card" data-expanded="false">
          <button type="button" class="challenge-toggle" aria-expanded="false">
            <span class="challenge-title">${index + 1}. ${escapeHtml(scenario.title)}</span>
            <span class="challenge-context">${escapeHtml(scenario.context)}</span>
            <span class="challenge-hover-preview">${escapeHtml(scenario.prompt)}</span>
          </button>
          <div class="challenge-details" hidden>
            <p><strong>Official topic label(s):</strong></p>
            <ul class="topic-tag-list">${renderTopicTags(scenario.topicIds)}</ul>
            <p><strong>Recommended GPT:</strong> <span class="recommended-gpt" style="--topic-color:${recommendedTopic.color}">${escapeHtml(launcher.title)}</span></p>
            <div class="challenge-prompt-block">
              <label for="challenge-prompt-${index}"><strong>Station prompt</strong></label>
              <textarea id="challenge-prompt-${index}" class="challenge-prompt" readonly>${escapeHtml(scenario.prompt)}</textarea>
            </div>
            <div class="challenge-actions">
              <button type="button" class="copy-prompt-btn" data-copy-target="challenge-prompt-${index}">Copy prompt</button>
              <span class="copy-status" aria-live="polite"></span>
              ${launcher.url ? `<a href="${launcher.url}" class="open-gpt-btn" target="_blank" rel="noopener noreferrer">Open Recommended GPT</a>` : '<button type="button" class="open-gpt-btn open-gpt-btn-disabled" disabled>Link coming soon</button>'}
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderExamTests() {
    const grid = document.getElementById('exam-tests-grid');
    if (!grid) {
      return;
    }

    grid.innerHTML = EXAM_TEST_ITEMS.map((item) => `
      <article class="applied-mini-card">
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.detail)}</p>
      </article>
    `).join('');
  }

  function renderHotTopics() {
    const grid = document.getElementById('hot-topics-grid');
    if (!grid) {
      return;
    }

    const labelToTopicKey = Object.values(TOPIC_META).reduce((acc, topic) => {
      acc[topic.label] = topic.id;
      return acc;
    }, {});

    grid.innerHTML = HOT_TOPICS.map((topic) => `
      <article class="applied-topic-card">
        <h4>${escapeHtml(topic.title)}</h4>
        <p class="topic-why"><strong>Why this matters:</strong> ${escapeHtml(topic.why)}</p>
        <p><strong>Mock oral angles:</strong></p>
        <ul>
          ${topic.angles.map((angle) => `<li>${escapeHtml(angle)}</li>`).join('')}
        </ul>
        <p><strong>Official topic label(s):</strong></p>
        <ul class="topic-tag-list">
          ${topic.labels.map((label) => {
            const topicKey = labelToTopicKey[label] || 'all';
            const color = TOPIC_META[topicKey].color;
            return `<li class="topic-tag" style="--topic-color:${color}">${escapeHtml(label)}</li>`;
          }).join('')}
        </ul>
      </article>
    `).join('');
  }

  function renderStudyPlanner() {
    const node = document.getElementById('study-planner-content');
    if (!node) {
      return;
    }

    node.innerHTML = `
      <div class="applied-card-grid">
        ${STUDY_PLAN.map((phase) => `
          <article class="applied-mini-card study-week-card">
            <h4>${escapeHtml(phase.week)}: ${escapeHtml(phase.focus)}</h4>
            <ul>
              ${phase.actions.map((action) => `<li>${escapeHtml(action)}</li>`).join('')}
            </ul>
          </article>
        `).join('')}
      </div>
      <article class="study-debrief-card">
        <h4>Short self-debrief after each station</h4>
        <ul>
          ${SELF_DEBRIEF_CHECKLIST.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
        <p><strong>Practice cue:</strong> end with one concise key message the examiner could repeat back.</p>
      </article>
    `;
  }

  function renderFrameworkOfTheDay() {
    const nameNode = document.getElementById('framework-day-name');
    const contentNode = document.getElementById('framework-day-content');
    if (!nameNode || !contentNode || !FRAMEWORKS_OF_THE_DAY.length) {
      return;
    }

    let index = Number(window.localStorage.getItem('appliedFrameworkIndex') || 0);
    if (!Number.isFinite(index) || index < 0) {
      index = 0;
    }

    function draw() {
      const framework = FRAMEWORKS_OF_THE_DAY[index % FRAMEWORKS_OF_THE_DAY.length];
      nameNode.textContent = framework.name;
      contentNode.innerHTML = `
        <p><strong>Meaning:</strong> ${escapeHtml(framework.meaning)}</p>
        <p><strong>When to use:</strong> ${escapeHtml(framework.whenToUse)}</p>
        <p><strong>Mock oral use:</strong> ${escapeHtml(framework.mockOralUse)}</p>
        <p><strong>Avoid:</strong> ${escapeHtml(framework.commonMistake)}</p>
      `;
    }

    draw();

    const nextButton = document.getElementById('framework-day-next');
    if (!nextButton) {
      return;
    }

    nextButton.addEventListener('click', () => {
      index = (index + 1) % FRAMEWORKS_OF_THE_DAY.length;
      window.localStorage.setItem('appliedFrameworkIndex', String(index));
      draw();
    });
  }

  function bindChallengeExpansion() {
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const toggle = target.closest('.challenge-toggle');
      if (!toggle) {
        return;
      }

      const card = toggle.closest('.challenge-card');
      const details = card ? card.querySelector('.challenge-details') : null;
      if (!card || !details || !(details instanceof HTMLElement)) {
        return;
      }

      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      card.dataset.expanded = String(!expanded);
      details.hidden = expanded;
    });
  }

  async function copyPromptFromTextarea(textareaId, statusNode) {
    const textarea = document.getElementById(textareaId);
    if (!textarea) {
      return;
    }

    const text = textarea.value;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
      }

      statusNode.textContent = 'Copied';
      window.setTimeout(() => {
        statusNode.textContent = '';
      }, 1600);
    } catch (error) {
      statusNode.textContent = 'Copy failed';
      window.setTimeout(() => {
        statusNode.textContent = '';
      }, 2000);
    }
  }

  function bindLauncherIconFallbacks() {
    const icons = Array.from(document.querySelectorAll('.gpt-launcher-icon'));
    icons.forEach((icon) => {
      icon.addEventListener('error', () => {
        icon.classList.add('gpt-launcher-icon-fallback');
        icon.alt = 'Topic icon unavailable';
      }, { once: true });
    });
  }

  function bindCopyActions() {
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.classList.contains('copy-prompt-btn')) {
        return;
      }

      const textareaId = target.dataset.copyTarget;
      if (!textareaId) {
        return;
      }

      const statusNode = target.parentElement ? target.parentElement.querySelector('.copy-status') : null;
      if (!statusNode || !(statusNode instanceof HTMLElement)) {
        return;
      }

      copyPromptFromTextarea(textareaId, statusNode);
    });
  }

  function populateBuilderSelect(selectId, options) {
    const select = document.getElementById(selectId);
    if (!select) {
      return;
    }

    select.innerHTML = options.map((option) => `<option value="${option.id}">${escapeHtml(option.label)}</option>`).join('');
  }

  function findBuilderOption(options, optionId) {
    return options.find((option) => option.id === optionId) || options[0];
  }

  function resolveRecommendedGptId(topicId) {
    const launcher = GPT_LAUNCHERS.find((item) => item.topicId === topicId);
    return launcher ? launcher.id : 'gpt-all';
  }

  function buildStationPrompt(topic, format, setting, challenge, difficulty) {
    return [
      'Act as a Royal College PHPM applied oral examiner and run one station only.',
      `Official topic area: ${topic.label}.`,
      `Station format: ${format.label}.`,
      `Scenario setting: ${setting.label}.`,
      `Challenge type: ${challenge.label}.`,
      `Difficulty: ${difficulty.label} (${difficulty.timeBox}; ${difficulty.complexityNote}).`,
      'Present a realistic Canadian public health scenario, then ask for a structured response with priorities, rationale, immediate actions, communication strategy, and feasible next steps.',
      'After the answer, provide concise examiner-style feedback with strengths, missed priorities, and one refinement for next attempt.'
    ].join(' ');
  }

  function updateBuilderOutput(launchersById) {
    const topicSelect = document.getElementById('builder-topic');
    const formatSelect = document.getElementById('builder-format');
    const settingSelect = document.getElementById('builder-setting');
    const challengeSelect = document.getElementById('builder-challenge');
    const difficultySelect = document.getElementById('builder-difficulty');

    if (!topicSelect || !formatSelect || !settingSelect || !challengeSelect || !difficultySelect) {
      return;
    }

    const topic = findBuilderOption(STATION_BUILDER_CONFIG.topics, topicSelect.value);
    const format = findBuilderOption(STATION_BUILDER_CONFIG.formats, formatSelect.value);
    const setting = findBuilderOption(STATION_BUILDER_CONFIG.settings, settingSelect.value);
    const challenge = findBuilderOption(STATION_BUILDER_CONFIG.challenges, challengeSelect.value);
    const difficulty = findBuilderOption(STATION_BUILDER_CONFIG.difficulties, difficultySelect.value);

    const prompt = buildStationPrompt(topic, format, setting, challenge, difficulty);
    const recommendedGptId = resolveRecommendedGptId(topic.id);
    const recommendedLauncher = launchersById[recommendedGptId] || launchersById['gpt-all'];
    const recommendedTopic = TOPIC_META[recommendedLauncher.topicId];

    const topicTagsList = document.getElementById('builder-topic-tags');
    const promptField = document.getElementById('builder-prompt');
    const recommendedGptNode = document.getElementById('builder-recommended-gpt');
    const openGptLink = document.getElementById('builder-open-gpt');

    if (topicTagsList) {
      topicTagsList.innerHTML = `<li class="topic-tag" style="--topic-color:${recommendedTopic.color}">${escapeHtml(topic.label)}</li>`;
    }

    if (promptField) {
      promptField.value = prompt;
    }

    if (recommendedGptNode) {
      recommendedGptNode.textContent = recommendedLauncher.title;
      recommendedGptNode.style.setProperty('--topic-color', recommendedTopic.color);
      recommendedGptNode.classList.add('recommended-gpt');
    }

    if (openGptLink) {
      const hasUrl = Boolean(recommendedLauncher.url);
      openGptLink.href = hasUrl ? recommendedLauncher.url : '#';
      openGptLink.setAttribute('aria-label', hasUrl ? `Open recommended GPT: ${recommendedLauncher.title}` : `${recommendedLauncher.title} link coming soon`);
      openGptLink.classList.toggle('open-gpt-btn-disabled', !hasUrl);
      if (hasUrl) {
        openGptLink.removeAttribute('aria-disabled');
        openGptLink.tabIndex = 0;
      } else {
        openGptLink.setAttribute('aria-disabled', 'true');
        openGptLink.tabIndex = -1;
      }
    }
  }

  function initializeStationBuilder() {
    const builderForm = document.getElementById('builder-form');
    if (!builderForm) {
      return;
    }

    populateBuilderSelect('builder-topic', STATION_BUILDER_CONFIG.topics);
    populateBuilderSelect('builder-format', STATION_BUILDER_CONFIG.formats);
    populateBuilderSelect('builder-setting', STATION_BUILDER_CONFIG.settings);
    populateBuilderSelect('builder-challenge', STATION_BUILDER_CONFIG.challenges);
    populateBuilderSelect('builder-difficulty', STATION_BUILDER_CONFIG.difficulties);

    const launchersById = buildLauncherMap();
    updateBuilderOutput(launchersById);

    builderForm.addEventListener('change', () => {
      updateBuilderOutput(launchersById);
    });
  }

  function bindSubTabs() {
    const tabs = Array.from(document.querySelectorAll('.applied-subtab'));
    const panels = Array.from(document.querySelectorAll('.applied-subtab-panel'));
    const homePanel = document.querySelector('[data-home-panel]');
    const homeControls = document.querySelector('[data-home-controls]');
    if (!tabs.length || !panels.length) {
      return;
    }

    function showHome() {
      tabs.forEach((item) => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
        item.tabIndex = 0;
      });

      panels.forEach((panel) => {
        panel.hidden = true;
        panel.setAttribute('aria-hidden', 'true');
      });

      if (homePanel instanceof HTMLElement) {
        homePanel.hidden = false;
        homePanel.setAttribute('aria-hidden', 'false');
      }

      if (homeControls instanceof HTMLElement) {
        homeControls.hidden = true;
      }
    }

    function activate(tab) {
      const targetId = tab.getAttribute('data-panel');
      if (!targetId) {
        showHome();
        return;
      }

      tabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });

      panels.forEach((panel) => {
        const show = panel.id === targetId;
        panel.hidden = !show;
        panel.setAttribute('aria-hidden', String(!show));
      });

      if (homePanel instanceof HTMLElement) {
        homePanel.hidden = true;
        homePanel.setAttribute('aria-hidden', 'true');
      }

      if (homeControls instanceof HTMLElement) {
        homeControls.hidden = false;
      }
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (event) => {
        const { key } = event;
        let nextIndex = index;

        if (key === 'ArrowRight') {
          nextIndex = (index + 1) % tabs.length;
        } else if (key === 'ArrowLeft') {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (key === 'Home') {
          nextIndex = 0;
        } else if (key === 'End') {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        const nextTab = tabs[nextIndex];
        activate(nextTab);
        nextTab.focus();
      });
    });

    const homeButtons = Array.from(document.querySelectorAll('[data-open-home]'));
    homeButtons.forEach((button) => {
      button.addEventListener('click', showHome);
    });

    const quickOpenButtons = Array.from(document.querySelectorAll('[data-open-panel]'));
    quickOpenButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const targetPanel = button.getAttribute('data-open-panel');
        const targetTab = tabs.find((tab) => tab.getAttribute('data-panel') === targetPanel);
        if (targetTab) {
          activate(targetTab);
          targetTab.focus();
        }
      });
    });

    showHome();
  }

  function initializeAppliedExamPage() {
    validateLauncherConfiguration();
    renderGptLaunchers();
    bindLauncherIconFallbacks();
    renderChallengeScenarios();
    renderExamTests();
    renderHotTopics();
    renderStudyPlanner();
    renderFrameworkOfTheDay();
    bindSubTabs();
    bindChallengeExpansion();
    bindCopyActions();
    initializeStationBuilder();
  }

  document.addEventListener('DOMContentLoaded', initializeAppliedExamPage);
})();
