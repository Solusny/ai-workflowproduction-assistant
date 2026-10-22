import { useEffect, useRef, useState } from 'react'
import { LogoMark } from '../ui/Logo'

const R = 34
const C = 2 * Math.PI * R

/** Branded loader with a signature-gradient progress ring. Completes once the 3D hub has initialised. */
export function Loader({ ready }: { ready: boolean }) {
  const [progress, setProgress] = useState(0)
  const [hidden, setHidden] = useState(false)
  const readyRef = useRef(ready)
  readyRef.current = ready

  useEffect(() => {
    let raf = 0
    let finished = false
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      setProgress((p) => {
        // Ease toward 85% while loading, then race to 100% once ready (minimum ~900ms on screen)
        const cap = readyRef.current && elapsed > 900 ? 100 : 85
        const next = p + (cap - p) * (readyRef.current ? 0.12 : 0.035)
        if (cap === 100 && next > 99.5) {
          finished = true
          return 100
        }
        return next
      })
      if (!finished) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const done = progress >= 100
  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setHidden(true), 650)
    return () => clearTimeout(t)
  }, [done])

  if (hidden) return null
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={done ? 'Loaded' : `Loading WorkFlow AI, ${Math.round(progress)} percent`}
      className={`fixed inset-0 z-[100] grid place-items-center bg-page transition-opacity duration-600 ${done ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_50%,#FFD3C2_0%,transparent_70%)] opacity-70" />
      <div className="relative flex flex-col items-center gap-5">
        <div className="relative h-24 w-24">
          <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
            <defs>
              <linearGradient id="wf-loader" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFD3C2" />
                <stop offset="50%" stopColor="#FF8A5C" />
                <stop offset="100%" stopColor="#FF3700" />
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r={R} fill="none" stroke="#EDE4F5" strokeWidth="5" />
            <circle
              cx="40"
              cy="40"
              r={R}
              fill="none"
              stroke="url(#wf-loader)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress / 100)}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <LogoMark size={40} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-ink">Booting your AI Command Hub</p>
          <p className="mt-1 text-xs font-semibold tabular-nums text-muted">{Math.round(progress)}%</p>
        </div>
      </div>
    </div>
  )
}
