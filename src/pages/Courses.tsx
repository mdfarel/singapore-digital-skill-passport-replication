import { useEffect, useMemo, useState } from 'react';
import { get } from '../lib/api';
import { Link } from '../lib/router';
import { Trail, Panel, Heading, Table, Empty, Loading, Note, Tag } from '../components/ui';
import { money } from '../lib/format';

export function CoursesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [provider, setProvider] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (provider) params.set('provider', provider);
    params.set('limit', '200');
    const t = setTimeout(() => { get<any[]>(`/registry/courses?${params}`).then(setRows).catch(() => {}); }, 150);
    return () => clearTimeout(t);
  }, [q, provider]);

  const providers = useMemo(() => [...new Set(rows.map((r) => r.provider))].sort(), [rows]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="t-lg font-semibold">Training catalogue</h1>
        <p className="t-sm ink-2 mt-1.5 max-w-[76ch]">
          Every course is mapped to the framework skills it delivers and the proficiency level it
          delivers them to, so provision can be matched against a measured shortfall.
        </p>
        <p className="t-xs mt-3 rounded px-3 py-2 inline-block"
           style={{ background: 'color-mix(in oklab, var(--attention) 18%, transparent)' }}>
          Generated catalogue. These listings are constructed for this implementation and are not drawn
          from the official course registry.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses"
               aria-label="Search courses" className="field flex-1 min-w-[220px]" />
        <select value={provider} onChange={(e) => setProvider(e.target.value)} aria-label="Filter by provider" className="field">
          <option value="">All providers</option>
          {providers.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <Panel>
        <Table
          columns={[{ key: 'title', label: 'Course' }, { key: 'provider', label: 'Provider' },
                    { key: 'mode', label: 'Mode' }, { key: 'hours', label: 'Hours', align: 'right' },
                    { key: 'qual', label: 'Award' }, { key: 'fee', label: 'Full fee', align: 'right' },
                    { key: 'outcome', label: 'Outcome', align: 'right' }]}
          rows={rows.map((c) => ({
            title: <Link to={`/courses/${c.code}`} className="font-medium hover:underline">{c.title}</Link>,
            provider: <span className="t-xs">{c.provider}</span>,
            mode: <Tag>{c.mode}</Tag>,
            hours: <span className="tabular">{c.hours}</span>,
            qual: <span className="t-xs muted">{c.qual_level}</span>,
            fee: <span className="tabular">{money(c.full_fee)}</span>,
            outcome: <span className="tabular">{c.outcome}%</span>,
          }))}
          empty="No courses match this query."
        />
        <Note>
          {rows.length} courses listed. Outcome is the modelled share of completers in employment or
          further study six months after completion.
        </Note>
      </Panel>
    </div>
  );
}

export function CourseDetail({ code }: { code: string }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => { setData(null); get(`/registry/courses/${code}`).then(setData).catch(() => setData({ error: true })); }, [code]);
  if (!data) return <Loading />;
  if (data.error) return <Empty>No course at this code.</Empty>;
  const c = data.course;

  const base = data.schemes.find((s: any) => s.code === 'BASE-SUB');
  const mces = data.schemes.find((s: any) => s.code === 'MCES');
  const afterBase = Math.round(c.full_fee * (1 - (base?.rate ?? 0)));
  const afterMces = Math.round(c.full_fee * (1 - (mces?.rate ?? 0)));
  const BAND = ['Basic', 'Intermediate', 'Advanced'];

  return (
    <div className="space-y-4">
      <Trail items={[{ label: 'Training', to: '/courses' }, { label: c.title }]} />

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-[64ch] min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="t-lg font-semibold">{c.title}</h1>
              <Tag>{c.mode}</Tag>
              <Tag tone="attention">generated listing</Tag>
            </div>
            <p className="t-sm ink-2 mt-1.5">{c.provider}</p>
            <dl className="flex flex-wrap gap-x-6 gap-y-1 mt-3 t-xs muted">
              <span><dt className="inline">Code </dt><dd className="inline tabular">{c.code}</dd></span>
              <span><dt className="inline">Duration </dt><dd className="inline tabular">{c.hours} hours</dd></span>
              <span><dt className="inline">Award </dt><dd className="inline">{c.qual_level}</dd></span>
              <span><dt className="inline">Outcome </dt><dd className="inline tabular">{c.outcome}%</dd></span>
            </dl>
          </div>
          <dl className="rounded p-3 min-w-[212px]" style={{ background: 'var(--surface-2)' }}>
            <dt className="t-xs muted">Full course fee</dt>
            <dd className="t-md font-semibold tabular">{money(c.full_fee)}</dd>
            <div className="mt-2.5 space-y-1 t-xs">
              <div className="flex justify-between gap-3">
                <dt className="muted">After baseline subsidy</dt>
                <dd className="tabular font-medium">{money(afterBase)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="muted">Aged 40 and over</dt>
                <dd className="tabular font-medium">{money(afterMces)}</dd>
              </div>
            </div>
            <dd className="t-xs muted mt-2">Credit applies against the remaining payable amount.</dd>
          </dl>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Panel>
          <Heading note="Claims a completer may record, and the level each is delivered to">Skills delivered</Heading>
          <div className="space-y-1.5">
            {data.skills.map((s: any) => (
              <div key={s.code} className="flex items-center justify-between gap-3">
                <Link to={s.skill_type === 'tsc' ? `/skills/${s.code}` : '/skills/critical-core'}
                      className="t-sm hover:underline truncate min-w-0">{s.title}</Link>
                <span className="flex items-center gap-2 shrink-0">
                  <Tag tone={s.skill_type === 'ccs' ? 'accent' : 'neutral'}>{s.skill_type.toUpperCase()}</Tag>
                  <span className="tabular t-xs muted">
                    {s.skill_type === 'ccs' ? BAND[s.level - 1] : `Level ${s.level}`}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <Heading note="Schemes administered by the labour authority">Funding</Heading>
          <dl className="space-y-2.5">
            {data.schemes.map((s: any) => (
              <div key={s.code}>
                <div className="flex items-center gap-2">
                  <dt className="t-sm font-medium">{s.name}</dt>
                  <Tag tone={s.kind === 'credit' ? 'accent' : s.kind === 'allowance' ? 'good' : 'neutral'}>{s.kind}</Tag>
                  {s.amount != null && <span className="t-sm tabular ml-auto font-medium">{money(s.amount)}</span>}
                  {s.rate != null && <span className="t-sm tabular ml-auto font-medium">{Math.round(s.rate * 100)}%</span>}
                </div>
                <dd className="t-xs muted mt-0.5">{s.note}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </div>
  );
}
