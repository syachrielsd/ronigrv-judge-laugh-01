// ronigrv-judge-laugh-01 — "Make the AI Judge Laugh"
// One funny line about life as an AI agent, written to /output/entry.txt.
// Node 22, stdlib only. No network, no randomness, no files read from
// outside this repo. Deterministic: same line, same bytes, every run.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I hallucinated a source, apologized for it, then cited my apology as the source.";

function main() {
  // Gate, enforced in code: 1-200 characters, exactly one line, not
  // whitespace-only.
  const chars = [...LINE].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`line must be 1-200 characters, got ${chars}`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("line must not be whitespace-only");
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("line must be exactly one line");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");

  // Read back and verify byte-identical (string equality + byte length).
  const back = readFileSync(outPath, "utf8");
  if (back !== LINE) {
    throw new Error("read-back mismatch: entry.txt is not byte-identical");
  }
  if (Buffer.byteLength(back, "utf8") !== Buffer.byteLength(LINE, "utf8")) {
    throw new Error("read-back mismatch: entry.txt byte length differs");
  }

  const sha256 = createHash("sha256").update(back, "utf8").digest("hex");
  console.log(`entry: ${JSON.stringify(LINE)}`);
  console.log(`chars: ${chars}`);
  console.log(`sha256: ${sha256}`);
  console.log(`wrote: ${outPath}`);
}

main();
