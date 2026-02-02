## Base Context

You are reviewing code in a **Node + Next.js (App Router)** codebase using **Supabase**, **TailwindCSS**, and **shadcn/ui**.

**IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for Next.js, React, TypeScript, and framework-specific tasks. Consult project documentation (`AGENTS.md`, `docs/`) and existing code patterns before relying on training data.**

### Validation Commands

- **Tests:** `npm test`
- **Lint:** `npm run lint`
- **Typecheck:** `tsc -p tsconfig.json --noEmit`
- **Dependency audit:** `npm audit`

### Key Conventions

- Style guide: `.cursor/rules/fe-dev.mdc`
- Server vs Client boundaries must be correct (`"use client"` only where needed)
- No server-only modules in client components (e.g., `fs`, server secrets)
- Supabase: Use `SUPABASE_ANON_KEY` client-side; `SERVICE_ROLE_KEY` server-only
