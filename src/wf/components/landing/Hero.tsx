// @ts-nocheck -- imported code written for a looser TypeScript config
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react'
import { FEATURES, type Feature } from '../../data/features'
import { hubState, MILESTONES } from '../../lib/hubState'
import { Callout } from './Callout'

gsap.registerPlugin(ScrollTrigger)

const HubScene = lazy(() => import('../three/HubScene'))

/** Pinned hero: headline on the left, 3D AI Command Hub on the right, scrubbed through five feature milestones. */
export function Hero({ onReady }: { onReady: () => void }) {
  const section = useRef<HTMLElement>(null)
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const [inView, setInView] = useState(true)

  // Stop rendering the 3D scene when the hero is scrolled away or the tab is hidden
  useEffect(() => {
    const el = section.current
    if (!el) return
    let onScreen = true
    const update = () => setInView(onScreen && document.visibilityState === 'visible')
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
      update()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', update)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  useLayoutEffect(() => {
    hubState.progress = 0
    hubState.engaged = false
    const proxy = { p: 0 }
    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        p: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * (MILESTONES - 1) * 0.9}`,
          pin: true,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          hubState.progress = proxy.p
          hubState.engaged = proxy.p > 0.004
          const v = proxy.p > 0.02
          const a = Math.min(MILESTONES - 1, Math.round(proxy.p * (MILESTONES - 1)))
          // Bail out of React updates on every scroll tick unless something changed
          setVisible((prev) => (prev === v ? prev : v))
          setActive((prev) => (prev === a ? prev : a))
        },
      })
    }, section)
    return () => {
      ctx.revert()
      hubState.engaged = false
      hubState.progress = 0
    }
  }, [])

  const open = (f: Feature) => navigate({ to: f.path })

  return (
    <section ref={section} className="relative h-svh min-h-[640px] w-full overflow-hidden bg-page" aria-label="WorkFlow AI introduction">
      {/* Soft radial glow behind the hub */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[68%] h-[70vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#FFD3C2_0%,rgba(255,211,194,0.55)_45%,transparent_100%)] lg:left-[68%] lg:top-1/2 lg:w-[60vw]" />
        <div className="absolute left-1/2 top-[72%] h-[34vh] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,138,92,0.35)_0%,transparent_100%)] lg:left-[68%] lg:top-[58%] lg:w-[30vw]" />
      </div>

      {/* 3D canvas: full-bleed on mobile (below the copy), right side on desktop */}
      <div className="absolute inset-x-0 bottom-0 top-[44%] sm:top-[40%] lg:inset-y-0 lg:left-[36%] lg:right-0 lg:top-0">
        <Suspense fallback={null}>
          <HubScene onSelect={open} onReady={onReady} active={inView} />
        </Suspense>
      </div>

      {/* Copy */}
      <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col px-5 pt-24 sm:px-8 lg:justify-center lg:pt-16">
        <div className="pointer-events-auto max-w-xl animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-ink glass shadow-warm-sm">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-white">
              <Sparkles size={12} strokeWidth={2.6} />
            </span>
            <span className="font-extrabold">WorkFlow AI</span>
            <span className="h-3.5 w-px bg-line" aria-hidden="true" />
            <span>
              One <span className="text-gradient font-extrabold">AI assistant</span> for your whole workday
            </span>
          </div>

          <h1 className="mt-5 text-[2.6rem] leading-[1.02] font-extrabold tracking-[-0.03em] text-ink sm:text-6xl lg:text-7xl">
            Your <span className="text-gradient">AI</span> Workplace Assistant
          </h1>
          <div className="relative mt-4 lg:min-h-[250px]">
            <div className={`transition-all duration-500 ${visible ? 'lg:pointer-events-none lg:-translate-y-2 lg:opacity-0' : ''}`}>
              <p className="max-w-md text-base leading-relaxed text-muted sm:text-lg">
                Draft emails, summarise meetings, plan tasks, research anything and chat with a copilot — all from one bright, focused hub.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/app"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-accent px-6 py-3.5 text-base font-bold text-white shadow-warm-lg transition hover:-translate-y-0.5"
                >
                  Launch App
                  <ArrowRight size={18} strokeWidth={2.6} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="#features"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-accent/80 bg-surface/70 px-6 py-3 text-base font-bold text-ink transition hover:-translate-y-0.5 hover:bg-tint-1"
                >
                  See Features
                  <ChevronDown size={18} strokeWidth={2.6} className="text-accent" />
                </a>
              </div>
              <p className="mt-6 hidden text-xs font-semibold tracking-wide text-muted uppercase lg:block">
                Scroll to tour the hub · click any tile to open it
              </p>
            </div>
            <Callout feature={FEATURES[active]} index={active} visible={visible} className="absolute inset-x-0 top-0 hidden max-w-sm lg:block" />
          </div>
        </div>
      </div>

      <Callout feature={FEATURES[active]} index={active} visible={visible} className="absolute inset-x-4 bottom-4 sm:left-auto sm:right-6 sm:w-[340px] lg:hidden" />
    </section>
  )
}
