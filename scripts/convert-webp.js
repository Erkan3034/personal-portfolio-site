// Converts PNG/JPG images under public/ to WebP copies alongside originals.
// Usage: npm run generate:webp
// Skips favicons and pdfs.
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = path.resolve(process.cwd(), 'public');
const SKIP_NAMES = new Set(['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'manifest.json', 'robots.txt', 'cv.pdf']);

const isImage = (file) => /\.(png|jpg|jpeg)$/i.test(file);

async function convertFile(fullPath) {
  const dir = path.dirname(fullPath);
  const base = path.basename(fullPath, path.extname(fullPath));
  const webpPath = path.join(dir, `${base}.webp`);
  if (fs.existsSync(webpPath)) return;
  await sharp(fullPath).webp({ quality: 85 }).toFile(webpPath);
  console.log(`→ created ${path.relative(ROOT, webpPath)}`);
}

async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (!SKIP_NAMES.has(entry.name) && isImage(entry.name)) {
      await convertFile(full);
    }
  }
}

walk(ROOT)
  .then(() => console.log('WebP conversion completed.'))
  .catch((err) => {
    console.error('WebP conversion failed:', err);
    process.exit(1);
  });
