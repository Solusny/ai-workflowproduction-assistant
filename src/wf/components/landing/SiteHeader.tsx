import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Logo } from '../ui/Logo'

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto mt-3 flex max-w-7xl items-center justify-between rounded-2xl px-4 py-2.5 glass shadow-warm-sm sm:mx-4 lg:mx-auto lg:px-5 xl:mx-auto">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-semibold text-muted md:flex" aria-label="Primary">
          <a href="#features" className="transition-colors hover:text-ink">Features</a>
          <a href="#how" className="transition-colors hover:text-ink">How it works</a>
          <a href="#trust" className="transition-colors hover:text-ink">Privacy</a>
        </nav>
        <Link
          to="/app"
          className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white shadow-warm transition hover:-translate-y-0.5 hover:shadow-warm-lg"
        >
          Launch App <ArrowRight size={16} strokeWidth={2.6} />
        </Link>
      </div>
    </header>
  )
}
