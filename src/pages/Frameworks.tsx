import { useEffect, useMemo, useState } from 'react';
import { get } from '../lib/api';
import { Link } from '../lib/router';
import { Trail, Panel, Heading, Table, Empty, Loading, Note, Source, Tag } from '../components/ui';
import { LineChart } from '../components/charts';
import { money, pct } from '../lib/format';

const OUTLOOK: Record<string, string> = { emerging: 'accent', growing: 'good', stable: 'neutral', transforming: 'attention' };

export function Frameworks() {
  const [sectors, setSectors] = useState<any[]>([]);
  const [health, setHealth] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [cluster, setCluster] = useState('all');

  useEffect(() => {
    get<any[]>('/registry/sectors').then(setSectors).catch(() => {});
    get<any[]>('/authority/sector-health').then(setHealth).catch(() => {});
  }, []);

  const healthBy = useMemo(() => new Map(health.map((h) => [h.code, h])), [health]);
  const clusters = useMemo(() => [...new Set(sectors.map((s) => s.cluster_name))].sort(), [sectors]);
  const shown = sectors.filter((s) =>
    (cluster === 'all' || s.cluster_name === cluster) &&
    (!q || s.name.toLowerCase().includes(q.toLowerCase()) || s.description.toLowerCase().includes(q.toLowerCase())));

  if (!sectors.length) return <Loading label="Loading frameworks" />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="t-lg font-semibold">Sector frameworks</h1>
        <p className="t-sm ink-2 mt-1.5 max-w-[74ch]">
          Each framework defines the job roles in a sector, the technical skills those roles require,
          and the proficiency required of each. Frameworks are versioned and carry a revision date.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sectors"
               aria-label="Search sectors" className="field flex-1 min-w-[200px]" />
        <select value={cluster} onChange={(e) => setCluster(e.target.value)} aria-label="Filter by cluster" className="field">
          <option value="all">All clusters</option>
          {clusters.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {shown.map((s) => {
          const h = healthBy.get(s.code);
          return (
            <Link key={s.code} to={`/frameworks/${s.code}`}
                  className="panel p-3 block hover:border-[color:var(--line-2)]">
              <div className="flex items-start justify-between gap-2">
                <span className="t-sm font-semibold">{s.name}</span>
                <Tag tone={OUTLOOK[s.outlook]}>{s.outlook}</Tag>
              </div>
              <div className="t-xs muted mt-0.5">{s.cluster_name}</div>
              <p className="t-xs ink-2 mt-1.5">{s.description}</p>
              <dl className="flex gap-4 mt-2.5 pt-2.5 border-t rule t-xs muted">
                <span><dd className="inline tabular font-medium" style={{ color: 'var(--ink)' }}>{s.roles}</dd> <dt className="inline">roles</dt></span>
                <span><dd className="inline tabular font-medium" style={{ color: 'var(--ink)' }}>{s.tscs}</dd> <dt className="inline">skills</dt></span>
                {h?.vacancy_rate != null && (
                  <span className="ml-auto"><dd className="inline tabular font-medium" style={{ color: 'var(--ink)' }}>{pct(h.vacancy_rate, 1)}</dd> <dt className="inline">vacancy</dt></span>
                )}
              </dl>
            </Link>
          );
        })}
      </div>
      {!shown.length && <Empty>No sectors match this query.</Empty>}
    </div>
  );
}

