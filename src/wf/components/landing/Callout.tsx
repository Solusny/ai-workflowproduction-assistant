import { Link } from '@tanstack/react-router'
import { ArrowRight, Rocket } from 'lucide-react'
import { FEATURES, type Feature } from '../../data/features'

/** Glassmorphism callout that fades in beside the hub for the active scroll milestone. */
export function Callout({ feature, index, visible, className = '' }: { feature: Feature; index: number; visible: boolean; className?: string }) {
  const Icon = feature.icon
  const isLast = index === FEATURES.length - 1
  return (
    <div
      aria-live="polite"
      className={`z-20 transition-all duration-500 ease-out ${className} ${visible ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
    >
      <div key={feature.id} className="animate-fade-up rounded-2xl p-5 glass shadow-warm-lg">
        <div className="flex items-center justify-between">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-tint-1 text-accent ring-1 ring-tint-2">
            <Icon size={22} strokeWidth={2.3} />
          </span>
          <span className="text-xs font-bold tabular-nums text-muted">
            0{index + 1} / 0{FEATURES.length}
          </span>
        </div>
        <h2 className="mt-3 text-xl font-extrabold tracking-tight text-ink">{feature.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">{feature.tagline}</p>

        <div className="mt-4 flex gap-1.5" aria-hidden="true">
          {FEATURES.map((f, i) => (
            <span key={f.id} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= index ? 'bg-cta' : 'bg-line'}`} />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to={feature.path}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-tint-2 hover:bg-tint-1"
          >
            Open <ArrowRight size={15} strokeWidth={2.6} className="text-accent" />
          </Link>
          {isLast && (
            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white shadow-warm transition hover:-translate-y-0.5"
            >
              <Rocket size={15} strokeWidth={2.6} /> Launch the App
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
