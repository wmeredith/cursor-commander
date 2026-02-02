#!/usr/bin/env node

/**
 * Cursor Config Sync Script (Node.js)
 * Cross-platform script to sync a profile's commands, rules, and AGENTS.md to a target project
 * 
 * Usage: node sync.js <profile> <target-project-path> [options]
 */

const fs = require('fs');
const path = require('path');

// Get script directory (where cursor-commander repo is)
const SCRIPT_DIR = __dirname;
const REPO_DIR = path.dirname(SCRIPT_DIR);
const PROFILES_DIR = path.join(REPO_DIR, 'profiles');

// ANSI color codes
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Options
let options = {
  dryRun: false,
  commandsOnly: false,
  rulesOnly: false,
  backup: true,
  force: false
};

// Logging functions
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  dryRun: (msg) => console.log(`${colors.yellow}[DRY-RUN]${colors.reset} Would: ${msg}`)
};

// Get available profiles
function getAvailableProfiles() {
  try {
    return fs.readdirSync(PROFILES_DIR)
      .filter(f => !f.startsWith('.') && fs.statSync(path.join(PROFILES_DIR, f)).isDirectory());
  } catch {
    return [];
  }
}

// Show usage
function usage() {
  console.log(`
Usage: node sync.js <profile> <target-project-path> [options]

Arguments:
  profile              Name of the profile to sync (e.g., nextjs-supabase, base)
  target-project-path  Path to the target project

Options:
  --dry-run           Show what would be done without making changes
  --commands-only     Only sync commands directory
  --rules-only        Only sync rules directory
  --no-backup         Don't create backup of existing files
  --force             Overwrite without prompting
  -h, --help          Show this help message

Available profiles:
  ${getAvailableProfiles().map(p => `- ${p}`).join('\n  ') || '(none found)'}

Examples:
  node sync.js nextjs-supabase ~/projects/my-app
  node sync.js nextjs-supabase ~/projects/my-app --dry-run
  node sync.js base ~/projects/my-app --commands-only
`);
  process.exit(1);
}

