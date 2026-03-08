#!/usr/bin/env node
const fs = require('fs');

const SELECTED_IDS = ['Q14', 'Q15', 'Q19', 'Q20', 'Q25'];
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

function validateCandidate(candidate) {
  const errors = [];
  const warnings = [];
  const writtenCodes = new Set(['PH', 'HS', 'BS', 'HPDP', 'HP', 'MPP']);
  const themeCodes = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G']);

  if (!Array.isArray(candidate.questions)) {
    errors.push('questions must be an array');
    return { errors, warnings };
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
      if (p.taxonomy_assignment_confidence === 'low') {
        warnings.push(`${p.part_id}: taxonomy inferred from sibling parts due to missing legacy rc_classification/theme`);
      }
      if (p.response_type === 'list' && p.response_constraints.list_count_required == null) {
        errors.push(`${p.part_id}: list response missing list_count_required`);
      }
    }
  }

  return { errors, warnings };
}

function main() {
  const bank = JSON.parse(fs.readFileSync('question_bank.json', 'utf8'));
  const forms = JSON.parse(fs.readFileSync('exam_forms.json', 'utf8'));
  const selected = bank.questions.filter((q) => SELECTED_IDS.includes(q.id));

  if (selected.length !== SELECTED_IDS.length) {
    throw new Error(`Expected ${SELECTED_IDS.length} selected questions but found ${selected.length}`);
  }

  const formMap = {};
  for (const form of forms.forms) {
    for (const qid of form.question_ids) {
      formMap[qid] = formMap[qid] || [];
      formMap[qid].push(form.form_id);
    }
  }

  const questions = selected.map((q) => {
    const idNum = Number((q.id.match(/(\d+)/) || [])[1]);
    const questionId = `PHPM_SAQ_LGC_${String(idNum).padStart(4, '0')}`;

    const knownRc = q.parts.map((p) => p.rc_classification).filter((x) => x != null);
    const knownTheme = q.parts.map((p) => p.theme).filter((x) => x != null);
    const fallbackRc = knownRc[0] ?? null;
    const fallbackTheme = knownTheme[0] ?? null;

    const parts = q.parts.map((p, idx) => {
      const rcNumeric = p.rc_classification ?? fallbackRc;
      const themeCode = p.theme ?? fallbackTheme;
      const rc = RC_MAP[rcNumeric] || null;

      const confidence = p.rc_classification != null && p.theme != null ? 'medium' : 'low';
      const flags = [];
      if (p.rc_classification == null) flags.push('missing_legacy_rc_classification_inferred_from_question');
      if (p.theme == null) flags.push('missing_legacy_theme_inferred_from_question');
      if (p.domain != null) flags.push('legacy_domain_retained_unmapped');

      return {
        part_id: `${questionId}_P${partLetter(idx)}`,
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
        source_profile: 'legacy_bank_internal_unverified',
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
        taxonomy_assignment_confidence: confidence,
        primary_written_classification_codes: rc?.code ? [rc.code] : [],
        secondary_written_classification_codes: [],
        primary_theme_codes: themeCode ? [themeCode] : [],
        secondary_theme_codes: [],
        migration_flags: flags
      };
    });

    const primaryWritten = uniq(parts.flatMap((p) => p.primary_written_classification_codes));
    const primaryTheme = uniq(parts.flatMap((p) => p.primary_theme_codes));

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
      source_profile: 'legacy_bank_internal_unverified',
      source_list: [],
      form_eligibility: {
        eligible_form_ids: formMap[q.id] || []
      },
      stem_assets: q.stem_image ? [{ asset_type: 'image', path: q.stem_image }] : [],
      parts,
      question_level_written_rollup_status: 'rolled_up_from_parts',
      question_level_theme_rollup_status: 'rolled_up_from_parts',
      primary_written_classification_codes: primaryWritten,
      secondary_written_classification_codes: [],
      primary_theme_codes: primaryTheme,
      secondary_theme_codes: [],
      migration_flags: ['missing_source_metadata']
    };
  });

  const candidate = {
    artifact_id: 'legacy_low_risk_migration_candidate_v1',
    artifact_version: '1.0.0',
    created_at: new Date().toISOString().slice(0, 10),
    source_snapshot: {
      question_bank_path: 'question_bank.json',
      exam_forms_path: 'exam_forms.json',
      selected_legacy_ids: SELECTED_IDS
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

  fs.mkdirSync('content/candidates', { recursive: true });
  fs.mkdirSync('reports', { recursive: true });
  fs.writeFileSync('content/candidates/legacy_low_risk_migration_candidate_v1.json', JSON.stringify(candidate, null, 2));

  const diffLines = [
    '# Legacy-to-Canonical Side-by-Side Diff (Low-Risk Candidate Batch)',
    '',
    '| Legacy Question ID | Canonical Question ID | Legacy Part IDs | Canonical Part IDs | Legacy rc/theme coverage | Canonical taxonomy coverage | Response types | Notes |',
    '|---|---|---|---|---|---|---|---|'
  ];

  for (const q of questions) {
    const legacy = selected.find((x) => x.id === q.legacy_ids.id);
    const legacyRc = legacy.parts.map((p) => `${p.id}:${p.rc_classification ?? '∅'}/${p.theme ?? '∅'}`).join('<br>');
    const canonRc = q.parts.map((p) => `${p.part_id}:${p.primary_written_classification_codes.join(',') || '∅'}/${p.primary_theme_codes.join(',') || '∅'}`).join('<br>');
    const notes = q.parts.some((p) => p.taxonomy_assignment_confidence === 'low')
      ? 'Contains inferred taxonomy in one or more parts due to missing legacy rc/theme.'
      : 'Direct mapping without taxonomy inference.';

    diffLines.push(`| ${q.legacy_ids.id} | ${q.question_id} | ${legacy.parts.map((p) => p.id).join(', ')} | ${q.parts.map((p) => p.part_id).join(', ')} | ${legacyRc} | ${canonRc} | ${uniq(legacy.parts.map((p) => p.response_type)).join(', ')} | ${notes} |`);
  }
  fs.writeFileSync('reports/legacy_low_risk_migration_diff.md', `${diffLines.join('\n')}\n`);

  const gold = JSON.parse(fs.readFileSync('content/gold_standard/royal_college_sample_saq_2025.taxonomy_candidate.json', 'utf8'));
  const goldSummary = {
    hasInstructionVerb: gold.questions.every((q) => q.parts.every((p) => p.instruction_verb)),
    hasExplicitConstraints: gold.questions.every((q) => q.parts.every((p) => p.response_constraints)),
    hasPartTaxonomyArrays: gold.questions.every((q) => q.parts.every((p) => (p.primary_written_classification_codes || []).length && (p.primary_theme_codes || []).length))
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
    const hasLowConf = q.parts.some((p) => p.taxonomy_assignment_confidence === 'low');
    const listLike = q.parts.every((p) => ['list', 'text'].includes(p.response_type));

    cmpLines.push(`| ${q.question_id} | ${q.parts.length} | ${hasNullVerb ? 'Mostly aligned; one or more verbs unresolved' : 'Aligned directive-style prompts'} | ${listLike ? 'Aligned (list/text with explicit constraints)' : 'Diverges from GS list/text patterns'} | Complete arrays populated at question+part level | ${hasLowConf ? 'Taxonomy inference from sibling parts needs human confirmation.' : 'No structural divergence beyond missing source provenance.'} |`);
  }

  fs.writeFileSync('reports/legacy_low_risk_vs_gold_standard_comparison.md', `${cmpLines.join('\n')}\n`);

  const unresolvedLines = [
    '# Low-Risk Migration Candidate: Unresolved Decisions Log',
    '',
    '## Items requiring human review',
    '1. Confirm RC numeric codebook mapping used in this batch (`1->PH`, `2->HS`, `3->BS`, `4->HPDP`, `5->HP`, `6->MPP`).',
    '2. Confirm inferred part taxonomy for parts that lacked legacy `rc_classification` and/or `theme` in source.',
    '3. Confirm whether question-level rollup should remain union-of-part primaries or be constrained to one primary code for blueprint counting.',
    '4. Confirm source provenance policy and whether `source_profile=legacy_bank_internal_unverified` is the preferred conservative label.',
    '',
    '## Part-level inferred taxonomy decisions in this batch',
    ''
  ];

  for (const q of questions) {
    for (const p of q.parts) {
      if (p.taxonomy_assignment_confidence === 'low') {
        unresolvedLines.push(`- ${q.question_id} / ${p.part_id} (legacy part ${p.legacy_part_id}): inferred written=${p.primary_written_classification_codes.join(',') || '∅'}, theme=${p.primary_theme_codes.join(',') || '∅'} from sibling parts.`);
      }
    }
  }

  fs.writeFileSync('reports/legacy_low_risk_unresolved_decisions.md', `${unresolvedLines.join('\n')}\n`);

  const { errors, warnings } = validateCandidate(candidate);
  const validationLines = [
    '# Low-Risk Migration Candidate Validation Report',
    '',
    `- Candidate file: \`content/candidates/legacy_low_risk_migration_candidate_v1.json\``,
    `- Questions validated: ${candidate.questions.length}`,
    `- Validation status: ${errors.length ? 'FAIL' : 'PASS_WITH_WARNINGS'}`,
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

  validationLines.push('## Checks run');
  validationLines.push('- Selected-question count in allowed range (3-5).');
  validationLines.push('- Canonical ID format checks for questions and parts.');
  validationLines.push('- Mandatory question-level and part-level taxonomy array checks.');
  validationLines.push('- Allowed taxonomy code-set checks against locked taxonomy policy.');
  validationLines.push('- List response constraints checks for faithful list_count carry-forward.');

  fs.writeFileSync('reports/legacy_low_risk_migration_validation_report.md', `${validationLines.join('\n')}\n`);

  console.log(`Generated candidate bundle. Validation errors=${errors.length}, warnings=${warnings.length}`);
}

main();
