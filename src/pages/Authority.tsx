import { useEffect, useState } from 'react';
import { get } from '../lib/api';
import { Link } from '../lib/router';
import { Panel, Heading, Table, Empty, Loading, Note, Figure, Tabs, Tag, Source } from '../components/ui';
import { BarChart, LineChart, Composition } from '../components/charts';
import { money, num, pct } from '../lib/format';

const TABS = [
  { id: 'registry', label: 'Registry' },
  { id: 'supply', label: 'Supply and demand' },
  { id: 'verification', label: 'Verification' },
  { id: 'funding', label: 'Funding' },
  { id: 'market', label: 'Labour market' },
  { id: 'audit', label: 'Audit' },
];

export function Authority() {
  const [tab, setTab] = useState('registry');
  const active = TABS.some((t) => t.id === tab) ? tab : 'registry';
  return (
    <div className="space-y-4">
      <div>
        <h1 className="t-lg font-semibold">Administration</h1>
        <p className="t-sm ink-2 mt-1.5 max-w-[78ch]">
          Framework revision status, declared skill supply against employer demand, the proportion of
          the record backed by an external source, funding drawdown, and a log of every change.
        </p>
      </div>
      <Tabs tabs={TABS} active={active} onChange={setTab} />
      {active === 'registry' && <Registry />}
      {active === 'supply' && <SupplyDemand />}
      {active === 'verification' && <Verification />}
      {active === 'funding' && <Funding />}
      {active === 'market' && <Market />}
      {active === 'audit' && <Audit />}
    </div>
  );
}

