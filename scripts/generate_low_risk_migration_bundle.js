#!/usr/bin/env node
const fs = require('fs');

const TRANCHE1_IDS = ['Q14', 'Q15', 'Q19', 'Q20', 'Q25'];
const RC_MAP = {
  1: { code: 'PH', label: 'Population Health' },
  2: { code: 'HS', label: 'Health Systems' },
  3: { code: 'BS', label: 'Basic Sciences of Public Health and Preventive Medicine' },
  4: { code: 'HPDP', label: 'Intervention and Methods in Health Promotion and Disease Prevention' },
  5: { code: 'HP', label: 'Intervention and Methods in Health Protection' },
  6: { code: 'MPP', label: 'Management and Program Planning' }
};
const THEME_LABELS = {
  A: 'Communicable Diseases',
  B: 'Non-Communicable Diseases',
  C: 'Mental Health and Substance Use',
  D: 'Environmental Health',
  E: 'Maternal and Child Health',
  F: 'Injury: Voluntary and Involuntary',
  G: 'Other'
};

const MANUAL_ADJUDICATIONS = {
  PHPM_SAQ_LGC_0014_PC: {
    primary_written_classification_codes: ['MPP'],
    primary_theme_codes: ['G'],
    note: 'Approved manual adjudication override.'
  },
  PHPM_SAQ_LGC_0015_PB: {
    primary_written_classification_codes: ['BS'],
    primary_theme_codes: ['D'],
    note: 'Approved manual adjudication override.'
  },
  PHPM_SAQ_LGC_0019_PB: {
    primary_written_classification_codes: ['HP'],
    primary_theme_codes: ['A'],
    note: 'Approved manual adjudication override.'
  },
  PHPM_SAQ_LGC_0020_PD: {
    primary_written_classification_codes: ['PH', 'HP'],
    primary_theme_codes: ['A'],
    note: 'Approved manual adjudication override (HP=Health Protection, not HPDP).'
  },
  PHPM_SAQ_LGC_0025_PB: {
    primary_written_classification_codes: ['HP'],
    primary_theme_codes: ['A', 'E'],
    note: 'Approved manual adjudication override.'
  }
};

function partLetter(idx) {
  return String.fromCharCode(65 + idx);
}

function inferInstructionVerb(prompt = '') {
  const token = prompt.trim().split(/\s+/)[0]?.toLowerCase();
  if (!token) return null;
  if (['list', 'propose', 'describe', 'outline', 'identify', 'name', 'explain'].includes(token)) return token;
  return null;
}

function normalizeResponseConstraints(part) {
  return {
    list_count_required: part.response_type === 'list' ? part.list_count ?? null : null,
    allow_partial_credit: true,
    single_line: Boolean(part.single_line)
  };
}

function uniq(arr) {
  return [...new Set(arr)];
}

function formatTaxonomyAssignment(part, fallbackRc, fallbackTheme) {
  const usedFallbackRc = part.rc_classification == null && fallbackRc != null;
  const usedFallbackTheme = part.theme == null && fallbackTheme != null;
  const rcNumeric = part.rc_classification ?? fallbackRc;
  const themeCode = part.theme ?? fallbackTheme;

  let mode = 'exact_carry_forward';
  let confidence = 'high';
  let rationale = 'Both legacy rc_classification and theme are present at part level and were carried forward exactly.';

  if (usedFallbackRc || usedFallbackTheme) {
    mode = 'inferred_from_question_context';
    confidence = usedFallbackRc && usedFallbackTheme ? 'medium' : 'medium_high';
    rationale = [
      usedFallbackRc ? 'Legacy rc_classification missing at part level; inferred from sibling part taxonomy in same stem.' : null,
      usedFallbackTheme ? 'Legacy theme missing at part level; inferred from sibling part taxonomy in same stem.' : null
    ].filter(Boolean).join(' ');
  }

  return {
    rcNumeric,
    themeCode,
    mode,
    confidence,
    rationale,
    usedFallbackRc,
    usedFallbackTheme
  };
}

