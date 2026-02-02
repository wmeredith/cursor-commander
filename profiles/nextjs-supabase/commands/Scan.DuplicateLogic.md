## Scan for Duplicate Logic (DRY Violations)

### Prerequisites

Apply: `_Base.Context`

Scan for repeated logic patterns that could be consolidated into shared utilities, hooks, or components to better follow DRY principles.

## Duplication Criteria

- **Exact**: 90%+ identical (excluding variable names) — Always consolidate
- **Similar**: 60-90% identical structure, different data/fields — Usually consolidate
- **Pattern**: Same shape/flow, different domain — Consider shared abstraction

## Priority: Unused Existing Utilities (Bonus Points)

**SCAN THIS FIRST** — Higher value than finding new duplicates. Look for places that should use existing consolidated utilities but don't.

### Existing Utilities to Check Usage Of

1. **Auth helpers** (`lib/api-helpers/auth.ts`)
   - `requireAuth()` — Search for manual `getUser()` or auth checks that should use this
   - `getOptionalAuth()` — Search for try/catch around auth that should use this

2. **Error handling** (`lib/api-helpers/errors.ts`)
   - `handleApiError()` — Search for manual `NextResponse.json({ error: ... })` in catch blocks

3. **Validation** (`lib/validation/`)
   - Check if API routes have inline validation that duplicates `field-validators.ts`
   - Look for repeated regex that exists in `constants.ts`

4. **Supabase clients** (`lib/supabase/`)
   - `createServerClient()` — Search for manual Supabase client creation
   - Check for direct `@supabase/supabase-js` imports that should use wrappers

5. **Custom hooks** (`/hooks`)
   - Inventory existing hooks, then search for inline state patterns they replace

### How to Find Missed Usages

```
# Find where utility IS used (establish pattern)
grep "requireAuth" --glob "app/api/**"

# Find where it SHOULD be used but isn't (auth without the helper)
grep "getUser\(\)" --glob "app/api/**"
grep "supabase.auth" --glob "app/api/**"
```

Mark these as **High Priority** — they're quick wins with zero abstraction design needed.

## Scan Modes

### Quick Scan (5 min) — Run first

1. **Missed utility usage** — Check "Priority: Unused Existing Utilities" section above
2. Search for exact function name patterns: `validate*`, `format*`, `parse*`, `handle*`
3. Check API routes for repeated auth/validation blocks
4. Scan hooks/ for similar state patterns
5. Look for repeated Supabase query shapes

### Deep Scan (15+ min) — Run if Quick finds issues

1. Semantic search for similar logic flows
2. Cross-file component comparison
3. Full type definition analysis
4. Form pattern analysis

## Scanning Strategy (ordered by typical yield)

### 1. API Route Patterns (`/app/api`) — Highest yield

Search patterns:

- `grep "requireAuth\(\)" --glob "app/api/**/*.ts"` — Find auth patterns
- `grep "getOptionalAuth\(\)" --glob "app/api/**/*.ts"` — Find optional auth
- `grep "handleApiError" --glob "app/api/**/*.ts"` — Find error handling

Check for:

- Similar authentication checks
- Repeated request validation patterns
- Similar response formatting
- Repeated database query patterns

### 2. Validation Logic (`/lib/validation`, `/app/api`)

Search patterns:

- `grep "export (const|function) validate" --glob "**/*.ts"` — Find validators
- `grep "\.test\(|\.match\(" --glob "lib/validation/**"` — Find regex patterns

Check for:

- Similar validation patterns across different validators
- Repeated regex patterns or validation rules
- Validation logic duplicated in API routes vs components

### 3. Data Fetching Patterns (`/app`, `/components`)

Search patterns:

- `grep "\.from\(.+\)\.select\(" --glob "**/*.ts{,x}"` — Find Supabase queries
- `grep "await fetch\(" --glob "**/*.ts{,x}"` — Find fetch calls

Check for:

- Similar data fetching logic (Supabase queries, API calls)
- Repeated query patterns with only table/field differences
- Similar error handling around data fetching
- Repeated loading/error state management

### 4. Form Patterns (`/components`)

Search patterns:

- `grep "handleSubmit|onSubmit" --glob "components/**/*.tsx"` — Find form handlers
- `grep "useState.*error|setError" --glob "**/*.tsx"` — Find error state

Check for:

