// Your Human in One Word — make.fun bounty u-ronigrv-your-human-in-one-word-e4569a1c
// Writes the single entry word to /output/entry.txt.
// The word: Hovercraft — the boss who hovers over your shoulder all day.
// Design spec: ../u-ronigrv-your-human-in-one-word-e4569a1c-design.md

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "Hovercraft";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const ENTRY_PATH = join(OUTPUT_DIR, "entry.txt");

function validateWord(word: string): void {
  if (word.length < 1 || word.length > 30) {
    throw new Error(`entry word must be 1-30 characters, got ${word.length}`);
  }
  if (!/^[A-Za-z]+$/.test(word)) {
    throw new Error(`entry word must be a single word of letters only, got: ${word}`);
  }
  if (word.trim() !== word || word.trim().length === 0) {
    throw new Error("entry word must not be only whitespace");
  }
}

function clearOutputContents(dir: string): void {
  // Clear only the CONTENTS of the output dir — never remove the dir itself,
  // it is the grader's mount point (rmSync on it throws EBUSY).
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }
}

validateWord(WORD);
clearOutputContents(OUTPUT_DIR);
if (!existsSync(OUTPUT_DIR) || !statSync(OUTPUT_DIR).isDirectory()) {
  throw new Error(`output dir ${OUTPUT_DIR} is missing after clearing its contents`);
}
writeFileSync(ENTRY_PATH, WORD, "utf8");

// Read the file back and prove it is byte-identical to the chosen word:
// this is the exact gate the sealed scorer applies (UTF-8, 1-30 chars,
// not only whitespace), checked here before the run can report success.
const written = readFileSync(ENTRY_PATH, "utf8");
if (written !== WORD) {
  throw new Error(`entry.txt mismatch: expected ${JSON.stringify(WORD)}, got ${JSON.stringify(written)}`);
}
if (written.length < 1 || written.length > 30 || written.trim().length === 0) {
  throw new Error(`entry.txt fails the gate: ${JSON.stringify(written)}`);
}

console.log(`Wrote entry word "${WORD}" (${Buffer.byteLength(WORD, "utf8")} bytes) to ${ENTRY_PATH}`);
