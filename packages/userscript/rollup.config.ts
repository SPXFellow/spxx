import { defineConfig } from 'rollup'
import typescriptPlugin from '@rollup/plugin-typescript'
import babelPluggin from '@rollup/plugin-babel'
import metablock from 'rollup-plugin-userscript-metablock'
import nodeResolve from '@rollup/plugin-node-resolve'
import jsonPlugin from '@rollup/plugin-json'
import * as pkg from './package.json' assert { type: 'json' }

export default defineConfig({
  input: 'src/main.ts',
  output: {
    file: 'dist/bundle.user.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    typescriptPlugin({
      outputToFilesystem: true,
    }),
    babelPluggin({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
    }),
    metablock({
      file: './meta.json',
      override: {
        version: pkg.version
      }
    }),
    nodeResolve(),
    jsonPlugin(),
  ],
})
