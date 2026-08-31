import { useEffect, useMemo, useState } from 'react';
import { get, post } from '../lib/api';
import { Link, useRouter } from '../lib/router';
import { Panel, Heading, Table, Empty, Loading, Note, Tabs, Tag, Provenance, ArrowIcon, CheckIcon } from '../components/ui';
import { Scale, Composition } from '../components/charts';
import { money, monthYear } from '../lib/format';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'skills', label: 'Skills' },
  { id: 'employment', label: 'Employment' },
  { id: 'qualifications', label: 'Qualifications' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'attainment', label: 'Attainment' },
  { id: 'funding', label: 'Funding' },
  { id: 'disclosure', label: 'Disclosure' },
];

const BANDS = ['Basic', 'Intermediate', 'Advanced'];

export function PassportPage({ personId, onSwitch }: { personId: number; onSwitch: () => void }) {
  const { query, go } = useRouter();
  const requested = query.get('tab');
  // An unrecognised tab falls back to the overview rather than rendering nothing.
  const tab = TABS.some((t) => t.id === requested) ? requested! : 'overview';
  const [data, setData] = useState<any>(null);
  const [people, setPeople] = useState<any[]>([]);
  const [reload, setReload] = useState(0);

  useEffect(() => { setData(null); get(`/passport/${personId}`).then(setData).catch(() => setData({ error: true })); }, [personId, reload]);
  useEffect(() => { get<any[]>('/passport/people').then(setPeople).catch(() => {}); }, []);

  if (!data) return <Loading label="Loading passport" />;
  if (data.error) return <Empty>No passport at this identifier.</Empty>;

  const p = data.person;
  const setTab = (id: string) => go(`/passport/${personId}?tab=${id}`);
  const credit = data.credits.reduce((n: number, c: any) => n + c.balance, 0);

  return (
    <div className="space-y-4">
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="t-lg font-semibold">{p.name}</h1>
              <Tag tone="accent" icon={<CheckIcon />}>Identity verified</Tag>
              <Tag>{p.residency === 'citizen' ? 'Citizen' : 'Permanent resident'}</Tag>
            </div>
            <p className="t-sm ink-2 mt-1">{p.headline}</p>
            <dl className="flex flex-wrap gap-x-6 gap-y-1 mt-3 t-xs">
              <span><dt className="inline muted">Reference </dt><dd className="inline tabular">{p.ref}</dd></span>
              <span><dt className="inline muted">Year of birth </dt><dd className="inline tabular">{p.birth_year}</dd></span>
              {p.current_role_code && (
                <span><dt className="inline muted">Current role </dt>
                  <dd className="inline"><Link to={`/roles/${p.current_role_code}`} className="underline">{p.current_role_title}</Link></dd></span>
              )}
              {p.target_role_code && (
                <span><dt className="inline muted">Target role </dt>
                  <dd className="inline"><Link to={`/roles/${p.target_role_code}`} className="underline">{p.target_role_title}</Link></dd></span>
              )}
            </dl>
          </div>
          <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
            <label className="t-xs muted shrink-0" htmlFor="holder">Holder</label>
            <select id="holder" value={personId}
                    onChange={(e) => { post('/auth/login', { personId: Number(e.target.value) }).then(onSwitch); go(`/passport/${e.target.value}?tab=${tab}`); }}
                    className="field min-w-0 flex-1 sm:flex-none sm:max-w-[240px]">
              {people.map((x) => <option key={x.id} value={x.id}>{x.name}, {x.current_role}</option>)}
            </select>
          </div>
        </div>

        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <Stat label="Skills recorded" value={data.summary.totalSkills}
                note={`${data.summary.verifiedSkills} with a provider record`} />
          <Stat label="Verified records" value={data.summary.verifiedRecords}
                note="Contribution, institution, provider" />
          <Stat label="Years in the labour force" value={data.summary.yearsOfExperience}
                note={`${data.employment.length} engagements`} />
          <Stat label="Unspent training credit" value={money(credit)}
                note={data.credits.map((c: any) => c.scheme).join(', ') || 'No scheme'} />
        </dl>
      </Panel>

      <Tabs tabs={TABS.map((t) => ({
        ...t,
        count: t.id === 'skills' ? data.skills.tsc.length + data.skills.ccs.length
          : t.id === 'employment' ? data.employment.length
          : t.id === 'qualifications' ? data.qualifications.length
          : t.id === 'certifications' ? data.certifications.length
          : t.id === 'disclosure' ? data.shares.filter((s: any) => !s.revoked_at).length
          : undefined,
      }))} active={tab} onChange={setTab} />

      {tab === 'overview' && <Overview data={data} />}
      {tab === 'skills' && <Skills data={data} personId={personId} onChange={() => setReload((n) => n + 1)} />}
      {tab === 'employment' && <Employment data={data} />}
      {tab === 'qualifications' && <Qualifications data={data} />}
      {tab === 'certifications' && <Certifications data={data} />}
      {tab === 'attainment' && <Attainment personId={personId} />}
      {tab === 'funding' && <Funding personId={personId} />}
      {tab === 'disclosure' && <Disclosure data={data} personId={personId} onChange={() => setReload((n) => n + 1)} />}
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: any; note?: string }) {
  return (
    <div className="rounded p-2.5" style={{ background: 'var(--surface-2)' }}>
      <dt className="t-xs muted">{label}</dt>
      <dd className="t-md font-semibold tabular mt-0.5">{value}</dd>
      {note && <dd className="t-xs muted">{note}</dd>}
    </div>
  );
}

