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
  const embeddedQuestionBank = {
  "version": "2.0.0",
  "updated_at": "2026-02-28T12:00:00Z",
  "questions": [
    {
      "id": "Q1",
      "number": 1,
      "parts": [
        {
          "id": "Q1a",
          "prompt": "List FIVE steps in the progressive management approach to an underperforming employee.",
          "max_score": 5,
          "domain": "7",
          "response_type": "list",
          "list_count": 5,
          "rubric": [
            "Meet with the employee and/or supervisor to discuss the situation and gather facts.",
            "Clearly communicate performance expectations to the employee.",
            "Counsel the employee about performance gaps and ensure understanding of requirements.",
            "Identify any learning or coaching needs or personal issues contributing to poor performance.",
            "Address identified issues (e.g., training, employee assistance program).",
            "Set specific performance improvement objectives with specific time frames.",
            "Meet regularly with the employee/supervisor to monitor performance."
          ]
        },
        {
          "id": "Q1b",
          "prompt": "List FOUR steps in the progressive discipline of an underperforming employee.",
          "max_score": 2,
          "domain": "7",
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "Provide a verbal warning regarding unresolved poor performance.",
            "Provide a written warning regarding continued poor performance.",
            "Suspend the employee without pay for an escalating number of days.",
            "End employment if performance does not improve."
          ]
        }
      ],
      "title": "Legacy Practice Question Q1",
      "stem": ""
    },
    {
      "id": "Q2",
      "number": 2,
      "parts": [
        {
          "id": "Q2a",
          "prompt": "List THREE questions for a hepatitis A infected food handler that impact immunoprophylaxis decisions.",
          "max_score": 1.5,
          "domain": "3",
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "Was the food handler infectious while working?",
            "Does the food handler handle foods that are not cooked or handle food after it is cooked?",
            "Does the food handler have poor hygiene?",
            "Did the food handler have diarrhoea while working?"
          ]
        }
      ],
      "title": "Legacy Practice Question Q2",
      "stem": ""
    },
    {
      "id": "Q3",
      "number": 3,
      "parts": [
        {
          "id": "Q3a",
          "prompt": "List FOUR factors that may affect the quality of well water.",
          "max_score": 2,
          "domain": "4",
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "Depth of well (dug vs drilled).",
            "Amount of new water flowing into the area.",
            "Local land use activities (e.g., livestock, pesticides, gasoline storage).",
            "Meteorological factors (e.g., heavy rains).",
            "Natural quality of surrounding soil (e.g., elevated heavy metals).",
            "Surface water infiltration.",
            "Well and local hydrogeology (integrity of bedrock).",
            "Quality of well‑head construction (grouting/casing).",
            "Location/distance from sources of contamination (e.g., septic tank)."
          ]
        },
        {
          "id": "Q3b",
          "prompt": "If fecal coliforms are detected in well water, list TWO immediate recommendations you would give to the homeowner.",
          "max_score": 2,
          "domain": "4",
          "response_type": "list",
          "list_count": 2,
          "rubric": [
            "Stop using untreated well water for consumption (must have this point).",
            "Boil or disinfect the water before consuming.",
            "Investigate and correct well condition (e.g., disinfect with bleach and resample)."
          ]
        }
      ],
      "title": "Legacy Practice Question Q3",
      "stem": ""
    },
    {
      "id": "Q4",
      "number": 4,
      "parts": [
        {
          "id": "Q4a",
          "prompt": "List FOUR benefits of breastfeeding for the child's health.",
          "max_score": 2,
          "domain": "9",
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "Reduced rate of infections (otitis media, respiratory, gastrointestinal).",
            "Reduced incidence of atopic diseases.",
            "Prevention of certain chronic diseases (e.g., diabetes, obesity, Crohn’s disease).",
            "Prevention of cognitive development abnormalities.",
            "Enhanced mother–child bonding.",
            "Transfer of immunoglobulins from mother to child.",
            "Decreased risk of childhood leukemia, SIDS and necrotising enterocolitis.",
            "Provides optimal nutrition."
          ]
        },
        {
          "id": "Q4b",
          "prompt": "List TWO process indicators and TWO outcome indicators to evaluate a breastfeeding promotion and support program.",
          "max_score": 2,
          "domain": "7",
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "Process: number or proportion of staff trained to promote/support breastfeeding.",
            "Process: number or proportion of program participants.",
            "Process: duration of participation in the program.",
            "Process: number of service organisations favourable to breastfeeding (e.g., baby‑friendly hospitals).",
            "Outcome: participants’ knowledge/attitudes regarding benefits of breastfeeding.",
            "Outcome: staff knowledge/attitudes regarding importance of breastfeeding.",
            "Outcome: uptake of breastfeeding among participants (number/proportion).",
            "Outcome: duration of breastfeeding among participants (average, median)."
          ]
        }
      ],
      "title": "Legacy Practice Question Q4",
      "stem": ""
    },
    {
      "id": "Q5",
      "number": 5,
      "parts": [
        {
          "id": "Q5a",
          "prompt": "List TWO types of biases that can cause the healthy worker effect in a cohort study design.",
          "max_score": 2,
          "domain": "6",
          "response_type": "list",
          "list_count": 2,
          "rubric": [
            "Healthy hire effect: selection bias at hiring resulting in entry of healthier workers into the workforce.",
            "Healthy worker survivor effect: healthier workers are more likely to remain employed."
          ]
        }
      ],
      "title": "Legacy Practice Question Q5",
      "stem": ""
    },
    {
      "id": "Q6",
      "number": 6,
      "parts": [
        {
          "id": "Q6a",
          "prompt": "List the PRIMARY health concern directly associated with excessive dietary sodium intake.",
          "max_score": 0.5,
          "domain": "2",
          "response_type": "text",
          "rubric": [
            "Hypertension (other cardiovascular conditions are not acceptable)."
          ]
        },
        {
          "id": "Q6b",
          "prompt": "List THREE steps of a structured voluntary approach by industry to reach sodium reduction targets in processed foods.",
          "max_score": 3,
          "domain": "2",
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "Publication/establishment of sodium reduction targets for foods.",
            "Defined timelines for implementation.",
            "Mechanism for public commitment by industry to the targets.",
            "Plan for monitoring progress by an external body.",
            "Plan for independent evaluation of success with option for stronger regulatory action."
          ]
        },
        {
          "id": "Q6c",
          "prompt": "List THREE reasons why the food industry is slow to reduce the salt content in processed foods.",
          "max_score": 1.5,
          "domain": "2",
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "Sodium is a preservative important for food safety and hard to replicate.",
            "Sodium is inexpensive and reformulation is costly.",
            "Consumers prefer salty foods.",
            "Sodium reduction is voluntary; early adopters may lose competitive advantage.",
            "Sodium increases thirst, boosting beverage sales."
          ]
        }
      ],
      "title": "Legacy Practice Question Q6",
      "stem": ""
    },
    {
      "id": "Q7",
      "number": 7,
      "parts": [
        {
          "id": "Q7a",
          "prompt": "List FOUR health benefits of optimally fluoridated community drinking water for children.",
          "max_score": 2,
          "domain": "2",
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "Reduced dental caries in primary baby teeth",
            "Reduced dental caries in permanent teeth",
            "Reduced severity/complications of caries in children (e.g., fewer cavities progressing to pain/infection, fewer extractions/restorations)",
            "Equitable, population‑wide preventive benefit: does not depend on individual behaviour or ability to access or afford dental care",
            "Promotes remineralization of enamel",
            "Inhibits demineralization of enamel",
            "Reduces cariogenic bacterial acid effects"
          ]
        },
        {
          "id": "Q7b",
          "prompt": "List FOUR health effects of excess fluoride intake in children.",
          "max_score": 2,
          "domain": "2",
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "Mild dental fluorosis: hypomineralization during enamel development that can appear as mottling/white flecks",
            "Severe dental fluorosis causing visible staining and pitting, which may cause aesthetic and psychological concern and affect tooth quality and function",
            "Acute fluoride toxicity: classically gastrointestinal upset such as nausea/vomiting/abdominal pain with large ingestion of fluoride",
            "Severe acute fluoride toxicity: e.g., electrolyte disturbances such as hypocalcemia with neurologic and cardiac effects in extreme ingestion",
            "Skeletal fluorosis with prolonged high exposure (rare in Canada at recommended CWF levels)",
            "Potential neurocognitive effects are being evaluated as an emerging endpoint; evidence and uncertainty remain, particularly at lower exposures"
          ]
        },
        {
          "id": "Q7c",
          "prompt": "The community‑wide fluoridation program aims to achieve the benefits of CWF while minimizing risk of excess fluoride exposure, especially in young children. List FIVE key program components required to do this safely and effectively.",
          "max_score": 2.5,
          "domain": "2",
          "response_type": "list",
          "list_count": 5,
          "rubric": [
            "Clear target and control: Maintain fluoride at the optimal level (commonly 0.7 mg/L) and ensure levels stay below the drinking water guideline maximum acceptable concentration (MAC) of 1.5 mg/L",
            "Routine monitoring of fluoride concentration with quality assurance/quality control, calibration, documentation, and rapid corrective action if levels drift",
            "Use certified fluoridation agents and equipment, and standard operating procedures at the treatment plant",
            "Defined governance: Roles and accountability across water utility and public health, with reporting and oversight arrangements",
            "Incident response plan for overfeed or underfeed: thresholds, mitigation steps, timely public notification, and after‑action review",
            "Risk communication for families to reduce total fluoride ingestion from other sources (e.g., appropriate toothpaste amount/supervision for children, avoid swallowing), focused on the most susceptible ages: 0‑36 months old (rice‑sized grain of toothpaste), 3‑6 years old (small pea sized amount of toothpaste)",
            "Evaluation/surveillance plan: track oral health outcomes (e.g. caries trends, service use) and monitor fluorosis, especially in cohorts exposed during early childhood"
          ]
        }
      ],
      "title": "Legacy Practice Question Q7",
      "stem": ""
    },
    {
      "id": "Q01",
      "title": "Public Health Surveillance and QALYs (Methods)",
      "stem": "",
      "parts": [
        {
          "id": "Q01_1a",
          "prompt": "List FOUR types of public health surveillance and give one example of each.",
          "max_score": 2,
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "0.5 mark each, 2 marks total Any FOUR of the following (with an example): - Passive surveillance (routine reportable disease reporting) - Active surveillance (active case finding during an outbreak) - Sentinel surveillance (sentinel clinics for influenza‑like illness) - Syndromic surveillance (ED visits / telehealth calls for early signals) - Laboratory‑based surveillance (public health lab reporting, genomics) - Event‑based surveillance (monitoring media/social signals)"
          ],
          "must_have": [],
          "rc_classification": 3,
          "theme": "A"
        },
        {
          "id": "Q01_1b",
          "prompt": "Define a quality‑adjusted life year (QALY) and list one advantage and one disadvantage.",
          "max_score": 1.5,
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "1.5 marks total - Definition (0.5 mark): a measure combining quantity and quality of life; 1 year in perfect health = 1 QALY. - Advantage (0.5 mark): enables comparison across interventions/conditions by using a common outcome metric. - Disadvantage (0.5 mark): may not capture equity/distributional concerns; depends on preference weights."
          ],
          "must_have": [],
          "rc_classification": 2,
          "theme": "B"
        }
      ]
    },
    {
      "id": "Q02",
      "title": "Child Mortality (Canada)",
      "stem": "",
      "parts": [
        {
          "id": "Q02_2",
          "prompt": "List the THREE most common causes of death in children aged 1–14 years in Canada.",
          "max_score": 1.5,
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "0.5 mark each, 1.5 marks total - Accidents (unintentional injuries) - Malignant neoplasms - Congenital malformations, deformations and chromosomal abnormalities"
          ],
          "must_have": [],
          "rc_classification": 1,
          "theme": "E"
        }
      ]
    },
    {
      "id": "Q03",
      "title": "Adverse Childhood Experiences (ACEs)",
      "stem": "",
      "parts": [
        {
          "id": "Q03_3a",
          "prompt": "Define adverse childhood experiences (ACEs).",
          "max_score": 1,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "1 mark - Potentially traumatic experiences occurring before age 18 that are associated with increased risk of adverse health and social outcomes across the lifespan."
          ],
          "must_have": [],
          "rc_classification": 1,
          "theme": "C",
          "single_line": true
        },
        {
          "id": "Q03_3b",
          "prompt": "List FIVE types of ACE that negatively impact childhood development.",
          "max_score": 2.5,
          "response_type": "list",
          "list_count": 5,
          "rubric": [
            "0.5 mark each, 2.5 marks total Any FIVE of the following: - Physical abuse - Sexual abuse - Emotional abuse - Physical neglect - Emotional neglect - Witnessing intimate partner violence in the household - Household substance use problems - Household mental illness - Parental separation/divorce - Incarcerated household member"
          ],
          "must_have": [],
          "rc_classification": 1,
          "theme": "C"
        }
      ]
    },
    {
      "id": "Q04",
      "title": "Drowning Prevention – Haddon Matrix",
      "stem": "",
      "parts": [
        {
          "id": "Q04_4",
          "prompt": "Using Haddon’s matrix, propose NINE interventions to address drownings among children.",
          "max_score": 4.5,
          "response_type": "haddon_matrix",
          "rubric": [
            "0.5 mark each, 4.5 marks total Any NINE reasonable interventions are acceptable. Examples: - Active adult supervision (close supervision; within arm’s reach for young children) - Four‑sided pool fencing with self‑closing/self‑latching gates - Remove/secure portable pools; eliminate standing‑water hazards - Water safety education and swim skills (not a substitute for supervision) - Lifejacket/PFD use near open water - Lifeguards / supervised swimming areas - Rescue equipment accessible (ring buoy/rope) and first aid kit - CPR/first aid training for caregivers - Rapid EMS activation and clear wayfinding/addressing"
          ],
          "must_have": [],
          "rc_classification": 4,
          "theme": "F",
          "haddon_time_as_rows": true,
          "haddon_include_workspace": true
        }
      ]
    },
    {
      "id": "Q05",
      "title": "Municipal Drinking Water Incident – Elevated Lead",
      "stem": "A municipality identifies elevated lead levels in drinking water due to a system issue. Some schools/daycares are supplied directly.",
      "parts": [
        {
          "id": "Q05_5a",
          "prompt": "List THREE population groups at greatest risk of adverse health effects from lead exposure.",
          "max_score": 1.5,
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "0.5 mark each, 1.5 marks total Any THREE: - Infants and young children (especially <6 years) - Pregnant people and the fetus - People who are breastfeeding (via infant exposure risk)"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "D"
        },
        {
          "id": "Q05_5b",
          "prompt": "List SIX immediate public health recommendations to reduce exposure while the incident is investigated.",
          "max_score": 1.5,
          "response_type": "list",
          "list_count": 6,
          "rubric": [
            "0.25 mark each, 1.5 marks total Any SIX of the following: - Do not use tap water for drinking, preparing infant formula, or cooking at affected sites until further notice MUST HAVE THIS POINT (some form of immediate exposure reduction advice) - Provide safe alternative water supply (bottled water/tankers) prioritized to daycares/schools - Do NOT boil water to remove lead (boiling does not remove lead and may concentrate it) - Use cold water only for consumption (hot water can increase lead levels) - Remove fountains from service and post clear signage - Consider certified point‑of‑use filtration where appropriate (with clear instructions on use/maintenance) - Clear public communication plan (FAQ, hotline, frequent updates, uncertainty)"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "D"
        },
        {
          "id": "Q05_5c",
          "prompt": "Outline FIVE key elements of the public health response plan over the next 72 hours.",
          "max_score": 2.5,
          "response_type": "list",
          "list_count": 5,
          "rubric": [
            "0.5 mark each, 2.5 marks total Any FIVE: - Incident command/coordination with water utility, education/childcare partners - Sampling strategy with QA/QC (treatment plant + distribution + priority buildings) - Exposure assessment (zones/sites affected; duration; populations served; critical facilities) - Clinical guidance for blood lead testing and follow‑up pathways - Equity‑informed outreach/supports for priority populations - Documentation and after‑action review plan"
          ],
          "must_have": [],
          "rc_classification": 6,
          "theme": "D"
        }
      ]
    },
    {
      "id": "Q06",
      "title": "Randomized Trial – Risk Measures (Calculations)",
      "stem": "2. A study was conducted to determine whether fecal immunochemical test (FIT) reduced mortality from colorectal cancer. People aged 50 to 60 years were randomized to the screening test or to a control group and followed for 13 years. Over this period of time, there were 323 cancer cases and 82 colorectal cancer deaths in the 15,570 people randomized to annual screening. There were 356 cancers and 121 colorectal cancer deaths in the 15,394 people randomized to the control group. The sensitivity and specificity of the test for colon cancer were both about 90%.",
      "parts": [
        {
          "id": "Q06_6a",
          "prompt": "Calculate the absolute risk reduction (ARR).",
          "max_score": 1.5,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "1.5 marks total - Formula (0.5 mark): ARR = Risk(control) − Risk(screened) - Working (0.5 mark): 121/15,394 ≈ 0.00786; 82/15,570 ≈ 0.00527 - Answer + interpretation (0.5 mark): ARR ≈ 0.00259 (≈ 2.6 per 1,000 over 13 years)"
          ],
          "must_have": [],
          "rc_classification": 3,
          "theme": "B"
        },
        {
          "id": "Q06_6b",
          "prompt": "Calculate the relative risk reduction (RRR).",
          "max_score": 1.5,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "1.5 marks total - Formula (0.5 mark) - Working (0.5 mark): RR ≈ 0.00527 / 0.00786 ≈ 0.67 - Answer (0.5 mark): RRR = 1 − RR ≈ 0.33 (≈ 33%)"
          ],
          "must_have": [],
          "rc_classification": 3,
          "theme": "B"
        },
        {
          "id": "Q06_6c",
          "prompt": "Calculate the number needed to screen (NNS).",
          "max_score": 1.5,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "1.5 marks total - Formula (0.5 mark) - Working (0.5 mark): NNS = 1 / ARR - Answer (0.5 mark): NNS ≈ 386"
          ],
          "must_have": [],
          "rc_classification": 3,
          "theme": "B"
        }
      ]
    },
    {
      "id": "Q07",
      "title": "Fluoridation – Scientific and Ethical Arguments",
      "stem": "A municipality is reviewing a proposal to initiate community water fluoridation. Consider both scientific evidence and ethics in your response.",
      "parts": [
        {
          "id": "Q07_7a",
          "prompt": "List TWO scientific reasons supporting community water fluoridation.",
          "max_score": 1,
          "response_type": "list",
          "list_count": 2,
          "rubric": [
            "0.5 mark each, 1 mark total Any TWO: - At optimal concentration, reduces dental caries at the population level - Population‑wide benefit not dependent on individual behaviour - Implemented at concentrations below Canadian guideline maximum"
          ],
          "must_have": [],
          "rc_classification": 4,
          "theme": "B"
        },
        {
          "id": "Q07_7b",
          "prompt": "Provide TWO ethical arguments in support AND TWO ethical arguments against.",
          "max_score": 2,
          "domain": "5",
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "Support: promotes population oral health and equity benefits.",
            "Support: effective and cost-saving intervention.",
            "Against: autonomy/consent concerns with mass exposure.",
            "Against: concerns about potential harms or acceptability."
          ]
        }
      ]
    },
    {
      "id": "Q08",
      "title": "Consensus Techniques (Guideline Update Context)",
      "stem": "Expert scientists and clinicians are convened to propose updates to breast cancer screening guidelines in Canada.",
      "parts": [
        {
          "id": "Q08_8",
          "prompt": "Describe and differentiate between TWO formal consensus techniques that could be used to develop recommendations.",
          "max_score": 4,
          "response_type": "list",
          "list_count": 2,
          "rubric": [
            "2 marks each, 4 marks total Any TWO (must differentiate): - Delphi technique: iterative rounds (often anonymous) with feedback to converge on consensus - Nominal group technique: structured small‑group meeting with silent idea generation and ranking/voting"
          ],
          "must_have": [],
          "rc_classification": 2,
          "theme": "B"
        }
      ]
    },
    {
      "id": "Q09",
      "title": "Parasites / Enteric Illness – Daycare Cluster (Applied)",
      "stem": "A daycare reports multiple children with 7–10 days of watery diarrhea, abdominal cramps, and weight loss. Several attended a splash pad and a petting zoo the week prior.",
      "parts": [
        {
          "id": "Q09_9a",
          "prompt": "List THREE protozoal causes to consider and ONE key exposure for each.",
          "max_score": 3,
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "3 marks total Any THREE: - Cryptosporidium: recreational water/splash pads; animal contact - Giardia: daycare transmission; contaminated water - Cyclospora: fresh produce - Entamoeba histolytica: travel; contaminated food/water"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "A"
        },
        {
          "id": "Q09_9b",
          "prompt": "List FOUR immediate IPAC measures for the daycare.",
          "max_score": 1,
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "0.25 mark each, 1 mark total Any FOUR: - Exclude symptomatic children/staff per local guidance - Hand hygiene emphasis (soap and water) - Enhanced environmental cleaning/disinfection (appropriate agents/contact time) - Stop water‑play activities until outbreak controlled - Notify/coordinate with public health; line list and case definition"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "A"
        },
        {
          "id": "Q09_9c",
          "prompt": "List TWO lab testing approaches.",
          "max_score": 1,
          "response_type": "list",
          "list_count": 2,
          "rubric": [
            "0.5 mark each, 1 mark total Any TWO: - Stool PCR panel including protozoa - Stool ova and parasite exam - Giardia/Crypto antigen testing (where available)"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "A"
        }
      ]
    },
    {
      "id": "Q10",
      "title": "Occupational Health – Fatigue and Shift Work",
      "stem": "",
      "parts": [
        {
          "id": "Q10_10a",
          "prompt": "List FIVE occupational health and safety concerns related to fatigue/shift work.",
          "max_score": 2.5,
          "response_type": "list",
          "list_count": 5,
          "rubric": [
            "0.5 mark each, 2.5 marks total Any FIVE: - Fatigue‑related performance impairment (errors, slowed reaction time) - Increased risk of workplace injury/near‑miss - Drowsy driving risk after night shifts - Circadian disruption affecting mental health - Cardiometabolic risks associated with chronic shift work - Reduced adherence to safe work procedures under fatigue"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "D"
        },
        {
          "id": "Q10_10b",
          "prompt": "List THREE employer‑level controls to reduce fatigue risk.",
          "max_score": 1.5,
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "0.5 mark each, 1.5 marks total Any THREE: - Fatigue risk management approach (hazard identification, reporting, response) - Hours‑of‑work and scheduling controls (limit consecutive nights; adequate recovery time) - Rest breaks/task rotation; lighting/work design - Training/education on recognizing/responding to fatigue"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "D"
        }
      ]
    },
    {
      "id": "Q11",
      "title": "Standardization and Comparative Rates (High‑Marks Calculations)",
      "stem": "Consider this table of annual suicides in an Indigenous population and in the overall province (Table 11).",
      "parts": [
        {
          "id": "Q11_11a",
          "prompt": "Calculate the unadjusted (crude) relative risk of suicide in the Indigenous population compared to the overall Ontario population.",
          "max_score": 1.5,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "1.5 marks total - Formula (0.5): RR = rate_community / rate_provincial - Working (0.5): community crude rate = 14/7,751 ≈ 0.001806; provincial rate = 16.4/100,000 = 0.000164 - Answer + interpretation (0.5): RR ≈ 11.0"
          ],
          "must_have": [],
          "rc_classification": 3,
          "theme": "F"
        },
        {
          "id": "Q11_11b",
          "prompt": "Calculate the standardized mortality ratio (SMR) for the Indigenous population.",
          "max_score": 2.5,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "2.5 marks total - Formula (0.5): SMR = observed / expected - Expected deaths (1): - 10–19: 2,301 × (7.0/100,000) = 0.16 - 20–44: 3,890 × (21.0/100,000) = 0.82 - 45–64: 1,261 × (22.7/100,000) = 0.29 - 65+: 299 × (12.6/100,000) = 0.04 - Total expected (0.5): 0.16 + 0.82 + 0.29 + 0.04 = 1.31 - SMR (0.5): 14 / 1.31 ≈ 10.7"
          ],
          "must_have": [],
          "rc_classification": 3,
          "theme": "F"
        },
        {
          "id": "Q11_11c",
          "prompt": "Using direct standardization, calculate the age‑adjusted Indigenous rate (per 100,000) using a standard population of 10,000 per age group.",
          "max_score": 2.5,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "2.5 marks total - Formula (0.5) - Age‑specific community rates (0.5): - 10–19: (7/2,301)×100,000 ≈ 304.2 - 20–44: (7/3,890)×100,000 ≈ 179.9 - 45–64: 0 - 65+: 0 - Apply to standard (1): - Expected deaths = 30.42 + 17.99 + 0 + 0 = 48.41 (per 40,000) - Answer (0.5): (48.41/40,000)×100,000 ≈ 121.0 per 100,000"
          ],
          "must_have": [],
          "rc_classification": 3,
          "theme": "F"
        },
        {
          "id": "Q11_11d",
          "prompt": "Using direct standardization and the same standard population, calculate the age‑adjusted provincial rate (per 100,000).",
          "max_score": 2,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "2 marks total - Apply rates to standard (1): 0.70 + 2.10 + 2.27 + 1.26 = 6.33 (per 40,000) - Answer (0.5): (6.33/40,000)×100,000 ≈ 15.8 per 100,000 - Interpretation (0.5): provincial age‑adjusted rate in this standard is ~15.8/100,000"
          ],
          "must_have": [],
          "rc_classification": 3,
          "theme": "F"
        },
        {
          "id": "Q11_11e",
          "prompt": "Calculate the comparative mortality ratio (CMR) for the Indigenous population compared to the provincial rate.",
          "max_score": 1.5,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "1.5 marks total - Formula (0.5): CMR = adj rate_community / adj rate_province - Working (0.5): 121.0 / 15.8 ≈ 7.6 - Interpretation (0.5): age‑adjusted rate ~7.6× higher"
          ],
          "must_have": [],
          "rc_classification": 3,
          "theme": "F"
        }
      ],
      "stem_image": "./Q11table.png"
    },
    {
      "id": "Q12",
      "title": "Hypothetical Novel Mpox Variant – Transmission, Metrics, and Control",
      "stem": "A new Mpox variant (clade III) has been identified by the WHO to be spreading among recent travellers from the Democratic Republic of the Congo (DRC). DRC clinicians note higher transmissibility and evidence of more efficient droplet transmission and casual-contact transmission than prior Mpox outbreaks.",
      "parts": [
        {
          "id": "Q12_12a",
          "prompt": "Define R0 and Rt.",
          "max_score": 2,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "2 marks total - R0 (1) - Rt (1)"
          ],
          "must_have": [],
          "rc_classification": 3,
          "theme": "A"
        },
        {
          "id": "Q12_12b",
          "prompt": "List THREE implications of the more transmissible clade II variant for infection prevention and control",
          "max_score": 1.5,
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "0.5 mark each, 1.5 marks total Any THREE: - Broader contact definitions and contact management - Strengthen respiratory protection in higher‑risk settings (droplet/contact precautions as indicated) - Improve ventilation/crowding mitigation in congregate settings - Reinforce hand hygiene and environmental cleaning of shared items"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "A"
        },
        {
          "id": "Q12_12c",
          "prompt": "Draft a brief public message to Canadians and Canadian travellers that minimizes stigma.",
          "max_score": 1.5,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "1.5 marks total"
          ],
          "must_have": [],
          "rc_classification": 6,
          "theme": "A"
        }
      ]
    },
    {
      "id": "Q13",
      "title": "Conflict Handling and Diffusion of Innovation – Applied Leadership",
      "stem": "You are negotiating priorities with the local health unit CEO who is opposed to investing in a new surveillance system.",
      "parts": [
        {
          "id": "Q13_13a",
          "prompt": "List THREE approaches to conflict handling/resolution and briefly describe when each is appropriate.",
          "max_score": 3,
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "3 marks total - Thomas–Kilmann styles (choose stance based on urgency vs relationship) - Principled negotiation (interests, options, objective criteria) - Mediation (neutral third party) - Interest‑based problem solving"
          ],
          "must_have": [],
          "rc_classification": 6,
          "theme": "A"
        },
        {
          "id": "Q13_13b",
          "prompt": "Use a change management model to propose THREE practical strategies for rolling out the surveillance system across the health unit.",
          "max_score": 3,
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "3 marks total - List THREE innovation attributes that influence adoption (1 each, 3 total): relative advantage; compatibility; complexity; trialability; observability (any three) - Identify adopter categories and one tactic for THREE categories (1 each tactic, 3 total) - One evaluation metric (1) - One risk‑mitigation tactic (1)"
          ],
          "must_have": [],
          "rc_classification": 6,
          "theme": "A"
        }
      ]
    },
    {
      "id": "Q14",
      "title": "HR, Equity, and Power Differentials – Performance Concern with Possible Manager Bias",
      "stem": "An employee is labelled ‘underperforming’ by their manager at the local health unit. The employee reports being late due to religious observances and feels targeted. You note a power differential and potential conflict of interest.",
      "parts": [
        {
          "id": "Q14_14a",
          "prompt": "List SIX steps you would take to assess the situation fairly and safely.",
          "max_score": 3,
          "response_type": "list",
          "list_count": 6,
          "rubric": [
            "0.5 mark each, 3 marks total Any SIX: - Clarify concerns with objective expectations and specific examples - Gather evidence from multiple sources (documentation, metrics) - Meet separately with employee and manager; use equity‑informed approach - Consult HR early; screen for discrimination/harassment - Consider accommodation obligations and explore reasonable accommodations - Document and maintain confidentiality - Consider interim measures to reduce harm (e.g., temporary reporting change)"
          ],
          "must_have": [],
          "rc_classification": 6,
          "theme": "C"
        },
        {
          "id": "Q14_14b",
          "prompt": "List THREE indicators that the manager may be the primary problem rather than the employee.",
          "max_score": 1.5,
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "0.5 mark each, 1.5 marks total Any THREE: - Inconsistent standards applied across staff - Lack of documented coaching/support prior to escalation - Reports/patterns of biased language, harassment, or retaliation - High turnover/complaints in the manager’s team"
          ],
          "must_have": [],
          "rc_classification": 6,
          "theme": "C"
        },
        {
          "id": "Q14_14c",
          "prompt": "Propose TWO actions to address governance/line-of-sight and reduce conflict of interest during the investigation.",
          "max_score": 2,
          "domain": "7",
          "response_type": "list",
          "list_count": 2,
          "rubric": [
            "Assign an independent investigator/decision-maker outside the direct line relationship.",
            "Establish clear reporting and oversight (e.g., HR/legal governance) to avoid conflict and ensure fairness."
          ]
        }
      ]
    },
    {
      "id": "Q15",
      "title": "Extreme Heat and Air Quality – Vulnerability, Indices, Syndemics",
      "stem": "",
      "parts": [
        {
          "id": "Q15_15a",
          "prompt": "List FIVE vulnerable populations at higher risk of heat‑related illness.",
          "max_score": 2.5,
          "response_type": "list",
          "list_count": 5,
          "rubric": [
            "0.5 mark each, 2.5 marks total Any FIVE: - Older adults - Infants and young children - People with chronic medical conditions - People taking medications affecting thermoregulation/hydration - Socially isolated or mobility‑limited individuals - People experiencing homelessness or inadequate cooling - Outdoor workers/athletes"
          ],
          "must_have": [],
          "rc_classification": 1,
          "theme": "D"
        },
        {
          "id": "Q15_15b",
          "prompt": "Differentiate between the Air Quality Health Index (AQHI) and an Air Quality Index (AQI).",
          "max_score": 1,
          "domain": "4",
          "response_type": "text",
          "single_line": true,
          "rubric": [
            "AQHI communicates short-term health risk and behaviour guidance; AQI is primarily pollutant concentration/status index and may not map directly to individual health action."
          ]
        },
        {
          "id": "Q15_15c",
          "prompt": "Define a syndemic and give one example relevant to co‑occurring extreme heat and poor air quality.",
          "max_score": 2,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "3 marks total - Definition (1): synergistic interaction of two or more health problems under conditions of inequity that worsens outcomes. - Example (1): extreme heat + wildfire smoke worsening COPD/asthma admissions, amplified by precarious housing. - Public health implication (1): integrated messaging and targeted supports (cooling/clean‑air shelters, outreach)."
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "D"
        }
      ]
    },
    {
      "id": "Q16",
      "title": "Lead Exposure – Sources and Community Hazard Assessment",
      "stem": "A child is found to have elevated blood lead levels.",
      "parts": [
        {
          "id": "Q16_16a",
          "prompt": "List SIX possible sources of lead exposure.",
          "max_score": 3,
          "response_type": "list",
          "list_count": 6,
          "rubric": [
            "0.5 mark each, 3 marks total Any SIX: - Lead‑based paint and household dust in older housing - Soil contamination - Drinking water from lead service lines/plumbing/solder - Imported toys/jewelry/cosmetics/spices/traditional remedies containing lead - Take‑home exposure from parental occupations/hobbies - Lead‑glazed pottery used for food"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "D"
        },
        {
          "id": "Q16_16b",
          "prompt": "The suspected source is a water fountain at a local daycare. List FOUR steps in a hazard/risk assessment for other potentially exposed children.",
          "max_score": 2,
          "domain": "4",
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "Define exposed population and exposure period.",
            "Obtain environmental sampling/testing data to characterize hazard.",
            "Assess dose/exposure pathways and susceptibility (age, pregnancy, etc.).",
            "Plan clinical/public health follow-up and communication based on risk stratification."
          ]
        }
      ]
    },
    {
      "id": "Q17",
      "title": "Emergency Management – Respiratory Virus Season Cycle",
      "stem": "Your public health unit plans for an annual respiratory virus season (COVID-19, RSV, influenza) peaking in late winter with an annual emergency management cycle.",
      "parts": [
        {
          "id": "Q17_17a",
          "prompt": "List the FOUR phases of emergency management.",
          "max_score": 2,
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "2 marks total - Mitigation/Prevention (0.5) - Preparedness (0.5) - Response (1) - Recovery (1)"
          ],
          "must_have": [],
          "rc_classification": 6,
          "theme": "A"
        },
        {
          "id": "Q17_17b",
          "prompt": "Apply each phase to a respiratory virus season cycle by listing ONE concrete activity under each phase.",
          "max_score": 2,
          "domain": "8",
          "response_type": "list",
          "rubric": [
            "Mitigation activity.",
            "Preparedness activity.",
            "Response activity.",
            "Recovery activity."
          ],
          "list_count": 4
        },
        {
          "id": "Q17_17c",
          "prompt": "In the recovery phase (‘hot wash’) after the peak, list FOUR items that should be reviewed.",
          "max_score": 2,
          "domain": "8",
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "What worked well and key enablers.",
            "Gaps/failures and root causes.",
            "Data/timeliness/communications performance.",
            "Resource/staffing/surge implications and improvement actions before next season."
          ]
        }
      ]
    },
    {
      "id": "Q18",
      "title": "Mumps Investigation – Schoolchildren on a Camping Trip",
      "stem": "A cluster of parotitis is reported among schoolchildren who attended a multi-day camping trip",
      "parts": [
        {
          "id": "Q18_18a",
          "prompt": "Define the period of communicability for mumps.",
          "max_score": 1,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "1 mark total - Key window (2 marks): communicable from ~2 days before to 5 days after onset of parotitis."
          ],
          "must_have": [],
          "rc_classification": 3,
          "theme": "A",
          "single_line": true
        },
        {
          "id": "Q18_18b",
          "prompt": "List SIX key history questions for case investigation.",
          "max_score": 3,
          "response_type": "list",
          "list_count": 6,
          "rubric": [
            "0.5 mark each, 3 marks total Any SIX: - Symptom onset date; parotitis details - Complications (orchitis, meningitis symptoms) - MMR vaccination history (number of doses + dates) - Close contact network (cabinmates, shared drinks/utensils) - Other cases in school/household; travel - Specimen collection/testing and timing"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "A"
        },
        {
          "id": "Q18_18c",
          "prompt": "List THREE immediate public health actions at the school.",
          "max_score": 3,
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "1 mark each, 3 marks total Any THREE: - Case definition and line list; identify close contacts - Exclude cases from school for recommended period - Risk communication to parents/staff - Review immunization status; offer catch‑up MMR for under‑immunized"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "A"
        }
      ]
    },
    {
      "id": "Q19",
      "title": "Measles – Case Management and Post‑Exposure Prophylaxis",
      "stem": "A child presents to Emergency with fever, cough, conjunctivitis and a generalized maculopapular rash; measles is suspected.",
      "parts": [
        {
          "id": "Q19_19a",
          "prompt": "List THREE immediate infection control/public health steps.",
          "max_score": 3,
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "1 mark each, 3 marks total Any THREE: - Airborne isolation and notify infection prevention and control - Urgent public health notification and case investigation - Collect appropriate specimens and arrange testing"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "A"
        },
        {
          "id": "Q19_19b",
          "prompt": "As you consider exposed cases for post-exposure prophylaxis eligibility, list TWO options and the time window for each.",
          "max_score": 2,
          "domain": "3",
          "response_type": "list",
          "list_count": 2,
          "rubric": [
            "MMR vaccine within 72 hours of exposure for eligible susceptible contacts.",
            "Immune globulin within 6 days of exposure for high-risk susceptible contacts."
          ]
        },
        {
          "id": "Q19_19c",
          "prompt": "List THREE groups prioritized for Ig.",
          "max_score": 2,
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "0.5 mark each, 1.5 marks total Any THREE: - Pregnant people without evidence of immunity - Immunocompromised individuals - Infants <6 months - Immunocompetent infants 6–11 months who present after 72 hours and within 6 days"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "A"
        },
        {
          "id": "Q19_19d",
          "prompt": "List TWO criteria for evidence of measles immunity.",
          "max_score": 1.5,
          "response_type": "list",
          "list_count": 2,
          "rubric": [
            "1 mark each, 2 marks total Any TWO: - Documentation of 2 doses of measles‑containing vaccine (age‑appropriate) - Laboratory evidence of immunity - History of laboratory‑confirmed measles"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "A"
        }
      ]
    },
    {
      "id": "Q20",
      "title": "Tuberculosis – Newcomer in Congregate Housing",
      "stem": "A newcomer to Canada living in a dorm-like setting is diagnosed with pulmonary TB. They are worried about stigma and unsure about taking oral therapy.",
      "parts": [
        {
          "id": "Q20_20a",
          "prompt": "List FOUR factors that make a TB case higher risk for transmission or poor outcomes.",
          "max_score": 2,
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "0.5 mark each, 2 marks total Any FOUR: - Smear‑positive pulmonary TB - Cavitary disease on imaging - Significant cough/high symptom burden - Delayed diagnosis/prolonged infectious period - Congregate living setting - HIV/immunocompromise"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "A"
        },
        {
          "id": "Q20_20b",
          "prompt": "List FOUR strategies to support rapport and culturally safe care.",
          "max_score": 2,
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "0.5 mark each, 2 marks total Any FOUR: - Use professional interpreters; avoid family as interpreter - Trauma‑informed and non‑stigmatizing communication - Explain confidentiality and what must be shared for public health - Address practical barriers (transportation, housing, food, clinic access)"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "A"
        },
        {
          "id": "Q20_20c",
          "prompt": "List THREE approaches to improve oral medication adherence.",
          "max_score": 1.5,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "0.5 mark each, 1.5 marks total Any THREE: - DOT or video‑enabled DOT (VDOT) - Case management, reminders, incentives/enablers - Education on duration, side effects, and missed dose plan"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "A",
          "single_line": true
        },
        {
          "id": "Q20_20d",
          "prompt": "As you communicate potential TB exposure with other tenants in the dorm, list TWO principles to balance confidentiality with exposure management.",
          "max_score": 1,
          "domain": "5",
          "response_type": "list",
          "list_count": 2,
          "rubric": [
            "Share only minimum necessary information and protect personal identifiers.",
            "Provide clear exposure/risk guidance and access to testing/follow-up while avoiding stigmatizing language."
          ]
        }
      ]
    },
    {
      "id": "Q21",
      "title": "iGAS Cluster – Homeless Shelter",
      "stem": "A homeless shelter reports multiple severe invasive Group A Streptococcus (iGAS) cases.",
      "parts": [
        {
          "id": "Q21_21a",
          "prompt": "List THREE clinical severity features suggesting streptococcal toxic shock syndrome (STSS).",
          "max_score": 1.5,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "0.5 mark each, 1.5 marks total Any THREE: - Hypotension/shock - Multi‑organ dysfunction (renal impairment, coagulopathy, liver involvement) - Soft tissue necrosis / severe pain out of proportion / rapidly progressive infection"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "A",
          "single_line": true
        },
        {
          "id": "Q21_21b",
          "prompt": "List FOUR factors that define a higher‑risk contact situation in a shelter context.",
          "max_score": 2,
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "0.5 mark each, 2 marks total Any FOUR: - Close contact/shared sleeping arrangements - Open wounds/skin breakdown - Injection drug use - Recent influenza/varicella‑like illness - Immunocompromise"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "A"
        },
        {
          "id": "Q21_21c",
          "prompt": "List TWO considerations for whether to offer chemoprophylaxis and one possible regimen class.",
          "max_score": 1.5,
          "domain": "3",
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "Intensity/proximity of exposure and contact risk profile.",
            "Feasibility, adherence, resistance, and harms/benefits in setting.",
            "Possible regimen class: beta-lactam or macrolide (per guidance/susceptibility)."
          ]
        }
      ]
    },
    {
      "id": "Q22",
      "title": "Suspected Bat Exposure – Rabies Risk Assessment and PEP",
      "stem": "A child wakes up and a bat is found in the bedroom. No obvious bite marks are seen on the child.",
      "parts": [
        {
          "id": "Q22_22a",
          "prompt": "List THREE exposure history elements that determine whether rabies PEP is indicated.",
          "max_score": 1.5,
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "0.5 mark each, 1.5 marks total Any THREE: - Evidence of direct contact with bat (bat touching skin; child touching bat) or inability to reliably exclude contact - Bat available for testing - Presence of bite/scratch or mucous membrane exposure to saliva"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "A"
        },
        {
          "id": "Q22_22b",
          "prompt": "If PEP is indicated and the child is not previously vaccinated, list FOUR components.",
          "max_score": 2,
          "domain": "3",
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "Immediate wound cleansing/irrigation.",
            "Human rabies immune globulin dosing and infiltration.",
            "Rabies vaccine day 0.",
            "Complete follow-up vaccine doses per schedule."
          ]
        },
        {
          "id": "Q22_22c",
          "prompt": "If the bat is captured and tests negative, what is the implication for PEP?",
          "max_score": 1,
          "domain": "3",
          "response_type": "text",
          "single_line": true,
          "rubric": [
            "PEP can be withheld or discontinued if reliable testing confirms bat is rabies negative."
          ]
        }
      ]
    },
    {
      "id": "Q23",
      "title": "Late Prenatal Presentation (Third Trimester Newcomer) – Screening, Vaccines, Nutrition",
      "stem": "A 32-year-old newcomer to Canada presents for her first prenatal visit at 31 weeks’ gestation. She has had no prenatal screening to date and is unsure of her immunization history.",
      "parts": [
        {
          "id": "Q23_23a",
          "prompt": "List EIGHT infectious conditions that should be considered for prenatal screening (bloodwork and/or swabs), recognizing that specific testing may vary by jurisdiction and individual risk.",
          "max_score": 4,
          "response_type": "list",
          "list_count": 8,
          "rubric": [
            "0.5 mark each, 4 marks total Any EIGHT: - HIV - Syphilis - Hepatitis B surface antigen - Rubella immunity - Chlamydia - Gonorrhea - Group B streptococcus screening (35–37 weeks) - Varicella immunity (history/serology) - Hepatitis C (risk‑based; may be offered more broadly depending on jurisdiction)"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "E"
        },
        {
          "id": "Q23_23b",
          "prompt": "List SIX vaccine‑related actions (include vaccines recommended during pregnancy plus postpartum catch‑up if indicated).",
          "max_score": 3,
          "response_type": "list",
          "list_count": 6,
          "rubric": [
            "0.5 mark each, 3 marks total Any SIX: - Offer seasonal influenza vaccine in pregnancy (in season) - Offer Tdap during each pregnancy (ideally 27–32 weeks) - Offer COVID‑19 vaccine per current recommendations - Consider RSV prevention strategy for infant (maternal RSVpreF vaccine at 32–36 weeks where available/eligible, OR infant monoclonal where program exists) - Postpartum catch‑up with live vaccines if non‑immune (MMR for rubella; varicella) - Review household contacts’ vaccination (“cocooning”)"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "E"
        },
        {
          "id": "Q23_23c",
          "prompt": "List EIGHT prenatal nutrition/supplement recommendations.",
          "max_score": 4,
          "response_type": "list",
          "list_count": 8,
          "rubric": [
            "0.5 mark each, 4 marks total Any EIGHT: - Daily folic acid (typically 0.4 mg for low‑risk; higher dose for specific high‑risk situations) - Prenatal multivitamin containing iron; address iron deficiency as indicated - Ensure iodine intake (prenatal vitamins commonly include iodine) - Limit caffeine (follow Canadian guidance; include all sources) - Avoid alcohol in pregnancy - Follow food safety advice to reduce foodborne illness risk - Choose fish low in mercury and follow Canadian mercury guidance - Eat a variety of foods aligned with Canada’s Food Guide; limit highly processed foods"
          ],
          "must_have": [],
          "rc_classification": 4,
          "theme": "E"
        }
      ]
    },
    {
      "id": "Q24",
      "title": "Syphilis in Pregnancy (2023–2025 context)",
      "stem": "A pregnant person is diagnosed with infectious syphilis late in pregnancy. Syphilis has increased substantially in recent years in Canada, including among females of reproductive age, with a rise in congenital syphilis.",
      "parts": [
        {
          "id": "Q24_24a",
          "prompt": "List FOUR epidemiologic observations about syphilis relevant to preventing congenital syphilis.",
          "max_score": 2,
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "0.5 mark each, 2 marks total Any FOUR: - Large increases since 2018; 2023 decrease does not establish a trend - Increasing rates among females of reproductive age - Congenital syphilis is preventable with timely screening and treatment - Many infections are asymptomatic, supporting routine screening - Reinfection is possible; partner management is essential"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "E"
        },
        {
          "id": "Q24_24b",
          "prompt": "List FOUR factors that increase risk of vertical transmission and/or adverse pregnancy outcomes.",
          "max_score": 2,
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "0.5 mark each, 2 marks total Any FOUR: - Stage (highest risk in primary/secondary) - Infection acquired near term - No/late prenatal care - No treatment or inadequate treatment; reinfection"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "E"
        },
        {
          "id": "Q24_24c",
          "prompt": "List THREE routes/timings of parent‑to‑infant syphilis transmission.",
          "max_score": 1.5,
          "response_type": "list",
          "list_count": 3,
          "rubric": [
            "0.5 mark each, 1.5 marks total - Transplacental transmission during pregnancy - Exposure to infectious lesions at delivery - Postnatal transmission through direct contact with infectious lesions (rare; breastfeeding itself not typical unless lesions on breast)"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "E"
        },
        {
          "id": "Q24_24d",
          "prompt": "List EIGHT public health interventions that reduce risk of congenital syphilis, addressing the pregnant person AND partner(s), across pregnancy, delivery, and postpartum.",
          "max_score": 4,
          "response_type": "list",
          "list_count": 8,
          "rubric": [
            "0.5 mark each, 4 marks total Any EIGHT: - Universal screening at first prenatal visit - Repeat screening later in pregnancy and/or at delivery when indicated by risk/outbreak guidance - Immediate treatment with penicillin per guidelines and ensure completion - Partner notification, testing and treatment to prevent reinfection - Case management to support follow‑up serology and prenatal care linkage - Risk reduction counselling; address structural risks and access barriers - Neonatal assessment plan when maternal infection is late or inadequately treated - Surveillance/reporting and outbreak response supports"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "E"
        }
      ]
    },
    {
      "id": "Q25",
      "title": "Newborn/Infant Infections + Immunization Timing",
      "stem": "",
      "parts": [
        {
          "id": "Q25_25a",
          "prompt": "List SIX infections in the prenatal/newborn period that are high public health priority because they can cause severe outcomes and/or have clear prevention opportunities.",
          "max_score": 3,
          "response_type": "list",
          "list_count": 6,
          "rubric": [
            "0.5 mark each, 3 marks total Any SIX: - Hepatitis B - HIV - Syphilis - Rubella (congenital rubella syndrome prevention) - Varicella (congenital/neonatal varicella prevention) - Measles (high consequence; PEP and outbreak management) - Pertussis (severe infant disease; prevention via maternal Tdap) - Influenza (severe disease in infants; maternal vaccination + infant vaccination starting at 6 months)"
          ],
          "must_have": [],
          "rc_classification": 5,
          "theme": "E"
        },
        {
          "id": "Q25_25b",
          "prompt": "List TWO vaccines that can begin at 6 months of age (seasonal/routine recommendations) AND list FOUR vaccines commonly given around 12 months of age in many Canadian schedules.",
          "max_score": 3,
          "domain": "9",
          "response_type": "list",
          "list_count": 6,
          "rubric": [
            "6 months: influenza, COVID-19 (per recommendations).",
            "Around 12 months: MMR, Men-C-C, PCV booster, varicella/MMRV (schedule dependent)."
          ]
        }
      ]
    },
    {
      "id": "Q26",
      "title": "Child Health and Intersectionality – Food Insecurity and Malnutrition (Northern Remote Context)",
      "stem": "A 3-year-old child in a Northern remote Inuit community is seen for recurrent infections, poor growth, and fatigue. The family reports high food insecurity and limited access to affordable nutritious foods.",
      "parts": [
        {
          "id": "Q26_26a",
          "prompt": "List EIGHT assessment elements you would prioritize (clinical, nutrition, environmental, and social).",
          "max_score": 4,
          "response_type": "list",
          "list_count": 8,
          "rubric": [
            "0.5 mark each, 4 marks total Any EIGHT: - Growth parameters and growth trajectory - Dietary history (24‑hour recall; food access constraints) - Screen for micronutrient deficiencies (iron deficiency anemia; vitamin D; others as clinically indicated) - Infection history and immunization status - Housing conditions (crowding, mould) and water security - Developmental screening and psychosocial assessment - Consider enteric/parasitic infection based on exposure history - Access to care and barriers (transport, language) - Household income supports and community food programs"
          ],
          "must_have": [],
          "rc_classification": 1,
          "theme": "E"
        },
        {
          "id": "Q26_26b",
          "prompt": "List EIGHT public health actions across individual, program, and structural levels.",
          "max_score": 4,
          "response_type": "list",
          "list_count": 8,
          "rubric": [
            "0.5 mark each, 4 marks total Any EIGHT: - Link to community‑led food programs (e.g., community freezer, school/daycare nutrition supports) - Culturally safe nutrition counselling supporting traditional foods where available - Coordinate micronutrient supplementation where indicated - Improve access to vaccines and infection prevention resources - Strengthen surveillance/monitoring of child growth and anemia indicators - Partner with Indigenous leadership; apply Indigenous data governance principles (e.g., OCAP®) - Advocate intersectorally on food affordability/logistics and housing/water infrastructure - Support policies/programs addressing poverty and cost of living"
          ],
          "must_have": [],
          "rc_classification": 4,
          "theme": "E"
        }
      ]
    },
    {
      "id": "Q27",
      "title": "Breast Cancer Screening – Program Evaluation, Equity, and Surveillance",
      "stem": "Your province is implementing an organized breast cancer screening program and wants system design advice.",
      "parts": [
        {
          "id": "Q27_27a",
          "prompt": "List FIVE criteria that an organized breast cancer screening program should meet to be considered effective and appropriate.",
          "max_score": 2.5,
          "response_type": "list",
          "list_count": 5,
          "rubric": [
            "Any FIVE: target population/eligibility; benefit–harm balance incl overdiagnosis; acceptable test/protocol; diagnostic follow-up capacity; QA/audit; equitable access/cultural safety; performance monitoring; informed participation; cost/sustainability; continuous improvement."
          ],
          "must_have": [],
          "rc_classification": 4,
          "theme": "B"
        },
        {
          "id": "Q27_27b",
          "prompt": "Provide TWO arguments supporting earlier/expanded screening AND TWO arguments supporting later/narrower screening.",
          "max_score": 4,
          "response_type": "list",
          "list_count": 4,
          "rubric": [
            "Any TWO per side. Earlier/expanded: higher incidence at younger ages in some groups; higher baseline risk; equity concerns; years-of-life saved. Later/narrower: overdiagnosis/overtreatment; higher false positives/biopsies; anxiety/harms; uncertain mortality benefit in lower-risk; capacity/opportunity costs."
          ],
          "must_have": [],
          "rc_classification": 2,
          "theme": "B"
        },
        {
          "id": "Q27_27c",
          "prompt": "List SIX attributes of a well-conducted public health surveillance system.",
          "max_score": 3,
          "response_type": "list",
          "list_count": 6,
          "rubric": [
            "Any SIX: usefulness, simplicity, flexibility, data quality, acceptability, sensitivity, PVP, representativeness, timeliness, stability."
          ],
          "must_have": [],
          "rc_classification": 3,
          "theme": "B"
        }
      ]
    },
    {
      "id": "Q28",
      "title": "Rapid Streptococcal Test – 2×2 Table and Diagnostic Accuracy",
      "stem": "To determine the value of rapid strep throat swabs in point-of-care testing, a study was conducted to compare rapid strep antigen test vs standard bacterial culture. The study recruited 100 children. In total, there were 40 positive cultures and 60 negative cultures for group A streptococcus. Findings included 34 true positives (TP), 6 false negatives (FN), 9 false positives (FP) and 51 true negatives (TN).",
      "parts": [
        {
          "id": "Q28_28a",
          "prompt": "Construct the 2×2 table and calculate sensitivity and specificity.",
          "max_score": 3,
          "response_type": "two_by_two_workspace",
          "list_count": null,
          "rubric": [
            "Sensitivity=34/(34+6)=0.85; Specificity=51/(51+9)=0.85. Partial marks: formula → working → answer."
          ],
          "must_have": [],
          "rc_classification": 3,
          "theme": "A"
        },
        {
          "id": "Q28_28b",
          "prompt": "Calculate PPV and NPV.",
          "max_score": 3,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "PPV=34/(34+9)=0.79; NPV=51/(51+6)=0.90. Partial marks: formula → working → answer."
          ],
          "must_have": [],
          "rc_classification": 3,
          "theme": "A"
        },
        {
          "id": "Q28_28c",
          "prompt": "Calculate LR+ and LR− and provide a one-sentence interpretation for each.",
          "max_score": 4,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "LR+=0.85/0.15≈5.7 (moderate rule-in). LR−=0.15/0.85≈0.18 (moderate rule-out). Partial marks: formula → working → answer/interpretation."
          ],
          "must_have": [],
          "rc_classification": 3,
          "theme": "A"
        },
        {
          "id": "Q28_28d",
          "prompt": "If group A strep pharyngitis prevalence decreases, which metrics change most and why?",
          "max_score": 2.5,
          "response_type": "text",
          "list_count": null,
          "rubric": [
            "PPV decreases and NPV increases as prevalence decreases (base-rate effect)."
          ],
          "must_have": [],
          "rc_classification": 3,
          "theme": "A",
          "single_line": true
        }
      ]
    },
    {
      "id": "Q29",
      "title": "Opioid Toxicity – Dashboard Indicators and Intervention Package",
      "stem": "An East coast city in your regional health authority is seeing a rise in opioid-related toxicity deaths. As the Regional MOH, you are asked for a population-health response that can be evaluated.",
      "parts": [
        {
          "id": "Q29_29a",
          "prompt": "List SIX population-level indicators for an opioid dashboard.",
          "max_score": 3,
          "response_type": "list",
          "list_count": 6,
          "rubric": [
            "Any SIX: deaths; non-fatal overdoses/ED; EMS calls; naloxone distribution/use; OAT coverage/retention; drug checking signals; supervised consumption utilization; housing instability; equity stratification where governed."
          ],
          "must_have": [],
          "rc_classification": 1,
          "theme": "C"
        },
        {
          "id": "Q29_29b",
          "prompt": "List SIX interventions across the prevention spectrum to prevent opioid-related overdose deaths.",
          "max_score": 3,
          "response_type": "list",
          "list_count": 6,
          "rubric": [
            "Any SIX: naloxone distribution; supervised consumption/overdose prevention; safer supply; low-barrier OAT access; peer post-overdose outreach; shelter-based harm reduction; integrated mental health supports; housing-first partnerships."
          ],
          "must_have": [],
          "rc_classification": 4,
          "theme": "C"
        }
      ]
    }
  ]
}
  const embeddedExamForms = {
  "version": "2.0.0",
  "updated_at": "2026-02-28T12:00:00Z",
  "forms": [
    {
      "form_id": "EXAM_30",
      "duration_sec": 1800,
      "total_points": 24,
      "question_ids": [
        "Q4",
        "Q1",
        "Q7",
        "Q3",
        "Q6",
        "Q2",
        "Q5"
      ],
      "notice": "Legacy 30-minute practice block."
    },
    {
      "form_id": "EXAM_180_V1",
      "duration_sec": 10800,
      "total_points": 180,
      "question_ids": [
        "Q24",
        "Q11",
        "Q03",
        "Q28",
        "Q17",
        "Q06",
        "Q25",
        "Q13",
        "Q20",
        "Q08",
        "Q02",
        "Q16",
        "Q27",
        "Q29",
        "Q15",
        "Q21",
        "Q09",
        "Q04",
        "Q10",
        "Q22",
        "Q18",
        "Q07",
        "Q19",
        "Q12",
        "Q05",
        "Q26",
        "Q23",
        "Q14",
        "Q01"
      ],
      "notice": ""
    }
  ]
}

  let examDataFull = {
    bank: embeddedQuestionBank,
    forms: embeddedExamForms,
    usingFallback: true,
    fallbackReason: 'Embedded defaults are in use.'
  };
  const landingSection = document.getElementById('landing');
  const examSection = document.getElementById('exam');
  const reviewSection = document.getElementById('review');
  const resultsSection = document.getElementById('results');

  // Grab references to start buttons for different exam modes
  const startFullBtn = document.getElementById('start-full');
  const startHalfBtn = document.getElementById('start-half');
  const startPracticeBtn = document.getElementById('start-practice');
  const dataWarning = document.getElementById('data-warning');
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

  const MODE_TO_FORM_ID = {
    full: 'EXAM_180_V1',
    practice: 'EXAM_30',
    half: 'EXAM_90'
  };

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
  let currentFormId = MODE_TO_FORM_ID.full;
  let currentFormTotalPoints = 0;

  // Persistent keys for localStorage
  const STORAGE_KEY_ANSWERS = 'saq_answers';
  const STORAGE_KEY_FLAGS = 'saq_flags';
  const STORAGE_KEY_TIME = 'saq_time_remaining';
  const STORAGE_KEY_SELECTED = 'saq_selected_ids';
  const STORAGE_KEY_MODE = 'saq_mode';
  const STORAGE_KEY_STARTED_AT = 'saq_started_at';
  const STORAGE_KEY_SCORES = 'saq_awarded_scores';
  const STORAGE_KEY_LAST_TICK = 'saq_last_tick_epoch_ms';

  function normalizeRubric(rubric) {
    if (Array.isArray(rubric)) return rubric;
    if (typeof rubric === 'string' && rubric.trim().length > 0) return [rubric];
    return [];
  }

  function normalizeQuestion(question, fallbackNumber) {
    const normalized = {
      id: question.id,
      title: question.title || `Question ${question.id || ''}`,
      stem: question.stem || question.questionStem || '',
      stem_image: question.stem_image || question.stemImage || '',
      number: question.number || fallbackNumber,
      parts: Array.isArray(question.parts)
        ? question.parts.map((part, idx) => ({
            id: part.id || `${question.id}_part_${idx + 1}`,
            prompt: part.prompt || '',
            max_score: Number(part.max_score) || 0,
            domain: part.domain || '',
            rubric: normalizeRubric(part.rubric),
            response_type: part.response_type || 'text',
            list_count: Number(part.list_count) || 0,
            rc_classification: part.rc_classification,
            theme: part.theme,
            must_have: Array.isArray(part.must_have) ? part.must_have : []
          }))
        : []
    };
    return normalized;
  }

  function normalizeBank(bank) {
    const questions = Array.isArray(bank && bank.questions) ? bank.questions : [];
    return {
      version: (bank && bank.version) || 'embedded',
      questions: questions.map((q, idx) => normalizeQuestion(q, idx + 1))
    };
  }

  function normalizeForms(formsData) {
    const forms = Array.isArray(formsData && formsData.forms) ? formsData.forms : [];
    return {
      version: (formsData && formsData.version) || 'embedded',
      forms: forms
        .filter((form) => form && form.form_id)
        .map((form) => ({
          form_id: form.form_id,
          duration_sec: Number(form.duration_sec) || 0,
          total_points: Number(form.total_points) || 0,
          question_ids: Array.isArray(form.question_ids) ? form.question_ids.slice() : [],
          notice: form.notice || ''
        }))
    };
  }

  function showDataWarning(message) {
    if (!dataWarning) return;
    dataWarning.textContent = message;
    dataWarning.classList.remove('hidden');
  }

  function hideDataWarning() {
    if (!dataWarning) return;
    dataWarning.classList.add('hidden');
    dataWarning.textContent = '';
  }

  function resolveQuestionsForForm(bank, form) {
    const questionById = {};
    bank.questions.forEach((question) => {
      questionById[question.id] = question;
    });
    const selectedQuestions = [];
    const missingIds = [];
    form.question_ids.forEach((id) => {
      if (questionById[id]) {
        selectedQuestions.push(JSON.parse(JSON.stringify(questionById[id])));
      } else {
        missingIds.push(id);
      }
    });
    return { selectedQuestions, missingIds };
  }

  function updateLandingButtonState() {
    const forms = examDataFull.forms.forms || [];
    const formIds = new Set(forms.map((form) => form.form_id));
    const fullForm = forms.find((form) => form.form_id === MODE_TO_FORM_ID.full);
    const fullResolved = fullForm
      ? resolveQuestionsForForm(examDataFull.bank, fullForm).missingIds.length === 0
      : false;
    if (startFullBtn) startFullBtn.disabled = !fullResolved;
    if (startHalfBtn) startHalfBtn.disabled = !formIds.has(MODE_TO_FORM_ID.half);
    if (startPracticeBtn) startPracticeBtn.disabled = !formIds.has(MODE_TO_FORM_ID.practice);

    if (!fullForm) {
      showDataWarning(`Warning: ${MODE_TO_FORM_ID.full} is missing from exam_forms.json.`);
      return;
    }
    const unresolved = resolveQuestionsForForm(examDataFull.bank, fullForm).missingIds;
    if (unresolved.length > 0) {
      showDataWarning(
        `Warning: ${MODE_TO_FORM_ID.full} cannot start because these question IDs are missing in the bank: ${unresolved.join(', ')}.`
      );
    } else if (!examDataFull.usingFallback) {
      hideDataWarning();
    }
  }

  function runBankSanityChecks() {
    const checks = [];
    const forms = examDataFull.forms.forms || [];
    const bankQuestions = examDataFull.bank.questions || [];
    const fullForm = forms.find((form) => form.form_id === MODE_TO_FORM_ID.full);
    checks.push({
      name: 'EXAM_180 form exists',
      ok: !!fullForm,
      detail: fullForm ? `Found ${fullForm.form_id}.` : 'EXAM_180_V1 is missing.'
    });

    const questionById = {};
    bankQuestions.forEach((q) => {
      questionById[q.id] = q;
    });

    const q4 = questionById.Q04;
    const q4HasHaddon = !!(
      q4 &&
      Array.isArray(q4.parts) &&
      q4.parts.some((part) => part.response_type === 'haddon_matrix')
    );
    checks.push({
      name: 'Q4 haddon_matrix wiring',
      ok: q4HasHaddon,
      detail: q4HasHaddon
        ? 'Q04 includes response_type=haddon_matrix and renderer supports it.'
        : 'Q04 part is not configured with response_type=haddon_matrix.'
    });

    const q11 = questionById.Q11;
    const q11ImagePath = q11 ? q11.stem_image || '' : '';
    const hasImageReference = !!q11ImagePath && /Q11table\.png$/i.test(q11ImagePath);
    checks.push({
      name: 'Q11 stem image reference',
      ok: hasImageReference,
      detail: hasImageReference
        ? `Q11 stem_image points to ${q11ImagePath}.`
        : 'Q11 does not reference Q11table.png.'
    });

    const imageProbe = new Image();
    imageProbe.onload = () => {
      checks.push({
        name: 'Q11 image file loads',
        ok: true,
        detail: `Loaded ${q11ImagePath}.`
      });
      reportSanityChecks(checks);
    };
    imageProbe.onerror = () => {
      checks.push({
        name: 'Q11 image file loads',
        ok: false,
        detail: `Could not load ${q11ImagePath || 'image path missing'}.`
      });
      reportSanityChecks(checks);
    };

    if (q11ImagePath) {
      imageProbe.src = q11ImagePath;
    } else {
      checks.push({ name: 'Q11 image file loads', ok: false, detail: 'No image path configured.' });
      reportSanityChecks(checks);
    }
  }

  function reportSanityChecks(checks) {
    const failures = checks.filter((check) => !check.ok);
    console.group('PHPM bank sanity checks');
    checks.forEach((check) => {
      const prefix = check.ok ? 'PASS' : 'FAIL';
      console.log(`[${prefix}] ${check.name}: ${check.detail}`);
    });
    console.groupEnd();
    if (failures.length > 0) {
      showDataWarning('Some data checks failed. See browser console for details.');
    }
  }

  async function loadExamData() {
    const fallback = {
      bank: normalizeBank(embeddedQuestionBank),
      forms: normalizeForms(embeddedExamForms),
      usingFallback: true,
      fallbackReason: 'Embedded defaults are in use.'
    };

    if (window.location.protocol === 'file:') {
      return {
        ...fallback,
        fallbackReason: 'Offline file:// mode detected. Using embedded defaults.'
      };
    }

    try {
      const [bankResp, formsResp] = await Promise.all([
        fetch('./question_bank.json', { cache: 'no-store' }),
        fetch('./exam_forms.json', { cache: 'no-store' })
      ]);
      if (!bankResp.ok || !formsResp.ok) {
        throw new Error(`HTTP ${bankResp.status}/${formsResp.status}`);
      }
      const [bankData, formsData] = await Promise.all([bankResp.json(), formsResp.json()]);
      return {
        bank: normalizeBank(bankData),
        forms: normalizeForms(formsData),
        usingFallback: false,
        fallbackReason: ''
      };
    } catch (error) {
      console.warn('Unable to fetch hosted JSON; using embedded fallback.', error);
      return {
        ...fallback,
        fallbackReason: 'Warning: failed to load hosted JSON; using embedded defaults.'
      };
    }
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
    const stem = document.createElement('p');
    stem.classList.add('question-stem');
    const visibleStemLines = (q.stem || '')
      .split('\n')
      .filter((line) => !/^\s*Sources?\s*\(brief\)/i.test(line));
    if (visibleStemLines.join('\n').trim().length > 0) {
      const lines = visibleStemLines;
      lines.forEach((line, idx) => {
        stem.appendChild(document.createTextNode(line));
        if (idx < lines.length - 1) {
          stem.appendChild(document.createElement('br'));
        }
      });
      container.appendChild(stem);
    }
    if (q.stem_image) {
      const stemImage = document.createElement('img');
      stemImage.src = q.stem_image;
      stemImage.alt = `Reference image for question ${q.number}`;
      stemImage.classList.add('question-stem-image');
      stemImage.addEventListener('error', () => {
        const imageWarning = document.createElement('p');
        imageWarning.classList.add('stem-missing-warning');
        imageWarning.textContent = `(Stem image missing: ${q.stem_image})`;
        container.appendChild(imageWarning);
      });
      container.appendChild(stemImage);
    }
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
      } else if (part.response_type === 'haddon_matrix') {
        const saved = getSavedAnswer(q.id, part.id);
        const [matrixRaw, workspaceRaw] = (saved || '').split('\n---\n');
        const items = matrixRaw ? matrixRaw.split('\n') : [];
        const matrix = document.createElement('table');
        matrix.classList.add('haddon-matrix');
        const standardRowLabels = ['Host', 'Agent/Vehicle', 'Physical/Social Environment'];
        const standardColLabels = ['Pre-event', 'During the event', 'Post-event'];
        const reverseAxes = !!part.haddon_time_as_rows;
        const rowLabels = reverseAxes ? standardColLabels : standardRowLabels;
        const colLabels = reverseAxes ? standardRowLabels : standardColLabels;

        const headerRow = document.createElement('tr');
        const corner = document.createElement('th');
        corner.classList.add('haddon-label');
        corner.scope = 'col';
        headerRow.appendChild(corner);
        colLabels.forEach((label) => {
          const col = document.createElement('th');
          col.classList.add('haddon-label');
          col.scope = 'col';
          col.textContent = label;
          headerRow.appendChild(col);
        });
        matrix.appendChild(headerRow);

        for (let row = 0; row < rowLabels.length; row++) {
          const tr = document.createElement('tr');
          const rowLabel = document.createElement('th');
          rowLabel.classList.add('haddon-label');
          rowLabel.scope = 'row';
          rowLabel.textContent = rowLabels[row];
          tr.appendChild(rowLabel);
          for (let col = 0; col < colLabels.length; col++) {
            const index = row * colLabels.length + col;
            const td = document.createElement('td');
            const input = document.createElement('textarea');
            input.classList.add('haddon-input');
            input.dataset.itemIndex = index;
            input.rows = 2;
            input.value = items[index] || '';
            td.appendChild(input);
            tr.appendChild(td);
          }
          matrix.appendChild(tr);
        }
        answerDiv.appendChild(matrix);
        if (part.haddon_include_workspace) {
          const workspaceLabel = document.createElement('label');
          workspaceLabel.classList.add('workspace-label');
          workspaceLabel.textContent = 'Calculation workspace:';
          const workspaceBox = document.createElement('textarea');
          workspaceBox.classList.add('haddon-workspace-input');
          workspaceBox.rows = 4;
          workspaceBox.value = workspaceRaw || '';
          answerDiv.appendChild(workspaceLabel);
          answerDiv.appendChild(workspaceBox);
        }
      } else if (part.response_type === 'two_by_two_workspace') {
        const saved = getSavedAnswer(q.id, part.id);
        let gridValues = Array(9).fill('');
        let workspaceValue = '';
        if (saved) {
          const [gridRaw, workspaceRaw] = saved.split('\n---\n');
          if (gridRaw) {
            const parsedGrid = gridRaw.split('\n').slice(0, 9);
            gridValues = gridValues.map((v, idx) => parsedGrid[idx] || v);
          }
          workspaceValue = workspaceRaw || '';
        }

        const workspace = document.createElement('div');
        workspace.classList.add('workspace-2x2');

        const grid = document.createElement('table');
        grid.classList.add('haddon-matrix');
        for (let row = 0; row < 3; row++) {
          const tr = document.createElement('tr');
          for (let col = 0; col < 3; col++) {
            const index = row * 3 + col;
            const td = document.createElement(row === 0 || col === 0 ? 'th' : 'td');
            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('workspace-cell');
            input.dataset.itemIndex = index;
            input.value = gridValues[index] || '';
            td.appendChild(input);
            tr.appendChild(td);
          }
          grid.appendChild(tr);
        }
        workspace.appendChild(grid);

        const workspaceLabel = document.createElement('label');
        workspaceLabel.classList.add('workspace-label');
        workspaceLabel.textContent = 'Calculation workspace:';
        const workspaceBox = document.createElement('textarea');
        workspaceBox.classList.add('two-by-two-workspace-input');
        workspaceBox.rows = 4;
        workspaceBox.value = workspaceValue;
        workspace.appendChild(workspaceLabel);
        workspace.appendChild(workspaceBox);

        answerDiv.appendChild(workspace);
      } else {
        // Render a textarea for free-form answer or a single-line input
        const useSingleLine = !!part.single_line;
        const value = getSavedAnswer(q.id, part.id);
        if (useSingleLine) {
          const input = document.createElement('input');
          input.type = 'text';
          input.classList.add('single-line-input');
          input.dataset.qId = q.id;
          input.dataset.partId = part.id;
          input.value = value;
          answerDiv.appendChild(input);
        } else {
        const textarea = document.createElement('textarea');
        textarea.dataset.qId = q.id;
        textarea.dataset.partId = part.id;
        textarea.value = value;
        answerDiv.appendChild(textarea);
        }
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
      } else if (responseType === 'haddon_matrix') {
        const inputs = area.querySelectorAll('.haddon-input');
        const lines = Array.from(inputs).map((inp) => inp.value.trim());
        const workspace = area.querySelector('.haddon-workspace-input');
        answers[qId][partId] = workspace
          ? `${lines.join('\n')}\n---\n${workspace.value}`
          : lines.join('\n');
      } else if (responseType === 'two_by_two_workspace') {
        const gridInputs = area.querySelectorAll('.workspace-cell');
        const gridLines = Array.from(gridInputs).map((inp) => inp.value.trim());
        const workspace = area.querySelector('.two-by-two-workspace-input');
        answers[qId][partId] = workspace
          ? `${gridLines.join('\n')}\n---\n${workspace.value}`
          : gridLines.join('\n');
      } else {
        const input = area.querySelector('input.single-line-input');
        if (input) {
          answers[qId][partId] = input.value.trim();
          return;
        }
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
        } else if (p.response_type === 'haddon_matrix') {
          const provided = (ans || '')
            .split('\n')
            .slice(0, 9)
            .filter((item) => item.trim().length > 0).length;
          if (provided < 9) {
            unanswered = true;
          }
        } else if (p.response_type === 'two_by_two_workspace') {
          const [gridRaw] = (ans || '').split('\n---\n');
          const providedGrid = (gridRaw || '')
            .split('\n')
            .slice(0, 9)
            .filter((item) => item.trim().length > 0).length;
          if (providedGrid === 0) {
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
      exam_form_id: currentFormId,
      remaining_time_sec: typeof remainingSec === 'number' ? remainingSec : 0,
      questions: activeQuestions.map((q) => {
        return {
          id: q.id,
          number: q.number,
          title: q.title || '',
          stem: q.stem || '',
          parts: q.parts.map((p) => {
            return {
              id: p.id,
              prompt: p.prompt,
              rubric: p.rubric,
              max_score: p.max_score,
              domain: p.domain,
              rc_classification: p.rc_classification,
              theme: p.theme,
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
      exam_form_id: currentFormId,
      questions: activeQuestions.map((q) => {
        return {
          id: q.id,
          number: q.number,
          title: q.title || '',
          stem: q.stem || '',
          parts: q.parts.map((p) => {
            const qScores = scores[q.id] || {};
            return {
              id: p.id,
              prompt: p.prompt,
              rubric: p.rubric,
              max_score: p.max_score,
              domain: p.domain,
              rc_classification: p.rc_classification,
              theme: p.theme,
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
      if (examDataFull.usingFallback) {
        showDataWarning(examDataFull.fallbackReason);
      } else {
        hideDataWarning();
      }
      updateLandingButtonState();
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
    const targetFormId = MODE_TO_FORM_ID[mode];
    const selectedForm = examDataFull.forms.forms.find((form) => form.form_id === targetFormId);
    if (!selectedForm) {
      alert(`Exam form ${targetFormId} is not available.`);
      return;
    }
    examDuration = selectedForm.duration_sec || 0;
    currentFormId = selectedForm.form_id;
    currentFormTotalPoints = Number(selectedForm.total_points) || 0;
    const resolved = resolveQuestionsForForm(examDataFull.bank, selectedForm);
    if (resolved.missingIds.length > 0) {
      alert(`Exam form ${selectedForm.form_id} is missing question IDs: ${resolved.missingIds.join(', ')}`);
      return;
    }
    const selected = resolved.selectedQuestions;
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
      const computedTotalPoints = activeQuestions.reduce((sum, q) => {
        return sum + q.parts.reduce((partSum, part) => partSum + (part.max_score || 0), 0);
      }, 0);
      const totalPoints = currentFormTotalPoints || computedTotalPoints;
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
      examDataFull = examData;
      if (examData.usingFallback) {
        showDataWarning(examData.fallbackReason);
      } else {
        hideDataWarning();
      }
    } catch (err) {
      console.error(err);
      showDataWarning('Warning: failed to initialize hosted bank data; using embedded defaults.');
      examData = {
        bank: normalizeBank(embeddedQuestionBank),
        forms: normalizeForms(embeddedExamForms),
        usingFallback: true,
        fallbackReason: 'Embedded defaults are in use.'
      };
      examDataFull = examData;
    }
    updateLandingButtonState();
    runBankSanityChecks();
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
        const targetFormId = MODE_TO_FORM_ID[savedMode];
        const savedForm = examData.forms.forms.find((form) => form.form_id === targetFormId);
        if (!savedForm) {
          throw new Error(`Saved exam form ${targetFormId} not found.`);
        }
        examDuration = savedForm.duration_sec || 0;
        currentFormId = savedForm.form_id;
        currentFormTotalPoints = Number(savedForm.total_points) || 0;
        // Rebuild activeQuestions using saved selected ids
        const ids = JSON.parse(savedSelected);
        const questionById = {};
        examData.bank.questions.forEach((q) => {
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
          const computedTotalPoints = activeQuestions.reduce((sum, q) => {
            return sum + q.parts.reduce((partSum, part) => partSum + (part.max_score || 0), 0);
          }, 0);
          const totalPoints = currentFormTotalPoints || computedTotalPoints;
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
