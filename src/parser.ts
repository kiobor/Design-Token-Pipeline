import { readFileSync } from "node:fs";
import { TokenParseError } from "./errors";
import type { RawTokenGroup, RawTokenNode, TokenType } from "./types";

const VALID_TYPES: Set<string> = new Set([
  "color",
  "dimension",
  "fontFamily",
  "fontWeight",
  "number",
]);

function validateNode(
  node: Record<string, unknown>,
  filePath: string,
  currentPath: string,
): void {
  const hasValue = "$value" in node;
  const hasType = "$type" in node;

  if (hasValue && !hasType) {
    throw new TokenParseError("missing $type", filePath, currentPath);
  }

  if (hasType && !hasValue) {
    throw new TokenParseError("missing $value", filePath, currentPath);
  }

  if (hasValue && hasType) {
    if (!VALID_TYPES.has(node.$type as string)) {
      throw new TokenParseError(
        `unknown $type "${node.$type}"`,
        filePath,
        currentPath,
      );
    }
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    if (typeof value !== "object" || value === null) {
      throw new TokenParseError(
        `unexpected value for "${key}"`,
        filePath,
        currentPath,
      );
    }
    validateNode(
      value as Record<string, unknown>,
      filePath,
      currentPath ? `${currentPath}.${key}` : key,
    );
  }
}

export function parse(filePath: string): RawTokenGroup {
  let content: string;
  try {
    content = readFileSync(filePath, "utf-8");
  } catch {
    throw new TokenParseError("file not found", filePath);
  }

  let json: unknown;
  try {
    json = JSON.parse(content);
  } catch {
    throw new TokenParseError("invalid JSON", filePath);
  }

  if (typeof json !== "object" || json === null || Array.isArray(json)) {
    throw new TokenParseError("root must be an object", filePath);
  }

  validateNode(json as Record<string, unknown>, filePath, "");

  return json as RawTokenGroup;
}
