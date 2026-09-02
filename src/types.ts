export type TokenType =
  | "color"
  | "dimension"
  | "fontFamily"
  | "fontWeight"
  | "number";

export interface RawToken {
  $value: string | number;
  $type: TokenType;
  $description?: string;
}

export interface RawTokenGroup {
  [key: string]: RawTokenNode;
}

export type RawTokenNode = RawToken | RawTokenGroup;

export function isToken(node: RawTokenNode): node is RawToken {
  return (
    typeof node === "object" &&
    node !== null &&
    "$value" in node &&
    "$type" in node
  );
}

export interface FlatToken {
  path: string[];
  name: string;
  value: string | number;
  type: TokenType;
  description?: string;
}

export type GeneratorName = "css" | "tailwind" | "typescript";

export interface Config {
  input: string;
  outDir: string;
  generators: GeneratorName[];
}

export type GeneratorFn = (tokens: FlatToken[]) => string;
