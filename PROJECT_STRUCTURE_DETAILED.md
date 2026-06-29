**Project: Skilect — Detailed Folder & File Overview**

This document lists the main folders and files in the workspace and provides short descriptions of what each file contains and its purpose.

**Top Level**
- **README.md**: [README.md](README.md) — Project overview, goals, tech stack, architecture, team, and workflow (human-facing project summary).
- **package.json**: [package.json](package.json) — npm scripts and dependencies (Next 16, React 19, Clerk, Supabase, Neo4j, Gemini). Contains `dev`, `build`, `start`, `lint` scripts.
- **tsconfig.json**: [tsconfig.json](tsconfig.json) — TypeScript compiler options (strict mode, path alias `@/*`).
- **next.config.ts**: [next.config.ts](next.config.ts) — Next.js config (image remote patterns for Clerk).
- **middleware.ts**: [middleware.ts](middleware.ts) — Clerk middleware that protects non-public routes.
- **ENV_SETUP.md**: [ENV_SETUP.md](ENV_SETUP.md) — Environment variable setup instructions (Clerk, Supabase, Neo4j, Gemini, Sarvam).
- **FOLDER_STRUCTURE.md**: [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) — Existing higher-level project tree and route/API summaries (auto-generated reference).
- **supabase-schema.sql**: [supabase-schema.sql](supabase-schema.sql) — Database schema for Supabase (Postgres) used by the app.

