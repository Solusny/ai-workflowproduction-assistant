// @ts-nocheck -- imported code written for a looser TypeScript config
import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight, Braces, KeyRound, ShieldCheck, Sparkles, Wand2, MousePointerClick } from 'lucide-react'
import { FEATURES } from '../../data/features'
import { Logo } from '../ui/Logo'

const SAMPLE_OUTPUT: Record<string, string[]> = {
  email: ['Subject line', 'Greeting & context', 'Clear ask', 'Sign-off'],
  meetings: ['Summary', 'Decisions', 'Action items + owners', 'Open questions'],
  tasks: ['Phases', 'Priorities', 'Time estimates', 'Dependencies'],
  research: ['Overview', 'Key findings', 'Considerations', 'Needs verifying'],
  chat: ['Full conversation memory', 'Markdown answers', 'Streaming replies'],
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8 lg:py-32">
      <div className="max-w-2xl">
        <p className="inline-flex items-center gap-2 rounded-full bg-tint-2/60 px-3 py-1 text-xs font-bold tracking-wide text-ink uppercase">
          <Sparkles size={13} className="text-accent" /> Five tools, one hub
        </p>
        <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.025em] text-ink sm:text-5xl">
          Everything your workday asks of you, <span className="text-gradient">handled.</span>
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Each tool is tuned with its own expert instructions and returns clean, structured output you can copy, share or act on immediately.
        </p>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-6">
        {FEATURES.map((f, i) => {
          const Icon = f.icon
          const wide = i === 0 || i === 4
          return (
            <Link
              key={f.id}
              to={f.path}
              className={`group relative overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-warm-sm lift hover:border-tint-2 ${
                wide ? 'md:col-span-3' : 'md:col-span-2'
              }`}
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-tint-1 transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-tint-1 text-accent ring-1 ring-tint-2 transition-colors group-hover:bg-accent group-hover:text-white">
                    <Icon size={22} strokeWidth={2.3} />
                  </span>
                  <ArrowUpRight size={20} className="text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </div>
                <h3 className="mt-5 text-xl font-extrabold tracking-tight text-ink">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {SAMPLE_OUTPUT[f.id].map((tag) => (
                    <li key={tag} className="rounded-lg border border-line bg-page px-2.5 py-1 text-xs font-semibold text-ink">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

const STEPS = [
  { icon: MousePointerClick, title: 'Pick a tool', body: 'Jump straight into the assistant you need from the hub or the dashboard sidebar.' },
  { icon: Wand2, title: 'Add your context', body: 'Paste notes, a transcript or a goal, then choose a tone and the level of detail.' },
  { icon: Braces, title: 'Get structured results', body: 'Receive clean sections, action items and plans — ready to copy, export or refine.' },
]

export function HowItWorks() {
  return (
    <section id="how" className="relative scroll-mt-24 bg-tint-1/60 py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-end">
          <h2 className="text-4xl font-extrabold tracking-[-0.025em] text-ink sm:text-5xl">
            From messy input to <span className="text-gradient">ready-to-send</span> in three steps.
          </h2>
          <p className="text-lg leading-relaxed text-muted lg:pb-2">
            No prompt engineering required. WorkFlow AI wraps every request in a carefully designed brief — role, context, steps, output format and guardrails — so results are consistent and dependable.
          </p>
        </div>
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-line bg-surface p-7 shadow-warm-sm lift">
              <span className="absolute right-6 top-5 text-5xl font-extrabold text-tint-2" aria-hidden="true">
                {i + 1}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-white shadow-warm">
                <s.icon size={20} strokeWidth={2.4} />
              </span>
              <h3 className="mt-5 text-lg font-extrabold text-ink">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function TrustSection() {
  const points = [
    { icon: KeyRound, title: 'Keys stay on the server', body: 'AI requests run through a secure server function. Your browser never sees an API key.' },
    { icon: ShieldCheck, title: 'Honest by design', body: 'Every tool is instructed not to invent facts and to flag anything uncertain for you to verify.' },
    { icon: Sparkles, title: 'Powered by Gemini', body: 'Fast, capable responses from Google Gemini 2.5 Flash, with structured output for summaries, plans and briefs.' },
  ]
  return (
    <section id="trust" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8 lg:py-28">
      <div className="grid gap-5 md:grid-cols-3">
        {points.map((p) => (
          <div key={p.title} className="rounded-2xl border border-line bg-surface p-7 shadow-warm-sm">
            <p.icon size={22} className="text-accent" strokeWidth={2.3} />
            <h3 className="mt-4 text-lg font-extrabold text-ink">{p.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section className="px-5 pb-24 sm:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-tint-2 bg-surface px-8 py-16 text-center shadow-warm-lg sm:px-16">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-signature opacity-40" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-full h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#FF8A5C_0%,transparent_100%)] opacity-40" aria-hidden="true" />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-[-0.025em] text-ink sm:text-5xl">Give your workday a co-pilot.</h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted">Open the dashboard and start with whichever task is weighing on you most.</p>
          <Link to="/app" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-accent px-7 py-4 text-base font-bold text-white shadow-warm-lg transition hover:-translate-y-0.5">
            Launch the App <ArrowRight size={18} strokeWidth={2.6} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
        <Logo />
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-muted" aria-label="Footer">
          {FEATURES.map((f) => (
            <Link key={f.id} to={f.path} className="transition-colors hover:text-ink">
              {f.title}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-muted">© {new Date().getFullYear()} WorkFlow AI</p>
      </div>
    </footer>
  )
}