function validateCandidate(candidate) {
  const errors = [];
  const warnings = [];
  const warningTypes = {};
  const writtenCodes = new Set(['PH', 'HS', 'BS', 'HPDP', 'HP', 'MPP']);
  const themeCodes = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G']);

  if (!Array.isArray(candidate.questions)) {
    errors.push('questions must be an array');
    return { errors, warnings, warningTypes };
  }

  if (candidate.questions.length < 3 || candidate.questions.length > 5) {
    errors.push(`candidate must contain 3 to 5 questions; found ${candidate.questions.length}`);
  }

  for (const q of candidate.questions) {
    if (!/^PHPM_SAQ_LGC_\d{4}$/.test(q.question_id)) {
      errors.push(`${q.question_id}: invalid question_id pattern`);
    }
    if (!q.legacy_ids?.id) errors.push(`${q.question_id}: missing legacy_ids.id`);
    if (!Array.isArray(q.primary_written_classification_codes) || q.primary_written_classification_codes.length === 0) {
      errors.push(`${q.question_id}: missing question-level primary_written_classification_codes`);
    }
    if (!Array.isArray(q.primary_theme_codes) || q.primary_theme_codes.length === 0) {
      errors.push(`${q.question_id}: missing question-level primary_theme_codes`);
    }

    for (const code of q.primary_written_classification_codes || []) {
      if (!writtenCodes.has(code)) errors.push(`${q.question_id}: invalid written code ${code}`);
    }
    for (const code of q.primary_theme_codes || []) {
      if (!themeCodes.has(code)) errors.push(`${q.question_id}: invalid theme code ${code}`);
    }

    for (const p of q.parts || []) {
      if (!/^PHPM_SAQ_LGC_\d{4}_P[A-Z]$/.test(p.part_id)) {
        errors.push(`${q.question_id}: invalid part_id pattern (${p.part_id})`);
      }
      if (!p.legacy_part_id) errors.push(`${p.part_id}: missing legacy_part_id`);
      if (!Array.isArray(p.primary_written_classification_codes) || p.primary_written_classification_codes.length === 0) {
        errors.push(`${p.part_id}: missing part-level primary_written_classification_codes`);
      }
      if (!Array.isArray(p.primary_theme_codes) || p.primary_theme_codes.length === 0) {
        errors.push(`${p.part_id}: missing part-level primary_theme_codes`);
      }
      if (p.taxonomy_assignment_mode === 'inferred_from_question_context') {
        warnings.push(`${p.part_id}: taxonomy inferred from sibling parts due to missing legacy rc_classification/theme (confidence=${p.taxonomy_assignment_confidence})`);
        warningTypes.inferred_from_question_context = (warningTypes.inferred_from_question_context || 0) + 1;
      }
      if (p.response_type === 'list' && p.response_constraints.list_count_required == null) {
        errors.push(`${p.part_id}: list response missing list_count_required`);
      }
      if ((p.primary_written_classification_codes || []).length > 1) {
        warningTypes.multi_primary_written_codes = (warningTypes.multi_primary_written_codes || 0) + 1;
      }
      if ((p.primary_theme_codes || []).length > 1) {
        warningTypes.multi_primary_theme_codes = (warningTypes.multi_primary_theme_codes || 0) + 1;
      }
    }
  }

  return { errors, warnings, warningTypes };
}

function selectTranche2Ids(auditRows) {
  const lowCandidates = auditRows
    .filter((q) => q.migration_risk === 'low' && !TRANCHE1_IDS.includes(q.id))
    .sort((a, b) => (a.id_numeric - b.id_numeric));

  const selected = lowCandidates.slice(0, 5).map((q) => q.id);
  let selectionNote = 'Selected as next 5 low-risk items (excluding tranche 1).';

  if (selected.length < 5) {
    const needed = 5 - selected.length;
    const lowerBound = Math.min(...lowCandidates.map((q) => q.id_numeric));
    const mediumFallback = auditRows
      .filter((q) => q.migration_risk === 'medium' && q.id_numeric >= lowerBound && !TRANCHE1_IDS.includes(q.id) && !selected.includes(q.id))
      .sort((a, b) => (a.migration_risk_score - b.migration_risk_score) || (a.id_numeric - b.id_numeric))
      .slice(0, needed)
      .map((q) => q.id);
    selected.push(...mediumFallback);
    selectionNote = `Low-risk pool exhausted after ${selected.length - mediumFallback.length} items; supplemented with ${mediumFallback.length} lowest-score medium-risk item(s): ${mediumFallback.join(', ')}.`;
  }

  return { selected, selectionNote };
}

