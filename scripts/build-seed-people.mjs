// Generates the passport, employer and hiring side of the demonstration database.
// Every person is synthetic. Careers are built backwards from a current role so
// that employment history, qualifications, training and skill claims agree with
// each other and with the registry.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const F = (p) => path.join(root, p);
const load = (m) => import(new URL(`../data/framework/${m}.mjs`, import.meta.url));

const { sectors } = await load('sectors');
const { ccs } = await load('ccs');
const { crossSectorTscs } = await load('tsc-core');
const { tscsA } = await load('tsc-sectors-a');
const { tscsB } = await load('tsc-sectors-b');
const { tscsC } = await load('tsc-sectors-c');
const { rolesA } = await load('roles-a');
const { rolesB } = await load('roles-b');
const { rolesC } = await load('roles-c');
const { courses } = await load('courses');
const ids = JSON.parse(fs.readFileSync(F('db/.ids.json'), 'utf8'));

const allTscs = [...crossSectorTscs, ...tscsA, ...tscsB, ...tscsC];
const allRoles = [...rolesA, ...rolesB, ...rolesC];
const roleByCode = new Map(allRoles.map((r) => [r.code, r]));
const tscByCode = new Map(allTscs.map((t) => [t.code, t]));
const courseByCode = new Map(courses.map((c) => [c.code, c]));
const sectorByCode = new Map(sectors.map((s) => [s.code, s]));

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(4815162342);
const pick = (a) => a[Math.floor(rnd() * a.length)];
const pickN = (a, n) => { const c = [...a], o = []; while (o.length < n && c.length) o.push(c.splice(Math.floor(rnd() * c.length), 1)[0]); return o; };
const int = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
const chance = (p) => rnd() < p;

const TODAY = '2026-08-30';
const iso = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

// --- name pools reflecting Singapore's resident population -------------------
const CHINESE_SUR = ['Tan', 'Lim', 'Lee', 'Ng', 'Ong', 'Wong', 'Goh', 'Chua', 'Chan', 'Koh', 'Teo', 'Ang', 'Yeo', 'Tay', 'Low', 'Sim', 'Toh', 'Chong'];
const CHINESE_GIV = ['Wei Ming', 'Jia Hui', 'Kai Xin', 'Zhi Hao', 'Mei Ling', 'Yong Sheng', 'Hui Min', 'Jun Jie', 'Xin Yi', 'Wen Jie', 'Li Ting', 'Cheng Han', 'Shu Fen', 'Boon Keng', 'Su Lin', 'Kok Wai'];
const MALAY_GIV = ['Nurul', 'Muhammad', 'Siti', 'Ahmad', 'Farhan', 'Aisyah', 'Iskandar', 'Nadia', 'Hafiz', 'Zulaikha', 'Rizwan', 'Syafiqah'];
const MALAY_SUR = ['bin Abdullah', 'binte Rahman', 'bin Ismail', 'binte Yusof', 'bin Hassan', 'binte Salleh', 'bin Osman', 'binte Karim'];
const INDIAN_GIV = ['Priya', 'Rajesh', 'Kavitha', 'Suresh', 'Deepa', 'Arun', 'Lakshmi', 'Vignesh', 'Meera', 'Karthik', 'Anitha', 'Ramesh'];
const INDIAN_SUR = ['Nair', 'Pillai', 'Kumar', 'Raman', 'Menon', 'Subramaniam', 'Krishnan', 'Rajan', 'Shanmugam', 'Devi'];
const OTHER = [['Amanda', 'Fernandez'], ['Marcus', 'de Souza'], ['Rachel', 'Pereira'], ['Daniel', 'Lopez'], ['Grace', 'Sim-Oliveiro']];

function makeName() {
  const r = rnd();
  if (r < 0.62) return `${pick(CHINESE_GIV)} ${pick(CHINESE_SUR)}`;
  if (r < 0.79) return `${pick(MALAY_GIV)} ${pick(MALAY_SUR)}`;
  if (r < 0.93) return `${pick(INDIAN_GIV)} ${pick(INDIAN_SUR)}`;
  const [a, b] = pick(OTHER); return `${a} ${b}`;
}

