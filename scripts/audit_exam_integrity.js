#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PATHS = {
  forms: path.join(ROOT, 'exam_forms.json'),
  bank: path.join(ROOT, 'question_bank.json'),
  taxonomy: path.join(ROOT, 'content/taxonomy.json'),
  pilot: path.join(
    ROOT,
    'content/candidates/phpm_saq_approved_pilot_bank_v1.json'
  ),
  script: path.join(ROOT, 'script.js'),
  validator: path.join(ROOT, 'validate_bank.js'),
  tests: path.join(ROOT, 'tests/smoke.spec.js'),
  jsonReport: path.join(ROOT, 'reports/v4_exam_integrity_audit.json'),
  markdownReport: path.join(ROOT, 'reports/v4_exam_integrity_audit.md'),
  gapReport: path.join(ROOT, 'reports/v4_exam_test_gap_analysis.md')
};

const SUPPORTED_RUNTIME_RESPONSE_TYPES = new Set([
  'list',
  'text',
  'haddon_matrix',
  'two_by_two_workspace'
]);

const PILOT_RESPONSE_TYPE_MAP = {
  short_text: 'text'
};

const EXPECTED_DURATION_SECONDS = {
  EXAM_AHD_15: 15 * 60,
  EXAM_30: 30 * 60,
  EXAM_180_V1: 180 * 60
};

const NUMBER_WORDS = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function relative(filePath) {
  return path.relative(ROOT, filePath).replaceAll(path.sep, '/');
}

function round(value) {
  return Math.round((value + Number.EPSILON) * 1000) / 1000;
}

function percentage(numerator, denominator) {
  return denominator > 0 ? round((numerator / denominator) * 100) : 0;
}

function numericQuestionId(id) {
  const match = /^Q0*(\d+)$/i.exec(String(id || '').trim());
  return match ? Number(match[1]) : null;
}

