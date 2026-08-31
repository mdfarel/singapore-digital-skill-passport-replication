import { Hono } from 'hono';
import type { Env } from './lib/types';
import { all, one } from './lib/db';
import { sign, verify, cookie, readCookie } from './lib/session';
import { registry } from './routes/registry';
import { labour } from './routes/labour';
import { passport, loadPassport } from './routes/passport';
import { jobs } from './routes/jobs';
import { authority } from './routes/authority';

const app = new Hono<{ Bindings: Env }>();
const SECRET = (env: Env) => env.SESSION_SECRET || 'dev-secret-not-for-production';

const api = new Hono<{ Bindings: Env }>();

api.get('/meta', async (c) => {
  const counts: any = await one(c.env.DB, `
    SELECT (SELECT COUNT(*) FROM sectors) AS sectors,
           (SELECT COUNT(*) FROM job_roles) AS roles,
           (SELECT COUNT(*) FROM tscs) AS tscs,
           (SELECT COUNT(*) FROM ccs) AS ccs,
           (SELECT COUNT(*) FROM courses) AS courses,
           (SELECT COUNT(*) FROM persons) AS persons,
           (SELECT COUNT(*) FROM job_postings WHERE status='open') AS open_postings,
           (SELECT COUNT(*) FROM lm_observations) AS observations,
           (SELECT COUNT(*) FROM lm_series) AS series`);
  return c.json({
    platform: 'Digital Skills Passport, reference implementation',
    note: 'Independent reference build. Not affiliated with, endorsed by, or operated by the Government of Singapore.',
    modelledOn: 'The Careers & Skills Passport on MySkillsFuture, stewarded by the Skills and Workforce Development Agency (SWDA), which merged SkillsFuture Singapore and Workforce Singapore on 1 July 2026.',
    provenance: [
      { dataset: 'Labour market series', source: 'Ministry of Manpower via data.gov.sg', status: 'real open data' },
      { dataset: 'Skills framework structure', source: 'SkillsFuture Skills Frameworks (sector, TSC and CCS structure)', status: 'modelled on published structure' },
      { dataset: 'Course catalogue', source: 'generated for this platform', status: 'synthetic' },
      { dataset: 'Persons, employers, postings', source: 'generated for this platform', status: 'synthetic' },
    ],
    // Sources consulted for the framework structure. No text was copied from them;
    // the skills, roles and descriptors in this registry were written for it.
    references: [
      { title: 'SkillsFuture Skills Frameworks', publisher: 'SkillsFuture Singapore',
        url: 'https://www.skillsfuture.gov.sg/initiatives/training-providers/skills-framework',
        used: 'Sector framework structure and the six-level technical proficiency scale' },
      { title: 'Critical Core Skills, Jobs-Skills Portal', publisher: 'SWDA',
        url: 'https://jobsandskills.swda.gov.sg/frameworks/critical-core-skills',
        used: 'The sixteen critical core skills, their three clusters and three bands' },
      { title: 'Critical Core Skills overview', publisher: 'SkillsFuture Singapore',
        url: 'https://www.skillsfuture.gov.sg/docs/default-source/initiatives/critical-core-skills/ccs_overview.pdf',
        used: 'Cluster membership of each critical core skill' },
      { title: 'Critical Core Skills That Employers Want', publisher: 'MySkillsFuture',
        url: 'https://www.myskillsfuture.gov.sg/content/portal/en/career-resources/career-resources/education-career-personal-development/2022_Critical_Core_Skills.html',
        used: 'Skill definitions used to shape the band descriptors' },
      { title: 'SkillsFuture Level-Up Programme', publisher: 'MySkillsFuture',
        url: 'https://www.myskillsfuture.gov.sg/content/portal/en/career-resources/career-resources/education-career-personal-development/SkillsFuture_Level-Up_Programme.html',
        used: 'Credit amounts, subsidy rates and training allowance parameters' },
      { title: 'Enhancing support for mid-career individuals under the SFLP', publisher: 'Ministry of Education',
        url: 'https://www.moe.gov.sg/news/press-releases/20250306-infosheet-2-enhancing-support-for-mid-career-individuals-under-the-skillsfuture-level-up-programme',
        used: 'Training allowance rates, caps and the part-time extension' },
    ],
    retrieval: {
      catalogue: 'https://api-production.data.gov.sg/v2/public/api/datasets?page=N',
      records: 'https://data.gov.sg/api/action/datastore_search?resource_id={id}',
      note: '220 catalogue pages were scanned, identifying 114 Ministry of Manpower datasets, of which 24 were loaded. Both endpoints require a browser User-Agent and rate-limit at approximately one request per second.',
    },
    limitations: [
      'SkillsFuture states 38 sector frameworks. Only 37 names are recoverable from public listings, so the registry carries 37.',
      'The primary framework pages on jobsandskills.skillsfuture.gov.sg and jobsandskills.swda.gov.sg refuse automated requests, so structural facts were taken from search summaries and the secondary pages listed above.',
      'Values suppressed at source in the Ministry of Manpower data are dropped rather than imputed, so series lengths vary by breakdown.',
    ],
    counts,
  });
});