const EMPLOYER_PREFIX = ['Marina', 'Keppel Bay', 'Jurong', 'Tampines', 'Novena', 'Changi', 'Woodlands', 'Bugis', 'Paya Lebar', 'Tuas', 'Serangoon', 'Punggol', 'Kallang', 'Sentosa', 'Bedok', 'Yishun', 'Clementi', 'Redhill', 'Bishan', 'Pasir Panjang'];
const EMPLOYER_SUFFIX = ['Holdings', 'Group', 'Technologies', 'Solutions', 'Partners', 'Industries', 'Services', 'Systems', 'Ventures', 'Works', 'Labs', 'Collective'];
const SIZE = ['micro', 'small', 'medium', 'large'];
const TIERS = ['none', 'adopter', 'practitioner', 'leader'];

const QUALS = {
  Support: [['Institute of Technical Education', 'Nitec', 'Certificate'], ['Institute of Technical Education', 'Higher Nitec', 'Certificate']],
  Associate: [['Institute of Technical Education', 'Higher Nitec', 'Certificate'], ['Nanyang Polytechnic', 'Diploma', 'Diploma'], ['Singapore Polytechnic', 'Diploma', 'Diploma'], ['Temasek Polytechnic', 'Diploma', 'Diploma']],
  Professional: [['Nanyang Technological University', 'Bachelor of Engineering', 'Bachelor'], ['National University of Singapore', 'Bachelor of Science', 'Bachelor'], ['Singapore Management University', 'Bachelor of Business Management', 'Bachelor'], ['Singapore Institute of Technology', 'Bachelor of Engineering', 'Bachelor'], ['Ngee Ann Polytechnic', 'Diploma', 'Diploma']],
  Manager: [['National University of Singapore', 'Bachelor of Business Administration', 'Bachelor'], ['Nanyang Technological University', 'Master of Science', 'Master'], ['Singapore Management University', 'Master of Business Administration', 'Master'], ['Singapore University of Social Sciences', 'Bachelor of Science', 'Bachelor']],
  Leader: [['National University of Singapore', 'Master of Business Administration', 'Master'], ['Nanyang Technological University', 'Master of Science', 'Master'], ['Singapore Management University', 'Master of Business Administration', 'Master']],
};
const FIELDS = { Support: 'Technical Studies', Associate: 'Applied Science', Professional: 'Engineering', Manager: 'Business', Leader: 'Business' };

