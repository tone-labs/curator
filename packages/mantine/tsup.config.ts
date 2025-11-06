import { defineConfig } from 'tsup';

export default defineConfig(({ watch }) => ({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: {
    entry: 'src/index.ts',
    resolve: true,
  },
  tsconfig: './tsconfig.build.json',
  outDir: 'dist',
  clean: !watch,
  treeshake: true,
  splitting: false,
  sourcemap: false,
  platform: 'browser',
  external: [
    'react',
    'react/jsx-runtime',
    'react-hook-form',
    '@mantine/core',
    '@refinedev/core',
    '@refinedev/ui-types',
  ],
}));
