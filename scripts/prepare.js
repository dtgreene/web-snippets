import fs from 'fs-extra';

import { readJSON } from './utils.js';

const commonManifest = readJSON('src/manifests/manifest.json');

if (!fs.pathExistsSync('dist_modal')) {
  console.log(
    'dist_modal/ directory not found; run "npm run modal:build" first'
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const browserArg = args[0];

// Setup dist directory
if (fs.pathExistsSync('dist')) {
  fs.readdirSync('dist').forEach((file) => {
    fs.rmSync(`dist/${file}`, { recursive: true });
  });
} else {
  fs.mkdirSync('dist');
}

// Check if a browser was given as an argument
if (browserArg) {
  if (!['chrome', 'firefox'].includes(browserArg)) {
    console.log(`Unknown browser: ${browserArg}`);
    process.exit(1);
  } else {
    prepareBrowser(browserArg);
  }
} else {
  prepareBrowser('chrome');
  prepareBrowser('firefox');
}

function prepareBrowser(browserName) {
  // Make the sub-dist directory
  const subDistPath = `dist/${browserName}`;
  fs.mkdirSync(subDistPath);

  const sourceMap = {
    'src/background': `${subDistPath}/background`,
    'src/icons': `${subDistPath}/icons`,
    'src/content/main.js': `${subDistPath}/content/main.js`,
    dist_modal: `${subDistPath}/content/modal`,
  };

  Object.entries(sourceMap).forEach(([src, dest]) => {
    fs.copySync(src, dest, { recursive: true });
  });

  const browserManifest = readJSON(
    `src/manifests/manifest_${browserName}.json`
  );
  fs.writeFileSync(
    `${subDistPath}/manifest.json`,
    JSON.stringify({ ...commonManifest, ...browserManifest }, undefined, 2)
  );
}
