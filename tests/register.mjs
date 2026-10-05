/* Resolve hook for `node --test`: maps the `@/x` alias from tsconfig.json
   onto src/x with the extension the file actually has, so the TypeScript
   modules load under Node's built-in type stripping without a bundler. */
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const srcUrl = new URL("../src/", import.meta.url);
const srcDir = fileURLToPath(srcUrl);
const candidates = [".ts", ".tsx", "/index.ts", "/index.tsx", ""];

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith("@/")) return nextResolve(specifier, context);
    const base = srcDir + specifier.slice(2);
    const suffix = candidates.find((ending) => existsSync(base + ending)) ?? "";
    return nextResolve(pathToFileURL(base + suffix).href, context);
  },
  /* package.json has no "type", so tell Node the src modules are ESM rather
     than letting it guess (and warn) file by file. */
  load(url, context, nextLoad) {
    if (url.startsWith(srcUrl.href) && url.endsWith(".ts")) {
      return nextLoad(url, { ...context, format: "module-typescript" });
    }
    return nextLoad(url, context);
  },
});