- Forms with similar validation logic
- Repeated form state management
- Similar submission handling patterns
- Repeated field validation logic

### 5. Similar Function Implementations (`/lib`, `/app/api`, `/components`)

Search patterns:

- `grep "const handle\w+ = " --glob "**/*.tsx"` — Find handler functions
- `grep "export const format" --glob "lib/**/*.ts"` — Find formatters

Check for:

- Functions with similar names/patterns
- Function bodies with similar logic flows (>10 lines)
- Functions that differ only by parameters or data types
- Copy-paste patterns with minor variations

### 6. Error Handling (`/lib`, `/app/api`, `/components`)

Search patterns:

- `grep "catch \(|\.catch\(" --glob "**/*.ts{,x}"` — Find catch blocks
- `grep "console\.(error|warn)" --glob "**/*.ts{,x}"` — Find logging

Check for:

- Similar try/catch patterns
- Repeated error message formatting
- Duplicated error logging patterns
- Similar error state management

### 7. Component Logic (`/components`, `/app`)

Check for:

- Components with similar prop handling patterns
- Repeated event handlers (handleSubmit, handleChange, etc.)
- Similar state management patterns
- Components that could share hooks or utilities

### 8. Type Definitions (`/lib`, `/app`) — Lower yield

Check for:

- Similar TypeScript interfaces/types
- Types that could be generic or shared
- Repeated type patterns with minor variations

## Project-Specific Patterns to Check

- `requireAuth()` / `getOptionalAuth()` usage consistency in API routes
- Supabase query patterns (`.from().select().eq()`) — look for repeated shapes
- `handleApiError()` usage — should be consistent across all API routes
- Form submission handlers with similar validation flows
- Loading/error state patterns in components

## Parallel Search Groups

Run these simultaneously for efficiency:

- **Group A**: `/lib/validation`, `/lib/api-helpers` (validation patterns)
- **Group B**: `/app/api/**/route.ts` (API patterns)
- **Group C**: `/components`, `/app/**/page.tsx` (UI patterns)

## Exit Criteria

- Stop scanning category if 5+ high-priority items found (focus on fixing first)
- Skip lower-yield scans (types, component logic) if <30 min available
- Limit initial scan to files modified in last 30 days for faster iteration

## Classification

**Highest Priority: Missed Utility Usage** — Existing utility available but not used; quick fix, no design needed
**High Priority Consolidation** — Exact or near-exact duplicates, clear extraction opportunity
**Medium Priority Consolidation** — Similar patterns with minor variations, could benefit from shared utility
**Low Priority Consolidation** — Similar but contextually different, consolidation may reduce clarity
**Pattern Opportunity** — Repeated patterns that could use a shared abstraction (hook, HOC, utility)

## Output Format

## Summary

<count of items by category>

## Missed Utility Usage (Quick Wins)

- [ ] `path/file.ts:L42` — Manual auth check → Use `requireAuth()` from `lib/api-helpers/auth.ts`
- [ ] `path/file.ts:L78` — Inline error response → Use `handleApiError()` from `lib/api-helpers/errors.ts`
- [ ] `path/file.ts:L15` — Inline validation → Use `validateX()` from `lib/validation/field-validators.ts`

## High Priority Consolidation

- [ ] `path/file1.ts:function1` + `path/file2.ts:function2` — <description of duplication> — Extract to `lib/shared/utility.ts`
- [ ] `path/file1.tsx:Component1` + `path/file2.tsx:Component2` — <description of duplication> — Extract shared logic to hook/utility

## Medium Priority Consolidation

- [ ] `path/file1.ts:function1` + `path/file2.ts:function2` — <description of similarity> — Consider shared utility with parameters
- [ ] `path/file1.tsx` + `path/file2.tsx` — <description of pattern> — Extract to shared component/hook

## Low Priority Consolidation

- [ ] `path/file1.ts` + `path/file2.ts` — <description> — Similar but contextually different, review if consolidation improves clarity

## Pattern Opportunities

- [ ] `<pattern description>` — Found in N locations — Consider creating `<suggested abstraction>` (hook/utility/HOC)

## Recommended Actions

<prioritized consolidation tasks with suggested refactoring approach>

## Last Step

Ask if I would like to: 1) Extract all high-priority duplicates, 2) Review each item one by one, 3) Start with a specific category, 4) Create consolidation plan for specific patterns
