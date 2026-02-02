# Cursor Commands

## Structure

Commands are organized into two types:

### Callable Commands

Invoke directly via `@CommandName` in chat.

| Command                   | Purpose                                   |
| ------------------------- | ----------------------------------------- |
| `Review.Thorough`         | Full code review with all checklists      |
| `Review.Fast`             | Quick review for small changes            |
| `Review.Security`         | Security-focused review                   |
| `Review.Performance`      | Performance-focused review                |
| `Review.Supabase`         | Supabase auth/RLS review                  |
| `Review.UI+Accessibility` | UI and a11y review                        |
| `Scan.DeadCode`           | Find unused code                          |
| `AssessPlan`              | Review a plan for implementation concerns |
| `Assess.TestCoverage`     | Run test coverage report                  |
| `Seed.Catalog`            | Seed local catalog data                   |
| `Update.EmailTemplates`   | Push email templates to Supabase          |

### Fragments (prefix `_`)

Reusable pieces that commands reference. Not meant to be called directly.

| Fragment                 | Contains                                           |
| ------------------------ | -------------------------------------------------- |
| `_Base.Context`          | Stack info, validation commands, key conventions   |
| `_Context.CodeReview`    | Diff-only review scope instruction                 |
| `_Checklist.NextJS`      | Server/client boundaries, routing, server actions  |
| `_Checklist.Supabase`    | Auth, data access, RLS, security                   |
| `_Checklist.Security`    | Input validation, injection, authz, sensitive data |
| `_Checklist.Performance` | DB queries, React optimization, resources          |
| `_Checklist.UI`          | Tailwind, shadcn, accessibility, UX states         |
| `_Output.ReviewFormat`   | Standard review output template                    |
| `_LastStep.Interactive`  | Interactive review workflow prompt                 |

## Workflow Examples

### Standard Code Review

```
@Review.Thorough @path/to/file.tsx
```

### Quick Review for Small PR

```
@Review.Fast @lib/utils.ts
```

### Security Audit

```
@Review.Security @app/api/
```

### Full Codebase Assessment

```
@Review.Thorough Review the entire @components/ folder in Full mode
```

### Custom Review (mix fragments)

```
Apply _Base.Context, _Checklist.Supabase, _Checklist.Security and review @lib/supabase/
```

### Plan Review Before Implementation

```
@AssessPlan @.cursor/plans/my-feature.plan.md
```

## Composition Pattern

Commands reference fragments via `Apply: _FragmentName`. The LLM loads and applies the fragment content.

Example from `Review.Thorough.md`:

```markdown
### Prerequisites

Apply: `_Base.Context`

### Checklists

Apply all:

- `_Checklist.NextJS`
- `_Checklist.Supabase`
- `_Checklist.Security`
- `_Checklist.Performance`
- `_Checklist.UI`
```

## Updating

- **Stack changes**: Edit `_Base.Context.md`
- **Security best practices**: Edit `_Checklist.Security.md`
- **New checklist items**: Add to relevant `_Checklist.*.md`
- **Output format**: Edit `_Output.ReviewFormat.md`
- **Backlog path**: Update path in `_LastStep.Interactive.md`

## Naming Conventions

- `_` prefix = fragment (composition building block)
- `Review.*` = code review commands
- `Assess.*` = assessment/analysis commands
- `Scan.*` = codebase scanning commands
- `Seed.*` / `Update.*` = utility commands
