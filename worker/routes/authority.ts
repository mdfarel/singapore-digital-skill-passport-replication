import { Hono } from 'hono';
import type { Env } from '../lib/types';
import { all, one } from '../lib/db';

export const authority = new Hono<{ Bindings: Env }>();

// The registry stewardship view: how much framework there is, how current it is,
// and where the national skills picture sits.
authority.get('/overview', async (c) => {
  const counts: any = await one(c.env.DB, `
    SELECT
      (SELECT COUNT(*) FROM sectors) AS sectors,
      (SELECT COUNT(*) FROM job_roles) AS roles,
      (SELECT COUNT(*) FROM tscs) AS tscs,
      (SELECT COUNT(*) FROM tsc_levels) AS tsc_levels,
      (SELECT COUNT(*) FROM ccs) AS ccs,
      (SELECT COUNT(*) FROM courses) AS courses,
      (SELECT COUNT(*) FROM persons) AS persons,
      (SELECT COUNT(*) FROM skill_claims) AS claims,
      (SELECT COUNT(*) FROM skill_claims WHERE status='verified') AS verified_claims,
      (SELECT COUNT(*) FROM employment_records WHERE source='cpf') AS cpf_records,
      (SELECT COUNT(*) FROM qualifications WHERE source='moe') AS moe_records,
      (SELECT COUNT(*) FROM job_postings WHERE status='open') AS open_postings,
      (SELECT COUNT(*) FROM employers) AS employers,
      (SELECT COUNT(*) FROM lm_observations) AS lm_observations,
      (SELECT COUNT(*) FROM lm_series) AS lm_series,
      (SELECT SUM(balance) FROM credit_accounts) AS credit_balance,
      (SELECT SUM(-amount) FROM credit_transactions WHERE kind='claim') AS credit_claimed
  `);
  const byCluster = await all(c.env.DB, `
    SELECT cl.name AS cluster, COUNT(DISTINCT s.id) AS sectors, COUNT(r.id) AS roles
    FROM clusters cl JOIN sectors s ON s.cluster = cl.code
    LEFT JOIN job_roles r ON r.sector_id = s.id GROUP BY cl.code ORDER BY roles DESC`);
  const freshness = await all(c.env.DB, `
    SELECT code, name, revised_on, outlook,
           CAST((julianday('2026-08-30') - julianday(revised_on)) / 30.44 AS INTEGER) AS months_since_revision
    FROM sectors ORDER BY revised_on ASC LIMIT 12`);
  const changes = await all(c.env.DB, `SELECT * FROM registry_changes ORDER BY effective_on DESC LIMIT 10`);
  return c.json({ counts, byCluster, freshness, changes });
});

// Where declared supply meets employer demand, skill by skill. This is the
// analysis a labour authority actually needs the passport data for.
authority.get('/supply-demand', async (c) => {
  const rows = await all(c.env.DB, `
    SELECT t.code, t.title, cat.name AS category, s.name AS sector_name,
           (SELECT COUNT(*) FROM posting_skills ps WHERE ps.skill_type='tsc' AND ps.skill_id = t.id) AS demand,
           (SELECT COUNT(*) FROM skill_claims sc WHERE sc.skill_type='tsc' AND sc.skill_id = t.id) AS supply,
           (SELECT COUNT(*) FROM skill_claims sc WHERE sc.skill_type='tsc' AND sc.skill_id = t.id AND sc.status='verified') AS verified_supply,
           (SELECT COUNT(*) FROM course_skills cs WHERE cs.skill_type='tsc' AND cs.skill_id = t.id) AS courses
    FROM tscs t JOIN tsc_categories cat ON cat.id = t.category_id
    LEFT JOIN sectors s ON s.id = t.sector_id
    ORDER BY demand DESC, supply ASC LIMIT 60`);
  const tightest = rows
    .filter((r: any) => r.demand > 0)
    .map((r: any) => ({ ...r, ratio: r.supply / r.demand }))
    .sort((a: any, b: any) => a.ratio - b.ratio)
    .slice(0, 15);
  const noProvision = await all(c.env.DB, `
    SELECT t.code, t.title, s.name AS sector_name,
           (SELECT COUNT(*) FROM role_tsc rt WHERE rt.tsc_id = t.id) AS roles
    FROM tscs t LEFT JOIN sectors s ON s.id = t.sector_id
    WHERE NOT EXISTS (SELECT 1 FROM course_skills cs WHERE cs.skill_type='tsc' AND cs.skill_id = t.id)
      AND EXISTS (SELECT 1 FROM role_tsc rt WHERE rt.tsc_id = t.id)
    ORDER BY roles DESC LIMIT 20`);
  return c.json({ rows, tightest, noProvision });
});

