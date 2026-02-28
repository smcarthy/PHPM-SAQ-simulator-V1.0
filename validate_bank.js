#!/usr/bin/env node
const fs = require('fs');
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

function inferListCountFromPrompt(prompt) {
  const wordMatches = [...prompt.matchAll(/\b(ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|TEN)\b/gi)].map((m) => NUMBER_WORDS[m[1].toUpperCase()]);
  if (/\band\b/i.test(prompt) && wordMatches.length >= 2) return wordMatches[0] + wordMatches[1];
  if (wordMatches.length) return wordMatches[0];
  const digitMatches = [...prompt.matchAll(/\b(\d{1,2})\b/g)].map((m) => parseInt(m[1], 10));
  if (/\band\b/i.test(prompt) && digitMatches.length >= 2) return digitMatches[0] + digitMatches[1];
  if (digitMatches.length) return digitMatches[0];
  return null;
}

function validate(data) {
  const errors = [];
  const warnings = [];

  if (!data || !Array.isArray(data.questions)) {
    errors.push('questions must be an array');
    return { errors, warnings };
  }

  const qIds = new Set();
  const partIds = new Set();
  let totalMarks = 0;

  data.questions.forEach((q, qIdx) => {
    if (!q.id) errors.push(`questions[${qIdx}] missing id`);
    if (qIds.has(q.id)) errors.push(`duplicate question id: ${q.id}`);
    qIds.add(q.id);

    if (!Array.isArray(q.parts) || q.parts.length === 0) {
      errors.push(`${q.id || `questions[${qIdx}]`} must contain parts`);
      return;
    }

    q.parts.forEach((p, pIdx) => {
      const loc = `${q.id || `questions[${qIdx}]`}.parts[${pIdx}]`;
      if (!p.id) errors.push(`${loc} missing id`);
      if (partIds.has(p.id)) errors.push(`duplicate part id: ${p.id}`);
      partIds.add(p.id);

      if (typeof p.max_score !== 'number' || Number.isNaN(p.max_score) || p.max_score <= 0) {
        errors.push(`${loc} invalid max_score: ${p.max_score}`);
      } else {
        totalMarks += p.max_score;
      }

      if (!Array.isArray(p.rubric) || p.rubric.length === 0) {
        errors.push(`${loc} rubric must be a non-empty array`);
      }

      if (p.response_type === 'list') {
        if (!Number.isInteger(p.list_count) || p.list_count <= 0) {
          errors.push(`${loc} list response must include positive integer list_count`);
        }
        const inferred = inferListCountFromPrompt(p.prompt || '');
        if (inferred != null && inferred !== p.list_count) {
          warnings.push(`${p.id}: prompt suggests ${inferred} items but list_count is ${p.list_count}`);
        }
      }
    });
  });

  return { errors, warnings, totalMarks };
}

try {
  const data = JSON.parse(fs.readFileSync('question_bank.json', 'utf8'));
  const { errors, warnings, totalMarks } = validate(data);

  console.log(`Questions: ${data.questions.length}`);
  console.log(`Total marks: ${totalMarks}`);

  if (warnings.length) {
    console.log('\nWarnings:');
    warnings.forEach((w) => console.log(` - ${w}`));
  }

  if (errors.length) {
    console.error('\nErrors:');
    errors.forEach((e) => console.error(` - ${e}`));
    process.exit(1);
  }

  console.log('\nBank validation passed.');
} catch (err) {
  console.error('Validation failed to run:', err.message);
  process.exit(1);
}
