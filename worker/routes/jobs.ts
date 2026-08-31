import { Hono } from 'hono';
import type { Env } from '../lib/types';
import { all, one } from '../lib/db';

export const jobs = new Hono<{ Bindings: Env }>();

jobs.get('/', async (c) => {
  const { sector, q, status, limit } = c.req.query();
  const where: string[] = [];
  const args: unknown[] = [];
  where.push('jp.status = ?'); args.push(status || 'open');
  if (sector) { where.push('s.code = ?'); args.push(sector.toUpperCase()); }
  if (q) { where.push('(jp.title LIKE ? OR e.name LIKE ?)'); args.push(`%${q}%`, `%${q}%`); }
  const rows = await all(c.env.DB, `
    SELECT jp.ref, jp.title, jp.pay_min, jp.pay_max, jp.arrangement, jp.location,
           jp.posted_on, jp.closes_on, jp.status,
           e.name AS employer, e.skills_first_tier, e.size_band,
           s.code AS sector_code, s.name AS sector_name,
           r.code AS role_code, r.band,
           (SELECT COUNT(*) FROM posting_skills ps WHERE ps.posting_id = jp.id) AS skill_count,
           (SELECT COUNT(*) FROM applications a WHERE a.posting_id = jp.id) AS applicants
    FROM job_postings jp
    JOIN employers e ON e.id = jp.employer_id
    LEFT JOIN sectors s ON s.id = jp.sector_id
    LEFT JOIN job_roles r ON r.id = jp.role_id
    WHERE ${where.join(' AND ')}
    ORDER BY jp.posted_on DESC LIMIT ?`, ...args, Number(limit) || 120);
  return c.json(rows);
});

jobs.get('/:ref', async (c) => {
  const ref = c.req.param('ref');
  const posting: any = await one(c.env.DB, `
    SELECT jp.*, e.name AS employer, e.uen, e.size_band, e.skills_first_tier,
           s.code AS sector_code, s.name AS sector_name, r.code AS role_code, r.title AS role_title, r.band
    FROM job_postings jp JOIN employers e ON e.id = jp.employer_id
    LEFT JOIN sectors s ON s.id = jp.sector_id
    LEFT JOIN job_roles r ON r.id = jp.role_id
    WHERE jp.ref = ?`, ref);
  if (!posting) return c.json({ error: 'posting not found' }, 404);
  const skills = await all(c.env.DB, `
    SELECT ps.skill_type, ps.required_level, ps.must_have,
           COALESCE(t.code, cc.code) AS code, COALESCE(t.title, cc.title) AS title,
           cat.name AS category
    FROM posting_skills ps
    LEFT JOIN tscs t ON ps.skill_type='tsc' AND t.id = ps.skill_id
    LEFT JOIN tsc_categories cat ON cat.id = t.category_id
    LEFT JOIN ccs cc ON ps.skill_type='ccs' AND cc.id = ps.skill_id
    WHERE ps.posting_id = ?
    ORDER BY ps.must_have DESC, ps.required_level DESC`, posting.id);
  const applications = await all(c.env.DB, `
    SELECT a.match_score, a.status, a.applied_at, p.id AS person_id, p.name, p.ref,
           r.title AS current_role
    FROM applications a JOIN persons p ON p.id = a.person_id
    LEFT JOIN job_roles r ON r.id = p.current_role_id
    WHERE a.posting_id = ? ORDER BY a.match_score DESC`, posting.id);
  return c.json({ posting, skills, applications });
});

// Skills-first shortlisting: rank every passport holder against the posting's
// declared skill requirements, not against their job title.
jobs.get('/:ref/matches', async (c) => {
  const posting: any = await one(c.env.DB, `SELECT id FROM job_postings WHERE ref = ?`, c.req.param('ref'));
  if (!posting) return c.json({ error: 'posting not found' }, 404);
  const rows = await all(c.env.DB, `
    SELECT p.id, p.name, p.ref, r.title AS current_role, s.name AS sector_name,
           COUNT(ps.skill_id) AS required,
           SUM(CASE WHEN COALESCE(sc.claimed_level,0) >= ps.required_level THEN 1 ELSE 0 END) AS met,
           SUM(CASE WHEN ps.must_have = 1 AND COALESCE(sc.claimed_level,0) < ps.required_level THEN 1 ELSE 0 END) AS missing_must_have,
           SUM(CASE WHEN sc.status = 'verified' THEN 1 ELSE 0 END) AS verified_hits
    FROM posting_skills ps
    CROSS JOIN persons p
    LEFT JOIN job_roles r ON r.id = p.current_role_id
    LEFT JOIN sectors s ON s.id = r.sector_id
    LEFT JOIN skill_claims sc ON sc.person_id = p.id AND sc.skill_type = ps.skill_type AND sc.skill_id = ps.skill_id
    WHERE ps.posting_id = ?
    GROUP BY p.id
    ORDER BY (CAST(met AS REAL) / required) DESC, verified_hits DESC
    LIMIT 25`, posting.id);
  return c.json(rows.map((r: any) => ({ ...r, match: Math.round((r.met / r.required) * 100) })));
});

jobs.get('/employers/list', async (c) => {
  const rows = await all(c.env.DB, `
    SELECT e.id, e.uen, e.name, e.size_band, e.skills_first_tier, s.name AS sector_name, s.code AS sector_code,
           (SELECT COUNT(*) FROM job_postings jp WHERE jp.employer_id = e.id AND jp.status='open') AS open_roles
    FROM employers e LEFT JOIN sectors s ON s.id = e.sector_id ORDER BY open_roles DESC, e.name`);
  return c.json(rows);
});