function Registry() {
  const [d, setD] = useState<any>(null);
  useEffect(() => { get('/authority/overview').then(setD).catch(() => {}); }, []);
  if (!d) return <Loading />;
  const c = d.counts;

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Figure label="Sector frameworks" value={c.sectors} note={`${c.roles} roles mapped`} />
        <Figure label="Technical skills" value={c.tscs} note={`${num(c.tsc_levels)} proficiency descriptors`} />
        <Figure label="Passport holders" value={c.persons} note={`${num(c.claims)} skill claims`} />
        <Figure label="Claims with a provider record" value={((c.verified_claims / c.claims) * 100).toFixed(1)} unit="%"
                note={`${num(c.verified_claims)} of ${num(c.claims)}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Panel>
          <Heading note="Roles covered per industry cluster">Framework coverage</Heading>
          <BarChart rows={d.byCluster.map((r: any) => ({ label: r.cluster, value: r.roles, note: `${r.sectors} sectors` }))} />
        </Panel>
        <Panel>
          <Heading note="Months elapsed since the last published revision, longest first">Revision status</Heading>
          <Table
            columns={[{ key: 'sector', label: 'Sector' }, { key: 'revised', label: 'Revised' },
                      { key: 'age', label: 'Months', align: 'right' }, { key: 'outlook', label: 'Outlook' }]}
            rows={d.freshness.map((f: any) => ({
              sector: <Link to={`/frameworks/${f.code}`} className="hover:underline">{f.name}</Link>,
              revised: <span className="tabular">{f.revised_on}</span>,
              age: <span className="tabular" style={{ color: f.months_since_revision > 30 ? 'var(--accent)' : undefined }}>
                {f.months_since_revision}</span>,
              outlook: <Tag>{f.outlook}</Tag>,
            }))}
          />
        </Panel>
      </div>

      <Panel>
        <Heading note="Published changes to the registry with the stated rationale">Change log</Heading>
        <Table
          columns={[{ key: 'date', label: 'Effective' }, { key: 'entity', label: 'Entity' },
                    { key: 'change', label: 'Change' }, { key: 'why', label: 'Rationale' }, { key: 'v', label: 'Version' }]}
          rows={d.changes.map((ch: any) => ({
            date: <span className="tabular">{ch.effective_on}</span>,
            entity: <Tag>{ch.entity}{ch.entity_code ? ` ${ch.entity_code}` : ''}</Tag>,
            change: <span className="font-medium">{ch.change}</span>,
            why: <span className="muted t-xs">{ch.rationale}</span>,
            v: <span className="tabular muted">{ch.version}</span>,
          }))}
        />
      </Panel>
    </div>
  );
}

function SupplyDemand() {
  const [d, setD] = useState<any>(null);
  useEffect(() => { get('/authority/supply-demand').then(setD).catch(() => {}); }, []);
  if (!d) return <Loading />;

  return (
    <div className="space-y-4 mt-4">
      <Panel>
        <Heading note="Holders per posting is declared supply divided by stated demand. Values below one indicate more postings than holders.">
          Skills under supply pressure
        </Heading>
        <Table
          columns={[{ key: 'skill', label: 'Skill' }, { key: 'sector', label: 'Sector' },
                    { key: 'demand', label: 'Postings', align: 'right' },
                    { key: 'supply', label: 'Holders', align: 'right' },
                    { key: 'verified', label: 'With provider record', align: 'right' },
                    { key: 'ratio', label: 'Holders per posting', align: 'right' },
                    { key: 'courses', label: 'Courses', align: 'right' }]}
          rows={d.tightest.map((r: any) => ({
            skill: <Link to={`/skills/${r.code}`} className="font-medium hover:underline">{r.title}</Link>,
            sector: <span className="t-xs muted">{r.sector_name ?? 'Cross-sector'}</span>,
            demand: <span className="tabular">{r.demand}</span>,
            supply: <span className="tabular">{r.supply}</span>,
            verified: <span className="tabular muted">{r.verified_supply}</span>,
            ratio: <span className="tabular font-medium" style={{ color: r.ratio < 1 ? 'var(--accent)' : undefined }}>
              {r.ratio.toFixed(1)}</span>,
            courses: r.courses === 0 ? <Tag tone="accent">none</Tag> : <span className="tabular">{r.courses}</span>,
          }))}
        />
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Panel>
          <Heading note="Count of open postings stating each skill as a requirement">Demand concentration</Heading>
          <BarChart rows={d.rows.slice(0, 12).map((r: any) => ({
            label: r.title, value: r.demand, note: r.sector_name ?? 'Cross-sector',
          }))} />
        </Panel>
        <Panel>
          <Heading note="Skills required by at least one role for which no course in the catalogue provides training">
            Provision gaps
          </Heading>
          {d.noProvision.length ? (
            <>
              <div className="space-y-1">
                {d.noProvision.slice(0, 14).map((r: any) => (
                  <div key={r.code} className="flex items-center justify-between gap-3 t-sm">
                    <Link to={`/skills/${r.code}`} className="truncate min-w-0 hover:underline">{r.title}</Link>
                    <span className="t-xs muted truncate max-w-[132px]">{r.sector_name ?? 'Cross-sector'}</span>
                    <span className="tabular w-16 text-right">{r.roles} roles</span>
                  </div>
                ))}
              </div>
              <Note>{d.noProvision.length} skills have no matching course in the catalogue.</Note>
            </>
          ) : <Empty>All required skills have training provision.</Empty>}
        </Panel>
      </div>
    </div>
  );
}

function Verification() {
  const [d, setD] = useState<any>(null);
  useEffect(() => { get('/authority/verification').then(setD).catch(() => {}); }, []);
  if (!d) return <Loading />;

  const total = d.claims.reduce((n: number, r: any) => n + r.n, 0);
  const colour: Record<string, string> = {
    verified: 'var(--good)', evidenced: 'var(--s1)', assessed: 'var(--s3)', 'self-declared': 'var(--line-2)',
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-4 items-start">
        <Panel>
          <Heading note="Distribution of all skill claims in the register by the source that backs them">
            Claim provenance
          </Heading>
          <Composition height={13} segments={d.claims.map((r: any) => ({
            label: r.status, value: r.n, color: colour[r.status] ?? 'var(--line-2)',
          }))} />
          <dl className="mt-3 space-y-1.5 t-sm">
            {d.claims.map((r: any) => (
              <div key={r.status} className="flex items-center gap-2">
                <span style={{ width: 8, height: 8, borderRadius: 1, background: colour[r.status] ?? 'var(--line-2)', flexShrink: 0 }} />
                <dt className="capitalize flex-1 min-w-0">{r.status}</dt>
                <dd className="tabular muted">{pct((r.n / total) * 100, 1)}</dd>
                <dd className="tabular font-medium w-14 text-right">{num(r.n)}</dd>
              </div>
            ))}
          </dl>
          <Note>
            A claim backed by an external source can be relied on without further evidence. A
            self-declared claim is a legitimate record of skill acquired outside formal training, and
            is weighted differently in matching.
          </Note>
        </Panel>

        <Panel>
          <Heading note="Count of records by source, per record type">Record sources</Heading>
          <dl className="space-y-3">
            {[['Employment', d.employment], ['Qualifications', d.quals], ['Certifications', d.certs]].map(([label, rows]: any) => (
              <div key={label}>
                <dt className="t-xs font-semibold mb-1">{label}</dt>
                {rows.map((r: any) => (
                  <dd key={r.source} className="flex justify-between t-sm">
                    <span className="muted">{r.source}</span>
                    <span className="tabular">{num(r.n)}</span>
                  </dd>
                ))}
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      <Panel>
        <Heading note="Percentage of technical skill claims carrying a provider record, by sector">
          Verification rate by sector
        </Heading>
        <BarChart max={100} format={(v) => `${v}%`}
                  rows={d.bySector.map((r: any) => ({
                    label: r.sector,
                    value: Math.round((r.verified / r.claims) * 100),
                    note: `${r.verified} of ${r.claims} claims`,
                  }))} />
      </Panel>
    </div>
  );
}

function Funding() {
  const [d, setD] = useState<any>(null);
  useEffect(() => { get('/authority/funding').then(setD).catch(() => {}); }, []);
  if (!d) return <Loading />;

  return (
    <div className="space-y-4 mt-4">
      <Panel>
        <Heading note="Credit and allowance schemes, with the amount granted and the amount still unspent">
          Scheme position
        </Heading>
        <Table
          columns={[{ key: 'name', label: 'Scheme' }, { key: 'kind', label: 'Type' },
                    { key: 'holders', label: 'Holders', align: 'right' },
                    { key: 'granted', label: 'Granted', align: 'right' },
                    { key: 'balance', label: 'Unspent', align: 'right' },
                    { key: 'used', label: 'Drawn', align: 'right' }]}
          rows={d.accounts.map((a: any) => ({
            name: <span className="font-medium">{a.name}</span>,
            kind: <Tag tone={a.kind === 'credit' ? 'accent' : a.kind === 'allowance' ? 'good' : 'neutral'}>{a.kind}</Tag>,
            holders: <span className="tabular">{a.holders ?? 0}</span>,
            granted: <span className="tabular">{a.granted ? money(a.granted) : 'n/a'}</span>,
            balance: <span className="tabular">{a.balance != null ? money(a.balance) : 'n/a'}</span>,
            used: <span className="tabular font-medium">
              {a.granted ? pct(((a.granted - a.balance) / a.granted) * 100, 1) : 'n/a'}
            </span>,
          }))}
        />
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Panel>
          <Heading note="Total credit drawn per calendar year, Singapore dollars">Drawdown over time</Heading>
          <LineChart series={[{ name: 'Credit drawn', points: d.byYear.map((r: any) => ({ x: r.year, y: r.value })) }]}
                     format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))} yZero height={190} />
        </Panel>
        <Panel>
          <Heading note="Courses ranked by total credit applied against their fees">Highest drawdown by course</Heading>
          <BarChart color="var(--s3)" format={(v) => money(v)}
                    rows={d.topCourses.map((c: any) => ({
                      label: c.title, value: c.value, note: `${c.provider}, ${c.claims} claims`,
                    }))} />
        </Panel>
      </div>
    </div>
  );
}

function Market() {
  const [series, setSeries] = useState<any[]>([]);
  const [code, setCode] = useState('JV_RATE_INDUSTRY');
  const [data, setData] = useState<any>(null);
  const [dim, setDim] = useState('');

  useEffect(() => { get<any[]>('/labour/series').then(setSeries).catch(() => {}); }, []);
  useEffect(() => { setData(null); setDim(''); get(`/labour/series/${code}`).then(setData).catch(() => {}); }, [code]);

  const chosen = series.find((s) => s.code === code);
  const points = data?.observations ?? [];
  const dims: string[] = data?.dim1Values ?? [];
  const active = dim || dims[0] || '';
  const filtered = dims.length ? points.filter((p: any) => p.dim1 === active) : points;

  const grouped = new Map<string, { x: string; y: number }[]>();
  for (const p of filtered) {
    const k = p.dim2 ?? p.dim1 ?? 'value';
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k)!.push({ x: p.period, y: p.value });
  }
  const chartSeries = [...grouped.entries()].slice(0, 3).map(([name, pts]) => ({ name, points: pts }));
  const periods = filtered.map((p: any) => p.period).sort();

  return (
    <div className="space-y-4 mt-4">
      <Panel>
        <Heading note={chosen ? `${chosen.agency}. Unit: ${chosen.unit}. ${num(chosen.rows)} observations.` : ''}
                 action={
                   <div className="flex flex-wrap gap-2 justify-end">
                     <select value={code} onChange={(e) => setCode(e.target.value)} aria-label="Select series"
                             className="field max-w-[320px]">
                       {series.map((s) => <option key={s.code} value={s.code}>{s.title}</option>)}
                     </select>
                     {dims.length > 1 && (
                       <select value={active} onChange={(e) => setDim(e.target.value)} aria-label="Select breakdown"
                               className="field max-w-[260px]">
                         {dims.map((d) => <option key={d} value={d}>{d}</option>)}
                       </select>
                     )}
                   </div>
                 }>
          {chosen?.title ?? 'Labour market series'}
        </Heading>
        {!data ? <Loading /> : (
          <>
            <LineChart series={chartSeries} height={250}
                       format={(v) => (Math.abs(v) >= 10000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(1))} />
            <Source agency={chosen?.agency} dataset={chosen?.dataset_id} url={chosen?.source_url}
                    coverage={periods.length ? `${periods[0]} to ${periods[periods.length - 1]}` : undefined}
                    note={grouped.size > 3 ? 'First three breakdowns shown.' : undefined} />
          </>
        )}
      </Panel>

      <Panel>
        <Heading note="Every Ministry of Manpower series loaded into this implementation">Series catalogue</Heading>
        <Table
          columns={[{ key: 'title', label: 'Series' }, { key: 'unit', label: 'Unit' },
                    { key: 'dims', label: 'Breakdowns' }, { key: 'rows', label: 'Observations', align: 'right' },
                    { key: 'src', label: 'Dataset' }]}
          rows={series.map((s) => ({
            title: <button onClick={() => setCode(s.code)} className="font-medium text-left hover:underline">{s.title}</button>,
            unit: <span className="muted t-xs">{s.unit}</span>,
            dims: <span className="t-xs muted">{[s.dim1_label, s.dim2_label].filter(Boolean).join(', ') || 'none'}</span>,
            rows: <span className="tabular">{num(s.rows)}</span>,
            src: <a href={s.source_url} target="_blank" rel="noreferrer" className="t-xs underline muted tabular">{s.dataset_id}</a>,
          }))}
        />
      </Panel>
    </div>
  );
}

function Audit() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { get<any[]>('/authority/audit').then(setRows).catch(() => {}); }, []);
  return (
    <Panel className="mt-4">
      <Heading note="Actions recorded against a passport, a posting or the registry">Audit log</Heading>
      <Table
        columns={[{ key: 'when', label: 'Timestamp' }, { key: 'actor', label: 'Actor' },
                  { key: 'action', label: 'Action' }, { key: 'entity', label: 'Entity' }, { key: 'meta', label: 'Detail' }]}
        rows={rows.map((r) => ({
          when: <span className="tabular t-xs">{String(r.created_at).replace('T', ' ').slice(0, 16)}</span>,
          actor: <Tag tone={r.actor_type === 'authority' ? 'accent' : 'neutral'}>{r.actor_type}</Tag>,
          action: <span className="tabular t-xs">{r.action}</span>,
          entity: <span className="t-xs muted">{r.entity}{r.entity_id ? ` ${r.entity_id}` : ''}</span>,
          meta: <span className="t-xs muted tabular">{r.meta ?? ''}</span>,
        }))}
        empty="No audit events."
      />
    </Panel>
  );
}
