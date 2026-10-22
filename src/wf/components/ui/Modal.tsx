import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="wf-modal-title">
      <button className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={onClose} aria-label="Close" tabIndex={-1} />
      <div ref={ref} tabIndex={-1} className="relative max-h-[85vh] w-full max-w-lg animate-fade-up overflow-y-auto rounded-2xl border border-line bg-surface p-6 shadow-warm-lg focus:outline-none">
        <button onClick={onClose} className="absolute right-3 top-3 rounded-lg p-2 text-muted hover:bg-tint-1" aria-label="Close">
          <X size={18} />
        </button>
        <h2 id="wf-modal-title" className="pr-8 text-lg font-extrabold text-ink">{title}</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">{children}</div>
      </div>
    </div>
  )
}
