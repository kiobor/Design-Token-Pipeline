import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ConfigError } from "./errors";
import type { Config, GeneratorName } from "./types";

const DEFAULTS: Config = {
  input: "./tokens.json",
  outDir: "./generated",
  generators: ["css", "tailwind", "typescript"],
};

const VALID_GENERATORS = new Set<string>(["css", "tailwind", "typescript"]);

export interface CliOpts {
  input?: string;
  outDir?: string;
  generators?: string;
}

export function loadConfig(cliOpts: CliOpts): Config {
  const configPath = resolve("tokens.config.json");
  let fileConfig: Partial<Config> = {};

  if (existsSync(configPath)) {
    let raw: unknown;
    try {
      raw = JSON.parse(readFileSync(configPath, "utf-8"));
    } catch {
      throw new ConfigError("tokens.config.json contains invalid JSON");
    }

    if (typeof raw !== "object" || raw === null) {
      throw new ConfigError("tokens.config.json must be an object");
    }

    fileConfig = raw as Partial<Config>;
  }

  const generators = cliOpts.generators
    ? cliOpts.generators.split(",").map((s) => s.trim())
    : undefined;

  const resolved: Config = {
    input: resolve(cliOpts.input ?? fileConfig.input ?? DEFAULTS.input),
    outDir: resolve(cliOpts.outDir ?? fileConfig.outDir ?? DEFAULTS.outDir),
    generators: (generators ??
      fileConfig.generators ??
      DEFAULTS.generators) as GeneratorName[],
  };

  for (const gen of resolved.generators) {
    if (!VALID_GENERATORS.has(gen)) {
      throw new ConfigError(`unknown generator "${gen}"`);
    }
  }

  return resolved;
}
