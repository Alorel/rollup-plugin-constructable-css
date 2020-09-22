import {createFilter, FilterPattern} from '@rollup/pluginutils';
import {Plugin, SourceDescription} from 'rollup';
import {transformWithMap} from './lib/transformWithMap';
import {transformWithoutMap} from './lib/transformWithoutMap';

interface Opts {
  exclude?: FilterPattern;

  include: FilterPattern;

  /** @default false */
  preferConst?: boolean;

  /** @default true */
  sourceMap?: boolean;
}

type TransformFn = (varType: string, code: string) => SourceDescription;

function constructableCssRollupPlugin(opts: Opts): Plugin {
  const {
    exclude,
    include,
    preferConst = false,
    sourceMap = true
  } = (opts || {});

  if (!include) {
    throw new Error('include option missing');
  }

  const filter = createFilter(include, exclude);
  const varType = preferConst ? 'const' : 'var';
  const transformFn: TransformFn = sourceMap ? transformWithMap : transformWithoutMap;

  return {
    name: 'rollup-plugin-constructable-css',
    transform(code, id) {
      return filter(id) ? transformFn(varType, code) : null;
    }
  };
}

export {
  constructableCssRollupPlugin,
  Opts as ConstructableCssRollupPluginOpts
};
