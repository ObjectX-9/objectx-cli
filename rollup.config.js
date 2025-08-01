import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: 'lib',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      entryFileNames: '[name].js'
    }
  ],
  external: [
    'fs', 
    'path', 
    'os', 
    'util', 
    'child_process',
    'commander',
    'chalk',
    'ora',
    '@inquirer/prompts',
    'fs-extra',
    'ejs',
    'fast-glob',
    'execa',
    'semver'
  ],
  plugins: [
    resolve({
      extensions: ['.ts', '.js']
    }),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      outputToFilesystem: true
    }),
    terser()
  ]
}; 