# Skilect — Project Folder Structure

> Full-stack Next.js 16 App Router architecture
> Generated: 2026-06-11

```text
Skilect/
│
│── .env.local.example          # Environment variables template (all API keys)
│── .gitignore                  # Git ignore rules (Next.js, node_modules, .env, etc.)
│── eslint.config.mjs           # ESLint config (core-web-vitals + TypeScript)
│── middleware.ts                # Route protection middleware (Clerk-ready)
│── next.config.ts              # Next.js configuration
│── next-env.d.ts               # Next.js TypeScript environment declarations
│── package.json                # npm project config (Next.js 16, React 19, Tailwind v4)
│── package-lock.json           # npm dependency lockfile
│── postcss.config.mjs          # PostCSS config (Tailwind v4 plugin)
│── README.md                   # Project README (unchanged)
│── tsconfig.json               # TypeScript config (strict, @/* path aliases)
│
├── .github/                    # GitHub configuration (unchanged)
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   └── pull_request_template.md
│
├── Docs/                       # Documentation (unchanged, empty)
│
├── app/                        # ─── NEXT.JS APP ROUTER ───
│   │
│   ├── globals.css             # Global styles (Tailwind v4 import + theme tokens)
│   ├── layout.tsx              # Root layout (HTML, fonts, metadata, global CSS)
│   ├── page.tsx                # Home page — "/"
│   │
│   ├── sign-in/                # ─── AUTH ROUTES (Clerk catch-all) ───
│   │   └── [[...sign-in]]/
│   │       └── page.tsx        # Sign-in page — "/sign-in/*"
│   │
│   ├── sign-up/
│   │   └── [[...sign-up]]/
│   │       └── page.tsx        # Sign-up page — "/sign-up/*"
│   │
│   ├── assessment/             # ─── FEATURE ROUTES ───
│   │   └── page.tsx            # Assessment page — "/assessment"
│   │
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard page — "/dashboard"
│   │
│   ├── roadmaps/
│   │   └── page.tsx            # Roadmaps page — "/roadmaps"
│   │
│   ├── tasks/
│   │   └── page.tsx            # Tasks page — "/tasks"
│   │
│   ├── resume/
│   │   └── page.tsx            # Resume page — "/resume"
│   │
│   ├── interview/
│   │   └── page.tsx            # Interview page — "/interview"
│   │
│   ├── progress/
│   │   └── page.tsx            # Progress page — "/progress"
│   │
│   ├── settings/
│   │   └── page.tsx            # Settings page — "/settings"
│   │
│   └── api/                    # ─── API ROUTES (Server-side) ───
│       │
│       ├── auth/
│       │   └── route.ts        # Auth API — GET, POST
│       │
│       ├── assessment/
│       │   └── route.ts        # Assessment API — GET, POST
│       │
│       ├── dashboard/
│       │   └── route.ts        # Dashboard API — GET, POST
│       │
│       ├── roadmaps/
│       │   └── route.ts        # Roadmaps API — GET, POST
│       │
│       ├── tasks/
│       │   └── route.ts        # Tasks API — GET, POST
│       │
│       ├── resume/
│       │   └── route.ts        # Resume API — GET, POST
│       │
│       └── interview/
│           └── route.ts        # Interview API — GET, POST
│
├── components/                 # ─── REACT COMPONENTS ───
│   │
│   ├── ui/                     # Shared UI primitives
│   │   ├── index.ts            # Barrel export
│   │   └── button.tsx          # Button (primary/secondary/outline/ghost, sm/md/lg)
│   │
│   ├── layout/                 # Layout components
│   │   ├── index.ts            # Barrel export
│   │   └── navbar.tsx          # Navbar (nav links, Clerk UserButton placeholder)
│   │
│   ├── dashboard/              # Dashboard-specific components
│   │   └── index.ts            # Barrel export (ready for components)
│   │
│   ├── roadmaps/               # Roadmaps-specific components
│   │   └── index.ts            # Barrel export (ready for components)
│   │
│   ├── tasks/                  # Tasks-specific components
│   │   └── index.ts            # Barrel export (ready for components)
│   │
│   ├── resume/                 # Resume-specific components
│   │   └── index.ts            # Barrel export (ready for components)
│   │
│   ├── interview/              # Interview-specific components
│   │   └── index.ts            # Barrel export (ready for components)
│   │
│   └── assessment/             # Assessment-specific components
│       └── index.ts            # Barrel export (ready for components)
│
├── lib/                        # ─── SERVICE MODULES ───
│   │
│   ├── supabase.ts             # Supabase client (DB) — stub, activate when SDK installed
│   ├── neo4j.ts                # Neo4j driver (Graph DB) — stub, singleton pattern
│   ├── gemini.ts               # Gemini Flash client (AI) — stub
│   ├── sarvam.ts               # Sarvam AI client — stub, fetch helper
│   └── clerk.ts                # Clerk auth helpers — route config, public routes
│
├── types/                      # ─── TYPESCRIPT TYPE DEFINITIONS ───
│   │
│   ├── user.ts                 # User, UserProfile
│   ├── roadmap.ts              # Roadmap, SkillNode, Resource
│   ├── task.ts                 # Task, TaskFilter
│   ├── interview.ts            # InterviewSession, InterviewQuestion
│   └── resume.ts               # Resume, ResumeAnalysis, ResumeSuggestion
│
└── public/                     # ─── STATIC ASSETS ───
    │
    ├── file.svg                # Default Next.js SVG assets
    ├── globe.svg
    ├── next.svg
    ├── vercel.svg
    ├── window.svg
    │
    ├── logo/                   # Brand logos (empty, .gitkeep)
    ├── images/                 # Image assets (empty, .gitkeep)
    └── icons/                  # Icon assets (empty, .gitkeep)
```