// Demonstration sign-in. The production analogue is Singpass.
api.post('/auth/login', async (c) => {
  const body = await c.req.json<{ personId?: number; email?: string }>().catch(() => ({} as { personId?: number; email?: string }));
  const person: any = body.personId
    ? await one(c.env.DB, `SELECT id, name FROM persons WHERE id = ?`, body.personId)
    : body.email
      ? await one(c.env.DB, `SELECT id, name FROM persons WHERE email = ?`, body.email)
      : null;
  if (!person) return c.json({ error: 'no such passport holder' }, 404);
  const token = await sign(`${person.id}:${Date.now()}`, SECRET(c.env));
  c.header('Set-Cookie', cookie('sp_session', token, 60 * 60 * 12));
  return c.json({ id: person.id, name: person.name });
});

api.post('/auth/logout', (c) => {
  c.header('Set-Cookie', cookie('sp_session', '', 0));
  return c.json({ ok: true });
});

api.get('/auth/me', async (c) => {
  const token = readCookie(c.req.header('cookie') ?? null, 'sp_session');
  if (!token) return c.json({ authenticated: false });
  const payload = await verify(token, SECRET(c.env));
  if (!payload) return c.json({ authenticated: false });
  const id = Number(payload.split(':')[0]);
  const person: any = await one(c.env.DB, `SELECT id, name, ref, headline FROM persons WHERE id = ?`, id);
  return c.json(person ? { authenticated: true, person } : { authenticated: false });
});

// Shared passport view. Returns only the sections the owner granted.
api.get('/share/:token', async (c) => {
  const token = c.req.param('token');
  const link: any = await one(c.env.DB, `SELECT * FROM share_links WHERE token = ?`, token);
  if (!link) return c.json({ error: 'link not found' }, 404);
  if (link.revoked_at) return c.json({ error: 'This link was revoked by its owner.' }, 410);
  if (link.expires_at && link.expires_at < new Date().toISOString().slice(0, 10)) {
    return c.json({ error: 'This link has expired.' }, 410);
  }
  const scope = JSON.parse(String(link.scope || '{}'));
  const data = await loadPassport(c.env.DB, link.person_id);
  if (!data) return c.json({ error: 'passport not found' }, 404);
  await c.env.DB.prepare(`INSERT INTO share_access_log (share_id, viewer, accessed_at) VALUES (?,?,?)`)
    .bind(link.id, c.req.header('user-agent')?.slice(0, 80) ?? 'unknown', new Date().toISOString()).run();

  const filtered: Record<string, unknown> = {
    person: {
      name: data.person.name, ref: data.person.ref, headline: data.person.headline,
      current_role_title: data.person.current_role_title, current_sector_name: data.person.current_sector_name,
    },
    scope, label: link.label, summary: data.summary,
  };
  if (scope.skills) filtered.skills = data.skills;
  if (scope.employment) filtered.employment = data.employment;
  if (scope.qualifications) filtered.qualifications = data.qualifications;
  if (scope.certifications) filtered.certifications = data.certifications;
  if (scope.insights) filtered.training = data.training;
  return c.json(filtered);
});

api.route('/registry', registry);
api.route('/labour', labour);
api.route('/passport', passport);
api.route('/jobs', jobs);
api.route('/authority', authority);

api.get('/search', async (c) => {
  const q = c.req.query('q');
  if (!q || q.length < 2) return c.json({ roles: [], skills: [], sectors: [], courses: [] });
  const like = `%${q}%`;
  const [roles, skills, sectors, courses] = await Promise.all([
    all(c.env.DB, `SELECT r.code, r.title, s.name AS sector_name FROM job_roles r JOIN sectors s ON s.id=r.sector_id WHERE r.title LIKE ? LIMIT 8`, like),
    all(c.env.DB, `SELECT code, title FROM tscs WHERE title LIKE ? LIMIT 8`, like),
    all(c.env.DB, `SELECT code, name FROM sectors WHERE name LIKE ? LIMIT 6`, like),
    all(c.env.DB, `SELECT code, title, provider FROM courses WHERE title LIKE ? LIMIT 8`, like),
  ]);
  return c.json({ roles, skills, sectors, courses });
});

app.route('/api', api);
app.all('/api/*', (c) => c.json({ error: 'not found' }, 404));
app.get('*', (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
