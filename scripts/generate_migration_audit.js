#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BANK_PATH = path.resolve('question_bank.json');
const FORMS_PATH = path.resolve('exam_forms.json');
const OUT_JSON = path.resolve('reports/question-bank-audit.json');
const OUT_MD = path.resolve('reports/question-bank-audit.md');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function numericId(id) {
  const m = /^Q(\d+)$/.exec(String(id || '').trim());
  if (!m) return null;
  return parseInt(m[1], 10);
}

function hasSourceMetadata(question) {
  const qSource = ['source', 'sources', 'source_profile'].some((k) => question[k] != null);
  const partSource = (question.parts || []).some((p) => p && typeof p === 'object' && ['source', 'sources', 'source_list'].some((k) => p[k] != null));
  return qSource || partSource;
}

function inferWidgetIndicators(question) {
  const indicators = {
    response_types: [],
    has_single_line: false,
    uses_haddon_matrix_flags: false,
    has_nonstandard_response_type: false
  };
  const allowedResponseTypes = new Set(['list', 'text']);
  const types = new Set();

  for (const p of question.parts || []) {
    if (!p || typeof p !== 'object') continue;
    if (p.response_type) {
      types.add(p.response_type);
      if (!allowedResponseTypes.has(p.response_type)) {
        indicators.has_nonstandard_response_type = true;
      }
    }
    if (p.single_line === true) indicators.has_single_line = true;
    if (p.haddon_time_as_rows != null || p.haddon_include_workspace != null) indicators.uses_haddon_matrix_flags = true;
  }

  indicators.response_types = Array.from(types).sort();
  return indicators;
}

