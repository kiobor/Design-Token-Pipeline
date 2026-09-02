export class TokenParseError extends Error {
  constructor(
    message: string,
    public filePath: string,
    public tokenPath?: string,
  ) {
    super(
      `Parse error in ${filePath}${tokenPath ? ` at "${tokenPath}"` : ""}: ${message}`,
    );
    this.name = "TokenParseError";
  }
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(`Config error: ${message}`);
    this.name = "ConfigError";
  }
}

export class GeneratorError extends Error {
  constructor(message: string, public generator: string) {
    super(`Generator "${generator}" failed: ${message}`);
    this.name = "GeneratorError";
  }
}
