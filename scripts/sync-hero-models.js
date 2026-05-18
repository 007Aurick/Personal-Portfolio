/**
 * Copies hero GLBs from `3D Models/` → `public/models/` for CRA/Vercel static hosting.
 * Commit `public/models/*.glb` so production can serve them (Git LFS if files are huge).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, '3D Models');
const DEST_DIR = path.join(ROOT, 'public', 'models');

const PAIRS = [
  ['Idle.glb', 'idle.glb'],
  ['Killshot.glb', 'killshot.glb'],
];

function destReady() {
  return PAIRS.every(([, destName]) => fs.existsSync(path.join(DEST_DIR, destName)));
}

if (!fs.existsSync(SRC_DIR)) {
  if (destReady()) {
    console.log('[sync-hero-models] Using committed public/models/ (no local 3D Models/)');
    process.exit(0);
  }
  console.warn(
    '[sync-hero-models] No 3D Models/ and no public/models/*.glb — deploy will use static hero fallback.'
  );
  process.exit(0);
}

fs.mkdirSync(DEST_DIR, { recursive: true });

for (const [srcName, destName] of PAIRS) {
  const src = path.join(SRC_DIR, srcName);
  const dest = path.join(DEST_DIR, destName);
  if (!fs.existsSync(src)) {
    console.error('[sync-hero-models] Missing:', src);
    process.exit(1);
  }
  fs.copyFileSync(src, dest);
  const stat = fs.statSync(dest);
  console.log(`[sync-hero-models] ${srcName} → public/models/${destName} (${(stat.size / 1e6).toFixed(1)} MB)`);
}

console.log('[sync-hero-models] Commit public/models/ so Vercel can serve the GLBs.');