// Verification posture: the proportion of each record type carrying a
// government-verified source rather than a self-declaration.
authority.get('/verification', async (c) => {
  const claims = await all(c.env.DB, `
    SELECT status, COUNT(*) AS n FROM skill_claims GROUP BY status ORDER BY n DESC`);
  const employment = await all(c.env.DB, `SELECT source, COUNT(*) AS n FROM employment_records GROUP BY source`);
  const quals = await all(c.env.DB, `SELECT source, COUNT(*) AS n FROM qualifications GROUP BY source`);
  const certs = await all(c.env.DB, `SELECT source, COUNT(*) AS n FROM certifications GROUP BY source`);
  const bySector = await all(c.env.DB, `
    SELECT s.name AS sector, COUNT(*) AS claims,
           SUM(CASE WHEN sc.status='verified' THEN 1 ELSE 0 END) AS verified
    FROM skill_claims sc JOIN tscs t ON t.id = sc.skill_id AND sc.skill_type='tsc'
    JOIN sectors s ON s.id = t.sector_id GROUP BY s.id ORDER BY claims DESC LIMIT 15`);
  return c.json({ claims, employment, quals, certs, bySector });
});

authority.get('/funding', async (c) => {
  const accounts = await all(c.env.DB, `
    SELECT fs.code, fs.name, fs.kind, COUNT(ca.id) AS holders,
           SUM(ca.granted) AS granted, SUM(ca.balance) AS balance
    FROM funding_schemes fs LEFT JOIN credit_accounts ca ON ca.scheme = fs.code
    GROUP BY fs.code ORDER BY granted DESC`);
  const topCourses = await all(c.env.DB, `
    SELECT c.code, c.title, c.provider, COUNT(t.id) AS claims, SUM(-t.amount) AS value
    FROM credit_transactions t JOIN courses c ON c.id = t.course_id
    WHERE t.kind = 'claim' GROUP BY c.id ORDER BY value DESC LIMIT 12`);
  const byYear = await all(c.env.DB, `
    SELECT substr(occurred_at,1,4) AS year, SUM(-amount) AS value, COUNT(*) AS claims
    FROM credit_transactions WHERE kind='claim' GROUP BY year ORDER BY year`);
  return c.json({ accounts, topCourses, byYear });
});

authority.get('/audit', async (c) =>
  c.json(await all(c.env.DB, `SELECT * FROM audit_events ORDER BY created_at DESC LIMIT 120`)));

// Sector health blends registry coverage with real Ministry of Manpower series.
authority.get('/sector-health', async (c) => {
  const rows = await all(c.env.DB, `
    SELECT s.code, s.name, s.cluster, s.outlook, s.mom_industry, s.revised_on,
           (SELECT COUNT(*) FROM job_roles r WHERE r.sector_id = s.id) AS roles,
           (SELECT COUNT(*) FROM tscs t WHERE t.sector_id = s.id) AS tscs,
           (SELECT COUNT(*) FROM job_postings jp WHERE jp.sector_id = s.id AND jp.status='open') AS open_postings,
           (SELECT AVG(r.demand_index) FROM job_roles r WHERE r.sector_id = s.id) AS avg_demand
    FROM sectors s ORDER BY s.name`);
  const jvSeries: any = await one(c.env.DB, `SELECT id FROM lm_series WHERE code='JV_RATE_INDUSTRY'`);
  const latest = await all(c.env.DB, `
    SELECT dim1 AS industry, value, period FROM lm_observations
    WHERE series_id = ? AND period = (SELECT MAX(period) FROM lm_observations WHERE series_id = ?)`,
    jvSeries.id, jvSeries.id);
  const map = new Map(latest.map((r: any) => [String(r.industry).toLowerCase(), r]));
  return c.json(rows.map((r: any) => {
    const hit: any = map.get(String(r.mom_industry || '').toLowerCase());
    return { ...r, vacancy_rate: hit?.value ?? null, vacancy_period: hit?.period ?? null };
  }));
});
