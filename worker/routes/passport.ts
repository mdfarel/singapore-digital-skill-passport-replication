import { Hono } from 'hono';
import type { Env } from '../lib/types';
import { all, one } from '../lib/db';

export const passport = new Hono<{ Bindings: Env }>();

async function loadPassport(db: D1Database, personId: number) {
  const person: any = await one(db, `
    SELECT p.*, r.code AS current_role_code, r.title AS current_role_title, r.band AS current_role_band,
           s.code AS current_sector_code, s.name AS current_sector_name,
           tr.code AS target_role_code, tr.title AS target_role_title
    FROM persons p
    LEFT JOIN job_roles r ON r.id = p.current_role_id
    LEFT JOIN sectors s ON s.id = r.sector_id
    LEFT JOIN job_roles tr ON tr.id = p.target_role_id
    WHERE p.id = ?`, personId);
  if (!person) return null;

  const [employment, qualifications, certifications, tscClaims, ccsClaims, credits, training, shares] = await Promise.all([
    all(db, `SELECT e.*, s.name AS sector_name FROM employment_records e
             LEFT JOIN sectors s ON s.id = e.sector_id
             WHERE e.person_id = ? ORDER BY (e.end_date IS NULL) DESC, e.start_date DESC`, personId),
    all(db, `SELECT * FROM qualifications WHERE person_id = ? ORDER BY conferred_on DESC`, personId),
    all(db, `SELECT c.*, co.code AS course_code FROM certifications c
             LEFT JOIN courses co ON co.id = c.course_id
             WHERE c.person_id = ? ORDER BY issued_on DESC`, personId),
    all(db, `SELECT sc.id, sc.claimed_level, sc.assessed_level, sc.status, sc.source, sc.updated_at,
                    t.code, t.title, t.max_level, cat.name AS category, sec.code AS sector_code, sec.name AS sector_name
             FROM skill_claims sc JOIN tscs t ON t.id = sc.skill_id
             JOIN tsc_categories cat ON cat.id = t.category_id
             LEFT JOIN sectors sec ON sec.id = t.sector_id
             WHERE sc.person_id = ? AND sc.skill_type = 'tsc'
             ORDER BY sc.claimed_level DESC, t.title`, personId),
    all(db, `SELECT sc.id, sc.claimed_level AS band, sc.status, sc.source,
                    cc.code, cc.title, cc.cluster,
                    (SELECT descriptor FROM ccs_levels l WHERE l.ccs_id = cc.id AND l.band = sc.claimed_level) AS descriptor
             FROM skill_claims sc JOIN ccs cc ON cc.id = sc.skill_id
             WHERE sc.person_id = ? AND sc.skill_type = 'ccs' ORDER BY cc.cluster, cc.title`, personId),
    all(db, `SELECT ca.*, fs.name AS scheme_name, fs.note FROM credit_accounts ca
             JOIN funding_schemes fs ON fs.code = ca.scheme WHERE ca.person_id = ?`, personId),
    all(db, `SELECT t.*, c.code AS course_code, c.title AS course_title, c.provider, c.hours
             FROM training_records t JOIN courses c ON c.id = t.course_id
             WHERE t.person_id = ? ORDER BY t.started_on DESC`, personId),
    all(db, `SELECT s.id, s.token, s.label, s.scope, s.created_at, s.expires_at, s.revoked_at,
                    (SELECT COUNT(*) FROM share_access_log a WHERE a.share_id = s.id) AS views
             FROM share_links s WHERE s.person_id = ? ORDER BY s.created_at DESC`, personId),
  ]);

  const verified = tscClaims.filter((s: any) => s.status === 'verified').length;
  return {
    person, employment, qualifications, certifications,
    skills: { tsc: tscClaims, ccs: ccsClaims },
    credits, training,
    shares: shares.map((s: any) => ({ ...s, scope: JSON.parse(String(s.scope || '{}')) })),
    summary: {
      totalSkills: tscClaims.length + ccsClaims.length,
      verifiedSkills: verified,
      verifiedRecords: employment.filter((e: any) => e.source === 'cpf').length +
        qualifications.filter((q: any) => q.source === 'moe').length +
        certifications.filter((x: any) => x.source === 'training-provider').length,
      yearsOfExperience: employment.length
        ? Math.max(...employment.map((e: any) => 2026 - Number(String(e.start_date).slice(0, 4))))
        : 0,
    },
  };
}

passport.get('/people', async (c) => {
  const { q } = c.req.query();
  const rows = await all(c.env.DB, `
    SELECT p.id, p.ref, p.name, p.headline, p.residency, p.birth_year,
           r.title AS current_role, s.name AS sector_name
    FROM persons p LEFT JOIN job_roles r ON r.id = p.current_role_id
    LEFT JOIN sectors s ON s.id = r.sector_id
    ${q ? 'WHERE p.name LIKE ? OR r.title LIKE ?' : ''}
    ORDER BY p.id LIMIT 200`, ...(q ? [`%${q}%`, `%${q}%`] : []));
  return c.json(rows);
});

