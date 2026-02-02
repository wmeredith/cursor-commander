#!/bin/bash

# Cursor Config Sync Script
# Syncs a profile's commands, rules, and AGENTS.md to a target project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory (where cursor-commander repo is)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
PROFILES_DIR="$REPO_DIR/profiles"

# Default options
DRY_RUN=false
COMMANDS_ONLY=false
RULES_ONLY=false
BACKUP=true
FORCE=false

# Usage function
usage() {
    echo "Usage: $0 <profile> <target-project-path> [options]"
    echo ""
    echo "Arguments:"
    echo "  profile              Name of the profile to sync (e.g., nextjs-supabase, base)"
    echo "  target-project-path  Path to the target project"
    echo ""
    echo "Options:"
    echo "  --dry-run           Show what would be done without making changes"
    echo "  --commands-only     Only sync commands directory"
    echo "  --rules-only        Only sync rules directory"
    echo "  --no-backup         Don't create backup of existing files"
    echo "  --force             Overwrite without prompting"
    echo "  -h, --help          Show this help message"
    echo ""
    echo "Available profiles:"
    ls -1 "$PROFILES_DIR" 2>/dev/null | grep -v "^\\." || echo "  (none found)"
    echo ""
    echo "Examples:"
    echo "  $0 nextjs-supabase ~/projects/my-app"
    echo "  $0 nextjs-supabase ~/projects/my-app --dry-run"
    echo "  $0 base ~/projects/my-app --commands-only"
    exit 1
}

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_dry_run() {
    echo -e "${YELLOW}[DRY-RUN]${NC} Would: $1"
}

# Create backup of a directory
create_backup() {
    local source_dir="$1"
    local backup_dir="$2"
    
    if [ -d "$source_dir" ] && [ "$(ls -A "$source_dir" 2>/dev/null)" ]; then
        if $DRY_RUN; then
            log_dry_run "Backup $source_dir to $backup_dir"
        else
            mkdir -p "$backup_dir"
            cp -r "$source_dir"/* "$backup_dir/" 2>/dev/null || true
            log_info "Backed up $source_dir to $backup_dir"
        fi
    fi
}

# Copy directory contents
copy_directory() {
    local source="$1"
    local dest="$2"
    local name="$3"
    
    if [ ! -d "$source" ]; then
        log_warning "Source $name directory not found: $source"
        return
    fi
    
    if [ ! "$(ls -A "$source" 2>/dev/null)" ]; then
        log_warning "Source $name directory is empty: $source"
        return
    fi
    
    if $DRY_RUN; then
        log_dry_run "Copy $source/* to $dest/"
        log_info "Files that would be copied:"
        ls -1 "$source" | sed 's/^/  - /'
    else
        mkdir -p "$dest"
        cp -r "$source"/* "$dest/"
        log_success "Copied $name to $dest"
    fi
}

# Copy single file
copy_file() {
    local source="$1"
    local dest="$2"
    local name="$3"
    
    if [ ! -f "$source" ]; then
        log_warning "Source $name file not found: $source"
        return
    fi
    
    if $DRY_RUN; then
        log_dry_run "Copy $source to $dest"
    else
        cp "$source" "$dest"
        log_success "Copied $name to $dest"
    fi
}

# Parse arguments
if [ $# -lt 2 ]; then
    usage
fi

PROFILE="$1"
TARGET_PATH="$2"
shift 2

# Parse options
while [ $# -gt 0 ]; do
    case "$1" in
        --dry-run)
            DRY_RUN=true
            ;;
        --commands-only)
            COMMANDS_ONLY=true
            ;;
        --rules-only)
            RULES_ONLY=true
            ;;
        --no-backup)
            BACKUP=false
            ;;
        --force)
            FORCE=true
            ;;
        -h|--help)
            usage
            ;;
        *)
            log_error "Unknown option: $1"
            usage
            ;;
    esac
    shift
done

# Validate profile
PROFILE_PATH="$PROFILES_DIR/$PROFILE"
if [ ! -d "$PROFILE_PATH" ]; then
    log_error "Profile not found: $PROFILE"
    echo ""
    echo "Available profiles:"
    ls -1 "$PROFILES_DIR" 2>/dev/null | grep -v "^\\." | sed 's/^/  - /' || echo "  (none found)"
    exit 1
fi

# Validate target path
if [ ! -d "$TARGET_PATH" ]; then
    log_error "Target directory not found: $TARGET_PATH"
    exit 1
fi

# Resolve to absolute path
TARGET_PATH="$(cd "$TARGET_PATH" && pwd)"

# Create timestamp for backup
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_DIR="$TARGET_PATH/.cursor-backup-$TIMESTAMP"

echo ""
log_info "Cursor Config Sync"
log_info "=================="
log_info "Profile: $PROFILE"
log_info "Target:  $TARGET_PATH"
if $DRY_RUN; then
    log_warning "DRY RUN MODE - No changes will be made"
fi
echo ""

# Check for existing .cursor directory
TARGET_CURSOR_DIR="$TARGET_PATH/.cursor"
if [ -d "$TARGET_CURSOR_DIR" ] && ! $FORCE && ! $DRY_RUN; then
    log_warning "Target already has a .cursor directory"
    read -p "Continue and potentially overwrite? [y/N] " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Aborted by user"
        exit 0
    fi
fi

# Create backup if needed
if $BACKUP && [ -d "$TARGET_CURSOR_DIR" ]; then
    log_info "Creating backup..."
    if ! $COMMANDS_ONLY; then
        create_backup "$TARGET_CURSOR_DIR/rules" "$BACKUP_DIR/rules"
    fi
    if ! $RULES_ONLY; then
        create_backup "$TARGET_CURSOR_DIR/commands" "$BACKUP_DIR/commands"
    fi
    if [ -f "$TARGET_PATH/AGENTS.md" ]; then
        if $DRY_RUN; then
            log_dry_run "Backup AGENTS.md to $BACKUP_DIR/"
        else
            mkdir -p "$BACKUP_DIR"
            cp "$TARGET_PATH/AGENTS.md" "$BACKUP_DIR/"
            log_info "Backed up AGENTS.md"
        fi
    fi
fi

# Sync commands
if ! $RULES_ONLY; then
    log_info "Syncing commands..."
    copy_directory "$PROFILE_PATH/commands" "$TARGET_CURSOR_DIR/commands" "commands"
fi

# Sync rules
if ! $COMMANDS_ONLY; then
    log_info "Syncing rules..."
    copy_directory "$PROFILE_PATH/rules" "$TARGET_CURSOR_DIR/rules" "rules"
fi

# Sync AGENTS.md
if ! $COMMANDS_ONLY && ! $RULES_ONLY; then
    if [ -f "$PROFILE_PATH/AGENTS.md" ]; then
        log_info "Syncing AGENTS.md..."
        copy_file "$PROFILE_PATH/AGENTS.md" "$TARGET_PATH/AGENTS.md" "AGENTS.md"
    fi
fi

echo ""
if $DRY_RUN; then
    log_info "Dry run complete. No changes were made."
else
    log_success "Sync complete!"
    if [ -d "$BACKUP_DIR" ]; then
        log_info "Backup saved to: $BACKUP_DIR"
    fi
fi
