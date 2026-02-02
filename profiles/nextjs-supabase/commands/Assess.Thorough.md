### Assess Thorough

### Context
You are reviewing code in a **Node + Next.js (App Router)** codebase using **Supabase**, **TailwindCSS**, and **shadcn/ui**. 

<!-- - **Style guide:** `[STYLE_GUIDE_PATH]` (or `AGENTS.md`) -->
- **Tests:** `npm test`
- **Dependency checks:** `npm audit`

### How to Validate
- Run tests using this exact command (or explain why you cannot run it):
  - `[TEST_COMMAND]`
- Run lint/typecheck if available (or explain why not):
  - `pnpm lint` / `npm run lint`
  - `pnpm typecheck` / `npm run typecheck` (or `tsc -p tsconfig.json --noEmit`)

### Functionality & Correctness Checklist
- Confirm the code meets stated requirements and intended behavior
- Verify:
  - existing tests still cover critical paths
  - new tests exist for new/changed logic (especially server actions / API routes / db calls)
- Check for:
  - null/undefined references
  - off-by-one errors
  - loop boundaries
  - unexpected/malformed inputs
- Next.js specifics:
  - Server vs Client boundaries are correct (`"use client"` only where needed)
  - No server-only modules imported into client components (e.g., `fs`, server secrets)
  - `cookies()` / `headers()` used only in server contexts
  - Route handlers (`app/api/**/route.ts`) return correct status codes and JSON shape
  - Server Actions validate inputs and handle failures gracefully

### Supabase Checklist
- Auth:
  - Uses `@supabase/auth-helpers-nextjs` / server client patterns correctly (no leaking service role key)
  - Authorization is enforced (RLS-aware). Do not rely on client-side checks for access control.
- Data access:
  - Queries are scoped to the authenticated user/org where appropriate
  - Error handling checks `error` and handles empty results safely
- Security:
  - No `service_role` key in client bundles or exposed env vars
  - Uses `SUPABASE_ANON_KEY` only in client; `SERVICE_ROLE_KEY` server-only

### Security Checklist (Web + Next.js)
- Input validation:
  - All user inputs validated and sanitized (consider Zod schemas)
  - No direct interpolation into SQL (avoid raw SQL unless parameterized)
- XSS:
  - Avoid `dangerouslySetInnerHTML`; if used, sanitize HTML
  - Ensure user-provided strings aren’t injected into HTML attributes unsafely
- AuthZ:
  - Authorization checks occur on every request/action that touches protected data
  - Principle of least privilege enforced (especially admin routes/actions)
- Sensitive data:
  - No secrets/PII in logs, responses, or client state
  - Env var usage is correct (`NEXT_PUBLIC_*` only for safe public values)

### Performance & Efficiency Checklist
- Avoid:
  - N+1 Supabase queries (batch/select with joins or `in()` where possible)
  - Fetching more columns than needed (`select()` only required fields)
  - Unnecessary re-renders in client components
- Next.js performance:
  - Prefer server components for data fetching when possible
  - Validate caching/revalidation behavior (don’t accidentally disable caching everywhere)
- Resource handling:
  - Ensure promises are awaited and errors handled
  - No runaway loops, excessive allocations, or large JSON payloads

### UI (Tailwind + shadcn/ui) Checklist
- Tailwind:
  - Class usage consistent; avoid inline styles unless necessary
  - Responsive classes correct and minimal
- shadcn/ui:
  - Uses components as intended (composition patterns, `asChild` where appropriate)
  - Accessibility:
    - labels for inputs
    - keyboard navigation preserved
    - `Dialog`, `Popover`, `DropdownMenu` usage correct
- UX:
  - Loading / empty / error states present where needed
  - Forms show validation feedback

### Maintainability & Style Checklist
- Enforce conventions from:
  - `/Users/wmeredith/Documents/Refractal Studio/Clients/Seek HiFi/Dev/buildhifi/.cursor/rules/fe-dev.mdc`
- Code quality:
  - Clear naming
  - Single-purpose functions
  - Avoid duplication
  - Comments explain *why*, not just *what*
- Coupling:
  - Reduce cross-module dependencies where it improves testability
  - Keep Supabase access centralized if that’s the project convention

### AI-Specific Requirements
- Classify feedback:
  - **Mandatory** (bugs/security/correctness)
  - **Optional** (style/perf/refactor)
- Explain assumptions + reasoning for complex logic
- Be skeptical:
  - Do not invent APIs or files
  - If unsure, say so and suggest how to verify
- Respect constraints:
  - Diff-only review, no unrelated refactors

### Output Format (use exactly)
## Summary
<high-level assessment>

## Mandatory Issues
- [ ] <issue> (file:line) — <why it matters> — <suggested fix>

## Optional Suggestions
- [ ] <suggestion> (file:line) — <why> — <possible approach>

## Questions / Clarifications
- [ ] <question>

## Final Recommendation
<Approve / Request Changes / Needs Clarification>

### Last Step
- Ask if I would like you to review each of these with me (ask questions) one by one and help me choose what to add and how to implement it. Every item should have "Skip" and "Not now, but note as possible future enhancement."