/**
 * Helper functions around path handling.
 * 
 * Common path handling from: http://rosettacode.org/wiki/Find_common_directory_path#JavaScript
 * Since JS does not have a builtin function like Python does.
 */
import * as path from 'path';

// Human friendly description of path for use in commit messages.
const ROOT = 'repo root';

/**
 * Given an array of strings, return an array of arrays, containing the
 * strings split at the given separator
 * 
 * @param {!Array<!string>} a
 * @param {string} sep
 * @returns {!Array<!Array<string>>}
 */
const splitStrings = (a: any[], sep = '/') => a.map((i: string) => i.split(sep));

/**
 * Given an index number, return a function that takes an array and returns the
 * element at the given index
 * 
 * @param {number} i
 * @return {function(!Array<*>): *}
 */
function elAt(i: number) {
  return (a: { [x: string]: any }) => a[i];
}

/**
 * Transpose an array of arrays:
 * 
 * Example:
 *   [['a', 'b', 'c'], ['A', 'B', 'C'], [1, 2, 3]] ->
 *   [['a', 'A', 1], ['b', 'B', 2], ['c', 'C', 3]]
 * 
 * @param {!Array<!Array<*>>} a
 * @return {!Array<!Array<*>>}
 */
function rotate(a: any[]) {
  return a[0].map((e: any, i: any) => a.map(elAt(i)));
}

/**
 * Checks of all the elements in the array are the same.
 * 
 * @param {!Array<*>} arr
 * @return {boolean}
 */
function allElementsEqual(arr: any[]) {
  return arr.every((e: any) => e === arr[0]);
}

/**
 * Common directory for an array of paths.
 * 
 * This can be useful for one file going from source to destination.
 * Or finding the top-most directory that is common to a few files that all changed.
 */
export function commonPath(input: string[], sep = '/') {
  const common = rotate(splitStrings(input, sep)).filter(allElementsEqual).map(elAt(0)).join(sep);

  return common === '' ? ROOT : common;
}

/**
 * Using a known common dir, remove it from a path.
 */
export function removeBase(base: string, filepath: string) {
  return filepath.substring(base.length);
}

interface SplitPathResult {
  isAtRepoRoot: boolean;
  dir: string;
  name: string;
  extension: string
}
/**
 * Metadata about a path.
 *
 * Info is derived based on the input value string whether the path to a file that exists or not.
 */
export function splitPath(filePath: string): SplitPathResult {
  const dir = path.dirname(filePath),
    isAtRepoRoot = dir === '.';

  return {
    atRoot: isAtRepoRoot,
    dir: isAtRepoRoot ? ROOT : dir,
    name: path.basename(filePath),
    extension: path.extname(filePath)
  };
}
