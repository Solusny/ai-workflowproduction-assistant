import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowUp, Sparkles } from 'lucide-react'
import type { Feature } from '../../data/features'
import { CHAT_SUGGESTIONS, MAX_INPUT_CHARS } from '../../data/workspaces'
import { notifyAiPending } from '../../lib/ai'
import { LogoMark } from '../ui/Logo'

const TONES = ['Professional', 'Friendly', 'Concise']

/** Chat surface. Message history is sent in full on each request once the AI function is connected. */
export function ChatWorkspace({ feature }: { feature: Feature }) {
  const [draft, setDraft] = useState('')
  const [tone, setTone] = useState(TONES[0])
  const canSend = draft.trim().length > 0 && draft.length <= MAX_INPUT_CHARS

  const send = (e?: FormEvent) => {
    e?.preventDefault()
    if (!canSend) return
    notifyAiPending(feature.title)
  }
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100svh-8.5rem)] max-w-4xl flex-col rounded-2xl border border-line bg-surface shadow-warm-sm lg:h-[calc(100svh-9.5rem)]">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div className="flex items-center gap-3">
          <LogoMark size={34} />
          <div>
            <h1 className="text-base font-extrabold text-ink">{feature.title}</h1>
            <p className="text-xs text-muted">Your workplace copilot · remembers this conversation</p>
          </div>
        </div>
        <div className="hidden items-center gap-1 rounded-xl border border-line bg-page p-1 sm:flex" role="radiogroup" aria-label="Reply tone">
          {TONES.map((t) => (
            <button
              key={t}
              role="radio"
              aria-checked={tone === t}
              onClick={() => setTone(t)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${tone === t ? 'bg-surface text-ink shadow-warm-sm' : 'text-muted hover:text-ink'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-5 py-10 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-tint-1 text-accent ring-1 ring-tint-2 animate-float">
          <Sparkles size={28} strokeWidth={2.2} />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">How can I help with your work today?</h2>
        <p className="mt-2 max-w-md text-sm text-muted">Brainstorm, rewrite, plan or explain. Pick a starter or type your own question.</p>
        <div className="mt-7 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
          {CHAT_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setDraft(s)}
              className="rounded-2xl border border-line bg-page px-4 py-3.5 text-left text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-tint-2 hover:bg-tint-1 hover:shadow-warm"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={send} className="border-t border-line p-3 sm:p-4">
        <div className="flex items-end gap-2 rounded-2xl border border-line bg-page p-2 transition focus-within:border-accent">
          <label htmlFor="chat-input" className="sr-only">Message</label>
          <textarea
            id="chat-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKey}
            rows={1}
            placeholder="Message WorkFlow AI…"
            className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2.5 text-[15px] text-ink placeholder:text-muted focus:outline-none"
          />
          <button
            type="submit"
            disabled={!canSend}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-white shadow-warm transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none"
            aria-label="Send message"
          >
            <ArrowUp size={20} strokeWidth={2.6} />
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted">Enter to send · Shift + Enter for a new line · AI can make mistakes, so verify important details.</p>
      </form>
    </div>
  )
}
