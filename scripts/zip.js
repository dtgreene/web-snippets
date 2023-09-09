import fs from 'fs-extra';
import archiver from 'archiver';
import { readJSON } from './utils.js';

if (!fs.pathExistsSync('dist')) {
  console.log(
    'dist/ directory not found; run "npm run prepare" first'
  );
  process.exit(1);
}

const manifest = readJSON('src/manifests/manifest.json');

zipExtension('chrome');
zipExtension('firefox');

function zipExtension(name) {
  const output = fs.createWriteStream(`dist/${name}-${manifest.version}.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });
  archive.pipe(output);
  archive.directory(`dist/${name}`, false);
  archive.finalize();
}
