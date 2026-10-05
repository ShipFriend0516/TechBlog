import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// Keep the generated original intact; normalize transparent padding for UI use.
const source = 'public/images/logo-lab/contour-generated.png';
const trimmed = await sharp(source).trim({ threshold: 10 }).toBuffer();
const logo = await sharp(trimmed)
  .resize(928, 928, { fit: 'contain', background: '#00000000' })
  .extend({ top: 48, bottom: 48, left: 48, right: 48, background: '#00000000' })
  .png()
  .toBuffer();
await writeFile('public/images/logo/contour.png', logo);

for (const [name, size] of [
  ['favicon-16x16.png', 16],
  ['favicon-32x32.png', 32],
  ['apple-touch-icon.png', 180],
  ['android-chrome-192x192.png', 192],
  ['android-chrome-512x512.png', 512],
]) {
  await sharp(logo).resize(size, size).png().toFile(`public/assets/${name}`);
}

// ICO supports embedded PNG frames. Include native sizes for browser tabs.
const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map((size) => sharp(logo).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + frames.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
frames.forEach((frame, index) => {
  const entry = 6 + index * 16;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(frame.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
const ico = Buffer.concat([header, ...frames]);
await Promise.all(['app/favicon.ico', 'public/assets/favicon.ico'].map((path) => writeFile(path, ico)));
