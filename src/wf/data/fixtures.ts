/**
 * Stubbed dashboard data for the product surface.
 * Everything here is display-only sample data for the Overview screen.
 * A later milestone replaces this module with real, persisted user data (see PLAN.md).
 * NOTE: No AI output is ever faked — AI results only come from the live Gemini function.
 */
import type { FeatureId } from './features'

export const currentUser = {
  firstName: 'Amara',
  name: 'Amara Okafor',
  role: 'Product Lead',
  initials: 'AO',
}

export const weeklyStats = [
  { label: 'Hours saved this week', value: '6.4h', delta: '+18%', trend: [2, 3, 2.5, 4, 3.6, 5, 6.4] },
  { label: 'Emails drafted', value: '42', delta: '+9', trend: [4, 6, 5, 8, 7, 6, 6] },
  { label: 'Meetings summarised', value: '11', delta: '+3', trend: [1, 2, 1, 2, 2, 1, 2] },
  { label: 'Tasks planned', value: '27', delta: '+5', trend: [3, 4, 2, 5, 4, 5, 4] },
]

export const usageByTool: { id: FeatureId; label: string; count: number }[] = [
  { id: 'email', label: 'Email Generator', count: 42 },
  { id: 'chat', label: 'AI Chatbot', count: 31 },
  { id: 'tasks', label: 'Task Planner', count: 27 },
  { id: 'meetings', label: 'Meeting Summarizer', count: 11 },
  { id: 'research', label: 'Research Assistant', count: 9 },
]

export const recentActivity: { id: string; feature: FeatureId; title: string; meta: string; time: string }[] = [
  { id: 'a1', feature: 'meetings', title: 'Q4 roadmap sync — summary', meta: '5 decisions · 8 action items', time: '12 min ago' },
  { id: 'a2', feature: 'email', title: 'Follow-up to Northwind procurement', meta: 'Friendly · 164 words', time: '48 min ago' },
  { id: 'a3', feature: 'tasks', title: 'Launch plan: onboarding revamp', meta: '14 tasks · 3 phases', time: '2 h ago' },
  { id: 'a4', feature: 'research', title: 'Brief: EU AI Act obligations', meta: '6 key points · 2 flagged', time: 'Yesterday' },
  { id: 'a5', feature: 'chat', title: 'Rewriting the Q3 OKR narrative', meta: '12 messages', time: 'Yesterday' },
]

export const todaysFocus: { id: string; title: string; due: string; progress: number; priority: 'High' | 'Medium' | 'Low' }[] = [
  { id: 't1', title: 'Finalise onboarding revamp brief', due: '11:00', progress: 80, priority: 'High' },
  { id: 't2', title: 'Send stakeholder recap from roadmap sync', due: '13:30', progress: 45, priority: 'High' },
  { id: 't3', title: 'Review analytics dashboard copy', due: '15:00', progress: 20, priority: 'Medium' },
  { id: 't4', title: 'Prep agenda for design crit', due: '17:00', progress: 0, priority: 'Low' },
]

export const upcomingMeetings = [
  { id: 'm1', title: 'Design crit', time: '14:00 – 14:45', people: 6 },
  { id: 'm2', title: '1:1 with Jonah', time: '16:00 – 16:30', people: 2 },
]
