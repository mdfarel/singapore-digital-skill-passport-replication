import { Hono } from 'hono';
import type { Env } from '../lib/types';
import { all, one } from '../lib/db';

export const registry = new Hono<{ Bindings: Env }>();

registry.get('/sectors', async (c) => {
  const rows = await all(c.env.DB, `
    SELECT s.id, s.code, s.name, s.cluster, cl.name AS cluster_name, s.description,
           s.lead_agency, s.outlook, s.mom_industry, s.published_on, s.revised_on,
           (SELECT COUNT(*) FROM job_roles r WHERE r.sector_id = s.id) AS roles,
           (SELECT COUNT(*) FROM tscs t WHERE t.sector_id = s.id) AS tscs
    FROM sectors s JOIN clusters cl ON cl.code = s.cluster
    ORDER BY s.name`);
  return c.json(rows);
});

registry.get('/sectors/:code', async (c) => {
  const code = c.req.param('code').toUpperCase();
  const sector = await one(c.env.DB, `
    SELECT s.*, cl.name AS cluster_name, cl.blurb AS cluster_blurb
    FROM sectors s JOIN clusters cl ON cl.code = s.cluster WHERE s.code = ?`, code);
  if (!sector) return c.json({ error: 'sector not found' }, 404);
  const id = (sector as any).id;
  const [roles, tscs, postings] = await Promise.all([
    all(c.env.DB, `SELECT code, title, track, band, ssoc, pay_p25, pay_median, pay_p75, demand_index
                   FROM job_roles WHERE sector_id = ?
                   ORDER BY CASE band WHEN 'Support' THEN 1 WHEN 'Associate' THEN 2 WHEN 'Professional' THEN 3
                            WHEN 'Manager' THEN 4 ELSE 5 END, title`, id),
    all(c.env.DB, `SELECT t.code, t.title, t.description, t.min_level, t.max_level, cat.name AS category
                   FROM tscs t JOIN tsc_categories cat ON cat.id = t.category_id
                   WHERE t.sector_id = ? ORDER BY cat.name, t.title`, id),
    all(c.env.DB, `SELECT COUNT(*) AS open_postings FROM job_postings WHERE sector_id = ? AND status = 'open'`, id),
  ]);
  return c.json({ sector, roles, tscs, openPostings: (postings[0] as any)?.open_postings ?? 0 });
});

registry.get('/roles', async (c) => {
  const { sector, band, q, limit } = c.req.query();
  const where: string[] = [];
  const args: unknown[] = [];
  if (sector) { where.push('s.code = ?'); args.push(sector.toUpperCase()); }
  if (band) { where.push('r.band = ?'); args.push(band); }
  if (q) { where.push('(r.title LIKE ? OR r.track LIKE ?)'); args.push(`%${q}%`, `%${q}%`); }
  const sql = `SELECT r.code, r.title, r.track, r.band, r.ssoc, r.pay_p25, r.pay_median, r.pay_p75,
                      r.demand_index, s.code AS sector_code, s.name AS sector_name
               FROM job_roles r JOIN sectors s ON s.id = r.sector_id
               ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
               ORDER BY r.demand_index DESC, r.title
               LIMIT ?`;
  args.push(Number(limit) || 400);
  return c.json(await all(c.env.DB, sql, ...args));
});

