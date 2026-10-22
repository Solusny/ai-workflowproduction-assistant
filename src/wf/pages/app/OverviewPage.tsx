import { Link } from '@tanstack/react-router'
import { ArrowUpRight, CalendarClock, Clock, TrendingUp, Users } from 'lucide-react'
import { FEATURES, featureById } from '../../data/features'
import { useAuth } from '../../auth/AuthProvider'
import { recentActivity, todaysFocus, upcomingMeetings, usageByTool, weeklyStats } from '../../data/fixtures'

function Sparkline({ data }: { data: number[] }) {
  const w = 96
  const h = 32
  const max = Math.max(...data)
  const min = Math.min(...data)
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 3 - ((v - min) / (max - min || 1)) * (h - 6)])
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const [lx, ly] = pts[pts.length - 1]
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <path d={`${d} L${w},${h} L0,${h} Z`} fill="#FFEFE9" />
      <path d={d} fill="none" stroke="#FF8A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3" fill="#FF3700" />
    </svg>
  )
}

const priorityStyle = {
  High: 'bg-tint-2 text-ink',
  Medium: 'bg-tint-1 text-ink',
  Low: 'bg-page text-muted border border-line',
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export default function OverviewPage() {
  const { displayName } = useAuth()
  const firstName = displayName.split(' ')[0] || 'there'
  const maxUsage = Math.max(...usageByTool.map((u) => u.count))
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Greeting */}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-warm-sm sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,#FFD3C2,transparent)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-40 right-40 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(255,138,92,0.25),transparent)]" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-muted">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {greeting()}, {firstName} <span className="text-gradient">✦</span>
            </h1>
            <p className="mt-2 max-w-lg text-[15px] text-muted">You have 4 focus tasks and 2 meetings today. Where would you like your assistant to start?</p>
          </div>
          <Link to="/app/chat" className="inline-flex items-center gap-2 self-start rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-white shadow-warm-lg transition hover:-translate-y-0.5 md:self-auto">
            Ask WorkFlow AI <ArrowUpRight size={16} strokeWidth={2.6} />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="This week" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {weeklyStats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-5 shadow-warm-sm lift">
            <p className="text-sm font-semibold text-muted">{s.label}</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-3xl font-extrabold tracking-tight text-ink">{s.value}</p>
                <p className="mt-1 inline-flex items-center gap-1 rounded-md bg-tint-1 px-1.5 py-0.5 text-xs font-bold text-ink">
                  <TrendingUp size={12} className="text-accent" /> {s.delta}
                </p>
              </div>
              <Sparkline data={s.trend} />
            </div>
          </div>
        ))}
      </section>

      {/* Quick launch */}
      <section aria-labelledby="tools-heading">
        <div className="mb-3 flex items-end justify-between">
          <h2 id="tools-heading" className="text-lg font-extrabold text-ink">AI tools</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {FEATURES.map((f) => (
            <Link key={f.id} to={f.path} className="group rounded-2xl border border-line bg-surface p-5 shadow-warm-sm lift hover:border-tint-2">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-tint-1 text-accent ring-1 ring-tint-2 transition-colors group-hover:bg-accent group-hover:text-white">
                <f.icon size={20} strokeWidth={2.3} />
              </span>
              <p className="mt-4 font-extrabold text-ink">{f.title}</p>
              <p className="mt-1 text-[13px] leading-snug text-muted">{f.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's focus */}
        <section aria-labelledby="focus-heading" className="rounded-2xl border border-line bg-surface p-6 shadow-warm-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 id="focus-heading" className="text-lg font-extrabold text-ink">Today's focus</h2>
            <Link to="/app/tasks" className="text-sm font-bold text-accent hover:underline">Plan with AI</Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {todaysFocus.map((t) => (
              <li key={t.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink">{t.title}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-muted">
                    <Clock size={12} /> Due {t.due}
                    <span className={`ml-2 rounded-md px-1.5 py-0.5 text-[11px] font-bold ${priorityStyle[t.priority]}`}>{t.priority}</span>
                  </p>
                </div>
                <div className="flex w-full items-center gap-3 sm:w-52">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-tint-1" role="progressbar" aria-valuenow={t.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${t.title} progress`}>
                    <div className="h-full rounded-full bg-signature" style={{ width: `${Math.max(t.progress, 3)}%` }} />
                  </div>
                  <span className="w-9 text-right text-xs font-bold tabular-nums text-ink">{t.progress}%</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Usage */}
        <section aria-labelledby="usage-heading" className="rounded-2xl border border-line bg-surface p-6 shadow-warm-sm">
          <h2 id="usage-heading" className="text-lg font-extrabold text-ink">Most used this week</h2>
          <ul className="mt-5 space-y-4">
            {usageByTool.map((u) => (
              <li key={u.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-ink">{u.label}</span>
                  <span className="font-bold tabular-nums text-ink">{u.count}</span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-tint-1">
                  <div className="h-full rounded-full bg-coral" style={{ width: `${(u.count / maxUsage) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent activity */}
        <section aria-labelledby="recent-heading" className="rounded-2xl border border-line bg-surface p-6 shadow-warm-sm lg:col-span-2">
          <h2 id="recent-heading" className="text-lg font-extrabold text-ink">Recent activity</h2>
          <ul className="mt-3 space-y-1">
            {recentActivity.map((a) => {
              const f = featureById(a.feature)!
              return (
                <li key={a.id}>
                  <Link to={f.path} className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-tint-1">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-tint-1 text-accent">
                      <f.icon size={18} strokeWidth={2.3} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink">{a.title}</p>
                      <p className="text-xs text-muted">{f.title} · {a.meta}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-muted">{a.time}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Upcoming meetings */}
        <section aria-labelledby="meetings-heading" className="rounded-2xl border border-line bg-surface p-6 shadow-warm-sm">
          <h2 id="meetings-heading" className="text-lg font-extrabold text-ink">Up next</h2>
          <ul className="mt-4 space-y-3">
            {upcomingMeetings.map((m) => (
              <li key={m.id} className="rounded-xl border border-line bg-page p-4">
                <p className="font-bold text-ink">{m.title}</p>
                <p className="mt-1 flex items-center gap-3 text-xs font-semibold text-muted">
                  <span className="inline-flex items-center gap-1"><CalendarClock size={12} /> {m.time}</span>
                  <span className="inline-flex items-center gap-1"><Users size={12} /> {m.people}</span>
                </p>
              </li>
            ))}
          </ul>
          <Link to="/app/meetings" className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-tint-2 bg-tint-1 px-4 py-2.5 text-sm font-bold text-ink transition hover:-translate-y-0.5">
            Summarise a meeting <ArrowUpRight size={15} className="text-accent" />
          </Link>
        </section>
      </div>
    </div>
  )
}
