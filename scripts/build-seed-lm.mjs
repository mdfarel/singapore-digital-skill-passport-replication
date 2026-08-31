// Loads the harvested Ministry of Manpower open data into labour-market series.
// Source: data.gov.sg datastore API. Values that MOM suppresses ("na", "-", "s")
// are dropped rather than coerced to zero.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const F = (p) => path.join(root, p);
const momDir = F('data/mom');

const SERIES = [
  { file: 'lfpr_by_sex', code: 'LFPR_SEX', title: 'Resident labour force participation rate, by sex', unit: '%', freq: 'annual', period: 'year', dims: ['sex'], value: 'lfpr', d1: 'Sex' },
  { file: 'lfpr_by_age_sex', code: 'LFPR_AGE_SEX', title: 'Resident labour force participation rate, by age and sex', unit: '%', freq: 'annual', period: 'year', dims: ['sex', 'age'], value: 'lfpr', d1: 'Sex', d2: 'Age group' },
  { file: 'employment_rate_25_64', code: 'EMPRATE_2564', title: 'Employment rate, residents aged 25 to 64', unit: '%', freq: 'annual', period: 'year', dims: [], value: 'emp_rate' },
  { file: 'employment_rate_25_64_by_sex', code: 'EMPRATE_2564_SEX', title: 'Employment rate, residents aged 25 to 64, by sex', unit: '%', freq: 'annual', period: 'year', dims: ['sex'], value: 'emp_rate', d1: 'Sex' },
  { file: 'long_term_unemployment_rate', code: 'LTU_RATE', title: 'Long-term unemployment rate', unit: '%', freq: 'annual', period: 'year', dims: ['residential_status'], value: 'ltu_rate', d1: 'Residential status' },
  { file: 'long_term_unemployed_count', code: 'LTU_COUNT', title: 'Long-term unemployed residents', unit: 'persons (thousands)', freq: 'annual', period: 'year', dims: ['residential_status'], value: 'long_term_unemployed', d1: 'Residential status' },
  { file: 'job_vacancy_annual', code: 'JV_TOTAL', title: 'Job vacancies', unit: 'vacancies', freq: 'annual', period: 'year', dims: [], value: 'job_vacancy' },
  { file: 'job_vacancy_rate_annual', code: 'JV_RATE', title: 'Job vacancy rate', unit: '%', freq: 'annual', period: 'year', dims: [], value: 'job_vacancy_rate' },
  { file: 'job_vacancy_by_industry_annual', code: 'JV_INDUSTRY', title: 'Job vacancies by industry', unit: 'vacancies', freq: 'annual', period: 'year', dims: ['industry'], value: 'job_vacancy', d1: 'Industry' },
  { file: 'job_vacancy_rate_by_industry_annual', code: 'JV_RATE_INDUSTRY', title: 'Job vacancy rate by industry', unit: '%', freq: 'annual', period: 'year', dims: ['industry'], value: 'job_vacancy_rate', d1: 'Industry' },
  { file: 'job_vacancy_by_occupation_annual', code: 'JV_OCCUPATION', title: 'Job vacancies by occupation group', unit: 'vacancies', freq: 'annual', period: 'year', dims: ['occupation'], value: 'job_vacancy', d1: 'Occupation group' },
  { file: 'job_vacancy_rate_by_occupation_annual', code: 'JV_RATE_OCCUPATION', title: 'Job vacancy rate by occupation group', unit: '%', freq: 'annual', period: 'year', dims: ['occupation'], value: 'job_vacancy_rate', d1: 'Occupation group' },
  { file: 'retrench_by_industry_annual', code: 'RETRENCH_INDUSTRY', title: 'Retrenched employees by industry', unit: 'persons', freq: 'annual', period: 'year', dims: ['industry'], value: 'retrench', d1: 'Industry' },
  { file: 'retrench_by_occupation_annual', code: 'RETRENCH_OCCUPATION', title: 'Retrenched employees by occupation group', unit: 'persons', freq: 'annual', period: 'year', dims: ['occupation'], value: 'retrench', d1: 'Occupation group' },
  { file: 'retrench_incidence_by_industry', code: 'RETRENCH_INC_INDUSTRY', title: 'Incidence of retrenchment by industry', unit: 'per 1,000 employees', freq: 'annual', period: 'year', dims: ['industry'], value: 'incidence_of_retrenchment', d1: 'Industry' },
  { file: 'retrench_incidence_by_occupation', code: 'RETRENCH_INC_OCCUPATION', title: 'Incidence of retrenchment by occupation group', unit: 'per 1,000 employees', freq: 'annual', period: 'year', dims: ['occupation'], value: 'incidence_of_retrenchment', d1: 'Occupation group' },
  { file: 'reentry_post_retrenchment_by_age', code: 'REENTRY_AGE', title: 'Re-entry into employment within 6 months of retrenchment, by age', unit: '%', freq: 'annual', period: 'year', dims: ['age1'], value: 'reentry_rate_6mth', d1: 'Age group' },
  { file: 'lf_by_highest_qualification', code: 'LF_QUALIFICATION', title: 'Resident labour force by highest qualification attained and sex', unit: 'persons (thousands)', freq: 'annual', period: 'year', dims: ['highest_qualification', 'sex'], value: 'labour_force', d1: 'Highest qualification', d2: 'Sex' },
  { file: 'recruitment_rate_annual', code: 'RECRUIT_RATE', title: 'Average monthly recruitment rate', unit: '%', freq: 'annual', period: 'year', dims: [], value: 'recruitment_rate' },
  { file: 'resignation_rate_annual', code: 'RESIGN_RATE', title: 'Average monthly resignation rate', unit: '%', freq: 'annual', period: 'year', dims: [], value: 'resignation_rate' },
  { file: 'wage_change_by_industry', code: 'WAGE_CHANGE', title: 'Basic wage change (nominal) by industry', unit: '% change', freq: 'annual', period: 'year', dims: ['ind1', 'ind2'], value: 'bwc', d1: 'Industry group', d2: 'Industry' },
  { file: 'unemployed_by_qualification', code: 'UNEMP_QUALIFICATION', title: 'Unemployed residents by highest qualification, duration and sex', unit: 'persons (thousands)', freq: 'annual', period: 'year', dims: ['highest_qualification', 'duration_of_unemployment', 'sex'], value: 'unemployed', d1: 'Highest qualification', d2: 'Duration of unemployment' },
  { file: 'unemployed_by_age_duration_sex', code: 'UNEMP_AGE', title: 'Unemployed residents by age, duration and sex', unit: 'persons (thousands)', freq: 'annual', period: 'year', dims: ['age', 'duration_of_unemployment', 'sex'], value: 'unemployed', d1: 'Age group', d2: 'Duration of unemployment' },
];

