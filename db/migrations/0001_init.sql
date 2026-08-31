-- Digital Skills Passport: reference schema (SQLite / Cloudflare D1)
-- Four domains: national skills registry, labour-market intelligence,
-- individual passport records, and the employer / skills-first hiring side.

PRAGMA foreign_keys = ON;

-- ===========================================================================
-- 1. NATIONAL SKILLS REGISTRY  (authority-managed reference data)
-- ===========================================================================

CREATE TABLE clusters (
  code        TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  blurb       TEXT
);

CREATE TABLE sectors (
  id          INTEGER PRIMARY KEY,
  code        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  cluster     TEXT NOT NULL REFERENCES clusters(code),
  description TEXT,
  lead_agency TEXT,
  outlook     TEXT CHECK (outlook IN ('emerging','growing','stable','transforming')),
  mom_industry TEXT,                    -- links to labour-market series
  published_on TEXT,
  revised_on   TEXT
);

CREATE TABLE tsc_categories (
  id     INTEGER PRIMARY KEY,
  name   TEXT NOT NULL UNIQUE,
  accents TEXT                          -- JSON array, one accent clause per level
);

CREATE TABLE tscs (
  id          INTEGER PRIMARY KEY,
  code        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  description TEXT,
  category_id INTEGER NOT NULL REFERENCES tsc_categories(id),
  sector_id   INTEGER REFERENCES sectors(id),   -- NULL = cross-sector
  min_level   INTEGER NOT NULL,
  max_level   INTEGER NOT NULL
);
CREATE INDEX idx_tscs_sector ON tscs(sector_id);
CREATE INDEX idx_tscs_category ON tscs(category_id);

CREATE TABLE tsc_levels (
  id         INTEGER PRIMARY KEY,
  tsc_id     INTEGER NOT NULL REFERENCES tscs(id) ON DELETE CASCADE,
  level      INTEGER NOT NULL,
  level_name TEXT NOT NULL,
  descriptor TEXT NOT NULL,
  autonomy   TEXT,
  complexity TEXT,
  UNIQUE (tsc_id, level)
);

CREATE TABLE ccs_clusters (
  code  TEXT PRIMARY KEY,
  name  TEXT NOT NULL,
  blurb TEXT
);

CREATE TABLE ccs (
  id          INTEGER PRIMARY KEY,
  code        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  description TEXT,
  cluster     TEXT NOT NULL REFERENCES ccs_clusters(code)
);

CREATE TABLE ccs_levels (
  id         INTEGER PRIMARY KEY,
  ccs_id     INTEGER NOT NULL REFERENCES ccs(id) ON DELETE CASCADE,
  band       INTEGER NOT NULL,          -- 1 Basic, 2 Intermediate, 3 Advanced
  band_name  TEXT NOT NULL,
  descriptor TEXT NOT NULL,
  behaviours TEXT,                      -- JSON array
  UNIQUE (ccs_id, band)
);

CREATE TABLE job_roles (
  id          INTEGER PRIMARY KEY,
  code        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  sector_id   INTEGER NOT NULL REFERENCES sectors(id),
  track       TEXT,
  band        TEXT CHECK (band IN ('Support','Associate','Professional','Manager','Leader')),
  ssoc        TEXT,
  pay_p25     INTEGER,
  pay_median  INTEGER,
  pay_p75     INTEGER,
  demand_index INTEGER,                 -- 0-100, platform-modelled
  description TEXT
);
CREATE INDEX idx_roles_sector ON job_roles(sector_id);
CREATE INDEX idx_roles_band ON job_roles(band);

CREATE TABLE role_tsc (
  role_id        INTEGER NOT NULL REFERENCES job_roles(id) ON DELETE CASCADE,
  tsc_id         INTEGER NOT NULL REFERENCES tscs(id) ON DELETE CASCADE,
  required_level INTEGER NOT NULL,
  criticality    TEXT CHECK (criticality IN ('core','important','useful')),
  PRIMARY KEY (role_id, tsc_id)
);

CREATE TABLE role_ccs (
  role_id       INTEGER NOT NULL REFERENCES job_roles(id) ON DELETE CASCADE,
  ccs_id        INTEGER NOT NULL REFERENCES ccs(id) ON DELETE CASCADE,
  required_band INTEGER NOT NULL,
  emphasis      INTEGER NOT NULL DEFAULT 0,   -- 1 = especially critical for this role
  PRIMARY KEY (role_id, ccs_id)
);

CREATE TABLE role_pathways (
  from_role_id INTEGER NOT NULL REFERENCES job_roles(id) ON DELETE CASCADE,
  to_role_id   INTEGER NOT NULL REFERENCES job_roles(id) ON DELETE CASCADE,
  kind         TEXT CHECK (kind IN ('vertical','lateral','cross-sector')),
  overlap_pct  INTEGER NOT NULL,
  gap_count    INTEGER NOT NULL,
  PRIMARY KEY (from_role_id, to_role_id)
);

