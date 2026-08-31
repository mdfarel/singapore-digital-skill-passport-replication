import { useEffect, useMemo, useState } from 'react';
import { get } from '../lib/api';
import { Link } from '../lib/router';
import { Trail, Panel, Heading, Table, Empty, Loading, Note, Tag } from '../components/ui';
import { Scale } from '../components/charts';
import { money } from '../lib/format';

export function SkillsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [sector, setSector] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => { get<any[]>('/registry/sectors').then(setSectors).catch(() => {}); }, []);
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (sector) params.set('sector', sector);
    if (category) params.set('category', category);
    params.set('limit', '400');
    const t = setTimeout(() => { get<any[]>(`/registry/tscs?${params}`).then(setRows).catch(() => {}); }, 150);
    return () => clearTimeout(t);
  }, [q, sector, category]);

  const categories = useMemo(() => [...new Set(rows.map((r) => r.category))].sort(), [rows]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="t-lg font-semibold">Technical skills</h1>
          <p className="t-sm ink-2 mt-1.5 max-w-[74ch]">
            Each skill carries a proficiency scale of up to six levels, with a descriptor stating the
            autonomy and complexity expected at every level. Cross-sector skills apply in all frameworks.
          </p>
        </div>
        <Link to="/skills/critical-core" className="btn">Critical core skills</Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search skills"
               aria-label="Search skills" className="field flex-1 min-w-[200px]" />
        <select value={sector} onChange={(e) => setSector(e.target.value)} aria-label="Filter by sector" className="field">
          <option value="">All sectors</option>
          <option value="cross">Cross-sector only</option>
          {sectors.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category" className="field">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <Panel>
        <Table
          columns={[{ key: 'title', label: 'Skill' }, { key: 'cat', label: 'Category' }, { key: 'sector', label: 'Sector' },
                    { key: 'levels', label: 'Scale', width: '110px' },
                    { key: 'roles', label: 'Roles', align: 'right' }, { key: 'courses', label: 'Courses', align: 'right' }]}
          rows={rows.map((r) => ({
            title: (
              <div>
                <Link to={`/skills/${r.code}`} className="font-medium hover:underline">{r.title}</Link>
                <div className="t-xs muted">{r.description}</div>
              </div>
            ),
            cat: <span className="muted t-xs">{r.category}</span>,
            sector: r.sector_code
              ? <Link to={`/frameworks/${r.sector_code}`} className="t-xs hover:underline">{r.sector_name}</Link>
              : <Tag tone="accent">cross-sector</Tag>,
            levels: <span className="tabular t-xs muted">L{r.min_level} to L{r.max_level}</span>,
            roles: <span className="tabular">{r.role_count}</span>,
            courses: <span className="tabular">{r.course_count}</span>,
          }))}
          empty="No skills match this query."
        />
        <Note>{rows.length} skills listed.</Note>
      </Panel>
    </div>
  );
}

