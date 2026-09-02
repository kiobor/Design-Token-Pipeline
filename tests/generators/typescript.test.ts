import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { parse } from "../../src/parser";
import { transform } from "../../src/transformer";
import { generateTypeScript } from "../../src/generators/typescript";

const fixture = (name: string) => resolve(__dirname, "..", "fixtures", name);

describe("generateTypeScript", () => {
  it("generates a typed const export", () => {
    const tokens = transform(parse(fixture("basic-tokens.json")));
    const output = generateTypeScript(tokens);

    expect(output).toContain("export const tokens =");
    expect(output).toContain("as const;");
    expect(output).toContain("export type Tokens = typeof tokens;");
  });

  it("reconstructs nested structure from flat tokens", () => {
    const tokens = transform(parse(fixture("basic-tokens.json")));
    const output = generateTypeScript(tokens);

    expect(output).toContain("color: {");
    expect(output).toContain('primary: "#0066ff"');
    expect(output).toContain("spacing: {");
  });

  it("keeps numeric values as numbers", () => {
    const tokens = transform(parse(fixture("full-tokens.json")));
    const output = generateTypeScript(tokens);

    expect(output).toContain("normal: 400,");
    expect(output).toContain("bold: 700,");
    expect(output).toContain("tight: 1.25,");
  });

  it("matches snapshot for full token set", () => {
    const tokens = transform(parse(fixture("full-tokens.json")));
    const output = generateTypeScript(tokens);
    expect(output).toMatchSnapshot();
  });
});
