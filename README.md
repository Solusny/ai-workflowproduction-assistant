# WorkFlow AI: AI Workplace Productivity Assistant

An AI-powered productivity platform that automates everyday workplace tasks. It is one integrated dashboard with five AI features, a secure sign-in, and a 3D interactive landing page.

**Live demo:** _add your published Lovable URL here_
**Repository:** _add your GitHub repo URL here_

---

## Project Overview

Professionals spend hours every week writing emails, turning meeting notes into action items, planning their time and researching topics. WorkFlow AI brings these tasks into one clean workspace where an AI assistant does the first draft and the user stays in control: every output is editable, and nothing is sent or saved without the user reviewing it.

The project demonstrates:

- Practical AI implementation (real model calls, no mocked responses)
- Structured prompt engineering (one reviewed prompt per feature)
- Real-world problem solving for office work
- Responsible AI usage
- Modern, responsive UI/UX

## Features

**AI features**

| Feature | What it does |
| --- | --- |
| Smart Email Generator | Drafts professional emails from a purpose and key points. Supports Formal, Friendly, Persuasive, Apologetic and Concise tones and short, medium or long length. Includes Regenerate, Make shorter and Change tone. |
| Meeting Notes Summarizer | Turns long notes or a transcript into a summary, key decisions, action items (owner and deadline), open questions and a suggested follow-up email. |
| AI Task Planner / Scheduler | Builds a prioritised daily or weekly schedule with Urgent/Important labels, a time-blocked timetable and an explanation of the ordering. |
| AI Research Assistant | Summarises a topic or article into an executive summary, key insights, pros and cons, recommendations and a "Verify these claims" checklist. |
| AI Chatbot | A conversational workplace co-pilot with streaming replies, suggested prompts and session memory. |

**Innovation**

- **Workflow Chain:** one click takes meeting notes, extracts action items, schedules them in the Task Planner and drafts follow-up emails to the owners.
- **Rewrite with AI:** improve clarity, shorten or make any output more professional.
- **3D landing page:** an isometric AI command hub with a robot assistant and five feature tiles. Scrolling rotates the hub to each feature.

**Platform**

- Sign up and log in with Google, email code/link or password
- Dashboard layout with sidebar navigation, stats and recent activity
- Editable outputs with Copy, Download (.txt/.md), Regenerate and Save to History
- Searchable personal History, private to each user
- "Try an example" button on every feature
- Fully responsive (mobile and desktop), light theme, accessible, respects reduced-motion settings

## Responsible AI

- **Transparency:** the interface labels AI output, and the About & Responsible AI page explains what the AI does and which model is used.
- **Human in the loop:** all outputs are editable and need user review before use.
- **Limitations and bias:** a persistent disclaimer states that AI-generated content may contain errors.
- **Privacy:** users are told not to enter passwords or confidential or personal information. API keys stay on the server and are never exposed in the browser. Saved history is private to each account.
- **Safe failure:** inputs are validated, and errors show a clear message instead of a fake response.
- **Prompt design:** every system prompt tells the model not to invent facts and to flag uncertainty. The prompts are all in `src/prompts.ts` for review.

## Tools Used

| Area | Tools |
| --- | --- |
| Build platform | Lovable |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router |
| 3D and animation | Three.js, React Three Fiber, drei, GSAP ScrollTrigger |
| AI | Lovable AI Gateway (Google Gemini models) called from a backend edge function |
| Backend and auth | Lovable Cloud (database, authentication, edge functions) |
| Version control | Git and GitHub |

## Setup Instructions

### Prerequisites

- Node.js 18 or later and npm
- A GitHub account
- A Lovable account (for the backend and AI features)

### Run locally

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd <your-repo-folder>

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Fill in the values listed below

# 4. Start the development server
npm run dev
```

Open the local URL printed in the terminal (usually `http://localhost:5173`).

### Environment variables

| Variable | Where it is used | Notes |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Frontend | Backend URL from Lovable Cloud |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Frontend | Public key, safe for the browser |
| `LOVABLE_API_KEY` | Edge function only | AI gateway key, managed as a secret by Lovable Cloud. Never put it in frontend code. |

Never commit a real `.env` file. It is listed in `.gitignore`.

### Using the project in Lovable (recommended)

1. Open the project in Lovable and make sure Lovable Cloud is enabled. The backend, authentication and the AI key are configured there.
2. Connect GitHub from the project settings so changes sync automatically.
3. Click **Publish** to deploy.

### Authentication setup

- Enable the Google and email sign-in methods in Lovable Cloud.
- Add your preview and published URLs to the allowed redirect URLs, otherwise sign-in links and Google login may redirect to the wrong page.

### Project structure

```
src/
  prompts.ts        All AI system prompts, one per feature (review this file)
  pages/            Landing page, login, dashboard and feature pages
  components/       Shared UI, 3D scene and layout components
supabase/functions/ Backend edge functions that call the AI gateway
```

## Team Members

- Solulele Snyman: design, prompt engineering and development

## Disclaimer

AI-generated content may contain errors. Review it before sending or acting on it. Do not enter passwords or confidential or personal information.
