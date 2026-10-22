import type { Feature } from '../../data/features'

export function PageHeader({ feature }: { feature: Feature }) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent text-white shadow-warm">
        <feature.icon size={22} strokeWidth={2.3} />
      </span>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{feature.title}</h1>
        <p className="mt-1 max-w-2xl text-[15px] text-muted">{feature.description}</p>
      </div>
    </div>
  )
}