function normalizePrompt(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function countValues(values) {
  const counts = {};
  values.forEach((value) => {
    const key = String(value || '');
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function duplicateValues(values) {
  return Object.entries(countValues(values))
    .filter((entry) => entry[1] > 1)
    .map((entry) => ({ value: entry[0], count: entry[1] }));
}

function makeFinding(code, message, details) {
  return {
    code,
    message,
    details: details || {}
  };
}

function statusFor(errors, warnings) {
  if (errors.length > 0) return 'FAIL';
  if (warnings.length > 0) return 'PASS_WITH_WARNINGS';
  return 'PASS';
}

function isValidMaxScore(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function inferListCountFromPrompt(prompt) {
  const wordMatches = Array.from(
    String(prompt || '').matchAll(
      /\b(ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|TEN)\b/gi
    )
  ).map((match) => NUMBER_WORDS[match[1].toUpperCase()]);

  if (/\band\b/i.test(prompt) && wordMatches.length >= 2) {
    return wordMatches[0] + wordMatches[1];
  }
  if (wordMatches.length > 0) return wordMatches[0];

  const digitMatches = Array.from(
    String(prompt || '').matchAll(/\b(\d{1,2})\b/g)
  ).map((match) => Number(match[1]));

  if (/\band\b/i.test(prompt) && digitMatches.length >= 2) {
    return digitMatches[0] + digitMatches[1];
  }
  return digitMatches.length > 0 ? digitMatches[0] : null;
}

function extractEmbeddedJson(source, constantName) {
  const marker = 'const ' + constantName + ' = ';
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) {
    throw new Error('Could not find ' + constantName + ' in script.js');
  }

  const start = source.indexOf('{', markerIndex + marker.length);
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return JSON.parse(source.slice(start, index + 1));
      }
    }
  }

  throw new Error('Could not parse ' + constantName + ' in script.js');
}

function questionSignature(question) {
  return JSON.stringify({
    stem: normalizePrompt(question.stem),
    parts: (question.parts || []).map((part) => ({
      prompt: normalizePrompt(part.prompt),
      max_score: part.max_score
    }))
  });
}

function findCanonicalQuestionLegacyId(question) {
  return (
    (question.legacy_traceability &&
      question.legacy_traceability.legacy_question_bank_id) ||
    (question.legacy_ids && question.legacy_ids.id) ||
    null
  );
}

function findCanonicalPart(livePart, canonicalQuestion) {
  const parts = Array.isArray(canonicalQuestion.parts)
    ? canonicalQuestion.parts
    : [];

  const exactMatches = parts.filter((part) => {
    const legacyPartId =
      part.legacy_part_id ||
      (part.legacy_traceability &&
        part.legacy_traceability.legacy_part_id);
    return legacyPartId && legacyPartId === livePart.id;
  });

  if (exactMatches.length === 1) {
    return {
      part: exactMatches[0],
      method: 'legacy_part_id',
      ambiguous: false
    };
  }
  if (exactMatches.length > 1) {
    return { part: null, method: 'legacy_part_id', ambiguous: true };
  }

  const prompt = normalizePrompt(livePart.prompt);
  const promptMatches = parts.filter(
    (part) => normalizePrompt(part.prompt) === prompt
  );
  if (promptMatches.length === 1) {
    return {
      part: promptMatches[0],
      method: 'exact_normalized_prompt',
      ambiguous: false
    };
  }
  return {
    part: null,
    method: 'exact_normalized_prompt',
    ambiguous: promptMatches.length > 1
  };
}

function initializeDistribution(codes) {
  return Object.fromEntries(
    codes.map((code) => [code, { part_count: 0, points: 0 }])
  );
}

function addDistributionValue(distribution, code, points) {
  if (!distribution[code]) {
    distribution[code] = { part_count: 0, points: 0 };
  }
  distribution[code].part_count += 1;
  distribution[code].points = round(distribution[code].points + points);
}

function buildTaxonomyCoverage(
  formQuestions,
  canonicalByLegacyId,
  writtenCodes,
  themeCodes
) {
  const written = initializeDistribution(writtenCodes);
  const themes = initializeDistribution(themeCodes);
  const mappedQuestions = new Set();
  const missingQuestionIds = new Set();
  const missingWrittenParts = [];
  const missingThemeParts = [];
  const ambiguousPartMappings = [];
  const scoreMismatches = [];
  const mappingMethods = {};

  let totalParts = 0;
  let totalPoints = 0;
  let writtenMappedParts = 0;
  let writtenMappedPoints = 0;
  let themeMappedParts = 0;
  let themeMappedPoints = 0;

  formQuestions.forEach((question) => {
    const canonicalMatches = canonicalByLegacyId.get(question.id) || [];
    const canonicalQuestion =
      canonicalMatches.length === 1 ? canonicalMatches[0] : null;

    if (!canonicalQuestion) {
      missingQuestionIds.add(question.id);
    } else {
      mappedQuestions.add(question.id);
    }

    (question.parts || []).forEach((part) => {
      totalParts += 1;
      const points = isValidMaxScore(part.max_score) ? part.max_score : 0;
      totalPoints = round(totalPoints + points);

      if (!canonicalQuestion) {
        missingWrittenParts.push(question.id + '/' + (part.id || '?'));
        missingThemeParts.push(question.id + '/' + (part.id || '?'));
        return;
      }

      const mapping = findCanonicalPart(part, canonicalQuestion);
      mappingMethods[mapping.method] = (mappingMethods[mapping.method] || 0) + 1;
      if (!mapping.part) {
        const partRef = question.id + '/' + (part.id || '?');
        missingWrittenParts.push(partRef);
        missingThemeParts.push(partRef);
        if (mapping.ambiguous) ambiguousPartMappings.push(partRef);
        return;
      }

      if (
        isValidMaxScore(mapping.part.max_score) &&
        isValidMaxScore(part.max_score) &&
        round(mapping.part.max_score) !== round(part.max_score)
      ) {
        scoreMismatches.push({
          part_id: question.id + '/' + (part.id || '?'),
          live_max_score: part.max_score,
          canonical_max_score: mapping.part.max_score
        });
      }

      const writtenCode =
        Array.isArray(mapping.part.primary_written_classification_codes) &&
        mapping.part.primary_written_classification_codes.length > 0
          ? mapping.part.primary_written_classification_codes[0]
          : null;
      const themeCode =
        Array.isArray(mapping.part.primary_theme_codes) &&
        mapping.part.primary_theme_codes.length > 0
          ? mapping.part.primary_theme_codes[0]
          : null;

      if (writtenCode && writtenCodes.includes(writtenCode)) {
        writtenMappedParts += 1;
        writtenMappedPoints = round(writtenMappedPoints + points);
        addDistributionValue(written, writtenCode, points);
      } else {
        missingWrittenParts.push(question.id + '/' + (part.id || '?'));
      }

      if (themeCode && themeCodes.includes(themeCode)) {
        themeMappedParts += 1;
        themeMappedPoints = round(themeMappedPoints + points);
        addDistributionValue(themes, themeCode, points);
      } else {
        missingThemeParts.push(question.id + '/' + (part.id || '?'));
      }
    });
  });

  return {
    source: relative(PATHS.pilot),
    counting_rule: 'first primary code at part level',
    question_coverage: {
      mapped: mappedQuestions.size,
      total: formQuestions.length,
      percent: percentage(mappedQuestions.size, formQuestions.length),
      missing_question_ids: Array.from(missingQuestionIds).sort()
    },
    written_classification_coverage: {
      mapped_parts: writtenMappedParts,
      total_parts: totalParts,
      part_percent: percentage(writtenMappedParts, totalParts),
      mapped_points: writtenMappedPoints,
      total_points: totalPoints,
      point_percent: percentage(writtenMappedPoints, totalPoints),
      missing_parts: missingWrittenParts.sort(),
      distribution: written
    },
    topic_theme_coverage: {
      mapped_parts: themeMappedParts,
      total_parts: totalParts,
      part_percent: percentage(themeMappedParts, totalParts),
      mapped_points: themeMappedPoints,
      total_points: totalPoints,
      point_percent: percentage(themeMappedPoints, totalPoints),
      missing_parts: missingThemeParts.sort(),
      distribution: themes
    },
    mapping_methods: mappingMethods,
    ambiguous_part_mappings: ambiguousPartMappings.sort(),
    canonical_score_mismatches: scoreMismatches
  };
}

function buildPilotTaxonomyCoverage(
  pilotQuestions,
  writtenCodes,
  themeCodes
) {
  const written = initializeDistribution(writtenCodes);
  const themes = initializeDistribution(themeCodes);
  const missingWrittenParts = [];
  const missingThemeParts = [];
  let totalParts = 0;
  let totalPoints = 0;
  let writtenMappedParts = 0;
  let writtenMappedPoints = 0;
  let themeMappedParts = 0;
  let themeMappedPoints = 0;

  pilotQuestions.forEach((question) => {
    (question.parts || []).forEach((part) => {
      totalParts += 1;
      const points = isValidMaxScore(part.max_score) ? part.max_score : 0;
      totalPoints = round(totalPoints + points);
      const partId = question.question_id + '/' + (part.part_id || '?');
      const writtenCode =
        Array.isArray(part.primary_written_classification_codes) &&
        part.primary_written_classification_codes.length > 0
          ? part.primary_written_classification_codes[0]
          : null;
      const themeCode =
        Array.isArray(part.primary_theme_codes) &&
        part.primary_theme_codes.length > 0
          ? part.primary_theme_codes[0]
          : null;

      if (writtenCode && writtenCodes.includes(writtenCode)) {
        writtenMappedParts += 1;
        writtenMappedPoints = round(writtenMappedPoints + points);
        addDistributionValue(written, writtenCode, points);
      } else {
        missingWrittenParts.push(partId);
      }

      if (themeCode && themeCodes.includes(themeCode)) {
        themeMappedParts += 1;
        themeMappedPoints = round(themeMappedPoints + points);
        addDistributionValue(themes, themeCode, points);
      } else {
        missingThemeParts.push(partId);
      }
    });
  });

  return {
    source: relative(PATHS.pilot),
    counting_rule: 'first primary code at part level',
    question_coverage: {
      mapped: pilotQuestions.length,
      total: pilotQuestions.length,
      percent: 100,
      missing_question_ids: []
    },
    written_classification_coverage: {
      mapped_parts: writtenMappedParts,
      total_parts: totalParts,
      part_percent: percentage(writtenMappedParts, totalParts),
      mapped_points: writtenMappedPoints,
      total_points: totalPoints,
      point_percent: percentage(writtenMappedPoints, totalPoints),
      missing_parts: missingWrittenParts,
      distribution: written
    },
    topic_theme_coverage: {
      mapped_parts: themeMappedParts,
      total_parts: totalParts,
      part_percent: percentage(themeMappedParts, totalParts),
      mapped_points: themeMappedPoints,
      total_points: totalPoints,
      point_percent: percentage(themeMappedPoints, totalPoints),
      missing_parts: missingThemeParts,
      distribution: themes
    },
    mapping_methods: { direct_pilot_part_metadata: totalParts },
    ambiguous_part_mappings: [],
    canonical_score_mismatches: []
  };
}

function inventoryCandidateArtifacts() {
  const directories = [
    path.join(ROOT, 'content/candidates'),
    path.join(ROOT, 'content/gold_standard')
  ];
  const artifacts = [];

  directories.forEach((directory) => {
    fs.readdirSync(directory)
      .filter((name) => name.endsWith('.json'))
      .sort()
      .forEach((name) => {
        const filePath = path.join(directory, name);
        const payload = readJson(filePath);
        const questions = Array.isArray(payload.questions)
          ? payload.questions
          : [];
        const parts = questions.flatMap((question) =>
          Array.isArray(question.parts) ? question.parts : []
        );
        artifacts.push({
          file: relative(filePath),
          artifact_id: payload.artifact_id || null,
          artifact_version:
            payload.artifact_version || payload.version || null,
          question_count: questions.length,
          part_count: parts.length,
          calculated_total_points: round(
            parts.reduce(
              (sum, part) =>
                sum + (isValidMaxScore(part.max_score) ? part.max_score : 0),
              0
            )
          )
        });
      });
  });

  return artifacts;
}

function wrapText(text, firstPrefix, nextPrefix, width) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = firstPrefix;

  words.forEach((word) => {
    const separator = line === firstPrefix ? '' : ' ';
    if ((line + separator + word).length > width && line !== firstPrefix) {
      lines.push(line);
      line = nextPrefix + word;
    } else {
      line += separator + word;
    }
  });
  lines.push(line);
  return lines;
}

function addBullet(lines, label, value, indent) {
  const baseIndent = indent || '';
  const prefix = baseIndent + '- **' + label + ':** ';
  const next = baseIndent + '  ';
  wrapText(value, prefix, next, 79).forEach((line) => lines.push(line));
}

function code(value) {
  const tick = String.fromCharCode(96);
  return tick + value + tick;
}

function formatDistribution(distribution) {
  return Object.entries(distribution)
    .map((entry) => {
      const partLabel = entry[1].part_count === 1 ? 'part' : 'parts';
      return (
        entry[0] +
        ': ' +
        entry[1].part_count +
        ' ' +
        partLabel +
        ' / ' +
        entry[1].points +
        ' points'
      );
    })
    .join('; ');
}