export function SkillDetail({ code }: { code: string }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => { setData(null); get(`/registry/tscs/${code}`).then(setData).catch(() => setData({ error: true })); }, [code]);
  if (!data) return <Loading />;
  if (data.error) return <Empty>No skill at this code.</Empty>;
  const t = data.tsc;

  return (
    <div className="space-y-4">
      <Trail items={[
        { label: 'Skills', to: '/skills' },
        ...(t.sector_code ? [{ label: t.sector_name, to: `/frameworks/${t.sector_code}` }] : []),
        { label: t.title },
      ]} />

      <Panel>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="t-lg font-semibold">{t.title}</h1>
          {t.sector_code ? <Tag>{t.sector_name}</Tag> : <Tag tone="accent">cross-sector</Tag>}
          <Tag>{t.category}</Tag>
        </div>
        <p className="t-sm ink-2 mt-2 max-w-[74ch]">{t.description}</p>
        <p className="t-xs muted mt-2">
          Code <span className="tabular">{t.code}</span>. Assessed from level {t.min_level} to level {t.max_level}.
        </p>
      </Panel>

      <Panel>
        <Heading note="Autonomy and complexity expected at each level of the scale">Proficiency levels</Heading>
        <div>
          {data.levels.map((l: any, i: number) => (
            <div key={l.level} className={`grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)_190px] gap-x-4 gap-y-1 ${i ? 'pt-3 mt-3 border-t rule' : ''}`}>
              <div>
                <Scale level={l.level} max={t.max_level} size="sm" />
                <div className="t-sm font-semibold mt-1">{l.level_name}</div>
              </div>
              <p className="t-sm">{l.descriptor}</p>
              <dl className="t-xs muted space-y-1">
                <div><dt className="inline font-medium" style={{ color: 'var(--ink-2)' }}>Autonomy. </dt><dd className="inline">{l.autonomy}</dd></div>
                <div><dt className="inline font-medium" style={{ color: 'var(--ink-2)' }}>Complexity. </dt><dd className="inline">{l.complexity}</dd></div>
              </dl>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Panel>
          <Heading note={`${data.roles.length} roles state a requirement for this skill`}>Roles requiring it</Heading>
          <Table
            columns={[{ key: 'role', label: 'Role' }, { key: 'sector', label: 'Sector' },
                      { key: 'level', label: 'Required', align: 'right' }, { key: 'crit', label: '' }]}
            rows={data.roles.map((r: any) => ({
              role: <Link to={`/roles/${r.code}`} className="hover:underline">{r.title}</Link>,
              sector: <span className="muted t-xs">{r.sector_name}</span>,
              level: <span className="tabular">L{r.required_level}</span>,
              crit: <Tag tone={r.criticality === 'core' ? 'accent' : r.criticality === 'important' ? 'attention' : 'neutral'}>{r.criticality}</Tag>,
            }))}
            empty="No role currently requires this skill."
          />
        </Panel>

        <Panel>
          <Heading note="Courses in the catalogue that deliver this skill, and the level they deliver it to">
            Training provision
          </Heading>
          {data.courses.length ? (
            <div className="space-y-2">
              {data.courses.map((c: any) => (
                <div key={c.code} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/courses/${c.code}`} className="t-sm font-medium hover:underline">{c.title}</Link>
                    <div className="t-xs muted">{c.provider}, {c.hours} hours, {c.mode}, {money(c.full_fee)}</div>
                  </div>
                  <Tag tone="accent">to L{c.level}</Tag>
                </div>
              ))}
            </div>
          ) : (
            <p className="t-sm rounded p-3" style={{ background: 'var(--accent-wash)', color: 'var(--accent)' }}>
              No course in the catalogue delivers this skill. Skills in this state are reported as
              provision gaps in the administration view.
            </p>
          )}
        </Panel>
      </div>
    </div>
  );
}

const CLUSTER_COLOR: Record<string, string> = { TC: 'var(--s1)', IO: 'var(--s2)', SR: 'var(--s3)' };

export function CriticalCore() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { get('/registry/ccs').then(setData).catch(() => {}); }, []);
  if (!data) return <Loading />;

  return (
    <div className="space-y-5">
      <Trail items={[{ label: 'Skills', to: '/skills' }, { label: 'Critical core skills' }]} />
      <div>
        <h1 className="t-lg font-semibold">Critical core skills</h1>
        <p className="t-sm ink-2 mt-1.5 max-w-[78ch]">
          Sixteen transferable skills identified as critical across all sectors, grouped into three
          clusters and assessed at basic, intermediate and advanced. Every role in the registry carries
          all sixteen. A role's emphasised skills sit one band above its baseline.
        </p>
      </div>

      {data.clusters.map((cl: any) => (
        <section key={cl.code}>
          <div className="flex items-baseline gap-2 mb-2">
            <span style={{ width: 8, height: 8, borderRadius: 1, background: CLUSTER_COLOR[cl.code] }} />
            <h2 className="t-md font-semibold">{cl.name}</h2>
            <span className="t-xs muted">{cl.blurb}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.skills.filter((s: any) => s.cluster === cl.code).map((s: any) => (
              <Panel key={s.code}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="t-sm font-semibold">{s.title}</h3>
                    <p className="t-xs ink-2 mt-1">{s.description}</p>
                  </div>
                  <Tag title="Roles where this skill is emphasised">{s.emphasis_roles} roles</Tag>
                </div>
                <dl className="mt-3 space-y-2">
                  {s.levels.map((l: any) => (
                    <div key={l.band} className="grid grid-cols-[96px_minmax(0,1fr)] gap-3">
                      <dt>
                        <Scale level={l.band} max={3} size="sm" />
                        <span className="t-xs font-medium block mt-1">{l.band_name}</span>
                      </dt>
                      <dd>
                        <p className="t-xs">{l.descriptor}</p>
                        <ul className="t-xs muted mt-1">
                          {l.behaviours.map((b: string) => <li key={b}>{b}</li>)}
                        </ul>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Panel>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
