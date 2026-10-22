import { useCallback, useEffect, useState } from 'react'
import { Loader } from '../components/landing/Loader'
import { SiteHeader } from '../components/landing/SiteHeader'
import { Hero } from '../components/landing/Hero'
import { FeaturesSection, FinalCta, HowItWorks, SiteFooter, TrustSection } from '../components/landing/Sections'

export default function LandingPage() {
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])
  // Never trap visitors behind the loader if WebGL is slow or unavailable
  useEffect(() => {
    const t = setTimeout(onReady, 2500)
    return () => clearTimeout(t)
  }, [onReady])
  return (
    <div className="min-h-screen bg-page">
      <Loader ready={ready} />
      <SiteHeader />
      <main>
        <Hero onReady={onReady} />
        <FeaturesSection />
        <HowItWorks />
        <TrustSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
