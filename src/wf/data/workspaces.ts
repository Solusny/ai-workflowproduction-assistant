import type { FeatureId } from './features'

/** UI configuration for each tool workspace: inputs, options and the shape of the structured result. */
export interface WorkspaceOption {
  key: string
  label: string
  choices: string[]
}

export interface WorkspaceConfig {
  inputLabel: string
  placeholder: string
  example: string
  extraField?: { key: string; label: string; placeholder: string }
  options: WorkspaceOption[]
  cta: string
  outputSections: string[]
}

export const MAX_INPUT_CHARS = 15000

export const WORKSPACES: Record<Exclude<FeatureId, 'chat'>, WorkspaceConfig> = {
  email: {
    inputLabel: 'What should the email say?',
    placeholder: 'Key points, context and the outcome you want…',
    example:
      'Follow up with Priya at Northwind after Tuesday’s demo. Thank her for the time, recap that they liked the reporting module, confirm we can do a 30-day pilot starting next month, and ask who else should join the kickoff call.',
    extraField: { key: 'recipient', label: 'Recipient & relationship', placeholder: 'e.g. Priya, procurement lead at a prospect' },
    options: [
      { key: 'tone', label: 'Tone', choices: ['Professional', 'Friendly', 'Persuasive', 'Apologetic', 'Concise'] },
      { key: 'length', label: 'Length', choices: ['Short', 'Medium', 'Detailed'] },
    ],
    cta: 'Generate email',
    outputSections: ['Subject line', 'Email body', 'Optional follow-up'],
  },
  meetings: {
    inputLabel: 'Meeting transcript or notes',
    placeholder: 'Paste the transcript or your raw notes here…',
    example:
      'Sam: Let’s lock the launch for March 14.\nLee: Marketing needs final screenshots by March 1.\nSam: Agreed. Dana, can you own the screenshots?\nDana: Yes. Also, we still haven’t decided on pricing for the team tier.\nLee: Let’s revisit pricing on Thursday with finance.',
    options: [
      { key: 'detail', label: 'Detail level', choices: ['Brief', 'Standard', 'Detailed'] },
      { key: 'tone', label: 'Tone', choices: ['Neutral', 'Executive', 'Friendly'] },
    ],
    cta: 'Summarise meeting',
    outputSections: ['Summary', 'Key decisions', 'Action items & owners', 'Open questions'],
  },
  tasks: {
    inputLabel: 'What do you want to get done?',
    placeholder: 'Describe the goal, constraints and deadline…',
    example:
      'Revamp our customer onboarding emails before the end of the month. We have 5 existing emails, one designer available part-time, and need sign-off from the support lead.',
    options: [
      { key: 'timeframe', label: 'Timeframe', choices: ['Today', 'This week', 'This month', 'This quarter'] },
      { key: 'tone', label: 'Planning style', choices: ['Pragmatic', 'Ambitious', 'Detailed'] },
    ],
    cta: 'Build plan',
    outputSections: ['Phases', 'Tasks with priority', 'Time estimates', 'Dependencies & risks'],
  },
  research: {
    inputLabel: 'What should we research?',
    placeholder: 'A topic, question or decision you need to understand…',
    example: 'What should a 50-person SaaS company consider before adopting a four-day work week?',
    options: [
      { key: 'depth', label: 'Depth', choices: ['Quick overview', 'Standard brief', 'In-depth'] },
      { key: 'tone', label: 'Audience', choices: ['Executive', 'Team', 'Technical'] },
    ],
    cta: 'Research topic',
    outputSections: ['Overview', 'Key findings', 'Considerations', 'Needs verifying'],
  },
}

export const CHAT_SUGGESTIONS = [
  'Help me prioritise my week around three deadlines',
  'Rewrite this paragraph to sound more confident',
  'Give me an agenda for a 30-minute project kickoff',
  'Explain OKRs vs KPIs in plain language',
]
