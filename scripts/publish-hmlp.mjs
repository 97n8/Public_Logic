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
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    return;
  }

  // Fallback: keep the marketing homepage even if the build root is not the repo root.
  fs.writeFileSync(
    dest,
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>PublicLogic</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#022c22" />
  <style>
    html, body { margin: 0; padding: 0; height: 100%; background: #022c22; overflow: hidden;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
    .loader { position: fixed; inset: 0; display: grid; place-items: center; color: rgba(255,255,255,0.85);
      z-index: 1; pointer-events: none; }
    .badge { display: inline-flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 999px;
      border: 1px solid rgba(52, 211, 153, 0.25); background: rgba(0,0,0,0.25); color: rgba(52, 211, 153, 0.95);
      font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; font-size: 11px; margin-bottom: 14px; }
    .title { font-size: 20px; font-weight: 900; letter-spacing: -0.02em; margin: 0 0 6px; text-align: center; }
    .sub { margin: 0; text-align: center; color: rgba(255,255,255,0.55); font-weight: 700; font-size: 13px; }
    iframe { position: relative; z-index: 2; border: none; width: 100%; height: 100vh; display: block; background: #022c22; }
  </style>
</head>
<body>
  <div class="loader" id="loader">
    <div>
      <div class="badge">PublicLogic</div>
      <p class="title">Loading…</p>
      <p class="sub">Smart Systems. Stronger Communities.</p>
    </div>
  </div>
  <iframe
    src="https://publiclogic.figma.site"
    title="PublicLogic"
    allow="clipboard-read; clipboard-write; fullscreen"
    onload="document.getElementById('loader').style.display='none';"
  ></iframe>
</body>
</html>
`,
  );
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
