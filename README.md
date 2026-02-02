# Cursor Commander

A repository for storing and syncing Cursor IDE configurations (commands, rules, and AGENTS.md) across projects.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/wmeredith/cursor-commander.git

# Sync a profile to your project
./cursor-commander/scripts/sync.sh nextjs-supabase ~/projects/my-app

# Or use Node.js (cross-platform)
node cursor-commander/scripts/sync.js nextjs-supabase ~/projects/my-app
```

## What Gets Synced

| Item | Location in Target Project | Description |
|------|---------------------------|-------------|
| Commands | `.cursor/commands/` | Reusable command prompts invoked via `@CommandName` |
| Rules | `.cursor/rules/` | Persistent AI guidance (`.mdc` files) |
| AGENTS.md | `./AGENTS.md` | Project-specific context for the AI |

## Profiles

Profiles are pre-configured sets of commands, rules, and AGENTS.md files for specific tech stacks.

### Available Profiles

| Profile | Description |
|---------|-------------|
| `nextjs-supabase` | Next.js 16 + Supabase + Tailwind + shadcn/ui |
| `base` | Universal commands (placeholder for future) |

### Profile Structure

```
profiles/
├── nextjs-supabase/
│   ├── commands/           # .cursor/commands/ files
│   ├── rules/              # .cursor/rules/ files
│   └── AGENTS.md           # Project context template
└── base/
    ├── commands/
    └── rules/
```

## Usage

### Basic Sync

```bash
# Bash (macOS/Linux)
./scripts/sync.sh <profile> <target-path>

# Node.js (cross-platform)
node scripts/sync.js <profile> <target-path>
```

### Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Preview changes without making them |
| `--commands-only` | Only sync the commands directory |
| `--rules-only` | Only sync the rules directory |
| `--no-backup` | Don't create backup of existing files |
| `--force` | Overwrite without prompting |
| `-h, --help` | Show help message |

### Examples

```bash
# Preview what would be synced
./scripts/sync.sh nextjs-supabase ~/projects/my-app --dry-run

# Only sync commands
./scripts/sync.sh nextjs-supabase ~/projects/my-app --commands-only

# Sync without backup (use with caution)
./scripts/sync.sh nextjs-supabase ~/projects/my-app --no-backup

# Force overwrite without prompting
./scripts/sync.sh nextjs-supabase ~/projects/my-app --force
```

### Backups

By default, the sync script creates a timestamped backup before overwriting:

```
.cursor-backup-20260202-153045/
├── commands/
├── rules/
└── AGENTS.md
```

## Adding a New Profile

1. Create a directory in `profiles/`:
   ```bash
   mkdir -p profiles/my-stack/{commands,rules}
   ```

2. Add your commands (`.md` files) to `commands/`

3. Add your rules (`.mdc` files) to `rules/`

4. Optionally add an `AGENTS.md` file

5. Update this README with the new profile

## Commands Structure

Commands use a composition pattern with fragments:

### Callable Commands
Invoked directly via `@CommandName` in chat (e.g., `@Review.Thorough`)

### Fragments (prefix `_`)
Reusable pieces that commands reference via `Apply: _FragmentName`

Example command:
```markdown
## Review Thorough

### Prerequisites
Apply: `_Base.Context`

### Checklists
Apply all:
- `_Checklist.Security`
- `_Checklist.Performance`
```

See `profiles/nextjs-supabase/commands/_readme.commands.md` for full documentation.

## Rules Structure

Rules use the `.mdc` extension with optional frontmatter:

```markdown
---
alwaysApply: true
---

# Rule Title

Rule content here...
```

- `alwaysApply: true` - Rule is always active
- `alwaysApply: false` - Rule must be explicitly invoked

## Customization

### Per-Project Customization

After syncing, you can customize files in your project's `.cursor/` directory. These local changes won't affect the source profiles.

### Updating Profiles

To pull updates from this repo:

1. Re-run the sync script (it will backup existing files)
2. Or manually copy changed files

## Tips

- **Dry run first**: Use `--dry-run` to preview changes before syncing
- **Keep backups**: The default backup behavior helps recover if needed
- **Customize locally**: Edit synced files in your project for project-specific needs
- **Version your changes**: Commit the `.cursor/` directory to your project's git repo

## License

MIT License - see [LICENSE](LICENSE) for details.
