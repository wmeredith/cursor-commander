## Performance Checklist

### Database
- No N+1 queries (batch/select with joins or `in()`)
- Fetch only required columns (`select()` specific fields)
- Indexes exist for frequent queries
- Pagination for large result sets

### React/Next.js
- Prefer server components for data fetching
- Avoid unnecessary re-renders in client components
- Validate caching/revalidation behavior
- Use `React.memo`, `useMemo`, `useCallback` appropriately

### Resources
- Promises awaited and errors handled
- No runaway loops or excessive allocations
- Large JSON payloads avoided
- Images optimized (next/image, proper sizing)

### Concurrency
- Race conditions identified and handled
- Deadlock potential assessed
- Resource cleanup (files, DB connections, subscriptions)
