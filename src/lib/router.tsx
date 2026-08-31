import type { CSSProperties } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface RouterValue {
  path: string;
  query: URLSearchParams;
  go: (to: string, opts?: { replace?: boolean }) => void;
}

const Ctx = createContext<RouterValue>({ path: '/', query: new URLSearchParams(), go: () => {} });

export function RouterProvider({ children }: { children: ReactNode }) {
  const [url, setUrl] = useState(() => window.location.pathname + window.location.search);

  useEffect(() => {
    const onPop = () => setUrl(window.location.pathname + window.location.search);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const go = useCallback((to: string, opts?: { replace?: boolean }) => {
    if (to === window.location.pathname + window.location.search) return;
    window.history[opts?.replace ? 'replaceState' : 'pushState']({}, '', to);
    setUrl(to);
    window.scrollTo({ top: 0 });
  }, []);

  const value = useMemo(() => {
    const [path, search = ''] = url.split('?');
    return { path, query: new URLSearchParams(search), go };
  }, [url, go]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useRouter = () => useContext(Ctx);

export function Link({ to, className, children, title, style }: {
  to: string; className?: string; children: ReactNode; title?: string; style?: CSSProperties;
}) {
  const { go } = useRouter();
  return (
    <a
      href={to}
      title={title}
      className={className}
      style={style}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(to);
      }}
    >
      {children}
    </a>
  );
}

/** Matches '/roles/:code' style patterns and returns the captured params. */
export function match(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split('/').filter(Boolean);
  const s = path.split('/').filter(Boolean);
  if (p.length !== s.length) return null;
  const out: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) out[p[i].slice(1)] = decodeURIComponent(s[i]);
    else if (p[i] !== s[i]) return null;
  }
  return out;
}