function renderMarkdownReport(audit) {
  const lines = [];
  lines.push('# V4 Written SAQ examination integrity audit');
  lines.push('');
  lines.push('Generated: ' + audit.generated_at);
  lines.push('');
  lines.push('## Executive result');
  lines.push('');
  addBullet(lines, 'Overall status', audit.overall_status);
  addBullet(
    lines,
    'Scope',
    'Three default published forms plus the opt-in pilot compatibility form.'
  );
  addBullet(
    lines,
    'Hard failures',
    String(audit.summary.hard_failure_count)
  );
  addBullet(lines, 'Warnings', String(audit.summary.warning_count));
  addBullet(
    lines,
    'Primary finding',
    'Every JSON-defined default form has a declared-versus-calculated ' +
      'point mismatch. No mismatch is caused by a missing or duplicate ' +
      'question reference.'
  );
  lines.push('');

  lines.push('## Dataset and grain');
  lines.push('');
  addBullet(
    lines,
    'Live bank',
    audit.question_bank.question_count +
      ' questions, ' +
      audit.question_bank.part_count +
      ' parts, ' +
      audit.question_bank.calculated_total_points +
      ' total part points.'
  );
  addBullet(
    lines,
    'Published default forms',
    String(audit.default_forms.length)
  );
  addBullet(
    lines,
    'Pilot artifact',
    audit.pilot_form.question_count +
      ' questions, ' +
      audit.pilot_form.part_count +
      ' parts, ' +
      audit.pilot_form.calculated_total_points +
      ' points.'
  );
  addBullet(
    lines,
    'Fallback parity',
    audit.runtime_analysis.embedded_bank_matches_json &&
      audit.runtime_analysis.embedded_forms_match_json
      ? 'Embedded bank and form data in script.js exactly match the JSON files.'
      : 'Embedded data do not match the JSON files.'
  );
  lines.push('');

  lines.push('## Live bank validity');
  lines.push('');
  addBullet(
    lines,
    'max_score',
    audit.question_bank.invalid_max_scores.length === 0
      ? 'All 92 parts have finite, positive numeric max_score values.'
      : audit.question_bank.invalid_max_scores.length +
          ' parts have invalid max_score values.'
  );
  addBullet(
    lines,
    'Question references',
    audit.question_bank.unreferenced_question_ids.length === 0
      ? 'All 36 live questions are referenced by at least one default form.'
      : 'Unreferenced IDs: ' +
          audit.question_bank.unreferenced_question_ids.join(', ') +
          '.'
  );
  addBullet(
    lines,
    'Part IDs',
    audit.question_bank.duplicate_part_ids_within_question.length === 0 &&
      audit.question_bank.globally_duplicate_part_ids.length === 0
      ? 'No duplicate part IDs were found.'
      : 'Duplicate part IDs require review.'
  );
  addBullet(
    lines,
    'Response types',
    Object.entries(audit.question_bank.response_type_counts)
      .map((entry) => entry[0] + '=' + entry[1])
      .join(', ') +
      '. All are supported by current runtime branches.'
  );
  addBullet(
    lines,
    'Prompt/list-count warnings',
    audit.question_bank.prompt_list_count_warnings.length === 0
      ? 'none'
      : audit.question_bank.prompt_list_count_warnings
          .map((item) => {
            return (
              item.question_id +
              '/' +
              item.part_id +
              ' implies ' +
              item.prompt_implied_count +
              ' but configures ' +
              item.configured_list_count
            );
          })
          .join('; ') +
        '.'
  );
  lines.push('');

  lines.push('## Taxonomy code legend');
  lines.push('');
  addBullet(
    lines,
    'Written classifications',
    audit.canonical_and_candidate_artifacts.taxonomy_codes
      .written_classifications
      .map((item) => item.code + ' ' + item.label)
      .join('; ')
  );
  addBullet(
    lines,
    'Topic themes',
    audit.canonical_and_candidate_artifacts.taxonomy_codes.topic_themes
      .map((item) => item.code + ' ' + item.label)
      .join('; ')
  );
  lines.push('');

  lines.push('## Default published forms');
  lines.push('');
  audit.default_forms.forEach((form) => {
    lines.push('### ' + code(form.form_id) + ' — ' + form.status);
    lines.push('');
    addBullet(
      lines,
      'Duration',
      form.declared_duration_sec +
        ' seconds (' +
        form.duration_minutes +
        ' minutes).'
    );
    addBullet(
      lines,
      'Points',
      'declared ' +
        form.declared_total_points +
        '; calculated ' +
        form.calculated_total_points +
        '; delta calculated minus declared ' +
        form.point_delta +
        '.'
    );
    addBullet(
      lines,
      'Composition',
      form.question_count +
        ' questions and ' +
        form.part_count +
        ' parts.'
    );
    addBullet(lines, 'Question IDs', form.question_ids.join(', '));
    addBullet(
      lines,
      'Per-question points',
      form.question_point_breakdown
        .map((item) => item.question_id + '=' + item.points)
        .join(', ')
    );
    addBullet(
      lines,
      'References',
      form.missing_question_ids.length === 0 &&
        form.duplicate_question_ids.length === 0
        ? 'All references resolve exactly once; no duplicate IDs in the form.'
        : 'Missing: ' +
            (form.missing_question_ids.join(', ') || 'none') +
            '; duplicate: ' +
            (form.duplicate_question_ids.join(', ') || 'none') +
            '.'
    );
    addBullet(
      lines,
      'Response types',
      form.response_types.join(', ') +
        (form.specialized_supported_response_types.length > 0
          ? '; specialized but supported: ' +
            form.specialized_supported_response_types.join(', ')
          : '')
    );
    addBullet(lines, 'Notice assessment', form.notice_analysis.assessment);
    addBullet(
      lines,
      'Taxonomy question coverage',
      form.taxonomy.question_coverage.mapped +
        '/' +
        form.taxonomy.question_coverage.total +
        ' (' +
        form.taxonomy.question_coverage.percent +
        '%).'
    );
    addBullet(
      lines,
      'Written taxonomy coverage',
      form.taxonomy.written_classification_coverage.mapped_parts +
        '/' +
        form.taxonomy.written_classification_coverage.total_parts +
        ' parts and ' +
        form.taxonomy.written_classification_coverage.mapped_points +
        '/' +
        form.taxonomy.written_classification_coverage.total_points +
        ' points.'
    );
    addBullet(
      lines,
      'Written distribution',
      formatDistribution(
        form.taxonomy.written_classification_coverage.distribution
      )
    );
    addBullet(
      lines,
      'Theme taxonomy coverage',
      form.taxonomy.topic_theme_coverage.mapped_parts +
        '/' +
        form.taxonomy.topic_theme_coverage.total_parts +
        ' parts and ' +
        form.taxonomy.topic_theme_coverage.mapped_points +
        '/' +
        form.taxonomy.topic_theme_coverage.total_points +
        ' points.'
    );
    addBullet(
      lines,
      'Theme distribution',
      formatDistribution(form.taxonomy.topic_theme_coverage.distribution)
    );
    if (form.errors.length > 0) {
      lines.push('');
      lines.push('Hard failures:');
      lines.push('');
      form.errors.forEach((finding) => {
        addBullet(lines, finding.code, finding.message);
      });
    }
    if (form.warnings.length > 0) {
      lines.push('');
      lines.push('Warnings:');
      lines.push('');
      form.warnings.forEach((finding) => {
        addBullet(lines, finding.code, finding.message);
      });
    }
    lines.push('');
  });

  lines.push('## Opt-in pilot compatibility form');
  lines.push('');
  const pilot = audit.pilot_form;
  addBullet(lines, 'Status', pilot.status);
  addBullet(
    lines,
    'Identity',
    'Data mode pilot; runtime form ID ' + pilot.form_id + '.'
  );
  addBullet(
    lines,
    'Duration',
    pilot.declared_duration_sec +
      ' seconds (' +
      pilot.duration_minutes +
      ' minutes).'
  );
  addBullet(
    lines,
    'Points',
    'runtime-declared ' +
      pilot.declared_total_points +
      '; calculated ' +
      pilot.calculated_total_points +
      '; delta ' +
      pilot.point_delta +
      '.'
  );
  addBullet(
    lines,
    'Composition',
    pilot.question_count +
      ' questions and ' +
      pilot.part_count +
      ' parts.'
  );
  addBullet(
    lines,
    'Response types',
    pilot.response_types.join(', ') +
      '; short_text is explicitly adapted to text.'
  );
  addBullet(
    lines,
    'Taxonomy',
    'All pilot parts have primary written and theme codes, but all ' +
      'assignments remain candidate metadata and nine migrated questions ' +
      'still require full source review.'
  );
  addBullet(
    lines,
    'Written distribution',
    formatDistribution(
      pilot.taxonomy.written_classification_coverage.distribution
    )
  );
  addBullet(
    lines,
    'Theme distribution',
    formatDistribution(pilot.taxonomy.topic_theme_coverage.distribution)
  );
  pilot.warnings.forEach((finding) => {
    addBullet(lines, finding.code, finding.message);
  });
  lines.push('');

  lines.push('## Exact mismatch causes');
  lines.push('');
  addBullet(
    lines,
    'EXAM_30',
    'The seven referenced questions sum to 30 points, not 24. The AHD ' +
      'subset contributes 18 points and Q7, Q3, and Q2 add 12 points.'
  );
  addBullet(
    lines,
    'EXAM_AHD_15',
    'Q1, Q4, Q5, and Q6 sum to 18 points, not 24. The notice accurately ' +
      'identifies the four-question subset of EXAM_30.'
  );
  addBullet(
    lines,
    'EXAM_180_V1',
    'All 29 references resolve and their 78 parts sum to 177 points, not ' +
      '180. The data do not identify whether the intended repair is a ' +
      'declaration, membership, or educational scoring change.'
  );
  lines.push('');

  lines.push('## Question-ID integrity');
  lines.push('');
  addBullet(
    lines,
    'Exact duplicate live question IDs',
    audit.question_bank.duplicate_question_ids.length
      ? audit.question_bank.duplicate_question_ids
          .map((item) => item.value)
          .join(', ')
      : 'none'
  );
  addBullet(
    lines,
    'Numeric collision groups',
    audit.question_bank.numeric_id_collisions
      .map((item) => item.ids.join(' / '))
      .join(', ')
  );
  addBullet(
    lines,
    'Interpretation',
    'Q1 through Q7 collide numerically with Q01 through Q07. They are ' +
      'distinct exact-string records with different content and are assigned ' +
      'to different forms. Runtime lookup uses exact strings, but human or ' +
      'future normalized-ID workflows can conflate them.'
  );
  lines.push('');

  lines.push('## Runtime scoring and export behaviour');
  lines.push('');
  audit.runtime_analysis.behaviour.forEach((item) => {
    addBullet(lines, item.area, item.finding);
  });
  lines.push('');

  lines.push('## Taxonomy limitations');
  lines.push('');
  audit.taxonomy_limitations.forEach((item) => {
    addBullet(lines, item.code, item.message);
  });
  lines.push('');

  lines.push('## Safe automation versus educational review');
  lines.push('');
  lines.push('Safe follow-up automation:');
  lines.push('');
  audit.repair_guidance.safe_automatic.forEach((item) => {
    wrapText(item, '- ', '  ', 79).forEach((line) => lines.push(line));
  });
  lines.push('');
  lines.push('Requires Stephen’s educational review:');
  lines.push('');
  audit.repair_guidance.requires_educational_review.forEach((item) => {
    wrapText(item, '- ', '  ', 79).forEach((line) => lines.push(line));
  });
  lines.push('');

  lines.push('## Recommendation for a 90-minute candidate form');
  lines.push('');
  audit.recommendation_90_minute.forEach((item, index) => {
    wrapText(item, String(index + 1) + '. ', '   ', 79).forEach((line) =>
      lines.push(line)
    );
  });

  return lines.join('\n') + '\n';
}

