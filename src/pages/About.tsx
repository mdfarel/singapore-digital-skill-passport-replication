import { useEffect, useState } from 'react';
import { get } from '../lib/api';
import { Panel, Heading, Table, Loading, Tag } from '../components/ui';
import { num } from '../lib/format';

const TONE: Record<string, string> = {
  'real open data': 'good',
  'modelled on published structure': 'accent',
  synthetic: 'attention',
};

export function About() {
  const [meta, setMeta] = useState<any>(null);
  const [series, setSeries] = useState<any[]>([]);
  useEffect(() => {
    get('/meta').then(setMeta).catch(() => {});
    get<any[]>('/labour/series').then(setSeries).catch(() => {});
  }, []);
  if (!meta) return <Loading />;

  return (
    <div className="space-y-4 max-w-[880px]">
      <div>
        <h1 className="t-lg font-semibold">Sources and provenance</h1>
        <p className="t-sm ink-2 mt-1.5">{meta.note} It models {meta.modelledOn}</p>
      </div>

      <Panel>
        <Heading note="Status of each dataset in the implementation">Datasets</Heading>
        <Table
          columns={[{ key: 'd', label: 'Dataset' }, { key: 's', label: 'Source' }, { key: 'st', label: 'Status' }]}
          rows={meta.provenance.map((p: any) => ({
            d: <span className="font-medium">{p.dataset}</span>,
            s: <span className="ink-2">{p.source}</span>,
            st: <Tag tone={TONE[p.status] ?? 'neutral'}>{p.status}</Tag>,
          }))}
        />
        <dl className="mt-4 pt-3 border-t rule space-y-3 t-sm ink-2">
          <div>
            <dt className="font-semibold" style={{ color: 'var(--ink)' }}>Labour market series</dt>
            <dd className="mt-0.5">
              {num(meta.counts.observations)} observations across {meta.counts.series} series, retrieved
              from the Ministry of Manpower open datasets on data.gov.sg and loaded without alteration.
              Values suppressed at source are dropped rather than imputed. Each sector is mapped to the
              corresponding industry label, which allows a sector page to report that industry's own
              vacancy and retrenchment history.
            </dd>
          </div>
          <div>
            <dt className="font-semibold" style={{ color: 'var(--ink)' }}>Skills framework</dt>
            <dd className="mt-0.5">
              The structure follows the published SkillsFuture Skills Frameworks: sector frameworks,
              technical skills on a six-level scale, and sixteen critical core skills in three clusters
              at three bands. The specific skills, roles and proficiency descriptors in this
              implementation were written for it and are not the official framework text.
            </dd>
          </div>
          <div>
            <dt className="font-semibold" style={{ color: 'var(--ink)' }}>Holders, employers and courses</dt>
            <dd className="mt-0.5">
              Generated. Person records are constructed backwards from a current role so that employment
              history, qualifications, training and skill claims are mutually consistent. No real
              individual, company or course listing is represented.
            </dd>
          </div>
          <div>
            <dt className="font-semibold" style={{ color: 'var(--ink)' }}>Pay figures and demand index</dt>
            <dd className="mt-0.5">
              Modelled planning figures included to make role comparison legible. They are not wage
              statistics and should not be read as such.
            </dd>
          </div>
        </dl>
      </Panel>

      <Panel>
        <Heading note="Sources consulted for the structure of the registry. No text was copied from them.">
          Framework reference sources
        </Heading>
        <Table
          columns={[{ key: 'title', label: 'Source' }, { key: 'pub', label: 'Publisher' }, { key: 'used', label: 'Used for' }]}
          rows={(meta.references ?? []).map((r: any) => ({
            title: <a href={r.url} target="_blank" rel="noreferrer" className="font-medium underline">{r.title}</a>,
            pub: <span className="t-xs muted">{r.publisher}</span>,
            used: <span className="t-xs ink-2">{r.used}</span>,
          }))}
          empty="No reference sources recorded."
        />
      </Panel>

      <Panel>
        <Heading note="How the labour market data was retrieved">Retrieval method</Heading>
        <dl className="t-sm space-y-2">
          <div>
            <dt className="t-xs muted">Catalogue endpoint</dt>
            <dd className="tabular break-all">{meta.retrieval?.catalogue}</dd>
          </div>
          <div>
            <dt className="t-xs muted">Records endpoint</dt>
            <dd className="tabular break-all">{meta.retrieval?.records}</dd>
          </div>
        </dl>
        <p className="t-xs muted mt-3">{meta.retrieval?.note}</p>
      </Panel>

      <Panel>
        <Heading note="Known limits of the data and how they were handled">Limitations</Heading>
        <ul className="t-sm ink-2 space-y-2">
          {(meta.limitations ?? []).map((l: string) => (
            <li key={l} className="flex gap-2">
              <span className="shrink-0" style={{ color: 'var(--accent)' }}>&bull;</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <Heading note="Every series loaded, with a link to the source dataset">Labour market datasets</Heading>
        <Table
          columns={[{ key: 't', label: 'Series' }, { key: 'u', label: 'Unit' },
                    { key: 'n', label: 'Observations', align: 'right' }, { key: 'id', label: 'Dataset' }]}
          rows={series.map((s) => ({
            t: <span className="font-medium">{s.title}</span>,
            u: <span className="muted t-xs">{s.unit}</span>,
            n: <span className="tabular">{num(s.rows)}</span>,
            id: <a href={s.source_url} target="_blank" rel="noreferrer" className="tabular t-xs underline muted">{s.dataset_id}</a>,
          }))}
        />
      </Panel>

      <Panel>
        <Heading note="The system this implementation models">Institutional context</Heading>
        <div className="t-sm ink-2 space-y-3">
          <p>
            The Careers and Skills Passport is hosted on the MySkillsFuture portal and accessed with
            Singpass. It assembles skills, employment, academic qualifications and professional
            certifications, drawing verified entries from government sources: contribution-backed
            employment records, academic records, and completions recorded by approved training
            providers. Freelance work, self-taught skills and external certifications are retained
            without a verification mark. The record is private by default and disclosed through links
            the holder scopes.
          </p>
          <p>
            Stewardship sits with the Skills and Workforce Development Agency, formed on 1 July 2026
            from the merger of SkillsFuture Singapore and Workforce Singapore, overseen jointly by the
            Ministry of Manpower and the Ministry of Education.
          </p>
        </div>
      </Panel>
    </div>
  );
}