function Overview({ data }: { data: any }) {
  const byStatus = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of [...data.skills.tsc, ...data.skills.ccs]) m.set(s.status, (m.get(s.status) ?? 0) + 1);
    return m;
  }, [data]);
  const current = data.employment.find((e: any) => !e.end_date) ?? data.employment[0];
  const top = [...data.skills.tsc].sort((a: any, b: any) => b.claimed_level - a.claimed_level).slice(0, 8);
  const total = [...byStatus.values()].reduce((n, v) => n + v, 0) || 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-4 mt-4 items-start">
      <div className="space-y-4">
        <Panel>
          <Heading note="Highest attained technical skills, on a six-level scale">Skill profile</Heading>
          <div className="space-y-2">
            {top.map((s: any) => (
              <div key={s.code} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <Link to={`/skills/${s.code}`} className="t-sm flex-1 min-w-0 truncate hover:underline">{s.title}</Link>
                <Scale level={s.claimed_level} max={s.max_level} size="sm" />
                <span className="t-xs muted tabular w-8 text-right">L{s.claimed_level}</span>
                <span className="w-auto sm:w-[140px] shrink-0 sm:text-right"><Provenance source={s.status} /></span>
              </div>
            ))}
          </div>
          <Link to="?tab=skills" className="t-xs mt-3 inline-flex items-center gap-1 underline">
            All {data.skills.tsc.length + data.skills.ccs.length} skills <ArrowIcon />
          </Link>
        </Panel>

        <Panel>
          <Heading note="Current engagement, drawn from contribution records">Employment</Heading>
          {current ? (
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="t-sm font-medium">{current.job_title}</div>
                <div className="t-sm ink-2">{current.employer}</div>
                <div className="t-xs muted mt-0.5">
                  {monthYear(current.start_date)} to {current.end_date ? monthYear(current.end_date) : 'present'},
                  {' '}{current.arrangement}{current.sector_name ? `, ${current.sector_name}` : ''}
                </div>
              </div>
              <Provenance source={current.source} at={current.verified_at} />
            </div>
          ) : <Empty>No employment records.</Empty>}
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel>
          <Heading note="Distribution of skill claims by the source that backs them">Claim provenance</Heading>
          <Composition height={12} segments={[
            { label: 'Provider record', value: byStatus.get('verified') ?? 0, color: 'var(--good)' },
            { label: 'Work history', value: byStatus.get('evidenced') ?? 0, color: 'var(--s1)' },
            { label: 'Self-declared', value: byStatus.get('self-declared') ?? 0, color: 'var(--line-2)' },
          ]} />
          <dl className="mt-3 space-y-1.5 t-xs">
            {[
              ['Provider record', byStatus.get('verified') ?? 0, 'var(--good)', 'Completed course held by an approved provider'],
              ['Work history', byStatus.get('evidenced') ?? 0, 'var(--s1)', 'Required by a role held in the employment record'],
              ['Self-declared', byStatus.get('self-declared') ?? 0, 'var(--line-2)', 'Entered by the holder, no external source'],
            ].map(([label, n, color, note]) => (
              <div key={String(label)} className="flex items-start gap-2">
                <span style={{ width: 8, height: 8, borderRadius: 1, background: color as string, marginTop: 4, flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <dt>{label as string}</dt>
                    <dd className="tabular font-medium">{n as number} ({(((n as number) / total) * 100).toFixed(0)}%)</dd>
                  </div>
                  <dd className="muted">{note as string}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel>
          <Heading note="Courses recorded against this passport">Training</Heading>
          {data.training.length ? (
            <div className="space-y-2">
              {data.training.slice(0, 6).map((t: any) => (
                <div key={t.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/courses/${t.course_code}`} className="t-sm hover:underline block truncate">{t.course_title}</Link>
                    <div className="t-xs muted">{t.provider}, {t.hours} hours</div>
                  </div>
                  <Tag tone={t.status === 'completed' ? 'good' : t.status === 'in-progress' ? 'accent' : 'neutral'}>{t.status}</Tag>
                </div>
              ))}
            </div>
          ) : <Empty>No training recorded.</Empty>}
        </Panel>
      </div>
    </div>
  );
}

function Skills({ data, personId, onChange }: { data: any; personId: number; onChange: () => void }) {
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [adding, setAdding] = useState(false);

  const tsc = data.skills.tsc.filter((s: any) =>
    (filter === 'all' || s.status === filter) &&
    (!q || s.title.toLowerCase().includes(q.toLowerCase()) || s.category.toLowerCase().includes(q.toLowerCase())));

  const byCluster = useMemo(() => {
    const m = new Map<string, any[]>();
    for (const c of data.skills.ccs) {
      if (!m.has(c.cluster)) m.set(c.cluster, []);
      m.get(c.cluster)!.push(c);
    }
    return m;
  }, [data]);
  const CLUSTERS: Record<string, string> = { TC: 'Thinking critically', IO: 'Interacting with others', SR: 'Staying relevant' };

  return (
    <div className="mt-4 space-y-4">
      <Panel>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter technical skills"
                 aria-label="Filter technical skills" className="field flex-1 min-w-[180px]" />
          {['all', 'verified', 'evidenced', 'self-declared'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className="btn"
                    style={{ background: filter === f ? 'var(--surface-2)' : 'var(--surface)', fontWeight: filter === f ? 600 : 400 }}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
          <button onClick={() => setAdding((v) => !v)} className="btn btn-primary">Add skill</button>
        </div>

        {adding && <AddSkill personId={personId} onDone={() => { setAdding(false); onChange(); }} />}

        <Table
          columns={[
            { key: 'skill', label: 'Technical skill' },
            { key: 'category', label: 'Category' },
            { key: 'level', label: 'Attained', width: '170px' },
            { key: 'status', label: 'Source', width: '150px' },
          ]}
          rows={tsc.map((s: any) => ({
            skill: <Link to={`/skills/${s.code}`} className="hover:underline">{s.title}</Link>,
            category: <span className="muted t-xs">{s.category}, {s.sector_code ?? 'cross-sector'}</span>,
            level: (
              <span className="flex items-center gap-2">
                <Scale level={s.claimed_level} max={s.max_level} size="sm" />
                <span className="tabular t-xs muted">L{s.claimed_level} of {s.max_level}</span>
              </span>
            ),
            status: <Provenance source={s.status} at={s.updated_at} />,
          }))}
          empty="No skills match this filter."
        />
      </Panel>

      <Panel>
        <Heading note="Sixteen transferable skills, assessed at three bands, carried by every role in the registry">
          Critical core skills
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          {[...byCluster.entries()].map(([cluster, items]) => (
            <div key={cluster}>
              <h3 className="t-xs font-semibold mb-2">{CLUSTERS[cluster] ?? cluster}</h3>
              <div className="space-y-2">
                {items.map((c: any) => (
                  <div key={c.code}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="t-sm truncate min-w-0">{c.title}</span>
                      <span className="flex items-center gap-1.5 shrink-0">
                        <Scale level={c.band} max={3} size="sm" />
                        <span className="t-xs muted w-[58px] text-right">{BANDS[c.band - 1]}</span>
                      </span>
                    </div>
                    <p className="t-xs muted">{c.descriptor}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function AddSkill({ personId, onDone }: { personId: number; onDone: () => void }) {
  const [q, setQ] = useState('');
  const [opts, setOpts] = useState<any[]>([]);
  const [chosen, setChosen] = useState<any>(null);
  const [level, setLevel] = useState(2);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (q.length < 2) { setOpts([]); return; }
    const t = setTimeout(() => { get<any[]>(`/registry/tscs?q=${encodeURIComponent(q)}&limit=8`).then(setOpts).catch(() => {}); }, 160);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="rounded p-3 mb-3" style={{ background: 'var(--surface-2)' }}>
      <p className="t-xs muted mb-2">
        Skills entered here are recorded as self-declared. Only an external source can raise a claim
        to verified.
      </p>
      {!chosen ? (
        <>
          <input value={q} onChange={(e) => setQ(e.target.value)} autoFocus
                 placeholder="Search the skills registry" aria-label="Search the skills registry"
                 className="field w-full" />
          <div className="mt-1.5 space-y-0.5">
            {opts.map((o) => (
              <button key={o.code} onClick={() => { setChosen(o); setLevel(Math.max(o.min_level, 2)); }}
                      className="w-full text-left px-2 py-1 rounded hover:bg-[color:var(--surface)] t-sm">
                {o.title} <span className="muted t-xs">{o.category}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <span className="t-sm font-medium">{chosen.title}</span>
          <label className="t-xs muted" htmlFor="lvl">Level</label>
          <select id="lvl" value={level} onChange={(e) => setLevel(Number(e.target.value))} className="field">
            {Array.from({ length: chosen.max_level - chosen.min_level + 1 }, (_, i) => chosen.min_level + i).map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <button disabled={busy} className="btn btn-primary" onClick={() => {
            setBusy(true);
            post(`/passport/${personId}/skills`, { code: chosen.code, level }).then(onDone).finally(() => setBusy(false));
          }}>{busy ? 'Recording' : 'Record claim'}</button>
          <button onClick={() => setChosen(null)} className="btn">Change</button>
        </div>
      )}
    </div>
  );
}

function Employment({ data }: { data: any }) {
  return (
    <Panel className="mt-4">
      <Heading note="Engagements drawn from contribution records. Non-contributory work is self-declared.">
        Employment record
      </Heading>
      <div>
        {data.employment.map((e: any, i: number) => (
          <div key={e.id} className={`flex flex-wrap gap-x-4 gap-y-1 ${i ? 'pt-3 mt-3 border-t rule' : ''}`}>
            <div className="w-[124px] shrink-0 t-xs muted tabular pt-0.5">
              {monthYear(e.start_date)} to<br />{e.end_date ? monthYear(e.end_date) : 'present'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="t-sm font-medium">{e.job_title}</span>
                <Tag>{e.arrangement}</Tag>
              </div>
              <div className="t-sm ink-2">{e.employer}{e.uen && <span className="muted t-xs tabular"> UEN {e.uen}</span>}</div>
              <div className="t-xs muted mt-0.5">
                {e.sector_name ?? 'Sector not mapped'}{e.ssoc ? `, SSOC ${e.ssoc}` : ''}
              </div>
            </div>
            <div className="shrink-0"><Provenance source={e.source} at={e.verified_at} /></div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Qualifications({ data }: { data: any }) {
  return (
    <Panel className="mt-4">
      <Heading note="Conferred awards matched against institution records">Academic qualifications</Heading>
      <Table
        columns={[{ key: 'q', label: 'Award' }, { key: 'inst', label: 'Institution' },
                  { key: 'field', label: 'Field' }, { key: 'when', label: 'Conferred' }, { key: 'src', label: 'Source' }]}
        rows={data.qualifications.map((q: any) => ({
          q: <span className="font-medium">{q.qualification}</span>,
          inst: q.institution, field: <span className="muted">{q.field}</span>,
          when: <span className="tabular">{monthYear(q.conferred_on)}</span>,
          src: <Provenance source={q.source} at={q.verified_at} />,
        }))}
      />
    </Panel>
  );
}

function Certifications({ data }: { data: any }) {
  return (
    <Panel className="mt-4">
      <Heading note="Credentials issued by training providers and professional bodies">Certifications</Heading>
      <Table
        columns={[{ key: 'name', label: 'Certification' }, { key: 'issuer', label: 'Issuer' },
                  { key: 'cred', label: 'Credential' }, { key: 'issued', label: 'Issued' },
                  { key: 'expires', label: 'Expires' }, { key: 'src', label: 'Source' }]}
        rows={data.certifications.map((c: any) => ({
          name: c.course_code
            ? <Link to={`/courses/${c.course_code}`} className="font-medium hover:underline">{c.name}</Link>
            : <span className="font-medium">{c.name}</span>,
          issuer: c.issuer,
          cred: <span className="tabular t-xs muted">{c.credential_id}</span>,
          issued: <span className="tabular">{monthYear(c.issued_on)}</span>,
          expires: <span className="tabular muted">{c.expires_on ? monthYear(c.expires_on) : 'None'}</span>,
          src: <Provenance source={c.source} at={c.verified_at} />,
        }))}
        empty="No certifications recorded."
      />
    </Panel>
  );
}

function Attainment({ personId }: { personId: number }) {
  const [gap, setGap] = useState<any>(null);
  const [paths, setPaths] = useState<any[]>([]);
  const [target, setTarget] = useState<string>('');

  useEffect(() => { get<any[]>(`/passport/${personId}/pathways`).then(setPaths).catch(() => {}); }, [personId]);
  useEffect(() => { get(`/passport/${personId}/gap${target ? `?target=${target}` : ''}`).then(setGap).catch(() => {}); }, [personId, target]);

  if (!gap) return <Loading label="Computing attainment" />;
  const met = gap.tsc.filter((t: any) => t.held_level >= t.required_level);

  return (
    <div className="mt-4 space-y-4">
      <Panel>
        <Heading note={`${gap.role.sector_name}, ${gap.role.band} band. Median gross pay ${money(gap.role.pay_median)} per month.`}
                 action={
                   <div className="flex items-center gap-2 min-w-0">
                     <label className="t-xs muted shrink-0" htmlFor="target">Target</label>
                     <select id="target" value={target || gap.role.code} onChange={(e) => setTarget(e.target.value)}
                             className="field min-w-0 max-w-[260px]">
                       {paths.map((p) => <option key={p.code} value={p.code}>{p.title}, {p.readiness}%</option>)}
                     </select>
                   </div>
                 }>
          Attainment against {gap.role.title}
        </Heading>

        <div className="flex items-center gap-4">
          <div className="t-xl font-semibold tabular" style={{ color: 'var(--accent)' }}>{gap.readiness}%</div>
          <div className="flex-1 min-w-0">
            <div style={{ background: 'var(--surface-2)', height: 10, borderRadius: 2 }}>
              <div style={{ width: `${gap.readiness}%`, height: 10, borderRadius: '2px 3px 3px 2px', background: 'var(--accent-2)' }} />
            </div>
            <p className="t-xs muted mt-1.5">
              {met.length} of {gap.tsc.length} technical requirements met at the stated proficiency.
              {gap.gaps.length > 0 && ` ${gap.gaps.length} below requirement.`}
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Panel>
          <Heading note="Attained level shown as filled steps. The marker below the scale is the required level.">
            Technical requirements
          </Heading>
          <div className="space-y-3">
            {gap.tsc.map((t: any) => {
              const short = t.required_level - t.held_level;
              return (
                <div key={t.code}>
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <Link to={`/skills/${t.code}`} className="t-sm min-w-0 truncate hover:underline">{t.title}</Link>
                    <span className="flex items-center gap-2 shrink-0">
                      <Scale level={t.held_level} max={6} required={t.required_level} size="sm" />
                      <span className="t-xs tabular w-[74px] text-right whitespace-nowrap"
                            style={{ color: short > 0 ? 'var(--accent)' : 'var(--ink-2)' }}>
                        {short > 0 ? `${t.held_level ? `L${t.held_level}` : 'None'} to L${t.required_level}` : `L${t.held_level} met`}
                      </span>
                    </span>
                  </div>
                  {short > 0 && <p className="t-xs muted mt-0.5">{t.target_descriptor}</p>}
                </div>
              );
            })}
          </div>
          {gap.ccs.length > 0 && (
            <>
              <h3 className="t-xs font-semibold mt-4 mb-1.5">Critical core skills below requirement</h3>
              <div className="flex flex-wrap gap-1.5">
                {gap.ccs.map((c: any) => (
                  <Tag key={c.code} tone={c.emphasis ? 'accent' : 'neutral'}>
                    {c.title}, {BANDS[c.held_band - 1] ?? 'none'} to {BANDS[c.required_band - 1]}
                  </Tag>
                ))}
              </div>
            </>
          )}
        </Panel>

        <div className="space-y-4">
          <Panel>
            <Heading note="Ranked by the number of unmet requirements each course delivers">
              Training that meets the shortfall
            </Heading>
            {gap.recommendations.length ? (
              <div className="space-y-3">
                {gap.recommendations.slice(0, 6).map((r: any) => (
                  <div key={r.code} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/courses/${r.code}`} className="t-sm font-medium hover:underline block">{r.title}</Link>
                      <div className="t-xs muted">
                        {r.provider}, {r.hours} hours, {r.mode}, {money(r.full_fee)} before subsidy
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {r.closes.slice(0, 4).map((c: string) => <Tag key={c} tone="accent">{c}</Tag>)}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="t-md font-semibold tabular">{r.gap_hits}</div>
                      <div className="t-xs muted">requirements</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <Empty>All requirements for this role are met.</Empty>}
          </Panel>

          <Panel>
            <Heading note="Proportion of each role's technical requirements met by skills held">
              Roles by attainment
            </Heading>
            <div className="space-y-1.5">
              {paths.slice(0, 8).map((p) => (
                <Link key={p.code} to={`/roles/${p.code}`} className="flex items-center gap-2 t-sm">
                  <span className="flex-1 min-w-0 truncate hover:underline">{p.title}</span>
                  <Tag>{p.band}</Tag>
                  <span className="t-xs muted truncate max-w-[92px]">{p.sector_name}</span>
                  <span className="w-[42px] text-right tabular font-medium">{p.readiness}%</span>
                </Link>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Funding({ personId }: { personId: number }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => { get(`/passport/${personId}/credits`).then(setData).catch(() => {}); }, [personId]);
  if (!data) return <Loading />;

  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.accounts.map((a: any) => (
          <div key={a.id} className="panel p-3">
            <div className="t-xs muted">{a.scheme_name}</div>
            <div className="t-md font-semibold tabular mt-0.5">{money(a.balance)}</div>
            <div className="t-xs muted">
              {money(a.granted)} granted. {a.expires_on ? `Expires ${a.expires_on}.` : 'No expiry.'}
            </div>
          </div>
        ))}
        {!data.accounts.length && <Empty>No credit accounts held.</Empty>}
      </div>

      <Panel>
        <Heading note="Disbursements and course fee offsets recorded against this passport">Credit ledger</Heading>
        <Table
          columns={[{ key: 'when', label: 'Date' }, { key: 'scheme', label: 'Scheme' },
                    { key: 'what', label: 'Detail' }, { key: 'amount', label: 'Amount', align: 'right' },
                    { key: 'status', label: 'Status' }]}
          rows={data.transactions.map((t: any) => ({
            when: <span className="tabular">{t.occurred_at}</span>,
            scheme: <Tag>{t.scheme}</Tag>,
            what: t.course_title ?? t.note,
            amount: <span className="tabular font-medium">{t.amount < 0 ? '−' : '+'}{money(Math.abs(t.amount))}</span>,
            status: <Tag tone={t.status === 'settled' ? 'good' : 'neutral'}>{t.status}</Tag>,
          }))}
          empty="No credit activity."
        />
      </Panel>

      <Panel>
        <Heading note="Schemes administered by the labour authority, with eligibility">Funding schemes</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.schemes.map((s: any) => (
            <div key={s.code} className="rounded p-3" style={{ background: 'var(--surface-2)' }}>
              <div className="flex items-center gap-2">
                <span className="t-sm font-semibold">{s.name}</span>
                <Tag tone={s.kind === 'credit' ? 'accent' : s.kind === 'allowance' ? 'good' : 'neutral'}>{s.kind}</Tag>
              </div>
              <p className="t-xs ink-2 mt-1">{s.note}</p>
              <p className="t-xs muted mt-1">Eligibility: {s.eligibility}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Disclosure({ data, personId, onChange }: { data: any; personId: number; onChange: () => void }) {
  const [label, setLabel] = useState('Application');
  const [days, setDays] = useState(30);
  const [scope, setScope] = useState<Record<string, boolean>>({
    skills: true, employment: true, qualifications: true, certifications: true, insights: false,
  });
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<string | null>(null);

  return (
    <div className="mt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-4 items-start">
      <Panel>
        <Heading note="A link exposes only the sections selected, and stops resolving on expiry or revocation.">
          Issue a disclosure link
        </Heading>
        <label className="block t-xs muted mb-1" htmlFor="lab">Label</label>
        <input id="lab" value={label} onChange={(e) => setLabel(e.target.value)} className="field w-full mb-3" />
        <label className="block t-xs muted mb-1" htmlFor="exp">Validity</label>
        <select id="exp" value={days} onChange={(e) => setDays(Number(e.target.value))} className="field w-full mb-3">
          {[7, 14, 30, 90].map((d) => <option key={d} value={d}>{d} days</option>)}
        </select>
        <div className="t-xs muted mb-1.5">Sections disclosed</div>
        <div className="space-y-1 mb-3">
          {Object.keys(scope).map((k) => (
            <label key={k} className="flex items-center gap-2 t-sm capitalize">
              <input type="checkbox" checked={scope[k]} onChange={(e) => setScope({ ...scope, [k]: e.target.checked })} />
              {k}
            </label>
          ))}
        </div>
        <button className="btn btn-primary w-full justify-center" disabled={busy} onClick={() => {
          setBusy(true);
          post<{ token: string }>(`/passport/${personId}/share`, { label, scope, days })
            .then((r) => { setCreated(r.token); onChange(); })
            .finally(() => setBusy(false));
        }}>{busy ? 'Issuing' : 'Issue link'}</button>
        {created && (
          <div className="mt-3 rounded p-2.5 t-xs" style={{ background: 'var(--surface-2)' }}>
            <div className="muted mb-1">Address</div>
            <Link to={`/share/${created}`} className="tabular underline break-all">/share/{created}</Link>
          </div>
        )}
      </Panel>

      <Panel>
        <Heading note="Issued links, their scope, and access count">Disclosure log</Heading>
        <Table
          columns={[{ key: 'label', label: 'Label' }, { key: 'scope', label: 'Sections' },
                    { key: 'expiry', label: 'Expires' }, { key: 'views', label: 'Accesses', align: 'right' },
                    { key: 'action', label: '' }]}
          rows={data.shares.map((s: any) => ({
            label: (
              <div>
                <Link to={`/share/${s.token}`} className="font-medium hover:underline">{s.label}</Link>
                <div className="t-xs muted tabular">{s.token}</div>
              </div>
            ),
            scope: <span className="flex flex-wrap gap-1">{Object.entries(s.scope).filter(([, v]) => v).map(([k]) => <Tag key={k}>{k}</Tag>)}</span>,
            expiry: s.revoked_at ? <Tag tone="accent">revoked</Tag> : <span className="tabular muted">{s.expires_at ?? 'none'}</span>,
            views: <span className="tabular">{s.views}</span>,
            action: s.revoked_at ? null : (
              <button onClick={() => post(`/passport/${personId}/share/${s.id}/revoke`).then(onChange)}
                      className="t-xs underline muted">Revoke</button>
            ),
          }))}
          empty="No links issued."
        />
      </Panel>
    </div>
  );
}
