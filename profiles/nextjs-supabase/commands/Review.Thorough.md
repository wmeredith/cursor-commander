## Review Thorough

### Prerequisites
Apply: `_Base.Context`

### Scope Mode
- **Diff mode** (default): Review ONLY files changed in this diff. Do not refactor unrelated code.
- **Full mode**: When reviewing a folder/codebase (e.g., `@app/`), assess all code in scope.

### Validation
- Run tests: `npm test` (or explain why you cannot)
- Run lint/typecheck: `npm run lint` and `tsc -p tsconfig.json --noEmit`

### Functionality & Correctness
- Confirm code meets stated requirements
- Verify tests cover critical paths; new tests exist for new/changed logic
- Check for: null/undefined refs, off-by-one errors, loop boundaries, malformed inputs

### Checklists
Apply all:
- `_Checklist.NextJS`
- `_Checklist.Supabase`
- `_Checklist.Security`
- `_Checklist.Performance`
- `_Checklist.UI`

### Maintainability
- Clear naming, single-purpose functions, avoid duplication
- Comments explain *why*, not just *what*
- Reduce cross-module dependencies where it improves testability

### AI Requirements
- Classify: **Mandatory** (bugs/security/correctness) vs **Optional** (style/perf/refactor)
- Explain assumptions + reasoning for complex logic
- Be skeptical: Don't invent APIs or files; if unsure, say so
- Respect scope: Diff-only review unless Full mode specified

### Output Format
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
Ask if I would like to review each item one by one. Every item should have "Skip" and "Not now, but note as possible future enhancement." When noting for future, add to `.cursor/plans/backlog20260113.plan.md`.
