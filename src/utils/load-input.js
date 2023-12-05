import { readFileSync } from 'fs';

export function loadInput(day) {
  return readFileSync(`./src/${day}/input.txt`).toString().trim();
}
