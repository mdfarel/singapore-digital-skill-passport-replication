import { useEffect, useState } from 'react';
import { get } from '../lib/api';
import { Link } from '../lib/router';
import { Trail, Panel, Heading, Table, Empty, Loading, Tag } from '../components/ui';
import { money, date } from '../lib/format';

const TIER: Record<string, string> = { leader: 'good', practitioner: 'accent', adopter: 'neutral', none: 'neutral' };
const BAND = ['Basic', 'Intermediate', 'Advanced'];

export function JobsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [sector, setSector] = useState('');

  useEffect(() => { get<any[]>('/registry/sectors').then(setSectors).catch(() => {}); }, []);
  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (sector) p.set('sector', sector);
    const t = setTimeout(() => { get<any[]>(`/jobs?${p}`).then(setRows).catch(() => {}); }, 150);
    return () => clearTimeout(t);
  }, [q, sector]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="t-lg font-semibold">Vacancies</h1>
        <p className="t-sm ink-2 mt-1.5 max-w-[76ch]">
          Postings state the framework skills required and the proficiency required of each. Candidates
          are ranked by the proportion of stated requirements met by skills held, independent of job title.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search roles or employers"
               aria-label="Search vacancies" className="field flex-1 min-w-[220px]" />
        <select value={sector} onChange={(e) => setSector(e.target.value)} aria-label="Filter by sector" className="field">
          <option value="">All sectors</option>
          {sectors.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
        </select>
      </div>

      <Panel>
        <Table
          columns={[{ key: 'title', label: 'Role' }, { key: 'employer', label: 'Employer' },
                    { key: 'sector', label: 'Sector' }, { key: 'pay', label: 'Monthly gross', align: 'right' },
                    { key: 'skills', label: 'Requirements', align: 'right' },
                    { key: 'apps', label: 'Applicants', align: 'right' }, { key: 'posted', label: 'Posted' }]}
          rows={rows.map((j) => ({
            title: (
              <div>
                <Link to={`/jobs/${j.ref}`} className="font-medium hover:underline">{j.title}</Link>
                <div className="t-xs muted">{j.arrangement}, {j.location}</div>
              </div>
            ),
            employer: (
              <div>
                <div className="t-xs">{j.employer}</div>
                <Tag tone={TIER[j.skills_first_tier]}>{j.skills_first_tier}</Tag>
              </div>
            ),
            sector: <span className="t-xs muted">{j.sector_name}</span>,
            pay: <span className="tabular">{money(j.pay_min)} to {money(j.pay_max)}</span>,
            skills: <span className="tabular">{j.skill_count}</span>,
            apps: <span className="tabular">{j.applicants}</span>,
            posted: <span className="tabular muted">{date(j.posted_on)}</span>,
          }))}
          empty="No open vacancies match this query."
        />
      </Panel>
    </div>
  );
}