// Create directory recursively
function mkdirp(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Copy directory contents recursively
function copyDir(src, dest) {
  mkdirp(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// List files in directory
function listFiles(dir) {
  try {
    return fs.readdirSync(dir).filter(f => !f.startsWith('.'));
  } catch {
    return [];
  }
}

// Check if directory has files
function hasFiles(dir) {
  return fs.existsSync(dir) && listFiles(dir).length > 0;
}

// Create backup of a directory
function createBackup(sourceDir, backupDir) {
  if (!hasFiles(sourceDir)) return;
  
  if (options.dryRun) {
    log.dryRun(`Backup ${sourceDir} to ${backupDir}`);
  } else {
    copyDir(sourceDir, backupDir);
    log.info(`Backed up ${sourceDir} to ${backupDir}`);
  }
}

// Copy directory with logging
function copyDirectory(source, dest, name) {
  if (!fs.existsSync(source)) {
    log.warning(`Source ${name} directory not found: ${source}`);
    return;
  }
  
  if (!hasFiles(source)) {
    log.warning(`Source ${name} directory is empty: ${source}`);
    return;
  }
  
  if (options.dryRun) {
    log.dryRun(`Copy ${source}/* to ${dest}/`);
    log.info('Files that would be copied:');
    listFiles(source).forEach(f => console.log(`  - ${f}`));
  } else {
    copyDir(source, dest);
    log.success(`Copied ${name} to ${dest}`);
  }
}

// Copy single file with logging
function copyFile(source, dest, name) {
  if (!fs.existsSync(source)) {
    log.warning(`Source ${name} file not found: ${source}`);
    return;
  }
  
  if (options.dryRun) {
    log.dryRun(`Copy ${source} to ${dest}`);
  } else {
    fs.copyFileSync(source, dest);
    log.success(`Copied ${name} to ${dest}`);
  }
}

// Simple prompt (synchronous via readline)
function prompt(question) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.toLowerCase());
    });
  });
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  const positionalArgs = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--commands-only':
        options.commandsOnly = true;
        break;
      case '--rules-only':
        options.rulesOnly = true;
        break;
      case '--no-backup':
        options.backup = false;
        break;
      case '--force':
        options.force = true;
        break;
      case '-h':
      case '--help':
        usage();
        break;
      default:
        if (arg.startsWith('-')) {
          log.error(`Unknown option: ${arg}`);
          usage();
        }
        positionalArgs.push(arg);
    }
  }
  
  if (positionalArgs.length < 2) {
    usage();
  }
  
  const profile = positionalArgs[0];
  let targetPath = positionalArgs[1];
  
  // Validate profile
  const profilePath = path.join(PROFILES_DIR, profile);
  if (!fs.existsSync(profilePath)) {
    log.error(`Profile not found: ${profile}`);
    console.log('\nAvailable profiles:');
    getAvailableProfiles().forEach(p => console.log(`  - ${p}`));
    process.exit(1);
  }
  
  // Validate and resolve target path
  targetPath = path.resolve(targetPath);
  if (!fs.existsSync(targetPath)) {
    log.error(`Target directory not found: ${targetPath}`);
    process.exit(1);
  }
  
  // Create timestamp for backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupDir = path.join(targetPath, `.cursor-backup-${timestamp}`);
  
  console.log('');
  log.info('Cursor Config Sync');
  log.info('==================');
  log.info(`Profile: ${profile}`);
  log.info(`Target:  ${targetPath}`);
  if (options.dryRun) {
    log.warning('DRY RUN MODE - No changes will be made');
  }
  console.log('');
  
  // Check for existing .cursor directory
  const targetCursorDir = path.join(targetPath, '.cursor');
  if (fs.existsSync(targetCursorDir) && !options.force && !options.dryRun) {
    log.warning('Target already has a .cursor directory');
    const answer = await prompt('Continue and potentially overwrite? [y/N] ');
    if (answer !== 'y') {
      log.info('Aborted by user');
      process.exit(0);
    }
  }
  
  // Create backup if needed
  if (options.backup && fs.existsSync(targetCursorDir)) {
    log.info('Creating backup...');
    if (!options.commandsOnly) {
      createBackup(path.join(targetCursorDir, 'rules'), path.join(backupDir, 'rules'));
    }
    if (!options.rulesOnly) {
      createBackup(path.join(targetCursorDir, 'commands'), path.join(backupDir, 'commands'));
    }
    const agentsMd = path.join(targetPath, 'AGENTS.md');
    if (fs.existsSync(agentsMd)) {
      if (options.dryRun) {
        log.dryRun(`Backup AGENTS.md to ${backupDir}/`);
      } else {
        mkdirp(backupDir);
        fs.copyFileSync(agentsMd, path.join(backupDir, 'AGENTS.md'));
        log.info('Backed up AGENTS.md');
      }
    }
  }
  
  // Sync commands
  if (!options.rulesOnly) {
    log.info('Syncing commands...');
    copyDirectory(
      path.join(profilePath, 'commands'),
      path.join(targetCursorDir, 'commands'),
      'commands'
    );
  }
  
  // Sync rules
  if (!options.commandsOnly) {
    log.info('Syncing rules...');
    copyDirectory(
      path.join(profilePath, 'rules'),
      path.join(targetCursorDir, 'rules'),
      'rules'
    );
  }
  
  // Sync AGENTS.md
  if (!options.commandsOnly && !options.rulesOnly) {
    const agentsMdSrc = path.join(profilePath, 'AGENTS.md');
    if (fs.existsSync(agentsMdSrc)) {
      log.info('Syncing AGENTS.md...');
      copyFile(agentsMdSrc, path.join(targetPath, 'AGENTS.md'), 'AGENTS.md');
    }
  }
  
  console.log('');
  if (options.dryRun) {
    log.info('Dry run complete. No changes were made.');
  } else {
    log.success('Sync complete!');
    if (fs.existsSync(backupDir)) {
      log.info(`Backup saved to: ${backupDir}`);
    }
  }
}

main().catch(err => {
  log.error(err.message);
  process.exit(1);
});
