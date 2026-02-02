## Next.js Checklist

### Server/Client Boundaries
- `"use client"` only where needed
- No server-only modules imported into client components (`fs`, server secrets)
- `cookies()` / `headers()` used only in server contexts

### Route Handlers (`app/api/**/route.ts`)
- Return correct status codes
- JSON shape consistent
- Error responses handled properly
- Auth middleware applied where needed

### Server Actions
- Validate inputs (Zod schemas)
- Handle failures gracefully
- Return appropriate error states
- Revalidate paths/tags as needed

### Data Fetching
- Use server components when possible
- Proper use of `cache()` and `revalidate`
- Avoid waterfalls (parallel fetching)
- Error boundaries for suspense
