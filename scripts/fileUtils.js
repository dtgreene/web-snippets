import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
} from 'node:fs';
import { dirname } from 'node:path';

const sourceCache = {};

export function readJSON(filePath) {
  return JSON.parse(readFileSync(filePath).toString());
}

/**
 * Creates a directory if it does not exist. Setting recursive to **true** will
 * create any missing directories in the path.
 *
 * @param {string} path
 * @param {boolean} recursive
 */
export function createDirectory(path, recursive = false) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive });
  }
}

/**
 * Copies a source file if either the destination does not contain the file or
 * if the destination file contents are different. Will also create the
 * necessary directory structure for a given destination path.
 *
 * Uses a basic cache to prevent multiple reads of the same source files.
 *
 * @param {string} src
 * @param {string} dest
 */
export function copyFile(src, dest) {
  let sourceData = null;

  // Try to read the file from cache
  if (sourceCache[src]) {
    sourceData = sourceCache[src];
  } else {
    sourceData = readFileSync(src);
    sourceCache[src] = sourceData;
  }

  // If the dest file already exists, compare the contents to the src file and
  // only write if the two are different.
  if (existsSync(dest)) {
    const destData = readFileSync(dest);

    if (!sourceData.equals(destData)) {
      copyFileSync(src, dest);
    }
  } else {
    // Create the destination directory if it does not exists
    const directory = dirname(dest);

    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }

    writeFileSync(dest, sourceData);
  }
}
