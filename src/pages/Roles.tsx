import { useEffect, useState } from 'react';
import { get } from '../lib/api';
import { Link } from '../lib/router';
import { Trail, Panel, Heading, Table, Empty, Loading, Tag, ArrowIcon } from '../components/ui';
import { Scale } from '../components/charts';
import { money, date } from '../lib/format';

const CRIT: Record<string, string> = { core: 'accent', important: 'attention', useful: 'neutral' };
const BANDS = ['Basic', 'Intermediate', 'Advanced'];

export function RoleDetail({ code, personId }: { code: string; personId: number }) {
  const [data, setData] = useState<any>(null);
  const [gap, setGap] = useState<any>(null);

  useEffect(() => {
    setData(null); setGap(null);
    get(`/registry/roles/${code}`).then(setData).catch(() => setData({ error: true }));
    get(`/passport/${personId}/gap?target=${code}`).then(setGap).catch(() => {});
  }, [code, personId]);

  if (!data) return <Loading />;
  if (data.error) return <Empty>No role at this code.</Empty>;
  const r = data.role;
  const held = new Map<string, number>((gap?.tsc ?? []).map((t: any) => [t.code, t.held_level]));

  return (
    <div className="space-y-4">
      <Trail items={[
        { label: 'Frameworks', to: '/frameworks' },
        { label: r.sector_name, to: `/frameworks/${r.sector_code}` },
        { label: r.title },
      ]} />

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="t-lg font-semibold">{r.title}</h1>
              <Tag>{r.band}</Tag>
              <Tag tone="accent">{r.track}</Tag>
            </div>
            <p className="t-sm ink-2 mt-1.5">{r.description}</p>
            <dl className="flex flex-wrap gap-x-6 gap-y-1 mt-3 t-xs muted">
              <span><dt className="inline">Code </dt><dd className="inline tabular">{r.code}</dd></span>
              <span><dt className="inline">SSOC </dt><dd className="inline tabular">{r.ssoc}</dd></span>
              <span><dt className="inline">Demand index </dt><dd className="inline tabular">{r.demand_index} of 100</dd></span>
            </dl>
          </div>
          <div className="text-right shrink-0">
            <div className="t-xs muted">Monthly gross, modelled</div>
            <div className="t-md font-semibold tabular">{money(r.pay_median)}</div>
            <div className="t-xs muted tabular">{money(r.pay_p25)} to {money(r.pay_p75)}</div>
          </div>
        </div>

        {gap && (
          <div className="mt-4 pt-3 border-t rule flex flex-wrap items-center gap-3">
            <span className="t-md font-semibold tabular" style={{ color: 'var(--accent)' }}>{gap.readiness}%</span>
            <span className="t-sm ink-2">attainment on the passport currently open</span>
            <Link to={`/passport/${personId}?tab=attainment`} className="btn ml-auto">
              Shortfall and training <ArrowIcon />
            </Link>
          </div>
        )}
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-4 items-start">
        <Panel>
          <Heading note="Filled steps are the level attained on the open passport. The marker is the level this role requires.">
            Technical requirements
          </Heading>
          <div className="space-y-3">
            {data.tscs.map((t: any) => (
              <div key={t.code}>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <Link to={`/skills/${t.code}`} className="t-sm font-medium min-w-0 truncate hover:underline">{t.title}</Link>
                  <span className="flex items-center gap-2 shrink-0">
                    <Tag tone={CRIT[t.criticality]}>{t.criticality}</Tag>
                    <Scale level={held.get(t.code) ?? 0} max={6} required={t.required_level} size="sm" />
                    <span className="t-xs tabular muted w-7 text-right">L{t.required_level}</span>
                  </span>
                </div>
                <p className="t-xs muted mt-0.5">{t.level_descriptor}</p>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <Heading note="Emphasised skills sit one band above the role baseline">Critical core skills</Heading>
            <div className="space-y-2">
              {data.ccs.filter((c: any) => c.emphasis).map((c: any) => (
                <div key={c.code}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="t-sm font-medium">{c.title}</span>
                    <span className="flex items-center gap-2">
                      <Scale level={c.required_band} max={3} size="sm" />
                      <span className="t-xs muted w-[58px] text-right">{BANDS[c.required_band - 1]}</span>
                    </span>
                  </div>
                  <p className="t-xs muted">{c.band_descriptor}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t rule">
              <h3 className="t-xs muted mb-1.5">Baseline, remaining skills</h3>
              <div className="flex flex-wrap gap-1">
                {data.ccs.filter((c: any) => !c.emphasis).map((c: any) => (
                  <Tag key={c.code}>{c.title}, {BANDS[c.required_band - 1]}</Tag>
                ))}
              </div>
            </div>
          </Panel>

          <Panel>
            <Heading note="Transfer combines technical requirements met with core-skill overlap. Steps sideways or one band up only.">
              Onward transitions
            </Heading>
            {!data.pathways.length && <Empty>No transition clears the transfer threshold.</Empty>}
            <div className="space-y-1.5">
              {data.pathways.slice(0, 8).map((p: any) => (
                <Link key={p.code} to={`/roles/${p.code}`} className="flex items-center gap-2 t-sm">
                  <Tag tone={p.kind === 'vertical' ? 'good' : p.kind === 'cross-sector' ? 'accent' : 'neutral'}>{p.kind}</Tag>
                  <span className="flex-1 min-w-0 truncate hover:underline">{p.title}</span>
                  <span className="t-xs muted truncate max-w-[88px]">{p.sector_name}</span>
                  <span className="tabular font-medium w-9 text-right">{p.overlap_pct}%</span>
                </Link>
              ))}
            </div>
          </Panel>

          {data.inbound.length > 0 && (
            <Panel>
              <Heading note="Roles whose skill set transfers into this one">Feeder roles</Heading>
              <div className="space-y-1">
                {data.inbound.map((p: any) => (
                  <Link key={p.code} to={`/roles/${p.code}`} className="flex items-center gap-2 t-sm">
                    <span className="flex-1 min-w-0 truncate hover:underline">{p.title}</span>
                    <span className="t-xs muted truncate max-w-[96px]">{p.sector_name}</span>
                    <span className="tabular w-9 text-right muted">{p.overlap_pct}%</span>
                  </Link>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>

      {data.postings.length > 0 && (
        <Panel>
          <Heading note="Open postings mapped to this framework role">Vacancies</Heading>
          <Table
            columns={[{ key: 'title', label: 'Posting' }, { key: 'employer', label: 'Employer' },
                      { key: 'pay', label: 'Monthly gross', align: 'right' }, { key: 'loc', label: 'Location' },
                      { key: 'posted', label: 'Posted' }]}
            rows={data.postings.map((p: any) => ({
              title: <Link to={`/jobs/${p.ref}`} className="font-medium hover:underline">{p.title}</Link>,
              employer: p.employer,
              pay: <span className="tabular">{money(p.pay_min)} to {money(p.pay_max)}</span>,
              loc: <span className="muted">{p.location}</span>,
              posted: <span className="tabular muted">{date(p.posted_on)}</span>,
            }))}
          />
        </Panel>
      )}
    </div>
  );
}
