import type { FlatToken, RawTokenGroup, RawTokenNode } from "./types";
import { isToken } from "./types";

function toKebabCase(segments: string[]): string {
  return segments.join("-");
}

function walk(
  node: RawTokenNode,
  path: string[],
  result: FlatToken[],
): void {
  if (isToken(node)) {
    result.push({
      path,
      name: toKebabCase(path),
      value: node.$value,
      type: node.$type,
      description: node.$description,
    });
    return;
  }

  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    walk(child, [...path, key], result);
  }
}

export function transform(tree: RawTokenGroup): FlatToken[] {
  const result: FlatToken[] = [];
  walk(tree, [], result);
  return result;
}
