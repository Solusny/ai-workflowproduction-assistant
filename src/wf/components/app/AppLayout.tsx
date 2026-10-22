import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { Bell, LayoutGrid, Menu, Plus, Search, X } from 'lucide-react'
import { FEATURES } from '../../data/features'
import { currentUser } from '../../data/fixtures'
import { Logo } from '../ui/Logo'

const navItem = ({ isActive }: { isActive: boolean }) =>
  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
    isActive ? 'bg-accent text-white shadow-warm' : 'text-muted hover:bg-tint-1 hover:text-ink'
  }`

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-6 pt-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Dashboard">
        <NavLink to="/app" end className={navItem} onClick={onNavigate}>
          <LayoutGrid size={18} strokeWidth={2.3} /> Overview
        </NavLink>
        <p className="px-3 pb-1 pt-5 text-[11px] font-bold tracking-wider text-muted uppercase">AI tools</p>
        {FEATURES.map((f) => (
          <NavLink key={f.id} to={f.path} className={navItem} onClick={onNavigate}>
            <f.icon size={18} strokeWidth={2.3} /> {f.title}
          </NavLink>
        ))}
      </nav>
      <div className="m-3 rounded-2xl border border-tint-2 bg-tint-1 p-4">
        <p className="text-sm font-extrabold text-ink">Weekly streak</p>
        <p className="mt-1 text-xs text-muted">You saved 6.4 hours this week — keep it going.</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
          <div className="h-full w-[72%] rounded-full bg-signature" />
        </div>
      </div>
    </div>
  )
}

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    setOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-page">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-surface lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button className="absolute inset-0 bg-ink/20 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Close navigation" />
          <aside className="absolute inset-y-0 left-0 w-72 animate-fade-up border-r border-line bg-surface shadow-warm-lg">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 rounded-lg p-2 text-muted hover:bg-tint-1" aria-label="Close navigation">
              <X size={18} />
            </button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-line bg-page/80 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <button onClick={() => setOpen(true)} className="rounded-xl p-2 text-ink hover:bg-tint-1 lg:hidden" aria-label="Open navigation">
              <Menu size={20} />
            </button>
            <label className="relative hidden max-w-md flex-1 sm:block">
              <span className="sr-only">Search</span>
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                placeholder="Search your drafts, summaries and plans…"
                className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus-visible:outline-accent"
              />
            </label>
            <div className="ml-auto flex items-center gap-2">
              <NavLink to="/app/chat" className="hidden items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-sm font-bold text-white shadow-warm transition hover:-translate-y-0.5 sm:inline-flex">
                <Plus size={16} strokeWidth={2.6} /> New chat
              </NavLink>
              <button className="relative rounded-xl border border-line bg-surface p-2.5 text-ink transition hover:bg-tint-1" aria-label="Notifications">
                <Bell size={17} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
              </button>
              <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface py-1.5 pl-1.5 pr-3">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-cta text-xs font-extrabold text-white">{currentUser.initials}</span>
                <span className="hidden text-sm font-bold text-ink md:block">{currentUser.name}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
