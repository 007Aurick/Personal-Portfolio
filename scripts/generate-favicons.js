/**
 * Builds cropped favicons from public/PersonalLogo.png so the mark fills the tab.
 * Run: node scripts/generate-favicons.js
 */
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'public', 'PersonalLogo.png');
const BG = { r: 6, g: 8, b: 12, alpha: 1 };

const SIZES = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-48.png', size: 48 },
  { name: 'favicon-64.png', size: 64 },
  { name: 'apple-touch-icon.png', size: 180 },
];

async function main() {
  const trimmed = sharp(SOURCE).trim({ threshold: 12 });

  await Promise.all(
    SIZES.map(({ name, size }) =>
      trimmed
        .clone()
        .resize(size, size, {
          fit: 'contain',
          background: BG,
          kernel: sharp.kernel.lanczos3,
        })
        .png({ compressionLevel: 9 })
        .toFile(path.join(ROOT, 'public', name))
    )
  );

  await trimmed
    .clone()
    .resize(32, 32, { fit: 'contain', background: BG })
    .png()
    .toFile(path.join(ROOT, 'public', 'favicon.ico'));

  console.log('Favicons written to public/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