CREATE TABLE courses (
  id         INTEGER PRIMARY KEY,
  code       TEXT NOT NULL UNIQUE,
  title      TEXT NOT NULL,
  provider   TEXT NOT NULL,
  mode       TEXT,
  hours      INTEGER,
  qual_level TEXT,
  full_fee   INTEGER,
  outcome    INTEGER,                   -- % in employment / advanced 6 months after
  provenance TEXT NOT NULL DEFAULT 'synthetic'
);

CREATE TABLE course_skills (
  course_id  INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  skill_type TEXT NOT NULL CHECK (skill_type IN ('tsc','ccs')),
  skill_id   INTEGER NOT NULL,
  level      INTEGER NOT NULL,
  PRIMARY KEY (course_id, skill_type, skill_id)
);

CREATE TABLE funding_schemes (
  code        TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('credit','subsidy','allowance')),
  amount      INTEGER,
  rate        REAL,
  eligibility TEXT,
  note        TEXT
);

-- ===========================================================================
-- 2. LABOUR MARKET INTELLIGENCE  (Ministry of Manpower open data)
-- ===========================================================================

CREATE TABLE lm_series (
  id          INTEGER PRIMARY KEY,
  code        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  agency      TEXT NOT NULL,
  dataset_id  TEXT NOT NULL,
  unit        TEXT,
  frequency   TEXT,
  dim1_label  TEXT,
  dim2_label  TEXT,
  source_url  TEXT,
  rows        INTEGER
);

CREATE TABLE lm_observations (
  id        INTEGER PRIMARY KEY,
  series_id INTEGER NOT NULL REFERENCES lm_series(id) ON DELETE CASCADE,
  period    TEXT NOT NULL,
  dim1      TEXT,
  dim2      TEXT,
  dim3      TEXT,
  value     REAL
);
CREATE INDEX idx_lm_obs_series ON lm_observations(series_id, period);
CREATE INDEX idx_lm_obs_dim1 ON lm_observations(series_id, dim1);

-- ===========================================================================
-- 3. THE PASSPORT  (individual records)
-- ===========================================================================

CREATE TABLE persons (
  id            INTEGER PRIMARY KEY,
  ref           TEXT NOT NULL UNIQUE,   -- masked national identifier, e.g. ****567A
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  birth_year    INTEGER NOT NULL,
  residency     TEXT NOT NULL CHECK (residency IN ('citizen','pr')),
  headline      TEXT,
  current_role_id INTEGER REFERENCES job_roles(id),
  target_role_id  INTEGER REFERENCES job_roles(id),
  created_at    TEXT NOT NULL
);

CREATE TABLE employment_records (
  id           INTEGER PRIMARY KEY,
  person_id    INTEGER NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  employer     TEXT NOT NULL,
  uen          TEXT,
  job_title    TEXT NOT NULL,
  role_id      INTEGER REFERENCES job_roles(id),
  sector_id    INTEGER REFERENCES sectors(id),
  ssoc         TEXT,
  start_date   TEXT NOT NULL,
  end_date     TEXT,
  arrangement  TEXT CHECK (arrangement IN ('full-time','part-time','contract','freelance','traineeship')),
  source       TEXT NOT NULL CHECK (source IN ('cpf','employer','self')),
  verified_at  TEXT
);
CREATE INDEX idx_emp_person ON employment_records(person_id);

CREATE TABLE qualifications (
  id           INTEGER PRIMARY KEY,
  person_id    INTEGER NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  institution  TEXT NOT NULL,
  qualification TEXT NOT NULL,
  field        TEXT,
  level        TEXT,
  conferred_on TEXT,
  source       TEXT NOT NULL CHECK (source IN ('moe','institution','self')),
  verified_at  TEXT
);
CREATE INDEX idx_qual_person ON qualifications(person_id);

CREATE TABLE certifications (
  id           INTEGER PRIMARY KEY,
  person_id    INTEGER NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  issuer       TEXT NOT NULL,
  course_id    INTEGER REFERENCES courses(id),
  credential_id TEXT,
  issued_on    TEXT,
  expires_on   TEXT,
  source       TEXT NOT NULL CHECK (source IN ('training-provider','issuer','self')),
  verified_at  TEXT
);
CREATE INDEX idx_cert_person ON certifications(person_id);

CREATE TABLE skill_claims (
  id           INTEGER PRIMARY KEY,
  person_id    INTEGER NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  skill_type   TEXT NOT NULL CHECK (skill_type IN ('tsc','ccs')),
  skill_id     INTEGER NOT NULL,
  claimed_level INTEGER NOT NULL,
  assessed_level INTEGER,
  status       TEXT NOT NULL CHECK (status IN ('self-declared','evidenced','verified','assessed')),
  source       TEXT,
  updated_at   TEXT NOT NULL,
  UNIQUE (person_id, skill_type, skill_id)
);
CREATE INDEX idx_claims_person ON skill_claims(person_id);

CREATE TABLE skill_evidence (
  id        INTEGER PRIMARY KEY,
  claim_id  INTEGER NOT NULL REFERENCES skill_claims(id) ON DELETE CASCADE,
  kind      TEXT NOT NULL CHECK (kind IN ('course','employment','qualification','assessment','endorsement')),
  ref_id    INTEGER,
  note      TEXT,
  recorded_at TEXT NOT NULL
);

