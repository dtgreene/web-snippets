import { existsSync, createWriteStream } from 'node:fs';
import archiver from 'archiver';

import { readJSON } from './fileUtils.js';

if (!existsSync('dist')) {
  console.log('dist/ directory not found; run "npm run prepare:all" first');
  process.exit(1);
}

const manifest = readJSON('src/manifests/manifest.json');

zipExtension('chrome');
zipExtension('firefox');

function zipExtension(name) {
  const output = createWriteStream(`dist/${name}-${manifest.version}.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });
  archive.pipe(output);
  archive.directory(`dist/${name}`, false);
  archive.finalize();
}