passport.get('/:id', async (c) => {
  const data = await loadPassport(c.env.DB, Number(c.req.param('id')));
  if (!data) return c.json({ error: 'passport not found' }, 404);
  return c.json(data);
});

// Gap analysis: what this person still needs for a target role, and which
// approved courses close each gap.
passport.get('/:id/gap', async (c) => {
  const personId = Number(c.req.param('id'));
  const targetCode = c.req.query('target');
  const person: any = await one(c.env.DB, `SELECT * FROM persons WHERE id = ?`, personId);
  if (!person) return c.json({ error: 'passport not found' }, 404);
  const role: any = targetCode
    ? await one(c.env.DB, `SELECT r.*, s.name AS sector_name, s.code AS sector_code FROM job_roles r JOIN sectors s ON s.id = r.sector_id WHERE r.code = ?`, targetCode.toUpperCase())
    : await one(c.env.DB, `SELECT r.*, s.name AS sector_name, s.code AS sector_code FROM job_roles r JOIN sectors s ON s.id = r.sector_id WHERE r.id = ?`, person.target_role_id ?? person.current_role_id);
  if (!role) return c.json({ error: 'target role not found' }, 404);

  const tscGap = await all(c.env.DB, `
    SELECT t.code, t.title, cat.name AS category, rt.required_level, rt.criticality,
           COALESCE(sc.claimed_level, 0) AS held_level, sc.status,
           (SELECT descriptor FROM tsc_levels l WHERE l.tsc_id = t.id AND l.level = rt.required_level) AS target_descriptor
    FROM role_tsc rt
    JOIN tscs t ON t.id = rt.tsc_id
    JOIN tsc_categories cat ON cat.id = t.category_id
    LEFT JOIN skill_claims sc ON sc.person_id = ? AND sc.skill_type = 'tsc' AND sc.skill_id = t.id
    WHERE rt.role_id = ?
    ORDER BY (rt.required_level - COALESCE(sc.claimed_level, 0)) DESC, rt.required_level DESC`, personId, role.id);

  const ccsGap = await all(c.env.DB, `
    SELECT cc.code, cc.title, cc.cluster, rc.required_band, rc.emphasis,
           COALESCE(sc.claimed_level, 0) AS held_band
    FROM role_ccs rc JOIN ccs cc ON cc.id = rc.ccs_id
    LEFT JOIN skill_claims sc ON sc.person_id = ? AND sc.skill_type = 'ccs' AND sc.skill_id = cc.id
    WHERE rc.role_id = ? AND rc.required_band > COALESCE(sc.claimed_level, 0)
    ORDER BY rc.emphasis DESC, (rc.required_band - COALESCE(sc.claimed_level, 0)) DESC`, personId, role.id);

  const gaps = tscGap.filter((g: any) => g.held_level < g.required_level);
  const met = tscGap.length - gaps.length;
  const readiness = tscGap.length ? Math.round((met / tscGap.length) * 100) : 100;

  // Courses that close the most gap for this person, ranked by gap coverage then outcome.
  let recommendations: any[] = [];
  if (gaps.length) {
    const codes = gaps.map((g: any) => g.code);
    const placeholders = codes.map(() => '?').join(',');
    const rows = await all(c.env.DB, `
      SELECT c.code, c.title, c.provider, c.mode, c.hours, c.qual_level, c.full_fee, c.outcome,
             GROUP_CONCAT(t.code) AS closes, COUNT(*) AS gap_hits
      FROM course_skills cs
      JOIN courses c ON c.id = cs.course_id
      JOIN tscs t ON t.id = cs.skill_id AND cs.skill_type = 'tsc'
      WHERE t.code IN (${placeholders})
      GROUP BY c.id ORDER BY gap_hits DESC, c.outcome DESC LIMIT 12`, ...codes);
    recommendations = rows.map((r: any) => ({ ...r, closes: String(r.closes || '').split(',') }));
  }

  return c.json({ person, role, readiness, tsc: tscGap, ccs: ccsGap, gaps, recommendations });
});

// Roles this person is closest to, computed from their own verified skills.
passport.get('/:id/pathways', async (c) => {
  const personId = Number(c.req.param('id'));
  const rows = await all(c.env.DB, `
    WITH held AS (
      SELECT skill_id, claimed_level FROM skill_claims WHERE person_id = ? AND skill_type = 'tsc'
    )
    SELECT r.code, r.title, r.band, r.pay_median, r.demand_index,
           s.code AS sector_code, s.name AS sector_name,
           COUNT(rt.tsc_id) AS required,
           SUM(CASE WHEN COALESCE(h.claimed_level,0) >= rt.required_level THEN 1 ELSE 0 END) AS met
    FROM job_roles r
    JOIN sectors s ON s.id = r.sector_id
    JOIN role_tsc rt ON rt.role_id = r.id
    LEFT JOIN held h ON h.skill_id = rt.tsc_id
    GROUP BY r.id
    HAVING required > 0
    ORDER BY (CAST(met AS REAL) / required) DESC, r.demand_index DESC
    LIMIT 24`, personId);
  return c.json(rows.map((r: any) => ({ ...r, readiness: Math.round((r.met / r.required) * 100) })));
});

