import { useEffect, useState } from 'react';
import { Link, match, useRouter } from './lib/router';
import { get, post } from './lib/api';
import { Home } from './pages/Home';
import { PassportPage } from './pages/Passport';
import { Frameworks, SectorDetail } from './pages/Frameworks';
import { RoleDetail } from './pages/Roles';
import { SkillsPage, SkillDetail, CriticalCore } from './pages/Skills';
import { CoursesPage, CourseDetail } from './pages/Courses';
import { JobsPage, JobDetail } from './pages/Jobs';
import { Authority } from './pages/Authority';
import { SharedPassport } from './pages/Share';
import { About } from './pages/About';

const NAV = [
  { to: '/passport', label: 'Passport' },
  { to: '/frameworks', label: 'Frameworks' },
  { to: '/skills', label: 'Skills' },
  { to: '/courses', label: 'Training' },
  { to: '/jobs', label: 'Vacancies' },
  { to: '/authority', label: 'Administration' },
];

interface Session { authenticated: boolean; person?: { id: number; name: string; ref: string } }

export function App() {
  const { path } = useRouter();
  const [session, setSession] = useState<Session>({ authenticated: false });
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('sp-theme') || 'system');

  useEffect(() => {
    if (theme === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('sp-theme', theme); } catch { /* storage unavailable */ }
  }, [theme]);

  const refresh = () => get<Session>('/auth/me').then(setSession).catch(() => setSession({ authenticated: false }));
  useEffect(() => {
    get<Session>('/auth/me')
      .then((s) => (s.authenticated ? setSession(s) : post<{ id: number }>('/auth/login', { personId: 1 }).then(refresh)))
      .catch(() => {});
  }, []);

  const shared = match('/share/:token', path);
  if (shared) return <SharedPassport token={shared.token} />;

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-30 border-b rule"
              style={{ background: 'color-mix(in oklab, var(--plane) 92%, transparent)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-[1180px] mx-auto px-4 h-12 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0 min-w-0">
            <Mark />
            <span className="t-sm font-semibold truncate" style={{ letterSpacing: '-0.01em' }}>
              Skills Passport
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-4 ml-2 min-w-0 overflow-x-auto scroll-x">
            {NAV.map((n) => {
              const on = path === n.to || path.startsWith(n.to + '/');
              return (
                <Link key={n.to} to={n.to} className="t-sm whitespace-nowrap py-1"
                      style={{ color: on ? 'var(--ink)' : 'var(--muted)', fontWeight: on ? 600 : 400 }}>
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2 min-w-0 flex-1 sm:flex-none justify-end">
            <SearchBox />
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
                    title={`Theme: ${theme}`} aria-label={`Theme: ${theme}`}
                    className="w-7 h-7 rounded grid place-items-center shrink-0 hover:bg-[color:var(--surface-2)]">
              <ThemeIcon mode={theme} />
            </button>
            {session.person && (
              <Link to="/passport" className="hidden xl:block t-xs tabular muted whitespace-nowrap hover:text-[color:var(--ink)]">
                {session.person.ref}
              </Link>
            )}
          </div>
        </div>
        <div className="lg:hidden border-t rule overflow-x-auto scroll-x">
          <div className="flex gap-4 px-4 py-1.5">
            {NAV.map((n) => {
              const on = path === n.to || path.startsWith(n.to + '/');
              return (
                <Link key={n.to} to={n.to} className="t-xs whitespace-nowrap"
                      style={{ color: on ? 'var(--ink)' : 'var(--muted)', fontWeight: on ? 600 : 400 }}>
                  {n.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1180px] w-full mx-auto px-4 py-6">
        <Routes path={path} session={session} onSession={refresh} />
      </main>

      <footer className="border-t rule mt-8">
        <div className="max-w-[1180px] mx-auto px-4 py-5 t-xs muted flex flex-wrap gap-x-6 gap-y-2 justify-between">
          <span>
            Reference implementation. Not affiliated with, endorsed by, or operated by the Government of Singapore.
          </span>
          <Link to="/about" className="underline hover:text-[color:var(--ink)]">Sources and provenance</Link>
        </div>
      </footer>
    </div>
  );
}

function Routes({ path, session, onSession }: { path: string; session: Session; onSession: () => void }) {
  let m;
  if (path === '/') return <Home />;
  if (path === '/passport') return <PassportPage personId={session.person?.id ?? 1} onSwitch={onSession} />;
  if ((m = match('/passport/:id', path))) return <PassportPage personId={Number(m.id)} onSwitch={onSession} />;
  if (path === '/frameworks') return <Frameworks />;
  if ((m = match('/frameworks/:code', path))) return <SectorDetail code={m.code} />;
  if ((m = match('/roles/:code', path))) return <RoleDetail code={m.code} personId={session.person?.id ?? 1} />;
  if (path === '/skills') return <SkillsPage />;
  if (path === '/skills/critical-core') return <CriticalCore />;
  if ((m = match('/skills/:code', path))) return <SkillDetail code={m.code} />;
  if (path === '/courses') return <CoursesPage />;
  if ((m = match('/courses/:code', path))) return <CourseDetail code={m.code} />;
  if (path === '/jobs') return <JobsPage />;
  if ((m = match('/jobs/:ref', path))) return <JobDetail refId={m.ref} />;
  if (path === '/authority') return <Authority />;
  if (path === '/about') return <About />;
  return (
    <div className="py-20 text-center">
      <p className="t-md font-semibold">No page at this address</p>
      <p className="t-sm muted mt-1"><Link to="/" className="underline">Return to the system overview</Link></p>
    </div>
  );
}

function SearchBox() {
  const { go } = useRouter();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [res, setRes] = useState<any>(null);

  useEffect(() => {
    if (q.length < 2) { setRes(null); return; }
    const t = setTimeout(() => { get(`/search?q=${encodeURIComponent(q)}`).then(setRes).catch(() => {}); }, 160);
    return () => clearTimeout(t);
  }, [q]);

  const groups = res ? [
    { label: 'Roles', items: (res.roles ?? []).map((r: any) => ({ label: r.title, note: r.sector_name, to: `/roles/${r.code}` })) },
    { label: 'Skills', items: (res.skills ?? []).map((r: any) => ({ label: r.title, note: r.code, to: `/skills/${r.code}` })) },
    { label: 'Sectors', items: (res.sectors ?? []).map((r: any) => ({ label: r.name, note: r.code, to: `/frameworks/${r.code}` })) },
    { label: 'Courses', items: (res.courses ?? []).map((r: any) => ({ label: r.title, note: r.provider, to: `/courses/${r.code}` })) },
  ].filter((g) => g.items.length) : [];

  return (
    <div className="relative min-w-0 flex-1 sm:flex-none">
      <input value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }}
             onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 160)}
             placeholder="Search registry" aria-label="Search the registry"
             className="field w-full sm:w-[160px] lg:w-[190px] xl:w-[220px]" />
      {open && groups.length > 0 && (
        <div className="absolute right-0 top-9 w-[300px] panel p-1.5 z-50 max-h-[60vh] overflow-y-auto"
             style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}>
          {groups.map((g) => (
            <div key={g.label} className="mb-1 last:mb-0">
              <div className="t-xs muted px-2 py-1">{g.label}</div>
              {g.items.map((it: any) => (
                <button key={it.to} onMouseDown={() => { go(it.to); setQ(''); setOpen(false); }}
                        className="w-full text-left px-2 py-1 rounded hover:bg-[color:var(--surface-2)]">
                  <div className="t-sm truncate">{it.label}</div>
                  <div className="t-xs muted truncate">{it.note}</div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Mark() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="1.5" y="3.5" width="17" height="13" rx="1.5" stroke="var(--accent)" strokeWidth="1.6" />
      <path d="M5 8h4M5 11h4M12 8h3M12 11h3M5 14h10" stroke="var(--accent-2)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ThemeIcon({ mode }: { mode: string }) {
  if (mode === 'dark') return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 9.6A5.6 5.6 0 0 1 6.4 3a5.6 5.6 0 1 0 6.6 6.6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>;
  if (mode === 'light') return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" /><path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.9 3.1l-1.1 1.1M4.2 11.8l-1.1 1.1M12.9 12.9l-1.1-1.1M4.2 4.2 3.1 3.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>;
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" /><path d="M8 2a6 6 0 0 1 0 12Z" fill="currentColor" /></svg>;
}