export function SectorDetail({ code }: { code: string }) {
  const [data, setData] = useState<any>(null);
  const [lm, setLm] = useState<any>(null);

  useEffect(() => {
    setData(null);
    get(`/registry/sectors/${code}`).then(setData).catch(() => setData({ error: true }));
    get(`/labour/sector/${code}`).then(setLm).catch(() => {});
  }, [code]);

  if (!data) return <Loading />;
  if (data.error) return <Empty>No framework at this code.</Empty>;
  const s = data.sector;

  const byCategory = new Map<string, any[]>();
  for (const t of data.tscs) {
    if (!byCategory.has(t.category)) byCategory.set(t.category, []);
    byCategory.get(t.category)!.push(t);
  }

  const jv = lm?.series?.JV_INDUSTRY?.rows ?? [];
  const rr = lm?.series?.RETRENCH_INDUSTRY?.rows ?? [];
  const jvr = lm?.series?.JV_RATE_INDUSTRY?.rows ?? [];
  const meta = lm?.series?.JV_INDUSTRY?.meta;
  const rmeta = lm?.series?.JV_RATE_INDUSTRY?.meta;
  const span = (rows: any[]) => (rows.length ? `${rows[0].period} to ${rows[rows.length - 1].period}` : undefined);

  return (
    <div className="space-y-4">
      <Trail items={[{ label: 'Frameworks', to: '/frameworks' }, { label: s.name }]} />

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-[66ch] min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="t-lg font-semibold">{s.name}</h1>
              <Tag tone={OUTLOOK[s.outlook]}>{s.outlook}</Tag>
              <Tag>{s.cluster_name}</Tag>
            </div>
            <p className="t-sm ink-2 mt-2">{s.description}</p>
            <dl className="flex flex-wrap gap-x-6 gap-y-1 mt-3 t-xs muted">
              <span><dt className="inline">Lead agency </dt><dd className="inline">{s.lead_agency}</dd></span>
              <span><dt className="inline">Published </dt><dd className="inline tabular">{s.published_on}</dd></span>
              <span><dt className="inline">Revised </dt><dd className="inline tabular">{s.revised_on}</dd></span>
              <span><dt className="inline">Code </dt><dd className="inline tabular">{s.code}</dd></span>
            </dl>
          </div>
          <dl className="grid grid-cols-3 gap-2 min-w-[220px]">
            <Mini label="Roles" value={data.roles.length} />
            <Mini label="Skills" value={data.tscs.length} />
            <Mini label="Vacancies" value={data.openPostings} />
          </dl>
        </div>
      </Panel>

      {lm && (jv.length > 0 || rr.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <Panel>
            <Heading note={`Counts of persons for the industry "${lm.industry}". Both series share one axis.`}>
              Vacancies and retrenchment
            </Heading>
            <LineChart
              series={[
                { name: 'Job vacancies', points: jv.map((r: any) => ({ x: r.period, y: r.value })) },
                { name: 'Retrenched employees', points: rr.map((r: any) => ({ x: r.period, y: r.value })) },
              ]}
              format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))} yZero height={196} />
            <Source agency={meta?.agency} dataset={meta?.dataset_id} url={meta?.source_url} coverage={span(jv)} />
          </Panel>
          <Panel>
            <Heading note="Vacancies as a percentage of total demand in the mapped industry">
              Job vacancy rate
            </Heading>
            <LineChart series={[{ name: 'Vacancy rate', points: jvr.map((r: any) => ({ x: r.period, y: r.value })) }]}
                       unit="%" format={(v) => v.toFixed(1)} height={196} />
            <Source agency={rmeta?.agency} dataset={rmeta?.dataset_id} url={rmeta?.source_url} coverage={span(jvr)} />
          </Panel>
        </div>
      )}

      <Panel>
        <Heading note="Ordered by band. Pay ranges and the demand index are modelled planning figures, not wage statistics.">
          Job roles
        </Heading>
        <Table
          columns={[{ key: 'title', label: 'Role' }, { key: 'track', label: 'Track' }, { key: 'band', label: 'Band' },
                    { key: 'ssoc', label: 'SSOC' }, { key: 'pay', label: 'Monthly gross, modelled', align: 'right' },
                    { key: 'demand', label: 'Demand index', align: 'right' }]}
          rows={data.roles.map((r: any) => ({
            title: <Link to={`/roles/${r.code}`} className="font-medium hover:underline">{r.title}</Link>,
            track: <span className="muted">{r.track}</span>,
            band: <Tag>{r.band}</Tag>,
            ssoc: <span className="tabular muted t-xs">{r.ssoc}</span>,
            pay: <span className="tabular">{money(r.pay_p25)} to {money(r.pay_p75)}</span>,
            demand: <span className="tabular">{r.demand_index}</span>,
          }))}
        />
      </Panel>

      <Panel>
        <Heading note={`${data.tscs.length} sector-specific technical skills, grouped by category. Ranges give the assessed proficiency levels.`}>
          Technical skills and competencies
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {[...byCategory.entries()].map(([cat, items]) => (
            <div key={cat}>
              <h3 className="t-xs font-semibold mb-1.5">{cat}</h3>
              <div className="space-y-1.5">
                {items.map((t) => (
                  <Link key={t.code} to={`/skills/${t.code}`} className="block">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="t-sm hover:underline truncate min-w-0">{t.title}</span>
                      <span className="t-xs muted tabular shrink-0">L{t.min_level} to L{t.max_level}</span>
                    </div>
                    <p className="t-xs muted">{t.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded p-2 text-center" style={{ background: 'var(--surface-2)' }}>
      <dd className="t-md font-semibold tabular">{value}</dd>
      <dt className="t-xs muted">{label}</dt>
    </div>
  );
}