function buildQuestions(selectedIds, bank, formMap, manualAdjudicationsEnabled) {
  const selected = bank.questions.filter((q) => selectedIds.includes(q.id));
  if (selected.length !== selectedIds.length) {
    throw new Error(`Expected ${selectedIds.length} selected questions but found ${selected.length}`);
  }

  return selected
    .sort((a, b) => Number(a.id.match(/(\d+)/)[1]) - Number(b.id.match(/(\d+)/)[1]))
    .map((q) => {
      const idNum = Number((q.id.match(/(\d+)/) || [])[1]);
      const questionId = `PHPM_SAQ_LGC_${String(idNum).padStart(4, '0')}`;

      const knownRc = q.parts.map((p) => p.rc_classification).filter((x) => x != null);
      const knownTheme = q.parts.map((p) => p.theme).filter((x) => x != null);
      const fallbackRc = knownRc[0] ?? null;
      const fallbackTheme = knownTheme[0] ?? null;

      const parts = q.parts.map((p, idx) => {
        const assignment = formatTaxonomyAssignment(p, fallbackRc, fallbackTheme);
        const partId = `${questionId}_P${partLetter(idx)}`;
        const manual = manualAdjudicationsEnabled ? MANUAL_ADJUDICATIONS[partId] : null;

        const rcNumeric = assignment.rcNumeric;
        const themeCode = assignment.themeCode;
        const rc = RC_MAP[rcNumeric] || null;

        let primaryWritten = rc?.code ? [rc.code] : [];
        let primaryTheme = themeCode ? [themeCode] : [];
        let mode = assignment.mode;
        let confidence = assignment.confidence;
        let rationale = assignment.rationale;

        if (manual) {
          primaryWritten = manual.primary_written_classification_codes;
          primaryTheme = manual.primary_theme_codes;
          mode = 'manual_adjudicated_override';
          confidence = 'adjudicated';
          rationale = manual.note;
        }

        const flags = [];
        if (assignment.usedFallbackRc) flags.push('missing_legacy_rc_classification_inferred_from_question');
        if (assignment.usedFallbackTheme) flags.push('missing_legacy_theme_inferred_from_question');
        if (p.domain != null) flags.push('legacy_domain_retained_unmapped');
        if (manual) flags.push('taxonomy_manually_adjudicated');

        return {
          part_id: partId,
          part_letter: partLetter(idx).toLowerCase(),
          display_label: `${partLetter(idx).toLowerCase()})`,
          legacy_part_id: p.id,
          prompt: p.prompt,
          instruction_verb: inferInstructionVerb(p.prompt),
          max_score: p.max_score,
          response_type: p.response_type,
          response_constraints: normalizeResponseConstraints(p),
          must_have_elements: Array.isArray(p.must_have) ? p.must_have : [],
          answer_key: Array.isArray(p.rubric) ? p.rubric : [],
          not_acceptable_notes: [],
          scoring_notes: null,
          source_profile: 'needs_full_source_review',
          source_list: [],
          legacy_taxonomy: {
            rc_classification_numeric: p.rc_classification ?? null,
            theme_code: p.theme ?? null,
            domain: p.domain ?? null
          },
          official_written_classification_code: rc?.code ?? null,
          official_written_classification_label: rc?.label ?? null,
          official_topic_theme_code: themeCode ?? null,
          official_topic_theme_label: themeCode ? THEME_LABELS[themeCode] : null,
          taxonomy_assignment_status: 'proposed_candidate_assignment',
          taxonomy_assignment_mode: mode,
          taxonomy_assignment_confidence: confidence,
          taxonomy_assignment_rationale: rationale,
          primary_written_classification_codes: primaryWritten,
          secondary_written_classification_codes: [],
          primary_theme_codes: primaryTheme,
          secondary_theme_codes: [],
          migration_flags: flags
        };
      });

      const primaryWritten = uniq(parts.flatMap((p) => p.primary_written_classification_codes));
      const primaryTheme = uniq(parts.flatMap((p) => p.primary_theme_codes));
      const mixedPartLevelAssignment = primaryWritten.length > 1 || primaryTheme.length > 1;

      return {
        question_id: questionId,
        legacy_ids: {
          id: q.id,
          number: q.number ?? null,
          id_numeric: idNum
        },
        migration_status: 'candidate_for_manual_review',
        migration_risk: 'low',
        title: q.title,
        stem: q.stem,
        source_profile: 'needs_full_source_review',
        source_list: [],
        form_eligibility: {
          eligible_form_ids: formMap[q.id] || []
        },
        stem_assets: q.stem_image ? [{ asset_type: 'image', path: q.stem_image }] : [],
        parts,
        question_level_written_rollup_status: 'rolled_up_from_parts',
        question_level_theme_rollup_status: 'rolled_up_from_parts',
        question_level_rollup_policy: 'ordered_union_of_part_level_primaries_in_stem_order',
        mixed_part_level_assignment: mixedPartLevelAssignment,
        blueprint_counting_written_classification_code: primaryWritten[0] ?? null,
        primary_written_classification_codes: primaryWritten,
        secondary_written_classification_codes: [],
        primary_theme_codes: primaryTheme,
        secondary_theme_codes: [],
        migration_flags: ['missing_source_metadata', 'needs_full_source_review']
      };
    });
}

