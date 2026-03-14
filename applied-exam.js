(function () {
  const GPT_LAUNCHERS = [
    {
      id: 'gpt-outbreak-rapid-response',
      title: 'Outbreak Rapid Response',
      descriptor: 'Practice first-hour outbreak framing and immediate control actions.',
      url: 'https://chat.openai.com/'
    },
    {
      id: 'gpt-risk-communication',
      title: 'Risk Communication Coach',
      descriptor: 'Rehearse concise media and public messaging under uncertainty.',
      url: 'https://chat.openai.com/'
    },
    {
      id: 'gpt-policy-advisor',
      title: 'Policy Decision Advisor',
      descriptor: 'Stress-test options, trade-offs, and decision rationales quickly.',
      url: 'https://chat.openai.com/'
    },
    {
      id: 'gpt-health-equity',
      title: 'Health Equity Lens',
      descriptor: 'Apply equity-first reasoning to intervention planning.',
      url: 'https://chat.openai.com/'
    },
    {
      id: 'gpt-indigenous-health',
      title: 'Indigenous Health Considerations',
      descriptor: 'Integrate respectful, community-partnered public health approaches.',
      url: 'https://chat.openai.com/'
    },
    {
      id: 'gpt-program-evaluation',
      title: 'Program Evaluation Planner',
      descriptor: 'Build practical indicators, timelines, and evaluation methods.',
      url: 'https://chat.openai.com/'
    },
    {
      id: 'gpt-environmental-health',
      title: 'Environmental Health Briefing',
      descriptor: 'Structure hazard assessment and precautionary response plans.',
      url: 'https://chat.openai.com/'
    },
    {
      id: 'gpt-emergency-preparedness',
      title: 'Emergency Preparedness Drill',
      descriptor: 'Run command, coordination, and surge-capacity scenarios.',
      url: 'https://chat.openai.com/'
    },
    {
      id: 'gpt-ethics-governance',
      title: 'Ethics & Governance Support',
      descriptor: 'Practice defensible recommendations for contested decisions.',
      url: 'https://chat.openai.com/'
    }
  ];

  const CHALLENGE_SCENARIOS = [
    {
      title: 'Long-term care respiratory outbreak escalation',
      context: 'Cases are rising over 48 hours with staff shortages and anxious families.',
      topicLabels: ['Outbreak Management', 'Communicable Disease Control', 'Risk Communication'],
      recommendedGptId: 'gpt-outbreak-rapid-response',
      prompt: 'You are the on-call PHPM resident for a regional unit. In 8 minutes, outline your first-hour outbreak response plan for an escalating respiratory outbreak in a long-term care home, including immediate control measures, data needs, communication priorities, and decision thresholds for escalation.'
    },
    {
      title: 'Measles exposure at a mass gathering',
      context: 'A confirmed case attended a weekend festival with interprovincial attendees.',
      topicLabels: ['Vaccine-Preventable Diseases', 'Contact Management', 'Public Health Law'],
      recommendedGptId: 'gpt-outbreak-rapid-response',
      prompt: 'Act as examiner. Ask me to present a structured response to a measles exposure event after a mass gathering, including case/contact prioritization, post-exposure prophylaxis strategy, legal powers, and operational communication with partners.'
    },
    {
      title: 'Boil-water advisory in a remote community',
      context: 'A treatment failure has occurred with concerns about prolonged service disruption.',
      topicLabels: ['Environmental Health', 'Indigenous Health', 'Emergency Management'],
      recommendedGptId: 'gpt-indigenous-health',
      prompt: 'Provide a mock oral station where I must lead the public health response to a boil-water advisory in a remote community. Test me on immediate risk mitigation, culturally safe communication, interagency coordination, and short-term surveillance actions.'
    },
    {
      title: 'Heat wave mortality prevention plan',
      context: 'Forecasted temperatures exceed historical thresholds for five consecutive days.',
      topicLabels: ['Climate & Health', 'Health Equity', 'Emergency Preparedness'],
      recommendedGptId: 'gpt-environmental-health',
      prompt: 'Run a station on planning for an extreme heat event. Require me to identify priority populations, intervention triggers, municipal coordination, risk communication products, and outcome indicators for rapid monitoring.'
    },
    {
      title: 'Needle-sharing HIV cluster in an urban core',
      context: 'A cluster signal appears among people who use drugs with housing instability.',
      topicLabels: ['STBBI Control', 'Harm Reduction', 'Health Equity'],
      recommendedGptId: 'gpt-health-equity',
      prompt: 'Simulate an oral exam station where I must propose a 30-day action plan for a suspected HIV transmission cluster linked to needle sharing, balancing rapid interventions, stigma reduction, and partner engagement.'
    },
    {
      title: 'School refusal of routine immunization campaign',
      context: 'Several schools report coordinated parental refusal and misinformation spread.',
      topicLabels: ['Immunization Programs', 'Risk Communication', 'Program Planning'],
      recommendedGptId: 'gpt-risk-communication',
      prompt: 'Ask me to manage a station focused on declining school immunization uptake due to misinformation. Expect a clear strategy covering stakeholder mapping, communication tactics, clinical service supports, and monitoring metrics.'
    },
    {
      title: 'Opioid overdose spike after toxic supply alert',
      context: 'ED presentations and EMS calls have doubled in one week.',
      topicLabels: ['Substance-Related Harms', 'Emergency Response', 'Systems Coordination'],
      recommendedGptId: 'gpt-emergency-preparedness',
      prompt: 'Create a mock oral prompt requiring an urgent public health response to a sudden overdose spike, including command structure, same-day harm-reduction actions, data dashboard priorities, and executive briefing points.'
    },
    {
      title: 'Public backlash to tuberculosis contact investigation',
      context: 'Community concerns are escalating around confidentiality and stigma.',
      topicLabels: ['Tuberculosis Control', 'Ethics', 'Community Engagement'],
      recommendedGptId: 'gpt-ethics-governance',
      prompt: 'Present me with a TB contact investigation scenario where I must defend a plan that protects confidentiality, supports affected individuals, and maintains public trust while preserving epidemiologic effectiveness.'
    },
    {
      title: 'Municipal council debate on supervised consumption expansion',
      context: 'Council requests urgent recommendation with polarized public input.',
      topicLabels: ['Public Health Policy', 'Evidence Appraisal', 'Health Equity'],
      recommendedGptId: 'gpt-policy-advisor',
      prompt: 'Run a station where I advise municipal council on expanding supervised consumption services. Assess my ability to synthesize evidence, address political concerns, articulate trade-offs, and propose implementation safeguards.'
    },
    {
      title: 'Foodborne outbreak linked to multiple restaurants',
      context: 'Early reports suggest common supplier involvement across municipalities.',
      topicLabels: ['Food Safety', 'Outbreak Investigation', 'Interjurisdictional Coordination'],
      recommendedGptId: 'gpt-outbreak-rapid-response',
      prompt: 'Give me a station requiring management of a multi-restaurant foodborne outbreak investigation. Evaluate case definition refinement, traceback priorities, communication with inspection teams, and trigger points for public advisories.'
    },
    {
      title: 'Program evaluation of a prenatal smoking cessation initiative',
      context: 'Funding renewal depends on a practical and defensible evaluation framework.',
      topicLabels: ['Program Evaluation', 'Maternal-Child Health', 'Performance Measurement'],
      recommendedGptId: 'gpt-program-evaluation',
      prompt: 'Create an oral exam prompt where I must design an evaluation plan for a prenatal smoking cessation program, including logic model elements, feasible indicators, data sources, equity considerations, and reporting cadence.'
    }
  ];

  const STATION_BUILDER_CONFIG = {
    topics: [
      {
        id: 'outbreak-management',
        label: 'Outbreak Management',
        topicLabels: ['Outbreak Management', 'Communicable Disease Control'],
        recommendedGptByFormat: {
          'rapid-briefing': 'gpt-outbreak-rapid-response',
          'media-briefing': 'gpt-risk-communication',
          default: 'gpt-outbreak-rapid-response'
        }
      },
      {
        id: 'risk-communication',
        label: 'Risk Communication',
        topicLabels: ['Risk Communication', 'Public Messaging'],
        recommendedGptByFormat: {
          'media-briefing': 'gpt-risk-communication',
          default: 'gpt-risk-communication'
        }
      },
      {
        id: 'policy-governance',
        label: 'Public Health Policy & Governance',
        topicLabels: ['Public Health Policy', 'Ethics & Governance'],
        recommendedGptByFormat: {
          'stakeholder-advice': 'gpt-policy-advisor',
          default: 'gpt-ethics-governance'
        }
      },
      {
        id: 'health-equity',
        label: 'Health Equity',
        topicLabels: ['Health Equity', 'Priority Populations'],
        recommendedGptByFormat: {
          'stakeholder-advice': 'gpt-health-equity',
          default: 'gpt-health-equity'
        }
      },
      {
        id: 'environmental-health',
        label: 'Environmental Health',
        topicLabels: ['Environmental Health', 'Emergency Preparedness'],
        recommendedGptByFormat: {
          'rapid-briefing': 'gpt-environmental-health',
          default: 'gpt-environmental-health'
        }
      },
      {
        id: 'program-evaluation',
        label: 'Program Evaluation',
        topicLabels: ['Program Evaluation', 'Performance Measurement'],
        recommendedGptByFormat: {
          'evaluation-design': 'gpt-program-evaluation',
          default: 'gpt-program-evaluation'
        }
      }
    ],
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
      {
        id: 'core',
        label: 'Core',
        timeBox: '8 minutes',
        complexityNote: 'focus on first-principles structure and immediate actions'
      },
      {
        id: 'advanced',
        label: 'Advanced',
        timeBox: '10 minutes',
        complexityNote: 'include explicit trade-offs, legal/ethical considerations, and contingency triggers'
      },
      {
        id: 'stretch',
        label: 'Stretch',
        timeBox: '12 minutes',
        complexityNote: 'address uncertainty, interjurisdictional coordination, and adaptive escalation planning'
      }
    ]
  };


  function buildLauncherMap() {
    return GPT_LAUNCHERS.reduce((acc, launcher) => {
      acc[launcher.id] = launcher;
      return acc;
    }, {});
  }

  function renderGptLaunchers() {
    const grid = document.getElementById('gpt-launcher-grid');
    if (!grid) {
      return;
    }

    grid.innerHTML = GPT_LAUNCHERS.map((launcher) => {
      return `
        <article class="gpt-launcher-item">
          <a class="gpt-launcher-circle" href="${launcher.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${launcher.title}">
            <span>${launcher.title}</span>
          </a>
          <p class="gpt-launcher-descriptor">${launcher.descriptor}</p>
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
      const launcher = launchersById[scenario.recommendedGptId];
      const topicTags = scenario.topicLabels
        .map((label) => `<li class="topic-tag">${label}</li>`)
        .join('');
      const gptTitle = launcher ? launcher.title : 'TBD GPT';
      const gptUrl = launcher ? launcher.url : 'https://chat.openai.com/';

      return `
        <article class="challenge-card">
          <div class="challenge-card-header">
            <h4>${index + 1}. ${scenario.title}</h4>
            <p>${scenario.context}</p>
          </div>
          <div class="challenge-meta">
            <p><strong>Official topic label(s):</strong></p>
            <ul class="topic-tag-list">${topicTags}</ul>
            <p><strong>Recommended GPT:</strong> ${gptTitle}</p>
          </div>
          <div class="challenge-prompt-block">
            <label for="challenge-prompt-${index}"><strong>Station prompt</strong></label>
            <textarea id="challenge-prompt-${index}" class="challenge-prompt" readonly>${scenario.prompt}</textarea>
          </div>
          <div class="challenge-actions">
            <button type="button" class="copy-prompt-btn" data-copy-target="challenge-prompt-${index}">Copy prompt</button>
            <span class="copy-status" aria-live="polite"></span>
            <a href="${gptUrl}" class="open-gpt-btn" target="_blank" rel="noopener noreferrer">Open GPT</a>
          </div>
        </article>
      `;
    }).join('');
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

    select.innerHTML = options.map((option) => `<option value="${option.id}">${option.label}</option>`).join('');
  }

  function findBuilderOption(options, optionId) {
    return options.find((option) => option.id === optionId) || options[0];
  }

  function resolveRecommendedGptId(topic, format) {
    const formatSpecific = topic.recommendedGptByFormat[format.id];
    if (formatSpecific) {
      return formatSpecific;
    }

    return topic.recommendedGptByFormat.default || 'gpt-policy-advisor';
  }

  function buildStationPrompt(topic, format, setting, challenge, difficulty) {
    return [
      'Act as a Royal College PHPM applied oral examiner and run one station only.',
      `Official topic area: ${topic.label}.`,
      `Station format: ${format.label}.`,
      `Scenario setting: ${setting.label}.`,
      `Challenge type: ${challenge.label}.`,
      `Difficulty: ${difficulty.label} (${difficulty.timeBox}; ${difficulty.complexityNote}).`,
      'Instructions for the station: Present a realistic Canadian public health scenario, then ask me to provide a structured response with priorities, rationale, immediate actions, and how I would communicate decisions to partners.',
      'After my answer, provide concise examiner-style feedback with: (1) strengths, (2) missed priorities, (3) one high-yield refinement for the next attempt.'
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
    const recommendedGptId = resolveRecommendedGptId(topic, format);
    const recommendedLauncher = launchersById[recommendedGptId] || { title: 'OpenAI Chat', url: 'https://chat.openai.com/' };

    const topicTagsList = document.getElementById('builder-topic-tags');
    const promptField = document.getElementById('builder-prompt');
    const recommendedGptNode = document.getElementById('builder-recommended-gpt');
    const openGptLink = document.getElementById('builder-open-gpt');

    if (topicTagsList) {
      topicTagsList.innerHTML = topic.topicLabels.map((label) => `<li class="topic-tag">${label}</li>`).join('');
    }

    if (promptField) {
      promptField.value = prompt;
    }

    if (recommendedGptNode) {
      recommendedGptNode.textContent = recommendedLauncher.title;
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


  function initializeAppliedExamPage() {
    renderGptLaunchers();
    renderChallengeScenarios();
    bindCopyActions();
    initializeStationBuilder();
  }

  document.addEventListener('DOMContentLoaded', initializeAppliedExamPage);
})();
