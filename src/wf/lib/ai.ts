import { toast } from 'sonner'

/**
 * Client entry point for AI requests.
 * The Gemini-backed Netlify Function (/.netlify/functions/ai) is connected in the next milestone (see PLAN.md).
 * Until then, no response is ever simulated — the user is told the live connection is on its way.
 */
export function notifyAiPending(featureTitle: string) {
  toast('Live AI is being connected', {
    description: `${featureTitle} will return real Gemini results once the AI service is switched on.`,
  })
}