function main() {
  const bank = readJson(BANK_PATH);
  const forms = readJson(FORMS_PATH);

  const questions = Array.isArray(bank.questions) ? bank.questions : [];
  const formList = Array.isArray(forms.forms) ? forms.forms : [];

  const formMembership = new Map();
  for (const q of questions) formMembership.set(q.id, []);

  for (const form of formList) {
    const formId = form.form_id || 'UNKNOWN_FORM';
    for (const qid of form.question_ids || []) {
      if (!formMembership.has(qid)) formMembership.set(qid, []);
      formMembership.get(qid).push(formId);
    }
  }

  const numericBuckets = new Map();
  for (const q of questions) {
    const n = numericId(q.id);
    if (n == null) continue;
    if (!numericBuckets.has(n)) numericBuckets.set(n, []);
    numericBuckets.get(n).push(q.id);
  }
  const numericCollisions = new Map();
  for (const [num, ids] of numericBuckets.entries()) {
    if (ids.length > 1) numericCollisions.set(num, ids);
  }

  const auditRows = [];
  const globalIssues = {
    mixed_id_conventions: false,
    mixed_number_usage: false,
    mixed_domain_usage: false,
    mixed_rc_classification_usage: false,
    mixed_theme_usage: false,
    mixed_response_types: false,
    unsupported_or_unclear_response_structures: []
  };

  const idStyles = new Set();
  const hasNumber = { yes: 0, no: 0 };
  const hasDomain = { yes: 0, no: 0 };
  const hasRc = { yes: 0, no: 0 };
  const hasTheme = { yes: 0, no: 0 };
  const responseTypeSet = new Set();

  for (const q of questions) {
    const parts = Array.isArray(q.parts) ? q.parts : [];
    const domainValues = Array.from(new Set(parts.filter((p) => p && p.domain != null).map((p) => p.domain)));
    const rcValues = Array.from(new Set(parts.filter((p) => p && p.rc_classification != null).map((p) => p.rc_classification)));
    const themeValues = Array.from(new Set(parts.filter((p) => p && p.theme != null).map((p) => p.theme)));

    const totalPoints = parts.reduce((sum, p) => sum + (typeof p?.max_score === 'number' ? p.max_score : 0), 0);
    const widgetIndicators = inferWidgetIndicators(q);
    for (const rt of widgetIndicators.response_types) responseTypeSet.add(rt);

    if (/^Q\d{2}$/.test(q.id)) idStyles.add('zero_padded');
    else if (/^Q\d+$/.test(q.id)) idStyles.add('non_padded');
    else idStyles.add('other');

    if (q.number == null) hasNumber.no += 1; else hasNumber.yes += 1;
    if (domainValues.length) hasDomain.yes += 1; else hasDomain.no += 1;
    if (rcValues.length) hasRc.yes += 1; else hasRc.no += 1;
    if (themeValues.length) hasTheme.yes += 1; else hasTheme.no += 1;

    const issues = [];
    const idNum = numericId(q.id);

    if (q.number == null) issues.push('missing_question_number');
    if (typeof q.number === 'number' && idNum != null && q.number !== idNum) issues.push('id_number_mismatch');
    if (idNum != null && numericCollisions.has(idNum)) issues.push('ambiguous_numeric_id_collision');
    if (!domainValues.length) issues.push('missing_legacy_domain');
    if (!rcValues.length) issues.push('missing_rc_classification');
    if (!themeValues.length) issues.push('missing_theme');
    if (domainValues.length > 1) issues.push('multiple_legacy_domain_values_within_question');
    if (!hasSourceMetadata(q)) issues.push('missing_source_metadata');
    if ((formMembership.get(q.id) || []).length === 0) issues.push('not_referenced_by_any_form');
    if (widgetIndicators.has_nonstandard_response_type) issues.push('contains_nonstandard_response_type');

    let riskScore = 0;
    for (const issue of issues) {
      if (['id_number_mismatch', 'ambiguous_numeric_id_collision', 'multiple_legacy_domain_values_within_question'].includes(issue)) riskScore += 2;
      else if (['contains_nonstandard_response_type', 'missing_source_metadata', 'not_referenced_by_any_form'].includes(issue)) riskScore += 1;
      else riskScore += 1;
    }

    let riskTier = 'low';
    if (riskScore >= 5) riskTier = 'high';
    else if (riskScore >= 3) riskTier = 'medium';

    auditRows.push({
      id: q.id,
      number: q.number ?? null,
      legacy_domain_values: domainValues,
      rc_classification_values: rcValues,
      theme_values: themeValues,
      total_points: totalPoints,
      part_count: parts.length,
      widget_indicators: widgetIndicators,
      has_stem_image: q.stem_image != null,
      stem_image: q.stem_image ?? null,
      has_source_metadata: hasSourceMetadata(q),
      forms: (formMembership.get(q.id) || []).sort(),
      issues,
      migration_risk: riskTier,
      migration_risk_score: riskScore
    });
  }

  globalIssues.mixed_id_conventions = idStyles.size > 1;
  globalIssues.mixed_number_usage = hasNumber.yes > 0 && hasNumber.no > 0;
  globalIssues.mixed_domain_usage = hasDomain.yes > 0 && hasDomain.no > 0;
  globalIssues.mixed_rc_classification_usage = hasRc.yes > 0 && hasRc.no > 0;
  globalIssues.mixed_theme_usage = hasTheme.yes > 0 && hasTheme.no > 0;
  globalIssues.mixed_response_types = responseTypeSet.size > 1;

  const unclearResponse = new Set();
  for (const row of auditRows) {
    for (const rt of row.widget_indicators.response_types) {
      if (!['list', 'text'].includes(rt)) unclearResponse.add(rt);
    }
  }
  globalIssues.unsupported_or_unclear_response_structures = Array.from(unclearResponse).sort();

  const issueCounts = {};
  for (const row of auditRows) {
    for (const issue of row.issues) issueCounts[issue] = (issueCounts[issue] || 0) + 1;
  }

  const riskCounts = { low: 0, medium: 0, high: 0 };
  for (const row of auditRows) riskCounts[row.migration_risk] += 1;

  const payload = {
    generated_at: new Date().toISOString(),
    source_files: ['question_bank.json', 'exam_forms.json'],
    summary: {
      question_count: questions.length,
      total_forms: formList.length,
      form_ids: formList.map((f) => f.form_id),
      risk_counts: riskCounts,
      issue_counts: issueCounts,
      global_inconsistency_flags: globalIssues
    },
    questions: auditRows.sort((a, b) => (numericId(a.id) ?? 9999) - (numericId(b.id) ?? 9999) || a.id.localeCompare(b.id))
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2) + '\n');

  const lines = [];
  lines.push('# Question Bank Migration Audit');
  lines.push('');
  lines.push(`Generated: ${payload.generated_at}`);
  lines.push('');
  lines.push('## Scope');
  lines.push('- Inputs: `question_bank.json`, `exam_forms.json`');
  lines.push(`- Questions inventoried: ${payload.summary.question_count}`);
  lines.push(`- Forms inspected: ${payload.summary.total_forms} (${payload.summary.form_ids.join(', ')})`);
  lines.push('');
  lines.push('## Migration Risk Summary');
  lines.push(`- Low risk: ${riskCounts.low}`);
  lines.push(`- Medium risk: ${riskCounts.medium}`);
  lines.push(`- High risk: ${riskCounts.high}`);
  lines.push('');
  lines.push('## Global Inconsistency Flags');
  for (const [k, v] of Object.entries(globalIssues)) {
    lines.push(`- ${k}: ${Array.isArray(v) ? (v.length ? v.join(', ') : 'none') : v}`);
  }
  lines.push('');
  lines.push('## Issue Counts');
  Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .forEach(([issue, count]) => lines.push(`- ${issue}: ${count}`));
  lines.push('');
  lines.push('## Per-Question Inventory');
  lines.push('| id | number | legacy_domain | rc_classification | theme | points | parts | response_types | stem_image | source_metadata | forms | risk | key_issues |');
  lines.push('|---|---:|---|---|---|---:|---:|---|---|---|---|---|---|');
  for (const row of payload.questions) {
    lines.push(`| ${row.id} | ${row.number ?? '—'} | ${row.legacy_domain_values.length ? row.legacy_domain_values.join(',') : '—'} | ${row.rc_classification_values.length ? row.rc_classification_values.join(',') : '—'} | ${row.theme_values.length ? row.theme_values.join(',') : '—'} | ${row.total_points} | ${row.part_count} | ${row.widget_indicators.response_types.join(',')} | ${row.has_stem_image ? 'yes' : 'no'} | ${row.has_source_metadata ? 'yes' : 'no'} | ${row.forms.length ? row.forms.join(',') : '—'} | ${row.migration_risk} | ${row.issues.join(', ')} |`);
  }

  fs.writeFileSync(OUT_MD, lines.join('\n') + '\n');
  console.log(`Wrote ${OUT_JSON}`);
  console.log(`Wrote ${OUT_MD}`);
}

main();
