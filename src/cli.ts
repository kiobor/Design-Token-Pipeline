#!/usr/bin/env node
import { Command } from "commander";
import { writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadConfig } from "./config";
import { parse } from "./parser";
import { transform } from "./transformer";
import { runGenerators } from "./generators/index";

const program = new Command()
  .name("design-tokens")
  .description(
    "Generate CSS, Tailwind, and TypeScript from DTCG design tokens",
  )
  .version("0.1.0");

program
  .command("build")
  .description("Build token outputs from config or CLI args")
  .option("-i, --input <path>", "Path to tokens JSON")
  .option("-o, --outDir <path>", "Output directory")
  .option("--generators <list>", "Generators to run (comma-separated)")
  .action(async (opts) => {
    try {
      const config = loadConfig(opts);
      console.log("Building design tokens...\n");
      const raw = parse(config.input);
      const tokens = transform(raw);
      await runGenerators(tokens, config);
      console.log(`\nDone! ${tokens.length} tokens processed.`);
    } catch (error) {
      console.error(
        `\n${error instanceof Error ? error.message : String(error)}`,
      );
      process.exit(1);
    }
  });

program
  .command("init")
  .description("Create a starter tokens.config.json")
  .action(() => {
    const configPath = resolve("tokens.config.json");
    if (existsSync(configPath)) {
      console.error("tokens.config.json already exists");
      process.exit(1);
    }

    const starter = {
      input: "./tokens.json",
      outDir: "./generated",
      generators: ["css", "tailwind", "typescript"],
    };

    writeFileSync(configPath, JSON.stringify(starter, null, 2) + "\n", "utf-8");
    console.log("Created tokens.config.json");
  });

program.parse();