**app/** (Next.js App Router)
- **app/layout.tsx**: [app/layout.tsx](app/layout.tsx) — Root HTML layout, font setup (Google fonts), `ClerkProvider` wrapper, global CSS import, page metadata.
- **app/globals.css**: [app/globals.css](app/globals.css) — Tailwind import, CSS variables and animations (readiness rotate, assessment animations), base styles.

- Routes (each route typically has a `page.tsx`):
  - **app/page.tsx** — Home / Landing page.
  - **app/sign-in/[[...sign-in]]/page.tsx** — Clerk sign-in catch-all route.
  - **app/sign-up/[[...sign-up]]/page.tsx** — Clerk sign-up catch-all route.
  - **app/assessment/page.tsx** — Assessment screens.
  - **app/dashboard/page.tsx** — Dashboard overview.
  - **app/roadmaps/page.tsx**: [app/(app)/roadmaps/page.tsx](app/(app)/roadmaps/page.tsx) — Client-side roadmaps UI: fetches `/api/roadmaps`, can call `/api/roadmaps/generate` to create AI roadmaps, UI for listing/selecting roadmaps and viewing roadmap nodes and tasks.
  - **app/tasks/page.tsx** — Tasks tracker UI.
  - **app/resume/page.tsx** — Resume analysis UI.
  - **app/interview/page.tsx** — Interview UI and mock interviews.
  - **app/progress/page.tsx** — Progress analytics.
  - **app/settings/page.tsx** — User settings.

- **app/api/** — Server-side API routes (Route files under `app/api/*`):
  - **app/api/assessment/** — Assessment API endpoints.
  - **app/api/roadmaps/** — Roadmaps endpoints including `generate` POST.
  - **app/api/tasks/** — Tasks endpoints.
  - **app/api/resume/** — Resume analysis endpoints.
  - **app/api/interview/** — Interview endpoints.
  - **app/api/dashboard/** — Dashboard data endpoints.

**components/** (React components)
- **components/ui/** — UI primitives: `button.tsx`, `input.tsx`, `modal.tsx`, `textarea.tsx`, `skeleton.tsx`, `badge.tsx`.
- **components/layout/** — Layout components: `dashboard-layout.tsx`, `dashboard-navbar.tsx`, `dashboard-sidebar.tsx`, `dashboard-topbar.tsx`.
- **components/assessment/** — Assessment cards, question components, progress bar, recommendation and score cards.
- **components/roadmaps/** — Roadmap-related components (renderer, timeline, cards).
- **components/resume/** — Resume upload and score components.
- **components/interview/** — Interview cards, history, session components.

**lib/** (Service clients and helpers)
- **lib/clerk.ts**: [lib/clerk.ts](lib/clerk.ts) — Clerk helpers and auth utilities.
- **lib/gemini.ts**: [lib/gemini.ts](lib/gemini.ts) — Wrapper/stub for Google Gemini client integration.
- **lib/sarvam.ts**: [lib/sarvam.ts](lib/sarvam.ts) — Sarvam AI client helper.
- **lib/neo4j.ts**: [lib/neo4j.ts](lib/neo4j.ts) — Neo4j driver setup (singleton pattern expected).
- **lib/supabase.ts**: [lib/supabase.ts](lib/supabase.ts) — Supabase client setup.
- **lib/mock-data.ts**: [lib/mock-data.ts](lib/mock-data.ts) — Local mock datasets used in development/testing.

**types/**
- Type definitions used across the app: `user.ts`, `task.ts`, `roadmap.ts`, `resume.ts`, `interview.ts`.

**public/**
- Static assets (icons, images, logo). Contains `logo/`, `images/landing/`, and `icons/` directories.

**Other notable files**
- **eslint.config.mjs** — ESLint configuration.
- **postcss.config.mjs** — PostCSS + Tailwind setup.
- **middleware.ts**: [middleware.ts](middleware.ts) — Route protection via Clerk (reiterated).

---

If you want a deeper per-file content summary (e.g., summarise every `page.tsx` or every file under `components/` and `lib/`), I can expand this document to include brief extracts and the first function/class definitions for each file. Tell me whether you want:

- Expand to every file under `app/` (small): include first 20 lines and a one-sentence summary.
- Expand to every file in `components/` and `lib/` (medium): include short summaries.
- Full exhaustive summary for all 160+ files (large): will take longer but I can generate it.

Generated on 2026-06-24.

---

**Expanded Per-File Summaries (selected files)**

Note: the sections below list representative files under `lib/`, `types/`, `components/`, and main `app/` pages with concise notes describing what each file implements and any important exports or runtime constraints.

**lib/**
- `lib/supabase.ts`: Initializes the Supabase client. Exports `supabase` (anon-key client), `createServerSupabaseClient()` (service-role server client), and `supabaseUrl`/`supabaseAnonKey`. Throws when required env vars are missing; server client must only be used server-side.
- `lib/sarvam.ts`: Thin authenticated fetch wrapper for Sarvam AI endpoints. Exports `sarvamFetch()` and constants `sarvamApiKey`/`sarvamApiUrl`. Injects `API-Subscription-Key` header and handles Content-Type defaults.
- `lib/neo4j.ts`: Singleton Neo4j driver helper. Exports `getNeo4jDriver()`, `runNeo4jQuery()` (session helper), and `closeNeo4jDriver()`. Requires `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` env vars.
- `lib/mock-data.ts`: Present but currently empty (placeholder for development fixtures).
- `lib/gemini.ts`: Gemini client helpers and a strong JSON schema (`roadmapResponseSchema`) used to validate roadmap-generation responses from Google Generative AI.
- `lib/clerk.ts`: Centralized Clerk helpers (re-exports server `auth/currentUser` helpers and client hooks). Exports `publicRoutes` and `ignoredRoutes` used by middleware.

**types/**
- `types/user.ts`: `User` and `UserProfile` interfaces (profile fields, skills, assessment flag).
- `types/task.ts`: `Task` interface and `TaskFilter` (priority/status/dates) used by task hooks and APIs.
- `types/roadmap.ts`: `Roadmap`, `SkillNode`, `Resource`, and `NodeStatus` types describing roadmap structure and ordering.
- `types/resume.ts`: `Resume`, `ResumeAnalysis`, and `ResumeSuggestion` types for resume upload and analysis results.
- `types/interview.ts`: `InterviewSession` and `InterviewQuestion` interfaces used by mock-interview flows and results.

**components/ui/** (shared primitives)
- `components/ui/index.ts`: Barrel exports for `Button`, `Card*` subcomponents, `Input`, `Textarea`, `Modal`, `Badge`, and `Skeleton`.
- `components/ui/button.tsx`: Reusable `Button` component with `variant` (`primary|secondary|outline|ghost`) and `size` props; returns styled `<button>`.
- `components/ui/input.tsx`: Labeled `Input` component with optional error message styling and id generation.
- `components/ui/modal.tsx`: Controlled `Modal` component (client-only) using `framer-motion` with Escape-to-close and body-scroll locking behavior.
- `components/ui/card.tsx`: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` simple layout primitives.

**components/layout/**
- `components/layout/index.ts`: Barrel exports for dashboard layout primitives (`DashboardSidebar`, `DashboardTopbar`, `DashboardNavbar`, `DashboardLayout`).
- `components/layout/dashboard-topbar.tsx`: Topbar with user greeting (uses `useUser`/`UserButton` from Clerk), route-specific action buttons, and event dispatch for opening the new-task drawer.

**components/roadmaps/**
- `components/roadmaps/RoadmapRenderer.tsx`: Visual renderer for roadmap nodes. Defines typed `SkillNode` and `Task` props and renders responsive card grid; nodes are sorted and locked/unlocked by index.
- `components/roadmaps/roadmap-card.tsx`: Compact `RoadmapCard` showing title, description, and progress bar.
- `components/roadmaps/roadmap-timeline.tsx`: Timeline component that displays steps with status-dependent styles.

**components/tasks/**
- `components/tasks/task-list.tsx`: Small wrapper to display lists of task cards with an optional title.
- `components/tasks/task-card.tsx`: Individual task card with status and priority badges, due date, and action buttons.

**components/resume/**
- `components/resume/resume-upload.tsx`: Client-only drag-and-drop resume uploader (PDF/DOC/DOCX), exposes `onUpload` callback.
- `components/resume/resume-score.tsx`: Visual resume score card with progress circle and suggestions list.

**app/** (selected pages and API routes)
- `app/layout.tsx`: Root layout, imports global CSS, configures Google fonts (Plus Jakarta Sans, Geist Mono), and wraps pages with `ClerkProvider`.
- `app/globals.css`: Tailwind import, CSS variables, and small animation utilities used across the app (readiness rotate, assessment step entrance).
- `app/loading.tsx`: Global loading overlay using `framer-motion` and brand logo.

- `app/page.tsx`: Home/Landing page — composes landing primitives from `components/landing` (`Navbar`, `Hero`, `CTA`, etc.).

- `app/(app)/dashboard/page.tsx`: Dashboard page (client) — readiness ring, quick stats, active roadmaps list, and tasks; integrates `useDashboard` hook and shows skeleton / error states.

- `app/(app)/tasks/page.tsx`: Tasks page (client) — advanced UI for filters, task drawer (create/edit), `useTasks` hook integration, and task cards with priority/status mapping.

- `app/(app)/resume/page.tsx`: Resume analyzer UI (client) — file upload, target role input, call to `/api/resume/analyze`, shows `ResumeAnalysis` results and actions to generate a roadmap or create tasks programmatically.

- `app/(app)/roadmaps/page.tsx`: Roadmaps UI (client) — lists saved roadmaps (fetches `/api/roadmaps`), calls `/api/roadmaps/generate` to request an AI-generated roadmap, shows a graph and task sidebar for nodes (this file was summarized earlier and remains a central client-side entrypoint).

- `app/(app)/interview/page.tsx`: Interview flow page — multi-phase flow (`setup`, `session`, `results`) composed from local `components/interview/*` components and `useInterview` hook.

- `app/(app)/progress/page.tsx`: Progress dashboard page — readiness hero, stats cards, and trend UI driven by `useDashboard`.

- `app/(app)/settings/page.tsx`: Settings page with profile editing, security (password and 2FA toggles), active session revocation, and a danger-zone account-delete modal. Uses `Card` primitives and `Modal`.

**app/sign-in & sign-up**
- `app/sign-in/[[...sign-in]]/page.tsx`: Thin wrapper that renders Clerk's `<SignIn />` component.
- `app/sign-up/[[...sign-up]]/page.tsx`: Thin wrapper that renders Clerk's `<SignUp />` component.

**app/api/** (server route overview — selected)
- `app/api/assessment/route.ts`: Assessment endpoints (GET/POST) and onboarding helpers.
- `app/api/roadmaps/generate/route.ts`: POST endpoint used by the client to request an AI-generated roadmap. Relies on `lib/gemini.ts` and `roadmapResponseSchema` for validation.
- `app/api/resume/analyze/route.ts`: Accepts multipart resume uploads and returns `ResumeAnalysis`.
- `app/api/tasks/route.ts`: Tasks CRUD endpoints used by the `Tasks` UI.
- `app/api/dashboard/route.ts`: Dashboard data aggregator endpoint.

---

If you want, I can now:
- Expand this file to include the first ~20 lines of every file in `components/` and `app/` (medium expansion).
- Or produce a full exhaustive per-file one-line summary for all 160+ files (large expansion).

Tell me which expansion level you want and I will update `PROJECT_STRUCTURE_DETAILED.md` accordingly.

---

**Full per-file one-line summaries**

- [PROJECT_STRUCTURE_DETAILED.md](PROJECT_STRUCTURE_DETAILED.md): This document (current) describing project structure and file summaries.
- [postcss.config.mjs](postcss.config.mjs): PostCSS configuration for Tailwind CSS.
- [package.json](package.json): npm metadata, scripts, and dependencies for the project.
- [package-lock.json](package-lock.json): Locked dependency tree for the project.
- [next.config.ts](next.config.ts): Next.js configuration (image remote patterns, etc.).
- [next-env.d.ts](next-env.d.ts): Next.js TypeScript environment declarations.
- [middleware.ts](middleware.ts): Clerk middleware to protect non-public routes.
- [skills-lock.json](skills-lock.json): Lockfile for included skills in the workspace.
- [README.md](README.md): Project readme: overview, team, tech stack, and architecture.
- [lib/supabase.ts](lib/supabase.ts): Supabase client helpers (anon client + server-side service client factory).
- [lib/sarvam.ts](lib/sarvam.ts): Authenticated wrapper for Sarvam AI REST API calls.
- [lib/neo4j.ts](lib/neo4j.ts): Neo4j singleton driver and helper utilities.
- [lib/mock-data.ts](lib/mock-data.ts): Placeholder for development mock data (currently empty).
- [lib/gemini.ts](lib/gemini.ts): Google Gemini generative AI client helpers and response schema.
- [lib/clerk.ts](lib/clerk.ts): Centralized Clerk re-exports and route helper arrays.
- [TEAM_STRUCTURE.md](TEAM_STRUCTURE.md): Team roles and responsibilities document.
- [supabase-schema.sql](supabase-schema.sql): SQL schema used for Supabase database tables.
- [tsconfig.json](tsconfig.json): TypeScript compiler options and path aliases (`@/*`).
- [types/interview.ts](types/interview.ts): Types for interview sessions and questions.
- [types/user.ts](types/user.ts): User and UserProfile TypeScript interfaces.
- [types/task.ts](types/task.ts): Task and TaskFilter TypeScript types.
- [types/roadmap.ts](types/roadmap.ts): Roadmap and SkillNode type definitions.
- [types/resume.ts](types/resume.ts): Resume analysis and suggestion types.
- [ENV_SETUP.md](ENV_SETUP.md): Environment setup and API key instructions for services.
- [hooks/use-tasks.ts](hooks/use-tasks.ts): Client hook for fetching and mutating tasks (UI integration).
- [hooks/use-interview.ts](hooks/use-interview.ts): Hook powering interview flows and state.
- [hooks/use-dashboard.ts](hooks/use-dashboard.ts): Dashboard data hook aggregating stats and readiness.
- [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md): Auto-generated high-level folder and route overview.
- [eslint.config.mjs](eslint.config.mjs): ESLint configuration module.
- [public/window.svg](public/window.svg): Static window SVG asset.
- [public/vercel.svg](public/vercel.svg): Vercel logo SVG asset.
- [public/next.svg](public/next.svg): Next.js logo SVG asset.
- [public/logo/brand-logo.png](public/logo/brand-logo.png): Brand logo image used in the app.
- [public/logo/.gitkeep](public/logo/.gitkeep): Placeholder to keep `logo/` in repo.
- [components/ui/textarea.tsx](components/ui/textarea.tsx): Reusable textarea component with styling.
- [components/ui/skeleton.tsx](components/ui/skeleton.tsx): Simple skeleton UI primitive for loading states.
- [components/ui/modal.tsx](components/ui/modal.tsx): Animated modal component using Framer Motion (client-only).
- [components/ui/input.tsx](components/ui/input.tsx): Labeled input component with error handling.
- [components/ui/index.ts](components/ui/index.ts): Barrel exports for UI primitives.
- [components/ui/card.tsx](components/ui/card.tsx): Card primitives and subcomponents (Header, Title, Footer).
- [components/ui/button.tsx](components/ui/button.tsx): Button primitive supporting variants and sizes.
- [components/ui/badge.tsx](components/ui/badge.tsx): Small badge / pill component with variants.
- [.github/workflow/ci.yml](.github/workflow/ci.yml): CI workflow configuration for automated checks.
- [public/images/landing/landing-dashboard.png](public/images/landing/landing-dashboard.png): Landing page hero image.
- [public/images/.gitkeep](public/images/.gitkeep): Placeholder to keep images directory.
- [components/tasks/task-list.tsx](components/tasks/task-list.tsx): Wrapper component rendering a list of task cards.
- [components/tasks/task-card.tsx](components/tasks/task-card.tsx): UI card component representing an individual task.
- [components/tasks/index.ts](components/tasks/index.ts): Barrel exports for task components.
- [app/sign-up/[[...sign-up]]/page.tsx](app/sign-up/[[...sign-up]]/page.tsx): Clerk sign-up catch-all page using `<SignUp/>`.
- [public/icons/.gitkeep](public/icons/.gitkeep): Placeholder to keep icons folder.
- [public/globe.svg](public/globe.svg): Globe SVG asset.
- [public/file.svg](public/file.svg): File SVG asset.
- [.github/ISSUE_TEMPLATE/feature_request.md](.github/ISSUE_TEMPLATE/feature_request.md): Issue template for feature requests.
- [components/roadmaps/RoadmapRenderer.tsx](components/roadmaps/RoadmapRenderer.tsx): Roadmap visual renderer for nodes and tasks.
- [components/roadmaps/roadmap-timeline.tsx](components/roadmaps/roadmap-timeline.tsx): Timeline UI for roadmap steps.
- [components/roadmaps/roadmap-card.tsx](components/roadmaps/roadmap-card.tsx): Compact roadmap card with progress bar.
- [components/roadmaps/index.ts](components/roadmaps/index.ts): Barrel export for roadmap components.
- [components/interview/interview-history.tsx](components/interview/interview-history.tsx): Interview history list UI.
- [components/interview/interview-card.tsx](components/interview/interview-card.tsx): Small card used to show interview items.
- [components/interview/index.ts](components/interview/index.ts): Barrel export for interview components.
- [components/resume/resume-upload.tsx](components/resume/resume-upload.tsx): Drag-and-drop resume uploader component.
- [components/resume/resume-score.tsx](components/resume/resume-score.tsx): Resume score visual card.
- [components/resume/index.ts](components/resume/index.ts): Barrel export for resume components.
- [app/sign-in/[[...sign-in]]/page.tsx](app/sign-in/[[...sign-in]]/page.tsx): Clerk sign-in catch-all page using `<SignIn/>`.
- [app/page.tsx](app/page.tsx): Landing page composition importing landing components.
- [app/loading.tsx](app/loading.tsx): Global loading overlay used while app initializes.
- [app/layout.tsx](app/layout.tsx): Root layout with fonts, metadata and `ClerkProvider`.
- [app/globals.css](app/globals.css): Global styles and animation keyframes (Tailwind entry).
- [components/dashboard/stat-card.tsx](components/dashboard/stat-card.tsx): Small stat card used on dashboard.
- [components/dashboard/index.ts](components/dashboard/index.ts): Barrel exports for dashboard components.
- [components/dashboard/activity-card.tsx](components/dashboard/activity-card.tsx): Card displaying recent activity items.
- [components/layout/index.ts](components/layout/index.ts): Barrel exports for layout primitives.
- [components/layout/dashboard-topbar.tsx](components/layout/dashboard-topbar.tsx): Dashboard topbar with actions and avatar.
- [components/layout/dashboard-sidebar.tsx](components/layout/dashboard-sidebar.tsx): Sidebar navigation for dashboard layout.
- [components/layout/dashboard-navbar.tsx](components/layout/dashboard-navbar.tsx): Navbar for dashboard area.
- [components/layout/dashboard-layout.tsx](components/layout/dashboard-layout.tsx): Layout wrapper composing sidebar, topbar, and main area.
- [.agents/skills/clerk-webhooks/SKILL.md](.agents/skills/clerk-webhooks/SKILL.md): Skill documentation for Clerk webhooks (internal agent doc).
- [app/assessment/results/page.tsx](app/assessment/results/page.tsx): Assessment results page rendering analysis UI.
- [app/assessment/page.tsx](app/assessment/page.tsx): Assessment question/flow page.
- [components/assessment/strengths-card.tsx](components/assessment/strengths-card.tsx): UI card showing assessment strengths.
- [components/assessment/score-card.tsx](components/assessment/score-card.tsx): Score card used in assessment results.
- [components/assessment/recommendation-card.tsx](components/assessment/recommendation-card.tsx): Suggestion/recommendation UI element.
- [components/assessment/question-card.tsx](components/assessment/question-card.tsx): Individual assessment question card.
- [components/assessment/progress-bar.tsx](components/assessment/progress-bar.tsx): Progress bar used during assessments.
- [components/assessment/navigation-buttons.tsx](components/assessment/navigation-buttons.tsx): Prev/Next controls for assessment.
- [components/assessment/index.ts](components/assessment/index.ts): Barrel exports for assessment components.
- [components/assessment/gaps-card.tsx](components/assessment/gaps-card.tsx): Displays skill gaps identified by assessment.
- [components/assessment/assessment-layout.tsx](components/assessment/assessment-layout.tsx): Layout wrapper used by assessment pages.
- [components/assessment/assessment-card.tsx](components/assessment/assessment-card.tsx): Higher-level assessment card wrapper.
- [components/landing/testimonials.tsx](components/landing/testimonials.tsx): Landing page testimonials section.
- [components/landing/stats.tsx](components/landing/stats.tsx): Landing page statistics section.
- [components/landing/readiness.tsx](components/landing/readiness.tsx): Landing readiness section which highlights placement readiness.
- [components/landing/navbar.tsx](components/landing/navbar.tsx): Public site navbar used on landing pages.
- [components/landing/index.ts](components/landing/index.ts): Barrel exports for landing components.
- [components/landing/how-it-works.tsx](components/landing/how-it-works.tsx): Landing 'How it works' section.
- [components/landing/hero.tsx](components/landing/hero.tsx): Landing hero section with CTA.
- [components/landing/footer.tsx](components/landing/footer.tsx): Landing page footer component.
- [components/landing/features.tsx](components/landing/features.tsx): Landing features showcase section.
- [components/landing/cta.tsx](components/landing/cta.tsx): Call-to-action section on the landing page.
- [.agents/skills/clerk-webhooks/references/frameworks.md](.agents/skills/clerk-webhooks/references/frameworks.md): Internal reference doc for the skill.
- [.agents/skills/clerk-cli/SKILL.md](.agents/skills/clerk-cli/SKILL.md): Agent skill docs for Clerk CLI integration.
- [app/api/tasks/route.ts](app/api/tasks/route.ts): API route handling tasks CRUD operations.
- [.agents/skills/clerk-cli/references/recipes.md](.agents/skills/clerk-cli/references/recipes.md): Internal docs for Clerk CLI skill.
- [.agents/skills/clerk-cli/references/auth.md](.agents/skills/clerk-cli/references/auth.md): Auth references for the skill.
- [.agents/skills/clerk-cli/references/agent-mode.md](.agents/skills/clerk-cli/references/agent-mode.md): Agent-mode internal doc.
- [.agents/skills/clerk-testing/SKILL.md](.agents/skills/clerk-testing/SKILL.md): Skill doc for testing Clerk flows.
- [app/api/roadmaps/route.ts](app/api/roadmaps/route.ts): Roadmaps API endpoint (list, retrieve, persist roadmaps).
- [.agents/skills/clerk-backend-api/SKILL.md](.agents/skills/clerk-backend-api/SKILL.md): Internal skill documentation for backend API skill.
- [.agents/skills/clerk-nextjs-patterns/templates/nextjs-basic-auth/tsconfig.json](.agents/skills/clerk-nextjs-patterns/templates/nextjs-basic-auth/tsconfig.json): Template tsconfig for example template.
- [.agents/skills/clerk-nextjs-patterns/templates/nextjs-basic-auth/proxy.ts](.agents/skills/clerk-nextjs-patterns/templates/nextjs-basic-auth/proxy.ts): Example proxy middleware for template.
- [.agents/skills/clerk-nextjs-patterns/templates/nextjs-basic-auth/package.json](.agents/skills/clerk-nextjs-patterns/templates/nextjs-basic-auth/package.json): Example package.json for template.
- [.agents/skills/clerk-setup/SKILL.md](.agents/skills/clerk-setup/SKILL.md): Skill doc for Clerk setup guidance.
- [app/api/roadmaps/generate/route.ts](app/api/roadmaps/generate/route.ts): POST endpoint to generate AI roadmaps using Gemini/Sarvam.
- [.agents/skills/clerk-backend-api/scripts/extract-tags.js](.agents/skills/clerk-backend-api/scripts/extract-tags.js): Utility script for extracting tags from APIs.
- [.agents/skills/clerk-backend-api/scripts/extract-tag-endpoints.sh](.agents/skills/clerk-backend-api/scripts/extract-tag-endpoints.sh): Shell helper script for tag extraction.
- [.agents/skills/clerk-backend-api/scripts/extract-endpoint-detail.sh](.agents/skills/clerk-backend-api/scripts/extract-endpoint-detail.sh): Shell script used in the agent tooling.
- [.agents/skills/clerk-backend-api/scripts/execute-request.sh](.agents/skills/clerk-backend-api/scripts/execute-request.sh): Shell helper to execute API requests in examples.
- [.agents/skills/clerk-backend-api/scripts/api-specs-context.sh](.agents/skills/clerk-backend-api/scripts/api-specs-context.sh): Script generating API specs context for the skill.
- [.agents/skills/clerk-nextjs-patterns/app/page.tsx](.agents/skills/clerk-nextjs-patterns/app/page.tsx): Example app page in the clerk-nextjs-patterns template.
- [.agents/skills/clerk-nextjs-patterns/app/layout.tsx](.agents/skills/clerk-nextjs-patterns/app/layout.tsx): Example layout in the clerk-nextjs-patterns template.
- [.agents/skills/clerk-nextjs-patterns/SKILL.md](.agents/skills/clerk-nextjs-patterns/SKILL.md): Skill doc describing Next.js patterns.
- [.agents/skills/clerk-setup/evals/evals.json](.agents/skills/clerk-setup/evals/evals.json): Evaluation data for the Clerk setup skill.
- [.agents/skills/clerk-backend-api/evals/evals.json](.agents/skills/clerk-backend-api/evals/evals.json): Eval data for the backend API skill.
- [.agents/skills/clerk-nextjs-patterns/references/server-vs-client.md](.agents/skills/clerk-nextjs-patterns/references/server-vs-client.md): Reference about server vs client in Next.js patterns.
- [.agents/skills/clerk-nextjs-patterns/references/server-actions.md](.agents/skills/clerk-nextjs-patterns/references/server-actions.md): Docs on server actions.
- [.agents/skills/clerk-nextjs-patterns/references/middleware-strategies.md](.agents/skills/clerk-nextjs-patterns/references/middleware-strategies.md): Middleware strategy references.
- [.agents/skills/clerk-nextjs-patterns/references/caching-auth.md](.agents/skills/clerk-nextjs-patterns/references/caching-auth.md): Caching/auth reference docs.
- [.agents/skills/clerk-nextjs-patterns/references/api-routes.md](.agents/skills/clerk-nextjs-patterns/references/api-routes.md): API route references.
- [app/api/resume/analyze/route.ts](app/api/resume/analyze/route.ts): Server route handling resume uploads and returning analysis.
- [.agents/skills/clerk-orgs/SKILL.md](.agents/skills/clerk-orgs/SKILL.md): Skill doc for Clerk orgs patterns.
- [.agents/skills/clerk-custom-ui/SKILL.md](.agents/skills/clerk-custom-ui/SKILL.md): Skill doc for Clerk custom UI patterns.
- [.agents/skills/clerk-nextjs-patterns/evals/evals.json](.agents/skills/clerk-nextjs-patterns/evals/evals.json): Eval JSON for the patterns skill.
- [.agents/skills/clerk-orgs/references/roles-permissions.md](.agents/skills/clerk-orgs/references/roles-permissions.md): Org roles/permissions reference.
- [.agents/skills/clerk-orgs/references/nextjs-patterns.md](.agents/skills/clerk-orgs/references/nextjs-patterns.md): Next.js patterns for orgs.
- [.agents/skills/clerk-orgs/references/invitations.md](.agents/skills/clerk-orgs/references/invitations.md): Invitations reference doc.
- [.agents/skills/clerk-orgs/references/enterprise-sso.md](.agents/skills/clerk-orgs/references/enterprise-sso.md): Enterprise SSO reference.
- [.agents/skills/clerk-custom-ui/core-3/show-component.md](.agents/skills/clerk-custom-ui/core-3/show-component.md): Example docs for show component customization.
- [.agents/skills/clerk-custom-ui/core-3/custom-sign-up.md](.agents/skills/clerk-custom-ui/core-3/custom-sign-up.md): Custom sign-up guidance.
- [.agents/skills/clerk-custom-ui/core-3/custom-sign-in.md](.agents/skills/clerk-custom-ui/core-3/custom-sign-in.md): Custom sign-in guidance.
- [.gitignore](.gitignore): Git ignore rules for the project.
- [app/api/interview/answer/route.ts](app/api/interview/answer/route.ts): API endpoint to submit interview answers (session storage/analysis).
- [.agents/skills/clerk-custom-ui/core-2/custom-sign-up.md](.agents/skills/clerk-custom-ui/core-2/custom-sign-up.md): Older custom sign-up doc.
- [.agents/skills/clerk-custom-ui/core-2/custom-sign-in.md](.agents/skills/clerk-custom-ui/core-2/custom-sign-in.md): Older custom sign-in doc.
- [app/api/assessment/route.ts](app/api/assessment/route.ts): Assessment API route for submitting and retrieving assessments.
- [app/api/dashboard/route.ts](app/api/dashboard/route.ts): Aggregated dashboard data endpoint.
- [app/(app)/template.tsx](app/(app)/template.tsx): App template wrapper component with simple motion transitions.
- [app/api/assessment/onboarding/route.ts](app/api/assessment/onboarding/route.ts): API route for assessment onboarding steps.
- [app/api/assessment/latest/route.ts](app/api/assessment/latest/route.ts): Returns latest assessment results.
- [app/(app)/loading.tsx](app/(app)/loading.tsx): Nested app loading component for the `(app)` parallel route.
- [app/(app)/layout.tsx](app/(app)/layout.tsx): Layout under the `(app)` parallel route used by authenticated pages.
- [app/(app)/tasks/page.tsx](app/(app)/tasks/page.tsx): Tasks page (client) with drawer and task management UI.
- [app/(app)/resume/page.tsx](app/(app)/resume/page.tsx): Resume analyzer UI (client) with upload and AI analysis flows.
- [app/api/auth/webhook/route.ts](app/api/auth/webhook/route.ts): Webhook endpoint for auth events (Clerk webhook receiver).
- [app/(app)/interview/types.ts](app/(app)/interview/types.ts): Local interview flow types used by components in the interview route.
- [app/(app)/interview/page.tsx](app/(app)/interview/page.tsx): Interview page orchestrating setup, session, and results views.
- [app/(app)/progress/page.tsx](app/(app)/progress/page.tsx): Progress page showing readiness hero and stats driven by `useDashboard`.
- [app/(app)/roadmaps/page.tsx](app/(app)/roadmaps/page.tsx): Roadmaps listing and per-roadmap viewer with node/task management.
- [app/(app)/settings/page.tsx](app/(app)/settings/page.tsx): Settings page for profile, security, sessions, and account deletion.
- [app/(app)/interview/components/interview-setup.tsx](app/(app)/interview/components/interview-setup.tsx): Interview setup form component.
- [app/(app)/interview/components/interview-session.tsx](app/(app)/interview/components/interview-session.tsx): Interview session UI handling Q&A and recording.
- [app/(app)/interview/components/interview-results.tsx](app/(app)/interview/components/interview-results.tsx): Displays interview results and feedback.
- [app/(app)/dashboard/page.tsx](app/(app)/dashboard/page.tsx): Main dashboard client page (readiness ring, roadmap list, today's tasks).
- [app/(app)/progress/components/ai-insights.tsx](app/(app)/progress/components/ai-insights.tsx): Small component showing AI-driven insights.
- [app/(app)/progress/components/achievements.tsx](app/(app)/progress/components/achievements.tsx): Achievements panel for progress page.
- [app/(app)/progress/components/consistency-graph.tsx](app/(app)/progress/components/consistency-graph.tsx): Graph showing consistency/streaks over time.
- [app/(app)/progress/components/stats-cards.tsx](app/(app)/progress/components/stats-cards.tsx): Cards summarizing progress stats.
- [app/(app)/progress/components/skill-radar.tsx](app/(app)/progress/components/skill-radar.tsx): Radar chart for skill distribution visualization.
- [app/(app)/progress/components/readiness-hero.tsx](app/(app)/progress/components/readiness-hero.tsx): Reusable readiness hero component used on progress page.
- [app/(app)/progress/components/journey-timeline.tsx](app/(app)/progress/components/journey-timeline.tsx): Timeline of user's learning journey.
