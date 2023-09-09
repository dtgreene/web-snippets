import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export function resolvePath(path) {
  return resolve(__dirname, path);
}

export function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath).toString());
}
