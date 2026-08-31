export const money = (n: number | null | undefined) =>
  n == null ? 'n/a' : `$${Math.round(n).toLocaleString('en-SG')}`;

export const num = (n: number | null | undefined, digits = 0) =>
  n == null ? 'n/a' : Number(n).toLocaleString('en-SG', { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const pct = (n: number | null | undefined, digits = 0) =>
  n == null ? 'n/a' : `${Number(n).toFixed(digits)}%`;

export const date = (s: string | null | undefined) => {
  if (!s) return 'n/a';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString('en-SG', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const monthYear = (s: string | null | undefined) => {
  if (!s) return 'Present';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString('en-SG', { year: 'numeric', month: 'short' });
};

export const titleCase = (s: string) => s.replace(/\b\w/g, (m) => m.toUpperCase());
