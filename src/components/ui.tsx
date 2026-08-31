import type { ReactNode } from 'react';
import { Link } from '../lib/router';
import { Sparkline } from './charts';

export function Panel({ children, className = '', pad = true }: {
  children: ReactNode; className?: string; pad?: boolean;
}) {
  return <section className={`panel ${pad ? 'p-4' : ''} ${className}`}>{children}</section>;
}

/**
 * Section heading. The optional note line carries a definition, a unit or a
 * source, never commentary.
 */
export function Heading({ children, note, action }: {
  children: ReactNode; note?: ReactNode; action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-3">
      <div className="min-w-0">
        <h2 className="t-md font-semibold">{children}</h2>
        {note && <p className="t-xs muted mt-1">{note}</p>}
      </div>
      {action}
    </div>
  );
}

const TONES: Record<string, { bg: string; fg: string }> = {
  neutral: { bg: 'var(--surface-2)', fg: 'var(--ink-2)' },
  accent: { bg: 'var(--accent-wash)', fg: 'var(--accent)' },
  good: { bg: 'color-mix(in oklab, var(--good) 13%, transparent)', fg: 'color-mix(in oklab, var(--good) 76%, var(--ink))' },
  attention: { bg: 'color-mix(in oklab, var(--attention) 20%, transparent)', fg: 'color-mix(in oklab, var(--attention) 52%, var(--ink))' },
};

export function Tag({ children, tone = 'neutral', icon, title }: {
  children: ReactNode; tone?: keyof typeof TONES | string; icon?: ReactNode; title?: string;
}) {
  const t = TONES[tone] ?? TONES.neutral;
  return (
    <span title={title}
          className="inline-flex items-center gap-1 rounded px-1.5 py-px t-xs font-medium whitespace-nowrap"
          style={{ background: t.bg, color: t.fg }}>
      {icon}{children}
    </span>
  );
}

const PROVENANCE: Record<string, { label: string; tone: string; verified: boolean }> = {
  cpf: { label: 'CPF record', tone: 'good', verified: true },
  moe: { label: 'MOE record', tone: 'good', verified: true },
  'training-provider': { label: 'Provider record', tone: 'good', verified: true },
  institution: { label: 'Institution record', tone: 'good', verified: true },
  issuer: { label: 'Issuer record', tone: 'good', verified: true },
  verified: { label: 'Verified', tone: 'good', verified: true },
  assessed: { label: 'Assessed', tone: 'good', verified: true },
  evidenced: { label: 'Work history', tone: 'accent', verified: false },
  self: { label: 'Self-declared', tone: 'neutral', verified: false },
  'self-declared': { label: 'Self-declared', tone: 'neutral', verified: false },
};

/** Every record states the source that backs it. Colour never carries this alone. */
export function Provenance({ source, at }: { source?: string | null; at?: string | null }) {
  const p = PROVENANCE[String(source ?? 'self')] ?? PROVENANCE.self;
  return (
    <Tag tone={p.tone} title={at ? `Checked ${at}` : undefined}
         icon={p.verified ? <CheckIcon /> : <DotIcon />}>{p.label}</Tag>
  );
}

export function Figure({ label, value, unit, note, trend }: {
  label: string; value: ReactNode; unit?: string; note?: ReactNode; trend?: number[];
}) {
  return (
    <div className="panel p-3">
      <div className="t-xs muted" style={{ minHeight: '2.2em' }}>{label}</div>
      <div className="flex items-end justify-between gap-2 mt-1">
        <div className="t-xl font-semibold tabular">
          {value}{unit && <span className="t-sm font-medium ink-2 ml-0.5">{unit}</span>}
        </div>
        {trend && trend.length > 1 && <Sparkline values={trend} />}
      </div>
      {note && <div className="t-xs muted mt-1">{note}</div>}
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="t-xs muted mt-3">{children}</p>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="t-sm muted py-6 text-center">{children}</div>;
}

export function Loading({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 t-sm muted py-10 justify-center">
      <span className="inline-block w-3 h-3 rounded-full border-2 animate-spin"
            style={{ borderColor: 'var(--line-2)', borderTopColor: 'var(--accent-2)' }} />
      {label}
    </div>
  );
}

export function Tabs({ tabs, active, onChange }: {
  tabs: { id: string; label: string; count?: number }[]; active: string; onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-4 border-b rule overflow-x-auto scroll-x" role="tablist">
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button key={t.id} role="tab" aria-selected={on} onClick={() => onChange(t.id)}
                  className="py-2 t-sm whitespace-nowrap -mb-px border-b-2"
                  style={{
                    borderColor: on ? 'var(--accent)' : 'transparent',
                    color: on ? 'var(--ink)' : 'var(--muted)',
                    fontWeight: on ? 600 : 400,
                  }}>
            {t.label}
            {t.count != null && <span className="ml-1.5 tabular muted">{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function Trail({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="flex items-center gap-1.5 t-xs muted mb-3 flex-wrap">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden>/</span>}
          {it.to ? <Link to={it.to} className="hover:text-[color:var(--ink)]">{it.label}</Link> : <span>{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function Table({ columns, rows, empty = 'No records.' }: {
  columns: { key: string; label: string; align?: 'left' | 'right'; width?: string }[];
  rows: Record<string, ReactNode>[];
  empty?: string;
}) {
  if (!rows.length) return <Empty>{empty}</Empty>;
  return (
    <div className="scroll-x">
      <table className="data">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ width: c.width, textAlign: c.align ?? 'left' }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key} style={{ textAlign: c.align ?? 'left' }}>{r[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Source attribution for a chart or table. Agency, dataset, coverage. */
export function Source({ agency, dataset, url, coverage, note }: {
  agency?: string; dataset?: string; url?: string | null; coverage?: string; note?: string;
}) {
  return (
    <p className="t-xs muted mt-2">
      {agency && <>Source: {agency}. </>}
      {coverage && <>Coverage {coverage}. </>}
      {dataset && (
        <>Dataset <span className="tabular">{dataset}</span>
          {url && <> (<a href={url} target="_blank" rel="noreferrer" className="underline">data.gov.sg</a>)</>}. </>
      )}
      {note}
    </p>
  );
}

export function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6.2 4.8 8.5 9.5 3.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function DotIcon() {
  return <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="2.2" fill="currentColor" /></svg>;
}
export function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
