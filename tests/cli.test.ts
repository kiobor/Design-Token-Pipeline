import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { resolve } from "node:path";
import { existsSync, readFileSync, rmSync, mkdirSync } from "node:fs";
import { execaNode } from "execa";

const ROOT = resolve(__dirname, "..");
const CLI = resolve(ROOT, "dist", "cli.js");
const TMP = resolve(__dirname, "tmp-cli-test");
const FIXTURE = resolve(__dirname, "fixtures", "full-tokens.json");

describe("CLI integration", () => {
  beforeAll(async () => {
    await execaNode(resolve(ROOT, "node_modules/.bin/tsup"), {
      cwd: ROOT,
      env: { ...process.env },
    }).catch(() => {
      // tsup might not be directly executable via execaNode, use npx instead
    });
  });

  afterEach(() => {
    if (existsSync(TMP)) rmSync(TMP, { recursive: true, force: true });
  });

  it("builds tokens from CLI args", async () => {
    mkdirSync(TMP, { recursive: true });
    const outDir = resolve(TMP, "output");

    const result = await execaNode(CLI, [
      "build",
      "--input",
      FIXTURE,
      "--outDir",
      outDir,
    ]);

    expect(result.exitCode).toBe(0);
    expect(existsSync(resolve(outDir, "tokens.css"))).toBe(true);
    expect(existsSync(resolve(outDir, "tailwind-theme.css"))).toBe(true);
    expect(existsSync(resolve(outDir, "tokens.ts"))).toBe(true);

    const css = readFileSync(resolve(outDir, "tokens.css"), "utf-8");
    expect(css).toContain("--color-primary: #0066ff;");
  });

  it("builds only specified generators", async () => {
    mkdirSync(TMP, { recursive: true });
    const outDir = resolve(TMP, "output");

    await execaNode(CLI, [
      "build",
      "--input",
      FIXTURE,
      "--outDir",
      outDir,
      "--generators",
      "css",
    ]);

    expect(existsSync(resolve(outDir, "tokens.css"))).toBe(true);
    expect(existsSync(resolve(outDir, "tailwind-theme.css"))).toBe(false);
    expect(existsSync(resolve(outDir, "tokens.ts"))).toBe(false);
  });

  it("exits with code 1 on missing input file", async () => {
    try {
      await execaNode(CLI, [
        "build",
        "--input",
        "./nonexistent.json",
        "--outDir",
        TMP,
      ]);
      expect.unreachable("should have thrown");
    } catch (error: any) {
      expect(error.exitCode).toBe(1);
      expect(error.stderr).toContain("file not found");
    }
  });
});
