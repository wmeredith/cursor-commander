# Base Commands

Universal commands that work across any tech stack.

## Structure

Commands are organized into two types:

### Callable Commands

Invoke directly via `@CommandName` in chat.

| Command | Purpose |
| ------- | ------- |
| *Add universal commands here* | *Description* |

### Fragments (prefix `_`)

Reusable pieces that commands reference. Not meant to be called directly.

| Fragment | Contains |
| -------- | -------- |
| *Add shared fragments here* | *Description* |

## Composition Pattern

Commands reference fragments via `Apply: _FragmentName`. The LLM loads and applies the fragment content.

Example:

```markdown
### Prerequisites

Apply: `_Base.Context`

### Checklists

Apply all:

- `_Checklist.Security`
- `_Checklist.Performance`
```

## Naming Conventions

- `_` prefix = fragment (composition building block)
- `Review.*` = code review commands
- `Assess.*` = assessment/analysis commands
- `Scan.*` = codebase scanning commands
- `Seed.*` / `Update.*` = utility commands

## Adding Commands

1. Create a new `.md` file in this directory
2. Use existing fragments via `Apply: _FragmentName`
3. Follow the naming conventions above
4. Update this README with the new command
