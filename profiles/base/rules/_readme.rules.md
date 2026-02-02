# Base Rules

Universal Cursor rules that work across any tech stack.

## Rule File Format

Rules use the `.mdc` extension (Markdown Config) with optional frontmatter:

```markdown
---
alwaysApply: true
---

# Rule Title

Rule content here...
```

### Frontmatter Options

- `alwaysApply: true` - Rule is always active
- `alwaysApply: false` - Rule must be explicitly invoked

## Adding Rules

1. Create a new `.mdc` file in this directory
2. Add frontmatter if needed
3. Write clear, actionable guidance
4. Update this README with the new rule
