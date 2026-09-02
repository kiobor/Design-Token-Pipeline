import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { parse } from "../../src/parser";
import { transform } from "../../src/transformer";
import { generateTailwind } from "../../src/generators/tailwind";

const fixture = (name: string) => resolve(__dirname, "..", "fixtures", name);

describe("generateTailwind", () => {
  it("wraps output in @theme directive", () => {
    const tokens = transform(parse(fixture("basic-tokens.json")));
    const output = generateTailwind(tokens);
    expect(output).toContain("@theme {");
  });

  it("maps radii to Tailwind radius namespace", () => {
    const tokens = transform(parse(fixture("full-tokens.json")));
    const output = generateTailwind(tokens);

    expect(output).toContain("--radius-sm: 4px;");
    expect(output).toContain("--radius-full: 9999px;");
    expect(output).not.toContain("--radii-");
  });

  it("maps font.lineHeight to line-height namespace", () => {
    const tokens = transform(parse(fixture("full-tokens.json")));
    const output = generateTailwind(tokens);

    expect(output).toContain("--line-height-tight: 1.25;");
    expect(output).toContain("--line-height-normal: 1.5;");
  });

  it("preserves color and spacing namespaces", () => {
    const tokens = transform(parse(fixture("basic-tokens.json")));
    const output = generateTailwind(tokens);

    expect(output).toContain("--color-primary: #0066ff;");
    expect(output).toContain("--spacing-sm: 8px;");
  });

  it("matches snapshot for full token set", () => {
    const tokens = transform(parse(fixture("full-tokens.json")));
    const output = generateTailwind(tokens);
    expect(output).toMatchSnapshot();
  });
});
