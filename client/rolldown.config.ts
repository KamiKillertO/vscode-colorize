import { defineConfig } from 'rolldown';

const production = process.env.NODE_ENV === 'production';

export default defineConfig({
  input: 'src/extension.ts',
  platform: 'node',
  external: ['vscode'],
  //   resolve: {
  //     tsconfigFilename: ''
  //   },
  output: {
    file: 'out/extension.js',
    format: 'cjs',
    minify: production,
    sourcemap: !production,
  },
});
