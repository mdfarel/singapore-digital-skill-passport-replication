import { useEffect, useState } from 'react';
import { get } from '../lib/api';
import { Link } from '../lib/router';
import { Panel, Heading, Figure, Loading, Source, ArrowIcon } from '../components/ui';
import { LineChart } from '../components/charts';
import { num, pct } from '../lib/format';

export function Home() {
  const [meta, setMeta] = useState<any>(null);
  const [headline, setHeadline] = useState<any>(null);
  const [health, setHealth] = useState<any[]>([]);

  useEffect(() => {
    get('/meta').then(setMeta).catch(() => {});
    get('/labour/headline').then(setHeadline).catch(() => {});
    get<any[]>('/authority/sector-health').then(setHealth).catch(() => {});
  }, []);

  if (!meta) return <Loading label="Loading registry" />;

  const latest = (rows: any[]) => (rows && rows.length ? rows[0] : null);
  const trend = (rows: any[]) => (rows ? [...rows].reverse().map((r) => r.value) : []);
  const emp = headline?.EMPRATE_2564?.latest ?? [];
  const jvRate = headline?.JV_RATE?.latest ?? [];
  const ltu = (headline?.LTU_RATE?.latest ?? []).filter((r: any) => String(r.dim1).toLowerCase().includes('resident'));
  const recruit = headline?.RECRUIT_RATE?.latest ?? [];

  const pressure = [...health]
    .filter((s) => s.vacancy_rate != null)
    .sort((a, b) => b.vacancy_rate - a.vacancy_rate)
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-6 items-start">
        <div>
          <h1 className="t-lg font-semibold max-w-[30ch]">
            A national record of individual skill, employment and training attainment
          </h1>
          <p className="t-sm ink-2 mt-3 max-w-[68ch]">
            The passport resolves records held in separate government systems against a single
            competency framework. Employment is drawn from contribution records, academic awards from
            institution records, and training completions from approved providers. Each entry carries
            the source that backs it. Entries added by the holder are retained and marked as
            self-declared. Disclosure is by scoped, revocable link.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            <Link to="/passport" className="btn btn-primary">Open a passport <ArrowIcon /></Link>
            <Link to="/frameworks" className="btn">Framework registry</Link>
            <Link to="/authority" className="btn">Administration</Link>
          </div>
        </div>

        <Panel className="w-full">
          <Heading note="Records held at the current framework revision">Registry composition</Heading>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
            {[
              ['Sector frameworks', meta.counts.sectors],
              ['Job roles', meta.counts.roles],
              ['Technical skills', meta.counts.tscs],
              ['Critical core skills', meta.counts.ccs],
              ['Courses', meta.counts.courses],
              ['Passport holders', meta.counts.persons],
              ['Open vacancies', meta.counts.open_postings],
              ['Labour observations', num(meta.counts.observations)],
            ].map(([k, v]) => (
              <div key={String(k)}>
                <dt className="t-xs muted">{k}</dt>
                <dd className="t-md font-semibold tabular">{v as any}</dd>
              </div>
            ))}
          </dl>
          <Source note={`${num(meta.counts.observations)} labour observations are Ministry of Manpower open data. Course listings, holders and employers are generated.`} />
        </Panel>
      </section>

      <section>
        <Heading note="Latest annual value with the preceding twelve observations. Ministry of Manpower.">
          Labour market indicators
        </Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Figure label="Employment rate, aged 25 to 64"
                  value={latest(emp) ? Number(latest(emp).value).toFixed(1) : 'n/a'} unit="%"
                  note={latest(emp) ? `Year ${latest(emp).period}` : ''} trend={trend(emp)} />
          <Figure label="Job vacancy rate"
                  value={latest(jvRate) ? Number(latest(jvRate).value).toFixed(1) : 'n/a'} unit="%"
                  note={latest(jvRate) ? `Year ${latest(jvRate).period}` : ''} trend={trend(jvRate)} />
          <Figure label="Long-term unemployment rate"
                  value={latest(ltu) ? Number(latest(ltu).value).toFixed(1) : 'n/a'} unit="%"
                  note={latest(ltu) ? `Year ${latest(ltu).period}` : ''} trend={trend(ltu)} />
          <Figure label="Monthly recruitment rate"
                  value={latest(recruit) ? Number(latest(recruit).value).toFixed(2) : 'n/a'} unit="%"
                  note={latest(recruit) ? `Year ${latest(recruit).period}` : ''} trend={trend(recruit)} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <Panel>
          <Heading note="Percent of the resident population aged 15 and over, by sex">
            Labour force participation rate
          </Heading>
          <Participation />
        </Panel>
        <Panel>
          <Heading note="Vacancy rate of the industry each sector is mapped to, latest observation">
            Sectors ranked by vacancy rate
          </Heading>
          <div className="space-y-2">
            {pressure.map((s) => (
              <Link key={s.code} to={`/frameworks/${s.code}`} className="block">
                <div className="flex items-baseline justify-between gap-3 t-sm">
                  <span className="truncate min-w-0">{s.name}</span>
                  <span className="tabular font-medium shrink-0">{pct(s.vacancy_rate, 1)}</span>
                </div>
                <div className="mt-0.5" style={{ background: 'var(--surface-2)', height: 8, borderRadius: 2 }}>
                  <div style={{
                    width: `${Math.min(100, (s.vacancy_rate / (pressure[0]?.vacancy_rate || 1)) * 100)}%`,
                    height: 8, background: 'var(--s1)', borderRadius: '2px 3px 3px 2px',
                  }} />
                </div>
                <div className="t-xs muted mt-0.5">{s.mom_industry}, {s.vacancy_period}</div>
              </Link>
            ))}
          </div>
        </Panel>
      </section>

      <section>
        <Heading note="Four interfaces over one registry">System components</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { to: '/passport', title: 'Passport', body: 'Individual record of skills, employment, qualifications and training, with attainment measured against a target role.' },
            { to: '/frameworks', title: 'Framework registry', body: `${meta.counts.sectors} sector frameworks, ${meta.counts.roles} roles and ${meta.counts.tscs} technical skills on a six-level proficiency scale.` },
            { to: '/jobs', title: 'Vacancies', body: 'Postings expressed as required skills at stated proficiency. Candidates are ranked on skills held.' },
            { to: '/authority', title: 'Administration', body: 'Framework revision status, skill supply against demand, verification rates and funding drawdown.' },
          ].map((c) => (
            <Link key={c.to} to={c.to} className="panel p-3 block hover:border-[color:var(--line-2)]">
              <div className="t-sm font-semibold flex items-center gap-1.5">{c.title} <ArrowIcon /></div>
              <p className="t-xs ink-2 mt-1.5">{c.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Participation() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { get('/labour/series/LFPR_SEX').then(setData).catch(() => {}); }, []);
  if (!data) return <Loading />;
  const byDim = new Map<string, { x: string; y: number }[]>();
  for (const o of data.observations) {
    const k = o.dim1 ?? 'Total';
    if (!byDim.has(k)) byDim.set(k, []);
    byDim.get(k)!.push({ x: o.period, y: o.value });
  }
  const series = [...byDim.entries()].map(([name, points]) => ({ name, points }));
  const periods = data.observations.map((o: any) => o.period).sort();
  return (
    <>
      <LineChart series={series} unit="%" format={(v) => v.toFixed(0)} height={200} />
      <Source agency={data.series.agency} dataset={data.series.dataset_id} url={data.series.source_url}
              coverage={`${periods[0]} to ${periods[periods.length - 1]}`}
              note={`${num(data.series.rows)} observations.`} />
    </>
  );
}