// The labour-force status file carries four measures side by side.
const MULTI = {
  file: 'labour_force_status_age_sex',
  measures: [
    { code: 'LF_TOTAL', title: 'Resident labour force by age and sex', field: 'labour_force' },
    { code: 'LF_EMPLOYED', title: 'Employed residents by age and sex', field: 'employed' },
    { code: 'LF_UNEMPLOYED', title: 'Unemployed residents by age and sex', field: 'unemployed' },
    { code: 'LF_OUTSIDE', title: 'Residents outside the labour force by age and sex', field: 'outside_labour_force' },
  ],
};

const catalogue = JSON.parse(fs.readFileSync(path.join(momDir, '_catalogue.json'), 'utf8'));
const ridOf = (file) => {
  const summary = JSON.parse(fs.readFileSync(F('data/mom/_summary.json'), 'utf8'));
  return summary[file]?.rid ?? null;
};
const summary = JSON.parse(fs.readFileSync(F('data/mom/_summary.json'), 'utf8'));

const out = ['-- Generated by scripts/build-seed-lm.mjs. Ministry of Manpower open data via data.gov.sg.'];
const q = (v) => v === null || v === undefined ? 'NULL'
  : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`;
const insert = (table, cols, rows) => {
  if (!rows.length) return;
  // D1 caps individual statement size, so batch by rendered byte length, not row count.
  const MAX = 40000;
  let buf = [], size = 0;
  const flush = () => {
    if (!buf.length) return;
    out.push(`INSERT INTO ${table} (${cols.join(', ')}) VALUES\n` + buf.join(',\n') + ';');
    buf = []; size = 0;
  };
  for (const r of rows) {
    const s = `(${r.map(q).join(', ')})`;
    if (size + s.length > MAX) flush();
    buf.push(s); size += s.length + 2;
  }
  flush();
};

const num = (v) => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s || /^(na|nan|-|s|\.\.|—)$/i.test(s)) return null;
  const n = Number(s.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
};
const title = (s) => String(s).replace(/\b\w/g, (m) => m.toUpperCase());

const seriesRows = [];
const obsRows = [];
let sid = 1, oid = 1;

const addSeries = (def, rows, valueField) => {
  const rid = summary[def.file]?.rid || null;
  const mine = [];
  for (const r of rows) {
    const v = num(r[valueField]);
    if (v === null) continue;
    mine.push([oid++, sid, String(r[def.period]),
      def.dims[0] ? title(r[def.dims[0]]) : null,
      def.dims[1] ? title(r[def.dims[1]]) : null,
      def.dims[2] ? title(r[def.dims[2]]) : null, v]);
  }
  seriesRows.push([sid, def.code, def.title, 'Ministry of Manpower', rid, def.unit, def.freq,
    def.d1 ?? null, def.d2 ?? null,
    rid ? `https://data.gov.sg/datasets/${rid}/view` : null, mine.length]);
  obsRows.push(...mine);
  sid++;
};

for (const def of SERIES) {
  const p = path.join(momDir, `${def.file}.json`);
  if (!fs.existsSync(p)) { console.warn('missing', def.file); continue; }
  addSeries(def, JSON.parse(fs.readFileSync(p, 'utf8')), def.value);
}

const multiRows = JSON.parse(fs.readFileSync(path.join(momDir, `${MULTI.file}.json`), 'utf8'));
for (const m of MULTI.measures) {
  addSeries({ file: MULTI.file, code: m.code, title: m.title, unit: 'persons (thousands)',
    freq: 'annual', period: 'year', dims: ['sex', 'age'], d1: 'Sex', d2: 'Age group' },
    multiRows, m.field);
}

insert('lm_series', ['id', 'code', 'title', 'agency', 'dataset_id', 'unit', 'frequency', 'dim1_label', 'dim2_label', 'source_url', 'rows'], seriesRows);
insert('lm_observations', ['id', 'series_id', 'period', 'dim1', 'dim2', 'dim3', 'value'], obsRows);

fs.writeFileSync(F('db/seed_lm.sql'), out.join('\n\n') + '\n');
console.log('labour-market data written');
console.log('  series', seriesRows.length, '| observations', obsRows.length);
console.log('  MOM datasets in catalogue:', catalogue.length);