const out = ['-- Generated by scripts/build-seed-people.mjs. All persons and employers are synthetic.'];
const q = (v) => v === null || v === undefined ? 'NULL' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`;
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

// --- employers ---------------------------------------------------------------
const employers = [];
for (let i = 0; i < 46; i++) {
  const sec = pick(sectors);
  const name = `${pick(EMPLOYER_PREFIX)} ${pick(EMPLOYER_SUFFIX)}`;
  employers.push({
    id: i + 1,
    uen: `${int(1990, 2024)}${String(int(10000, 99999))}${'ABCDEFGHJKLMNPRSTUWXZ'[int(0, 20)]}`,
    name: employers.some((e) => e.name === name) ? `${name} (${sec.code})` : name,
    sector: sec.code,
    size: pick(SIZE),
    tier: pick(TIERS),
  });
}
insert('employers', ['id', 'uen', 'name', 'sector_id', 'size_band', 'skills_first_tier', 'contact_email'],
  employers.map((e) => [e.id, e.uen, e.name, ids.sector[e.sector], e.size, e.tier,
    `talent@${e.name.toLowerCase().replace(/[^a-z]+/g, '')}.example.sg`]));

// --- people ------------------------------------------------------------------
// Hero personas anchor the demo; the rest are generated across every sector.
const HEROES = [
  { name: 'Nurul Aisyah binte Rahman', role: 'HLT-R02', target: 'HLT-R07', age: 34, headline: 'Registered nurse moving into health informatics' },
  { name: 'Wei Ming Tan', role: 'PRE-R01', target: 'PRE-R04', age: 41, headline: 'CNC machinist retraining for automation engineering' },
  { name: 'Priya Nair', role: 'FIN-R03', target: 'FIN-R04', age: 37, headline: 'Compliance officer specialising in financial crime analytics' },
  { name: 'Marcus de Souza', role: 'RET-R02', target: 'RET-R05', age: 45, headline: 'Store manager building e-commerce capability' },
  { name: 'Jia Hui Lim', role: 'ICT-R01', target: 'ICT-R07', age: 29, headline: 'Software engineer moving into machine learning' },
  { name: 'Ahmad Hafiz bin Ismail', role: 'BEV-R01', target: 'BEV-R04', age: 38, headline: 'Site supervisor moving to integrated digital delivery' },
];

const persons = [];
const usedEmails = new Set();
const emailFor = (name, i) => {
  let base = name.toLowerCase().replace(/[^a-z ]/g, '').trim().split(/\s+/).slice(0, 2).join('.');
  let e = `${base}@passport.example.sg`;
  if (usedEmails.has(e)) e = `${base}${i}@passport.example.sg`;
  usedEmails.add(e);
  return e;
};

const pathwayFor = (role) => {
  // the same overlap rule the registry uses, applied at generation time
  const fm = new Map(role.tscs.map((s) => s.split(':')).map(([c, l]) => [c, Number(l)]));
  const cands = allRoles.filter((r) => r.code !== role.code).map((to) => {
    const tm = new Map(to.tscs.map((s) => s.split(':')).map(([c, l]) => [c, Number(l)]));
    let met = 0; for (const [c, l] of tm) if ((fm.get(c) ?? 0) >= l) met++;
    return { to, overlap: tm.size ? met / tm.size : 0 };
  }).filter((x) => x.overlap >= 0.3).sort((a, b) => b.overlap - a.overlap);
  return cands.slice(0, 10).map((x) => x.to);
};

let pid = 1;
for (const h of HEROES) {
  persons.push({ id: pid++, name: h.name, age: h.age, role: roleByCode.get(h.role), target: roleByCode.get(h.target), headline: h.headline, residency: 'citizen' });
}
const heroRoleCodes = new Set(HEROES.map((h) => h.role));
const spread = allRoles.filter((r) => !heroRoleCodes.has(r.code));
for (const role of pickN(spread, 66)) {
  const age = role.band === 'Support' ? int(19, 45) : role.band === 'Associate' ? int(22, 52)
    : role.band === 'Professional' ? int(25, 55) : role.band === 'Manager' ? int(33, 58) : int(40, 62);
  const opts = pathwayFor(role);
  persons.push({
    id: pid++, name: makeName(), age,
    role, target: opts.length && chance(0.72) ? pick(opts.slice(0, 5)) : null,
    headline: null, residency: chance(0.86) ? 'citizen' : 'pr',
  });
}

insert('persons', ['id', 'ref', 'name', 'email', 'birth_year', 'residency', 'headline', 'current_role_id', 'target_role_id', 'created_at'],
  persons.map((p, i) => [p.id, `****${String(1000 + p.id).slice(-3)}${'ABCDEFGHJKLMNPRSTUWXZ'[p.id % 21]}`,
    p.name, emailFor(p.name, i), 2026 - p.age, p.residency,
    p.headline ?? `${p.role.title} in ${sectorByCode.get(p.role.sector).name}`,
    ids.role[p.role.code], p.target ? ids.role[p.target.code] : null, `${2026 - Math.min(p.age - 18, 12)}-01-15`]));

// --- employment history ------------------------------------------------------
const bandOrder = ['Support', 'Associate', 'Professional', 'Manager', 'Leader'];
const employmentRows = [];
const personEmployment = new Map();
let eid = 1;
for (const p of persons) {
  const history = [];
  const workingYears = Math.max(1, p.age - (bandOrder.indexOf(p.role.band) >= 2 ? 23 : 18));
  const stints = Math.min(5, Math.max(1, Math.round(workingYears / int(3, 6))));
  let endYear = 2026;
  let cur = p.role;
  // Each engagement ends where the next one begins, so a career reads as a
  // continuous record rather than overlapping stints.
  let nextStart = null;
  for (let s = 0; s < stints; s++) {
    const years = s === 0 ? int(1, 5) : int(2, 6);
    const startYear = Math.max(2026 - workingYears, endYear - years);
    if (startYear >= endYear) break;
    const prevEmp = history.length ? history[history.length - 1].employer : null;
    const pool = employers.filter((e) => e.sector === cur.sector && e.id !== prevEmp?.id);
    const emp = pool.length ? pick(pool) : pick(employers.filter((e) => e.id !== prevEmp?.id));
    const start = iso(startYear, int(1, 12), int(1, 28));
    history.push({
      role: cur, employer: emp,
      start,
      end: s === 0 ? null : nextStart,
      arrangement: s === 0 ? (chance(0.9) ? 'full-time' : 'part-time') : chance(0.85) ? 'full-time' : 'contract',
    });
    nextStart = start;
    endYear = startYear;
    // Step back one band for the previous engagement; where nothing sits below,
    // fall back to a different role at the same band, which is how flat careers
    // actually look. Only a dead end stops the history.
    const bandIdx = bandOrder.indexOf(cur.band);
    const lower = allRoles.filter((r) => r.sector === cur.sector && bandOrder.indexOf(r.band) === bandIdx - 1);
    const sideways = allRoles.filter((r) => r.sector === cur.sector && r.band === cur.band && r.code !== cur.code);
    const next = lower.length ? lower : sideways;
    if (!next.length) break;
    cur = pick(next);
    if (endYear <= 2026 - workingYears) break;
  }
  personEmployment.set(p.id, history);
  for (const h of history) {
    employmentRows.push([eid++, p.id, h.employer.name, h.employer.uen, h.role.title,
      ids.role[h.role.code], ids.sector[h.role.sector], h.role.ssoc, h.start, h.end,
      h.arrangement, h.arrangement === 'freelance' ? 'self' : 'cpf',
      h.arrangement === 'freelance' ? null : `${h.start.slice(0, 8)}28`]);
  }
  // a minority also record non-CPF freelance work, self-declared
  if (chance(0.18)) {
    const y = int(2019, 2025);
    employmentRows.push([eid++, p.id, 'Independent practice', null, `Freelance ${p.role.title}`,
      ids.role[p.role.code], ids.sector[p.role.sector], p.role.ssoc,
      iso(y, int(1, 6), int(1, 28)), iso(y + 1, int(7, 12), int(1, 28)), 'freelance', 'self', null]);
  }
}
insert('employment_records', ['id', 'person_id', 'employer', 'uen', 'job_title', 'role_id', 'sector_id', 'ssoc', 'start_date', 'end_date', 'arrangement', 'source', 'verified_at'], employmentRows);

// --- qualifications ----------------------------------------------------------
const qualRows = [];
let qid = 1;
for (const p of persons) {
  const set = QUALS[p.role.band];
  const [inst, qual, level] = pick(set);
  const conferredYear = 2026 - p.age + (level === 'Master' ? 25 : level === 'Bachelor' ? 23 : level === 'Diploma' ? 20 : 18);
  qualRows.push([qid++, p.id, inst, qual, FIELDS[p.role.band], level,
    iso(Math.min(conferredYear, 2025), int(4, 8), int(1, 28)), 'moe', TODAY]);
  if ((level === 'Master' || chance(0.3)) && p.age > 30) {
    qualRows.push([qid++, p.id, pick(['Nanyang Polytechnic', 'Singapore Polytechnic', 'Ngee Ann Polytechnic']),
      'Diploma', FIELDS[p.role.band], 'Diploma', iso(Math.min(conferredYear - 4, 2024), int(4, 8), int(1, 28)), 'moe', TODAY]);
  }
}
insert('qualifications', ['id', 'person_id', 'institution', 'qualification', 'field', 'level', 'conferred_on', 'source', 'verified_at'], qualRows);

// --- training and certifications ---------------------------------------------
// Courses are chosen because they deliver skills the person's current or target role needs.
const trainingRows = [];
const certRows = [];
const personCourses = new Map();
let tid = 1, cid = 1;
const courseSkillIndex = courses.map((c) => ({ c, skills: c.skills.map((s) => s.split(':')[0]) }));
for (const p of persons) {
  const wanted = new Set([...(p.role.tscs || []), ...(p.target?.tscs || [])].map((s) => s.split(':')[0]));
  const relevant = courseSkillIndex.filter((x) => x.skills.some((s) => wanted.has(s))).map((x) => x.c);
  const n = Math.min(relevant.length, p.age > 38 ? int(1, 4) : int(0, 3));
  const chosen = pickN(relevant, n);
  personCourses.set(p.id, chosen);
  for (const c of chosen) {
    const y = int(2020, 2026);
    const started = iso(y, int(1, 9), int(1, 28));
    const done = chance(0.82);
    trainingRows.push([tid, p.id, ids.course[c.code], done ? 'completed' : chance(0.6) ? 'in-progress' : 'enrolled',
      started, done ? iso(y, int(10, 12), int(1, 28)) : null, done ? pick(['Pass', 'Pass with Merit', 'Competent']) : null,
      done ? pick(['SFC-OPEN', 'SFC-MID', 'BASE-SUB', 'MCES']) : null]);
    if (done) {
      certRows.push([cid++, p.id, c.title, c.provider, ids.course[c.code],
        `SG-${c.code}-${String(10000 + p.id * 7 + tid).slice(-5)}`,
        iso(y, int(10, 12), int(1, 28)), null, 'training-provider', TODAY]);
    }
    tid++;
  }
  if (chance(0.25)) {
    certRows.push([cid++, p.id, pick(['Certified Information Systems Security Professional', 'PMP Project Management Professional',
      'Certified ScrumMaster', 'ISO 9001 Lead Auditor', 'GRI Sustainability Professional', 'Six Sigma Black Belt']),
      pick(['International certification body', 'Professional institute']), null,
      `EXT-${String(100000 + p.id * 13).slice(-6)}`, iso(int(2019, 2025), int(1, 12), int(1, 28)),
      iso(int(2027, 2030), int(1, 12), int(1, 28)), 'self', null]);
  }
}
insert('training_records', ['id', 'person_id', 'course_id', 'status', 'started_on', 'completed_on', 'result', 'funded_by'], trainingRows);
insert('certifications', ['id', 'person_id', 'name', 'issuer', 'course_id', 'credential_id', 'issued_on', 'expires_on', 'source', 'verified_at'], certRows);

// --- skill claims -------------------------------------------------------------
// A claim's status reflects the strength of its evidence, exactly as the real
// passport distinguishes verified records from self-declared ones.
const claimRows = [];
const evidenceRows = [];
let scid = 1, evid = 1;
for (const p of persons) {
  const history = personCourses.get(p.id) || [];
  const courseSkills = new Map();
  for (const c of history) for (const s of c.skills) {
    const [code, lvl] = s.split(':');
    courseSkills.set(code, Math.max(courseSkills.get(code) ?? 0, Number(lvl)));
  }
  const yearsInRole = Math.max(1, p.age - 22);
  const claims = new Map();
  for (const spec of p.role.tscs) {
    const [code, lvl] = spec.split(':');
    const required = Number(lvl);
    // experience usually gets you to the required level, sometimes one short
    const attained = Math.max(1, required - (chance(0.24) ? 1 : 0));
    claims.set(code, { type: 'tsc', level: attained, viaWork: true });
  }
  for (const [code, lvl] of courseSkills) {
    if (!tscByCode.has(code)) continue;
    const cur = claims.get(code);
    claims.set(code, { type: 'tsc', level: Math.max(cur?.level ?? 0, lvl), viaWork: cur?.viaWork ?? false, viaCourse: true });
  }
  // a few adjacent skills picked up on the job but never certified
  for (const t of pickN(allTscs.filter((t) => !claims.has(t.code) && (t.sector === p.role.sector || !t.sector)), int(2, 6))) {
    claims.set(t.code, { type: 'tsc', level: Math.max(t.minLevel, Math.min(t.maxLevel, int(1, 3))), self: true });
  }
  for (const [code, c] of claims) {
    const t = tscByCode.get(code);
    if (!t) continue;
    const level = Math.max(t.minLevel, Math.min(t.maxLevel, c.level));
    const status = c.viaCourse ? 'verified' : c.viaWork ? 'evidenced' : 'self-declared';
    const source = c.viaCourse ? 'Training provider record' : c.viaWork ? 'CPF employment history' : 'Self-declared';
    claimRows.push([scid, p.id, 'tsc', ids.tsc[code], level, c.viaCourse ? level : null, status, source, TODAY]);
    if (c.viaWork) evidenceRows.push([evid++, scid, 'employment', ids.role[p.role.code], `Applied in role: ${p.role.title}`, TODAY]);
    if (c.viaCourse) evidenceRows.push([evid++, scid, 'course', null, 'Completed an approved course delivering this skill', TODAY]);
    scid++;
  }
  // Critical Core Skills: emphasised ones sit a band higher
  const base = { Support: 1, Associate: 1, Professional: 2, Manager: 2, Leader: 3 }[p.role.band];
  for (const c of ccs) {
    const emphasised = p.role.ccs.includes(c.code);
    let band = Math.min(3, base + (emphasised ? 1 : 0));
    if (!emphasised && chance(0.3)) band = Math.max(1, band - 1);
    const status = emphasised ? 'evidenced' : 'self-declared';
    claimRows.push([scid, p.id, 'ccs', ids.ccs[c.code], band, null, status,
      emphasised ? 'CPF employment history' : 'Self-declared', TODAY]);
    if (emphasised) evidenceRows.push([evid++, scid, 'employment', ids.role[p.role.code], `Core to role: ${p.role.title}`, TODAY]);
    scid++;
  }
  void yearsInRole;
}
insert('skill_claims', ['id', 'person_id', 'skill_type', 'skill_id', 'claimed_level', 'assessed_level', 'status', 'source', 'updated_at'], claimRows);
insert('skill_evidence', ['id', 'claim_id', 'kind', 'ref_id', 'note', 'recorded_at'], evidenceRows);

// --- credits and allowances ----------------------------------------------------
const creditRows = [];
const txRows = [];
let caid = 1, txid = 1;
for (const p of persons) {
  if (p.residency !== 'citizen') continue;
  const accounts = [];
  if (p.age >= 25) accounts.push({ scheme: 'SFC-OPEN', granted: 500, on: `${Math.max(2016, 2026 - (p.age - 25))}-01-01` });
  if (p.age >= 40) accounts.push({ scheme: 'SFC-MID', granted: 4000, on: '2024-05-01' });
  for (const a of accounts) {
    const spent = [];
    for (const c of (personCourses.get(p.id) || [])) {
      if (!chance(0.5)) continue;
      const fee = c.fee;
      const subsidy = Math.round(fee * (p.age >= 40 ? 0.9 : 0.7));
      const payable = fee - subsidy;
      const claim = Math.min(payable, a.scheme === 'SFC-MID' ? 4000 : 500);
      if (claim > 0) spent.push({ course: c, claim });
    }
    let balance = a.granted;
    creditRows.push([caid, p.id, a.scheme, a.granted, 0, a.on, null]);
    txRows.push([txid++, caid, null, 'grant', a.granted, 'settled', a.on, 'Scheme disbursement']);
    for (const s of spent) {
      const amt = Math.min(balance, s.claim);
      if (amt <= 0) break;
      balance -= amt;
      txRows.push([txid++, caid, ids.course[s.course.code], 'claim', -amt, 'settled',
        iso(int(2021, 2026), int(1, 12), int(1, 28)), `Course fee offset: ${s.course.title}`]);
    }
    creditRows[creditRows.length - 1][4] = balance;
    caid++;
  }
}
insert('credit_accounts', ['id', 'person_id', 'scheme', 'granted', 'balance', 'granted_on', 'expires_on'], creditRows);
insert('credit_transactions', ['id', 'account_id', 'course_id', 'kind', 'amount', 'status', 'occurred_at', 'note'], txRows);

// --- share links ----------------------------------------------------------------
const shareRows = [];
const accessRows = [];
let shid = 1, alid = 1;
for (const p of persons) {
  if (!chance(0.45)) continue;
  const token = `shr_${p.id.toString(36)}${Math.floor(rnd() * 1e10).toString(36)}`;
  const scope = {
    skills: true,
    employment: chance(0.85),
    qualifications: chance(0.9),
    certifications: true,
    insights: chance(0.4),
  };
  shareRows.push([shid, p.id, token, pick(['Job application', 'Recruiter link', 'Internal mobility', 'Career coach']),
    JSON.stringify(scope), `2026-0${int(1, 8)}-${String(int(10, 28))}`,
    chance(0.7) ? `2026-1${int(0, 2)}-01` : null, chance(0.12) ? TODAY : null]);
  for (let i = 0; i < int(0, 5); i++) {
    accessRows.push([alid++, shid, pick(employers).name, `2026-0${int(4, 8)}-${String(int(10, 28))}T${String(int(9, 18)).padStart(2, '0')}:${String(int(0, 59)).padStart(2, '0')}:00Z`]);
  }
  shid++;
}
insert('share_links', ['id', 'person_id', 'token', 'label', 'scope', 'created_at', 'expires_at', 'revoked_at'], shareRows);
insert('share_access_log', ['id', 'share_id', 'viewer', 'accessed_at'], accessRows);

// --- job postings and applications -------------------------------------------
const postingRows = [];
const postingSkillRows = [];
const appRows = [];
let jpid = 1, appid = 1;
const openRoles = pickN(allRoles, 96);
for (const role of openRoles) {
  const emp = pick(employers.filter((e) => e.sector === role.sector)) ?? pick(employers);
  const spread = 1 + rnd() * 0.25;
  postingRows.push([jpid, `JP-2026-${String(1000 + jpid)}`, emp.id, role.title, ids.role[role.code], ids.sector[role.sector],
    Math.round(role.payP25 * spread / 100) * 100, Math.round(role.payP75 * spread / 100) * 100,
    pick(['full-time', 'full-time', 'full-time', 'contract', 'part-time']),
    pick(['Central', 'East', 'West', 'North', 'North-East', 'Hybrid']),
    `2026-0${int(5, 8)}-${String(int(1, 28)).padStart(2, '0')}`,
    `2026-${pick(['09', '10', '11'])}-${String(int(1, 28)).padStart(2, '0')}`,
    chance(0.86) ? 'open' : chance(0.5) ? 'filled' : 'closed',
    `${emp.name} is hiring a ${role.title}. Skills-first shortlisting: candidates are assessed against the framework requirements below, not job titles alone.`]);
  for (const spec of role.tscs) {
    const [code, lvl] = spec.split(':');
    if (!ids.tsc[code]) continue;
    postingSkillRows.push([jpid, 'tsc', ids.tsc[code], Number(lvl), chance(0.55) ? 1 : 0]);
  }
  for (const c of role.ccs) {
    postingSkillRows.push([jpid, 'ccs', ids.ccs[c],
      Math.min(3, ({ Support: 1, Associate: 1, Professional: 2, Manager: 2, Leader: 3 })[role.band] + 1), 0]);
  }
  jpid++;
}
insert('job_postings', ['id', 'ref', 'employer_id', 'title', 'role_id', 'sector_id', 'pay_min', 'pay_max', 'arrangement', 'location', 'posted_on', 'closes_on', 'status', 'summary'], postingRows);
insert('posting_skills', ['posting_id', 'skill_type', 'skill_id', 'required_level', 'must_have'], postingSkillRows);

// applications, scored on how much of the posting's skill demand the person meets
const claimIndex = new Map();
for (const r of claimRows) {
  const key = `${r[1]}|${r[2]}|${r[3]}`;
  claimIndex.set(key, r[4]);
}
for (const p of persons) {
  const candidates = postingRows.filter((row) => row[12] === 'open');
  for (const row of pickN(candidates, int(0, 4))) {
    const pidx = row[0];
    const reqs = postingSkillRows.filter((s) => s[0] === pidx);
    if (!reqs.length) continue;
    let met = 0;
    for (const r of reqs) {
      const have = claimIndex.get(`${p.id}|${r[1]}|${r[2]}`) ?? 0;
      if (have >= r[3]) met++;
    }
    const score = Math.round((met / reqs.length) * 100);
    const status = score >= 85 ? pick(['shortlisted', 'interview', 'offer'])
      : score >= 65 ? pick(['applied', 'shortlisted', 'applied'])
      : pick(['applied', 'rejected', 'applied']);
    appRows.push([appid++, pidx, p.id, score, status, `2026-0${int(6, 8)}-${String(int(1, 28)).padStart(2, '0')}`]);
  }
}
insert('applications', ['id', 'posting_id', 'person_id', 'match_score', 'status', 'applied_at'], appRows);

// --- registry change log and audit -------------------------------------------
const changes = [
  ['sector', 'CST', 'Skills Framework for Carbon Services and Trading published', 'New sector framework covering carbon measurement, project development and trading.', '2024-05-01', '1.0'],
  ['sector', 'CST', 'Revision 1.1: nature-based solutions and climate risk skills added', 'Employer consultation identified two capability gaps in the original framework.', '2025-11-01', '1.1'],
  ['tsc', 'ICT-009', 'New TSC: Applied AI and Generative Systems', 'Added across the Infocomm Technology framework following demand signals from industry.', '2025-06-01', '4.2'],
  ['tsc', 'X-SWP-003', 'New cross-sector TSC: Artificial Intelligence Application', 'Recognised as cross-sector after appearing in 18 sector frameworks.', '2025-06-01', '4.2'],
  ['ccs', 'CCS-DIG', 'Digital Fluency descriptors revised at Intermediate and Advanced', 'Aligned with the expectation that most roles now automate part of their own work.', '2025-01-15', '2.3'],
  ['role', 'HRE-R07', 'New role: Job Redesign Consultant', 'Added to the Human Resource framework to support skills-first job redesign.', '2025-04-01', '3.1'],
  ['sector', 'HLT', 'Revision: community and home care skills expanded', 'Care model shift towards ageing-in-place.', '2025-03-01', '5.0'],
  ['funding', 'SFTA-PT', 'Mid-Career Training Allowance extended to selected part-time training', 'Allows mid-career workers to train without leaving employment.', '2026-03-01', '1.0'],
  ['agency', 'SWDA', 'Registry stewardship transferred to the Skills and Workforce Development Agency', 'SkillsFuture Singapore and Workforce Singapore merged into SWDA on 1 July 2026.', '2026-07-01', '1.0'],
];
insert('registry_changes', ['id', 'entity', 'entity_code', 'change', 'rationale', 'effective_on', 'version'],
  changes.map((c, i) => [i + 1, ...c]));

const auditRows = [];
let auid = 1;
for (const p of pickN(persons, 40)) {
  auditRows.push([auid++, 'person', String(p.id), pick(['passport.viewed', 'skill.claimed', 'share.created', 'course.applied', 'credit.claimed']),
    'passport', String(p.id), null, `2026-0${int(6, 8)}-${String(int(1, 28)).padStart(2, '0')}T${String(int(8, 20)).padStart(2, '0')}:${String(int(0, 59)).padStart(2, '0')}:00Z`]);
}
for (const e of pickN(employers, 20)) {
  auditRows.push([auid++, 'employer', String(e.id), pick(['passport.share.opened', 'posting.published', 'application.shortlisted']),
    'employer', String(e.id), null, `2026-0${int(6, 8)}-${String(int(1, 28)).padStart(2, '0')}T${String(int(8, 20)).padStart(2, '0')}:${String(int(0, 59)).padStart(2, '0')}:00Z`]);
}
for (const c of changes) {
  auditRows.push([auid++, 'authority', 'SWDA', 'registry.changed', c[0], c[1], JSON.stringify({ version: c[5] }), `${c[4]}T09:00:00Z`]);
}
insert('audit_events', ['id', 'actor_type', 'actor_id', 'action', 'entity', 'entity_id', 'meta', 'created_at'], auditRows);

fs.writeFileSync(F('db/seed_people.sql'), out.join('\n\n') + '\n');
console.log('passport and hiring data written');
console.log('  persons', persons.length, '| employment', employmentRows.length, '| qualifications', qualRows.length);
console.log('  training', trainingRows.length, '| certifications', certRows.length);
console.log('  skill claims', claimRows.length, '| evidence', evidenceRows.length);
console.log('  credit accounts', creditRows.length, '| transactions', txRows.length);
console.log('  share links', shareRows.length, '| accesses', accessRows.length);
console.log('  employers', employers.length, '| postings', postingRows.length, '| posting skills', postingSkillRows.length, '| applications', appRows.length);
