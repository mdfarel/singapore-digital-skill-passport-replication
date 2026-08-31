import { useMemo, useState } from 'react';

const SERIES = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)', 'var(--s6)', 'var(--s7)', 'var(--s8)'];
const RAMP = ['var(--r1)', 'var(--r2)', 'var(--r3)', 'var(--r4)', 'var(--r5)', 'var(--r6)'];

export interface Point { x: string; y: number | null }
export interface Series { name: string; points: Point[] }

function niceTicks(min: number, max: number, count = 4) {
  if (min === max) return [min];
  const span = max - min;
  const step = Math.pow(10, Math.floor(Math.log10(span / count)));
  const err = (span / count) / step;
  const mult = err >= 7.5 ? 10 : err >= 3 ? 5 : err >= 1.5 ? 2 : 1;
  const s = step * mult;
  const lo = Math.floor(min / s) * s;
  const hi = Math.ceil(max / s) * s;
  const out: number[] = [];
  for (let v = lo; v <= hi + s / 2; v += s) out.push(Number(v.toFixed(10)));
  return out;
}

/**
 * Time series on a single value axis. Two measures of different scale are drawn
 * as two charts rather than on a second axis.
 */
export function LineChart({
  series, height = 200, unit = '', format = (v: number) => String(v), yZero = false,
}: {
  series: Series[]; height?: number; unit?: string; format?: (v: number) => string; yZero?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const xs = useMemo(() => {
    const set = new Set<string>();
    series.forEach((s) => s.points.forEach((p) => set.add(p.x)));
    return [...set].sort();
  }, [series]);

  const values = series.flatMap((s) => s.points.map((p) => p.y)).filter((v): v is number => v != null);
  if (!xs.length || !values.length) {
    return <div className="t-sm muted py-8 text-center">No observations.</div>;
  }
  const ticks = niceTicks(yZero ? 0 : Math.min(...values), Math.max(...values));
  const yMin = Math.min(...ticks);
  const yMax = Math.max(...ticks);

  const W = 760, H = height, padL = 52, padR = 14, padT = 10, padB = 24;
  const iw = W - padL - padR, ih = H - padT - padB;
  const px = (i: number) => padL + (xs.length === 1 ? iw / 2 : (i / (xs.length - 1)) * iw);
  const py = (v: number) => padT + ih - ((v - yMin) / (yMax - yMin || 1)) * ih;
  const step = Math.max(1, Math.ceil(xs.length / 8));

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((rel - padL) / iw) * (xs.length - 1));
    setHover(i >= 0 && i < xs.length ? i : null);
  };

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img"
           aria-label={series.map((s) => s.name).join(', ')}
           onMouseMove={onMove} onMouseLeave={() => setHover(null)}
           style={{ display: 'block', touchAction: 'none' }}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={py(t)} y2={py(t)} stroke="var(--line)" strokeWidth="1" />
            <text x={padL - 8} y={py(t) + 4} textAnchor="end" fontSize="11" fill="var(--muted)" className="tabular">
              {format(t)}
            </text>
          </g>
        ))}
        {(() => {
          const last = xs.length - 1;
          const idx = new Set<number>();
          for (let i = 0; i <= last; i += step) idx.add(i);
          const prior = Math.max(...idx);
          if (last - prior < Math.ceil(step / 2)) idx.delete(prior);
          idx.add(last);
          return [...idx].sort((a, b) => a - b).map((i) => (
            <text key={xs[i]} x={px(i)} y={H - 7} textAnchor="middle" fontSize="11"
                  fill="var(--muted)" className="tabular">{xs[i]}</text>
          ));
        })()}
        {series.map((s, si) => {
          const pts = xs.map((x, i) => {
            const p = s.points.find((q) => q.x === x);
            return p && p.y != null ? `${px(i)},${py(p.y)}` : null;
          });
          const segments: string[] = [];
          let cur: string[] = [];
          for (const p of pts) { if (p) cur.push(p); else if (cur.length) { segments.push(cur.join(' ')); cur = []; } }
          if (cur.length) segments.push(cur.join(' '));
          return (
            <g key={s.name}>
              {segments.map((seg, k) => (
                <polyline key={k} points={seg} fill="none" stroke={SERIES[si % 8]} strokeWidth="2"
                          strokeLinejoin="round" strokeLinecap="round" />
              ))}
            </g>
          );
        })}
        {hover != null && (
          <g>
            <line x1={px(hover)} x2={px(hover)} y1={padT} y2={padT + ih} stroke="var(--line-2)" strokeWidth="1" />
            {series.map((s, si) => {
              const p = s.points.find((q) => q.x === xs[hover]);
              if (!p || p.y == null) return null;
              return <circle key={s.name} cx={px(hover)} cy={py(p.y)} r="4" fill={SERIES[si % 8]}
                             stroke="var(--surface)" strokeWidth="2" />;
            })}
          </g>
        )}
        <line x1={padL} x2={W - padR} y1={padT + ih} y2={padT + ih} stroke="var(--line-2)" strokeWidth="1" />
      </svg>

      {hover != null && (
        <div className="pointer-events-none absolute top-0 rounded px-2 py-1.5 t-xs"
             style={{
               left: `calc(${(px(hover) / W) * 100}% + ${px(hover) / W > 0.6 ? -140 : 10}px)`,
               background: 'var(--surface)', border: '1px solid var(--line-2)', minWidth: 120,
             }}>
          <div className="font-medium tabular">{xs[hover]}</div>
          {series.map((s, si) => {
            const p = s.points.find((q) => q.x === xs[hover]);
            return (
              <div key={s.name} className="flex items-center justify-between gap-3 mt-0.5">
                <span className="flex items-center gap-1.5 ink-2">
                  <span style={{ width: 7, height: 7, borderRadius: 1, background: SERIES[si % 8], display: 'inline-block' }} />
                  {s.name}
                </span>
                <span className="tabular font-medium">{p?.y != null ? `${format(p.y)}${unit}` : 'n/a'}</span>
              </div>
            );
          })}
        </div>
      )}

      {series.length > 1 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 t-xs ink-2">
          {series.map((s, si) => (
            <span key={s.name} className="flex items-center gap-1.5">
              <span style={{ width: 10, height: 2, background: SERIES[si % 8], display: 'inline-block' }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Ranked magnitude. Values are labelled directly, so colour is not load-bearing. */
export function BarChart({
  rows, format = (v: number) => String(v), max, color = 'var(--s1)', height = 18,
}: {
  rows: { label: string; value: number; note?: string }[];
  format?: (v: number) => string; max?: number; color?: string; height?: number;
}) {
  const top = max ?? Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="space-y-1.5">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex items-baseline justify-between gap-3 t-sm">
            <span className="truncate min-w-0 ink-2">{r.label}</span>
            <span className="tabular font-medium shrink-0">{format(r.value)}</span>
          </div>
          <div className="mt-0.5" style={{ background: 'var(--surface-2)', height, borderRadius: 2 }}>
            <div style={{
              width: `${Math.max(1.5, (r.value / top) * 100)}%`, height,
              background: color, borderRadius: '2px 3px 3px 2px',
            }} />
          </div>
          {r.note && <div className="t-xs muted mt-0.5">{r.note}</div>}
        </div>
      ))}
    </div>
  );
}

/**
 * Proficiency scale. Attained level is filled from a single-hue ordinal ramp;
 * a required level, where one applies, is marked on the scale rather than
 * encoded by a second colour.
 */
export function Scale({ level, max = 6, required, size = 'md' }: {
  level: number; max?: number; required?: number; size?: 'sm' | 'md';
}) {
  const w = size === 'sm' ? 11 : 16;
  const h = size === 'sm' ? 6 : 8;
  return (
    <span className="inline-flex flex-col items-start" role="img"
          aria-label={`Level ${level} of ${max}${required ? `, required ${required}` : ''}`}>
      <span className="inline-flex items-center gap-[3px]">
        {Array.from({ length: max }, (_, i) => (
          <span key={i} style={{
            width: w, height: h, borderRadius: 1, display: 'inline-block',
            background: i < level ? RAMP[Math.min(i, RAMP.length - 1)] : 'transparent',
            border: i < level ? 'none' : '1px solid var(--line-2)',
          }} />
        ))}
      </span>
      {required != null && required > 0 && (
        <span className="inline-flex items-center gap-[3px]" style={{ height: 5, marginTop: 1 }}>
          {Array.from({ length: max }, (_, i) => (
            <span key={i} style={{ width: w, display: 'inline-block', textAlign: 'center', lineHeight: 0 }}>
              {i === required - 1 && (
                <svg width="7" height="4" viewBox="0 0 7 4" aria-hidden="true">
                  <path d="M3.5 0 7 4H0z" fill="var(--ink-2)" />
                </svg>
              )}
            </span>
          ))}
        </span>
      )}
    </span>
  );
}

export function Sparkline({ values, width = 76, height = 22, color = 'var(--s1)' }: {
  values: number[]; width?: number; height?: number; color?: string;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values), max = Math.max(...values);
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - 2) + 1;
    const y = height - 2 - ((v - min) / (max - min || 1)) * (height - 4);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Composition across a small ordered set. */
export function Composition({ segments, height = 10 }: {
  segments: { label: string; value: number; color: string }[]; height?: number;
}) {
  const total = segments.reduce((n, s) => n + s.value, 0) || 1;
  return (
    <div className="flex gap-[2px] w-full" style={{ height }}>
      {segments.filter((s) => s.value > 0).map((s) => (
        <div key={s.label} title={`${s.label}: ${s.value}`}
             style={{ width: `${(s.value / total) * 100}%`, background: s.color, borderRadius: 2 }} />
      ))}
    </div>
  );
}
