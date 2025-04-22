import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'index.ts',
        'NextLive.tsx',
        'components/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'pages/**/*.{ts,tsx}',
        'services/**/*.{ts,tsx}',
        'utils/**/*.{ts,tsx}',
      ],    // your library entry
  outDir: 'dist',
  format: ['cjs', 'esm'],     // CommonJS + ESModule
  clean: true,                // rm -rf dist/ on build
  dts: true,                  // generate .d.ts files
  external: [
    'react',
    'react-dom',
    '@mui/material',
    '@mui/icons-material',
    '@emotion/react',
    '@emotion/styled',
    // any other peerDependencies…
  ],
  // If you need to alias the styled-engine:
  // esbuildOptions(options) {
  //   options.plugins?.push({
  //     name: 'alias-mui-engine',
  //     setup(build) {
  //       build.onResolve({ filter: /^@mui\/styled-engine$/ }, () => ({
  //         path: require.resolve('@mui/styled-engine-sc'),
  //       }));
  //     },
  //   });
  // },
});