registry.get('/roles/:code', async (c) => {
  const code = c.req.param('code').toUpperCase();
  const role = await one(c.env.DB, `
    SELECT r.*, s.code AS sector_code, s.name AS sector_name, s.mom_industry
    FROM job_roles r JOIN sectors s ON s.id = r.sector_id WHERE r.code = ?`, code);
  if (!role) return c.json({ error: 'role not found' }, 404);
  const id = (role as any).id;
  const [tscs, ccs, pathways, inbound, postings] = await Promise.all([
    all(c.env.DB, `SELECT t.code, t.title, t.description, rt.required_level, rt.criticality,
                          cat.name AS category, t.max_level,
                          (SELECT descriptor FROM tsc_levels l WHERE l.tsc_id = t.id AND l.level = rt.required_level) AS level_descriptor
                   FROM role_tsc rt JOIN tscs t ON t.id = rt.tsc_id
                   JOIN tsc_categories cat ON cat.id = t.category_id
                   WHERE rt.role_id = ?
                   ORDER BY CASE rt.criticality WHEN 'core' THEN 1 WHEN 'important' THEN 2 ELSE 3 END, rt.required_level DESC`, id),
    all(c.env.DB, `SELECT ccs.code, ccs.title, ccs.cluster, rc.required_band, rc.emphasis,
                          (SELECT descriptor FROM ccs_levels l WHERE l.ccs_id = ccs.id AND l.band = rc.required_band) AS band_descriptor
                   FROM role_ccs rc JOIN ccs ON ccs.id = rc.ccs_id
                   WHERE rc.role_id = ? ORDER BY rc.emphasis DESC, ccs.title`, id),
    all(c.env.DB, `SELECT r2.code, r2.title, r2.band, s2.code AS sector_code, s2.name AS sector_name,
                          p.kind, p.overlap_pct, p.gap_count, r2.pay_median, r2.demand_index
                   FROM role_pathways p JOIN job_roles r2 ON r2.id = p.to_role_id
                   JOIN sectors s2 ON s2.id = r2.sector_id
                   WHERE p.from_role_id = ? ORDER BY p.overlap_pct DESC`, id),
    all(c.env.DB, `SELECT r1.code, r1.title, r1.band, s1.name AS sector_name, p.overlap_pct
                   FROM role_pathways p JOIN job_roles r1 ON r1.id = p.from_role_id
                   JOIN sectors s1 ON s1.id = r1.sector_id
                   WHERE p.to_role_id = ? ORDER BY p.overlap_pct DESC LIMIT 8`, id),
    all(c.env.DB, `SELECT jp.ref, jp.title, e.name AS employer, jp.pay_min, jp.pay_max, jp.location, jp.posted_on
                   FROM job_postings jp JOIN employers e ON e.id = jp.employer_id
                   WHERE jp.role_id = ? AND jp.status = 'open' ORDER BY jp.posted_on DESC LIMIT 10`, id),
  ]);
  return c.json({ role, tscs, ccs, pathways, inbound, postings });
});

registry.get('/tscs', async (c) => {
  const { sector, category, q, limit } = c.req.query();
  const where: string[] = [];
  const args: unknown[] = [];
  if (sector === 'cross') where.push('t.sector_id IS NULL');
  else if (sector) { where.push('s.code = ?'); args.push(sector.toUpperCase()); }
  if (category) { where.push('cat.name = ?'); args.push(category); }
  if (q) { where.push('(t.title LIKE ? OR t.description LIKE ?)'); args.push(`%${q}%`, `%${q}%`); }
  const rows = await all(c.env.DB, `
    SELECT t.code, t.title, t.description, t.min_level, t.max_level,
           cat.name AS category, s.code AS sector_code, s.name AS sector_name,
           (SELECT COUNT(*) FROM role_tsc rt WHERE rt.tsc_id = t.id) AS role_count,
           (SELECT COUNT(*) FROM course_skills cs WHERE cs.skill_type='tsc' AND cs.skill_id = t.id) AS course_count
    FROM tscs t JOIN tsc_categories cat ON cat.id = t.category_id
    LEFT JOIN sectors s ON s.id = t.sector_id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY role_count DESC, t.title LIMIT ?`, ...args, Number(limit) || 400);
  return c.json(rows);
});

