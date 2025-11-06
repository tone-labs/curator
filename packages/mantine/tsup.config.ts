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
  noExternal: ['react-markdown'],
  external: [
    'react',
    'react/jsx-runtime',
    'react-hook-form',
    '@mantine/core',
    '@mantine/dates',
    '@mantine/hooks',
    '@mantine/modals',
    '@refinedev/core',
    '@refinedev/ui-types',
    'dayjs',
  ],
}));
