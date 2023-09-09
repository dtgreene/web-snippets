import fs from 'fs-extra';

export function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath).toString());
}