passport.get('/:id/credits', async (c) => {
  const personId = Number(c.req.param('id'));
  const accounts = await all(c.env.DB, `
    SELECT ca.*, fs.name AS scheme_name, fs.kind, fs.note FROM credit_accounts ca
    JOIN funding_schemes fs ON fs.code = ca.scheme WHERE ca.person_id = ?`, personId);
  const tx = await all(c.env.DB, `
    SELECT t.*, c.title AS course_title, ca.scheme FROM credit_transactions t
    JOIN credit_accounts ca ON ca.id = t.account_id
    LEFT JOIN courses c ON c.id = t.course_id
    WHERE ca.person_id = ? ORDER BY t.occurred_at DESC`, personId);
  const schemes = await all(c.env.DB, `SELECT * FROM funding_schemes ORDER BY kind`);
  return c.json({ accounts, transactions: tx, schemes });
});

// Share links carry a scope; the shared view only ever returns what was granted.
passport.post('/:id/share', async (c) => {
  const personId = Number(c.req.param('id'));
  const body = await c.req.json<{ label?: string; scope?: Record<string, boolean>; days?: number }>().catch(() => ({} as any));
  const scope = body.scope ?? { skills: true, employment: true, qualifications: true, certifications: true, insights: false };
  const token = `shr_${crypto.randomUUID().replace(/-/g, '').slice(0, 18)}`;
  const now = new Date().toISOString().slice(0, 10);
  const expires = body.days
    ? new Date(Date.now() + body.days * 86400000).toISOString().slice(0, 10)
    : null;
  await c.env.DB.prepare(
    `INSERT INTO share_links (person_id, token, label, scope, created_at, expires_at) VALUES (?,?,?,?,?,?)`
  ).bind(personId, token, body.label ?? 'Shared passport', JSON.stringify(scope), now, expires).run();
  await c.env.DB.prepare(
    `INSERT INTO audit_events (actor_type, actor_id, action, entity, entity_id, meta, created_at) VALUES ('person',?,?,?,?,?,?)`
  ).bind(String(personId), 'share.created', 'share_link', token, JSON.stringify(scope), new Date().toISOString()).run();
  return c.json({ token, scope, expires_at: expires });
});

passport.post('/:id/share/:shareId/revoke', async (c) => {
  const shareId = Number(c.req.param('shareId'));
  await c.env.DB.prepare(`UPDATE share_links SET revoked_at = ? WHERE id = ? AND person_id = ?`)
    .bind(new Date().toISOString().slice(0, 10), shareId, Number(c.req.param('id'))).run();
  return c.json({ ok: true });
});

// Self-declared skill claim. Status is forced to 'self-declared': a person can add
// a skill, but only a verified source can mark it verified.
passport.post('/:id/skills', async (c) => {
  const personId = Number(c.req.param('id'));
  const body = await c.req.json<{ code: string; level: number }>().catch(() => null);
  if (!body?.code) return c.json({ error: 'code required' }, 400);
  const code = body.code.toUpperCase();
  const tsc: any = await one(c.env.DB, `SELECT id, min_level, max_level FROM tscs WHERE code = ?`, code);
  const ccsRow: any = tsc ? null : await one(c.env.DB, `SELECT id FROM ccs WHERE code = ?`, code);
  if (!tsc && !ccsRow) return c.json({ error: 'unknown skill' }, 404);
  const type = tsc ? 'tsc' : 'ccs';
  const max = tsc ? tsc.max_level : 3;
  const min = tsc ? tsc.min_level : 1;
  const level = Math.max(min, Math.min(max, Number(body.level) || min));
  const now = new Date().toISOString();
  await c.env.DB.prepare(`
    INSERT INTO skill_claims (person_id, skill_type, skill_id, claimed_level, status, source, updated_at)
    VALUES (?,?,?,?, 'self-declared', 'Self-declared', ?)
    ON CONFLICT(person_id, skill_type, skill_id)
    DO UPDATE SET claimed_level = excluded.claimed_level, updated_at = excluded.updated_at`)
    .bind(personId, type, tsc ? tsc.id : ccsRow.id, level, now).run();
  await c.env.DB.prepare(
    `INSERT INTO audit_events (actor_type, actor_id, action, entity, entity_id, meta, created_at) VALUES ('person',?,?,?,?,?,?)`
  ).bind(String(personId), 'skill.claimed', type, code, JSON.stringify({ level }), now).run();
  return c.json({ ok: true, code, level, status: 'self-declared' });
});

passport.post('/:id/target', async (c) => {
  const personId = Number(c.req.param('id'));
  const body = await c.req.json<{ role: string }>().catch(() => null);
  if (!body?.role) return c.json({ error: 'role required' }, 400);
  const role: any = await one(c.env.DB, `SELECT id FROM job_roles WHERE code = ?`, body.role.toUpperCase());
  if (!role) return c.json({ error: 'unknown role' }, 404);
  await c.env.DB.prepare(`UPDATE persons SET target_role_id = ? WHERE id = ?`).bind(role.id, personId).run();
  return c.json({ ok: true });
});

export { loadPassport };
