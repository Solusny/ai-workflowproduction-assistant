import { Mail, FileText, ListChecks, Search, MessagesSquare, type LucideIcon } from 'lucide-react'

export type FeatureId = 'email' | 'meetings' | 'tasks' | 'research' | 'chat'

export interface Feature {
  id: FeatureId
  title: string
  short: string
  tagline: string
  description: string
  icon: LucideIcon
  path: '/app/email' | '/app/meetings' | '/app/tasks' | '/app/research' | '/app/chat'
}

/** The five AI tools, in landing-page milestone order. Shared by the 3D hub, landing sections and dashboard. */
export const FEATURES: Feature[] = [
  {
    id: 'email',
    title: 'Email Generator',
    short: 'Email',
    tagline: 'Draft polished emails in any tone, in seconds.',
    description: 'Turn a few bullet points into a clear, on-brand email — follow-ups, intros, tough replies and announcements.',
    icon: Mail,
    path: '/app/email',
  },
  {
    id: 'meetings',
    title: 'Meeting Summarizer',
    short: 'Meetings',
    tagline: 'Paste a transcript, get decisions and action items.',
    description: 'Structured summaries with key decisions, owners, deadlines and open questions — ready to share.',
    icon: FileText,
    path: '/app/meetings',
  },
  {
    id: 'tasks',
    title: 'Task Planner',
    short: 'Tasks',
    tagline: 'Break big goals into a prioritised, timed plan.',
    description: 'Describe a goal and get a step-by-step plan with priorities, estimates and dependencies.',
    icon: ListChecks,
    path: '/app/tasks',
  },
  {
    id: 'research',
    title: 'Research Assistant',
    short: 'Research',
    tagline: 'Clear briefs with key points and flagged unknowns.',
    description: 'Get an organised brief on any topic: overview, key findings, considerations and what still needs verifying.',
    icon: Search,
    path: '/app/research',
  },
  {
    id: 'chat',
    title: 'AI Chatbot',
    short: 'Chat',
    tagline: 'A workplace copilot that remembers the conversation.',
    description: 'Ask anything about your work — brainstorm, rewrite, explain or plan — in a natural conversation.',
    icon: MessagesSquare,
    path: '/app/chat',
  },
]

export const featureById = (id: string | undefined) => FEATURES.find((f) => f.id === id)
