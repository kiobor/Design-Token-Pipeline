# design-token-pipeline

CLI tool that transforms [W3C Design Tokens (DTCG)](https://design-tokens.github.io/community-group/format/) into CSS variables, Tailwind v4 theme config, and TypeScript types.

## Install

```bash
npm install -g design-token-pipeline
```

Or use it locally in a project:

```bash
npm install -D design-token-pipeline
```

## Quick Start

```bash
# Create a starter config
design-tokens init

# Place your tokens in tokens.json, then build
design-tokens build
```

## Usage

### `design-tokens build`

Reads design tokens and generates output files.

```bash
# Use tokens.config.json (default)
design-tokens build

# Override with CLI flags
design-tokens build --input ./my-tokens.json --outDir ./src/styles

# Generate only specific formats
design-tokens build --generators css,tailwind
```

**Options:**

| Flag | Description | Default |
|------|-------------|---------|
| `-i, --input <path>` | Path to tokens JSON file | `./tokens.json` |
| `-o, --outDir <path>` | Output directory | `./generated` |
| `--generators <list>` | Comma-separated generators | `css,tailwind,typescript` |

### `design-tokens init`

Creates a starter `tokens.config.json` in the current directory.

## Configuration

Create a `tokens.config.json` in your project root:

```json
{
  "input": "./tokens.json",
  "outDir": "./generated",
  "generators": ["css", "tailwind", "typescript"]
}
```

CLI flags override config file values.

## Input Format

Accepts the [W3C Design Tokens Community Group (DTCG)](https://design-tokens.github.io/community-group/format/) format:

```json
{
  "color": {
    "primary": {
      "$value": "#0066ff",
      "$type": "color",
      "$description": "Primary brand color"
    }
  },
  "spacing": {
    "sm": {
      "$value": "8px",
      "$type": "dimension"
    }
  }
}
```

### Supported Token Types

| Type | Example | Output |
|------|---------|--------|
| `color` | `"#0066ff"` | CSS color value |
| `dimension` | `"16px"` | Spacing, sizing, radii, font sizes |
| `fontFamily` | `"Inter, sans-serif"` | Font stack |
| `fontWeight` | `400` | Numeric weight |
| `number` | `1.5` | Line heights, ratios |

## Output

### CSS Custom Properties (`tokens.css`)

```css
:root {
  /* color */
  --color-primary: #0066ff;

  /* spacing */
  --spacing-sm: 8px;
}
```

### Tailwind v4 Theme (`tailwind-theme.css`)

```css
@theme {
  --color-primary: #0066ff;
  --spacing-sm: 8px;
  --radius-sm: 4px;
  --line-height-tight: 1.25;
}
```

Import it in your Tailwind CSS:

```css
@import "./generated/tailwind-theme.css";
@import "tailwindcss";
```

### TypeScript Types (`tokens.ts`)

```typescript
export const tokens = {
  color: {
    primary: "#0066ff",
  },
  spacing: {
    sm: "8px",
  },
} as const;

export type Tokens = typeof tokens;
```

## Programmatic API

```typescript
import { parse, transform, generateCSS } from "design-token-pipeline";

const tree = parse("./tokens.json");
const tokens = transform(tree);
const css = generateCSS(tokens);
```

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT
