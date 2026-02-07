import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else if (entry.isSymbolicLink()) {
      const linkTarget = fs.readlinkSync(from);
      fs.symlinkSync(linkTarget, to);
    } else fs.copyFileSync(from, to);
  }
}

const repoRoot = path.resolve(process.cwd());
const cacheRoot = path.join(repoRoot, '.cache');
const clonedRepoDir = path.join(cacheRoot, 'AGNOSTIC');
const clonedViteDir = path.join(
  clonedRepoDir,
  'PublicLogic OS Component Library (4)',
);
const sourceRoot = process.env.HMLP_SOURCE_DIR || clonedViteDir;

const sourceDist = path.join(sourceRoot, 'dist');
const outputRoot = path.join(repoRoot, 'dist');
const destDir = path.join(outputRoot, 'hmlp');

function copyRootIndex() {
  const src = path.join(repoRoot, 'index.html');
  const dest = path.join(outputRoot, 'index.html');
  if (!fs.existsSync(src)) {
    throw new Error(`Root index.html not found: ${src}`);
  }
  fs.copyFileSync(src, dest);
}

function ensureSource() {
  // When a custom source dir is provided, we assume it is already present.
  if (process.env.HMLP_SOURCE_DIR) {
    if (!fs.existsSync(sourceRoot)) {
      throw new Error(`HMLP_SOURCE_DIR not found: ${sourceRoot}`);
    }
    return;
  }

  fs.mkdirSync(cacheRoot, { recursive: true });
  if (!fs.existsSync(clonedRepoDir)) {
    run('git', ['clone', '--depth', '1', 'https://github.com/97n8/AGNOSTIC.git', clonedRepoDir], {
      cwd: cacheRoot,
    });
  } else {
    // Keep the cached clone fresh across builds (Vercel caches .cache between deploys).
    run('git', ['fetch', '--depth', '1', 'origin', 'main'], { cwd: clonedRepoDir });
    run('git', ['reset', '--hard', 'FETCH_HEAD'], { cwd: clonedRepoDir });
    run('git', ['clean', '-fdx'], { cwd: clonedRepoDir });
  }

  if (!fs.existsSync(sourceRoot)) {
    throw new Error(
      `HMLP source not found after clone: ${sourceRoot}\n` +
        `Set HMLP_SOURCE_DIR to override the source directory.`,
    );
  }
}

ensureSource();

// Preserve runtime config if present (don’t stomp secrets/ids during builds).
const repoConfigPath = path.join(repoRoot, 'hmlp', 'config.js');
const existingConfigPath = path.join(destDir, 'config.js');
const preservedConfig = fs.existsSync(repoConfigPath)
  ? fs.readFileSync(repoConfigPath, 'utf8')
  : null;

run('npm', ['--prefix', sourceRoot, 'ci']);
run(
  'npm',
  ['--prefix', sourceRoot, 'run', 'build'],
  {
    env: {
      ...process.env,
      VITE_BASE: '/hmlp/',
      VITE_DEMO_MODE: process.env.VITE_DEMO_MODE ?? 'false',
    },
  },
);

if (!fs.existsSync(sourceDist)) {
  throw new Error(`Build output missing: ${sourceDist}`);
}

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });
copyRootIndex();
copyDir(sourceDist, destDir);

if (preservedConfig) {
  fs.writeFileSync(existingConfigPath, preservedConfig);
}

console.log(`Published ${sourceDist} → ${destDir}`);
