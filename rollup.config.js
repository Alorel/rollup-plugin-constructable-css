import {join} from 'path';
import {cleanPlugin} from '@alorel/rollup-plugin-clean';
import {copyPkgJsonPlugin} from '@alorel/rollup-plugin-copy-pkg-json';
import {copyPlugin} from '@alorel/rollup-plugin-copy';
import nodeResolve from '@rollup/plugin-node-resolve';
import {dtsPlugin} from '@alorel/rollup-plugin-dts';
import * as pkgJson from './package.json';
import typescript from 'rollup-plugin-typescript2';
import {builtinModules} from 'module';
import commonjs from '@rollup/plugin-commonjs';

const distDir = join(__dirname, 'dist');
const srcDir = join(__dirname, 'src');
const extensions = ['.js', '.ts'];

const baseOutput = {
  assetFileNames: '[name][extname]',
  dir: distDir,
  entryFileNames: '[name].[format].js',
  sourcemap: false
};

export default function({watch}) { // eslint-disable-line max-lines-per-function,@typescript-eslint/explicit-module-boundary-types
  return {
    external: Array.from(
      new Set(
        Object.keys(pkgJson.dependencies || {})
          .concat(Object.keys(pkgJson.peerDependencies || {}))
          .filter(p => !p.startsWith('@types/'))
          .concat(builtinModules)
      )
    ),
    input: join(srcDir, 'index.ts'),
    output: [
      {
        ...baseOutput,
        format: 'es'
      },
      {
        ...baseOutput,
        format: 'cjs',
        plugins: [
          copyPkgJsonPlugin({
            unsetPaths: ['devDependencies', 'scripts']
          }),
          ...(watch ? [] : [dtsPlugin({cliArgs: ['--rootDir', 'src']})])
        ]
      }
    ],
    plugins: [
      cleanPlugin({dir: distDir}),
      nodeResolve({
        extensions,
        mainFields: [
          'fesm5',
          'esm5',
          'module',
          'browser',
          'main'
        ]
      }),
      commonjs({
        extensions,
        include: /node_modules[\\/]picomatch/,
        sourceMap: false
      }),
      typescript(),
      copyPlugin({
        copy: ['LICENSE', 'CHANGELOG.md', 'README.md'],
        defaultOpts: {
          emitNameKind: 'fileName',
          glob: {
            cwd: __dirname
          }
        }
      })
    ],
    preserveModules: false,
    watch: {
      exclude: 'node_modules/*'
    }
  };
}