CREATE TABLE credit_accounts (
  id          INTEGER PRIMARY KEY,
  person_id   INTEGER NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  scheme      TEXT NOT NULL REFERENCES funding_schemes(code),
  granted     INTEGER NOT NULL,
  balance     INTEGER NOT NULL,
  granted_on  TEXT,
  expires_on  TEXT,
  UNIQUE (person_id, scheme)
);

CREATE TABLE credit_transactions (
  id          INTEGER PRIMARY KEY,
  account_id  INTEGER NOT NULL REFERENCES credit_accounts(id) ON DELETE CASCADE,
  course_id   INTEGER REFERENCES courses(id),
  kind        TEXT NOT NULL CHECK (kind IN ('grant','claim','reversal','expiry')),
  amount      INTEGER NOT NULL,
  status      TEXT NOT NULL CHECK (status IN ('pending','approved','rejected','settled')),
  occurred_at TEXT NOT NULL,
  note        TEXT
);
CREATE INDEX idx_credit_tx_account ON credit_transactions(account_id);

CREATE TABLE training_records (
  id          INTEGER PRIMARY KEY,
  person_id   INTEGER NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  course_id   INTEGER NOT NULL REFERENCES courses(id),
  status      TEXT NOT NULL CHECK (status IN ('enrolled','in-progress','completed','withdrawn')),
  started_on  TEXT,
  completed_on TEXT,
  result      TEXT,
  funded_by   TEXT
);
CREATE INDEX idx_training_person ON training_records(person_id);

CREATE TABLE share_links (
  id         INTEGER PRIMARY KEY,
  person_id  INTEGER NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  token      TEXT NOT NULL UNIQUE,
  label      TEXT,
  scope      TEXT NOT NULL,             -- JSON: which sections are visible
  created_at TEXT NOT NULL,
  expires_at TEXT,
  revoked_at TEXT
);

CREATE TABLE share_access_log (
  id         INTEGER PRIMARY KEY,
  share_id   INTEGER NOT NULL REFERENCES share_links(id) ON DELETE CASCADE,
  viewer     TEXT,
  accessed_at TEXT NOT NULL
);

CREATE TABLE audit_events (
  id          INTEGER PRIMARY KEY,
  actor_type  TEXT NOT NULL CHECK (actor_type IN ('person','employer','authority','system')),
  actor_id    TEXT,
  action      TEXT NOT NULL,
  entity      TEXT,
  entity_id   TEXT,
  meta        TEXT,
  created_at  TEXT NOT NULL
);
CREATE INDEX idx_audit_created ON audit_events(created_at);

-- ===========================================================================
-- 4. EMPLOYERS AND SKILLS-FIRST HIRING
-- ===========================================================================

CREATE TABLE employers (
  id         INTEGER PRIMARY KEY,
  uen        TEXT NOT NULL UNIQUE,
  name       TEXT NOT NULL,
  sector_id  INTEGER REFERENCES sectors(id),
  size_band  TEXT CHECK (size_band IN ('micro','small','medium','large')),
  skills_first_tier TEXT CHECK (skills_first_tier IN ('none','adopter','practitioner','leader')),
  contact_email TEXT
);

CREATE TABLE job_postings (
  id          INTEGER PRIMARY KEY,
  ref         TEXT NOT NULL UNIQUE,
  employer_id INTEGER NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  role_id     INTEGER REFERENCES job_roles(id),
  sector_id   INTEGER REFERENCES sectors(id),
  pay_min     INTEGER,
  pay_max     INTEGER,
  arrangement TEXT,
  location    TEXT,
  posted_on   TEXT NOT NULL,
  closes_on   TEXT,
  status      TEXT NOT NULL CHECK (status IN ('open','closed','filled')),
  summary     TEXT
);
CREATE INDEX idx_postings_sector ON job_postings(sector_id);
CREATE INDEX idx_postings_role ON job_postings(role_id);

CREATE TABLE posting_skills (
  posting_id   INTEGER NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  skill_type   TEXT NOT NULL CHECK (skill_type IN ('tsc','ccs')),
  skill_id     INTEGER NOT NULL,
  required_level INTEGER NOT NULL,
  must_have    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (posting_id, skill_type, skill_id)
);

CREATE TABLE applications (
  id          INTEGER PRIMARY KEY,
  posting_id  INTEGER NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  person_id   INTEGER NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  match_score INTEGER,
  status      TEXT NOT NULL CHECK (status IN ('applied','shortlisted','interview','offer','rejected','withdrawn')),
  applied_at  TEXT NOT NULL,
  UNIQUE (posting_id, person_id)
);

-- Registry change log: how the authority evidences framework stewardship.
CREATE TABLE registry_changes (
  id          INTEGER PRIMARY KEY,
  entity      TEXT NOT NULL,
  entity_code TEXT,
  change      TEXT NOT NULL,
  rationale   TEXT,
  effective_on TEXT NOT NULL,
  version     TEXT
);
