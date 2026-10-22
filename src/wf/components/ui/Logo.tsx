import { Link } from 'react-router'

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="wf-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF8A5C" />
          <stop offset="1" stopColor="#FF3700" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#wf-logo)" />
      <rect x="14" y="20" width="36" height="24" rx="10" fill="#1F1033" />
      <circle cx="25" cy="32" r="4" fill="#FF8A5C" />
      <circle cx="39" cy="32" r="4" fill="#FF8A5C" />
    </svg>
  )
}

export function Logo({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 font-extrabold tracking-tight text-ink" aria-label="WorkFlow AI home">
      <LogoMark />
      <span className="text-lg">
        WorkFlow <span className="text-accent">AI</span>
      </span>
    </Link>
  )
}
