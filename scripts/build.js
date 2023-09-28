import { execSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';

if (existsSync('./vite_dist')) {
  rmSync('./vite_dist', { recursive: true, force: true });
}

console.log('\nBuilding popup...\n');
execSync('npx vite build --config .vite/popup.config.js', {
  stdio: 'inherit',
});

console.log('\nBuilding content script...\n');
execSync('npx vite build --config .vite/content.config.js', {
  stdio: 'inherit',
});