export function JobDetail({ refId }: { refId: string }) {
  const [data, setData] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    setData(null);
    get(`/jobs/${refId}`).then(setData).catch(() => setData({ error: true }));
    get<any[]>(`/jobs/${refId}/matches`).then(setMatches).catch(() => {});
  }, [refId]);

  if (!data) return <Loading />;
  if (data.error) return <Empty>No posting at this reference.</Empty>;
  const p = data.posting;

  return (
    <div className="space-y-4">
      <Trail items={[{ label: 'Vacancies', to: '/jobs' }, { label: p.title }]} />

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-[66ch] min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="t-lg font-semibold">{p.title}</h1>
              <Tag tone={p.status === 'open' ? 'good' : 'neutral'}>{p.status}</Tag>
              <Tag tone={TIER[p.skills_first_tier]}>{p.skills_first_tier}</Tag>
            </div>
            <p className="t-sm ink-2 mt-1.5">
              {p.employer} <span className="muted t-xs tabular">UEN {p.uen}</span>
            </p>
            <p className="t-sm ink-2 mt-2">{p.summary}</p>
            <dl className="flex flex-wrap gap-x-6 gap-y-1 mt-3 t-xs muted">
              <span><dt className="inline">Reference </dt><dd className="inline tabular">{p.ref}</dd></span>
              <span><dt className="inline">Terms </dt><dd className="inline">{p.arrangement}, {p.location}</dd></span>
              <span><dt className="inline">Posted </dt><dd className="inline tabular">{date(p.posted_on)}</dd></span>
              <span><dt className="inline">Closes </dt><dd className="inline tabular">{date(p.closes_on)}</dd></span>
              {p.role_code && (
                <span><dt className="inline">Framework role </dt>
                  <dd className="inline"><Link to={`/roles/${p.role_code}`} className="underline">{p.role_title}</Link></dd></span>
              )}
            </dl>
          </div>
          <div className="text-right shrink-0">
            <div className="t-xs muted">Monthly gross</div>
            <div className="t-md font-semibold tabular">{money(p.pay_min)} to {money(p.pay_max)}</div>
            <div className="t-xs muted mt-0.5">{p.sector_name}</div>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Panel>
          <Heading note="Requirements marked mandatory are screened before the remainder are weighted">
            Stated requirements
          </Heading>
          <div className="space-y-1.5">
            {data.skills.map((s: any) => (
              <div key={`${s.skill_type}-${s.code}`} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate">
                  <Link to={s.skill_type === 'tsc' ? `/skills/${s.code}` : '/skills/critical-core'}
                        className="t-sm hover:underline">{s.title}</Link>
                  {s.category && <span className="t-xs muted"> {s.category}</span>}
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  {s.must_have === 1 && <Tag tone="accent">mandatory</Tag>}
                  <span className="tabular t-xs muted">
                    {s.skill_type === 'ccs' ? BAND[s.required_level - 1] : `L${s.required_level}`}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <Heading note="All passport holders scored against the stated requirements. Job titles are not used.">
            Candidate ranking
          </Heading>
          <Table
            columns={[{ key: 'name', label: 'Holder' }, { key: 'role', label: 'Current role' },
                      { key: 'match', label: 'Met', align: 'right' }, { key: 'flag', label: '' }]}
            rows={matches.slice(0, 12).map((m) => ({
              name: <Link to={`/passport/${m.id}`} className="font-medium hover:underline">{m.name}</Link>,
              role: <span className="t-xs muted">{m.current_role}, {m.sector_name}</span>,
              match: <span className="tabular font-medium">{m.match}%</span>,
              flag: m.missing_must_have > 0
                ? <Tag tone="attention">{m.missing_must_have} mandatory unmet</Tag>
                : <Tag tone="good">mandatory met</Tag>,
            }))}
            empty="No candidates scored."
          />
        </Panel>
      </div>

      <Panel>
        <Heading note="Applications submitted through the passport">Applications</Heading>
        <Table
          columns={[{ key: 'name', label: 'Applicant' }, { key: 'role', label: 'Current role' },
                    { key: 'score', label: 'Requirements met', align: 'right' },
                    { key: 'status', label: 'Status' }, { key: 'when', label: 'Applied' }]}
          rows={data.applications.map((a: any) => ({
            name: <Link to={`/passport/${a.person_id}`} className="font-medium hover:underline">{a.name}</Link>,
            role: <span className="t-xs muted">{a.current_role}</span>,
            score: <span className="tabular">{a.match_score}%</span>,
            status: <Tag tone={a.status === 'offer' ? 'good' : a.status === 'rejected' ? 'neutral'
              : a.status === 'interview' || a.status === 'shortlisted' ? 'accent' : 'neutral'}>{a.status}</Tag>,
            when: <span className="tabular muted">{date(a.applied_at)}</span>,
          }))}
          empty="No applications recorded."
        />
      </Panel>
    </div>
  );
}
