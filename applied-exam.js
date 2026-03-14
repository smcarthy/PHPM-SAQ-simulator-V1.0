(function () {
  const TOPIC_META = {
    all: {
      id: 'all',
      label: 'All PHPM Topics and Hot Topics',
      icon: 'assets/applied/icons/all-phpm-topics-and-hot-topics.svg',
      color: '#2e5da8'
    },
    'health-promotion': {
      id: 'health-promotion',
      label: 'Health Promotion, Chronic Diseases, Mental Health and Substance Use',
      icon: 'assets/applied/icons/health-promotion-chronic-diseases-mental-health-and-substance-use.svg',
      color: '#8d2f87'
    },
    'communicable': {
      id: 'communicable',
      label: 'Communicable Diseases in Health Protection',
      icon: 'assets/applied/icons/communicable-diseases-in-health-protection.svg',
      color: '#b7472a'
    },
    'environment': {
      id: 'environment',
      label: 'Environmental, Occupational, Built Environment and Injuries',
      icon: 'assets/applied/icons/environmental-occupational-built-environment-and-injuries.svg',
      color: '#2e7d4f'
    },
    'systems': {
      id: 'systems',
      label: 'Health Systems, Policy, Law and Ethics',
      icon: 'assets/applied/icons/health-systems-policy-law-and-ethics.svg',
      color: '#196f84'
    },
    'methods': {
      id: 'methods',
      label: 'Population Health, Epidemiology, Methods and Basic Sciences',
      icon: 'assets/applied/icons/population-health-epidemiology-methods-and-basic-sciences.svg',
      color: '#4b4ea1'
    },
    'management': {
      id: 'management',
      label: 'Management, Leadership and Program Planning',
      icon: 'assets/applied/icons/management-leadership-and-program-planning.svg',
      color: '#bf7a13'
    },
    'emergency': {
      id: 'emergency',
      label: 'Emergency Preparedness and Response',
      icon: 'assets/applied/icons/emergency-preparedness-and-response.svg',
      color: '#a02929'
    },
    'maternal': {
      id: 'maternal',
      label: 'Maternal and Child Health',
      icon: 'assets/applied/icons/maternal-and-child-health.svg',
      color: '#c24e7b'
    }
  };

  const GPT_LAUNCHERS = [
    { id: 'gpt-all', topicId: 'all', title: 'All PHPM Topics and Hot Topics', descriptor: 'Broad mixed rehearsal across all domains.', url: 'https://chat.openai.com/' },
    { id: 'gpt-health-promotion', topicId: 'health-promotion', title: 'Health Promotion, Chronic Diseases, Mental Health and Substance Use', descriptor: 'Prevention and chronic disease oral station practice.', url: 'https://chat.openai.com/' },
    { id: 'gpt-communicable', topicId: 'communicable', title: 'Communicable Diseases in Health Protection', descriptor: 'Outbreak control and communicable disease response drills.', url: 'https://chat.openai.com/' },
    { id: 'gpt-environment', topicId: 'environment', title: 'Environmental, Occupational, Built Environment and Injuries', descriptor: 'Environmental hazards and injury prevention framing.', url: 'https://chat.openai.com/' },
    { id: 'gpt-systems', topicId: 'systems', title: 'Health Systems, Policy, Law and Ethics', descriptor: 'Policy, law and ethics argument practice.', url: 'https://chat.openai.com/' },
    { id: 'gpt-methods', topicId: 'methods', title: 'Population Health, Epidemiology, Methods and Basic Sciences', descriptor: 'Methods-heavy interpretation and epidemiology reasoning.', url: 'https://chat.openai.com/' },
    { id: 'gpt-management', topicId: 'management', title: 'Management, Leadership and Program Planning', descriptor: 'Leadership and implementation planning stations.', url: 'https://chat.openai.com/' },
    { id: 'gpt-emergency', topicId: 'emergency', title: 'Emergency Preparedness and Response', descriptor: 'Incident command and emergency planning simulation.', url: 'https://chat.openai.com/' },
    { id: 'gpt-maternal', topicId: 'maternal', title: 'Maternal and Child Health', descriptor: 'Maternal-child health interventions and policy drills.', url: 'https://chat.openai.com/' }
  ];

  const CHALLENGE_SCENARIOS = [
    { title: 'Long-term care respiratory outbreak escalation', context: 'Cases rise over 48 hours with staffing pressure.', topicIds: ['communicable', 'management'], recommendedGptId: 'gpt-communicable', prompt: 'You are the on-call PHPM resident. In 8 minutes, outline your first-hour response to an escalating respiratory outbreak in a long-term care home.' },
    { title: 'Measles exposure at a mass gathering', context: 'A confirmed case attended a multijurisdictional festival.', topicIds: ['communicable', 'systems'], recommendedGptId: 'gpt-communicable', prompt: 'Present a structured measles exposure response plan including contact prioritization, prophylaxis, legal authority, and communication.' },
    { title: 'Boil-water advisory in a remote community', context: 'Treatment failure with prolonged disruption risk.', topicIds: ['environment', 'emergency'], recommendedGptId: 'gpt-environment', prompt: 'Lead the public health response to a boil-water advisory, including culturally safe communication, risk mitigation, and coordination.' },
    { title: 'Heat wave mortality prevention plan', context: 'Five-day extreme heat forecast above historical thresholds.', topicIds: ['environment', 'health-promotion'], recommendedGptId: 'gpt-environment', prompt: 'Develop a rapid heat response plan identifying priority populations, intervention triggers, and monitoring indicators.' },
    { title: 'Needle-sharing HIV cluster in an urban core', context: 'Cluster signal with housing instability concerns.', topicIds: ['health-promotion', 'systems'], recommendedGptId: 'gpt-health-promotion', prompt: 'Propose a 30-day action plan for a suspected HIV cluster, balancing rapid intervention, stigma reduction, and partnerships.' },
    { title: 'School refusal of routine immunization campaign', context: 'Coordinated refusal and misinformation spread.', topicIds: ['communicable', 'health-promotion'], recommendedGptId: 'gpt-communicable', prompt: 'Manage declining school immunization uptake with a strategy on communication, service support, and monitoring metrics.' },
    { title: 'Opioid overdose spike after toxic supply alert', context: 'ED and EMS overdose demand doubled in one week.', topicIds: ['health-promotion', 'emergency'], recommendedGptId: 'gpt-emergency', prompt: 'Design an urgent overdose response plan with command structure, same-day harm reduction actions, and executive briefing points.' },
    { title: 'Public backlash to TB contact investigation', context: 'Confidentiality and stigma concerns are escalating.', topicIds: ['communicable', 'systems'], recommendedGptId: 'gpt-systems', prompt: 'Defend a TB contact investigation plan protecting confidentiality, supporting affected people, and preserving epidemiologic effectiveness.' },
    { title: 'Municipal council debate on supervised consumption expansion', context: 'Urgent recommendation needed amid polarized input.', topicIds: ['systems', 'health-promotion'], recommendedGptId: 'gpt-systems', prompt: 'Advise council on service expansion, addressing evidence, political concerns, trade-offs, and implementation safeguards.' },
    { title: 'Foodborne outbreak linked to multiple restaurants', context: 'Possible common supplier across municipalities.', topicIds: ['communicable', 'methods'], recommendedGptId: 'gpt-communicable', prompt: 'Manage a multi-site foodborne outbreak with case definition refinement, traceback priorities, and advisory trigger points.' },
    { title: 'Prenatal smoking cessation program evaluation', context: 'Funding renewal depends on defensible evaluation design.', topicIds: ['maternal', 'methods', 'management'], recommendedGptId: 'gpt-maternal', prompt: 'Design a pragmatic evaluation plan with logic model elements, feasible indicators, data sources, equity considerations, and reporting cadence.' }
  ];

  const STATION_BUILDER_CONFIG = {
    topics: Object.values(TOPIC_META).map((topic) => ({ id: topic.id, label: topic.label })),
    formats: [
      { id: 'rapid-briefing', label: 'Rapid response briefing' },
      { id: 'media-briefing', label: 'Media and public messaging' },
      { id: 'stakeholder-advice', label: 'Stakeholder decision advice' },
      { id: 'evaluation-design', label: 'Program evaluation design' }
    ],
    settings: [
      { id: 'regional-health-unit', label: 'Regional public health unit' },
      { id: 'municipal-operations-centre', label: 'Municipal emergency operations centre' },
      { id: 'community-partner-table', label: 'Community partner coordination table' },
      { id: 'provincial-briefing', label: 'Provincial briefing environment' }
    ],
    challenges: [
      { id: 'escalating-signal', label: 'Escalating risk signal with limited data' },
      { id: 'public-trust-pressure', label: 'Public trust pressure and misinformation' },
      { id: 'equity-implementation-gap', label: 'Equity-sensitive implementation gap' },
      { id: 'resource-constraint', label: 'Resource and staffing constraints' }
    ],
    difficulties: [
      { id: 'core', label: 'Core', timeBox: '8 minutes', complexityNote: 'focus on first principles and immediate actions' },
      { id: 'advanced', label: 'Advanced', timeBox: '10 minutes', complexityNote: 'include explicit trade-offs and legal/ethical considerations' },
      { id: 'stretch', label: 'Stretch', timeBox: '12 minutes', complexityNote: 'address uncertainty and interjurisdictional escalation' }
    ]
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function buildLauncherMap() {
    return GPT_LAUNCHERS.reduce((acc, launcher) => {
      acc[launcher.id] = launcher;
      return acc;
    }, {});
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
      const topic = TOPIC_META[launcher.topicId];
      return `
        <article class="gpt-launcher-item" style="--topic-color:${topic.color}">
          <a class="gpt-launcher-card" href="${launcher.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(launcher.title)}">
            <img src="${topic.icon}" alt="${escapeHtml(launcher.title)} icon" class="gpt-launcher-icon" loading="lazy" />
            <span class="gpt-launcher-title">${escapeHtml(launcher.title)}</span>
          </a>
          <p class="gpt-launcher-descriptor">${escapeHtml(launcher.descriptor)}</p>
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
              <a href="${launcher.url}" class="open-gpt-btn" target="_blank" rel="noopener noreferrer">Open GPT</a>
            </div>
          </div>
        </article>
      `;
    }).join('');
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
      'Present a realistic Canadian public health scenario, then ask for a structured response with priorities, rationale, immediate actions, and communication to partners.',
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
      openGptLink.href = recommendedLauncher.url;
      openGptLink.setAttribute('aria-label', `Open recommended GPT: ${recommendedLauncher.title}`);
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
    if (!tabs.length || !panels.length) {
      return;
    }

    function activate(tab) {
      const targetId = tab.getAttribute('data-panel');
      tabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });

      panels.forEach((panel) => {
        const show = panel.id === targetId;
        panel.hidden = !show;
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activate(tab));
    });

    activate(tabs[0]);
  }

  function initializeAppliedExamPage() {
    renderGptLaunchers();
    renderChallengeScenarios();
    bindSubTabs();
    bindChallengeExpansion();
    bindCopyActions();
    initializeStationBuilder();
  }

  document.addEventListener('DOMContentLoaded', initializeAppliedExamPage);
})();
