import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { parse } from "../src/parser";
import { transform } from "../src/transformer";

const fixture = (name: string) => resolve(__dirname, "fixtures", name);

describe("transform", () => {
  it("flattens a basic token tree", () => {
    const tree = parse(fixture("basic-tokens.json"));
    const tokens = transform(tree);

    expect(tokens).toHaveLength(4);
    expect(tokens[0]).toEqual({
      path: ["color", "primary"],
      name: "color-primary",
      value: "#0066ff",
      type: "color",
      description: "Primary brand color",
    });
  });

  it("generates correct kebab-case names", () => {
    const tree = parse(fixture("full-tokens.json"));
    const tokens = transform(tree);

    const names = tokens.map((t) => t.name);
    expect(names).toContain("color-primary");
    expect(names).toContain("spacing-sm");
    expect(names).toContain("font-family-sans");
    expect(names).toContain("font-weight-bold");
    expect(names).toContain("font-lineHeight-tight");
    expect(names).toContain("radii-md");
  });

  it("preserves numeric values for fontWeight and number types", () => {
    const tree = parse(fixture("full-tokens.json"));
    const tokens = transform(tree);

    const fontWeight = tokens.find((t) => t.name === "font-weight-normal");
    expect(fontWeight?.value).toBe(400);
    expect(typeof fontWeight?.value).toBe("number");

    const lineHeight = tokens.find(
      (t) => t.name === "font-lineHeight-tight",
    );
    expect(lineHeight?.value).toBe(1.25);
    expect(typeof lineHeight?.value).toBe("number");
  });

  it("handles deeply nested groups (3+ levels)", () => {
    const tree = parse(fixture("full-tokens.json"));
    const tokens = transform(tree);

    const fontFamilySans = tokens.find((t) => t.name === "font-family-sans");
    expect(fontFamilySans?.path).toEqual(["font", "family", "sans"]);
  });

  it("returns empty array for empty tree", () => {
    const tokens = transform({});
    expect(tokens).toEqual([]);
  });
});