registry.get('/tscs/:code', async (c) => {
  const code = c.req.param('code').toUpperCase();
  const tsc = await one(c.env.DB, `
    SELECT t.*, cat.name AS category, s.code AS sector_code, s.name AS sector_name
    FROM tscs t JOIN tsc_categories cat ON cat.id = t.category_id
    LEFT JOIN sectors s ON s.id = t.sector_id WHERE t.code = ?`, code);
  if (!tsc) return c.json({ error: 'skill not found' }, 404);
  const id = (tsc as any).id;
  const [levels, roles, courses] = await Promise.all([
    all(c.env.DB, `SELECT level, level_name, descriptor, autonomy, complexity FROM tsc_levels WHERE tsc_id = ? ORDER BY level`, id),
    all(c.env.DB, `SELECT r.code, r.title, r.band, s.name AS sector_name, rt.required_level, rt.criticality
                   FROM role_tsc rt JOIN job_roles r ON r.id = rt.role_id JOIN sectors s ON s.id = r.sector_id
                   WHERE rt.tsc_id = ? ORDER BY rt.required_level DESC, r.title`, id),
    all(c.env.DB, `SELECT c.code, c.title, c.provider, c.mode, c.hours, c.qual_level, c.full_fee, c.outcome, cs.level
                   FROM course_skills cs JOIN courses c ON c.id = cs.course_id
                   WHERE cs.skill_type = 'tsc' AND cs.skill_id = ? ORDER BY c.outcome DESC`, id),
  ]);
  return c.json({ tsc, levels, roles, courses });
});

registry.get('/ccs', async (c) => {
  const [clusters, skills] = await Promise.all([
    all(c.env.DB, `SELECT * FROM ccs_clusters`),
    all(c.env.DB, `SELECT c.id, c.code, c.title, c.description, c.cluster,
                          (SELECT COUNT(*) FROM role_ccs rc WHERE rc.ccs_id = c.id AND rc.emphasis = 1) AS emphasis_roles
                   FROM ccs c ORDER BY c.cluster, c.title`),
  ]);
  const levels = await all(c.env.DB, `SELECT ccs_id, band, band_name, descriptor, behaviours FROM ccs_levels ORDER BY ccs_id, band`);
  return c.json({
    clusters,
    skills: skills.map((s: any) => ({
      ...s,
      levels: levels.filter((l: any) => l.ccs_id === s.id)
        .map((l: any) => ({ ...l, behaviours: JSON.parse(String(l.behaviours || '[]')) })),
    })),
  });
});

registry.get('/courses', async (c) => {
  const { q, provider, skill, limit } = c.req.query();
  const where: string[] = [];
  const args: unknown[] = [];
  if (q) { where.push('(c.title LIKE ? OR c.provider LIKE ?)'); args.push(`%${q}%`, `%${q}%`); }
  if (provider) { where.push('c.provider = ?'); args.push(provider); }
  if (skill) {
    where.push(`c.id IN (SELECT cs.course_id FROM course_skills cs
                LEFT JOIN tscs t ON t.id = cs.skill_id AND cs.skill_type='tsc'
                LEFT JOIN ccs cc ON cc.id = cs.skill_id AND cs.skill_type='ccs'
                WHERE t.code = ? OR cc.code = ?)`);
    args.push(skill.toUpperCase(), skill.toUpperCase());
  }
  const rows = await all(c.env.DB, `
    SELECT c.code, c.title, c.provider, c.mode, c.hours, c.qual_level, c.full_fee, c.outcome, c.provenance
    FROM courses c ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY c.outcome DESC, c.title LIMIT ?`, ...args, Number(limit) || 200);
  return c.json(rows);
});

registry.get('/courses/:code', async (c) => {
  const code = c.req.param('code').toUpperCase();
  const course = await one(c.env.DB, `SELECT * FROM courses WHERE code = ?`, code);
  if (!course) return c.json({ error: 'course not found' }, 404);
  const skills = await all(c.env.DB, `
    SELECT cs.skill_type, cs.level,
           COALESCE(t.code, cc.code) AS code, COALESCE(t.title, cc.title) AS title
    FROM course_skills cs
    LEFT JOIN tscs t ON cs.skill_type='tsc' AND t.id = cs.skill_id
    LEFT JOIN ccs cc ON cs.skill_type='ccs' AND cc.id = cs.skill_id
    WHERE cs.course_id = ?`, (course as any).id);
  const schemes = await all(c.env.DB, `SELECT * FROM funding_schemes ORDER BY kind, code`);
  return c.json({ course, skills, schemes });
});

registry.get('/funding', async (c) => c.json(await all(c.env.DB, `SELECT * FROM funding_schemes ORDER BY kind, code`)));

registry.get('/changes', async (c) =>
  c.json(await all(c.env.DB, `SELECT * FROM registry_changes ORDER BY effective_on DESC`)));
