import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';

import { readJSON, createDirectory, copyFile } from './fileUtils.js';

const knownBrowsers = ['chrome', 'firefox'];
const commonManifest = readJSON('manifests/manifest.json');

if (!existsSync('vite_dist')) {
  console.log('vite_dist/ directory not found; run "npm run build" first');
  process.exit(1);
}

const viteDist = readdirSync('vite_dist', { recursive: true });
const args = process.argv.slice(2);
const browserArg = args[0];

// Setup dist directory
createDirectory('dist');

// Check if a browser was given as an argument
if (browserArg) {
  if (!knownBrowsers.includes(browserArg)) {
    console.log(`Unknown browser: ${browserArg}`);
    process.exit(1);
  } else {
    copyBrowser(browserArg);
  }
} else {
  knownBrowsers.forEach((browser) => copyBrowser(browser));
}

function copyBrowser(browserName) {
  const browserPath = `dist/${browserName}`;
  const fileMap = {
    'icons/48.png': `${browserPath}/icons/48.png`,
    'icons/96.png': `${browserPath}/icons/96.png`,
    'vite_dist/content/index.js': `${browserPath}/content/index.js`,
    'vite_dist/index.html': `${browserPath}/popup/index.html`,
  };

  // The asset file names contain hashes that can change with each build
  viteDist.forEach((file) => {
    if (file.includes('assets/')) {
      fileMap[`vite_dist/${file}`] = `${browserPath}/popup/${file}`;
    }
  });

  // Copy each file
  Object.entries(fileMap).forEach(([src, dest]) => {
    copyFile(src, dest);
  });

  const manifestSource = `manifests/manifest_${browserName}.json`;
  const manifestDest = `${browserPath}/manifest.json`;
  copyManifest(manifestSource, manifestDest);

  // Clean up any files that were not just written
  const existingDest = readdirSync(browserPath, { recursive: true });
  const validFiles = Object.values(fileMap).concat(manifestDest);

  existingDest.forEach((file) => {
    const filePath = `${browserPath}/${file}`;
    if (!statSync(filePath).isDirectory() && !validFiles.includes(filePath)) {
      rmSync(filePath);
    }
  });
}

function copyManifest(src, dest) {
  const sourceManifest = readJSON(src);
  const manifest = JSON.stringify(
    { ...commonManifest, ...sourceManifest },
    undefined,
    2
  );

  if (existsSync(dest)) {
    const existingManifest = readFileSync(dest, 'utf-8');

    if (existingManifest !== manifest) {
      rmSync(dest);
      writeFileSync(dest, manifest);
    }
  } else {
    writeFileSync(dest, manifest);
  }
}