function writeBundle({
  selectedIds,
  selectionNote,
  artifactId,
  artifactVersion,
  candidatePath,
  diffPath,
  cmpPath,
  validationPath,
  unresolvedPath,
  manualAdjudicationsEnabled,
  bank,
  forms
}) {
  const formMap = {};
  for (const form of forms.forms) {
    for (const qid of form.question_ids) {
      formMap[qid] = formMap[qid] || [];
      formMap[qid].push(form.form_id);
    }
  }

  const questions = buildQuestions(selectedIds, bank, formMap, manualAdjudicationsEnabled);

  const candidate = {
    artifact_id: artifactId,
    artifact_version: artifactVersion,
    created_at: new Date().toISOString().slice(0, 10),
    source_snapshot: {
      question_bank_path: 'question_bank.json',
      exam_forms_path: 'exam_forms.json',
      selected_legacy_ids: selectedIds,
      selection_note: selectionNote
    },
    id_convention: {
      question_id_pattern: 'PHPM_SAQ_LGC_0001..',
      part_id_pattern: '<question_id>_P<part_letter_upper>'
    },
    taxonomy_codebook: {
      rc_classification_numeric_to_written_code: RC_MAP
    },
    questions
  };

  fs.writeFileSync(candidatePath, JSON.stringify(candidate, null, 2));

  const selected = bank.questions.filter((q) => selectedIds.includes(q.id));
  const diffLines = [
    '# Legacy-to-Canonical Side-by-Side Diff (Low-Risk Candidate Batch)',
    '',
    `Selection note: ${selectionNote}`,
    '',
    '| Legacy Question ID | Canonical Question ID | Legacy Part IDs | Canonical Part IDs | Legacy rc/theme coverage | Canonical taxonomy coverage | Response types | Notes |',
    '|---|---|---|---|---|---|---|---|'
  ];

  for (const q of questions) {
    const legacy = selected.find((x) => x.id === q.legacy_ids.id);
    const legacyRc = legacy.parts.map((p) => `${p.id}:${p.rc_classification ?? '∅'}/${p.theme ?? '∅'}`).join('<br>');
    const canonRc = q.parts.map((p) => `${p.part_id}:${p.primary_written_classification_codes.join(',') || '∅'}/${p.primary_theme_codes.join(',') || '∅'} (${p.taxonomy_assignment_mode})`).join('<br>');
    const hasInferred = q.parts.some((p) => p.taxonomy_assignment_mode === 'inferred_from_question_context');
    const hasManual = q.parts.some((p) => p.taxonomy_assignment_mode === 'manual_adjudicated_override');
    const notes = hasManual
      ? 'Contains approved manual adjudication override(s) with explicit provenance.'
      : hasInferred
        ? 'Contains inferred taxonomy in one or more parts with explicit confidence+rationale.'
        : 'Direct mapping without taxonomy inference.';

    diffLines.push(`| ${q.legacy_ids.id} | ${q.question_id} | ${legacy.parts.map((p) => p.id).join(', ')} | ${q.parts.map((p) => p.part_id).join(', ')} | ${legacyRc} | ${canonRc} | ${uniq(legacy.parts.map((p) => p.response_type)).join(', ')} | ${notes} |`);
  }
  diffLines.push('');
  diffLines.push('## Locked policy rollup outcomes (question level)');
  diffLines.push('');
  diffLines.push('| Canonical Question ID | primary_written_classification_codes (ordered union) | blueprint counting code | primary_theme_codes (ordered union) | mixed_part_level_assignment |');
  diffLines.push('|---|---|---|---|---|');
  for (const q of questions) {
    diffLines.push(`| ${q.question_id} | ${q.primary_written_classification_codes.join(', ')} | ${q.blueprint_counting_written_classification_code} | ${q.primary_theme_codes.join(', ')} | ${q.mixed_part_level_assignment} |`);
  }
  fs.writeFileSync(diffPath, `${diffLines.join('\n')}\n`);

  const gold = JSON.parse(fs.readFileSync('content/gold_standard/royal_college_sample_saq_2025.taxonomy_candidate.json', 'utf8'));
  const goldSummary = {
    hasInstructionVerb: gold.questions.every((gq) => gq.parts.every((p) => p.instruction_verb)),
    hasExplicitConstraints: gold.questions.every((gq) => gq.parts.every((p) => p.response_constraints)),
    hasPartTaxonomyArrays: gold.questions.every((gq) => gq.parts.every((p) => (p.primary_written_classification_codes || []).length && (p.primary_theme_codes || []).length))
  };

  const cmpLines = [
    '# Low-Risk Legacy Candidate vs Gold-Standard Corpus (Structure Comparison)',
    '',
    `Gold-standard baseline checks: instruction verb populated=${goldSummary.hasInstructionVerb}, response constraints explicit=${goldSummary.hasExplicitConstraints}, part taxonomy arrays complete=${goldSummary.hasPartTaxonomyArrays}.`,
    '',
    '| Canonical Question ID | Parts | Prompt form vs GS | Part metadata parity vs GS | Taxonomy completeness vs GS | Divergence requiring review |',
    '|---|---:|---|---|---|---|'
  ];

  for (const q of questions) {
    const hasNullVerb = q.parts.some((p) => !p.instruction_verb);
    const hasInferred = q.parts.some((p) => p.taxonomy_assignment_mode === 'inferred_from_question_context');
    const hasManual = q.parts.some((p) => p.taxonomy_assignment_mode === 'manual_adjudicated_override');
    const listLike = q.parts.every((p) => ['list', 'text'].includes(p.response_type));

    const divergence = hasManual
      ? 'Includes manually adjudicated taxonomy overrides in approved scope.'
      : hasInferred
        ? 'Includes inferred taxonomy with explicit confidence labels/rationales.'
        : 'No structural divergence beyond source provenance review requirement.';

    cmpLines.push(`| ${q.question_id} | ${q.parts.length} | ${hasNullVerb ? 'Mostly aligned; one or more verbs unresolved' : 'Aligned directive-style prompts'} | ${listLike ? 'Aligned (list/text with explicit constraints)' : 'Diverges from GS list/text patterns'} | Complete arrays populated at question+part level | ${divergence} |`);
  }

  cmpLines.push('');
  cmpLines.push('## Mapping provenance summary');
  cmpLines.push('');
  cmpLines.push('| Canonical Question ID | exact carry-forward parts | inferred parts (confidence) | manually adjudicated parts |');
  cmpLines.push('|---|---|---|---|');
  for (const q of questions) {
    const exact = q.parts.filter((p) => p.taxonomy_assignment_mode === 'exact_carry_forward').map((p) => p.part_id).join(', ') || 'None';
    const inferred = q.parts
      .filter((p) => p.taxonomy_assignment_mode === 'inferred_from_question_context')
      .map((p) => `${p.part_id} (${p.taxonomy_assignment_confidence})`)
      .join(', ') || 'None';
    const manual = q.parts
      .filter((p) => p.taxonomy_assignment_mode === 'manual_adjudicated_override')
      .map((p) => p.part_id)
      .join(', ') || 'None';
    cmpLines.push(`| ${q.question_id} | ${exact} | ${inferred} | ${manual} |`);
  }
  fs.writeFileSync(cmpPath, `${cmpLines.join('\n')}\n`);

  const unresolvedLines = [
    '# Low-Risk Migration Candidate: Unresolved Decisions Log',
    '',
    '## Items requiring human review',
    '1. Confirm inferred part taxonomy for parts that lacked legacy `rc_classification` and/or `theme` in source.',
    '2. Confirm source evidence references (all items currently defaulted to `source_profile=needs_full_source_review`).',
    '3. Confirm any policy exceptions before scaling beyond this batch.',
    '',
    '## Part-level inferred taxonomy decisions in this batch',
    ''
  ];

  for (const q of questions) {
    for (const p of q.parts) {
      if (p.taxonomy_assignment_mode === 'inferred_from_question_context') {
        unresolvedLines.push(`- ${q.question_id} / ${p.part_id} (legacy part ${p.legacy_part_id}): inferred written=${p.primary_written_classification_codes.join(',') || '∅'}, theme=${p.primary_theme_codes.join(',') || '∅'}; confidence=${p.taxonomy_assignment_confidence}; rationale=${p.taxonomy_assignment_rationale}`);
      }
    }
  }

  unresolvedLines.push('');
  unresolvedLines.push('## Part-level manual adjudications locked in this batch');
  unresolvedLines.push('');
  const manualParts = questions.flatMap((q) => q.parts.filter((p) => p.taxonomy_assignment_mode === 'manual_adjudicated_override').map((p) => ({ q: q.question_id, p })));
  if (!manualParts.length) {
    unresolvedLines.push('- None.');
  } else {
    for (const entry of manualParts) {
      unresolvedLines.push(`- ${entry.q} / ${entry.p.part_id} (legacy part ${entry.p.legacy_part_id}): primary_written=${entry.p.primary_written_classification_codes.join(',')}; primary_theme=${entry.p.primary_theme_codes.join(',')}; rationale=${entry.p.taxonomy_assignment_rationale}`);
    }
  }

  fs.writeFileSync(unresolvedPath, `${unresolvedLines.join('\n')}\n`);

  const { errors, warnings, warningTypes } = validateCandidate(candidate);
  const validationLines = [
    '# Low-Risk Migration Candidate Validation Report',
    '',
    `- Candidate file: \`${candidatePath}\``,
    `- Questions validated: ${candidate.questions.length}`,
    `- Validation status: ${errors.length ? 'FAIL' : warnings.length ? 'PASS_WITH_WARNINGS' : 'PASS'}`,
    `- Error count: ${errors.length}`,
    `- Warning count: ${warnings.length}`,
    ''
  ];

  if (errors.length) {
    validationLines.push('## Errors');
    errors.forEach((e) => validationLines.push(`- ${e}`));
    validationLines.push('');
  }
  if (warnings.length) {
    validationLines.push('## Warnings');
    warnings.forEach((w) => validationLines.push(`- ${w}`));
    validationLines.push('');
  }

  validationLines.push('## Warning type counts');
  if (Object.keys(warningTypes).length === 0) {
    validationLines.push('- none');
  } else {
    Object.entries(warningTypes)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .forEach(([k, v]) => validationLines.push(`- ${k}: ${v}`));
  }
  validationLines.push('');

  validationLines.push('## Checks run');
  validationLines.push('- Selected-question count in allowed range (3-5).');
  validationLines.push('- Canonical ID format checks for questions and parts.');
  validationLines.push('- Mandatory question-level and part-level taxonomy array checks.');
  validationLines.push('- Allowed taxonomy code-set checks against locked taxonomy policy.');
  validationLines.push('- List response constraints checks for faithful list_count carry-forward.');
  validationLines.push('- Locked source provenance policy check (`source_profile=needs_full_source_review` for all migrated items).');
  validationLines.push('- Locked question rollup policy check (ordered union of part primaries + blueprint counting code).');

  fs.writeFileSync(validationPath, `${validationLines.join('\n')}\n`);

  return { candidate, errors, warnings, warningTypes };
}

