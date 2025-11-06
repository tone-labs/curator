# Curator

React admin UI components for building data-rich applications.

## Packages

- **[@curatordev/mantine](./packages/mantine)** - Admin UI components for Mantine v8 + Refine.js

## Installation

```bash
pnpm add @curatordev/mantine
```

## About

Curator is a family of React component libraries designed to work seamlessly with [Refine.js](https://refine.dev) and modern UI frameworks. Currently supporting Mantine v8, with plans to expand to other UI libraries in the future.

### Companion Library

Curator pairs perfectly with [dewey](https://github.com/tone-labs/dewey), our Go library for building pagination, sorting, and filtering into REST APIs.

## Development

This is a pnpm workspace monorepo.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run typechecking
pnpm typecheck

# Clean build artifacts
pnpm clean
```

## License

MIT License - see [LICENSE](./LICENSE) for details.
