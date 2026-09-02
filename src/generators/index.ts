import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Config, FlatToken, GeneratorFn, GeneratorName } from "../types";
import { generateCSS } from "./css";
import { generateTailwind } from "./tailwind";
import { generateTypeScript } from "./typescript";

const GENERATORS: Record<GeneratorName, { fn: GeneratorFn; filename: string }> =
  {
    css: { fn: generateCSS, filename: "tokens.css" },
    tailwind: { fn: generateTailwind, filename: "tailwind-theme.css" },
    typescript: { fn: generateTypeScript, filename: "tokens.ts" },
  };

export async function runGenerators(
  tokens: FlatToken[],
  config: Config,
): Promise<void> {
  mkdirSync(config.outDir, { recursive: true });

  for (const name of config.generators) {
    const generator = GENERATORS[name];
    const content = generator.fn(tokens);
    const outPath = join(config.outDir, generator.filename);
    writeFileSync(outPath, content, "utf-8");
    console.log(`  ✓ ${outPath}`);
  }
}