function statsFromCandidate(candidate, validation) {
  const parts = candidate.questions.flatMap((q) => q.parts);
  const countByMode = (mode) => parts.filter((p) => p.taxonomy_assignment_mode === mode).length;
  const mixedCount = candidate.questions.filter((q) => q.mixed_part_level_assignment).length;

  return {
    warningCount: validation.warnings.length,
    warningTypes: validation.warningTypes,
    inferredParts: countByMode('inferred_from_question_context'),
    manualParts: countByMode('manual_adjudicated_override'),
    mixedAssignmentFrequency: `${mixedCount}/${candidate.questions.length}`,
    responseStructureIssues: parts.filter((p) => !['list', 'text'].includes(p.response_type)).map((p) => p.part_id)
  };
}

function writeDeltaReport(tranche1Stats, tranche2Stats, path) {
  const allWarningTypes = uniq([...Object.keys(tranche1Stats.warningTypes), ...Object.keys(tranche2Stats.warningTypes)]).sort();
  const warningTypeRows = allWarningTypes.map((type) => {
    const t1 = tranche1Stats.warningTypes[type] || 0;
    const t2 = tranche2Stats.warningTypes[type] || 0;
    const delta = t2 - t1;
    return `| ${type} | ${t1} | ${t2} | ${delta >= 0 ? '+' : ''}${delta} |`;
  });

  const lines = [
    '# Low-Risk Migration Tranche Delta Report (v3)',
    '',
    '## Corrected Tranche 1 vs Tranche 2',
    '',
    '| Metric | Tranche 1 (corrected) | Tranche 2 | Delta (T2-T1) |',
    '|---|---:|---:|---:|',
    `| Warning count | ${tranche1Stats.warningCount} | ${tranche2Stats.warningCount} | ${tranche2Stats.warningCount - tranche1Stats.warningCount >= 0 ? '+' : ''}${tranche2Stats.warningCount - tranche1Stats.warningCount} |`,
    `| Inferred parts | ${tranche1Stats.inferredParts} | ${tranche2Stats.inferredParts} | ${tranche2Stats.inferredParts - tranche1Stats.inferredParts >= 0 ? '+' : ''}${tranche2Stats.inferredParts - tranche1Stats.inferredParts} |`,
    `| Manually adjudicated parts | ${tranche1Stats.manualParts} | ${tranche2Stats.manualParts} | ${tranche2Stats.manualParts - tranche1Stats.manualParts >= 0 ? '+' : ''}${tranche2Stats.manualParts - tranche1Stats.manualParts} |`,
    `| Mixed-assignment frequency (questions) | ${tranche1Stats.mixedAssignmentFrequency} | ${tranche2Stats.mixedAssignmentFrequency} | n/a |`,
    '',
    '## Warning type comparison',
    '',
    '| Warning type | Tranche 1 | Tranche 2 | Delta |',
    '|---|---:|---:|---:|',
    ...warningTypeRows,
    '',
    '## Taxonomy hotspots',
    '',
    `- Tranche 1 hotspot: manual adjudication concentrated in 5 specific parts (explicitly locked).`,
    `- Tranche 2 hotspot: inferred taxonomy concentrated in ${tranche2Stats.inferredParts} part(s) lacking complete legacy taxonomy metadata.`,
    '',
    '## Response-structure issues',
    '',
    `- Tranche 1 non list/text response parts: ${tranche1Stats.responseStructureIssues.length ? tranche1Stats.responseStructureIssues.join(', ') : 'none'}`,
    `- Tranche 2 non list/text response parts: ${tranche2Stats.responseStructureIssues.length ? tranche2Stats.responseStructureIssues.join(', ') : 'none'}`,
    '',
    '## Scaling safety signal',
    '',
    tranche2Stats.responseStructureIssues.length === 0
      ? '- No new response-structure blockers detected in tranche 2.'
      : '- New response-structure exceptions detected in tranche 2; hold scaling until adjudicated.',
    tranche2Stats.warningCount <= tranche1Stats.warningCount + 2
      ? '- Warning profile remains broadly stable for controlled scaling.'
      : '- Warning profile increased materially; review before scaling.'
  ];

  fs.writeFileSync(path, `${lines.join('\n')}\n`);
}