---

## Route Summary

| Route                | File                                      | Type     | Purpose                        |
|----------------------|-------------------------------------------|----------|--------------------------------|
| `/`                  | `app/page.tsx`                            | Static   | Landing / Home page            |
| `/sign-in/*`         | `app/sign-in/[[...sign-in]]/page.tsx`     | Dynamic  | Clerk sign-in (catch-all)      |
| `/sign-up/*`         | `app/sign-up/[[...sign-up]]/page.tsx`     | Dynamic  | Clerk sign-up (catch-all)      |
| `/assessment`        | `app/assessment/page.tsx`                 | Static   | Skill assessments              |
| `/dashboard`         | `app/dashboard/page.tsx`                  | Static   | User dashboard overview        |
| `/roadmaps`          | `app/roadmaps/page.tsx`                   | Static   | AI-generated learning roadmaps |
| `/tasks`             | `app/tasks/page.tsx`                      | Static   | Preparation task tracker       |
| `/resume`            | `app/resume/page.tsx`                     | Static   | Resume analysis & improvement  |
| `/interview`         | `app/interview/page.tsx`                  | Static   | AI mock interviews             |
| `/progress`          | `app/progress/page.tsx`                   | Static   | Progress analytics             |
| `/settings`          | `app/settings/page.tsx`                   | Static   | Account & app settings         |

## API Route Summary

| Endpoint              | File                           | Methods    |
|-----------------------|--------------------------------|------------|
| `/api/auth`           | `app/api/auth/route.ts`        | GET, POST  |
| `/api/assessment`     | `app/api/assessment/route.ts`  | GET, POST  |
| `/api/dashboard`      | `app/api/dashboard/route.ts`   | GET, POST  |
| `/api/roadmaps`       | `app/api/roadmaps/route.ts`    | GET, POST  |
| `/api/tasks`          | `app/api/tasks/route.ts`       | GET, POST  |
| `/api/resume`         | `app/api/resume/route.ts`      | GET, POST  |
| `/api/interview`      | `app/api/interview/route.ts`   | GET, POST  |

## Tech Stack

| Layer          | Technology                     |
|----------------|--------------------------------|
| Framework      | Next.js 16 (App Router)        |
| Language       | TypeScript (strict mode)       |
| UI Library     | React 19                       |
| Styling        | Tailwind CSS v4                |
| Auth           | Clerk                          |
| Database       | Supabase (PostgreSQL)          |
| Graph Database | Neo4j                          |
| AI             | Google Gemini Flash, Sarvam AI |
| Linting        | ESLint (core-web-vitals + TS)  |
| Bundler        | Turbopack                      |
