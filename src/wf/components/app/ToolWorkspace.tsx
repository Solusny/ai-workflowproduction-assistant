// @ts-nocheck -- imported code written for a looser TypeScript config
import { useState, type FormEvent } from 'react'
import { Copy, Lightbulb, RotateCcw, Sparkles } from 'lucide-react'
import type { Feature } from '../../data/features'
import { MAX_INPUT_CHARS, type WorkspaceConfig } from '../../data/workspaces'
import { notifyAiPending } from '../../lib/ai'
import { PageHeader } from './PageHeader'

const fieldClass =
  'w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted transition focus:border-accent focus:outline-none focus-visible:outline-accent'

/** Input form + structured result panel shared by Email, Meetings, Tasks and Research. */
export function ToolWorkspace({ feature, config }: { feature: Feature; config: WorkspaceConfig }) {
  const [input, setInput] = useState('')
  const [extra, setExtra] = useState('')
  const [options, setOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.options.map((o) => [o.key, o.choices[0]])),
  )

  const tooLong = input.length > MAX_INPUT_CHARS
  const canSubmit = input.trim().length > 0 && !tooLong

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    notifyAiPending(feature.title)
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader feature={feature} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <form onSubmit={submit} className="rounded-2xl border border-line bg-surface p-5 shadow-warm-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="ws-input" className="text-sm font-bold text-ink">
              {config.inputLabel}
            </label>
            <button
              type="button"
              onClick={() => setInput(config.example)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-accent transition hover:bg-tint-1"
            >
              <Lightbulb size={14} /> Try an example
            </button>
          </div>
          <textarea
            id="ws-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={config.placeholder}
            rows={feature.id === 'meetings' ? 12 : 8}
            className={`${fieldClass} mt-2 resize-y leading-relaxed`}
            aria-describedby="ws-count"
          />
          <p id="ws-count" className={`mt-1.5 text-right text-xs font-semibold tabular-nums ${tooLong ? 'text-accent' : 'text-muted'}`}>
            {input.length.toLocaleString()} / {MAX_INPUT_CHARS.toLocaleString()}
            {tooLong && ' — please shorten your input'}
          </p>

          {config.extraField && (
            <div className="mt-3">
              <label htmlFor="ws-extra" className="text-sm font-bold text-ink">
                {config.extraField.label}
              </label>
              <input id="ws-extra" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder={config.extraField.placeholder} className={`${fieldClass} mt-2`} />
            </div>
          )}

          <div className="mt-5 space-y-4">
            {config.options.map((o) => (
              <fieldset key={o.key}>
                <legend className="text-sm font-bold text-ink">{o.label}</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {o.choices.map((c) => {
                    const selected = options[o.key] === c
                    return (
                      <button
                        key={c}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setOptions((prev) => ({ ...prev, [o.key]: c }))}
                        className={`rounded-xl border px-3.5 py-1.5 text-sm font-semibold transition ${
                          selected ? 'border-accent bg-tint-1 text-ink shadow-warm-sm' : 'border-line bg-surface text-muted hover:border-tint-2 hover:text-ink'
                        }`}
                      >
                        {c}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3.5 text-base font-bold text-white shadow-warm-lg transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
            >
              <Sparkles size={18} strokeWidth={2.4} /> {config.cta}
            </button>
            <button
              type="button"
              onClick={() => {
                setInput('')
                setExtra('')
              }}
              className="rounded-2xl border border-line bg-surface p-3.5 text-muted transition hover:bg-tint-1 hover:text-ink"
              aria-label="Clear input"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </form>

        <section aria-label="Result" className="flex min-h-[420px] flex-col rounded-2xl border border-line bg-surface shadow-warm-sm">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5 sm:px-6">
            <h2 className="text-sm font-bold text-ink">Result</h2>
            <button type="button" disabled className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-muted disabled:opacity-50" aria-label="Copy result">
              <Copy size={14} /> Copy
            </button>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <div className="relative">
              <div className="absolute inset-0 -z-0 animate-pulse rounded-full bg-tint-2 blur-2xl" aria-hidden="true" />
              <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-tint-1 text-accent ring-1 ring-tint-2 animate-float">
                <feature.icon size={28} strokeWidth={2.2} />
              </span>
            </div>
            <p className="mt-5 text-lg font-extrabold text-ink">Your result will appear here</p>
            <p className="mt-1 max-w-sm text-sm text-muted">Add your input, pick your options and run {feature.title}. You’ll get a structured result with:</p>
            <ul className="mt-5 grid w-full max-w-md gap-2 text-left sm:grid-cols-2">
              {config.outputSections.map((s) => (
                <li key={s} className="flex items-center gap-2.5 rounded-xl border border-dashed border-line bg-page px-3.5 py-2.5 text-sm font-semibold text-ink">
                  <span className="h-2 w-2 rounded-full bg-coral" aria-hidden="true" /> {s}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
