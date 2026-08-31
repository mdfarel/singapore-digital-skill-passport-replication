import { useEffect, useState } from 'react';
import { Panel, Heading, Table, Loading, Tag, Provenance, CheckIcon } from '../components/ui';
import { Scale } from '../components/charts';
import { monthYear } from '../lib/format';

/** Recipient view of a disclosed passport. The API returns only granted sections. */
export function SharedPassport({ token }: { token: string }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/share/${token}`)
      .then(async (r) => {
        const j = await r.json() as any;
        if (!r.ok) throw new Error(j.error ?? 'This link is not available.');
        return j;
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, [token]);

  if (error) {
    return (
      <div className="min-h-full grid place-items-center p-6">
        <Panel className="max-w-[420px] text-center">
          <p className="t-md font-semibold">Link unavailable</p>
          <p className="t-sm ink-2 mt-1.5">{error}</p>
          <p className="t-xs muted mt-3">
            Disclosure links are controlled by the holder and stop resolving on revocation or expiry.
          </p>
        </Panel>
      </div>
    );
  }
  if (!data) return <Loading label="Loading disclosed record" />;

  const p = data.person;
  const shared = Object.entries(data.scope).filter(([, v]) => v).map(([k]) => k);

  return (
    <div className="min-h-full" style={{ background: 'var(--plane)' }}>
      <header className="border-b rule">
        <div className="max-w-[860px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <span className="t-sm font-semibold">Skills Passport</span>
          <span className="t-xs muted">Disclosed record: {data.label}</span>
        </div>
      </header>

      <main className="max-w-[860px] mx-auto px-4 py-6 space-y-4">
        <Panel>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="t-lg font-semibold">{p.name}</h1>
                <Tag tone="accent" icon={<CheckIcon />}>Identity verified</Tag>
              </div>
              <p className="t-sm ink-2 mt-1">{p.headline}</p>
              <p className="t-xs muted mt-1">
                {p.current_role_title}, {p.current_sector_name}. Reference <span className="tabular">{p.ref}</span>.
              </p>
            </div>
            <dl className="text-right t-xs muted shrink-0">
              <div><dd className="inline tabular font-medium" style={{ color: 'var(--ink)' }}>{data.summary.verifiedRecords}</dd> <dt className="inline">verified records</dt></div>
              <div><dd className="inline tabular font-medium" style={{ color: 'var(--ink)' }}>{data.summary.yearsOfExperience}</dd> <dt className="inline">years in the labour force</dt></div>
            </dl>
          </div>
          <div className="mt-3 pt-3 border-t rule flex flex-wrap items-center gap-2">
            <span className="t-xs muted">Sections disclosed</span>
            {shared.map((s) => <Tag key={s} tone="accent">{s}</Tag>)}
          </div>
        </Panel>

        {data.skills && (
          <Panel>
            <Heading note="Attained proficiency against the national framework, with the source of each claim">
              Skills
            </Heading>
            <div className="space-y-2">
              {data.skills.tsc.slice(0, 20).map((s: any) => (
                <div key={s.code} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="t-sm flex-1 min-w-0 truncate">{s.title}</span>
                  <Scale level={s.claimed_level} max={s.max_level} size="sm" />
                  <span className="t-xs tabular muted w-7 text-right">L{s.claimed_level}</span>
                  <span className="w-auto sm:w-[140px] shrink-0 sm:text-right"><Provenance source={s.status} /></span>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {data.employment && (
          <Panel>
            <Heading note="Engagements verified against contribution records where marked">Employment</Heading>
            {data.employment.map((e: any, i: number) => (
              <div key={e.id} className={`flex flex-wrap gap-x-4 gap-y-1 ${i ? 'pt-3 mt-3 border-t rule' : ''}`}>
                <div className="w-[120px] shrink-0 t-xs muted tabular">
                  {monthYear(e.start_date)} to {e.end_date ? monthYear(e.end_date) : 'present'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="t-sm font-medium">{e.job_title}</div>
                  <div className="t-xs ink-2">{e.employer}</div>
                </div>
                <Provenance source={e.source} />
              </div>
            ))}
          </Panel>
        )}

        {data.qualifications && (
          <Panel>
            <Heading>Qualifications</Heading>
            <Table
              columns={[{ key: 'q', label: 'Award' }, { key: 'i', label: 'Institution' },
                        { key: 'w', label: 'Conferred' }, { key: 's', label: 'Source' }]}
              rows={data.qualifications.map((q: any) => ({
                q: <span className="font-medium">{q.qualification}</span>, i: q.institution,
                w: <span className="tabular">{monthYear(q.conferred_on)}</span>, s: <Provenance source={q.source} />,
              }))} />
          </Panel>
        )}

        {data.certifications && (
          <Panel>
            <Heading>Certifications</Heading>
            <Table
              columns={[{ key: 'n', label: 'Certification' }, { key: 'i', label: 'Issuer' },
                        { key: 'w', label: 'Issued' }, { key: 's', label: 'Source' }]}
              rows={data.certifications.map((c: any) => ({
                n: <span className="font-medium">{c.name}</span>, i: c.issuer,
                w: <span className="tabular">{monthYear(c.issued_on)}</span>, s: <Provenance source={c.source} />,
              }))}
              empty="No certifications disclosed." />
          </Panel>
        )}

        {data.training && (
          <Panel>
            <Heading>Training in progress</Heading>
            <Table
              columns={[{ key: 'c', label: 'Course' }, { key: 'p', label: 'Provider' }, { key: 's', label: 'Status' }]}
              rows={data.training.map((t: any) => ({
                c: <span className="font-medium">{t.course_title}</span>, p: t.provider,
                s: <Tag tone={t.status === 'completed' ? 'good' : 'accent'}>{t.status}</Tag>,
              }))}
              empty="No training disclosed." />
          </Panel>
        )}

        <p className="t-xs muted text-center pb-4">
          Accesses to this link are logged and shown to the holder. Reference implementation, not
          affiliated with the Government of Singapore.
        </p>
      </main>
    </div>
  );
}
