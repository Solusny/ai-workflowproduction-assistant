import { LogoMark } from './Logo'

export function BrandLoader({ label = 'Loading your workspace…' }: { label?: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-login-glow" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-float">
          <LogoMark size={56} />
        </div>
        <p className="text-sm font-semibold text-muted">{label}</p>
      </div>
    </div>
  )
}
