import fs from 'node:fs';
import path from 'node:path';

const storageDir = process.env.STORAGE_DIR ?? path.resolve('storage');
fs.mkdirSync(storageDir, { recursive: true });

export function saveBuffer(relPath: string, buf: Buffer) {
  const abs = path.join(storageDir, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, buf);
  return abs;
}

export function readFile(relPath: string) {
  return fs.readFileSync(path.join(storageDir, relPath));
}

export function urlFor(relPath: string) {
  const base = process.env.BASE_URL ?? '';
  return `${base}/files/${relPath}`;
}