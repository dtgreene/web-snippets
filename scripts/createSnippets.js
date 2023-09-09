import fs from 'fs-extra';
import { readJSON } from './utils.js';

const snippetsPath = 'src/snippets';
const results = {};

fs.readdirSync(snippetsPath).forEach((snippet) => {
  try {
    const indexPath = `${snippetsPath}/${snippet}/index.js`;
    const metaPath = `${snippetsPath}/${snippet}/meta.json`;

    const meta = readJSON(metaPath);
    const js = fs.readFileSync(indexPath, 'utf-8');

    results[snippet] = { ...meta, js };
  } catch {
    console.warn(`Could not load snippet: ${snippet}`);
  }
});

fs.writeFileSync('snippets.json', JSON.stringify(results, undefined, 2));
