import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Bell, History, LayoutGrid, LogOut, Menu, Plus, Search, ShieldCheck, User, X } from 'lucide-react'
import { toast } from 'sonner'
import { FEATURES } from '../../data/features'
import { Logo } from '../ui/Logo'
import { Modal } from '../ui/Modal'
import { ResponsibleAiContent } from '../ui/LegalContent'
import { useAuth } from '../../auth/AuthProvider'

const navBase = 'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors'
const navInactive = { className: `${navBase} text-muted hover:bg-tint-1 hover:text-ink` }
const navActive = { className: `${navBase} bg-accent text-white shadow-warm` }

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-6 pt-5">
        <Logo to="/app" />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Dashboard">
        <Link to="/app" activeOptions={{ exact: true }} inactiveProps={navInactive} activeProps={navActive} onClick={onNavigate}>
          <LayoutGrid size={18} strokeWidth={2.3} /> Overview
        </Link>
        <p className="px-3 pb-1 pt-5 text-[11px] font-bold tracking-wider text-muted uppercase">AI tools</p>
        {FEATURES.map((f) => (
          <Link key={f.id} to={f.path} inactiveProps={navInactive} activeProps={navActive} onClick={onNavigate}>
            <f.icon size={18} strokeWidth={2.3} /> {f.title}
          </Link>
        ))}
        <p className="px-3 pb-1 pt-5 text-[11px] font-bold tracking-wider text-muted uppercase">Saved</p>
        <Link to="/app/history" inactiveProps={navInactive} activeProps={navActive} onClick={onNavigate}>
          <History size={18} strokeWidth={2.3} /> History
        </Link>
      </nav>
    </div>
  )
}

function Avatar({ size = 28 }: { size?: number }) {
  const { avatarUrl, initials } = useAuth()
  const [broken, setBroken] = useState(false)
  if (avatarUrl && !broken)
    return (
      <img
        src={avatarUrl}
        alt=""
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className="rounded-lg object-cover"
        style={{ width: size, height: size }}
      />
    )
  return (
    <span className="grid place-items-center rounded-lg bg-cta text-xs font-extrabold text-white" style={{ width: size, height: size }}>
      {initials}
    </span>
  )
}

function ProfileMenu() {
  const { displayName, user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const logout = async () => {
    setOpen(false)
    await queryClient.cancelQueries()
    queryClient.clear()
    await signOut()
    toast.success('You\u2019re logged out')
    navigate({ to: '/login', replace: true })
  }

  const item = 'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-semibold text-ink hover:bg-tint-1'
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-xl border border-line bg-surface py-1.5 pl-1.5 pr-3 transition hover:bg-tint-1"
      >
        <Avatar />
        <span className="hidden max-w-[10rem] truncate text-sm font-bold text-ink md:block">{displayName}</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-40 mt-2 w-64 animate-fade-up rounded-2xl border border-line bg-surface p-2 shadow-warm-lg">
          <div className="flex items-center gap-3 border-b border-line px-2 pb-3 pt-1">
            <Avatar size={36} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{displayName}</p>
              <p className="truncate text-xs text-muted">{user?.email}</p>
            </div>
          </div>
          <div className="pt-2">
            <Link to="/app/account" role="menuitem" className={item} onClick={() => setOpen(false)}>
              <User size={16} /> Account
            </Link>
            <button role="menuitem" className={item} onClick={() => { setOpen(false); setAiOpen(true) }}>
              <ShieldCheck size={16} /> Responsible AI
            </button>
            <button role="menuitem" className={`${item} text-accent`} onClick={logout}>
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
      )}
      <Modal open={aiOpen} onClose={() => setAiOpen(false)} title="Responsible AI">
        <ResponsibleAiContent />
      </Modal>
    </div>
  )
}

function useWelcome() {
  const { user, profile } = useAuth()
  useEffect(() => {
    if (!user || !profile) return
    const key = `wf-welcomed-${user.id}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
    const created = new Date(user.created_at).getTime()
    if (Date.now() - created < 10 * 60 * 1000) {
      toast.success(`Welcome to WorkFlow AI${profile.display_name ? `, ${profile.display_name.split(' ')[0]}` : ''}!`, {
        description: 'New here? Open any tool and tap \u201cTry an example\u201d to see how it works.',
        duration: 8000,
      })
    }
  }, [user, profile])
}

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useWelcome()
  useEffect(() => {
    window.scrollTo(0, 0)
    setOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-page">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-surface lg:block">
        <Sidebar />
      </aside>

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
                className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </label>
            <div className="ml-auto flex items-center gap-2">
              <Link to="/app/chat" className="hidden items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-sm font-bold text-white shadow-warm transition hover:-translate-y-0.5 sm:inline-flex">
                <Plus size={16} strokeWidth={2.6} /> New chat
              </Link>
              <button className="relative rounded-xl border border-line bg-surface p-2.5 text-ink transition hover:bg-tint-1" aria-label="Notifications">
                <Bell size={17} />
              </button>
              <ProfileMenu />
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
