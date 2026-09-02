import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { loadConfig } from "../src/config";
import { writeFileSync, unlinkSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const CONFIG_PATH = resolve("tokens.config.json");

describe("loadConfig", () => {
  beforeEach(() => {
    if (existsSync(CONFIG_PATH)) unlinkSync(CONFIG_PATH);
  });

  afterEach(() => {
    if (existsSync(CONFIG_PATH)) unlinkSync(CONFIG_PATH);
  });

  it("uses defaults when no config file exists", () => {
    const config = loadConfig({});
    expect(config.input).toBe(resolve("./tokens.json"));
    expect(config.outDir).toBe(resolve("./generated"));
    expect(config.generators).toEqual(["css", "tailwind", "typescript"]);
  });

  it("reads from tokens.config.json", () => {
    writeFileSync(
      CONFIG_PATH,
      JSON.stringify({ input: "./my-tokens.json", outDir: "./out" }),
    );
    const config = loadConfig({});
    expect(config.input).toBe(resolve("./my-tokens.json"));
    expect(config.outDir).toBe(resolve("./out"));
  });

  it("CLI args override file config", () => {
    writeFileSync(
      CONFIG_PATH,
      JSON.stringify({ input: "./file-tokens.json" }),
    );
    const config = loadConfig({ input: "./cli-tokens.json" });
    expect(config.input).toBe(resolve("./cli-tokens.json"));
  });

  it("parses comma-separated generators from CLI", () => {
    const config = loadConfig({ generators: "css,tailwind" });
    expect(config.generators).toEqual(["css", "tailwind"]);
  });

  it("throws on unknown generator name", () => {
    expect(() => loadConfig({ generators: "css,invalid" })).toThrow(
      'unknown generator "invalid"',
    );
  });
});