function renderGapReport(audit) {
  const lines = [];
  lines.push('# V4 Written SAQ test-gap analysis');
  lines.push('');
  lines.push('Generated: ' + audit.generated_at);
  lines.push('');
  lines.push('## Current automated coverage');
  lines.push('');
  addBullet(
    lines,
    'validate_bank.js',
    'Checks exact bank question IDs, globally unique part IDs, positive ' +
      'max_score values, non-empty rubrics, list_count validity, and a prompt ' +
      'versus list-count heuristic.'
  );
  addBullet(
    lines,
    'tests/smoke.spec.js',
    'Exercises page loading, Full Exam start, navigation, flagging, reload, ' +
      'calculator, review, download, and legacy/pilot storage namespaces.'
  );
  addBullet(
    lines,
    'Browser baseline',
    'The current suite reaches application assertions but all four tests fail ' +
      'on stale selectors, typography, or automatic-resume assumptions.'
  );
  lines.push('');

  lines.push('## High-priority gaps');
  lines.push('');
  const highGaps = [
    'No existing validator joins exam_forms.json to question_bank.json.',
    'No existing test compares declared total_points with summed part max_score.',
    'No automated test starts or verifies EXAM_AHD_15 or EXAM_30.',
    'No test asserts exact form membership, question count, part count, or ' +
      'duration for any default form.',
    'No test detects Q1/Q01-style normalized-ID collisions.',
    'No test verifies embedded fallback data remain identical to external JSON.',
    'No test verifies that each response type in an active form has a renderer ' +
      'and save/restore path.',
    'The browser flow expects automatic exam display after reload, while the ' +
      'runtime intentionally requires the Resume Saved Exam action. This stops ' +
      'the flow before calculator, review, and export assertions complete.'
  ];
  highGaps.forEach((item) => {
    wrapText(item, '- ', '  ', 79).forEach((line) => lines.push(line));
  });
  lines.push('');

  lines.push('## Medium-priority gaps');
  lines.push('');
  const mediumGaps = [
    'Export tests check mode and that questions is an array, but not exact IDs, ' +
      'exam_form_id, duration, part max scores, rubrics, or calculated totals.',
    'No test reconciles the points displayed from declared form metadata with ' +
      'the scoring denominator computed from parts.',
    'No test audits form notices against actual overlap or reuse.',
    'No test validates canonical traceability, taxonomy code validity, coverage, ' +
      'or candidate-versus-live score agreement.',
    'No test records that nine migrated pilot questions retain ' +
      'needs_full_source_review provenance.',
    'No browser test reaches Q04 haddon_matrix or Q28 two_by_two_workspace and ' +
      'verifies answer persistence and export.',
    'No test exercises malformed or missing form IDs, duplicate form references, ' +
      'invalid durations, or invalid max_score values as negative cases.'
  ];
  mediumGaps.forEach((item) => {
    wrapText(item, '- ', '  ', 79).forEach((line) => lines.push(line));
  });
  lines.push('');

  lines.push('## Recommended automated test layers');
  lines.push('');
  const recommendations = [
    'Run scripts/audit_exam_integrity.js in CI and require exit zero before a ' +
      'release; preserve its JSON report as review evidence.',
    'Add fixture-based unit tests for missing references, duplicate references, ' +
      'point mismatches, invalid max_score, ID collisions, and unsupported ' +
      'response types.',
    'Add data-mode-aware browser tests for 15-, 30-, and 180-minute form start, ' +
      'exact membership, timer, displayed points, explicit resume, review, and ' +
      'export payload.',
    'Add targeted interaction tests for list, text, haddon_matrix, and ' +
      'two_by_two_workspace rendering and persistence.',
    'Add a parity test for embedded fallback objects versus question_bank.json ' +
      'and exam_forms.json.',
    'Add taxonomy coverage tests only after Stephen approves the authoritative ' +
      'metadata source and missing assignments; do not make inferred labels pass.'
  ];
  recommendations.forEach((item) => {
    wrapText(item, '- ', '  ', 79).forEach((line) => lines.push(line));
  });
  lines.push('');

  lines.push('## Current audit-script result');
  lines.push('');
  addBullet(
    lines,
    'Expected exit',
    'Non-zero because all three default forms have hard total mismatches.'
  );
  addBullet(
    lines,
    'Pilot result',
    audit.pilot_form.status +
      '; totals reconcile, with provenance and provisional-taxonomy warnings.'
  );

  return lines.join('\n') + '\n';
}

