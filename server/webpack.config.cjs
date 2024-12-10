//@ts-check

/** @typedef {import('webpack').Configuration} WebpackConfig **/

'use strict';

const path = require('path');

/** @type WebpackConfig */
module.exports = {
  mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
  target: 'node', // extensions run in a node context
  node: {
    __dirname: false, // leave the __dirname-behaviour intact
  },
  experiments: {
    outputModule: true,
  },
  resolve: {
    // enforceExtension: true,
    mainFields: ['module', 'main'],
    extensions: ['.ts', '.js'], // support ts-files and js-files
    extensionAlias: {
      '.js': ['.ts', '.js'],
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            // configure TypeScript loader:
            // * enable sources maps for end-to-end source maps
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                sourceMap: true,
              },
            },
          },
        ],
      },
    ],
  },
  externals: {
    vscode: 'commonjs vscode', // ignored because it doesn't exist
  },
  entry: {
    extension: './src/server',
  },
  output: {
    // all output goes into `dist`.
    // packaging depends on that and this must always be like it
    filename: 'server.js',
    path: path.join(__dirname, 'out'),
    libraryTarget: 'module',
  },
  // yes, really source maps
  devtool: 'source-map',
};
