import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { parse } from "../src/parser";

const fixture = (name: string) => resolve(__dirname, "fixtures", name);

describe("parse", () => {
  it("parses a valid DTCG token file", () => {
    const result = parse(fixture("basic-tokens.json"));
    expect(result.color).toBeDefined();
    expect((result.color as any).primary.$value).toBe("#0066ff");
    expect((result.color as any).primary.$type).toBe("color");
    expect((result.color as any).primary.$description).toBe(
      "Primary brand color",
    );
  });

  it("parses all token types from full fixture", () => {
    const result = parse(fixture("full-tokens.json"));
    expect(result.color).toBeDefined();
    expect(result.spacing).toBeDefined();
    expect(result.font).toBeDefined();
    expect(result.radii).toBeDefined();
  });

  it("throws TokenParseError for token missing $type", () => {
    expect(() => parse(fixture("invalid-tokens.json"))).toThrow(
      'Parse error',
    );
    expect(() => parse(fixture("invalid-tokens.json"))).toThrow(
      'missing $type',
    );
  });

  it("throws TokenParseError for non-existent file", () => {
    expect(() => parse(fixture("does-not-exist.json"))).toThrow(
      "file not found",
    );
  });

  it("returns an empty group for empty object", () => {
    const tmpPath = resolve(__dirname, "fixtures", "empty.json");
    const { writeFileSync, unlinkSync } = require("node:fs");
    writeFileSync(tmpPath, "{}");
    try {
      const result = parse(tmpPath);
      expect(result).toEqual({});
    } finally {
      unlinkSync(tmpPath);
    }
  });
});
