import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const roots = [".next/server/app", ".next/static"];
const forbidden = [
  "/Users/",
  "vero-scans",
  "keypads.webp",
  "192.168.",
  "10.0.",
  "172.16.",
  ":3060",
];

async function filesUnder(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(target));
    if (entry.isFile()) files.push(target);
  }
  return files;
}

const files = (await Promise.all(roots.map(filesUnder))).flat();
const findings = [];

for (const file of files) {
  const details = await stat(file);
  if (details.size > 5_000_000) continue;
  const content = await readFile(file, "utf8");
  for (const token of forbidden) {
    if (content.includes(token)) findings.push(`${file}: contains ${token}`);
  }
}

if (findings.length) {
  console.error(`[ERROR] public-output privacy gate failed:\n- ${findings.join("\n- ")}`);
  process.exit(1);
}

console.log(`[OK] scanned ${files.length} production files for ${forbidden.length} forbidden tokens`);
