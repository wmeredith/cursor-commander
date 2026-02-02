# Project Agent Context

**IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for Next.js/React/TypeScript tasks. Consult `AGENTS.md`, `docs/`, and existing code patterns before relying on training data.**

## Stack

Next.js 16 (App Router)|React 19|TypeScript 5|Supabase (PostgreSQL)|Tailwind CSS 4|shadcn/ui

## Architecture Patterns

|app/:App Router routes|Server Components default, `'use client'` only when needed|API routes: `app/api/[route]/route.ts`
|auth:lib/api-helpers/auth.ts:{requireAuth(),getOptionalAuth(),requireAdminAuth()}|lib/auth/{is-admin.ts,require-admin.ts}|RLS policies enforce access
|request-parsing:lib/api-helpers/request.ts:{parseRequestBody()}|Standardized JSON parsing with error handling|Returns discriminated union for type safety
|error-handling:lib/api-helpers/errors.ts:{handleApiError(),createErrorResponse()}|handleApiError() for unexpected errors|createErrorResponse() for validation/expected errors
|supabase:lib/supabase/{client.ts:browser,server.ts:server,proxy.ts:API proxy,service.ts:admin only}|Prefer server-side fetching|API routes for mutations/admin
|rate-limit:lib/rate-limit/{memory:dev,database:prod}|Prefers user ID over IP|Fails open with logging
|validation:lib/validation/field-validators.ts|Shared client/server validators|Standardized error format|Use isValidUUID() from lib/validation/constants.ts
|testing:Jest + React Testing Library|lib/{test-utils.tsx,api-test-utils.ts}|Mock Supabase clients

## Module Organization (lib/)

||**Barrel exports (index.ts)**|Use when module is imported as a unit: `lib/validation`, `lib/rate-limit`, `lib/hifi/graph`, `lib/hifi/inference`, `lib/hifi/rules`
||**Direct imports (no index.ts)**|Use when module files are imported individually: `lib/api-helpers`, `lib/auth`, `lib/moderation`, `lib/supabase`
||**When to add index.ts**|Add barrel export when a directory's exports are commonly used together and consumers shouldn't need to know internal structure
||**When to use direct imports**|Use direct imports when consumers typically need only specific utilities, or when circular dependency risk exists

## Suspense & Data Fetching (Next.js 16)

|**Never make layouts async**|Layouts block all children; move auth/data to gated components inside Suspense
|**Pattern A: loading.tsx**|Add `loading.tsx` alongside `page.tsx` for route-level loading (preferred for navigation)
|**Pattern B: Suspense wrapper**|Keep page export sync, put async work in child component wrapped in `<Suspense fallback={...}>` for component-level loading
|**Skeleton fallbacks**|Use `<Skeleton>` or `animate-pulse` divs for fallbacks, not plain text like "Loading..."
|**Push cookies()/headers() down**|Access request APIs in deepest component possible, wrap in Suspense
|**Reference implementations**|`app/builds/loading.tsx` (route-level)|`app/profile/page.tsx` (component-level)|`app/protected/admin/layout.tsx` (AdminGate pattern)

## Component Organization

||**shadcn/ui components**|`components/ui/` is reserved for shadcn/ui primitives only (Button, Card, Input, etc.)
||**Custom components**|Place custom application components in `components/` root (e.g., `components/profile-menu.tsx`)
||**Naming**|Use kebab-case for files, PascalCase for exports: `auth-button.tsx` exports `AuthButton`

## Test Organization

||**Co-location**|Place test files next to source: `foo.ts` → `foo.test.ts`, `bar.tsx` → `bar.test.tsx`
||**Scripts**|Prefer TypeScript for scripts in `scripts/` directory

## Code Style

See `.cursor/rules/fe-dev.mdc`|Early returns|Tailwind only|shadcn preferred|handle\* prefix for events|const over function|TypeScript types required

## Data Model (see `docs/data-model.md`)

|builder_drafts:user_id PK,selection_config JSON,optional saved_system_id
|saved_systems:id UUID,user_id,selection_ids JSONB,selection_snapshot JSONB,total_parts/price_min/price_max computed,visibility:private|public,forked_from_id
|catalog_products:id TEXT,role,specs/commerce/curation JSONB| catalog_port_profiles:id TEXT,direction/domain/connector/channel_mode| catalog_product_ports:junction table
|saved_system_photos:system_id,storage_path,sort_order 1-3,status:pending|ready

## Speaker Amplification Taxonomy

||**Canonical field**: `specs.amplification: "powered" | "passive"` is the authoritative source for speaker amplification type
||**REQUIRED for new speakers**: All new speaker products MUST include `specs.amplification` set to `"powered"` or `"passive"`
||**Feature inference**: `powered_speaker` feature is inferred from `specs.amplification === "powered"`
||**DEPRECATED**: `specs.speakerType === "powered"` inference is legacy back-compat only; do NOT use for new products
||**Migration**: Once all catalog products use `specs.amplification`, remove `speakerType` inference from `inference-helpers.ts`
||**Built-in power**: Use `specs.ampPowerRmsW` for powered speakers' internal amp wattage (RMS)

## Common Tasks

|API route:app/api/[route]/route.ts|Use requireAuth()/getOptionalAuth()/requireAdminAuth()|parseRequestBody() for JSON parsing|handleApiError() for unexpected errors|createErrorResponse() for validation errors|Return JSON with status codes
|Admin route:app/api/admin/[route]/route.ts|Use requireAdminAuth() from lib/api-helpers/auth.ts|Standardized 403 Forbidden for non-admins|Use handleApiError() in catch blocks
|Page:app/[path]/page.tsx|Server Component default|Use Suspense for async data (see Suspense section)|Add loading.tsx or wrap async content in Suspense|`'use client'` only for interactivity
|Validation:lib/validation/field-validators.ts|Same validators client/server|Standardized errors|Use isValidUUID() from lib/validation/constants.ts (not regex)
|Testing:renderWithProviders() from lib/test-utils.tsx|createMockSupabaseClient() from lib/api-test-utils.ts|@testing-library/user-event

## Key Files

|docs/data-model.md:Full data model|lib/hifi/types.ts:System types|.cursor/rules/fe-dev.mdc:Coding standards

## Rules

|Check existing patterns first|Prefer server-side rendering|Use lib/hifi/types.ts for system code|Follow error handling patterns|Respect RLS policies|Use rate-limit utilities