function main() {
  const formsPayload = readJson(PATHS.forms);
  const bankPayload = readJson(PATHS.bank);
  const taxonomyPayload = readJson(PATHS.taxonomy);
  const pilotPayload = readJson(PATHS.pilot);
  const scriptSource = fs.readFileSync(PATHS.script, 'utf8');

  const forms = Array.isArray(formsPayload.forms) ? formsPayload.forms : [];
  const questions = Array.isArray(bankPayload.questions)
    ? bankPayload.questions
    : [];
  const pilotQuestions = Array.isArray(pilotPayload.questions)
    ? pilotPayload.questions
    : [];

  const writtenCodeEntries =
    taxonomyPayload.namespaces.official_written_classifications || [];
  const themeCodeEntries =
    taxonomyPayload.namespaces.official_topic_themes || [];
  const writtenCodes = writtenCodeEntries.map((item) => item.code);
  const themeCodes = themeCodeEntries.map((item) => item.code);

  const globalErrors = [];
  const globalWarnings = [];
  const questionIds = questions.map((question) => question.id);
  const duplicateQuestionIds = duplicateValues(questionIds);
  duplicateQuestionIds.forEach((duplicate) => {
    globalErrors.push(
      makeFinding(
        'DUPLICATE_LIVE_QUESTION_ID',
        'Question ID ' + duplicate.value + ' occurs ' + duplicate.count + ' times.'
      )
    );
  });

  const questionOccurrences = new Map();
  questions.forEach((question) => {
    if (!questionOccurrences.has(question.id)) {
      questionOccurrences.set(question.id, []);
    }
    questionOccurrences.get(question.id).push(question);
  });

  const numericBuckets = new Map();
  questions.forEach((question) => {
    const numericId = numericQuestionId(question.id);
    if (numericId === null) return;
    if (!numericBuckets.has(numericId)) numericBuckets.set(numericId, []);
    numericBuckets.get(numericId).push(question);
  });
  const numericIdCollisions = Array.from(numericBuckets.entries())
    .filter((entry) => entry[1].length > 1)
    .map((entry) => ({
      numeric_id: entry[0],
      ids: entry[1].map((question) => question.id).sort(),
      exact_content_equal:
        new Set(entry[1].map((question) => questionSignature(question))).size ===
        1
    }))
    .sort((a, b) => a.numeric_id - b.numeric_id);
  if (numericIdCollisions.length > 0) {
    globalWarnings.push(
      makeFinding(
        'NUMERIC_QUESTION_ID_COLLISIONS',
        numericIdCollisions.length +
          ' normalized numeric ID groups contain multiple exact IDs.'
      )
    );
  }

  const invalidMaxScores = [];
  const invalidQuestionParts = [];
  const duplicatePartIdsWithinQuestion = [];
  const allPartIds = [];
  const responseTypes = [];
  const listCountWarnings = [];
  let bankPointTotal = 0;
  let bankPartCount = 0;

  questions.forEach((question) => {
    const parts = Array.isArray(question.parts) ? question.parts : [];
    if (parts.length === 0) {
      invalidQuestionParts.push(question.id);
      globalErrors.push(
        makeFinding(
          'QUESTION_WITHOUT_PARTS',
          'Question ' + question.id + ' has no parts.'
        )
      );
    }
    duplicateValues(parts.map((part) => part.id)).forEach((duplicate) => {
      duplicatePartIdsWithinQuestion.push({
        question_id: question.id,
        part_id: duplicate.value,
        count: duplicate.count
      });
      globalErrors.push(
        makeFinding(
          'DUPLICATE_PART_ID_WITHIN_QUESTION',
          question.id + ' repeats part ID ' + duplicate.value + '.'
        )
      );
    });

    parts.forEach((part) => {
      bankPartCount += 1;
      allPartIds.push(part.id);
      responseTypes.push(part.response_type || 'text');
      if (!isValidMaxScore(part.max_score)) {
        invalidMaxScores.push({
          question_id: question.id,
          part_id: part.id || null,
          max_score: part.max_score
        });
        globalErrors.push(
          makeFinding(
            'INVALID_MAX_SCORE',
            question.id +
              '/' +
              (part.id || '?') +
              ' has invalid max_score ' +
              String(part.max_score) +
              '.'
          )
        );
      } else {
        bankPointTotal = round(bankPointTotal + part.max_score);
      }

      if (part.response_type === 'list') {
        const inferred = inferListCountFromPrompt(part.prompt);
        if (
          inferred !== null &&
          Number.isInteger(part.list_count) &&
          inferred !== part.list_count
        ) {
          listCountWarnings.push({
            question_id: question.id,
            part_id: part.id,
            prompt_implied_count: inferred,
            configured_list_count: part.list_count
          });
        }
      }
    });
  });

  const globallyDuplicatePartIds = duplicateValues(allPartIds);
  globallyDuplicatePartIds.forEach((duplicate) => {
    globalWarnings.push(
      makeFinding(
        'GLOBALLY_DUPLICATE_PART_ID',
        'Part ID ' + duplicate.value + ' occurs ' + duplicate.count + ' times.'
      )
    );
  });
  listCountWarnings.forEach((warning) => {
    globalWarnings.push(
      makeFinding(
        'PROMPT_LIST_COUNT_MISMATCH',
        warning.question_id +
          '/' +
          warning.part_id +
          ' implies ' +
          warning.prompt_implied_count +
          ' items but configures ' +
          warning.configured_list_count +
          '.'
      )
    );
  });

  const canonicalByLegacyId = new Map();
  pilotQuestions.forEach((question) => {
    const legacyId = findCanonicalQuestionLegacyId(question);
    if (!legacyId) return;
    if (!canonicalByLegacyId.has(legacyId)) {
      canonicalByLegacyId.set(legacyId, []);
    }
    canonicalByLegacyId.get(legacyId).push(question);
  });

  const duplicateCanonicalMappings = Array.from(canonicalByLegacyId.entries())
    .filter((entry) => entry[1].length > 1)
    .map((entry) => ({
      legacy_question_id: entry[0],
      canonical_question_ids: entry[1].map((question) => question.question_id)
    }));
  duplicateCanonicalMappings.forEach((mapping) => {
    globalWarnings.push(
      makeFinding(
        'DUPLICATE_CANONICAL_TRACEABILITY',
        mapping.legacy_question_id +
          ' maps to multiple canonical questions: ' +
          mapping.canonical_question_ids.join(', ') +
          '.'
      )
    );
  });

  const overlapsByForm = new Map();
  forms.forEach((form) => overlapsByForm.set(form.form_id, []));
  forms.forEach((form, index) => {
    forms.slice(index + 1).forEach((other) => {
      const overlap = (form.question_ids || []).filter((id) =>
        (other.question_ids || []).includes(id)
      );
      if (overlap.length > 0) {
        overlapsByForm.get(form.form_id).push({
          other_form_id: other.form_id,
          question_ids: overlap
        });
        overlapsByForm.get(other.form_id).push({
          other_form_id: form.form_id,
          question_ids: overlap
        });
      }
    });
  });

  const defaultForms = forms.map((form) => {
    const errors = [];
    const warnings = [];
    const refs = Array.isArray(form.question_ids) ? form.question_ids : [];
    const duplicateRefs = duplicateValues(refs);
    const missingIds = [];
    const nonUniqueBankRefs = [];
    const resolvedQuestions = [];

    duplicateRefs.forEach((duplicate) => {
      errors.push(
        makeFinding(
          'DUPLICATE_QUESTION_ID_IN_FORM',
          duplicate.value + ' appears ' + duplicate.count + ' times in the form.'
        )
      );
    });

    refs.forEach((id) => {
      const matches = questionOccurrences.get(id) || [];
      if (matches.length === 0) {
        missingIds.push(id);
        errors.push(
          makeFinding(
            'REFERENCED_QUESTION_MISSING',
            'Referenced question ' + id + ' is missing from question_bank.json.'
          )
        );
      } else if (matches.length > 1) {
        nonUniqueBankRefs.push(id);
        errors.push(
          makeFinding(
            'REFERENCED_QUESTION_NOT_UNIQUE',
            'Referenced question ' + id + ' occurs more than once in the bank.'
          )
        );
      } else {
        resolvedQuestions.push(matches[0]);
      }
    });

    const questionPointBreakdown = [];
    let partCount = 0;
    let calculatedPoints = 0;
    const formResponseTypes = new Set();
    const invalidScoresInForm = [];

    resolvedQuestions.forEach((question) => {
      let questionPoints = 0;
      (question.parts || []).forEach((part) => {
        partCount += 1;
        const responseType = part.response_type || 'text';
        formResponseTypes.add(responseType);
        if (!isValidMaxScore(part.max_score)) {
          invalidScoresInForm.push(question.id + '/' + (part.id || '?'));
          errors.push(
            makeFinding(
              'INVALID_MAX_SCORE_IN_FORM',
              question.id +
                '/' +
                (part.id || '?') +
                ' has an invalid max_score.'
            )
          );
        } else {
          questionPoints = round(questionPoints + part.max_score);
          calculatedPoints = round(calculatedPoints + part.max_score);
        }
      });
      questionPointBreakdown.push({
        question_id: question.id,
        points: questionPoints
      });
    });

    const unsupportedTypes = Array.from(formResponseTypes)
      .filter((type) => !SUPPORTED_RUNTIME_RESPONSE_TYPES.has(type))
      .sort();
    unsupportedTypes.forEach((type) => {
      errors.push(
        makeFinding(
          'UNSUPPORTED_RESPONSE_TYPE',
          'Response type ' + type + ' has no recognized runtime support.'
        )
      );
    });

    const specializedTypes = Array.from(formResponseTypes)
      .filter((type) =>
        ['haddon_matrix', 'two_by_two_workspace'].includes(type)
      )
      .sort();

    const declaredPoints = form.total_points;
    const pointDelta =
      isValidMaxScore(declaredPoints) && invalidScoresInForm.length === 0
        ? round(calculatedPoints - declaredPoints)
        : null;
    if (!isValidMaxScore(declaredPoints)) {
      errors.push(
        makeFinding(
          'INVALID_DECLARED_TOTAL',
          'Declared total_points is missing or invalid.'
        )
      );
    } else if (pointDelta !== 0) {
      errors.push(
        makeFinding(
          'DECLARED_TOTAL_MISMATCH',
          'Declared ' +
            declaredPoints +
            ' points but summed part max_score is ' +
            calculatedPoints +
            ' (delta ' +
            pointDelta +
            ').'
        )
      );
    }

    const expectedDuration = EXPECTED_DURATION_SECONDS[form.form_id];
    if (
      expectedDuration !== undefined &&
      form.duration_sec !== expectedDuration
    ) {
      errors.push(
        makeFinding(
          'DURATION_MISMATCH',
          'Declared duration is ' +
            form.duration_sec +
            ' seconds; expected ' +
            expectedDuration +
            ' from the published form identity.'
        )
      );
    }

    const collisionMemberships = numericIdCollisions
      .map((collision) => ({
        numeric_id: collision.numeric_id,
        ids_in_form: collision.ids.filter((id) => refs.includes(id)),
        all_colliding_ids: collision.ids
      }))
      .filter((item) => item.ids_in_form.length > 0);
    if (collisionMemberships.length > 0) {
      warnings.push(
        makeFinding(
          'AMBIGUOUS_NUMERIC_ID_NAMESPACE',
          'The form uses IDs that collide numerically with distinct bank IDs: ' +
            collisionMemberships
              .map((item) => item.all_colliding_ids.join('/'))
              .join(', ') +
            '. Exact runtime lookup is safe, but normalized or manual lookup is not.'
        )
      );
    }

    const canonicalIds = resolvedQuestions
      .map((question) => {
        const matches = canonicalByLegacyId.get(question.id) || [];
        return matches.length === 1 ? matches[0].question_id : null;
      })
      .filter(Boolean);
    const duplicateCanonicalIds = duplicateValues(canonicalIds);
    duplicateCanonicalIds.forEach((duplicate) => {
      errors.push(
        makeFinding(
          'DUPLICATE_CANONICAL_ID_IN_FORM',
          'Canonical question ' +
            duplicate.value +
            ' appears more than once after traceability mapping.'
        )
      );
    });

    const taxonomy = buildTaxonomyCoverage(
      resolvedQuestions,
      canonicalByLegacyId,
      writtenCodes,
      themeCodes
    );
    if (
      taxonomy.written_classification_coverage.mapped_parts <
        taxonomy.written_classification_coverage.total_parts ||
      taxonomy.topic_theme_coverage.mapped_parts <
        taxonomy.topic_theme_coverage.total_parts
    ) {
      warnings.push(
        makeFinding(
          'INCOMPLETE_CANONICAL_TAXONOMY',
          'Canonical part-level taxonomy is incomplete for this form; missing ' +
            'metadata was not inferred.'
        )
      );
    }
    if (taxonomy.canonical_score_mismatches.length > 0) {
      warnings.push(
        makeFinding(
          'CANONICAL_SCORE_MISMATCH',
          taxonomy.canonical_score_mismatches.length +
            ' canonical part scores differ from live max_score values.'
        )
      );
    }

    const overlaps = overlapsByForm.get(form.form_id) || [];
    let noticeAssessment = 'Notice is non-empty and makes no false claim.';
    if (form.form_id === 'EXAM_AHD_15') {
      const expectedIds = ['Q1', 'Q4', 'Q5', 'Q6'];
      const noticeHasIds = expectedIds.every((id) =>
        String(form.notice || '').includes(id)
      );
      const subsetOf30 = expectedIds.every((id) => {
        const form30 = forms.find((item) => item.form_id === 'EXAM_30');
        return form30 && form30.question_ids.includes(id);
      });
      noticeAssessment =
        noticeHasIds && subsetOf30
          ? 'Accurately identifies Q1, Q4, Q5, and Q6 as reused from EXAM_30.'
          : 'Does not accurately describe the intended EXAM_30 subset.';
      if (!(noticeHasIds && subsetOf30)) {
        warnings.push(
          makeFinding(
            'INACCURATE_FORM_NOTICE',
            'The AHD reuse notice does not match actual membership.'
          )
        );
      }
    } else if (form.form_id === 'EXAM_30') {
      noticeAssessment =
        'Accurate as a legacy 30-minute label; it does not mention that ' +
        'EXAM_AHD_15 reuses four questions.';
      if (overlaps.length > 0) {
        warnings.push(
          makeFinding(
            'NOTICE_OMITS_FORM_OVERLAP',
            'The notice does not mention that EXAM_AHD_15 reuses Q1, Q4, Q5, and Q6.'
          )
        );
      }
    } else if (form.form_id === 'EXAM_180_V1') {
      noticeAssessment =
        overlaps.length === 0
          ? 'Empty notice; no exact question IDs overlap the shorter forms.'
          : 'Empty notice despite exact overlap with another form.';
      if (overlaps.length > 0) {
        warnings.push(
          makeFinding(
            'NOTICE_OMITS_FORM_OVERLAP',
            'The empty notice does not describe exact form overlap.'
          )
        );
      }
    }

    return {
      data_mode: 'legacy',
      form_id: form.form_id,
      status: statusFor(errors, warnings),
      declared_duration_sec: form.duration_sec,
      duration_minutes: round(form.duration_sec / 60),
      declared_total_points: form.total_points,
      calculated_total_points: calculatedPoints,
      point_delta: pointDelta,
      question_count: refs.length,
      resolved_question_count: resolvedQuestions.length,
      question_ids: refs,
      question_point_breakdown: questionPointBreakdown,
      missing_question_ids: missingIds,
      non_unique_bank_references: nonUniqueBankRefs,
      duplicate_question_ids: duplicateRefs.map((item) => item.value),
      duplicate_canonical_ids: duplicateCanonicalIds.map(
        (item) => item.value
      ),
      numeric_id_collision_memberships: collisionMemberships,
      part_count: partCount,
      invalid_max_scores: invalidScoresInForm,
      response_types: Array.from(formResponseTypes).sort(),
      unsupported_response_types: unsupportedTypes,
      specialized_supported_response_types: specializedTypes,
      notice: form.notice || '',
      notice_analysis: {
        exact_overlaps: overlaps,
        assessment: noticeAssessment
      },
      taxonomy,
      errors,
      warnings
    };
  });

  const pilotErrors = [];
  const pilotWarnings = [];
  const pilotRuntimeIds = pilotQuestions.map((question, index) => {
    return (
      (question.legacy_traceability &&
        question.legacy_traceability.legacy_question_bank_id) ||
      question.question_id ||
      'PILOT_' + (index + 1)
    );
  });
  const pilotDuplicateIds = duplicateValues(pilotRuntimeIds);
  pilotDuplicateIds.forEach((duplicate) => {
    pilotErrors.push(
      makeFinding(
        'DUPLICATE_PILOT_RUNTIME_ID',
        duplicate.value + ' appears more than once after runtime adaptation.'
      )
    );
  });

  let pilotPartCount = 0;
  let pilotPoints = 0;
  const pilotRawResponseTypes = new Set();
  const pilotRuntimeResponseTypes = new Set();
  pilotQuestions.forEach((question) => {
    (question.parts || []).forEach((part) => {
      pilotPartCount += 1;
      pilotRawResponseTypes.add(part.response_type || 'text');
      const runtimeType =
        PILOT_RESPONSE_TYPE_MAP[part.response_type] ||
        part.response_type ||
        'text';
      pilotRuntimeResponseTypes.add(runtimeType);
      if (!SUPPORTED_RUNTIME_RESPONSE_TYPES.has(runtimeType)) {
        pilotErrors.push(
          makeFinding(
            'UNSUPPORTED_PILOT_RESPONSE_TYPE',
            'Pilot response type ' +
              part.response_type +
              ' maps to unsupported runtime type ' +
              runtimeType +
              '.'
          )
        );
      }
      if (!isValidMaxScore(part.max_score)) {
        pilotErrors.push(
          makeFinding(
            'INVALID_PILOT_MAX_SCORE',
            question.question_id +
              '/' +
              (part.part_id || '?') +
              ' has invalid max_score.'
          )
        );
      } else {
        pilotPoints = round(pilotPoints + part.max_score);
      }
    });
  });

  const pilotTaxonomy = buildPilotTaxonomyCoverage(
    pilotQuestions,
    writtenCodes,
    themeCodes
  );
  const sourceReviewQuestions = pilotQuestions
    .filter((question) => question.source_profile === 'needs_full_source_review')
    .map((question) => question.question_id);
  if (sourceReviewQuestions.length > 0) {
    pilotWarnings.push(
      makeFinding(
        'PILOT_SOURCE_REVIEW_PENDING',
        sourceReviewQuestions.length +
          ' migrated pilot questions retain needs_full_source_review provenance.'
      )
    );
  }

  const provisionalTaxonomyParts = pilotQuestions
    .flatMap((question) => question.parts || [])
    .filter((part) =>
      String(part.taxonomy_assignment_status || '').startsWith('proposed_')
    ).length;
  if (provisionalTaxonomyParts > 0) {
    pilotWarnings.push(
      makeFinding(
        'PILOT_TAXONOMY_PROVISIONAL',
        provisionalTaxonomyParts +
          ' pilot parts use proposed candidate taxonomy assignments.'
      )
    );
  }

  const pilotForm = {
    data_mode: 'pilot',
    form_id: 'EXAM_180_V1',
    audit_id: 'pilot:EXAM_180_V1',
    status: statusFor(pilotErrors, pilotWarnings),
    declared_duration_sec: 10800,
    duration_minutes: 180,
    declared_total_points: pilotPoints,
    calculated_total_points: pilotPoints,
    point_delta: 0,
    question_count: pilotQuestions.length,
    part_count: pilotPartCount,
    runtime_question_ids: pilotRuntimeIds,
    duplicate_runtime_question_ids: pilotDuplicateIds.map(
      (item) => item.value
    ),
    response_types: Array.from(pilotRawResponseTypes).sort(),
    runtime_response_types: Array.from(pilotRuntimeResponseTypes).sort(),
    unsupported_response_types: [],
    notice:
      'Pilot compatibility mode: runs approved 15-item pilot bank in full ' +
      'mode only with 180-minute timer.',
    taxonomy: pilotTaxonomy,
    source_review_pending_question_ids: sourceReviewQuestions,
    provisional_taxonomy_part_count: provisionalTaxonomyParts,
    errors: pilotErrors,
    warnings: pilotWarnings
  };

  const embeddedBank = extractEmbeddedJson(
    scriptSource,
    'embeddedQuestionBank'
  );
  const embeddedForms = extractEmbeddedJson(scriptSource, 'embeddedExamForms');
  const embeddedBankMatches =
    JSON.stringify(embeddedBank) === JSON.stringify(bankPayload);
  const embeddedFormsMatch =
    JSON.stringify(embeddedForms) === JSON.stringify(formsPayload);
  if (!embeddedBankMatches) {
    globalErrors.push(
      makeFinding(
        'EMBEDDED_BANK_DRIFT',
        'script.js embeddedQuestionBank differs from question_bank.json.'
      )
    );
  }
  if (!embeddedFormsMatch) {
    globalErrors.push(
      makeFinding(
        'EMBEDDED_FORMS_DRIFT',
        'script.js embeddedExamForms differs from exam_forms.json.'
      )
    );
  }

  const referencedQuestionIds = new Set(
    forms.flatMap((form) => form.question_ids || [])
  );
  const unreferencedQuestionIds = questionIds
    .filter((id) => !referencedQuestionIds.has(id))
    .sort();
  if (unreferencedQuestionIds.length > 0) {
    globalWarnings.push(
      makeFinding(
        'UNREFERENCED_LIVE_QUESTIONS',
        unreferencedQuestionIds.length +
          ' live questions are not referenced by a default form.'
      )
    );
  }

  const allFormErrors = defaultForms.flatMap((form) => form.errors);
  const allFormWarnings = defaultForms.flatMap((form) => form.warnings);
  const allErrors = globalErrors.concat(allFormErrors, pilotErrors);
  const allWarnings = globalWarnings.concat(allFormWarnings, pilotWarnings);

  const audit = {
    schema_version: '1.0.0',
    generated_at: new Date().toISOString(),
    overall_status: statusFor(allErrors, allWarnings),
    source_files: [
      relative(PATHS.forms),
      relative(PATHS.bank),
      relative(PATHS.taxonomy),
      relative(PATHS.pilot),
      relative(PATHS.validator),
      relative(PATHS.tests),
      relative(PATHS.script)
    ],
    summary: {
      hard_failure_count: allErrors.length,
      warning_count: allWarnings.length,
      default_form_statuses: Object.fromEntries(
        defaultForms.map((form) => [form.form_id, form.status])
      ),
      pilot_form_status: pilotForm.status
    },
    question_bank: {
      version: bankPayload.version || null,
      updated_at: bankPayload.updated_at || null,
      question_count: questions.length,
      part_count: bankPartCount,
      calculated_total_points: bankPointTotal,
      duplicate_question_ids: duplicateQuestionIds,
      invalid_max_scores: invalidMaxScores,
      questions_without_parts: invalidQuestionParts,
      duplicate_part_ids_within_question: duplicatePartIdsWithinQuestion,
      globally_duplicate_part_ids: globallyDuplicatePartIds,
      response_type_counts: countValues(responseTypes),
      unsupported_response_types: Array.from(new Set(responseTypes))
        .filter((type) => !SUPPORTED_RUNTIME_RESPONSE_TYPES.has(type))
        .sort(),
      numeric_id_collisions: numericIdCollisions,
      prompt_list_count_warnings: listCountWarnings,
      unreferenced_question_ids: unreferencedQuestionIds
    },
    default_forms: defaultForms,
    pilot_form: pilotForm,
    canonical_and_candidate_artifacts: {
      authoritative_taxonomy_file: relative(PATHS.taxonomy),
      taxonomy_codes: {
        written_classifications: writtenCodeEntries,
        topic_themes: themeCodeEntries
      },
      taxonomy_join_source: relative(PATHS.pilot),
      duplicate_canonical_traceability: duplicateCanonicalMappings,
      artifacts_inspected: inventoryCandidateArtifacts()
    },
    runtime_analysis: {
      embedded_bank_matches_json: embeddedBankMatches,
      embedded_forms_match_json: embeddedFormsMatch,
      exact_string_question_lookup: true,
      behaviour: [
        {
          area: 'Exam points display',
          finding:
            'startExam and resume prefer non-zero form.total_points over the ' +
            'computed sum, so the UI displays 24, 24, and 180 for the three ' +
            'default forms despite computed totals of 30, 18, and 177.'
        },
        {
          area: 'Scoring denominator',
          finding:
            'updateScoreSummary sums active part max_score values, so scoring ' +
            'denominators are 30, 18, and 177. This conflicts with the points ' +
            'indicator for every default form.'
        },
        {
          area: 'Attempt export',
          finding:
            'Attempt and scored exports include exam_form_id, duration, and ' +
            'per-part max_score values, but no declared or computed form total. ' +
            'A consumer must sum parts and will obtain the computed totals.'
        },
        {
          area: 'Pilot total',
          finding:
            'createPilotExamForms computes total_points from adapted pilot ' +
            'parts at runtime, so its declared and computed values both equal 77.'
        },
        {
          area: 'ID lookup',
          finding:
            'resolveQuestionsForForm indexes exact string IDs. Q1 and Q01 do ' +
            'not collide at runtime, although normalization or manual review can ' +
            'conflate them.'
        }
      ]
    },
    taxonomy_limitations: [
      {
        code: 'PARTIAL_LIVE_BANK_COVERAGE',
        message:
          'Approved canonical/pilot traceability covers Q1-Q6 and Q14, Q15, ' +
          'Q16, Q17, Q19, Q20, Q21, Q22, and Q25 only. Other live questions ' +
          'remain unmapped in this audit.'
      },
      {
        code: 'NO_SILENT_INFERENCE',
        message:
          'Legacy numeric domain or rc_classification values were not converted ' +
          'to canonical codes unless an explicit approved-pilot mapping existed.'
      },
      {
        code: 'PROVISIONAL_ASSIGNMENTS',
        message:
          'All 38 pilot parts carry proposed candidate taxonomy status; this ' +
          'audit reports those labels but does not treat them as final expert review.'
      },
      {
        code: 'SOURCE_REVIEW_PENDING',
        message:
          'Nine migrated pilot questions retain needs_full_source_review and ' +
          'should not be treated as fully reviewed educational content.'
      },
      {
        code: 'COUNTING_POLICY',
        message:
          'Coverage distributions use the taxonomy policy’s first primary ' +
          'part-level code. Secondary labels are not double-counted.'
      }
    ],
    repair_guidance: {
      safe_automatic: [
        'Run this validator in CI and preserve its JSON output as release evidence.',
        'Add regression tests for exact references, duplicate references, duration, ' +
          'declared-versus-computed totals, response support, and embedded-data parity.',
        'Add explicit test fixtures for Q1/Q01 collisions without renaming live IDs.',
        'Update form-overlap documentation after the authoritative form decisions ' +
          'are approved.'
      ],
      requires_educational_review: [
        'Changing any form total_points value, question membership, part max_score, ' +
          'rubric, or notice that describes educational intent.',
        'Deciding whether EXAM_180_V1 should become 177 points or gain/reweight ' +
          'content to reach 180 points.',
        'Deciding whether EXAM_30 should be 30 points and EXAM_AHD_15 should be ' +
          '18 points, or whether their memberships or scoring were intended to differ.',
        'Resolving or renaming Q1/Q01 through Q7/Q07 identifier namespaces.',
        'Approving missing taxonomy, source provenance, blueprint balance, and the ' +
          'educational suitability of candidate questions.'
      ]
    },
    recommendation_90_minute: [
      'Do not publish EXAM_90 until Stephen resolves the three current point-total ' +
        'mismatches and approves the intended score target for a 90-minute form.',
      'Create a candidate artifact outside exam_forms.json using exact live IDs and ' +
        'never include both members of a Qn/Q0n collision without explicit review.',
      'Select only reviewed questions with valid part scores, supported response ' +
        'types, acceptable provenance, and explicitly approved canonical taxonomy.',
      'Use first-primary part-level taxonomy codes to measure draft blueprint ' +
        'coverage, show all missing metadata, and obtain educational approval for ' +
        'classification and theme balance rather than filling gaps by inference.',
      'Require calculated points to equal the approved declared total, document all ' +
        'overlap with existing forms, and add form-specific data and browser tests ' +
        'before making the candidate live.'
    ],
    global_errors: globalErrors,
    global_warnings: globalWarnings
  };

  fs.writeFileSync(
    PATHS.jsonReport,
    JSON.stringify(audit, null, 2) + '\n'
  );
  fs.writeFileSync(PATHS.markdownReport, renderMarkdownReport(audit));
  fs.writeFileSync(PATHS.gapReport, renderGapReport(audit));

  console.log(
    audit.overall_status +
      ': ' +
      allErrors.length +
      ' hard failures, ' +
      allWarnings.length +
      ' warnings.'
  );
  defaultForms.forEach((form) => {
    console.log(
      form.form_id +
        ': ' +
        form.status +
        ' (declared ' +
        form.declared_total_points +
        ', calculated ' +
        form.calculated_total_points +
        ')'
    );
  });
  console.log(
    pilotForm.audit_id +
      ': ' +
      pilotForm.status +
      ' (declared ' +
      pilotForm.declared_total_points +
      ', calculated ' +
      pilotForm.calculated_total_points +
      ')'
  );
  console.log('Wrote ' + relative(PATHS.jsonReport));
  console.log('Wrote ' + relative(PATHS.markdownReport));
  console.log('Wrote ' + relative(PATHS.gapReport));

  if (allErrors.length > 0) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error('Audit failed to run: ' + error.stack);
  process.exitCode = 2;
}
