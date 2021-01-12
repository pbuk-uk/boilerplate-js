// rollup.config.js

import camelCase from 'camelcase';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

// Entry file(s) for build.
const input = ['src/index.js'];

// Browserslist target for Browser and ES module build.
const targets = '>0.25%, not dead, not IE 11';

// Minimum node.js version for CommonJS build.
const node = '10';

// External CommonJS modules.
const external = [];

const datetime = new Date().toISOString().substring(0, 19).replace('T', ' ');
const year = datetime.substring(0, 4);

// Banner.
const banner = `/*! ${pkg.name} v${pkg.version} ${datetime}
 *  ${pkg.homepage}
 *  Copyright ${year} ${pkg.author} ${pkg.license} license.
 */
`;

export default [
  // browser-friendly UMD build
  {
    input,
    output: [
      {
        banner,
        name: camelCase(pkg.name, { pascalCase: true }),
        file: pkg.browser,
        format: 'iife',
        esModule: false,
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(), // so Rollup can find CommonJS modules.
      commonjs(), // so Rollup can convert CommonJS to ES modules.
      babel({
        babelHelpers: 'bundled',
        presets: [['@babel/preset-env', { targets }]],
        exclude: 'node_modules/**',
      }),
      json(),
      terser(),
    ],
  },

  // ES module (for bundlers) build.
  {
    input,
    external,
    output: [
      {
        banner,
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(), // so Rollup can find CommonJS modules.
      commonjs(), // so Rollup can convert CommonJS to ES modules.
      babel({
        babelHelpers: 'bundled',
        presets: [['@babel/preset-env', { targets }]],
        exclude: 'node_modules/**',
      }),
      json(),
    ],
  },

  // CommonJS (for Node) build.
  {
    input,
    external,
    output: [
      {
        banner,
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        esModule: false,
      },
    ],
    plugins: [
      resolve(), // so Rollup can find CommonJS modules.
      commonjs(), // so Rollup can convert CommonJS to ES modules.
      babel({
        babelHelpers: 'bundled',
        presets: [['@babel/preset-env', { targets: { node } }]],
        exclude: 'node_modules/**',
      }),
      json(),
    ],
  },
];