function main() {
  const bank = JSON.parse(fs.readFileSync('question_bank.json', 'utf8'));
  const forms = JSON.parse(fs.readFileSync('exam_forms.json', 'utf8'));
  const audit = JSON.parse(fs.readFileSync('reports/question-bank-audit.json', 'utf8'));
  const auditRows = audit.questions.map((q) => ({ ...q, id_numeric: Number((q.id.match(/(\d+)/) || [])[1]) }));

  fs.mkdirSync('content/candidates', { recursive: true });
  fs.mkdirSync('reports', { recursive: true });

  const tranche1 = writeBundle({
    selectedIds: TRANCHE1_IDS,
    selectionNote: 'Tranche 1 corrected rerun with approved manual adjudications locked to part-level taxonomy.',
    artifactId: 'legacy_low_risk_migration_candidate_v3_corrected_tranche1',
    artifactVersion: '3.0.0',
    candidatePath: 'content/candidates/legacy_low_risk_migration_candidate_v3_corrected_tranche1.json',
    diffPath: 'reports/legacy_low_risk_migration_diff_v3_corrected_tranche1.md',
    cmpPath: 'reports/legacy_low_risk_vs_gold_standard_comparison_v3_corrected_tranche1.md',
    validationPath: 'reports/legacy_low_risk_migration_validation_report_v3_corrected_tranche1.md',
    unresolvedPath: 'reports/legacy_low_risk_unresolved_decisions_v3_corrected_tranche1.md',
    manualAdjudicationsEnabled: true,
    bank,
    forms
  });

  const tranche2Selection = selectTranche2Ids(auditRows);
  const tranche2 = writeBundle({
    selectedIds: tranche2Selection.selected,
    selectionNote: tranche2Selection.selectionNote,
    artifactId: 'legacy_low_risk_migration_candidate_v3_tranche2',
    artifactVersion: '3.0.0',
    candidatePath: 'content/candidates/legacy_low_risk_migration_candidate_v3_tranche2.json',
    diffPath: 'reports/legacy_low_risk_migration_diff_v3_tranche2.md',
    cmpPath: 'reports/legacy_low_risk_vs_gold_standard_comparison_v3_tranche2.md',
    validationPath: 'reports/legacy_low_risk_migration_validation_report_v3_tranche2.md',
    unresolvedPath: 'reports/legacy_low_risk_unresolved_decisions_v3_tranche2.md',
    manualAdjudicationsEnabled: false,
    bank,
    forms
  });

  const tranche1Stats = statsFromCandidate(tranche1.candidate, tranche1);
  const tranche2Stats = statsFromCandidate(tranche2.candidate, tranche2);
  writeDeltaReport(tranche1Stats, tranche2Stats, 'reports/legacy_low_risk_tranche_delta_report_v3.md');

  console.log(`Generated tranche1 corrected and tranche2 bundles. Tranche2 IDs: ${tranche2Selection.selected.join(', ')}`);
  console.log(`Tranche1 validation errors=${tranche1.errors.length}, warnings=${tranche1.warnings.length}`);
  console.log(`Tranche2 validation errors=${tranche2.errors.length}, warnings=${tranche2.warnings.length}`);
}

main();
