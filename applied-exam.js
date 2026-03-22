(function () {
  const TOPIC_META = {
    all: {
      id: 'all',
      label: 'All PHPM Topics and Hot Topics',
      iconPath: 'assets/applied/icons/all-phpm-topics-and-hot-topics.png',
      color: '#d4af37'
    },
    'health-promotion': {
      id: 'health-promotion',
      label: 'Health Promotion, Chronic Diseases, Mental Health and Substance Use',
      iconPath: 'assets/applied/icons/health-promotion-chronic-diseases-mental-health-and-substance-use.png',
      color: '#f97316'
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
      color: '#16a34a'
    },
    systems: {
      id: 'systems',
      label: 'Health Systems, Policy, Law and Ethics',
      iconPath: 'assets/applied/icons/health-systems-health-systems-policy-law-and-ethics.png',
      color: '#c0c0c0'
    },
    methods: {
      id: 'methods',
      label: 'Population Health, Epidemiology, Methods and Basic Sciences',
      iconPath: 'assets/applied/icons/population-health-epidemiology-methods-and-basic-sciences.png',
      color: '#cd7f32'
    },
    management: {
      id: 'management',
      label: 'Management, Leadership and Program Planning',
      iconPath: 'assets/applied/icons/management-leadership-and-program-planning.png',
      color: '#000000'
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
      color: '#9333ea'
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
      descriptor: 'For PGY-5 ready to challenge the exam. This bot creates challenge scenarios that mix the other eight types of bots, and updated PHAC publications such as the Chief Public Health Officer (CPHO) reports.',
      url: GPT_URLS['gpt-1'],
      iconPath: TOPIC_META.all.iconPath,
      topicColorKey: 'all',
      topicId: 'all'
    },
    {
      id: 'gpt-health-promotion',
      title: 'Health Promotion, Chronic Diseases, Mental Health and Substance Use',
      descriptor: 'For PGY-3/4/5 who are currently on their Health Promotion block or wanting to improve their mock oral practice in Health Promotion and Chronic Disease Prevention.',
      url: GPT_URLS['gpt-2'],
      iconPath: TOPIC_META['health-promotion'].iconPath,
      topicColorKey: 'health-promotion',
      topicId: 'health-promotion'
    },
    {
      id: 'gpt-communicable',
      title: 'Communicable Diseases in Health Protection',
      descriptor: 'For PGY-3/4/5 who are currently on their Communicable Disease/Health Protection block or wanting to improve their mock oral practice in outbreak response, vaccination and infectious diseases.',
      url: GPT_URLS['gpt-3'],
      iconPath: TOPIC_META.communicable.iconPath,
      topicColorKey: 'communicable',
      topicId: 'communicable'
    },
    {
      id: 'gpt-environment',
      title: 'Environmental, Occupational, Built Environment and Injuries',
      descriptor: 'For PGY-3/4/5 who are currently on their Environmental Health/Occupational Health block or wanting to improve their mock oral practice in environmental health risk assessment, occupational health, one health, the built environment or injury prevention.',
      url: GPT_URLS['gpt-4'],
      iconPath: TOPIC_META.environment.iconPath,
      topicColorKey: 'environment',
      topicId: 'environment'
    },
    {
      id: 'gpt-systems',
      title: 'Health Systems, Policy, Law and Ethics',
      descriptor: 'For PGY-5 nearing the exam and PGY-2/3 in their academic year of training wanting to improve mock oral practice in Canadian health systems, health policy process, federal and provincial laws, and public health ethics.',
      url: GPT_URLS['gpt-5'],
      iconPath: TOPIC_META.systems.iconPath,
      topicColorKey: 'systems',
      topicId: 'systems'
    },
    {
      id: 'gpt-methods',
      title: 'Population Health, Epidemiology, Methods and Basic Sciences',
      descriptor: 'For PGY-5 nearing the exam and PGY-2/3 in their academic year of training wanting to improve mock oral practice in epidemiology, population health and the methods used in public health.',
      url: GPT_URLS['gpt-6'],
      iconPath: TOPIC_META.methods.iconPath,
      topicColorKey: 'methods',
      topicId: 'methods'
    },
    {
      id: 'gpt-management',
      title: 'Management, Leadership and Program Planning',
      descriptor: 'For PGY-4/5 currently on their Leadership and Management rotation, or wanting to improve their mock oral practice in leadership styles, conflict resolution, management, and program planning/evaluation.',
      url: GPT_URLS['gpt-7'],
      iconPath: TOPIC_META.management.iconPath,
      topicColorKey: 'management',
      topicId: 'management'
    },
    {
      id: 'gpt-emergency',
      title: 'Emergency Preparedness and Response',
      descriptor: 'For PGY-4/5 currently on their Leadership and Management rotation, or wanting to improve incidence management systems structure in mock oral practice.',
      url: GPT_URLS['gpt-8'],
      iconPath: TOPIC_META.emergency.iconPath,
      topicColorKey: 'emergency',
      topicId: 'emergency'
    },
    {
      id: 'gpt-maternal',
      title: 'Maternal and Child Health',
      descriptor: 'For PGY-3/4/5 who are currently on their Health Promotion block or wanting to improve their mock oral practice in maternal and child health.',
      url: GPT_URLS['gpt-9'],
      iconPath: TOPIC_META.maternal.iconPath,
      topicColorKey: 'maternal',
      topicId: 'maternal'
    }
  ];

  const CHALLENGE_SCENARIOS = [
    {
      title: 'Long-term care respiratory outbreak escalation',
      context: 'Cases rise over 48 hours with staffing pressure.',
      setting: 'Ontario long-term care home linked to an acute-care hospital and regional public health unit',
      residentRole: 'You are the on-call PHPM resident supporting outbreak management for the health unit.',
      stationFormat: 'non-role-play',
      challengeType: 'Escalating respiratory outbreak with staffing shortages, frail residents, and urgent operational decisions',
      topicIds: ['communicable', 'management'],
      recommendedGptId: 'gpt-communicable',
      promptFocus: 'Ask the resident to structure the first-hour response, outbreak control priorities, partner communication, and thresholds for escalation if the situation worsens.',
      promptNotes: [
        'Keep the station focused on decision-making, resident safety, infection prevention and control, staffing contingencies, and communication with facility leadership and families.',
        'Press the resident on immediate priorities, who must be notified, and how they would balance containment with continuity of care.'
      ]
    },
    {
      title: 'Measles exposure at a mass gathering',
      context: 'A confirmed case attended a multijurisdictional festival.',
      setting: 'Large Ontario festival involving multiple municipalities, event organizers, and provincial partners',
      residentRole: 'You are the PHPM resident advising the public health response lead immediately after the exposure is confirmed.',
      stationFormat: 'role-play',
      counterpartRole: 'Festival incident lead seeking immediate advice on next steps and public messaging',
      challengeType: 'High-profile communicable disease exposure with cross-jurisdiction coordination, contact prioritization, and public concern',
      topicIds: ['communicable', 'systems'],
      recommendedGptId: 'gpt-communicable',
      promptFocus: 'Ask the resident to prioritize exposure management, prophylaxis timelines, legal and operational issues, and communication across multiple jurisdictions and partners.',
      promptNotes: [
        'The role-play should feel like a pressured briefing with practical questions from the festival incident lead.',
        'Push the resident to explain who is highest priority, what can be done today, and how messaging should handle uncertainty without causing panic.'
      ]
    },
    {
      title: 'Boil-water advisory in a remote community',
      context: 'Treatment failure with prolonged disruption risk.',
      setting: 'Remote Ontario community facing prolonged drinking-water disruption and limited backup service capacity',
      residentRole: 'You are the PHPM resident supporting the regional Medical Officer of Health on the public health response.',
      stationFormat: 'role-play',
      counterpartRole: 'Community emergency leadership representative requesting a practical public health plan',
      challengeType: 'Environmental health threat requiring culturally safe communication, intersectoral coordination, and sustained risk mitigation',
      topicIds: ['environment', 'emergency'],
      recommendedGptId: 'gpt-environment',
      promptFocus: 'Ask the resident to address immediate risk mitigation, communication with the community, vulnerable groups, coordination with water and emergency partners, and planning if the disruption persists.',
      promptNotes: [
        'Keep the station higher-order and focused on safe, feasible public health actions rather than technical engineering detail.',
        'Expect the resident to address culturally safe engagement, practical access to safe water, and coordination across local and regional partners.'
      ]
    },
    {
      title: 'Heat wave mortality prevention plan',
      context: 'Five-day extreme heat forecast above historical thresholds.',
      setting: 'Urban Ontario public health unit preparing for a multi-day extreme heat event',
      residentRole: 'You are the PHPM resident briefing senior public health leadership on the heat response approach.',
      stationFormat: 'non-role-play',
      challengeType: 'Extreme heat event requiring a Heat Alert Response System, vulnerable population protection, and intersectoral implementation',
      topicIds: ['environment', 'health-promotion'],
      recommendedGptId: 'gpt-environment',
      promptFocus: 'Ask the resident to develop a Heat Alert Response System with activation triggers, priority populations, partner actions, risk communication, and monitoring indicators.',
      promptNotes: [
        'Use the exact phrase Heat Alert Response System in the station framing and questions.',
        'Test practical decision-making about trigger thresholds, outreach, cooling supports, and how to monitor whether interventions are working.'
      ]
    },
    {
      title: 'Needle-sharing HIV cluster in an urban core',
      context: 'Cluster signal with housing instability concerns.',
      setting: 'Urban Ontario core with intersecting HIV risk, homelessness, substance use, and strained outreach services',
      residentRole: 'You are the PHPM resident presenting an urgent response approach to senior public health leadership.',
      stationFormat: 'role-play',
      counterpartRole: 'Medical Officer of Health asking for a defensible 30-day action plan',
      challengeType: 'Suspected HIV cluster with stigma risk, inequitable access to care, and pressure for rapid action without overreach',
      topicIds: ['health-promotion', 'systems'],
      recommendedGptId: 'gpt-health-promotion',
      promptFocus: 'Ask the resident to propose a 30-day action plan covering case investigation priorities, harm reduction, community partnership, stigma-sensitive communication, and early indicators of success.',
      promptNotes: [
        'Keep the station decision-oriented and avoid trivia-heavy HIV management detail.',
        'Push the resident on partnership choices, equity, and how to move quickly while maintaining trust.'
      ]
    },
    {
      title: 'School refusal of routine immunization campaign',
      context: 'Coordinated refusal and misinformation spread.',
      setting: 'Ontario school system with organized parental resistance and widening misinformation online',
      residentRole: 'You are the PHPM resident advising the health unit on how to respond to falling uptake.',
      stationFormat: 'non-role-play',
      challengeType: 'Immunization program pressure involving misinformation, service access barriers, and polarized stakeholder reactions',
      topicIds: ['communicable', 'health-promotion'],
      recommendedGptId: 'gpt-communicable',
      promptFocus: 'Ask the resident to manage declining school immunization uptake through communication strategy, service redesign, legal and policy considerations, and practical monitoring metrics.',
      promptNotes: [
        'Focus on higher-order communication and program strategy rather than detailed vaccine schedules.',
        'Expect the resident to balance trust-building, misinformation response, and operational service delivery.'
      ]
    },
    {
      title: 'Opioid overdose spike after toxic supply alert',
      context: 'ED and EMS overdose demand doubled in one week.',
      setting: 'Ontario municipality facing a sudden overdose surge across emergency, hospital, and community settings',
      residentRole: 'You are the PHPM resident briefing leadership during an acute overdose emergency.',
      stationFormat: 'non-role-play',
      challengeType: 'Acute toxic drug emergency requiring activation of an Incident Management System (IMS), rapid harm reduction actions, and executive-level communication',
      topicIds: ['health-promotion', 'emergency'],
      recommendedGptId: 'gpt-emergency',
      promptFocus: 'Ask the resident to activate or work within an Incident Management System (IMS) structure, identify same-day priorities, coordinate with partners, and brief leadership on immediate and next-step actions.',
      promptNotes: [
        'Explicitly state in the station that the resident is expected to activate or operate within an Incident Management System (IMS) structure.',
        'Press for command structure, operational roles, same-day harm reduction measures, public communication, and criteria for escalating or adapting the response.'
      ]
    },
    {
      title: 'Public backlash to TB contact investigation',
      context: 'Confidentiality and stigma concerns are escalating.',
      setting: 'Urban public health unit managing a sensitive TB contact investigation with growing media and community scrutiny',
      residentRole: 'You are the PHPM resident supporting the TB response and preparing for a difficult external conversation.',
      stationFormat: 'role-play',
      counterpartRole: 'Community spokesperson challenging the fairness and confidentiality of the investigation',
      challengeType: 'Communicable disease control under stigma, confidentiality pressure, and public distrust',
      topicIds: ['communicable', 'systems'],
      recommendedGptId: 'gpt-systems',
      promptFocus: 'Ask the resident to defend the investigation plan, explain confidentiality protections, address stigma and trust, and preserve epidemiologic effectiveness.',
      promptNotes: [
        'Use the role-play to test communication under pressure rather than memorized TB facts.',
        'Expect the resident to stay calm, empathetic, and legally and ethically grounded while maintaining public health effectiveness.'
      ]
    },
    {
      title: 'Municipal council debate on supervised consumption expansion',
      context: 'Urgent recommendation needed amid polarized input.',
      setting: 'Municipal council chamber considering expansion of supervised consumption services in a politically divided community',
      residentRole: 'You are the PHPM resident presenting a recommendation on service expansion.',
      stationFormat: 'role-play',
      counterpartRole: 'Municipal council chair asking skeptical and politically charged follow-up questions',
      challengeType: 'Politically sensitive service expansion decision with competing evidence claims, community pressure, and implementation trade-offs',
      topicIds: ['systems', 'health-promotion'],
      recommendedGptId: 'gpt-systems',
      promptFocus: 'Ask the resident to advise council on whether and how to expand services, address evidence and trade-offs, anticipate opposition, and outline implementation safeguards.',
      promptNotes: [
        'The role-play should probe policy judgment, political navigation, and clear communication to elected leaders.',
        'Keep the station higher-order and decision-oriented, not a debate over isolated statistics.'
      ]
    },
    {
      title: 'Foodborne outbreak linked to multiple restaurants',
      context: 'Possible common supplier across municipalities.',
      setting: 'Multi-municipality Ontario foodborne outbreak investigation involving local public health units and food inspection partners',
      residentRole: 'You are the PHPM resident helping coordinate outbreak investigation priorities.',
      stationFormat: 'non-role-play',
      challengeType: 'Multi-site outbreak investigation with evolving epidemiology, traceback complexity, and cross-jurisdiction coordination',
      topicIds: ['communicable', 'methods'],
      recommendedGptId: 'gpt-communicable',
      promptFocus: 'Ask the resident to manage the investigation through case definition refinement, analytic and environmental priorities, traceback decisions, public communication, and escalation thresholds.',
      promptNotes: [
        'Keep questions focused on investigation strategy, coordination, and decision points rather than obscure microbiology trivia.',
        'Expect clear reasoning about evidence quality, uncertainty, and when to act before full confirmation.'
      ]
    },
    {
      title: 'Prenatal smoking cessation program evaluation',
      context: 'Funding renewal depends on defensible evaluation design.',
      setting: 'Regional maternal-child health program facing a near-term funding renewal decision',
      residentRole: 'You are the PHPM resident tasked with designing an evaluation approach for leadership.',
      stationFormat: 'non-role-play',
      challengeType: 'Program evaluation under funding pressure, feasibility constraints, and equity expectations',
      topicIds: ['maternal', 'methods', 'management'],
      recommendedGptId: 'gpt-maternal',
      promptFocus: 'Ask the resident to design a pragmatic evaluation plan with logic model elements, feasible indicators, data sources, equity considerations, and a reporting cadence that can inform funding renewal.',
      promptNotes: [
        'Test evaluation reasoning, feasibility, and use of evidence for decisions rather than academic perfectionism.',
        'Encourage discussion of how to produce a defensible evaluation plan within real-world program constraints.'
      ]
    },
    {
      title: 'Tick-borne disease expansion and One Health response',
      context: 'A rural-regional health unit is seeing rising tick submissions, expanding habitat, and public concern that multiple tick-borne infections now threaten residents.',
      setting: 'Rural or mixed rural-urban Ontario public health unit',
      residentRole: 'You are the PHPM resident briefing the Medical Officer of Health and senior leadership on a coordinated One Health response.',
      stationFormat: 'non-role-play',
      challengeType: 'Emerging zoonotic and environmental health risk with uncertain surveillance, media pressure, and multi-sector coordination needs',
      topicIds: ['environment', 'communicable'],
      recommendedGptId: 'gpt-environment',
      promptFocus: 'Frame this explicitly as a One Health station and ask the resident to address surveillance, prevention, risk communication, partner coordination, and practical next steps for four tick-borne illnesses of concern that can be transmitted to humans in the jurisdiction.',
      promptNotes: [
        'Include likely partners such as veterinary or public animal health, wildlife and environmental partners, municipal or regional partners, clinical care, and laboratory or public health partners.',
        'Keep the station higher-order, decision-oriented, and focused on One Health coordination under uncertainty rather than trivia about individual pathogens.'
      ]
    }
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

  const TODAY_CHALLENGES = CHALLENGE_SCENARIOS.slice(0, 6);

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


  function getLauncherCardStyles(topic) {
    const darkTopicIds = new Set(['management']);
    const isDark = darkTopicIds.has(topic.id);
    return [
      `--topic-color:${topic.color}`,
      `--topic-text:${isDark ? '#f8fafc' : '#122033'}`,
      `--topic-muted:${isDark ? 'rgba(248, 250, 252, 0.92)' : 'rgba(18, 32, 51, 0.78)'}`,
      `--topic-button-text:${isDark ? '#ffffff' : '#122033'}`,
      `--topic-button-bg:${isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.9)'}`,
      `--topic-button-border:${isDark ? 'rgba(255, 255, 255, 0.32)' : 'rgba(18, 32, 51, 0.1)'}`
    ].join(';');
  }

  function renderGptLaunchers() {
    const grid = document.getElementById('gpt-launcher-grid');
    if (!grid) {
      return;
    }

    grid.innerHTML = GPT_LAUNCHERS.map((launcher) => {
      const topic = getTopicForLauncher(launcher);
      const hasUrl = Boolean(launcher.url);

      return `
        <article class="applied-shared-card gpt-launcher-item" data-topic-id="${escapeHtml(launcher.topicId)}" style="${getLauncherCardStyles(topic)}">
          <div class="gpt-launcher-top">
            <span class="gpt-launcher-icon-block" aria-hidden="true">
              <img src="${launcher.iconPath}" alt="${escapeHtml(launcher.title)} icon" class="gpt-launcher-icon" loading="lazy" />
            </span>
            <div class="gpt-launcher-copy">
              <h4 class="gpt-launcher-title">${escapeHtml(launcher.title)}</h4>
              <p class="gpt-launcher-descriptor">${escapeHtml(launcher.descriptor)}</p>
            </div>
          </div>
          <div class="gpt-launcher-footer">
            ${hasUrl ? `<a href="${launcher.url}" class="open-gpt-btn launch-now-btn" target="_blank" rel="noopener noreferrer">Launch Now ↗</a>` : '<button type="button" class="open-gpt-btn open-gpt-btn-disabled launch-now-btn" disabled>Link coming soon</button>'}
          </div>
        </article>
      `;
    }).join('');
  }


  function getTopicLabels(topicIds) {
    return topicIds.map((topicId) => TOPIC_META[topicId]?.label).filter(Boolean);
  }

  function getScenarioPromptPreview(scenario) {
    const rolePlayLine = scenario.stationFormat === 'role-play'
      ? `Role-play with ${scenario.counterpartRole}.`
      : 'Non-role-play applied oral station.';

    return `${scenario.setting}. ${rolePlayLine} ${scenario.challengeType}.`;
  }

  function buildChallengeScenarioPrompt(scenario) {
    const lines = [
      'Act as a Royal College PHPM applied oral examiner and run one mock oral station only.',
      'This is a Royal College-style PHPM applied mock oral station, not an SAQ.',
      'Station duration: 15 minutes.',
      'Ask 4 to 5 mock oral questions sequentially, one at a time.',
      'Do not give the answer immediately.',
      'Let the resident respond first to each question.',
      'After the station is complete, provide concise examiner-style feedback and a model excellent answer.',
      '',
      `Scenario title: ${scenario.title}`,
      `Setting/location: ${scenario.setting}`,
      `Resident role: ${scenario.residentRole}`,
      `Station format: ${scenario.stationFormat === 'role-play' ? 'Role-play' : 'Non-role-play'}`
    ];

    if (scenario.counterpartRole) {
      lines.push(`Role-play counterpart: ${scenario.counterpartRole}`);
    }

    lines.push(
      `Scenario context: ${scenario.context}`,
      `Challenge: ${scenario.challengeType}`,
      `Official topic area(s): ${getTopicLabels(scenario.topicIds).join('; ')}`,
      `Station focus: ${scenario.promptFocus}`
    );

    scenario.promptNotes.forEach((note, index) => {
      lines.push(`Instruction ${index + 1}: ${note}`);
    });

    lines.push('', 'Begin the station now.');

    return lines.join('\n');
  }

  function renderScenarioMetaRows(scenario) {
    const rows = [
      ['Setting', scenario.setting],
      ['Resident role', scenario.residentRole],
      ['Station format', scenario.stationFormat === 'role-play' ? 'Role-play' : 'Non-role-play']
    ];

    if (scenario.counterpartRole) {
      rows.push(['Role-play counterpart', scenario.counterpartRole]);
    }

    rows.push(['Challenge', scenario.challengeType]);

    return rows.map(([label, value]) => `
      <div class="challenge-meta-row">
        <dt>${escapeHtml(label)}</dt>
        <dd>${escapeHtml(value)}</dd>
      </div>
    `).join('');
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
      const stationPrompt = buildChallengeScenarioPrompt(scenario);
      const previewPrompt = getScenarioPromptPreview(scenario);

      return `
        <details class="applied-mini-card applied-shared-card applied-exam-test-card challenge-card challenge-scenario-card">
          <summary class="challenge-toggle">
            <span class="challenge-title">${index + 1}. ${escapeHtml(scenario.title)}</span>
            <span class="challenge-context">${escapeHtml(scenario.context)}</span>
            <span class="challenge-hover-preview">${escapeHtml(previewPrompt)}</span>
          </summary>
          <div class="challenge-details">
            <p><strong>Official topic label(s):</strong></p>
            <ul class="topic-tag-list">${renderTopicTags(scenario.topicIds)}</ul>
            <p><strong>Recommended GPT:</strong> <span class="recommended-gpt" style="--topic-color:${recommendedTopic.color}">${escapeHtml(launcher.title)}</span></p>
            <dl class="challenge-meta-list">
              ${renderScenarioMetaRows(scenario)}
            </dl>
            <div class="challenge-prompt-block">
              <label for="challenge-prompt-${index}">Station prompt</label>
              <textarea id="challenge-prompt-${index}" class="challenge-prompt" readonly>${escapeHtml(stationPrompt)}</textarea>
            </div>
            <div class="challenge-actions">
              <button type="button" class="copy-prompt-btn" data-copy-target="challenge-prompt-${index}">Copy prompt</button>
              <span class="copy-status" aria-live="polite"></span>
              ${launcher.url ? `<a href="${launcher.url}" class="open-gpt-btn" target="_blank" rel="noopener noreferrer">Open Recommended GPT</a>` : '<button type="button" class="open-gpt-btn open-gpt-btn-disabled" disabled>Link coming soon</button>'}
            </div>
          </div>
        </details>
      `;
    }).join('');
  }

  function renderExamTests() {}

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
      <details class="applied-topic-card hot-topic-card">
        <summary class="hot-topic-summary">
          <h4>${escapeHtml(topic.title)}</h4>
          <p class="topic-why"><strong>Why this matters:</strong> ${escapeHtml(topic.why)}</p>
        </summary>
        <div class="hot-topic-details">
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
        </div>
      </details>
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

  function autoSizeTextarea(textarea) {
    if (!(textarea instanceof HTMLTextAreaElement)) {
      return;
    }

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  function autoSizeChallengePrompts() {
    document.querySelectorAll('.challenge-prompt').forEach((node) => {
      autoSizeTextarea(node);
    });
  }

  function animateSwap(container, renderContent) {
    if (!(container instanceof HTMLElement)) {
      renderContent();
      return;
    }

    container.classList.remove('panel-slide-in');
    void container.offsetWidth;
    renderContent();
    container.classList.add('panel-slide-in');
  }

  function renderTodayChallenge() {
    const titleNode = document.getElementById('today-challenge-title');
    const cardNode = titleNode ? titleNode.closest('.today-challenge-card') : null;
    if (!cardNode || !TODAY_CHALLENGES.length) {
      return;
    }

    const challengeNameNode = cardNode.querySelector('.today-challenge-name');
    const challengeContextNode = cardNode.querySelector('.today-challenge-context');
    const challengePromptNode = cardNode.querySelector('.today-challenge-prompt');
    const challengeButton = cardNode.querySelector('.today-challenge-next');
    const launchersById = buildLauncherMap();
    let index = Number(window.localStorage.getItem('appliedTodayChallengeIndex') || 0);
    if (!Number.isFinite(index) || index < 0) {
      index = 0;
    }

    function draw() {
      const challenge = TODAY_CHALLENGES[index % TODAY_CHALLENGES.length];
      const launcher = launchersById[challenge.recommendedGptId] || launchersById['gpt-all'];
      animateSwap(cardNode.querySelector('.today-challenge-body'), () => {
        if (challengeNameNode) {
          challengeNameNode.textContent = challenge.title;
        }
        if (challengeContextNode) {
          challengeContextNode.textContent = challenge.context;
        }
        if (challengePromptNode) {
          challengePromptNode.textContent = getScenarioPromptPreview(challenge);
        }
        if (challengeButton) {
          challengeButton.setAttribute('aria-label', `Show another challenge after ${challenge.title}`);
        }
        cardNode.dataset.challengeTarget = launcher ? launcher.id : 'gpt-all';
      });
    }

    draw();

    if (challengeButton instanceof HTMLElement) {
      challengeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        index = (index + 1) % TODAY_CHALLENGES.length;
        window.localStorage.setItem('appliedTodayChallengeIndex', String(index));
        draw();
      });
    }

    cardNode.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('.today-challenge-next')) {
        return;
      }
      const openPanelButton = cardNode.querySelector('[data-open-panel]');
      if (openPanelButton instanceof HTMLElement) {
        openPanelButton.click();
      }
    });
  }

  function renderFrameworkOfTheDay() {
    const nameNode = document.getElementById('framework-day-name');
    const contentNode = document.getElementById('framework-day-content');
    const cardNode = nameNode ? nameNode.closest('.framework-day-card') : null;
    if (!nameNode || !contentNode || !FRAMEWORKS_OF_THE_DAY.length) {
      return;
    }

    let index = Number(window.localStorage.getItem('appliedFrameworkIndex') || 0);
    if (!Number.isFinite(index) || index < 0) {
      index = 0;
    }

    function draw() {
      const framework = FRAMEWORKS_OF_THE_DAY[index % FRAMEWORKS_OF_THE_DAY.length];
      animateSwap(contentNode, () => {
        nameNode.textContent = framework.name;
        contentNode.innerHTML = `
          <p><strong>Meaning:</strong> ${escapeHtml(framework.meaning)}</p>
          <p><strong>When to use:</strong> ${escapeHtml(framework.whenToUse)}</p>
          <p><strong>Mock oral use:</strong> ${escapeHtml(framework.mockOralUse)}</p>
          <p><strong>Avoid:</strong> ${escapeHtml(framework.commonMistake)}</p>
        `;
      });
      if (cardNode instanceof HTMLElement) {
        cardNode.classList.add('is-featured');
      }
    }

    draw();

    const nextButton = document.getElementById('framework-day-next');
    if (!nextButton) {
      return;
    }

    function advanceFramework() {
      index = (index + 1) % FRAMEWORKS_OF_THE_DAY.length;
      window.localStorage.setItem('appliedFrameworkIndex', String(index));
      draw();
    }

    nextButton.addEventListener('click', (event) => {
      event.stopPropagation();
      advanceFramework();
    });

    if (cardNode instanceof HTMLElement) {
      cardNode.addEventListener('click', (event) => {
        const target = event.target;
        if (target instanceof HTMLElement && target.closest('.framework-day-next')) {
          return;
        }
        advanceFramework();
      });
    }
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
      autoSizeTextarea(promptField);
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
      return {};
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
    return { activate, tabs };
  }

  function bindAdviceQuickNav(subTabApi) {
    const quickNavButtons = Array.from(document.querySelectorAll('[data-guide-target]'));
    const adviceGuide = document.getElementById('advice-practical-guide');
    if (!quickNavButtons.length || !(adviceGuide instanceof HTMLElement) || !subTabApi || typeof subTabApi.activate !== 'function') {
      return;
    }

    const adviceTab = subTabApi.tabs.find((tab) => tab.getAttribute('data-panel') === 'panel-exam-tests');
    if (!adviceTab) {
      return;
    }

    quickNavButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-guide-target');
        if (!targetId) {
          return;
        }

        subTabApi.activate(adviceTab);
        adviceGuide.open = true;

        window.requestAnimationFrame(() => {
          const target = document.getElementById(targetId);
          if (!(target instanceof HTMLElement)) {
            return;
          }

          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const heading = target.querySelector('h4');
          if (heading instanceof HTMLElement) {
            heading.tabIndex = -1;
            heading.focus({ preventScroll: true });
          }
        });
      });
    });
  }

  function initializeAppliedExamPage() {
    validateLauncherConfiguration();
    renderGptLaunchers();
    bindLauncherIconFallbacks();
    renderChallengeScenarios();
    renderExamTests();
    renderHotTopics();
    renderStudyPlanner();
    renderTodayChallenge();
    renderFrameworkOfTheDay();
    const subTabApi = bindSubTabs();
    bindAdviceQuickNav(subTabApi);
    bindCopyActions();
    initializeStationBuilder();
    autoSizeChallengePrompts();
  }

  document.addEventListener('DOMContentLoaded', initializeAppliedExamPage);
})();
