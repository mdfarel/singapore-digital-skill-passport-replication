import { Hono } from 'hono';
import type { Env } from '../lib/types';
import { all, one } from '../lib/db';

export const labour = new Hono<{ Bindings: Env }>();

labour.get('/series', async (c) =>
  c.json(await all(c.env.DB, `SELECT * FROM lm_series ORDER BY code`)));

labour.get('/series/:code', async (c) => {
  const code = c.req.param('code').toUpperCase();
  const series = await one(c.env.DB, `SELECT * FROM lm_series WHERE code = ?`, code);
  if (!series) return c.json({ error: 'series not found' }, 404);
  const { dim1, dim2, from } = c.req.query();
  const where = ['series_id = ?'];
  const args: unknown[] = [(series as any).id];
  if (dim1) { where.push('dim1 = ?'); args.push(dim1); }
  if (dim2) { where.push('dim2 = ?'); args.push(dim2); }
  if (from) { where.push('period >= ?'); args.push(from); }
  const observations = await all(c.env.DB,
    `SELECT period, dim1, dim2, dim3, value FROM lm_observations WHERE ${where.join(' AND ')} ORDER BY period, dim1, dim2`, ...args);
  const dims = await all(c.env.DB,
    `SELECT DISTINCT dim1 FROM lm_observations WHERE series_id = ? AND dim1 IS NOT NULL ORDER BY dim1`, (series as any).id);
  return c.json({ series, observations, dim1Values: dims.map((d: any) => d.dim1) });
});

// Headline indicators for the national dashboard, each with its own source row.
labour.get('/headline', async (c) => {
  const codes = ['LFPR_SEX', 'EMPRATE_2564', 'JV_RATE', 'JV_TOTAL', 'LTU_RATE', 'RECRUIT_RATE', 'RESIGN_RATE'];
  const out: Record<string, unknown> = {};
  for (const code of codes) {
    const s: any = await one(c.env.DB, `SELECT * FROM lm_series WHERE code = ?`, code);
    if (!s) continue;
    const rows = await all(c.env.DB, `
      SELECT period, dim1, value FROM lm_observations
      WHERE series_id = ? ORDER BY period DESC LIMIT 12`, s.id);
    out[code] = { series: s, latest: rows };
  }
  return c.json(out);
});

// Everything the platform knows about one sector's labour market, keyed on the
// Ministry of Manpower industry label recorded against that sector.
labour.get('/sector/:code', async (c) => {
  const code = c.req.param('code').toUpperCase();
  const sector: any = await one(c.env.DB, `SELECT * FROM sectors WHERE code = ?`, code);
  if (!sector) return c.json({ error: 'sector not found' }, 404);
  const industry = sector.mom_industry;
  const wanted = ['JV_INDUSTRY', 'JV_RATE_INDUSTRY', 'RETRENCH_INDUSTRY', 'RETRENCH_INC_INDUSTRY'];
  const series: Record<string, unknown> = {};
  for (const code2 of wanted) {
    const s: any = await one(c.env.DB, `SELECT * FROM lm_series WHERE code = ?`, code2);
    if (!s) continue;
    const rows = await all(c.env.DB, `
      SELECT period, value FROM lm_observations
      WHERE series_id = ? AND LOWER(dim1) = LOWER(?) ORDER BY period`, s.id, industry);
    series[code2] = { meta: s, rows };
  }
  return c.json({ sector, industry, series });
});

labour.get('/industries', async (c) => {
  const s: any = await one(c.env.DB, `SELECT id FROM lm_series WHERE code = 'JV_INDUSTRY'`);
  const rows = await all(c.env.DB, `
    SELECT dim1 AS industry, MAX(period) AS latest_period,
           COUNT(*) AS observations
    FROM lm_observations WHERE series_id = ? GROUP BY dim1 ORDER BY dim1`, s.id);
  return c.json(rows);
});
