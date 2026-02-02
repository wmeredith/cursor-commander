## Scan for Dead Code

### Prerequisites
Apply: `_Base.Context`

Scan for unused or dead logic that can be safely removed.

## Scanning Strategy

### 1. Components (`/components`)
- Search for imports across codebase
- Check for transitive dead code (only used by other dead components)
- Flag starter template leftovers

### 2. Hooks (`/hooks`)
- Search for import statements
- Verify actual usage (not just re-exports)

### 3. Library Code (`/lib`)
- Search for imports and usage of exported functions/types
- Check for duplicated logic
- Identify legacy functions superseded by newer ones

### 4. API Routes (`/app/api`)
- Search for fetch calls to each endpoint
- Check if route is referenced in client code

### 5. Pages (`/app`)
- Check if linked/navigated to from anywhere
- Flag generic starter template pages

### 6. Dependencies (`package.json`)
- Cross-reference packages with actual imports
- Flag packages only used by dead code

## Classification

**Definite Dead Code** — Zero references, safe to delete
**Legacy/Duplicated Code** — Superseded or redundant
**Questionable** — Needs verification (dynamic usage, test-only, feature flags)

## Output Format
## Summary
<count of items by category>

## Definite Dead Code
- [ ] `path/file.ts` — <reason> — Safe to delete

## Legacy/Duplicated Code
- [ ] `path/file.ts:functionName` — <what it duplicates> — Consider removing

## Questionable
- [ ] `path/file.ts` — <concern> — Needs verification

## Dependencies to Remove
- [ ] `package-name` — Only used by dead code

## Recommended Actions
<prioritized cleanup tasks>

## Last Step
Ask if I would like to: 1) Remove all definite dead code, 2) Review each item one by one, 3) Start with a specific category
