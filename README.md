# Digital Skills Passport

A reference implementation of a national digital skills passport, modelled on Singapore's
Careers and Skills Passport.

> Not affiliated with, endorsed by, or operated by the Government of Singapore. Section
> [Data and provenance](#data-and-provenance) states which parts are government open data
> and which are generated for this implementation.

## The system being modelled

The Careers and Skills Passport is a personal digital career and training record hosted on
the MySkillsFuture portal and accessed with Singpass. It is available to Singapore Citizens
and Permanent Residents at no cost.

It holds five sections:

| Section | Contents | Source |
|---|---|---|
| Skills | Technical skills and critical core skills | Training records, plus holder entries |
| Employment | Job history | Contribution-backed employment records |
| Qualifications | Academic awards | Ministry of Education institution records |
| Certifications | Professional certificates | Approved training providers |
| Insights | Career paths, skill gaps, course recommendations | Computed |

The organising principle is provenance. Entries drawn from government systems carry a
verification mark. Entries the holder adds, such as freelance work, non-contributory
employment, self-taught skills and overseas certifications, are retained and shown without
one. The record is private by default and disclosed through links the holder scopes.

Underneath sits the Skills Frameworks: 38 sector frameworks mapping job roles to Technical
Skills and Competencies on a six-level proficiency scale, and to the 16 Critical Core Skills
in three clusters at basic, intermediate and advanced.

Stewardship sits with the Skills and Workforce Development Agency, formed on 1 July 2026 from
the merger of SkillsFuture Singapore and Workforce Singapore, overseen jointly by the Ministry
of Manpower and the Ministry of Education.

## What this implementation contains

Four interfaces over one registry:

1. Passport. An individual record populated from verified sources, with attainment measured
   against a target role and the training that meets the shortfall.
2. Framework registry. Sector frameworks, roles, technical skills and proficiency scales.
3. Vacancies. Postings expressed as required skills at stated proficiency, with candidates
   ranked on skills held rather than job title.
4. Administration. Framework revision status, skill supply against demand, verification rate,
   funding drawdown and an audit log.

Registry composition:

| Entity | Count |
|---|---|
| Sector frameworks | 37 |
| Job roles | 220 |
| Technical skills | 317 |
| Proficiency descriptors | 1,433 |
| Critical core skills | 16, at 3 bands, 48 descriptors |
| Role skill requirements | 642 technical, 3,520 core |
| Modelled role transitions | approximately 1,040 |
| Courses | 154 |
| Funding schemes | 6 |
| Ministry of Manpower observations | 13,186 across 27 series |
| Passport holders, generated | 72 |
| Employers, postings, applications | 46, 96, approximately 130 |

## Running

Requires Node 20 or later.

```bash
npm install
```

Build the seed data and load a local database:

```bash
npm run seed:build && npm run db:local
```

Build the frontend and start the worker:

```bash
npm start
```

The application is served at http://localhost:8787 and the API under `/api`.

For frontend hot reload, run `npx wrangler dev` in one terminal and `npm run dev` in another.
Vite proxies `/api` to port 8787.

### Deployment

The implementation is a single Cloudflare Worker with a D1 database and static assets.

```bash
npx wrangler d1 create skill-passport
```

Record the returned `database_id` in `wrangler.jsonc`, then:

```bash
npm run db:remote && npm run deploy
```

## Structure

```
data/framework/      Registry source: sectors, technical skills, core skills, roles, courses
data/mom/            Ministry of Manpower open data, retrieved as JSON
scripts/             Seed builders for the registry, labour market, passports and hiring
db/migrations/       Schema, 34 tables
db/*.sql             Generated seed files
worker/              Hono API on Cloudflare Workers and D1
src/                 React frontend: Vite, Tailwind, inline SVG charts
```

Seeding is deterministic. The same inputs always produce the same database.

### Three implementation notes

Provenance is a column, not a presentation detail. `skill_claims.status` takes one of
`verified`, `evidenced`, `self-declared` or `assessed`. `POST /api/passport/:id/skills`
forces `self-declared` irrespective of the value the client supplies, so a holder can record
a skill but cannot assert that an external source verified it.

Role transitions are computed rather than curated. For each ordered pair of roles the seed
builder scores technical transfer at 70 percent weight, with partial credit where a skill is
held one level below the requirement, and critical core skill transfer at 30 percent weight.
Transitions that drop a band, or that span two bands, are excluded.

Sectors are joined to observed labour market data. Each sector records the Ministry of
Manpower industry label it corresponds to, so a sector page reports that industry's own
vacancy, vacancy rate and retrenchment history.

### API

```
GET  /api/meta                          platform metadata and provenance
GET  /api/registry/sectors[/:code]      sector frameworks
GET  /api/registry/roles[/:code]        roles, requirements, transitions
GET  /api/registry/tscs[/:code]         technical skills and proficiency scales
GET  /api/registry/ccs                  critical core skills at all bands
GET  /api/registry/courses[/:code]      course catalogue and funding
GET  /api/labour/series[/:code]         Ministry of Manpower series
GET  /api/labour/sector/:code           a sector's labour market history
GET  /api/passport/:id                  full passport
GET  /api/passport/:id/gap?target=CODE  attainment, shortfall and matching courses
GET  /api/passport/:id/pathways         roles ranked by requirements met
POST /api/passport/:id/skills           record a self-declared claim
POST /api/passport/:id/share            issue a scoped disclosure link
GET  /api/share/:token                  recipient view, granted sections only
GET  /api/jobs[/:ref][/matches]         postings and candidate ranking
GET  /api/authority/*                   registry, supply and demand, verification, funding, audit
```

## Data and provenance

| Dataset | Source | Status |
|---|---|---|
| Labour market series | Ministry of Manpower via data.gov.sg | Government open data, 13,186 observations, loaded without alteration |
| Skills framework structure | Published SkillsFuture Skills Frameworks | Modelled on the published structure |
| Skills, roles, proficiency descriptors | Written for this implementation | Not the official framework text |
| Course catalogue | Generated | Not the official course registry |
| Holders, employers, postings | Generated | No real individual or company represented |
| Pay ranges, demand index | Modelled | Planning figures, not wage statistics |

Values suppressed at source, recorded as `na`, `-` or `s`, are dropped rather than imputed.
Each series row links back to its dataset on data.gov.sg. The `/about` page lists all 27.

Course provider names are real Continuing Education and Training institutions, used to show
how the registry links a course to a provider. The course listings themselves are generated
and are labelled as such wherever they appear.

## Demonstration sign-in

There is no Singpass integration. The application signs in as holder 1, and the passport
header carries a selector to switch between all 72 holders. Sessions are a signed cookie. Set
`SESSION_SECRET` before deploying.

Six holders are constructed as mid-career transitions:

| Holder | Current role | Target role |
|---|---|---|
| Nurul Aisyah binte Rahman | Registered Nurse | Health Informatics Analyst |
| Wei Ming Tan | CNC Machinist | Automation Systems Engineer |
| Priya Nair | Compliance Officer | Financial Crime Analyst |
| Marcus de Souza | Store Manager | E-Commerce Manager |
| Jia Hui Lim | Software Engineer | Machine Learning Engineer |
| Ahmad Hafiz bin Ismail | Site Supervisor | BIM Coordinator |

## Interface

The interface uses a five-step type scale, a single red accent, and a validated chart palette.
Categorical series follow a fixed hue order checked for colour-vision separation and surface
contrast in both light and dark modes. Proficiency scales use a single-hue ordinal ramp with a
separate marker for the required level, so a shortfall is never encoded by colour alone.

## Licence

No licence granted. Built as a reference implementation.
